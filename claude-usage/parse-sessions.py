#!/usr/bin/env python3
"""Parse Claude Code session JSONL files and produce a usage analysis JSON file.

Scans ~/.claude/projects for JSONL files modified within a configurable time
window and extracts tool calls, skill invocations, agent dispatches, model
usage, and token consumption per session.

Usage:
    uv run parse-sessions.py [--hours 24] [--output analysis.json]
"""

import argparse
import json
import os
import re
import time
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path


def parse_args():
    p = argparse.ArgumentParser(description="Parse Claude session JSONL files")
    p.add_argument("--hours", type=int, default=24, help="Look back N hours (default: 24)")
    p.add_argument("--output", type=str, default="analysis.json", help="Output file path")
    return p.parse_args()


def find_session_files(hours: int) -> list[Path]:
    """Find all .jsonl files modified within the last `hours` hours."""
    base = Path.home() / ".claude" / "projects"
    cutoff = time.time() - (hours * 3600)
    files = []
    for p in base.rglob("*.jsonl"):
        if p.stat().st_mtime >= cutoff:
            files.append(p)
    return sorted(files, key=lambda p: p.stat().st_mtime, reverse=True)


def extract_project_name(file_path: Path) -> str:
    """Extract a readable project name from the file path."""
    parts = file_path.parts
    try:
        idx = parts.index("projects")
        project_dir = parts[idx + 1]
        # Decode the path-encoded project directory
        # Format: -Users-username-Work-foo-bar--claude-worktrees-...
        segments = project_dir.split("-")
        # Find the meaningful project segments (skip user path prefix)
        meaningful = []
        skip_until_work = True
        for seg in segments:
            if seg == "Work":
                skip_until_work = False
                continue
            if skip_until_work:
                continue
            if seg.startswith(".claude") or seg == "" or seg == "worktrees":
                break
            meaningful.append(seg)
        if meaningful:
            return "/".join(meaningful)
        return project_dir[:60]
    except (ValueError, IndexError):
        return str(file_path.parent.name)[:60]


def is_subagent_file(file_path: Path) -> bool:
    return "subagents" in file_path.parts


BASH_CATEGORIES = [
    # (category_name, prefixes/patterns to match against first token(s))
    ("git", {"git"}),
    ("npm/pnpm/yarn", {"npm", "npx", "pnpm", "yarn"}),
    ("python/uv", {"python", "python3", "uv", "pip", "pip3"}),
    ("build", {"make", "cmake", "cargo", "go", "mvn", "gradle", "tsc", "esbuild", "vite", "webpack"}),
    ("docker", {"docker", "docker-compose", "podman"}),
    ("file ops", {"ls", "cp", "mv", "rm", "mkdir", "touch", "chmod", "chown", "ln"}),
    ("open/launch", {"open", "xdg-open", "code", "cursor"}),
    ("test", {"jest", "pytest", "vitest", "mocha", "bun"}),
    ("gh cli", {"gh"}),
    ("curl/http", {"curl", "wget", "http", "httpie"}),
    ("find/search", {"find", "fd", "rg", "grep", "ag", "ack"}),
    ("cat/read", {"cat", "head", "tail", "less", "more", "bat", "wc"}),
    ("sed/awk", {"sed", "awk"}),
    ("echo/printf", {"echo", "printf"}),
    ("cd", {"cd"}),
]


def classify_bash_command(command: str) -> str:
    """Classify a bash command into a human-readable category."""
    cmd = command.strip()
    # Handle env vars, sudo, etc.
    while cmd.startswith(("sudo ", "env ", "nohup ", "time ")):
        cmd = cmd.split(None, 1)[1] if " " in cmd else cmd

    # Get the first token (the binary)
    first = cmd.split()[0] if cmd.split() else ""
    # Strip path prefix
    first = first.rsplit("/", 1)[-1]

    for category, tokens in BASH_CATEGORIES:
        if first in tokens:
            return category

    # Chained commands: try the first part before && or |
    for sep in (" && ", " | ", " ; "):
        if sep in command:
            return classify_bash_command(command.split(sep)[0])

    return "other"


