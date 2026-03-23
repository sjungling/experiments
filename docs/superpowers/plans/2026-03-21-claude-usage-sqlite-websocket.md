# Claude Usage SQLite + WebSocket Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static JSON pipeline with a SQLite-backed FastAPI server that pushes dashboard data over WebSocket to a Chart.js frontend.

**Architecture:** Single `server.py` that ingests JSONL session files into SQLite on startup and periodically, serves a WebSocket that pushes the full dashboard payload on connect and after data changes, and serves the Chart.js dashboard as a static file.

**Tech Stack:** Python 3, FastAPI, uvicorn, SQLite (stdlib sqlite3), Chart.js (CDN)

**Spec:** `docs/superpowers/specs/2026-03-21-claude-usage-sqlite-websocket-design.md`

---

### Task 1: Project Setup

**Files:**
- Create: `claude-usage/requirements.txt`
- Modify: `claude-usage/.gitignore`

- [ ] **Step 1: Create requirements.txt**

```
fastapi
uvicorn[standard]
```

- [ ] **Step 2: Update .gitignore to include usage.db**

Add `usage.db` to the existing `.gitignore`.

- [ ] **Step 3: Install dependencies**

Run: `cd claude-usage && uv pip install -r requirements.txt`

---

### Task 2: Server — Database Layer

**Files:**
- Create: `claude-usage/server.py` (initial skeleton)

The database layer lives at the top of `server.py`. Uses stdlib `sqlite3` (synchronous — fine for a localhost tool with small data).

- [ ] **Step 1: Write server.py skeleton with DB init**

```python
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
            ingested_at TEXT NOT NULL
        )
    """)
    conn.execute("CREATE INDEX IF NOT EXISTS idx_sessions_start_time ON sessions(start_time)")
    conn.commit()
    conn.close()
```

- [ ] **Step 2: Write upsert_session function**

```python
def upsert_session(conn: sqlite3.Connection, session: dict):
    """Transform parsed session data and upsert into DB."""
    # Build tool_calls: {tool_name: {model: count}}
    tool_calls = defaultdict(lambda: defaultdict(int))
    for tc in session["tool_calls"]:
        tool_calls[tc["name"]][tc["model"]] += 1

    # Build model_usage: {model: {turns, input_tokens, output_tokens, ...}}
    # Token totals are session-level; attribute to primary model
    model_usage = {}
    for model, turns in session["models_used"].items():
        model_usage[model] = {"turns": turns, "input_tokens": 0, "output_tokens": 0,
                              "cache_read_tokens": 0, "cache_creation_tokens": 0}
    primary = max(session["models_used"], key=session["models_used"].get) if session["models_used"] else None
    if primary and primary in model_usage:
        model_usage[primary]["input_tokens"] = session["total_input_tokens"]
        model_usage[primary]["output_tokens"] = session["total_output_tokens"]
        model_usage[primary]["cache_read_tokens"] = session["total_cache_read_tokens"]
        model_usage[primary]["cache_creation_tokens"] = session["total_cache_creation_tokens"]

    # Build turn_types: {by_type: {...}, smart_mechanical: {opus_smart, ...}}
    by_type = defaultdict(int)
    smart_mech = {"opus_smart": 0, "opus_mechanical": 0, "other_smart": 0, "other_mechanical": 0}
    for t in session.get("turns", []):
        by_type[t["turn_type"]] += 1
        is_opus = t["model"] == "claude-opus-4-6"
        if is_opus and t["needs_smart"]:
            smart_mech["opus_smart"] += 1
        elif is_opus:
            smart_mech["opus_mechanical"] += 1
        elif t["needs_smart"]:
            smart_mech["other_smart"] += 1
        else:
            smart_mech["other_mechanical"] += 1

    conn.execute("""
        INSERT OR REPLACE INTO sessions
        (file_path, project_name, git_branch, start_time, end_time, is_subagent,
         tool_calls, model_usage, turn_types, ingested_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        session["file"],
        session["project"],
        session.get("git_branch"),
        session.get("start_time", ""),
        session.get("end_time", ""),
        session.get("is_subagent", False),
        json.dumps(dict(tool_calls)),
        json.dumps(model_usage),
        json.dumps({"by_type": dict(by_type), "smart_mechanical": smart_mech}),
        datetime.now(timezone.utc).isoformat(),
    ))
```

---

### Task 3: Server — Ingest Pipeline

**Files:**
- Modify: `claude-usage/server.py`

- [ ] **Step 1: Add import of parse-sessions.py functions**

Use `importlib` since the filename has a hyphen:

