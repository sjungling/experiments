# Claude Code Usage Dashboard

Parse Claude Code session JSONL files and visualize tool calls, model usage, MCP server activity, and optimization opportunities in a live dashboard.

![screenshot](screenshot.png)

## Quick Start

```bash
cd claude-usage

# Start the live dashboard (default: last 24 hours)
uv run server.py

# Or look back further
uv run server.py --hours 168
```

Then open http://localhost:8420 in your browser. The dashboard auto-updates via WebSocket.

## What It Tracks

### Tool & Model Usage
- Tool call counts with per-model stacked breakdown
- Model usage over time (toggle between Tools and Models views)
- Skills invoked and which model called them
- Agent dispatches and which model dispatched vs ran them
- Subagent runtime model distribution

### MCP Server Usage
- Tracks calls to MCP servers (Grafana, Slack, Chrome, Xcode, etc.)
- Broken down by server and method, stacked by model

### Bash Deep Dive
- Bash commands categorized by type (git, npm, python, file ops, etc.)

### Turn-Level Analysis
- Each assistant API call classified: code read, code write, bash exec, text response, orchestration, task management

## Architecture

- **`parse-sessions.py`** — Scans `~/.claude/projects/` for JSONL files, extracts and aggregates usage data
- **`server.py`** — FastAPI server that ingests sessions into SQLite, serves the dashboard, and pushes updates over WebSocket
- **`dashboard.html`** — Live Chart.js dashboard with auto-refresh