def parse_session_file(file_path: Path) -> dict:
    """Parse a single JSONL session file and extract usage data."""
    session_data = {
        "file": str(file_path),
        "project": extract_project_name(file_path),
        "is_subagent": is_subagent_file(file_path),
        "session_id": None,
        "git_branch": None,
        "slug": None,
        "start_time": None,
        "end_time": None,
        "tool_calls": [],
        "turns": [],  # Per-assistant-message turn records
        "models_used": defaultdict(int),
        "total_input_tokens": 0,
        "total_output_tokens": 0,
        "total_cache_read_tokens": 0,
        "total_cache_creation_tokens": 0,
        "assistant_messages": 0,
        "user_messages": 0,
    }

    try:
        with open(file_path) as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    entry = json.loads(line)
                except json.JSONDecodeError:
                    continue

                entry_type = entry.get("type")
                timestamp = entry.get("timestamp")

                # Track session metadata
                if entry.get("sessionId") and not session_data["session_id"]:
                    session_data["session_id"] = entry["sessionId"]
                if entry.get("gitBranch") and not session_data["git_branch"]:
                    session_data["git_branch"] = entry["gitBranch"]
                if entry.get("slug") and not session_data["slug"]:
                    session_data["slug"] = entry["slug"]

                # Track time range
                if timestamp:
                    if not session_data["start_time"] or timestamp < session_data["start_time"]:
                        session_data["start_time"] = timestamp
                    if not session_data["end_time"] or timestamp > session_data["end_time"]:
                        session_data["end_time"] = timestamp

                if entry_type == "assistant":
                    session_data["assistant_messages"] += 1
                    msg = entry.get("message", {})
                    model = msg.get("model", "unknown")
                    session_data["models_used"][model] += 1

                    # Token accounting
                    usage = msg.get("usage", {})
                    session_data["total_input_tokens"] += usage.get("input_tokens", 0)
                    session_data["total_output_tokens"] += usage.get("output_tokens", 0)
                    session_data["total_cache_read_tokens"] += usage.get("cache_read_input_tokens", 0)
                    cache_creation = usage.get("cache_creation", {})
                    session_data["total_cache_creation_tokens"] += sum(cache_creation.values())

                    speed = usage.get("speed", "unknown")

                    # Extract tool calls from content
                    for block in msg.get("content", []):
                        if block.get("type") == "tool_use":
                            tool_name = block.get("name", "unknown")
                            tool_input = block.get("input", {})

                            tool_record = {
                                "name": tool_name,
                                "model": model,
                                "speed": speed,
                                "timestamp": timestamp,
                            }

                            # Track tool_use_id for linking to results
                            tool_use_id = block.get("id")
                            if tool_use_id:
                                tool_record["tool_use_id"] = tool_use_id

                            # Enrich specific tool types
                            if tool_name == "Skill":
                                tool_record["skill_name"] = tool_input.get("skill", "unknown")
                                tool_record["skill_args"] = tool_input.get("args")
                            elif tool_name == "Agent":
                                tool_record["agent_description"] = tool_input.get("description", "")
                                tool_record["agent_type"] = tool_input.get("subagent_type", "general-purpose")
                                tool_record["agent_model"] = tool_input.get("model")
                                tool_record["agent_prompt_preview"] = (tool_input.get("prompt", ""))[:200]
                            elif tool_name == "Bash":
                                tool_record["bash_description"] = tool_input.get("description", "")
                                cmd = tool_input.get("command", "")
                                tool_record["bash_command_preview"] = cmd[:150]
                                tool_record["bash_category"] = classify_bash_command(cmd)
                            elif tool_name == "Read":
                                tool_record["file_path"] = tool_input.get("file_path", "")
                            elif tool_name == "Write":
                                tool_record["file_path"] = tool_input.get("file_path", "")
                            elif tool_name == "Edit":
                                tool_record["file_path"] = tool_input.get("file_path", "")
                            elif tool_name == "Grep":
                                tool_record["pattern"] = tool_input.get("pattern", "")
                            elif tool_name == "Glob":
                                tool_record["pattern"] = tool_input.get("pattern", "")

                            session_data["tool_calls"].append(tool_record)

                    # Build turn record for this assistant message
                    content = msg.get("content", [])
                    if not isinstance(content, list):
                        content = []
                    turn_tools = []
                    has_text = False
                    has_thinking = False
                    text_length = 0
                    for block in content:
                        if not isinstance(block, dict):
                            continue
                        btype = block.get("type")
                        if btype == "tool_use":
                            turn_tools.append(block.get("name", "unknown"))
                        elif btype == "text":
                            text_content = block.get("text", "")
                            if text_content.strip():
                                has_text = True
                                text_length += len(text_content)
                        elif btype == "thinking":
                            has_thinking = True

                    # Classify the turn by what it does
                    if not turn_tools and not has_text:
                        turn_type = "thinking_only"
                    elif not turn_tools and has_text:
                        turn_type = "text_response"
                    elif turn_tools:
                        # Single tool per message in Claude Code JSONL
                        tool = turn_tools[0] if turn_tools else "unknown"
                        if tool in ("Agent", "Skill"):
                            turn_type = "orchestration"
                        elif tool in ("Edit", "Write"):
                            turn_type = "code_write"
                        elif tool in ("Read", "Grep", "Glob"):
                            turn_type = "code_read"
                        elif tool == "Bash":
                            turn_type = "bash_exec"
                        elif tool.startswith("Task"):
                            turn_type = "task_mgmt"
                        else:
                            turn_type = "other_tool"
                    else:
                        turn_type = "other"

                    # Determine if this turn likely needs a smart model
                    # Smart: text responses (explaining to user), orchestration (deciding what to do),
                    #   code writes (generating correct code)
                    # Mechanical: reads, greps, globs, bash (just executing and passing results back)
                    orchestration_tools = {"Agent", "Skill"}
                    has_orchestration = bool(set(turn_tools) & orchestration_tools)
                    write_tools = {"Edit", "Write"}
                    has_writes = bool(set(turn_tools) & write_tools)
                    read_tools = {"Read", "Grep", "Glob"}
                    is_pure_read = bool(set(turn_tools) & read_tools) and not has_writes

                    needs_smart = (
                        has_text
                        or has_orchestration
                        or has_writes
                        or turn_type == "text_response"
                    )

                    session_data["turns"].append({
                        "model": model,
                        "timestamp": timestamp,
                        "turn_type": turn_type,
                        "tools": turn_tools,
                        "tool_count": len(turn_tools),
                        "has_text": has_text,
                        "has_thinking": has_thinking,
                        "text_length": text_length,
                        "output_tokens": usage.get("output_tokens", 0),
                        "needs_smart": needs_smart,
                        "has_orchestration": has_orchestration,
                        "has_writes": has_writes,
                        "is_pure_read": is_pure_read,
                    })

                elif entry_type == "user":
                    session_data["user_messages"] += 1

                    # Link tool_results back to tool_calls for output size
                    msg = entry.get("message", {})
                    content = msg.get("content", [])
                    if isinstance(content, str):
                        content = []
                    for block in content:
                        if not isinstance(block, dict):
                            continue
                        if block.get("type") == "tool_result":
                            tuid = block.get("tool_use_id")
                            content = block.get("content", "")
                            output_len = len(content) if isinstance(content, str) else len(str(content))
                            is_error = block.get("is_error", False)
                            # Also check toolUseResult for structured data
                            tur = entry.get("toolUseResult", {})
                            if tur:
                                stdout_len = len(tur.get("stdout", "")) if isinstance(tur.get("stdout"), str) else 0
                                stderr_len = len(tur.get("stderr", "")) if isinstance(tur.get("stderr"), str) else 0
                                output_len = max(output_len, stdout_len + stderr_len)

                            # Find matching tool call and annotate it
                            if tuid:
                                for tc in reversed(session_data["tool_calls"]):
                                    if tc.get("tool_use_id") == tuid:
                                        tc["output_size"] = output_len
                                        tc["is_error"] = is_error
                                        break

    except Exception as e:
        session_data["parse_error"] = str(e)

    # Convert defaultdict to dict for JSON serialization
    session_data["models_used"] = dict(session_data["models_used"])
    return session_data