```python
import importlib.util

_mod_path = Path(__file__).parent / "parse-sessions.py"
_spec = importlib.util.spec_from_file_location("parse_sessions", _mod_path)
parse_sessions = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(parse_sessions)
```

This gives access to `parse_sessions.find_session_files()`, `parse_sessions.parse_session_file()`, etc.

- [ ] **Step 2: Write scan_and_ingest function**

```python
def scan_and_ingest(hours: int) -> int:
    """Scan for JSONL files and ingest into DB. Returns number of rows upserted."""
    files = parse_sessions.find_session_files(hours)
    if not files:
        return 0

    conn = get_db()
    count = 0
    for f in files:
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
```

---

### Task 4: Server — Query Layer

**Files:**
- Modify: `claude-usage/server.py`

- [ ] **Step 1: Write build_dashboard_payload function**

Queries the sessions table and aggregates into the dashboard JSON payload. Uses Python-side aggregation after fetching all rows (simpler than complex JSON SQL for a small dataset).

```python
def build_dashboard_payload() -> dict:
    conn = get_db()
    rows = conn.execute("SELECT * FROM sessions ORDER BY start_time").fetchall()
    conn.close()

    # Aggregate across all sessions
    tool_counts = defaultdict(int)            # tool -> total
    tool_by_model = defaultdict(lambda: defaultdict(int))  # tool -> model -> count
    model_counts = defaultdict(int)           # model -> total turns
    model_token_usage = defaultdict(lambda: {"input": 0, "output": 0, "cache_read": 0, "cache_create": 0})
    timeline = defaultdict(lambda: defaultdict(int))  # hour -> tool -> count
    turn_type_counts = defaultdict(int)
    smart_mech_total = {"opus_smart": 0, "opus_mechanical": 0, "other_smart": 0, "other_mechanical": 0}
    smart_mech_timeline = defaultdict(lambda: {"opus_smart": 0, "opus_mechanical": 0, "other_smart": 0, "other_mechanical": 0})
    sessions_list = []
    total_tool_calls = 0

    for row in rows:
        tc = json.loads(row["tool_calls"])      # {tool: {model: count}}
        mu = json.loads(row["model_usage"])      # {model: {turns, tokens...}}
        tt = json.loads(row["turn_types"])        # {by_type: {...}, smart_mechanical: {...}}
        is_sub = row["is_subagent"]

        # Tool counts
        for tool, models in tc.items():
            for model, cnt in models.items():
                tool_counts[tool] += cnt
                tool_by_model[tool][model] += cnt
                total_tool_calls += cnt

                # Timeline: attribute tool calls to session's start hour
                hour = row["start_time"][:13] if row["start_time"] else None
                if hour:
                    timeline[hour][tool] += cnt

        # Model usage
        for model, usage in mu.items():
            model_counts[model] += usage.get("turns", 0)
            model_token_usage[model]["input"] += usage.get("input_tokens", 0)
            model_token_usage[model]["output"] += usage.get("output_tokens", 0)
            model_token_usage[model]["cache_read"] += usage.get("cache_read_tokens", 0)
            model_token_usage[model]["cache_create"] += usage.get("cache_creation_tokens", 0)

        # Turn types
        for ttype, cnt in tt.get("by_type", {}).items():
            turn_type_counts[ttype] += cnt

        # Smart/mechanical
        sm = tt.get("smart_mechanical", {})
        for key in smart_mech_total:
            smart_mech_total[key] += sm.get(key, 0)

        # Smart/mech timeline (bucket by session start hour)
        hour = row["start_time"][:13] if row["start_time"] else None
        if hour:
            for key in smart_mech_timeline[hour]:
                smart_mech_timeline[hour][key] += sm.get(key, 0)

        # Session list (non-subagent only)
        if not is_sub:
            sessions_list.append({
                "project": row["project_name"],
                "git_branch": row["git_branch"],
                "start_time": row["start_time"],
                "end_time": row["end_time"],
                "models_used": {m: u["turns"] for m, u in mu.items()},
                "tool_calls": {t: sum(models.values()) for t, models in tc.items()},
                "total_tools": sum(sum(m.values()) for m in tc.values()),
                "input_tokens": sum(u.get("input_tokens", 0) for u in mu.values()),
                "output_tokens": sum(u.get("output_tokens", 0) for u in mu.values()),
            })

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
            "turn_type_counts": dict(sorted(turn_type_counts.items(), key=lambda x: -x[1])),
            "smart_vs_mechanical": smart_mech_total,
            "smart_mech_timeline": dict(sorted(smart_mech_timeline.items())),
        },
        "sessions": sorted(sessions_list, key=lambda s: s.get("start_time") or "", reverse=True),
    }
```

---

