# Parts Data Grid Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add clickable piece IDs in instructions that open detail modals, plus a full Parts List grid view grouped by step.

**Architecture:** Convert XLSX to JS at build time via `uv run`. New JS modules handle modal and grid UI. Part links in instructions are created by regex replacement at render time.

**Tech Stack:** Vanilla JS, CSS, Python/openpyxl for conversion, uv for Python execution.

---

## Task 1: Create XLSX to JSON Conversion Script

**Files:**
- Create: `shed/scripts/convert-parts.py`

**Step 1: Create the conversion script**

```python
#!/usr/bin/env python3
"""Convert shed_cut_sheet_with_ids.xlsx to parts-data.js"""

import json
from pathlib import Path

try:
    from openpyxl import load_workbook
except ImportError:
    import subprocess
    import sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "openpyxl", "-q"])
    from openpyxl import load_workbook

def main():
    script_dir = Path(__file__).parent
    data_file = script_dir.parent / "data" / "shed_cut_sheet_with_ids.xlsx"
    output_file = script_dir.parent / "js" / "parts-data.js"

    wb = load_workbook(data_file)
    ws = wb.active

    # Get headers from first row
    headers = [cell.value for cell in ws[1]]

    parts = []
    for row in ws.iter_rows(min_row=2, values_only=True):
        # Skip section header rows (no Piece ID)
        if row[0] is None:
            continue

        part = {
            "id": row[0],
            "description": row[1] or "",
            "material": row[2] or "",
            "length": str(row[3]) if row[3] else "",
            "qty": row[4] if row[4] else 1,
            "step": row[5] if row[5] else 0,
            "notes": row[6] or ""
        }
        parts.append(part)

    # Write as JS module
    js_content = f"// Generated from shed_cut_sheet_with_ids.xlsx - DO NOT EDIT\nconst partsData = {json.dumps(parts, indent=2)};\n"

    output_file.write_text(js_content)
    print(f"Generated {output_file} with {len(parts)} parts")

if __name__ == "__main__":
    main()
```

**Step 2: Run the script to generate parts-data.js**

Run: `cd /Volumes/Data/Work/play/experiments/shed && uv run scripts/convert-parts.py`
Expected: "Generated .../js/parts-data.js with X parts"

**Step 3: Verify the generated file**

Run: `head -20 /Volumes/Data/Work/play/experiments/shed/js/parts-data.js`
Expected: JS file with partsData array

**Step 4: Commit**

```bash
git add shed/scripts/convert-parts.py shed/js/parts-data.js
git commit -m "feat(shed): add XLSX to JS conversion script for parts data"
```

---

## Task 2: Add Parts Modal Component

**Files:**
- Create: `shed/js/parts-modal.js`
- Modify: `shed/css/styles.css`
- Modify: `shed/index.html`

**Step 1: Create the modal JS module**

```javascript
// Parts Modal - displays part details
const PartsModal = {
    modalEl: null,

    init() {
        // Create modal container if not exists
        if (!document.getElementById('parts-modal')) {
            const modal = document.createElement('div');
            modal.id = 'parts-modal';
            modal.className = 'parts-modal';
            modal.innerHTML = `
                <div class="parts-modal-backdrop"></div>
                <div class="parts-modal-content">
                    <button class="parts-modal-close" aria-label="Close">&times;</button>
                    <div class="parts-modal-body"></div>
                </div>
            `;
            document.body.appendChild(modal);
            this.modalEl = modal;

            // Close handlers
            modal.querySelector('.parts-modal-backdrop').addEventListener('click', () => this.close());
            modal.querySelector('.parts-modal-close').addEventListener('click', () => this.close());
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.modalEl.classList.contains('open')) {
                    this.close();
                }
            });
        }
    },

    open(partId) {
        const part = partsData.find(p => p.id === partId);
        if (!part) {
            console.warn(`Part not found: ${partId}`);
            return;
        }

        const stepTitle = steps[part.step - 1]?.title || `Step ${part.step}`;

        const body = this.modalEl.querySelector('.parts-modal-body');
        body.innerHTML = `
            <h2 class="parts-modal-id">${part.id}</h2>
            <p class="parts-modal-desc">${part.description}</p>
            <dl class="parts-modal-details">
                <div class="parts-modal-row">
                    <dt>Material</dt>
                    <dd>${part.material}</dd>
                </div>
                <div class="parts-modal-row">
                    <dt>Size</dt>
                    <dd>${part.length}</dd>
                </div>
                <div class="parts-modal-row">
                    <dt>Quantity</dt>
                    <dd>${part.qty}</dd>
                </div>
                <div class="parts-modal-row">
                    <dt>Step</dt>
                    <dd>${stepTitle}</dd>
                </div>
                ${part.notes ? `
                <div class="parts-modal-row full-width">
                    <dt>Notes</dt>
                    <dd>${part.notes}</dd>
                </div>
                ` : ''}
            </dl>
            <button class="parts-modal-goto" data-step="${part.step - 1}">
                Go to Step ${part.step}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
            </button>
        `;

        // Go to step handler
        body.querySelector('.parts-modal-goto').addEventListener('click', (e) => {
            const stepIndex = parseInt(e.currentTarget.dataset.step);
            this.close();
            loadStep(stepIndex);
        });

        this.modalEl.classList.add('open');
        document.body.style.overflow = 'hidden';
    },

    close() {
        this.modalEl.classList.remove('open');
        document.body.style.overflow = '';
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => PartsModal.init());
```

