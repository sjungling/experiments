# Interactive Build Guide - Component Abstraction Plan

This document outlines a strategy to abstract the interactive components from the Shed Builder project into a reusable framework for other DIY build guides (treehouse, deck, pergola, etc.).

---

## Executive Summary

The Shed Builder project demonstrates a successful pattern for interactive build guides with:
- 11-step progressive navigation with progress tracking
- Dual visualization (2D SVG diagrams + 3D WebGL)
- Comprehensive parts tracking with searchable grid
- Part detail modals with cross-linking
- Responsive dark-themed UI

**Goal:** Extract these patterns into a configurable framework where new projects only need to provide:
1. Project configuration (name, dimensions, materials palette)
2. Step definitions (title, instructions, materials, tips)
3. Parts data (from Excel or JSON)
4. 2D diagrams (SVG templates)
5. 3D geometry builders (or declarative geometry definitions)

---

## 1. Core Abstractions

### 1.1 Project Configuration Schema

```javascript
// project-config.js
const ProjectConfig = {
  // Metadata
  name: "8' × 10' Shed",
  slug: "shed-8x10",
  version: "1.0.0",

  // Dimensions (used for 3D scaling)
  dimensions: {
    width: 10,      // feet
    depth: 8,       // feet
    height: 8,      // feet at peak
    units: "imperial" // or "metric"
  },

  // Material palette for 3D rendering
  materials: {
    concrete: { color: 0x808080, name: "Concrete" },
    treated: { color: 0x5a7d4a, name: "Pressure-Treated Lumber" },
    wood: { color: 0xc49464, name: "Framing Lumber" },
    sheathing: { color: 0xc4a35a, name: "OSB Sheathing" },
    siding: { color: 0xa0522d, name: "LP SmartSide" },
    roofing: { color: 0x4a4a4a, name: "Shingles" }
  },

  // Part ID prefixes for this project
  partPrefixes: ["F-BLK", "FL-", "BW-", "LW-", "RW-", "FW-", "RF-", "SH-", "SD-", "TR-", "DR-"],

  // Theme customization
  theme: {
    accent: "#ff6b35",
    highlight: "#ffc233",
    dark: true
  }
};
```

### 1.2 Step Data Interface

```typescript
// Shared interface for all build guides
interface Step {
  id: string;                    // Unique step identifier
  title: string;                 // "Step 1: Foundation"
  materials: Material[];         // Materials needed for this step
  instructions: string[];        // Ordered instruction list (supports HTML/part links)
  tip?: string;                  // Pro tip (optional)
  pieces: string[];              // Part IDs used in this step
  diagramType: '2d' | '3d' | 'both';  // Which visualization to show
}

interface Material {
  name: string;                  // "2×6×10' PT lumber (FL-RIM-01)"
  qty: string;                   // "12 pcs" or "32 linear ft"
  partIds?: string[];            // Associated part IDs for linking
}
```

### 1.3 Parts Data Interface

```typescript
interface Part {
  id: string;           // "FL-JST-01"
  description: string;  // "Floor joist #1"
  material: string;     // "2×8×10' SPF"
  size: string;         // "9'-9\""
  quantity: number;     // 1
  step: number;         // 2
  notes?: string;       // "Cut at 45° on one end"
}
```

---

## 2. Component Architecture

### 2.1 Proposed Directory Structure

```
interactive-guide-framework/
├── core/
│   ├── GuideApp.js           # Main application orchestrator
│   ├── StepManager.js        # Step navigation & state
│   ├── ViewManager.js        # 2D/3D/Parts view switching
│   ├── EventBus.js           # Cross-component communication
│   └── StateStore.js         # Centralized state management
│
├── components/
│   ├── Sidebar.js            # Step list with progress
│   ├── ProgressBar.js        # Visual progress indicator
│   ├── InstructionsPanel.js  # Materials + instructions + tips
│   ├── PiecesCard.js         # Clickable piece tags per step
│   ├── PartsModal.js         # Part detail overlay
│   ├── PartsGrid.js          # Searchable parts list
│   ├── ZoomControls.js       # Zoom in/out/reset
│   └── NavButtons.js         # Previous/Next navigation
│
├── renderers/
│   ├── SVGRenderer.js        # 2D diagram display with zoom
│   ├── ThreeRenderer.js      # 3D WebGL scene management
│   ├── GeometryBuilder.js    # Abstract geometry construction
│   └── CameraController.js   # Mouse/touch camera controls
│
├── utils/
│   ├── linkifyPartIds.js     # Convert part IDs to clickable links
│   ├── searchFilter.js       # Generic search/filter logic
│   ├── excelParser.js        # XLSX to parts data converter
│   └── responsiveUtils.js    # Breakpoint detection
│
├── themes/
│   ├── dark.css              # Dark theme (current)
│   ├── light.css             # Light theme option
│   └── variables.css         # CSS custom properties
│
└── projects/
    ├── shed/                  # Shed-specific implementation
    │   ├── config.js
    │   ├── steps.js
    │   ├── diagrams.js
    │   ├── geometry.js
    │   └── parts.js
    │
    └── treehouse/             # Treehouse implementation
        ├── config.js
        ├── steps.js
        ├── diagrams.js
        ├── geometry.js
        └── parts.js
```