def build_analysis(sessions: list[dict], hours: int) -> dict:
    """Build the aggregate analysis from parsed sessions."""
    # Separate main sessions from subagent sessions
    main_sessions = [s for s in sessions if not s["is_subagent"]]
    subagent_sessions = [s for s in sessions if s["is_subagent"]]

    # Aggregate tool call counts
    tool_counts = defaultdict(int)
    tool_by_model = defaultdict(lambda: defaultdict(int))
    skill_counts = defaultdict(int)
    skill_by_model = defaultdict(lambda: defaultdict(int))
    agent_type_counts = defaultdict(int)
    agent_type_by_model = defaultdict(lambda: defaultdict(int))  # model that dispatched
    model_counts = defaultdict(int)
    model_token_usage = defaultdict(lambda: {"input": 0, "output": 0, "cache_read": 0, "cache_create": 0})

    all_tool_calls = []

    # Build subagent model & token usage from subagent session files
    subagent_model_totals = defaultdict(int)  # model -> total assistant messages across all subagents
    subagent_token_totals = defaultdict(lambda: {"input": 0, "output": 0})
    for s in subagent_sessions:
        if s["models_used"]:
            primary = max(s["models_used"], key=s["models_used"].get)
            for model, count in s["models_used"].items():
                subagent_model_totals[model] += count
            subagent_token_totals[primary]["input"] += s["total_input_tokens"]
            subagent_token_totals[primary]["output"] += s["total_output_tokens"]

    for s in sessions:
        for tc in s["tool_calls"]:
            name = tc["name"]
            model = tc["model"]
            tool_counts[name] += 1
            tool_by_model[name][model] += 1

            if name == "Skill":
                skill_name = tc.get("skill_name", "unknown")
                skill_counts[skill_name] += 1
                skill_by_model[skill_name][model] += 1
            elif name == "Agent":
                agent_type = tc.get("agent_type", "general-purpose")
                agent_type_counts[agent_type] += 1
                # Track dispatching model
                agent_type_by_model[agent_type][model] += 1

            all_tool_calls.append(tc)

        for model, count in s["models_used"].items():
            model_counts[model] += count

        # Token usage by model (from session-level aggregates, attributed to primary model)
        primary_model = max(s["models_used"], key=s["models_used"].get) if s["models_used"] else "unknown"
        model_token_usage[primary_model]["input"] += s["total_input_tokens"]
        model_token_usage[primary_model]["output"] += s["total_output_tokens"]
        model_token_usage[primary_model]["cache_read"] += s["total_cache_read_tokens"]
        model_token_usage[primary_model]["cache_create"] += s["total_cache_creation_tokens"]

    # Turn-level analysis
    all_turns = []
    for s in sessions:
        all_turns.extend(s.get("turns", []))

    turn_type_counts = defaultdict(int)
    turn_type_by_model = defaultdict(lambda: defaultdict(int))
    smart_needed = {"opus_smart": 0, "opus_mechanical": 0, "other_smart": 0, "other_mechanical": 0}
    turn_type_output_tokens = defaultdict(int)
    turn_type_total = defaultdict(int)

    for t in all_turns:
        tt = t["turn_type"]
        model = t["model"]
        turn_type_counts[tt] += 1
        turn_type_by_model[tt][model] += 1
        turn_type_output_tokens[tt] += t["output_tokens"]
        turn_type_total[tt] += 1

        is_opus = model == "claude-opus-4-6"
        if is_opus and t["needs_smart"]:
            smart_needed["opus_smart"] += 1
        elif is_opus and not t["needs_smart"]:
            smart_needed["opus_mechanical"] += 1
        elif not is_opus and t["needs_smart"]:
            smart_needed["other_smart"] += 1
        else:
            smart_needed["other_mechanical"] += 1

    # Average output tokens per turn type
    turn_type_avg_output = {
        tt: round(turn_type_output_tokens[tt] / turn_type_total[tt]) if turn_type_total[tt] else 0
        for tt in turn_type_counts
    }

    # Hourly smart/mechanical timeline
    # Buckets: opus_smart, opus_mechanical, other_smart, other_mechanical
    smart_mech_timeline = defaultdict(lambda: {
        "opus_smart": 0, "opus_mechanical": 0,
        "other_smart": 0, "other_mechanical": 0,
    })
    for t in all_turns:
        ts = t.get("timestamp")
        if not ts:
            continue
        hour = ts[:13]
        is_opus = t["model"] == "claude-opus-4-6"
        if is_opus and t["needs_smart"]:
            smart_mech_timeline[hour]["opus_smart"] += 1
        elif is_opus and not t["needs_smart"]:
            smart_mech_timeline[hour]["opus_mechanical"] += 1
        elif not is_opus and t["needs_smart"]:
            smart_mech_timeline[hour]["other_smart"] += 1
        else:
            smart_mech_timeline[hour]["other_mechanical"] += 1

    # Build timeline buckets (hourly)
    timeline = defaultdict(lambda: defaultdict(int))
    for tc in all_tool_calls:
        if tc.get("timestamp"):
            # Bucket by hour
            hour = tc["timestamp"][:13]  # "2026-03-12T15"
            timeline[hour][tc["name"]] += 1

    # Session summaries
    session_summaries = []
    for s in main_sessions:
        total_tools = len(s["tool_calls"])
        tool_breakdown = defaultdict(int)
        for tc in s["tool_calls"]:
            tool_breakdown[tc["name"]] += 1

        session_summaries.append({
            "session_id": s["session_id"],
            "slug": s["slug"],
            "project": s["project"],
            "git_branch": s["git_branch"],
            "start_time": s["start_time"],
            "end_time": s["end_time"],
            "models_used": s["models_used"],
            "total_tools": total_tools,
            "tool_breakdown": dict(tool_breakdown),
            "assistant_messages": s["assistant_messages"],
            "user_messages": s["user_messages"],
            "total_input_tokens": s["total_input_tokens"],
            "total_output_tokens": s["total_output_tokens"],
            "total_cache_read_tokens": s["total_cache_read_tokens"],
            "total_cache_creation_tokens": s["total_cache_creation_tokens"],
        })

    # Bash deep dive
    bash_calls = [tc for tc in all_tool_calls if tc["name"] == "Bash"]
    bash_category_counts = defaultdict(int)
    bash_category_by_model = defaultdict(lambda: defaultdict(int))
    # Output size buckets: tiny (<100), small (100-500), medium (500-2000), large (2000-10000), huge (>10000)
    output_buckets = {"tiny (<100)": 0, "small (100-500)": 0, "medium (500-2K)": 0, "large (2K-10K)": 0, "huge (>10K)": 0, "no output": 0}
    output_bucket_by_model = defaultdict(lambda: dict.fromkeys(output_buckets.keys(), 0))
    # Per-category output size stats
    bash_category_output = defaultdict(list)  # category -> [output_sizes]

    for tc in bash_calls:
        cat = tc.get("bash_category", "other")
        model = tc["model"]
        bash_category_counts[cat] += 1
        bash_category_by_model[cat][model] += 1

        out_size = tc.get("output_size", 0)
        bash_category_output[cat].append(out_size)

        if out_size == 0:
            bucket = "no output"
        elif out_size < 100:
            bucket = "tiny (<100)"
        elif out_size < 500:
            bucket = "small (100-500)"
        elif out_size < 2000:
            bucket = "medium (500-2K)"
        elif out_size < 10000:
            bucket = "large (2K-10K)"
        else:
            bucket = "huge (>10K)"
        output_buckets[bucket] += 1
        output_bucket_by_model[model][bucket] += 1

    # Compute per-category avg output size
    bash_category_avg_output = {}
    for cat, sizes in bash_category_output.items():
        avg = sum(sizes) / len(sizes) if sizes else 0
        bash_category_avg_output[cat] = round(avg)

    # Model selection opportunities: tools called on expensive models that could use cheaper ones
    model_optimization = []
    cheap_eligible_tools = {"Bash", "Read", "Write", "Edit", "Grep", "Glob"}
    for tc in all_tool_calls:
        if tc["name"] in cheap_eligible_tools and tc["model"] == "claude-opus-4-6":
            model_optimization.append({
                "tool": tc["name"],
                "model": tc["model"],
                "timestamp": tc["timestamp"],
                "context": tc.get("bash_description") or tc.get("file_path") or tc.get("pattern") or "",
            })

    return {
        "metadata": {
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "hours_analyzed": hours,
            "total_sessions": len(main_sessions),
            "total_subagent_sessions": len(subagent_sessions),
            "total_tool_calls": len(all_tool_calls),
        },
        "tool_counts": dict(sorted(tool_counts.items(), key=lambda x: -x[1])),
        "tool_by_model": {k: dict(v) for k, v in tool_by_model.items()},
        "skill_counts": dict(sorted(skill_counts.items(), key=lambda x: -x[1])),
        "skill_by_model": {k: dict(v) for k, v in skill_by_model.items()},
        "agent_type_counts": dict(sorted(agent_type_counts.items(), key=lambda x: -x[1])),
        "agent_type_by_model": {k: dict(v) for k, v in agent_type_by_model.items()},
        "subagent_model_totals": dict(sorted(subagent_model_totals.items(), key=lambda x: -x[1])),
        "subagent_token_totals": {k: dict(v) for k, v in subagent_token_totals.items()},
        "bash_deep_dive": {
            "total": len(bash_calls),
            "category_counts": dict(sorted(bash_category_counts.items(), key=lambda x: -x[1])),
            "category_by_model": {k: dict(v) for k, v in bash_category_by_model.items()},
            "category_avg_output": bash_category_avg_output,
            "output_size_distribution": output_buckets,
            "output_size_by_model": {k: dict(v) for k, v in output_bucket_by_model.items()},
        },
        "turn_analysis": {
            "total_turns": len(all_turns),
            "turn_type_counts": dict(sorted(turn_type_counts.items(), key=lambda x: -x[1])),
            "turn_type_by_model": {k: dict(v) for k, v in turn_type_by_model.items()},
            "turn_type_avg_output_tokens": turn_type_avg_output,
            "smart_vs_mechanical": smart_needed,
            "smart_mech_timeline": dict(sorted(smart_mech_timeline.items())),
        },
        "model_counts": dict(sorted(model_counts.items(), key=lambda x: -x[1])),
        "model_token_usage": {k: dict(v) for k, v in model_token_usage.items()},
        "timeline": dict(sorted(timeline.items())),
        "sessions": sorted(session_summaries, key=lambda s: s["start_time"] or "", reverse=True),
        "model_optimization_opportunities": {
            "count": len(model_optimization),
            "summary": f"{len(model_optimization)} simple tool calls on opus that could potentially use a cheaper model",
            "by_tool": dict(defaultdict(int, {
                k: sum(1 for o in model_optimization if o["tool"] == k)
                for k in set(o["tool"] for o in model_optimization)
            })),
        },
    }


