#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["rich"]
# ///
"""
macOS "System Data" Breakdown
=============================
Scans the directories that macOS lumps into "System Data" in Storage settings
and gives you a human-readable breakdown of where the space is actually going.

Usage:
    uv run system_data_breakdown.py
    uv run system_data_breakdown.py --top 30
    uv run system_data_breakdown.py --min-gb 0.5
"""

from __future__ import annotations

import argparse
import os
import pwd
import shutil
import sys
from dataclasses import dataclass, field
from pathlib import Path

from rich.console import Console
from rich.table import Table
from rich.text import Text
from rich.panel import Panel
from rich.columns import Columns
from rich.bar import Bar


# ── Helpers ──────────────────────────────────────────────────────────────────


def get_dir_size(path: Path) -> int:
    """Return total actual bytes used by *path* (respecting sparse files),
    silently skipping permission errors and symlinks."""
    total = 0
    try:
        for entry in os.scandir(path):
            try:
                if entry.is_symlink():
                    continue
                if entry.is_file(follow_symlinks=False):
                    st = entry.stat(follow_symlinks=False)
                    # st_blocks is in 512-byte units; gives actual disk usage
                    # (handles sparse files like Docker.raw correctly)
                    total += st.st_blocks * 512
                elif entry.is_dir(follow_symlinks=False):
                    total += get_dir_size(Path(entry.path))
            except (PermissionError, OSError):
                continue
    except (PermissionError, OSError):
        pass
    return total


def get_mount_point(path: Path) -> Path:
    """Walk up from path to find its mount point."""
    path = path.resolve()
    while not os.path.ismount(path):
        path = path.parent
    return path


def _get_external_volumes() -> set[Path]:
    """Return mount points that are external/removable volumes.

    On macOS, external drives mount under /Volumes/. We exclude the Data volume
    (/System/Volumes/Data) and the boot volume. Simulator runtimes and other
    system disk images are NOT external even though they have distinct /dev/ entries.
    """
    external = set()
    # Standard system mounts that are NOT external
    system_prefixes = (
        "/System/Volumes/",
        "/Library/Developer/",
    )
    try:
        for line in os.popen("df -P 2>/dev/null").read().strip().split("\n")[1:]:
            parts = line.split()
            if len(parts) < 6:
                continue
            mount = " ".join(parts[5:])
            if mount == "/":
                continue
            if any(mount.startswith(p) for p in system_prefixes):
                continue
            # Anything under /Volumes/ that isn't a system volume is external
            if mount.startswith("/Volumes/"):
                external.add(Path(mount))
    except Exception:
        pass
    return external


def is_external_disk(resolved_path: Path, external_volumes: set[Path]) -> bool:
    """Check if a resolved path lives on an external volume."""
    for vol in external_volumes:
        try:
            resolved_path.relative_to(vol)
            return True
        except ValueError:
            continue
    return False


def get_disk_info() -> list[dict]:
    """Return info about physical disks (excluding system/virtual volumes)."""
    disks = []
    seen_devices = set()
    skip_prefixes = (
        "/System/Volumes/",
        "/dev",
        "/Library/Developer/CoreSimulator",
    )
    try:
        for line in os.popen("df -Ph 2>/dev/null").read().strip().split("\n")[1:]:
            parts = line.split()
            if len(parts) < 6:
                continue
            device, size, used, avail, pct, mount = (
                parts[0], parts[1], parts[2], parts[3], parts[4], " ".join(parts[5:])
            )
            if not device.startswith("/dev/"):
                continue
            if any(mount.startswith(p) for p in skip_prefixes):
                continue
            # Use base device (e.g. /dev/disk3) to deduplicate APFS slices
            base_dev = device.rstrip("0123456789").rstrip("s")
            if mount == "/":
                # Always include root
                pass
            elif base_dev in seen_devices:
                continue
            seen_devices.add(base_dev)
            disks.append({
                "device": device, "size": size, "used": used,
                "avail": avail, "pct": pct, "mount": mount,
            })
    except Exception:
        pass
    return disks


def fmt_size(nbytes: int) -> str:
    """Pretty-print byte count."""
    for unit in ("B", "KB", "MB", "GB", "TB"):
        if abs(nbytes) < 1024:
            return f"{nbytes:,.1f} {unit}"
        nbytes /= 1024  # type: ignore[assignment]
    return f"{nbytes:,.1f} PB"


