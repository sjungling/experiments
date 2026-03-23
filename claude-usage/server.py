#!/usr/bin/env python3
"""Claude Usage Dashboard Server.

FastAPI server that ingests Claude Code session JSONL files into SQLite,
serves a Chart.js dashboard, and pushes data over WebSocket.

Usage:
    python server.py [--port 8420] [--scan-interval 300] [--hours 24]
"""

import argparse
import asyncio
import importlib.util
import json
import logging
import sqlite3
from collections import defaultdict
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from pathlib import Path

import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse

# ---------------------------------------------------------------------------
# Import parse-sessions.py (hyphenated filename requires importlib)
# ---------------------------------------------------------------------------
_mod_path = Path(__file__).parent / "parse-sessions.py"
_spec = importlib.util.spec_from_file_location("parse_sessions", _mod_path)
parse_sessions = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(parse_sessions)

# ---------------------------------------------------------------------------
# Configuration (set from CLI args before server starts)
# ---------------------------------------------------------------------------
CONFIG = {"hours": 24, "scan_interval": 300}

# ---------------------------------------------------------------------------
# Database layer
# ---------------------------------------------------------------------------
DB_PATH = Path(__file__).parent / "usage.db"


def get_db() -> sqlite3.Connection:
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    return conn


def init_db():
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS sessions (
            file_path TEXT PRIMARY KEY,
            project_name TEXT NOT NULL,
            git_branch TEXT,
            start_time TEXT NOT NULL,
            end_time TEXT NOT NULL,
            is_subagent BOOLEAN DEFAULT FALSE,
            tool_calls JSON NOT NULL,
            model_usage JSON NOT NULL,
            turn_types JSON NOT NULL,
            skill_usage JSON NOT NULL DEFAULT '{}',
            agent_usage JSON NOT NULL DEFAULT '{}',
            bash_usage JSON NOT NULL DEFAULT '{}',
            ingested_at TEXT NOT NULL
        )
    """)
    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_sessions_start_time ON sessions(start_time)"
    )
    conn.commit()
    conn.close()


# ---------------------------------------------------------------------------
# Ingest pipeline
# ---------------------------------------------------------------------------


def upsert_session(conn: sqlite3.Connection, session: dict):
    """Transform parsed session data and upsert into DB."""
    # Build tool_calls: {tool_name: {model: count}}
    tool_calls: dict[str, dict[str, int]] = defaultdict(lambda: defaultdict(int))
    # Build skill_usage: {skill_name: {model: count}}
    skill_usage: dict[str, dict[str, int]] = defaultdict(lambda: defaultdict(int))
    # Build agent_usage: {agent_type: {model: count}}
    agent_usage: dict[str, dict[str, int]] = defaultdict(lambda: defaultdict(int))
    # Build bash_usage: {command_label: count}
    # For commands with subcommands (git, docker, gh, npm, etc.), use "git commit", "git add", etc.
    # For simple commands (grep, find, ls, etc.), just use the binary name.
    SUBCOMMAND_BINARIES = {
        "git", "docker", "gh", "npm", "npx", "pnpm", "yarn", "cargo",
        "kubectl", "terraform", "uv", "pip", "pip3", "swift", "xcodebuild",
    }
    bash_usage: dict[str, int] = defaultdict(int)

    for tc in session["tool_calls"]:
        tool_calls[tc["name"]][tc["model"]] += 1

        if tc["name"] == "Skill":
            skill_name = tc.get("skill_name", "unknown")
            skill_usage[skill_name][tc["model"]] += 1
        elif tc["name"] == "Agent":
            agent_type = tc.get("agent_type", "general-purpose")
            agent_usage[agent_type][tc["model"]] += 1
        elif tc["name"] == "Bash":
            preview = tc.get("bash_command_preview", "")
            cmd = preview.strip()
            while cmd.startswith(("sudo ", "env ", "nohup ", "time ")):
                cmd = cmd.split(None, 1)[1] if " " in cmd else cmd
            tokens = cmd.split()
            binary = tokens[0].rsplit("/", 1)[-1] if tokens else "unknown"
            if binary in SUBCOMMAND_BINARIES and len(tokens) > 1:
                # Find the first non-flag token as the subcommand
                sub = None
                for t in tokens[1:]:
                    if not t.startswith("-"):
                        sub = t
                        break
                    # Skip flags that take a value (e.g., git -C <path>)
                    if t in ("-C", "-c", "--git-dir", "--work-tree"):
                        break  # next token is a value, not subcommand
                if sub:
                    label = f"{binary} {sub}"
            else:
                label = binary
            bash_usage[label] += 1

    # Build model_usage: {model: {turns, input_tokens, output_tokens, ...}}
    model_usage: dict = {}
    for model, turns in session["models_used"].items():
        model_usage[model] = {
            "turns": turns,
            "input_tokens": 0,
            "output_tokens": 0,
            "cache_read_tokens": 0,
            "cache_creation_tokens": 0,
        }
    # Attribute token totals to primary model (session-level aggregates)
    primary = (
        max(session["models_used"], key=session["models_used"].get)
        if session["models_used"]
        else None
    )
    if primary and primary in model_usage:
        model_usage[primary]["input_tokens"] = session["total_input_tokens"]
        model_usage[primary]["output_tokens"] = session["total_output_tokens"]
        model_usage[primary]["cache_read_tokens"] = session["total_cache_read_tokens"]
        model_usage[primary]["cache_creation_tokens"] = session[
            "total_cache_creation_tokens"
        ]

    # Build turn_types: {by_type: {...}, smart_mechanical: {...}}
    by_type: dict[str, int] = defaultdict(int)
    smart_mech = {
        "opus_smart": 0,
        "opus_mechanical": 0,
        "other_smart": 0,
        "other_mechanical": 0,
    }
    for t in session.get("turns", []):
        by_type[t["turn_type"]] += 1
        is_opus = "opus" in t["model"]
        if is_opus and t["needs_smart"]:
            smart_mech["opus_smart"] += 1
        elif is_opus:
            smart_mech["opus_mechanical"] += 1
        elif t["needs_smart"]:
            smart_mech["other_smart"] += 1
        else:
            smart_mech["other_mechanical"] += 1

    conn.execute(
        """
        INSERT OR REPLACE INTO sessions
        (file_path, project_name, git_branch, start_time, end_time, is_subagent,
         tool_calls, model_usage, turn_types, skill_usage, agent_usage, bash_usage,
         ingested_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """,
        (
            session["file"],
            session["project"],
            session.get("git_branch"),
            session.get("start_time", ""),
            session.get("end_time", ""),
            session.get("is_subagent", False),
            json.dumps({k: dict(v) for k, v in tool_calls.items()}),
            json.dumps(model_usage),
            json.dumps({"by_type": dict(by_type), "smart_mechanical": smart_mech}),
            json.dumps({k: dict(v) for k, v in skill_usage.items()}),
            json.dumps({k: dict(v) for k, v in agent_usage.items()}),
            json.dumps(dict(bash_usage)),  # {label: count}
            datetime.now(timezone.utc).isoformat(),
        ),
    )


def scan_and_ingest(hours: int) -> int:
    """Scan for JSONL files and ingest into DB. Returns number of NEW/UPDATED rows."""
    files = parse_sessions.find_session_files(hours)
    if not files:
        return 0

    conn = get_db()
    count = 0

    # Get existing file mtimes for change detection
    existing = {}
    for row in conn.execute("SELECT file_path, ingested_at FROM sessions").fetchall():
        existing[row["file_path"]] = row["ingested_at"]

    for f in files:
        file_path_str = str(f)
        file_mtime = datetime.fromtimestamp(f.stat().st_mtime, tz=timezone.utc)

        # Skip if already ingested and file hasn't changed since
        if file_path_str in existing:
            ingested_at = datetime.fromisoformat(existing[file_path_str])
            if file_mtime <= ingested_at:
                continue

        try:
            session = parse_sessions.parse_session_file(f)
            if session.get("start_time") and session.get("models_used"):
                upsert_session(conn, session)
                count += 1
        except Exception as e:
            logging.warning(f"Failed to ingest {f}: {e}")

    conn.commit()
    conn.close()
    return count


# ---------------------------------------------------------------------------
# Query layer
# ---------------------------------------------------------------------------


def build_dashboard_payload() -> dict:
    """Query DB and build the full dashboard payload."""
    conn = get_db()
    rows = conn.execute("SELECT * FROM sessions ORDER BY start_time").fetchall()
    conn.close()

    tool_counts: dict[str, int] = defaultdict(int)
    tool_by_model: dict[str, dict[str, int]] = defaultdict(lambda: defaultdict(int))
    model_counts: dict[str, int] = defaultdict(int)
    model_token_usage: dict = defaultdict(
        lambda: {"input": 0, "output": 0, "cache_read": 0, "cache_create": 0}
    )
    timeline: dict[str, dict[str, int]] = defaultdict(lambda: defaultdict(int))
    turn_type_counts: dict[str, int] = defaultdict(int)
    smart_mech_total = {
        "opus_smart": 0,
        "opus_mechanical": 0,
        "other_smart": 0,
        "other_mechanical": 0,
    }
    smart_mech_timeline: dict = defaultdict(
        lambda: {
            "opus_smart": 0,
            "opus_mechanical": 0,
            "other_smart": 0,
            "other_mechanical": 0,
        }
    )
    skill_counts: dict[str, int] = defaultdict(int)
    skill_by_model: dict[str, dict[str, int]] = defaultdict(lambda: defaultdict(int))
    agent_counts: dict[str, int] = defaultdict(int)
    agent_by_model: dict[str, dict[str, int]] = defaultdict(lambda: defaultdict(int))
    bash_commands: dict[str, int] = defaultdict(int)
    subagent_model_counts: dict[str, int] = defaultdict(int)
    subagent_token_usage: dict = defaultdict(lambda: {"input": 0, "output": 0})
    subagent_timeline: dict[str, dict[str, int]] = defaultdict(lambda: defaultdict(int))
    sessions_list = []
    total_tool_calls = 0

    for row in rows:
        tc = json.loads(row["tool_calls"])
        mu = json.loads(row["model_usage"])
        tt = json.loads(row["turn_types"])
        is_sub = row["is_subagent"]

        # Tool counts and tool-by-model
        for tool, models in tc.items():
            for model, cnt in models.items():
                tool_counts[tool] += cnt
                tool_by_model[tool][model] += cnt
                total_tool_calls += cnt

        # Timeline: bucket by session start hour
        hour = row["start_time"][:13] if row["start_time"] else None
        if hour:
            for tool, models in tc.items():
                timeline[hour][tool] += sum(models.values())

        # Model usage
        for model, usage in mu.items():
            model_counts[model] += usage.get("turns", 0)
            model_token_usage[model]["input"] += usage.get("input_tokens", 0)
            model_token_usage[model]["output"] += usage.get("output_tokens", 0)
            model_token_usage[model]["cache_read"] += usage.get(
                "cache_read_tokens", 0
            )
            model_token_usage[model]["cache_create"] += usage.get(
                "cache_creation_tokens", 0
            )

        # Turn types
        for ttype, cnt in tt.get("by_type", {}).items():
            turn_type_counts[ttype] += cnt

        # Smart/mechanical totals
        sm = tt.get("smart_mechanical", {})
        for key in smart_mech_total:
            smart_mech_total[key] += sm.get(key, 0)

        # Smart/mechanical timeline
        if hour:
            for key in smart_mech_timeline[hour]:
                smart_mech_timeline[hour][key] += sm.get(key, 0)

        # Skill usage
        su = json.loads(row["skill_usage"])
        for skill, models in su.items():
            for model, cnt in models.items():
                skill_counts[skill] += cnt
                skill_by_model[skill][model] += cnt

        # Agent usage
        au = json.loads(row["agent_usage"])
        for atype, models in au.items():
            for model, cnt in models.items():
                agent_counts[atype] += cnt
                agent_by_model[atype][model] += cnt

        # Bash usage
        bu = json.loads(row["bash_usage"])
        for label, count in bu.items():
            bash_commands[label] += count

        # Subagent breakdown
        if is_sub:
            for model, usage in mu.items():
                turns = usage.get("turns", 0)
                subagent_model_counts[model] += turns
                subagent_token_usage[model]["input"] += usage.get("input_tokens", 0)
                subagent_token_usage[model]["output"] += usage.get("output_tokens", 0)
                if hour:
                    subagent_timeline[hour][model] += turns

        # Session list (non-subagent only)
        if not is_sub:
            sessions_list.append(
                {
                    "project": row["project_name"],
                    "git_branch": row["git_branch"],
                    "start_time": row["start_time"],
                    "end_time": row["end_time"],
                    "models_used": {m: u["turns"] for m, u in mu.items()},
                    "tool_calls": {
                        t: sum(models.values()) for t, models in tc.items()
                    },
                    "total_tools": sum(
                        sum(m.values()) for m in tc.values()
                    ),
                    "input_tokens": sum(
                        u.get("input_tokens", 0) for u in mu.values()
                    ),
                    "output_tokens": sum(
                        u.get("output_tokens", 0) for u in mu.values()
                    ),
                }
            )

    main_count = sum(1 for r in rows if not r["is_subagent"])
    sub_count = sum(1 for r in rows if r["is_subagent"])

    return {
        "metadata": {
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "total_sessions": main_count,
            "total_subagent_sessions": sub_count,
            "total_tool_calls": total_tool_calls,
        },
        "tool_counts": dict(sorted(tool_counts.items(), key=lambda x: -x[1])),
        "tool_by_model": {k: dict(v) for k, v in tool_by_model.items()},
        "model_counts": dict(sorted(model_counts.items(), key=lambda x: -x[1])),
        "model_token_usage": {k: dict(v) for k, v in model_token_usage.items()},
        "timeline": dict(sorted(timeline.items())),
        "turn_analysis": {
            "turn_type_counts": dict(
                sorted(turn_type_counts.items(), key=lambda x: -x[1])
            ),
            "smart_vs_mechanical": smart_mech_total,
            "smart_mech_timeline": dict(sorted(smart_mech_timeline.items())),
        },
        "skill_counts": dict(sorted(skill_counts.items(), key=lambda x: -x[1])),
        "skill_by_model": {k: dict(v) for k, v in skill_by_model.items()},
        "agent_counts": dict(sorted(agent_counts.items(), key=lambda x: -x[1])),
        "agent_by_model": {k: dict(v) for k, v in agent_by_model.items()},
        "bash_commands": dict(sorted(bash_commands.items(), key=lambda x: -x[1])),
        "subagent_model_counts": dict(sorted(subagent_model_counts.items(), key=lambda x: -x[1])),
        "subagent_token_usage": {k: dict(v) for k, v in subagent_token_usage.items()},
        "subagent_timeline": {h: dict(v) for h, v in sorted(subagent_timeline.items())},
        "sessions": sorted(
            sessions_list, key=lambda s: s.get("start_time") or "", reverse=True
        ),
    }


# ---------------------------------------------------------------------------
# FastAPI app
# ---------------------------------------------------------------------------

connected_clients: set[WebSocket] = set()


async def periodic_scan():
    """Background task: re-scan JSONL files periodically."""
    while True:
        await asyncio.sleep(CONFIG["scan_interval"])
        count = scan_and_ingest(CONFIG["hours"])
        if count > 0:
            logging.info(
                f"Scan: ingested {count} sessions, pushing to {len(connected_clients)} clients"
            )
            payload = json.dumps(build_dashboard_payload())
            for ws in list(connected_clients):
                try:
                    await ws.send_text(payload)
                except Exception:
                    connected_clients.discard(ws)


@asynccontextmanager
async def lifespan(app):
    init_db()
    count = scan_and_ingest(CONFIG["hours"])
    logging.info(f"Initial ingest: {count} sessions")
    asyncio.create_task(periodic_scan())
    yield


app = FastAPI(lifespan=lifespan)


@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    connected_clients.add(ws)
    try:
        payload = json.dumps(build_dashboard_payload())
        await ws.send_text(payload)
        while True:
            msg = await ws.receive_text()
            if msg == "refresh":
                payload = json.dumps(build_dashboard_payload())
                await ws.send_text(payload)
    except WebSocketDisconnect:
        connected_clients.discard(ws)


@app.get("/")
async def serve_dashboard():
    return FileResponse(
        Path(__file__).parent / "dashboard.html", media_type="text/html"
    )


# ---------------------------------------------------------------------------
# CLI entry point
# ---------------------------------------------------------------------------


def main():
    parser = argparse.ArgumentParser(description="Claude Usage Dashboard Server")
    parser.add_argument("--port", type=int, default=8420)
    parser.add_argument(
        "--scan-interval",
        type=int,
        default=300,
        help="Seconds between scans (default: 300)",
    )
    parser.add_argument(
        "--hours",
        type=int,
        default=24,
        help="Look back N hours for JSONL files (default: 24)",
    )
    args = parser.parse_args()

    CONFIG["hours"] = args.hours
    CONFIG["scan_interval"] = args.scan_interval

    logging.basicConfig(
        level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s"
    )
    logging.info(f"Starting server on http://localhost:{args.port}")
    logging.info(f"Scan interval: {args.scan_interval}s, lookback: {args.hours}h")

    uvicorn.run(app, host="0.0.0.0", port=args.port, log_level="info")


if __name__ == "__main__":
    main()
