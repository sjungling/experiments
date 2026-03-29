#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["rich"]
# ///
"""
iOS Simulator Runtime Pruner
=============================
Lists installed iOS simulator runtimes and removes all but the ones you
want to keep.  Defaults to keeping only the latest runtime.

Usage:
    sudo uv run sim_runtime_prune.py              # interactive: preview then confirm
    sudo uv run sim_runtime_prune.py --keep 26.4   # keep specific version(s)
    sudo uv run sim_runtime_prune.py --dry-run     # show what would be deleted
    sudo uv run sim_runtime_prune.py --yes         # skip confirmation prompt

Requires sudo because simulator runtimes are system-level disk images.
"""

from __future__ import annotations

import argparse
import os
import re
import subprocess
import sys
from dataclasses import dataclass

from rich.console import Console
from rich.table import Table
from rich.panel import Panel


# ── Data ────────────────────────────────────────────────────────────────────


@dataclass
class Runtime:
    platform: str       # e.g. "iOS"
    version: str        # e.g. "26.4"
    build: str          # e.g. "23E244"
    uuid: str           # e.g. "70AD9389-307D-4235-BAB9-DDD3912AA3C2"
    state: str          # e.g. "Ready"

    @property
    def sort_key(self) -> tuple:
        """Parse version into tuple for sorting (e.g. '26.4' -> (26, 4))."""
        parts = re.split(r"[.\-]", self.version)
        result = []
        for p in parts:
            # Strip trailing alpha chars from betas like "23B5044k"
            digits = re.match(r"\d+", p)
            result.append(int(digits.group()) if digits else 0)
        return tuple(result)

    @property
    def is_beta(self) -> bool:
        """Heuristic: beta builds have lowercase letters in the build string."""
        return bool(re.search(r"[a-z]", self.build))

    @property
    def display(self) -> str:
        beta = " [yellow](beta)[/yellow]" if self.is_beta else ""
        return f"{self.platform} {self.version} ({self.build}){beta}"


# ── Helpers ─────────────────────────────────────────────────────────────────


RUNTIME_RE = re.compile(
    r"^(\w+)\s+"                          # platform: iOS, watchOS, etc.
    r"([\d.]+)\s+"                        # version: 26.4
    r"\((\w+)\)\s+-\s+"                   # build: (23E244)
    r"([0-9A-Fa-f-]{36})\s+"             # UUID
    r"\((\w+)\)",                          # state: (Ready)
)


def list_runtimes() -> list[Runtime]:
    """Parse output of `xcrun simctl runtime list`."""
    try:
        result = subprocess.run(
            ["xcrun", "simctl", "runtime", "list"],
            capture_output=True, text=True, timeout=30,
        )
    except FileNotFoundError:
        return []

    runtimes = []
    for line in result.stdout.splitlines():
        m = RUNTIME_RE.match(line.strip())
        if m:
            runtimes.append(Runtime(
                platform=m.group(1),
                version=m.group(2),
                build=m.group(3),
                uuid=m.group(4),
                state=m.group(5),
            ))
    return runtimes


def delete_runtime(uuid: str) -> tuple[bool, str]:
    """Delete a runtime by UUID. Returns (success, message)."""
    result = subprocess.run(
        ["xcrun", "simctl", "runtime", "delete", uuid],
        capture_output=True, text=True, timeout=120,
    )
    if result.returncode == 0:
        return True, result.stdout.strip() or "Deleted"
    return False, result.stderr.strip() or f"Exit code {result.returncode}"


def delete_unavailable_devices() -> str:
    """Clean up simulator devices that reference deleted runtimes."""
    result = subprocess.run(
        ["xcrun", "simctl", "delete", "unavailable"],
        capture_output=True, text=True, timeout=60,
    )
    return result.stdout.strip() or result.stderr.strip() or "Done"


def pick_latest(runtimes: list[Runtime]) -> Runtime | None:
    """Return the latest non-beta runtime, or latest overall if all are betas."""
    non_beta = [r for r in runtimes if not r.is_beta]
    pool = non_beta or runtimes
    if not pool:
        return None
    return max(pool, key=lambda r: r.sort_key)