**Step 2: Add modal CSS to styles.css**

Add at end of `shed/css/styles.css`:

```css
/* Parts Modal */
.parts-modal {
    display: none;
    position: fixed;
    inset: 0;
    z-index: 1000;
}

.parts-modal.open {
    display: flex;
    align-items: center;
    justify-content: center;
}

.parts-modal-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
}

.parts-modal-content {
    position: relative;
    background: var(--bg-panel);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    width: 90%;
    max-width: 420px;
    max-height: 90vh;
    overflow-y: auto;
    padding: 1.5rem;
}

.parts-modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 32px;
    height: 32px;
    border: none;
    background: var(--bg-card);
    color: var(--text-secondary);
    border-radius: 8px;
    font-size: 1.5rem;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.parts-modal-close:hover {
    background: var(--border-color);
    color: var(--text-primary);
}

.parts-modal-id {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 1.5rem;
    color: var(--accent-yellow);
    margin-bottom: 0.5rem;
}

.parts-modal-desc {
    font-size: 1.1rem;
    color: var(--text-primary);
    margin-bottom: 1.5rem;
}

.parts-modal-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.parts-modal-row {
    background: var(--bg-card);
    padding: 0.75rem 1rem;
    border-radius: 8px;
}

.parts-modal-row.full-width {
    grid-column: 1 / -1;
}

.parts-modal-row dt {
    font-size: 0.75rem;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.25rem;
}

.parts-modal-row dd {
    font-size: 0.95rem;
    color: var(--text-primary);
    font-family: 'IBM Plex Mono', monospace;
}

.parts-modal-goto {
    width: 100%;
    padding: 1rem;
    border: none;
    background: var(--accent-orange);
    color: white;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 1rem;
    font-weight: 500;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: background 0.2s;
}

.parts-modal-goto:hover {
    background: #ff5722;
}
```

**Step 3: Add script tag to index.html**

In `shed/index.html`, add after line 134 (after steps-data.js):

```html
    <script src="js/parts-data.js"></script>
    <script src="js/parts-modal.js"></script>
```

**Step 4: Test modal opens (manual)**

Open `http://localhost:8000/shed/` and run in console:
```javascript
PartsModal.open('F-BLK-01');
```
Expected: Modal opens with part details

**Step 5: Commit**

```bash
git add shed/js/parts-modal.js shed/css/styles.css shed/index.html
git commit -m "feat(shed): add parts detail modal component"
```

---

## Task 3: Make Piece IDs Clickable in Instructions

**Files:**
- Modify: `shed/js/app.js`
- Modify: `shed/css/styles.css`

**Step 1: Add part link CSS**

Add to `shed/css/styles.css` after the existing `.steps-list strong` rule (around line 476):

```css
/* Clickable part links in instructions */
.part-link {
    color: var(--accent-yellow);
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.8rem;
    background: rgba(255, 194, 51, 0.15);
    padding: 0.1rem 0.3rem;
    border-radius: 3px;
    text-decoration: none;
    cursor: pointer;
    border-bottom: 1px dashed var(--accent-yellow);
    transition: all 0.2s;
}

.part-link:hover {
    background: rgba(255, 194, 51, 0.3);
    border-bottom-style: solid;
}
```

**Step 2: Add linkifyPartIds function to app.js**

Add before the `loadStep` function in `shed/js/app.js`:

```javascript
// Convert <strong>PART-ID</strong> to clickable links
function linkifyPartIds(html) {
    // Match part IDs in strong tags - pattern covers all ID formats
    return html.replace(/<strong>([A-Z]+-[A-Z0-9]+-\d+)<\/strong>/g,
        '<a href="#" class="part-link" data-part-id="$1">$1</a>');
}
```