def bar_text(fraction: float, width: int = 30) -> Text:
    """Return a rich Text bar like [████████░░░░░░░░]."""
    filled = int(fraction * width)
    empty = width - filled
    bar = Text()
    bar.append("█" * filled, style="bold cyan")
    bar.append("░" * empty, style="dim")
    return bar


# ── Known "System Data" locations ────────────────────────────────────────────

@dataclass
class ScanTarget:
    label: str
    path: Path
    category: str
    note: str = ""


def build_targets(home: Path) -> list[ScanTarget]:
    """Return the list of directories to scan, grouped by category."""
    targets: list[ScanTarget] = []

    def t(label: str, path: str | Path, cat: str, note: str = ""):
        p = Path(path).expanduser()
        targets.append(ScanTarget(label, p, cat, note))

    # ── Xcode ────────────────────────────────────────────────────────────
    t("Xcode DerivedData",      home / "Library/Developer/Xcode/DerivedData",       "Xcode", "Build products, indexes – biggest offender")
    t("Xcode Archives",         home / "Library/Developer/Xcode/Archives",           "Xcode", ".xcarchive bundles")
    t("iOS DeviceSupport",      home / "Library/Developer/Xcode/iOS DeviceSupport",  "Xcode", "Debug symbols per iOS version")
    t("watchOS DeviceSupport",  home / "Library/Developer/Xcode/watchOS DeviceSupport", "Xcode")
    t("macOS DeviceSupport",    home / "Library/Developer/Xcode/macOS DeviceSupport", "Xcode")
    t("CoreSimulator (user)",   home / "Library/Developer/CoreSimulator",            "Xcode", "Simulator device data")
    t("Xcode Caches",           home / "Library/Caches/com.apple.dt.Xcode",         "Xcode")
    t("Swift PM Cache",         home / "Library/Caches/org.swift.swiftpm",           "Xcode")
    t("Xcode UserData",         home / "Library/Developer/Xcode/UserData",           "Xcode", "Snapshots, font caches, etc.")
    t("Instruments Data",       home / "Library/Developer/Xcode/Products",           "Xcode")

    # ── Caches (general) ─────────────────────────────────────────────────
    t("~/Library/Caches",       home / "Library/Caches",                             "Caches", "All user-level caches")
    t("/Library/Caches",        "/Library/Caches",                                   "Caches", "System-level caches")

    # ── Logs ─────────────────────────────────────────────────────────────
    t("~/Library/Logs",         home / "Library/Logs",                               "Logs")
    t("/var/log",               "/var/log",                                          "Logs")
    t("/Library/Logs",          "/Library/Logs",                                     "Logs")

    # ── Package managers / dev tools ─────────────────────────────────────
    t("Homebrew",               "/opt/homebrew",                                     "Dev Tools", "Apple Silicon Homebrew")
    t("Homebrew (Intel)",       "/usr/local/Homebrew",                               "Dev Tools")
    t("Homebrew Casks Cache",   home / "Library/Caches/Homebrew",                    "Dev Tools")
    t("CocoaPods Cache",        home / "Library/Caches/CocoaPods",                   "Dev Tools")
    t("Carthage",               home / "Library/Caches/org.carthage.CarthageKit",    "Dev Tools")
    t("npm cache",              home / ".npm",                                       "Dev Tools")
    t("yarn cache",             home / "Library/Caches/Yarn",                        "Dev Tools")
    t("pip cache",              home / "Library/Caches/pip",                          "Dev Tools")
    t("uv cache",               home / "Library/Caches/uv",                          "Dev Tools")
    t("Gradle cache",           home / ".gradle",                                    "Dev Tools")
    t("Maven cache",            home / ".m2",                                        "Dev Tools")
    t("Docker Desktop",          home / "Library/Containers/com.docker.docker",       "Dev Tools", "Docker VM disk image + data")
    t("Docker Group Data",       home / "Library/Group Containers/group.com.docker", "Dev Tools")
    t("Rust / Cargo",           home / ".cargo",                                     "Dev Tools")
    t("Go modules",             home / "go",                                         "Dev Tools")

    # ── Simulator runtimes (mounted disk images, often huge) ───────────
    sim_vol_root = Path("/Library/Developer/CoreSimulator/Volumes")
    if sim_vol_root.is_dir():
        try:
            for entry in sorted(sim_vol_root.iterdir()):
                if entry.is_dir():
                    t(f"Sim Runtime {entry.name}", entry, "Xcode", "Mounted simulator runtime image")
        except PermissionError:
            pass

    sim_cryptex = Path("/Library/Developer/CoreSimulator/Cryptex")
    if sim_cryptex.is_dir():
        t("Sim Cryptex Images", sim_cryptex, "Xcode", "Simulator cryptographic extensions")

    # ── macOS system areas ───────────────────────────────────────────────
    t("Preboot volume",         "/System/Volumes/Preboot",                           "System", "Boot configs, paired keys")
    t("VM swap",                "/System/Volumes/VM",                                "System", "Virtual memory swap files")
    t("Time Machine local snapshots", "/var/db/com.apple.timemachine.backup.plist",  "System")
    t("Spotlight index",        "/System/Volumes/Data/.Spotlight-V100",              "System")
    t("APFS snapshots metadata","/var/db/ConfigurationProfiles",                     "System")
    t("Mail data",              home / "Library/Mail",                               "System", "Local copies of mail")
    t("Messages data",          home / "Library/Messages",                           "System")
    t("Application Support",    home / "Library/Application Support",                "System", "App databases, configs, etc.")
    t("/tmp",                   "/tmp",                                              "System")
    t("/private/var/folders",   "/private/var/folders",                              "System", "Per-user temp & cache dirs")
    t("Trash",                  home / ".Trash",                                     "System", "Don't forget to empty it!")

    return targets