# ── Main ────────────────────────────────────────────────────────────────────


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Prune iOS simulator runtimes, keeping only what you need.",
    )
    parser.add_argument(
        "--keep", nargs="*", metavar="VERSION",
        help="Version(s) to keep (e.g. 26.4 18.2). Default: latest only.",
    )
    parser.add_argument(
        "--dry-run", action="store_true",
        help="Show what would be deleted without actually deleting.",
    )
    parser.add_argument(
        "--yes", "-y", action="store_true",
        help="Skip confirmation prompt.",
    )
    args = parser.parse_args()

    console = Console()
    console.print()

    # ── Check privileges ────────────────────────────────────────────────
    if os.geteuid() != 0 and not args.dry_run:
        console.print(Panel(
            "[bold red]This script requires sudo to delete simulator runtimes.[/bold red]\n"
            "Run: [cyan]sudo uv run sim_runtime_prune.py[/cyan]\n"
            "Or use [cyan]--dry-run[/cyan] to preview without deleting.",
            border_style="red",
        ))
        sys.exit(1)

    # ── List runtimes ───────────────────────────────────────────────────
    runtimes = list_runtimes()

    if not runtimes:
        console.print("[yellow]No simulator runtimes found.[/yellow]")
        return

    # ── Decide what to keep ─────────────────────────────────────────────
    if args.keep is not None and len(args.keep) > 0:
        keep_versions = set(args.keep)
    else:
        latest = pick_latest(runtimes)
        if latest:
            keep_versions = {latest.version}
        else:
            keep_versions = set()

    to_keep = [r for r in runtimes if r.version in keep_versions]
    to_delete = [r for r in runtimes if r.version not in keep_versions]

    # Sort for display
    to_keep.sort(key=lambda r: r.sort_key)
    to_delete.sort(key=lambda r: r.sort_key)

    # ── Display plan ────────────────────────────────────────────────────
    table = Table(
        title="Simulator Runtimes",
        border_style="blue",
        show_lines=False,
    )
    table.add_column("Action", width=10)
    table.add_column("Runtime", min_width=30)
    table.add_column("UUID", style="dim", width=38)
    table.add_column("State", width=8)

    for r in to_keep:
        table.add_row(
            "[bold green]KEEP[/bold green]",
            r.display,
            r.uuid,
            r.state,
        )

    if to_keep and to_delete:
        table.add_section()

    for r in to_delete:
        table.add_row(
            "[bold red]DELETE[/bold red]",
            r.display,
            r.uuid,
            r.state,
        )

    console.print(table)

    if not to_delete:
        console.print("\n[green]Nothing to delete. All clean![/green]\n")
        return

    # Estimate space
    console.print(
        f"\n[bold]{len(to_delete)}[/bold] runtime(s) to delete, "
        f"[bold]{len(to_keep)}[/bold] to keep."
    )

    # ── Dry run ─────────────────────────────────────────────────────────
    if args.dry_run:
        console.print("[dim]Dry run — no changes made.[/dim]\n")
        return

    # ── Confirm ─────────────────────────────────────────────────────────
    if not args.yes:
        console.print()
        answer = console.input(
            "[bold yellow]Proceed with deletion?[/bold yellow] [dim](y/N)[/dim] "
        )
        if answer.lower() not in ("y", "yes"):
            console.print("[dim]Cancelled.[/dim]\n")
            return

    # ── Delete ──────────────────────────────────────────────────────────
    console.print()
    for r in to_delete:
        with console.status(f"Deleting {r.platform} {r.version} ({r.build})…"):
            ok, msg = delete_runtime(r.uuid)
        if ok:
            console.print(f"  [green]Deleted[/green] {r.platform} {r.version} ({r.build})")
        else:
            console.print(f"  [red]Failed[/red]  {r.platform} {r.version} ({r.build}): {msg}")

    # ── Clean up orphaned devices ───────────────────────────────────────
    console.print()
    with console.status("Cleaning up unavailable simulator devices…"):
        delete_unavailable_devices()
    console.print("[green]Cleaned up unavailable simulator devices.[/green]")

    # ── Summary ─────────────────────────────────────────────────────────
    console.print()
    remaining = list_runtimes()
    if remaining:
        console.print(f"[bold]Remaining runtimes:[/bold] {len(remaining)}")
        for r in sorted(remaining, key=lambda r: r.sort_key):
            console.print(f"  {r.platform} {r.version} ({r.build})")
    console.print()


if __name__ == "__main__":
    main()