**Step 3: Update loadStep to use linkifyPartIds**

In `shed/js/app.js`, modify the instructions rendering (around line 100-102).

Change:
```javascript
            <ol class="steps-list">
                ${step.instructions.map(inst => `<li>${inst}</li>`).join('')}
            </ol>
```

To:
```javascript
            <ol class="steps-list">
                ${step.instructions.map(inst => `<li>${linkifyPartIds(inst)}</li>`).join('')}
            </ol>
```

**Step 4: Add click handler for part links**

Add at end of `shed/js/app.js`:

```javascript
// Handle part link clicks
document.addEventListener('click', (e) => {
    const link = e.target.closest('.part-link');
    if (link) {
        e.preventDefault();
        const partId = link.dataset.partId;
        PartsModal.open(partId);
    }
});
```

**Step 5: Test part links (manual)**

Open `http://localhost:8000/shed/`, go to Step 1.
Click on "F-BLK-01" in the instructions.
Expected: Modal opens with F-BLK-01 details.

**Step 6: Commit**

```bash
git add shed/js/app.js shed/css/styles.css
git commit -m "feat(shed): make piece IDs clickable to open modal"
```

---

## Task 4: Add Parts List Grid View

**Files:**
- Create: `shed/js/parts-grid.js`
- Modify: `shed/css/styles.css`
- Modify: `shed/index.html`
- Modify: `shed/js/app.js`

**Step 1: Create the grid JS module**

```javascript
// Parts Grid - full parts list grouped by step
const PartsGrid = {
    containerEl: null,
    expandedSteps: new Set([1]), // Start with step 1 expanded
    searchTerm: '',

    init() {
        this.containerEl = document.getElementById('parts-grid-container');
    },

    show() {
        if (!this.containerEl) return;
        this.render();
        this.containerEl.style.display = 'block';
    },

    hide() {
        if (!this.containerEl) return;
        this.containerEl.style.display = 'none';
    },

    render() {
        // Group parts by step
        const byStep = {};
        partsData.forEach(part => {
            const step = part.step || 0;
            if (!byStep[step]) byStep[step] = [];
            byStep[step].push(part);
        });

        // Filter by search term
        const term = this.searchTerm.toLowerCase();
        const filteredByStep = {};
        let hasResults = false;

        Object.keys(byStep).forEach(step => {
            const filtered = byStep[step].filter(part =>
                !term ||
                part.id.toLowerCase().includes(term) ||
                part.description.toLowerCase().includes(term) ||
                part.material.toLowerCase().includes(term)
            );
            if (filtered.length > 0) {
                filteredByStep[step] = filtered;
                hasResults = true;
                // Auto-expand steps with search matches
                if (term) this.expandedSteps.add(parseInt(step));
            }
        });

        // Build HTML
        let html = `
            <div class="parts-grid-search">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                <input type="text" placeholder="Search parts..." value="${this.searchTerm}" id="parts-search-input">
            </div>
        `;

        if (!hasResults) {
            html += `<div class="parts-grid-empty">No parts match "${this.searchTerm}"</div>`;
        } else {
            const sortedSteps = Object.keys(filteredByStep).map(Number).sort((a, b) => a - b);

            sortedSteps.forEach(stepNum => {
                const parts = filteredByStep[stepNum];
                const stepTitle = steps[stepNum - 1]?.title || `Step ${stepNum}`;
                const isExpanded = this.expandedSteps.has(stepNum);

                html += `
                    <div class="parts-grid-group">
                        <button class="parts-grid-header ${isExpanded ? 'expanded' : ''}" data-step="${stepNum}">
                            <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9 18l6-6-6-6"/>
                            </svg>
                            <span class="step-title">${stepTitle}</span>
                            <span class="step-count">${parts.length} piece${parts.length !== 1 ? 's' : ''}</span>
                        </button>
                        <div class="parts-grid-rows ${isExpanded ? 'expanded' : ''}">
                            ${parts.map(part => `
                                <button class="parts-grid-row" data-part-id="${part.id}">
                                    <span class="part-id">${part.id}</span>
                                    <span class="part-desc">${part.description}</span>
                                    <span class="part-qty">${part.qty}</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M9 18l6-6-6-6"/>
                                    </svg>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                `;
            });
        }

        this.containerEl.innerHTML = html;

        // Attach event handlers
        this.containerEl.querySelector('#parts-search-input')?.addEventListener('input', (e) => {
            this.searchTerm = e.target.value;
            this.render();
            // Re-focus input after render
            this.containerEl.querySelector('#parts-search-input')?.focus();
        });

        this.containerEl.querySelectorAll('.parts-grid-header').forEach(btn => {
            btn.addEventListener('click', () => {
                const step = parseInt(btn.dataset.step);
                if (this.expandedSteps.has(step)) {
                    this.expandedSteps.delete(step);
                } else {
                    this.expandedSteps.add(step);
                }
                this.render();
            });
        });

        this.containerEl.querySelectorAll('.parts-grid-row').forEach(btn => {
            btn.addEventListener('click', () => {
                PartsModal.open(btn.dataset.partId);
            });
        });
    }
};