# ── Main ─────────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(description="Break down macOS 'System Data' usage.")
    parser.add_argument("--top", type=int, default=40, help="Show top N entries (default 40)")
    parser.add_argument("--min-gb", type=float, default=0.1, help="Hide entries smaller than this (default 0.1 GB)")
    parser.add_argument("--all", action="store_true", help="Show all entries, ignoring --min-gb")
    args = parser.parse_args()

    console = Console()

    home = Path.home()
    console.print()

    # ── Disk overview ────────────────────────────────────────────────────
    disks = get_disk_info()
    disk_lines = []
    for d in disks:
        disk_lines.append(
            f"  [cyan]{d['mount']:30s}[/cyan]  {d['size']:>6s} total, "
            f"{d['used']:>6s} used, {d['avail']:>6s} free ({d['pct']} full)"
        )
    disk_section = "\n".join(disk_lines) if disk_lines else "  (could not detect disks)"

    console.print(Panel(
        f"[bold]macOS 'System Data' Breakdown[/bold]\n"
        f"Scanning common locations under [cyan]{home}[/cyan] and system paths.\n"
        f"Run with [bold]sudo[/bold] for a more complete picture of system directories.\n\n"
        f"[bold]Disks:[/bold]\n{disk_section}",
        border_style="blue",
    ))

    targets = build_targets(home)

    external_volumes = _get_external_volumes()
    results: list[tuple[ScanTarget, int]] = []

    # Track which targets live on a different disk
    external_targets: set[str] = set()

    with console.status("[bold cyan]Scanning directories…[/bold cyan]", spinner="dots") as status:
        for i, tgt in enumerate(targets, 1):
            status.update(f"[cyan]({i}/{len(targets)})[/cyan] {tgt.path}")
            if tgt.path.exists():
                resolved = tgt.path.resolve()
                if is_external_disk(resolved, external_volumes):
                    external_targets.add(tgt.label)
                size = get_dir_size(tgt.path)
                results.append((tgt, size))

    # Sort descending by size
    results.sort(key=lambda r: r[1], reverse=True)

    # Filter
    min_bytes = 0 if args.all else int(args.min_gb * 1024**3)
    filtered = [(tgt, sz) for tgt, sz in results if sz >= min_bytes][:args.top]

    if not filtered:
        console.print("[yellow]No directories found above the size threshold.[/yellow]")
        return

    max_size = filtered[0][1] if filtered else 1

    # ── Summary by category ──────────────────────────────────────────────
    cat_totals: dict[str, int] = {}
    cat_totals_external: dict[str, int] = {}
    for tgt, sz in results:
        if tgt.label in external_targets:
            cat_totals_external[tgt.category] = cat_totals_external.get(tgt.category, 0) + sz
        else:
            cat_totals[tgt.category] = cat_totals.get(tgt.category, 0) + sz

    console.print()
    cat_table = Table(title="Category Summary", border_style="blue", show_lines=False)
    cat_table.add_column("Category", style="bold")
    cat_table.add_column("Size", justify="right", style="green")

    grand_total = 0
    for cat, total in sorted(cat_totals.items(), key=lambda x: x[1], reverse=True):
        cat_table.add_row(cat, fmt_size(total))
        grand_total += total

    cat_table.add_section()
    cat_table.add_row("[bold]TOTAL scanned[/bold]", f"[bold]{fmt_size(grand_total)}[/bold]")

    if cat_totals_external:
        ext_total = sum(cat_totals_external.values())
        cat_table.add_section()
        cat_table.add_row(
            "[yellow]External disk[/yellow]",
            f"[yellow]{fmt_size(ext_total)}[/yellow]",
        )

    console.print(cat_table)

    # ── Detailed table ───────────────────────────────────────────────────
    console.print()
    table = Table(
        title=f"Top {len(filtered)} Directories (≥ {args.min_gb} GB)",
        border_style="blue",
        show_lines=False,
        row_styles=["", "dim"],
    )
    table.add_column("#", justify="right", style="dim", width=3)
    table.add_column("Category", style="magenta", width=10)
    table.add_column("Label", style="bold", max_width=28)
    table.add_column("Size", justify="right", style="green", width=12)
    table.add_column("Bar", width=32, no_wrap=True)
    table.add_column("Path", style="dim", max_width=52)

    for i, (tgt, sz) in enumerate(filtered, 1):
        frac = sz / max_size if max_size else 0
        label = tgt.label
        path_str = str(tgt.path)
        if tgt.label in external_targets:
            resolved = tgt.path.resolve()
            label = f"{tgt.label} [yellow]*[/yellow]"
            path_str = f"{tgt.path} -> {resolved}"
        table.add_row(
            str(i),
            tgt.category,
            label,
            fmt_size(sz),
            bar_text(frac),
            path_str,
        )

    console.print(table)

    if external_targets:
        console.print(
            "[yellow]*[/yellow] [dim]= path resolves to a different disk "
            "(not counted toward boot drive usage)[/dim]"
        )

    # ── Actionable tips ──────────────────────────────────────────────────
    console.print()
    tips: list[str] = []

    xcode_derived = next((sz for tgt, sz in results if "DerivedData" in tgt.label and "Xcode" in tgt.category), 0)
    if xcode_derived > 2 * 1024**3:
        tips.append(f"[bold yellow]Xcode DerivedData[/bold yellow] is {fmt_size(xcode_derived)}. "
                     "Set per-project 'Relative to Workspace' or relocate via symlink.")

    sim_size = sum(sz for tgt, sz in results if "Sim Runtime" in tgt.label or "CoreSimulator" in tgt.label or "Sim Cryptex" in tgt.label)
    if sim_size > 5 * 1024**3:
        tips.append(f"[bold yellow]Simulators[/bold yellow] using {fmt_size(sim_size)}. "
                     "Run: [cyan]xcrun simctl delete unavailable[/cyan] and remove old runtimes "
                     "via Xcode > Settings > Platforms")

    ds_size = sum(sz for tgt, sz in results if "DeviceSupport" in tgt.label)
    if ds_size > 3 * 1024**3:
        tips.append(f"[bold yellow]DeviceSupport[/bold yellow] totals {fmt_size(ds_size)}. "
                     "Delete folders for iOS versions you no longer target.")

    trash_size = next((sz for tgt, sz in results if "Trash" in tgt.label), 0)
    if trash_size > 1 * 1024**3:
        tips.append(f"[bold yellow]Trash[/bold yellow] has {fmt_size(trash_size)}. "
                     "Empty it! [cyan]rm -rf ~/.Trash/*[/cyan]")

    docker_size = sum(sz for tgt, sz in results if "Docker" in tgt.label)
    if docker_size > 5 * 1024**3:
        tips.append(f"[bold yellow]Docker[/bold yellow] is using {fmt_size(docker_size)}. "
                     "Run: [cyan]docker system prune -a[/cyan]")

    cache_size = next((sz for tgt, sz in results if tgt.label == "~/Library/Caches"), 0)
    if cache_size > 10 * 1024**3:
        tips.append(f"[bold yellow]User caches[/bold yellow] total {fmt_size(cache_size)}. "
                     "Safe to clear most app caches. Inspect subdirectories first.")

    if tips:
        console.print(Panel(
            "\n".join(f"  • {tip}" for tip in tips),
            title="[bold]Recommendations[/bold]",
            border_style="yellow",
        ))
    else:
        console.print("[green]Nothing looks particularly bloated. Nice![/green]")

    console.print()
    console.print("[dim]Note: Some system directories require sudo for accurate sizing. "
                  "Re-run with [bold]sudo uv run system_data_breakdown.py[/bold] for a fuller picture.[/dim]")
    console.print()


if __name__ == "__main__":
    main()
