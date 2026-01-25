# Shed Builder Pro

An interactive web application for building an 8' × 10' outdoor shed with 6' walls, pitched roof (4:12), and LP SmartSide siding.

## Features

- **10-step guided build process** - From foundation to finish
- **2D SVG diagrams** - Clear technical illustrations for each step
- **3D WebGL view** - Interactive 3D model with touch/mouse controls
- **Materials list** - Quantities and specifications for each step
- **Pro tips** - Expert advice for each construction phase
- **Mobile responsive** - Works on phones, tablets, and desktops
- **Screws over nails** - Modern fastening approach where applicable

## Shed Specifications

- **Dimensions:** 8' wide × 10' long × 6' walls
- **Roof:** 4:12 pitch gable
- **Door:** 36" DIY door from siding cutout
- **Siding:** LP SmartSide cedar texture panels
- **Foundation:** Concrete deck blocks
- **Framing:** 2×4 studs @ 16.5" O.C.

## Build Steps

1. Foundation - Concrete block layout
2. Floor Frame - PT lumber frame with joist hangers
3. Floor Deck - 3/4" OSB T&G subfloor
4. Back Wall - 10' solid wall framing
5. Side Walls - Two 8' wall sections
6. Front Wall - With 36" door rough opening
7. Roof Framing - Rafters, ridge, and collar ties
8. Sheathing & Siding - LP SmartSide panels
9. Build the Door - DIY from siding cutout
10. Roofing & Finish - Shingles, trim, paint

## Technology

- HTML5 / CSS3
- Vanilla JavaScript
- Three.js for 3D rendering
- SVG for 2D diagrams

## Usage

Simply open `index.html` in a web browser. No build process required.

For local development with live reload:
```bash
npx serve .
```

## File Structure

```
shed/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All styles
├── js/
│   ├── steps-data.js   # Materials & instructions data
│   ├── svg-diagrams.js # 2D SVG diagrams
│   ├── three-scene.js  # 3D WebGL scene
│   └── app.js          # Main app logic
├── assets/             # Images/icons (if needed)
└── README.md           # This file
```

## Cost Estimate

Based on 95973 zip code (January 2025):
- **Materials:** ~$1,400 - $1,500
- **DIY door saves:** ~$250 vs prehung

## License

MIT