document.addEventListener('DOMContentLoaded', () => PartsGrid.init());
```

**Step 2: Add grid CSS**

Add at end of `shed/css/styles.css`:

```css
/* Parts Grid View */
#parts-grid-container {
    display: none;
    background: var(--bg-panel);
    border-radius: 16px;
    border: 1px solid var(--border-color);
    overflow: hidden;
    margin-bottom: 2rem;
    max-height: 600px;
    overflow-y: auto;
}

.parts-grid-search {
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    position: sticky;
    top: 0;
    background: var(--bg-panel);
    z-index: 10;
}

.parts-grid-search svg {
    color: var(--text-secondary);
    flex-shrink: 0;
}

.parts-grid-search input {
    flex: 1;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 0.75rem 1rem;
    color: var(--text-primary);
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.9rem;
}

.parts-grid-search input:focus {
    outline: none;
    border-color: var(--accent-orange);
}

.parts-grid-search input::placeholder {
    color: var(--text-secondary);
}

.parts-grid-empty {
    padding: 3rem 1rem;
    text-align: center;
    color: var(--text-secondary);
}

.parts-grid-group {
    border-bottom: 1px solid var(--border-color);
}

.parts-grid-group:last-child {
    border-bottom: none;
}

.parts-grid-header {
    width: 100%;
    padding: 1rem 1.25rem;
    border: none;
    background: var(--bg-card);
    color: var(--text-primary);
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-align: left;
    transition: background 0.2s;
}

.parts-grid-header:hover {
    background: var(--border-color);
}

.parts-grid-header .chevron {
    transition: transform 0.2s;
    color: var(--text-secondary);
}

.parts-grid-header.expanded .chevron {
    transform: rotate(90deg);
}

.parts-grid-header .step-title {
    flex: 1;
}

.parts-grid-header .step-count {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.8rem;
    color: var(--text-secondary);
}

.parts-grid-rows {
    display: none;
}

.parts-grid-rows.expanded {
    display: block;
}

.parts-grid-row {
    width: 100%;
    padding: 0.75rem 1.25rem;
    padding-left: 2.75rem;
    border: none;
    background: transparent;
    color: var(--text-primary);
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.85rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 1rem;
    text-align: left;
    border-top: 1px solid var(--border-color);
    transition: background 0.2s;
}

.parts-grid-row:hover {
    background: rgba(255, 194, 51, 0.1);
}

.parts-grid-row .part-id {
    font-family: 'IBM Plex Mono', monospace;
    color: var(--accent-yellow);
    min-width: 100px;
}