### Task 5: Server — FastAPI App

**Files:**
- Modify: `claude-usage/server.py`

- [ ] **Step 1: Write FastAPI app with WebSocket and background scan**

```python
app = FastAPI()
connected_clients: set[WebSocket] = set()

@app.on_event("startup")
async def startup():
    init_db()
    count = scan_and_ingest(app.state.hours)
    logging.info(f"Initial ingest: {count} sessions")
    asyncio.create_task(periodic_scan())

async def periodic_scan():
    while True:
        await asyncio.sleep(app.state.scan_interval)
        count = scan_and_ingest(app.state.hours)
        if count > 0:
            logging.info(f"Scan: ingested {count} sessions, pushing to {len(connected_clients)} clients")
            payload = json.dumps(build_dashboard_payload())
            for ws in list(connected_clients):
                try:
                    await ws.send_text(payload)
                except Exception:
                    connected_clients.discard(ws)

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
    return FileResponse(Path(__file__).parent / "index.html")
```

- [ ] **Step 2: Write CLI entry point with argparse + uvicorn**

```python
def main():
    parser = argparse.ArgumentParser(description="Claude Usage Dashboard Server")
    parser.add_argument("--port", type=int, default=8420)
    parser.add_argument("--scan-interval", type=int, default=300, help="Seconds between scans (default: 300)")
    parser.add_argument("--hours", type=int, default=24, help="Look back N hours for JSONL files (default: 24)")
    args = parser.parse_args()

    app.state.hours = args.hours
    app.state.scan_interval = args.scan_interval

    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(message)s")
    logging.info(f"Starting server on http://localhost:{args.port}")
    logging.info(f"Scan interval: {args.scan_interval}s, lookback: {args.hours}h")

    uvicorn.run(app, host="0.0.0.0", port=args.port)

if __name__ == "__main__":
    main()
```

- [ ] **Step 3: Verify server starts and WebSocket works**

Run: `cd claude-usage && python server.py --hours 48`
Expected: Server starts, logs initial ingest count, dashboard accessible at http://localhost:8420

---

### Task 6: Dashboard — Chart.js Frontend

**Files:**
- Create: `claude-usage/index.html` (new file, replaces current dashboard)
- Note: Rename current `index.html` to `index-legacy.html` first to preserve it

- [ ] **Step 1: Rename existing dashboard**

```bash
mv claude-usage/index.html claude-usage/index-legacy.html
```

- [ ] **Step 2: Write new index.html**

Structure:
- `<head>`: Chart.js from CDN, dark theme CSS (reuse color variables from current dashboard)
- Connection status indicator (top bar)
- Stats row (KPI cards: sessions, tool calls, model distribution)
- Charts container with sections for each chart
- Sessions table
- `<script>`: WebSocket connection, chart rendering functions, auto-reconnect

Key sections of the script:

```javascript
// WebSocket connection with auto-reconnect
let ws;
function connect() {
    ws = new WebSocket(`ws://${location.host}/ws`);
    ws.onopen = () => updateStatus('connected');
    ws.onclose = () => { updateStatus('disconnected'); setTimeout(connect, 3000); };
    ws.onmessage = (e) => render(JSON.parse(e.data));
}

// Chart instances (reused on update)
let charts = {};

function render(data) {
    renderStats(data);
    renderTimeline(data);       // Activity timeline - stacked bar
    renderToolsByModel(data);   // Tool calls by model - horizontal stacked bar
    renderModelDist(data);      // Model distribution - bar
    renderSmartMech(data);      // Smart vs mechanical trend - combo chart
    renderSessions(data);       // Sessions table - HTML
}
```

Charts use Chart.js with the same color scheme as the current dashboard:
- Opus: `#d2a8ff` (purple)
- Sonnet: `#58a6ff` (blue)
- Haiku: `#3fb950` (green)

- [ ] **Step 3: End-to-end test**

Run: `python server.py --hours 168` (7 days for more data)
Open: http://localhost:8420
Expected: Dashboard loads, shows charts with real data, connection indicator green

---

### Task 7: Smoke Test & Polish

- [ ] **Step 1: Verify WebSocket refresh**

In browser console: `ws.send("refresh")` — dashboard should re-render with fresh data.

- [ ] **Step 2: Verify periodic scan**

Run with short interval: `python server.py --scan-interval 10`
Expected: Server logs scan activity every 10 seconds. If a new session file appears, dashboard updates.

- [ ] **Step 3: Verify idempotent re-ingest**

Stop and restart server. Check that session count is the same (upsert, not duplicate).

- [ ] **Step 4: Polish any rough edges**

Fix any chart rendering issues, missing data, or layout problems found during testing.
