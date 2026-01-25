# Parts Data Grid Integration Design

## Overview

Add a data grid to the Shed Builder Pro web app that displays parts information from the Excel cut sheet. Piece IDs mentioned in build instructions become clickable links that open a modal with part details.

## Requirements

1. **Clickable piece IDs** - Part references in instructions (e.g., `F-BLK-01`) open a detail modal
2. **Piece detail modal** - Shows part info (description, material, size, qty, notes) with "Go to Step" navigation
3. **Parts List view** - Full grid accessible via tab button, grouped by step with collapsible headers
4. **Search** - Filter parts across all steps
5. **Build-time conversion** - XLSX to JSON using `uv run` Python script

## Data Architecture

### Source
`data/shed_cut_sheet_with_ids.xlsx` with columns:
- Piece ID, Description, Material, Length, Qty, Step, Notes

### Generated Output
`js/parts-data.js`:
```javascript
const partsData = [
  {
    id: "F-BLK-01",
    description: "Concrete Deck Block - Corner FL",
    material: "Concrete",
    length: "12×12",
    qty: 1,
    step: 1,
    notes: "Front-left corner"
  },
  // ... all pieces
];
```

## Build Pipeline

### Conversion Script
`scripts/convert-parts.py`:
- Uses `openpyxl` to read XLSX
- Outputs JS file with embedded JSON
- Run via `uv run scripts/convert-parts.py`

### GitHub Actions
Update `.github/workflows/deploy-to-github-pages.yml`:
1. Install uv
2. Run conversion script
3. Deploy generated file

### Local Development
Run `uv run scripts/convert-parts.py` after editing spreadsheet.

## UI Components

### Clickable Piece IDs
- Regex identifies piece ID patterns in instruction HTML
- Wraps matches in `<a class="part-link" data-part-id="...">` elements
- Event delegation handles clicks

### Piece Detail Modal
```
┌─────────────────────────────────────┐
│  F-BLK-01                        ✕  │
├─────────────────────────────────────┤
│  Concrete Deck Block - Corner FL    │
│                                     │
│  Material:  Concrete                │
│  Size:      12×12                   │
│  Quantity:  1                       │
│  Step:      1 - Foundation          │
│                                     │
│  Notes:                             │
│  Front-left corner                  │
│                                     │
│  ┌─────────────────────────────┐    │
│  │      Go to Step 1 →         │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

Behavior:
- Click outside or ✕ to close
- "Go to Step" navigates and closes modal
- Escape key closes

### Parts List Grid
```
┌─────────────────────────────────────────────┐
│  🔍 Search parts...                         │
├─────────────────────────────────────────────┤
│  ▼ Step 1: Foundation (12 pieces)           │
├─────────────────────────────────────────────┤
│  ID        Description              Qty     │
│  F-BLK-01  Deck Block - Corner FL   1    →  │
│  F-BLK-02  Deck Block - Corner FR   1    →  │
│  ...                                        │
├─────────────────────────────────────────────┤
│  ▶ Step 2: Floor Frame (12 pieces)          │
└─────────────────────────────────────────────┘
```

Behavior:
- Collapsible step groups
- Search filters and auto-expands matching groups
- Click row opens modal
- Accessed via "Parts List" button in view toggle

## File Changes

### New Files
- `scripts/convert-parts.py` - XLSX → JS conversion
- `js/parts-data.js` - Generated (gitignored)
- `js/parts-modal.js` - Modal component
- `js/parts-grid.js` - Grid component

### Modified Files
- `index.html` - Parts List button, modal container, script tags
- `css/styles.css` - Modal and grid styles
- `js/app.js` - Part link handling, view switching
- `.github/workflows/deploy-to-github-pages.yml` - Conversion step
- `.gitignore` - Ignore `js/parts-data.js`

## Implementation Order

1. Create conversion script and generate `parts-data.js`
2. Add modal component and styles
3. Make piece IDs clickable in instructions
4. Add Parts List grid view
5. Update GitHub Actions workflow
6. Test end-to-end
