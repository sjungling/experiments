// Tab Group Manager — Side Panel Logic
'use strict';

// Chrome's tab group color names → CSS hex values
const GROUP_COLORS = {
  grey: '#5f6368',
  blue: '#4285f4',
  red: '#ea4335',
  yellow: '#fbbc04',
  green: '#34a853',
  pink: '#ff7769',
  purple: '#a142f4',
  cyan: '#24c1e0',
  orange: '#fa903e',
};

const DEFAULT_FAVICON = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5f6368" stroke-width="2"><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="2" y1="9" x2="22" y2="9"/></svg>'
);

async function fetchData() {
  const [groups, tabs, windows] = await Promise.all([
    chrome.tabGroups.query({}),
    chrome.tabs.query({}),
    chrome.windows.getAll(),
  ]);

  // Build tab lookup by groupId
  const tabsByGroup = {};
  for (const tab of tabs) {
    if (tab.groupId !== -1) {
      if (!tabsByGroup[tab.groupId]) tabsByGroup[tab.groupId] = [];
      tabsByGroup[tab.groupId].push(tab);
    }
  }

  // Sort windows by ID for stable ordering
  const sortedWindows = [...windows].sort((a, b) => a.id - b.id);

  // Organize groups by window
  const windowData = [];
  for (let i = 0; i < sortedWindows.length; i++) {
    const win = sortedWindows[i];
    const winGroups = groups
      .filter(g => g.windowId === win.id)
      .map(g => ({
        ...g,
        tabs: tabsByGroup[g.id] || [],
      }));
    if (winGroups.length > 0) {
      windowData.push({
        windowId: win.id,
        label: `Window ${i + 1}`,
        groups: winGroups,
      });
    }
  }

  return windowData;
}

const groupListEl = document.getElementById('group-list');
const emptyStateEl = document.getElementById('empty-state');
const headerEl = document.getElementById('header');

// Track expanded groups (persists across re-renders)
const expandedGroups = new Set();

const selectedGroups = new Set();
let lastClickedIndex = null;
let selectionMode = false;

const actionBarEl = document.getElementById('action-bar');
const selectionCountEl = document.getElementById('selection-count');
const cancelBtn = document.getElementById('cancel-btn');
const deleteBtn = document.getElementById('delete-btn');
const confirmDialog = document.getElementById('confirm-dialog');
const confirmTitle = document.getElementById('confirm-title');
const confirmSubtitle = document.getElementById('confirm-subtitle');
const confirmGroupsEl = document.getElementById('confirm-groups');
const confirmCancel = document.getElementById('confirm-cancel');
const confirmDeleteBtn = document.getElementById('confirm-delete');

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function enterSelectionMode() {
  selectionMode = true;
  document.body.classList.add('selection-mode');
  headerEl.hidden = true;
  actionBarEl.hidden = false;
  updateSelectionUI();
}

function exitSelectionMode() {
  selectionMode = false;
  selectedGroups.clear();
  lastClickedIndex = null;
  document.body.classList.remove('selection-mode');
  headerEl.hidden = false;
  actionBarEl.hidden = true;
  refresh();
}

function updateSelectionUI() {
  const count = selectedGroups.size;
  selectionCountEl.textContent = `${count} selected`;

  document.querySelectorAll('.group-row').forEach(row => {
    const id = Number(row.dataset.groupId);
    row.classList.toggle('selected', selectedGroups.has(id));
    const checkbox = row.querySelector('.group-checkbox');
    if (checkbox) {
      checkbox.classList.toggle('checked', selectedGroups.has(id));
      checkbox.innerHTML = selectedGroups.has(id)
        ? '<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        : '';
    }
  });
}

cancelBtn.addEventListener('click', exitSelectionMode);

deleteBtn.addEventListener('click', async () => {
  const data = await fetchData();
  const allGroups = data.flatMap(w => w.groups);
  const toDelete = allGroups.filter(g => selectedGroups.has(g.id));

  if (toDelete.length === 0) return;

  const totalTabs = toDelete.reduce((sum, g) => sum + g.tabs.length, 0);

  confirmTitle.textContent = `Delete ${toDelete.length} tab group${toDelete.length !== 1 ? 's' : ''}?`;
  confirmSubtitle.textContent = `This will close ${totalTabs} tab${totalTabs !== 1 ? 's' : ''}`;

  confirmGroupsEl.innerHTML = toDelete.map(g => `
    <span class="confirm-group-chip">
      <span class="confirm-group-dot" style="background: ${GROUP_COLORS[g.color] || '#5f6368'}"></span>
      ${escapeHtml(g.title || 'Unnamed')} (${g.tabs.length})
    </span>
  `).join('');

  confirmDeleteBtn.textContent = `Delete ${toDelete.length} Group${toDelete.length !== 1 ? 's' : ''}`;
  confirmDialog.hidden = false;
});

confirmCancel.addEventListener('click', () => {
  confirmDialog.hidden = true;
});

confirmDeleteBtn.addEventListener('click', async () => {
  confirmDialog.hidden = true;

  const data = await fetchData();
  const allGroups = data.flatMap(w => w.groups);
  const toDelete = allGroups.filter(g => selectedGroups.has(g.id));

  const removals = toDelete.map(g => {
    const tabIds = g.tabs.map(t => t.id);
    return chrome.tabs.remove(tabIds).catch(() => {});
  });
  await Promise.allSettled(removals);

  exitSelectionMode();
});

