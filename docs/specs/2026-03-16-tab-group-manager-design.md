# Tab Group Manager — Chrome Extension Design

## Overview

A Chrome extension that renders a Side Panel listing all tab groups across all browser windows, with multi-select deletion as the primary action.

## Problem

Chrome provides no built-in way to view tab groups across windows or bulk-delete them. Users accumulate tab groups over time and need a fast way to clean up.

## Architecture

**Type:** Chrome Extension (Manifest V3)
**UI Surface:** Chrome Side Panel API
**Tech Stack:** Vanilla HTML/CSS/JS — no framework, no build step
**Permissions:** `tabGroups`, `tabs`, `sidePanel`

### File Structure

```
tab-group-manager/
├── manifest.json          # Extension manifest (MV3)
├── sidepanel.html         # Side panel markup
├── sidepanel.css          # Chrome-native styling
├── sidepanel.js           # All logic: data fetching, rendering, selection, deletion
└── icons/
    ├── icon-16.png
    ├── icon-48.png
    └── icon-128.png
```

Single JS file is appropriate given the small scope. No modules or splitting needed.

## UI Design

### Visual Style

Chrome-native: white background, Google Sans/Roboto, standard Chrome grays (#202124, #5f6368, #dadce0). Matches the look of Chrome's built-in bookmarks/history side panels.

### Layout

**Header:** Title "Tab Groups" — replaced by a blue action bar (#e8f0fe) when groups are selected.

**Group List:** Organized by window with labeled section dividers ("Window 1", "Window 2", etc.). Each group row shows:
- Collapse/expand chevron
- Chrome color dot (maps to the group's `color` property)
- Group name (or "Unnamed" for unnamed groups)
- Tab count

**Expanded Tab List:** Indented under the group. Each tab shows:
- Favicon (from `tab.favIconUrl`)
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

Group tabs by `groupId`, then organize groups by `windowId`.

### Keeping State Fresh

Listen to these events to re-render automatically:
- `chrome.tabGroups.onCreated` / `onRemoved` / `onUpdated`
- `chrome.tabs.onCreated` / `onRemoved` / `onUpdated` / `onAttached` / `onDetached`

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
  - Select range from lastClickedIndex to clicked index (inclusive)
  - Enter selection mode if not already active

Cancel:
  - Clear Set
  - Exit selection mode
```

Flat ordering for range selection: groups are ordered as rendered (Window 1 groups first, then Window 2, etc.).

## Error Handling

- If a tab/group is closed between render and user action, `chrome.tabs.remove()` will reject for that ID — catch and ignore stale IDs, re-render.
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
