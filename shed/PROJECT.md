# Shed Builder Project Summary

> Context file for Claude Code to continue development on this project.

## Project Overview

An interactive web application for building an **8' × 10' outdoor shed** with detailed step-by-step instructions, 2D SVG diagrams, 3D WebGL visualization, and a comprehensive cut sheet with unique piece IDs.

### Shed Specifications
- **Dimensions:** 8' wide × 10' long × 6' wall height
- **Roof:** 4:12 pitch gable roof
- **Door:** 36" wide DIY door (built from siding cutout)
- **Siding:** LP SmartSide cedar texture panels
- **Foundation:** 12 concrete deck blocks
- **Framing:** 2×4 studs @ 16.5" O.C., 2×6 PT floor frame

## Key Design Decisions

### Screws vs Nails
The project uses **screws instead of nails wherever possible** for better holding power and easier corrections:

| Component | Fastener | Reason |
|-----------|----------|--------|
| Floor frame (PT lumber) | 3" exterior deck screws | Pre-drill required, won't split |
| Joist hangers | 1-1/2" joist hanger screws | Manufacturer specified |
| Floor deck OSB | 2" exterior screws | Won't pop over time |
| Wall framing | 3" framing screws | All stud-to-plate connections |
| Roof OSB | 2" exterior screws | 6" O.C. edges, 12" field |
| Corner trim | Exterior screws | Better hold than nails |
| Drip edge | 1" roofing screws | Every 12" |
| Door hinges | 3" exterior screws | Into framing for strength |

**Nails required by manufacturer specs:**
- LP SmartSide siding: 8d galvanized nails (manufacturer requirement)
- Roofing shingles: 1-1/4" roofing nails (industry standard)

### Piece ID System
Every piece of lumber/material has a unique ID for tracking:

| Prefix | Component |
|--------|-----------|
| `F-BLK-##` | Foundation blocks |
| `FL-RIM-##` | Floor rim joists |
| `FL-JST-##` | Floor joists |
| `FL-DK-##` | Floor deck panels |
| `BW-` | Back wall (BP=bottom plate, TP=top plate, ST=stud) |
| `LW-` | Left wall |
| `RW-` | Right wall |
| `FW-` | Front wall (KS=king stud, JS=jack stud, HD=header, CR=cripple) |
| `RF-` | Roof (RDG=ridge, RAF=rafter, CT=collar tie, GB=gable stud) |
| `SH-RF-##` | Roof sheathing |
| `SD-` | Siding panels |
| `TR-CN-##` | Corner trim |
| `DR-` | Door components |
| `RF-DE-##` | Drip edge |
| `RF-SH-##` | Shingle bundles |

**Total tracked pieces: ~130 individual components**

## File Structure

```
shed/
├── index.html              # Main HTML file
├── README.md               # Project documentation
├── css/
│   └── styles.css          # All styles (dark theme, responsive)
├── js/
│   ├── steps-data.js       # Materials, instructions, piece IDs per step
│   ├── svg-diagrams.js     # 2D SVG diagrams for each step
│   ├── three-scene.js      # 3D WebGL scene with Three.js
│   └── app.js              # Main app logic, navigation, UI
├── assets/                 # (empty, for future use)
└── shed_cut_sheet_with_ids.xlsx  # Spreadsheet with all pieces
```

## Tech Stack

- **HTML5 / CSS3** - Dark theme UI with CSS variables
- **Vanilla JavaScript** - No build process required
- **Three.js r128** - 3D WebGL rendering (CDN loaded)
- **Google Fonts** - Archivo Black, IBM Plex Sans, IBM Plex Mono
- **openpyxl** - Python library used to generate the Excel cut sheet

## 10 Build Steps

1. **Foundation** - 12 concrete deck blocks (F-BLK-01 to F-BLK-12)
2. **Floor Frame** - 2×6 PT rim joists and floor joists with joist hangers
3. **Floor Deck** - 3/4" OSB T&G subfloor (3 sheets)
4. **Back Wall** - 10' wall with 9 studs @ 16.5" O.C.
5. **Side Walls** - Two 7'-5" walls (7 studs each)
6. **Front Wall** - With 38" rough opening for door (king studs, jack studs, header)
7. **Roof Framing** - Ridge board, 18 rafters, 5 collar ties, hurricane ties
8. **Sheathing & Siding** - Roof OSB + LP SmartSide panels + corner trim
9. **Build the Door** - DIY from siding cutout (saves ~$250)
10. **Roofing & Finish** - Drip edge, felt, shingles, caulk, paint

## Features Implemented

### Web App
- [x] Step-by-step navigation with progress tracking
- [x] 2D SVG diagrams for each step
- [x] 3D WebGL view with mouse/touch controls (rotate, zoom)
- [x] Materials list with quantities per step
- [x] Detailed instructions with piece ID references
- [x] "Pieces for This Step" reference panel
- [x] Pro tips for each step
- [x] Mobile responsive design
- [x] Dark theme UI

### Cut Sheet (Excel)
- [x] Unique ID for every piece
- [x] Material type, cut length, quantity
- [x] Step number reference
- [x] Position/location notes
- [x] Color-coded by material type
- [x] Piece count summary with formulas

## UI Highlights

- Piece IDs displayed in yellow monospace (`#ffc233`) with subtle background
- Instructions use `<strong>` tags to highlight piece IDs
- Pieces grid shows all pieces needed for current step as clickable tags
- Section headers in orange (`#ff6b35`) in the cut sheet

## Future Enhancements (Not Yet Implemented)

- [ ] Checklist mode to mark pieces as cut/installed
- [ ] Print-friendly cut sheet view
- [ ] Cost calculator based on local prices
- [ ] Shopping list generator (grouped by material type)
- [ ] Export/import progress state
- [ ] Measurement unit toggle (imperial/metric)
- [ ] SVG diagrams with piece ID labels overlaid
- [ ] 3D view with clickable pieces showing ID on hover

## GitHub Repository

Target: `https://github.com/sjungling/experiments` in a `shed/` folder

**To deploy:**
```bash
cd experiments
mkdir shed
# Extract shed-app.zip contents into shed/
cp shed_cut_sheet_with_ids.xlsx shed/
git add shed
git commit -m "Add shed builder web app with piece ID system"
git push
```

## Cost Estimate (95973 zip code, Jan 2025)

- **Materials:** ~$1,400 - $1,500
- **DIY door saves:** ~$250 vs pre-hung
- **Screws vs nails:** Slightly higher cost but better results

## Notes for Claude Code

1. **No build process** - Just open `index.html` in a browser
2. **Three.js loaded from CDN** - No npm dependencies for the web app
3. **Python dependencies** - `openpyxl` used only for generating the Excel file
4. **Piece IDs in instructions** - Use `<strong>PIECE-ID</strong>` format in steps-data.js
5. **SVG diagrams** - Stored as template literal strings in svg-diagrams.js
6. **3D scene** - Progressive build based on step index (stepIndex >= N patterns)

## Related Files Generated

| File | Description |
|------|-------------|
| `shed-app.zip` | Complete web app ready to extract |
| `shed_cut_sheet_with_ids.xlsx` | Excel cut sheet with all piece IDs |
| `create_cut_sheet.py` | Python script that generated the Excel file |