def main():
    args = parse_args()
    print(f"Scanning for session files modified in the last {args.hours} hours...")

    files = find_session_files(args.hours)
    print(f"Found {len(files)} JSONL files")

    sessions = []
    for i, f in enumerate(files):
        if (i + 1) % 10 == 0:
            print(f"  Parsing {i+1}/{len(files)}...")
        sessions.append(parse_session_file(f))

    analysis = build_analysis(sessions, args.hours)

    # Detect CLAUDE.md changes as timeline markers
    markers = []
    claude_md = Path.home() / ".claude" / "CLAUDE.md"
    if claude_md.exists():
        mtime = claude_md.stat().st_mtime
        marker_dt = datetime.fromtimestamp(mtime, tz=timezone.utc)
        marker_hour = marker_dt.strftime("%Y-%m-%dT%H")
        markers.append({"time": marker_hour, "label": "CLAUDE.md updated"})
    analysis["markers"] = markers

    output_path = Path(args.output)
    with open(output_path, "w") as f:
        json.dump(analysis, f, indent=2)

    print(f"\nAnalysis written to {output_path}")
    print(f"  Sessions: {analysis['metadata']['total_sessions']} main + {analysis['metadata']['total_subagent_sessions']} subagent")
    print(f"  Tool calls: {analysis['metadata']['total_tool_calls']}")
    print(f"  Models: {', '.join(analysis['model_counts'].keys())}")
    print(f"  Top tools: {', '.join(list(analysis['tool_counts'].keys())[:5])}")


if __name__ == "__main__":
    main()