### 2.2 Component Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│                       GuideApp                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ init() → loadConfig() → registerComponents() → start() ││
│  └─────────────────────────────────────────────────────────┘│
│                            │                                │
│         ┌──────────────────┼──────────────────┐             │
│         ▼                  ▼                  ▼             │
│   ┌──────────┐      ┌───────────┐      ┌───────────┐        │
│   │StepManager│     │ViewManager│      │StateStore │        │
│   │           │     │           │      │           │        │
│   │loadStep() │◄───►│setView()  │◄────►│get/set()  │        │
│   │next/prev()│     │render()   │      │subscribe()│        │
│   └──────────┘      └───────────┘      └───────────┘        │
│         │                  │                  │             │
│         └──────────────────┼──────────────────┘             │
│                            ▼                                │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                    EventBus                          │   │
│   │  emit('step:changed', stepIndex)                     │   │
│   │  emit('view:changed', viewType)                      │   │
│   │  emit('part:selected', partId)                       │   │
│   └─────────────────────────────────────────────────────┘   │
│                            │                                │
│         ┌──────────────────┼──────────────────┐             │
│         ▼                  ▼                  ▼             │
│   ┌──────────┐      ┌───────────┐      ┌───────────┐        │
│   │ Sidebar  │      │SVGRenderer│      │ThreeRender│        │
│   │PartsGrid │      │ZoomControls│     │CameraCtrl │        │
│   │PartsModal│      │           │      │GeomBuilder│        │
│   └──────────┘      └───────────┘      └───────────┘        │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Key Abstractions in Detail

### 3.1 StepManager

Handles all step-related logic independent of visualization:

```javascript
class StepManager {
  constructor(steps, options = {}) {
    this.steps = steps;
    this.currentIndex = 0;
    this.completedSteps = new Set();
    this.eventBus = options.eventBus;
  }

  loadStep(index) {
    if (index < 0 || index >= this.steps.length) return;
    this.currentIndex = index;
    this.eventBus.emit('step:changed', {
      step: this.steps[index],
      index,
      isFirst: index === 0,
      isLast: index === this.steps.length - 1
    });
  }

  next() { this.loadStep(this.currentIndex + 1); }
  prev() { this.loadStep(this.currentIndex - 1); }

  markComplete(index) {
    this.completedSteps.add(index);
    this.eventBus.emit('step:completed', index);
  }

  getProgress() {
    return {
      current: this.currentIndex + 1,
      total: this.steps.length,
      percent: ((this.currentIndex + 1) / this.steps.length) * 100
    };
  }
}
```

### 3.2 ViewManager

Abstracts view switching logic:

```javascript
class ViewManager {
  constructor(options = {}) {
    this.views = new Map();
    this.currentView = null;
    this.eventBus = options.eventBus;
  }

  register(name, renderer) {
    // renderer must implement: init(), show(), hide(), update(stepIndex)
    this.views.set(name, renderer);
  }

  setView(name) {
    if (this.currentView) {
      this.views.get(this.currentView).hide();
    }
    this.currentView = name;
    const renderer = this.views.get(name);
    renderer.show();
    this.eventBus.emit('view:changed', name);
  }

  updateCurrentView(stepIndex) {
    if (this.currentView) {
      this.views.get(this.currentView).update(stepIndex);
    }
  }
}
```

### 3.3 GeometryBuilder (Abstract 3D)

Declarative geometry definition for 3D scenes:

```javascript
// Project-specific geometry definition
const shedGeometry = {
  foundation: {
    type: 'grid',
    rows: 3, cols: 4,
    spacing: { x: 3, z: 2.5 },
    element: { type: 'box', size: [1, 0.5, 1], material: 'concrete' }
  },

  floor: {
    frame: {
      type: 'frame',
      width: 10, depth: 8,
      joist: { size: [0.125, 0.625, 8], spacing: 1.33, material: 'treated' },
      rim: { size: [0.125, 0.625, 10], material: 'treated' }
    },
    deck: { type: 'box', size: [10, 0.0625, 8], material: 'sheathing' }
  },

  walls: {
    back: { type: 'wallFrame', width: 10, height: 7, studs: 8, material: 'wood' },
    // ... other walls
  }
};

// Abstract builder interprets this
class GeometryBuilder {
  constructor(materials, scene) {
    this.materials = materials;
    this.scene = scene;
    this.meshes = [];
  }

  build(geometry, stepIndex) {
    this.clear();
    // Progressive build based on step
    if (stepIndex >= 0) this.buildSection(geometry.foundation);
    if (stepIndex >= 1) this.buildSection(geometry.floor.frame);
    if (stepIndex >= 2) this.buildSection(geometry.floor.deck);
    // ... etc
  }

  buildSection(config) {
    switch (config.type) {
      case 'box': return this.createBox(config);
      case 'grid': return this.createGrid(config);
      case 'frame': return this.createFrame(config);
      case 'wallFrame': return this.createWallFrame(config);
      // ... extensible for new geometry types
    }
  }

  clear() {
    this.meshes.forEach(mesh => this.scene.remove(mesh));
    this.meshes = [];
  }
}
```

### 3.4 PartsModal (Reusable Component)

```javascript
class PartsModal {
  constructor(options = {}) {
    this.partsData = options.partsData;
    this.steps = options.steps;
    this.eventBus = options.eventBus;
    this.onNavigate = options.onNavigate; // Callback for "Go to Step"
    this.element = null;
  }

  init() {
    this.element = this.createModalDOM();
    document.body.appendChild(this.element);
    this.bindEvents();
  }

  open(partId) {
    const part = this.partsData.find(p => p.id === partId);
    if (!part) return;

    this.populate(part);
    this.element.classList.add('active');
    this.eventBus.emit('part:selected', partId);
  }

  close() {
    this.element.classList.remove('active');
  }

  populate(part) {
    // Fill modal with part details
    // Same logic as current implementation but using this.steps reference
  }

  // ... createModalDOM(), bindEvents() methods
}
```

---

## 4. Data Pipeline

### 4.1 Excel to Parts Data

Keep the existing Python script pattern but make it configurable:

```python
# scripts/convert-parts.py
import sys
import json
from openpyxl import load_workbook

def convert(config_path, xlsx_path, output_path):
    config = json.load(open(config_path))
    prefixes = config['partPrefixes']

    wb = load_workbook(xlsx_path)
    sheet = wb.active

    parts = []
    for row in sheet.iter_rows(min_row=2, values_only=True):
        part_id = row[0]
        if part_id and any(part_id.startswith(p) for p in prefixes):
            parts.append({
                'id': part_id,
                'description': row[1],
                'material': row[2],
                'size': row[3],
                'quantity': row[4],
                'step': row[5],
                'notes': row[6]
            })

    with open(output_path, 'w') as f:
        f.write(f'const partsData = {json.dumps(parts, indent=2)};')

if __name__ == '__main__':
    convert(sys.argv[1], sys.argv[2], sys.argv[3])
```

### 4.2 SVG Diagram Templates

SVG diagrams remain project-specific but follow a consistent pattern:

```javascript
// projects/treehouse/diagrams.js
export const diagrams = [
  // Step 0: Site Selection
  `<svg viewBox="0 0 800 600">
    <defs><!-- shared patterns/gradients --></defs>
    <!-- Tree representation -->
    <!-- Support beam positions -->
    <!-- Dimension annotations -->
  </svg>`,

  // Step 1: Support Beams
  // ... etc
];
```

---

## 5. Implementation Phases

### Phase 1: Extract Core Framework (Week 1-2)
- [ ] Create `core/` module with StepManager, ViewManager, EventBus, StateStore
- [ ] Extract `components/` as standalone modules with clear interfaces
- [ ] Define component lifecycle hooks (init, mount, update, unmount)
- [ ] Create theme system with CSS variables
- [ ] Document interfaces with JSDoc or TypeScript declarations

### Phase 2: Refactor Shed Project (Week 2-3)
- [ ] Migrate shed to use new framework structure
- [ ] Move shed-specific code to `projects/shed/`
- [ ] Ensure full feature parity with current implementation
- [ ] Write integration tests for navigation and view switching

### Phase 3: Abstract 3D System (Week 3-4)
- [ ] Create declarative geometry definition format
- [ ] Implement GeometryBuilder with extensible shape types
- [ ] Add mesh picking for 3D part selection (raycasting)
- [ ] Document how to add new geometry types

