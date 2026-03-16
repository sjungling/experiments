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

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function render(windowData) {
  groupListEl.innerHTML = '';

  // Flatten for indexing
  const allGroups = windowData.flatMap(w => w.groups);

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
        <svg class="group-chevron" width="12" height="12" viewBox="0 0 12 12">
          <path d="M3 4.5l3 3 3-3"/>
        </svg>
        <div class="group-color" style="background: ${GROUP_COLORS[group.color] || '#5f6368'}"></div>
        <div class="group-info">
          <span class="group-name">${escapeHtml(group.title || 'Unnamed')}</span>
          <span class="group-tab-count">${group.tabs.length} tab${group.tabs.length !== 1 ? 's' : ''}</span>
        </div>
      `;

      row.addEventListener('click', () => {
        if (expandedGroups.has(group.id)) {
          expandedGroups.delete(group.id);
        } else {
          expandedGroups.add(group.id);
        }
        rerender();
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

// Initial load
refresh();