function render(windowData) {
  groupListEl.innerHTML = '';

  // Flatten for indexing
  const allGroups = windowData.flatMap(w => w.groups);

  // Clean up selections for groups that no longer exist
  const existingIds = new Set(allGroups.map(g => g.id));
  for (const id of selectedGroups) {
    if (!existingIds.has(id)) selectedGroups.delete(id);
  }
  if (selectionMode && selectedGroups.size === 0) {
    exitSelectionMode();
    return;
  }

  if (allGroups.length === 0) {
    emptyStateEl.hidden = false;
    headerEl.hidden = false;
    return;
  }

  emptyStateEl.hidden = true;
  headerEl.hidden = false;

  for (const win of windowData) {
    const section = document.createElement('div');
    section.className = 'window-section';

    const label = document.createElement('div');
    label.className = 'window-label';
    label.textContent = win.label;
    section.appendChild(label);

    for (const group of win.groups) {
      const isExpanded = expandedGroups.has(group.id);

      // Group row
      const row = document.createElement('div');
      row.className = 'group-row' + (isExpanded ? ' expanded' : '');
      row.dataset.groupId = group.id;

      row.innerHTML = `
        <div class="group-checkbox${selectedGroups.has(group.id) ? ' checked' : ''}">
          ${selectedGroups.has(group.id) ? '<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}
        </div>
        <svg class="group-chevron" width="12" height="12" viewBox="0 0 12 12">
          <path d="M3 4.5l3 3 3-3"/>
        </svg>
        <div class="group-color" style="background: ${GROUP_COLORS[group.color] || '#5f6368'}"></div>
        <div class="group-info">
          <span class="group-name">${escapeHtml(group.title || 'Unnamed')}</span>
          <span class="group-tab-count">${group.tabs.length} tab${group.tabs.length !== 1 ? 's' : ''}</span>
        </div>
      `;

      if (selectedGroups.has(group.id)) row.classList.add('selected');

      const flatIndex = allGroups.indexOf(group);

      row.addEventListener('click', (e) => {
        if (e.metaKey || e.ctrlKey) {
          if (selectedGroups.has(group.id)) {
            selectedGroups.delete(group.id);
          } else {
            selectedGroups.add(group.id);
          }
          lastClickedIndex = flatIndex;
          if (!selectionMode) enterSelectionMode();
          else if (selectedGroups.size === 0) exitSelectionMode();
          else updateSelectionUI();
        } else if (e.shiftKey) {
          if (lastClickedIndex === null) {
            selectedGroups.add(group.id);
            lastClickedIndex = flatIndex;
          } else {
            const start = Math.min(lastClickedIndex, flatIndex);
            const end = Math.max(lastClickedIndex, flatIndex);
            for (let i = start; i <= end; i++) {
              selectedGroups.add(allGroups[i].id);
            }
          }
          lastClickedIndex = flatIndex;
          if (!selectionMode) enterSelectionMode();
          else updateSelectionUI();
        } else if (selectionMode) {
          if (selectedGroups.has(group.id)) {
            selectedGroups.delete(group.id);
          } else {
            selectedGroups.add(group.id);
          }
          if (selectedGroups.size === 0) exitSelectionMode();
          else updateSelectionUI();
        } else {
          if (expandedGroups.has(group.id)) {
            expandedGroups.delete(group.id);
          } else {
            expandedGroups.add(group.id);
          }
          rerender();
        }
      });

      section.appendChild(row);

      // Tab list (shown if expanded)
      const tabList = document.createElement('div');
      tabList.className = 'tab-list' + (isExpanded ? ' expanded' : '');

      for (const tab of group.tabs) {
        const tabRow = document.createElement('div');
        tabRow.className = 'tab-row';

        const favicon = tab.favIconUrl && !tab.favIconUrl.startsWith('chrome://')
          ? tab.favIconUrl : DEFAULT_FAVICON;

        const img = document.createElement('img');
        img.className = 'tab-favicon';
        img.src = favicon;
        img.onerror = () => { img.src = DEFAULT_FAVICON; };

        const title = document.createElement('span');
        title.className = 'tab-title';
        title.textContent = tab.title || tab.url || 'Untitled';

        tabRow.appendChild(img);
        tabRow.appendChild(title);

        tabRow.addEventListener('click', async (e) => {
          e.stopPropagation();
          await chrome.tabs.update(tab.id, { active: true });
          await chrome.windows.update(tab.windowId, { focused: true });
        });

        tabList.appendChild(tabRow);
      }

      section.appendChild(tabList);
    }

    groupListEl.appendChild(section);
  }
}

let lastWindowData = [];

async function refresh() {
  lastWindowData = await fetchData();
  render(lastWindowData);
}

function rerender() {
  render(lastWindowData);
}

// Debounced refresh for event listeners
let refreshTimer = null;
function debouncedRefresh() {
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(refresh, 100);
}

// Re-render when tabs, groups, or windows change
chrome.tabGroups.onCreated.addListener(debouncedRefresh);
chrome.tabGroups.onRemoved.addListener(debouncedRefresh);
chrome.tabGroups.onUpdated.addListener(debouncedRefresh);
chrome.tabs.onCreated.addListener(debouncedRefresh);
chrome.tabs.onRemoved.addListener(debouncedRefresh);
chrome.tabs.onUpdated.addListener(debouncedRefresh);
chrome.tabs.onAttached.addListener(debouncedRefresh);
chrome.tabs.onDetached.addListener(debouncedRefresh);
chrome.windows.onRemoved.addListener(debouncedRefresh);
chrome.windows.onCreated.addListener(debouncedRefresh);

// Initial load
refresh();