.parts-grid-row .part-desc {
    flex: 1;
    color: var(--text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.parts-grid-row .part-qty {
    font-family: 'IBM Plex Mono', monospace;
    min-width: 30px;
    text-align: right;
}

.parts-grid-row > svg {
    color: var(--text-secondary);
    flex-shrink: 0;
}
```

**Step 3: Add Parts List button and container to index.html**

In `shed/index.html`, add a third view button after the 3D View button (around line 67):

```html
                <button class="view-btn" id="btn-parts" onclick="setView('parts')">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                        <rect x="9" y="3" width="6" height="4" rx="1"/>
                        <path d="M9 12h6M9 16h6"/>
                    </svg>
                    Parts List
                </button>
```

Add the parts grid container after line 96 (after diagram-container closing div):

```html
            <div id="parts-grid-container"></div>
```

Add script tag after parts-modal.js (around line 137):

```html
    <script src="js/parts-grid.js"></script>
```

**Step 4: Update setView function in app.js**

Replace the `setView` function in `shed/js/app.js`:

```javascript
function setView(view) {
    currentView = view;

    document.getElementById('btn-2d').classList.toggle('active', view === '2d');
    document.getElementById('btn-3d').classList.toggle('active', view === '3d');
    document.getElementById('btn-parts').classList.toggle('active', view === 'parts');

    document.getElementById('svg-container').style.display = view === '2d' ? 'block' : 'none';
    document.getElementById('webgl-container').style.display = view === '3d' ? 'block' : 'none';
    document.getElementById('controls-overlay').classList.toggle('visible', view === '3d');

    // Toggle diagram container and parts grid
    document.querySelector('.diagram-container').style.display = view === 'parts' ? 'none' : 'block';

    if (view === 'parts') {
        PartsGrid.show();
    } else {
        PartsGrid.hide();
    }

    if (view === '3d') {
        update3DView(currentStep);
        animate();
    }
}
```

**Step 5: Test parts grid (manual)**

Open `http://localhost:8000/shed/`, click "Parts List" button.
Expected: Grid shows with collapsible step groups, search works.

**Step 6: Commit**

```bash
git add shed/js/parts-grid.js shed/css/styles.css shed/index.html shed/js/app.js
git commit -m "feat(shed): add Parts List grid view with search and step grouping"
```

---

## Task 5: Make Pieces Card Tags Clickable

**Files:**
- Modify: `shed/js/app.js`
- Modify: `shed/css/styles.css`

**Step 1: Update piece tags to be clickable**

In `shed/js/app.js`, modify the pieces grid rendering (around line 63):

Change:
```javascript
                    ${step.pieces.map(p => `<span class="piece-tag">${p}</span>`).join('')}
```

To:
```javascript
                    ${step.pieces.map(p => `<button class="piece-tag" data-part-id="${p}">${p}</button>`).join('')}
```

**Step 2: Update piece-tag CSS for button**

In `shed/css/styles.css`, update the `.piece-tag` rule (around line 452):

```css
.piece-tag {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    padding: 0.35rem 0.65rem;
    border-radius: 6px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.75rem;
    color: var(--accent-yellow);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.piece-tag:hover {
    border-color: var(--accent-yellow);
    background: rgba(255, 194, 51, 0.1);
}
```

**Step 3: Add click handler for piece tags**

Add to the existing click event handler at end of `shed/js/app.js`:

```javascript
// Handle piece tag clicks
document.addEventListener('click', (e) => {
    const tag = e.target.closest('.piece-tag');
    if (tag) {
        e.preventDefault();
        const partId = tag.dataset.partId;
        PartsModal.open(partId);
    }
});
```

**Step 4: Test piece tags (manual)**

Open `http://localhost:8000/shed/`, scroll to "Pieces for This Step" section.
Click a piece tag.
Expected: Modal opens with that piece's details.

**Step 5: Commit**

```bash
git add shed/js/app.js shed/css/styles.css
git commit -m "feat(shed): make piece tags in Pieces card clickable"
```

---

## Task 6: Update GitHub Actions for Build-Time Conversion

**Files:**
- Modify: `.github/workflows/deploy-to-github-pages.yml`
- Modify: `.gitignore`

**Step 1: Update .gitignore**

Add to `.gitignore`:

```
shed/js/parts-data.js
```

**Step 2: Update GitHub Actions workflow**

Replace `.github/workflows/deploy-to-github-pages.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow only one concurrent deployment, skipping runs queued between the run in-progress and latest queued.
# However, do NOT cancel in-progress runs as we want to allow these production deployments to complete.
concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Install uv
        uses: astral-sh/setup-uv@v4

      - name: Generate parts data
        run: uv run shed/scripts/convert-parts.py

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          # Upload the entire repository (excluding .git and .github)
          path: "./"

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Step 3: Remove generated file from git tracking**

```bash
git rm --cached shed/js/parts-data.js 2>/dev/null || true
```

**Step 4: Commit**

```bash
git add .gitignore .github/workflows/deploy-to-github-pages.yml
git commit -m "ci: add build-time XLSX to JS conversion for parts data"
```

---

## Task 7: Final Testing and Cleanup

**Step 1: Run local test**

```bash
cd /Volumes/Data/Work/play/experiments/shed && uv run scripts/convert-parts.py
python3 -m http.server 8000
```

Open http://localhost:8000/shed/

**Step 2: Test checklist**

- [ ] Part IDs in instructions are clickable
- [ ] Clicking opens modal with correct details
- [ ] "Go to Step" button navigates to correct step
- [ ] Parts List view shows all parts grouped by step
- [ ] Search filters parts across all steps
- [ ] Collapsible headers work
- [ ] Piece tags in "Pieces for This Step" are clickable
- [ ] Modal closes on backdrop click, X button, and Escape key

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat(shed): complete parts data grid integration"
```