### Phase 4: Treehouse Proof of Concept (Week 4-6)
- [ ] Define treehouse project configuration
- [ ] Create step data for 8-10 build steps
- [ ] Design SVG diagrams for tree mounting and platform
- [ ] Define 3D geometry for treehouse structure
- [ ] Create parts spreadsheet with piece IDs
- [ ] Validate framework flexibility

### Phase 5: Polish and Documentation (Week 6-7)
- [ ] Create project generator CLI (`npx create-build-guide treehouse`)
- [ ] Write comprehensive documentation
- [ ] Add example projects (deck, pergola stubs)
- [ ] Performance optimization (lazy loading diagrams)

---

## 6. Treehouse-Specific Considerations

### 6.1 Unique Challenges

| Aspect | Shed | Treehouse |
|--------|------|-----------|
| Foundation | Concrete blocks on ground | Tree attachment (TABs/bolts) |
| Structure | Rectangular frame | Potentially irregular based on tree |
| Load path | Ground → foundation → walls | Tree → brackets → platform |
| Safety | Standard | Fall protection, railing requirements |
| Materials | Standard lumber | May include cables, hardware |

### 6.2 Proposed Treehouse Steps

1. **Tree Selection & Assessment** - Evaluating tree health, species, diameter
2. **Planning & Permits** - Layout, load calculations, local codes
3. **Tree Attachment Bolts (TABs)** - Installing main support hardware
4. **Main Support Beams** - Primary horizontal structure
5. **Floor Joists** - Platform framing
6. **Decking** - Floor surface installation
7. **Railing Posts** - Safety rail framework
8. **Wall Framing** - Enclosed area structure
9. **Roof Framing** - Overhead protection
10. **Sheathing & Siding** - Exterior finishing
11. **Railing & Ladder** - Access and safety completion

### 6.3 Treehouse Part ID Prefixes

```
TR-TAB-##    Tree Attachment Bolts
TR-BM-##     Main beams
PL-JST-##    Platform joists
PL-DK-##     Platform decking
RL-PST-##    Railing posts
RL-RLS-##    Railing rails/spindles
WL-STD-##    Wall studs
WL-PLT-##    Wall plates
RF-RAF-##    Roof rafters
RF-SH-##     Roof sheathing
LD-##        Ladder components
HW-##        Hardware (bolts, brackets, cables)
```

---

## 7. Technical Decisions

### 7.1 Keep Vanilla JS vs. Framework

**Recommendation: Keep Vanilla JS with ES6 Modules**

Pros:
- Zero build step for simple projects
- No framework lock-in
- Smaller bundle size
- Easier to understand and extend
- Works offline without build tools

Cons:
- Manual DOM management
- No reactive data binding
- More boilerplate for state sync

**Mitigation:** Create simple reactivity helpers without full framework:

```javascript
// Simple reactive state
function createStore(initialState) {
  let state = initialState;
  const listeners = new Set();

  return {
    get: () => state,
    set: (newState) => {
      state = { ...state, ...newState };
      listeners.forEach(fn => fn(state));
    },
    subscribe: (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    }
  };
}
```

### 7.2 Build Process

**Recommendation: Optional build with sensible defaults**

- Development: Direct ES6 modules, no bundling needed
- Production: Optional Rollup/esbuild for single-file output
- Parts data: Python script or Node.js xlsx parser

### 7.3 3D Library

**Recommendation: Keep Three.js**

- Well-documented, large community
- Handles complex scenes efficiently
- Good mobile support
- CDN-available for no-build usage

---

## 8. Success Metrics

- [ ] New project setup in <1 hour (config + step stubs)
- [ ] Step navigation works identically across projects
- [ ] Parts modal and grid reusable without modification
- [ ] 3D geometry definable without Three.js knowledge
- [ ] Theme customizable via CSS variables only
- [ ] Mobile-responsive by default
- [ ] Offline-capable (no external dependencies at runtime)

---

## 9. Open Questions

1. **Should we support multiple trees for treehouse?** Complex TAB arrangements may need graph-based geometry.

2. **Print-friendly mode?** Users may want to print cut lists and step instructions.

3. **Progress persistence?** LocalStorage for resuming where user left off.

4. **Metric/Imperial toggle?** Would require data refactoring and display logic.

5. **Community contributions?** If open-sourced, how do we handle project submissions?

---

## 10. Next Steps

1. Review this plan and gather feedback
2. Create proof-of-concept for core/ modules
3. Migrate shed project incrementally
4. Begin treehouse research (TAB installation, load calculations)
5. Design treehouse SVG diagrams

---

*Plan created: 2026-01-31*
*Based on analysis of: /home/user/experiments/shed/*
