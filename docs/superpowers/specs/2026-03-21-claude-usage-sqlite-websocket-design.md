# Claude Usage: SQLite + WebSocket Dashboard

**Date:** 2026-03-21
**Status:** Approved
**Project:** claude-usage

## Problem

The claude-usage project currently generates a static `analysis.json` file that must be manually loaded into a self-contained HTML dashboard via drag-and-drop. This workflow limits flexibility for time-series analysis and requires re-running the parser and reloading the file to see updated data.

## Solution

Replace the static JSON pipeline with:
1. A SQLite database for persistent session storage
2. A FastAPI server that ingests JSONL data, queries the database, and streams dashboard payloads over WebSocket
3. A new Chart.js-based dashboard that connects automatically and updates live

## Design Decisions

- **On-demand ingestion with periodic re-scan** — server scans on startup and every 5 minutes
- **Session-level granularity** — one row per JSONL session file
- **Push-on-load WebSocket** — server pushes full dashboard payload on connect and after each scan if data changed
- **Chart.js dashboard** — replaces hand-rolled canvas charts for better time-series support
- **Upsert by file path** — idempotent ingestion, safe to re-scan overlapping windows
- **Monolithic server** — single `server.py` handles ingestion, serving, and WebSocket

## SQLite Schema

```sql
CREATE TABLE sessions (
    file_path TEXT PRIMARY KEY,
    project_name TEXT NOT NULL,
    git_branch TEXT,
    start_time TEXT NOT NULL,           -- ISO 8601
    end_time TEXT NOT NULL,             -- ISO 8601
    is_subagent BOOLEAN DEFAULT FALSE,
    tool_calls JSON NOT NULL,           -- {"Bash": {"claude-opus-4-6": 3, "claude-sonnet-4-6": 2}, "Read": {...}, ...}
    model_usage JSON NOT NULL,          -- {"claude-opus-4-6": {"turns": 5, "input_tokens": N, "output_tokens": N, "cache_read_tokens": N, "cache_creation_tokens": N}, ...}
    turn_types JSON NOT NULL,           -- {"by_type": {"bash_exec": 3, "code_read": 5, ...}, "smart_mechanical": {"opus_smart": 4, "opus_mechanical": 7, "other_smart": 2, "other_mechanical": 1}}
    ingested_at TEXT NOT NULL
);

CREATE INDEX idx_sessions_start_time ON sessions(start_time);
```

**Queryable columns** for filtering and grouping: `file_path`, `project_name`, `git_branch`, `start_time`, `end_time`, `is_subagent`.

**JSON columns:**
- `tool_calls` — per-tool, per-model breakdown. Enables both "total tool counts" and "tool by model" aggregations.
- `model_usage` — per-model turn count and all four token types (input, output, cache_read, cache_creation).
- `turn_types` — two axes: `by_type` (turn classification counts) and `smart_mechanical` (per-model smart/mechanical split). Enables the combo trend chart and smart vs mechanical aggregations.

## Server Architecture

### Entry Point

```
python server.py [--port 8420] [--scan-interval 300] [--hours 24]
```

Single mode. Starts the FastAPI server which:
- Runs initial JSONL scan and upserts into `usage.db` on startup
- Launches a background task that re-scans every `--scan-interval` seconds (default 300 = 5 minutes)
- Serves WebSocket at `/ws` and `index.html` at `/`

The `--hours` flag controls the scan window for finding JSONL files to ingest (files modified within the last N hours). The database accumulates all ingested sessions; no data is pruned. Dashboard queries return all data in the database.

### Ingest Pipeline

Reuses parsing logic from `parse-sessions.py` by importing its core functions:
- `find_session_files(hours)` — scan `~/.claude/projects/` for JSONL files modified within window
- `parse_session_file(file_path)` — extract session-level data from a single JSONL file
- `extract_project_name(file_path)` — decode path-encoded project directory
- `is_subagent_file(file_path)` — detect subagent session files

The server adds:
- SQLite upsert logic (INSERT OR REPLACE keyed on `file_path`)
- Mapping from parser output to schema columns (restructuring flat tool/model dicts into the per-model JSON shapes)

### Query Layer

Functions that run SQL aggregations over the sessions table to produce dashboard sections:
- **Metadata:** session count, time range, total tool calls
- **Tool counts by model:** aggregate `tool_calls` JSON — sum per-tool per-model counts across sessions
- **Model distribution:** aggregate `model_usage` JSON — sum turns and tokens per model
- **Timeline:** bucket sessions by hour using `start_time`, aggregate tool call totals per bucket
- **Smart vs mechanical:** aggregate `turn_types.smart_mechanical` across sessions, bucket by session `start_time` hour
- **Sessions list:** direct query, sorted by `start_time` desc

These replace `build_analysis()` from the current parser.

### WebSocket Behavior

- On client connect: query database, compute dashboard payload, push to client
- After each background scan: if data changed (new/updated rows), push updated payload to all connected clients
- Client can send `"refresh"` message to request an immediate push
- Errors during scan are logged; the scan cycle continues

## Dashboard

New `index.html` using vanilla HTML + CSS + Chart.js (loaded from CDN).

### Connection

Connects to `ws://localhost:8420/ws` on page load. Shows connection status indicator. Auto-reconnects on disconnect.

### Charts (initial set)

| Chart | Type | Data Source |
|-------|------|-------------|
| Activity timeline | Stacked bar (hourly) | Timeline aggregation |
| Tool calls by model | Horizontal stacked bar | Tool counts from `tool_calls` JSON |
| Model distribution | Bar | `model_usage` aggregation |
| Smart vs mechanical trend | Combo: stacked bar + line | `turn_types.smart_mechanical` over time |
| Sessions table | HTML table | Sessions list query |

### Behavior

- Receives JSON payload via WebSocket, renders/updates all charts
- Auto-updates when server pushes new data after scan cycle
- Dark theme consistent with current dashboard aesthetic

## File Structure

```
claude-usage/
├── server.py          # FastAPI app: ingest + serve + WebSocket
├── index.html         # New Chart.js dashboard
├── requirements.txt   # fastapi, uvicorn[standard]
├── parse-sessions.py  # Kept as-is (standalone CLI tool still works)
├── usage.db           # SQLite database (gitignored)
├── README.md          # Updated with new usage instructions
└── .gitignore         # Add usage.db
```

The existing `parse-sessions.py` and its `analysis.json` workflow remain untouched. This is additive.

## Deferred Features

These existing dashboard sections require richer sub-classification data (per-skill names, per-agent types, bash command categories, per-tool-call model attribution for optimization detection). They are intentionally deferred from the initial migration and can be added later by enriching the schema:

- Skill usage breakdown (skill_counts, skill_by_model)
- Agent dispatch breakdown (agent_type_counts, agent_type_by_model)
- Bash deep dive (category breakdown, output size distribution)
- Model optimization opportunities (per-tool-call model attribution)
- CLAUDE.md change markers on trend charts

## Non-Goals

- No authentication (localhost only)
- No turn-level storage (session-level is sufficient)
- No REST API (WebSocket only for now)
- No complex query interface in the dashboard (server computes fixed views)
