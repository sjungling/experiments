# Tab Group Manager — Chrome Extension Design

## Overview

A Chrome extension that renders a Side Panel listing all tab groups across all browser windows, with multi-select deletion as the primary action.

## Problem

Chrome provides no built-in way to view tab groups across windows or bulk-delete them. Users accumulate tab groups over time and need a fast way to clean up.

## Architecture

**Type:** Chrome Extension (Manifest V3)
**UI Surface:** Chrome Side Panel API
**Tech Stack:** Vanilla HTML/CSS/JS — no framework, no build step
**Permissions:** `tabGroups`, `tabs`, `sidePanel`, `windows`

### Manifest

The `manifest.json` must declare:
- `"side_panel": { "default_path": "sidepanel.html" }` to wire up the side panel
- `"action": {}` for the toolbar icon
- A background service worker that calls `chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })` so clicking the toolbar icon opens the side panel

### File Structure

```
tab-group-manager/
├── manifest.json          # Extension manifest (MV3)
├── background.js          # Service worker: sets side panel open behavior
├── sidepanel.html         # Side panel markup
├── sidepanel.css          # Chrome-native styling
├── sidepanel.js           # All logic: data fetching, rendering, selection, deletion
└── icons/
    ├── icon-16.png
    ├── icon-48.png
    └── icon-128.png
```

`sidepanel.js` handles all UI logic. `background.js` is minimal — just the `setPanelBehavior` call.

## UI Design

### Visual Style

Chrome-native: white background, Google Sans/Roboto, standard Chrome grays (#202124, #5f6368, #dadce0). Matches the look of Chrome's built-in bookmarks/history side panels.

### Layout

**Header:** Title "Tab Groups" — replaced by a blue action bar (#e8f0fe) when groups are selected.

**Group List:** Organized by window with labeled section dividers ("Window 1", "Window 2", etc.). Window labels are assigned by stable window ID order within a render cycle — if windows change between renders, labels may shift, which is acceptable for this scope. Each group row shows:
- Collapse/expand chevron
- Chrome color dot (maps to the group's `color` property)
- Group name (or "Unnamed" for unnamed groups)
- Tab count

**Expanded Tab List:** Indented under the group. Each tab shows:
- Favicon (from `tab.favIconUrl`, with a generic page icon fallback for missing/broken/chrome:// URLs)
- Page title (truncated with ellipsis)

**Groups are collapsed by default.** Click the group row to expand/collapse.

### Selection Mode

Selection mode is not active by default. It activates when the user:
- **⌘/Ctrl+Click** a group row — toggles that group into the selection
- **⇧+Click** a group row — selects the range from the last-clicked group to the current one

Once active:
- Material checkboxes appear next to each group row
- A blue action bar replaces the header: "[N] selected" + "Cancel" and "Delete" buttons
- Selected rows get a blue background (#e8f0fe)

**Cancel** exits selection mode and clears all selections.
**Plain click** (no modifier) while in selection mode toggles the clicked group's checkbox.

### Deletion Flow

1. User selects one or more groups via ⌘+Click / ⇧+Click
2. User clicks "Delete" in the action bar
3. Confirmation dialog appears inline:
   - "Delete [N] tab groups?"
   - "This will close [X] tabs"
   - Lists affected groups by name with color dots
   - "Cancel" / "Delete [N] Groups" buttons
4. On confirm: close all tabs in the selected groups via `chrome.tabs.remove()`, which implicitly removes the now-empty groups
5. UI re-renders from fresh API data

### Tab Navigation

Clicking a tab title in an expanded group:
1. Switches to that tab via `chrome.tabs.update(tabId, { active: true })`
2. Focuses the tab's window via `chrome.windows.update(windowId, { focused: true })`

## Data Flow

### Fetching State

```
chrome.tabGroups.query({}) → all groups across all windows
chrome.tabs.query({})      → all tabs, filtered by groupId
chrome.windows.getAll()    → window list for labeling
```

Group tabs by `groupId`, then organize groups by `windowId`. `TabGroup.windowId` is the join key between groups and the windows list.

### Keeping State Fresh

Listen to these events to re-render automatically:
- `chrome.tabGroups.onCreated` / `onRemoved` / `onUpdated`
- `chrome.tabs.onCreated` / `onRemoved` / `onUpdated` / `onAttached` / `onDetached`
- `chrome.windows.onRemoved` (to update window labels when a window closes)

On any event: re-fetch all data and re-render. The dataset is small enough that this is simpler and safer than incremental updates.

### Deletion

For each selected group, collect all tab IDs, then:
```js
await chrome.tabs.remove(tabIds);
```
Removing all tabs in a group automatically removes the group itself. No separate `tabGroups.remove()` call needed.

## Selection Logic (Detail)

Track selection state in a `Set<groupId>`. Track `lastClickedIndex` for shift-click range selection.

```
Click (no modifier):
  - If selection mode active: toggle clicked group in Set
  - If selection mode inactive: expand/collapse group

⌘/Ctrl+Click:
  - Toggle clicked group in Set
  - Enter selection mode if not already active
  - Update lastClickedIndex

⇧+Click:
  - If lastClickedIndex is null (no prior ⌘+Click), treat as a ⌘+Click (select just the clicked group)
  - Otherwise, select range from lastClickedIndex to clicked index (inclusive)
  - Enter selection mode if not already active

Cancel:
  - Clear Set
  - Exit selection mode
```

Flat ordering for range selection: groups are ordered as rendered (Window 1 groups first, then Window 2, etc.).

## Error Handling

- `chrome.tabs.remove()` rejects the entire promise if any ID is invalid. Remove tabs per-group (one `remove()` call per group's tab array), use `Promise.allSettled()` to allow partial success, then re-render from fresh data. If some groups fail to delete, they'll simply remain visible after re-render.
- If no tab groups exist, show a centered empty state: "No tab groups found."

## Testing

Manual testing via `chrome://extensions` → Load unpacked. No automated test framework for v1 — the extension is small enough that manual verification covers it.

**Test cases:**
1. Extension loads and shows all groups across multiple windows
2. Groups collapse/expand on click
3. ⌘+Click enters selection mode and toggles groups
4. ⇧+Click selects a range
5. Delete confirmation shows correct counts
6. Deletion closes tabs and removes groups
7. Clicking a tab navigates to it and focuses the window
8. Real-time updates when groups/tabs change externally
9. Empty state when no groups exist
