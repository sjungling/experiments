import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import type {
  ElectricalComponent,
  WireSegment,
  Room,
  ToolMode,
  CanvasState,
  ComponentType,
  Point,
  SnapPort,
  WireColor,
} from '../types';

function makePorts(type: ComponentType): SnapPort[] {
  const base: SnapPort[] = [
    { id: uuid(), offset: { x: 0, y: -20 }, side: 'top' },
    { id: uuid(), offset: { x: 20, y: 0 }, side: 'right' },
    { id: uuid(), offset: { x: 0, y: 20 }, side: 'bottom' },
    { id: uuid(), offset: { x: -20, y: 0 }, side: 'left' },
  ];
  if (type === 'panel') {
    // panels have more ports
    return [
      ...base,
      { id: uuid(), offset: { x: -10, y: -20 }, side: 'top' },
      { id: uuid(), offset: { x: 10, y: -20 }, side: 'top' },
      { id: uuid(), offset: { x: -10, y: 20 }, side: 'bottom' },
      { id: uuid(), offset: { x: 10, y: 20 }, side: 'bottom' },
    ];
  }
  return base;
}

interface DiagramStore {
  // Canvas
  canvas: CanvasState;
  setCanvas: (c: Partial<CanvasState>) => void;

  // Tool
  tool: ToolMode;
  setTool: (t: ToolMode) => void;
  placingType: ComponentType | null;
  setPlacingType: (t: ComponentType | null) => void;
  wireColor: WireColor;
  setWireColor: (c: WireColor) => void;

  // Components
  components: ElectricalComponent[];
  addComponent: (type: ComponentType, position: Point) => ElectricalComponent;
  moveComponent: (id: string, position: Point) => void;
  toggleSwitch: (id: string) => void;
  rotateComponent: (id: string) => void;
  removeComponent: (id: string) => void;
  updateComponentLabel: (id: string, label: string) => void;

  // Wires
  wires: WireSegment[];
  addWire: (wire: Omit<WireSegment, 'id' | 'energized'>) => void;
  removeWire: (id: string) => void;

  // Rooms
  rooms: Room[];
  addRoom: (room: Omit<Room, 'id'>) => void;
  updateRoom: (id: string, room: Partial<Room>) => void;
  removeRoom: (id: string) => void;

  // Selection
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;

  // Drawing state
  drawingWire: { points: Point[]; fromComponentId: string | null; fromPortId: string | null } | null;
  setDrawingWire: (w: { points: Point[]; fromComponentId: string | null; fromPortId: string | null } | null) => void;

  drawingRoom: { start: Point; current: Point } | null;
  setDrawingRoom: (r: { start: Point; current: Point } | null) => void;

  // Simulation
  simulate: () => void;

  // Show wire colors panel
  showWireInfo: boolean;
  setShowWireInfo: (v: boolean) => void;
}

export const useStore = create<DiagramStore>((set, get) => ({
  canvas: { offset: { x: 0, y: 0 }, zoom: 1 },
  setCanvas: (c) => set((s) => ({ canvas: { ...s.canvas, ...c } })),

  tool: 'select',
  setTool: (t) => set({ tool: t, placingType: null }),
  placingType: null,
  setPlacingType: (t) => set({ placingType: t, tool: t ? 'place-component' : 'select' }),
  wireColor: 'black',
  setWireColor: (c) => set({ wireColor: c }),

  components: [],
  addComponent: (type, position) => {
    const comp: ElectricalComponent = {
      id: uuid(),
      type,
      position,
      label: type.charAt(0).toUpperCase() + type.slice(1),
      rotation: 0,
      ports: makePorts(type),
      on: false,
      travelerState: type === 'three-way-switch' ? 0 : undefined,
    };
    set((s) => ({ components: [...s.components, comp] }));
    return comp;
  },
  moveComponent: (id, position) =>
    set((s) => ({
      components: s.components.map((c) => (c.id === id ? { ...c, position } : c)),
    })),
  toggleSwitch: (id) =>
    set((s) => ({
      components: s.components.map((c) => {
        if (c.id !== id) return c;
        if (c.type === 'switch') return { ...c, on: !c.on };
        if (c.type === 'three-way-switch')
          return { ...c, travelerState: c.travelerState === 0 ? 1 : 0 };
        return c;
      }),
    })),
  rotateComponent: (id) =>
    set((s) => ({
      components: s.components.map((c) =>
        c.id === id ? { ...c, rotation: (c.rotation + 90) % 360 } : c,
      ),
    })),
  removeComponent: (id) =>
    set((s) => ({
      components: s.components.filter((c) => c.id !== id),
      wires: s.wires.filter(
        (w) => w.fromComponentId !== id && w.toComponentId !== id,
      ),
      selectedId: s.selectedId === id ? null : s.selectedId,
    })),
  updateComponentLabel: (id, label) =>
    set((s) => ({
      components: s.components.map((c) => (c.id === id ? { ...c, label } : c)),
    })),

  wires: [],
  addWire: (wire) =>
    set((s) => ({
      wires: [...s.wires, { ...wire, id: uuid(), energized: false }],
    })),
  removeWire: (id) =>
    set((s) => ({
      wires: s.wires.filter((w) => w.id !== id),
      selectedId: s.selectedId === id ? null : s.selectedId,
    })),

  rooms: [],
  addRoom: (room) => set((s) => ({ rooms: [...s.rooms, { ...room, id: uuid() }] })),
  updateRoom: (id, room) =>
    set((s) => ({
      rooms: s.rooms.map((r) => (r.id === id ? { ...r, ...room } : r)),
    })),
  removeRoom: (id) =>
    set((s) => ({
      rooms: s.rooms.filter((r) => r.id !== id),
      selectedId: s.selectedId === id ? null : s.selectedId,
    })),

  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),

  drawingWire: null,
  setDrawingWire: (w) => set({ drawingWire: w }),

  drawingRoom: null,
  setDrawingRoom: (r) => set({ drawingRoom: r }),

  simulate: () => {
    const { components, wires } = get();
    // Build adjacency: find which components are connected
    // Trace power from panel through switches to loads
    const energizedWireIds = new Set<string>();

    // Find panels (power sources)
    const panels = components.filter((c) => c.type === 'panel');

    // BFS from each panel
    for (const panel of panels) {
      const visited = new Set<string>();
      const queue: string[] = [panel.id];
      visited.add(panel.id);

      while (queue.length > 0) {
        const currentId = queue.shift()!;
        const current = components.find((c) => c.id === currentId);
        if (!current) continue;

        // Check if this component blocks current
        if (current.type === 'switch' && !current.on) continue;

        // Find wires connected to this component
        const connectedWires = wires.filter(
          (w) => w.fromComponentId === currentId || w.toComponentId === currentId,
        );

        for (const wire of connectedWires) {
          energizedWireIds.add(wire.id);
          const nextId =
            wire.fromComponentId === currentId
              ? wire.toComponentId
              : wire.fromComponentId;
          if (nextId && !visited.has(nextId)) {
            // For 3-way switches, check traveler logic
            const nextComp = components.find((c) => c.id === nextId);
            if (nextComp?.type === 'three-way-switch') {
              // A 3-way switch connects common to one of two travelers
              // We model this by checking which port the wire connects to
              const portId =
                wire.fromComponentId === nextId ? wire.fromPortId : wire.toPortId;
              const port = nextComp.ports.find((p) => p.id === portId);
              if (port) {
                const portIndex = nextComp.ports.indexOf(port);
                // Port 0 = common, port 1 = traveler 0, port 2 = traveler 1, port 3 = common out
                if (portIndex === 1 && nextComp.travelerState !== 0) continue;
                if (portIndex === 2 && nextComp.travelerState !== 1) continue;
              }
            }
            visited.add(nextId);
            queue.push(nextId);
          }
        }
      }
    }

    set((s) => ({
      wires: s.wires.map((w) => ({
        ...w,
        energized: energizedWireIds.has(w.id),
      })),
    }));
  },

  showWireInfo: false,
  setShowWireInfo: (v) => set({ showWireInfo: v }),
}));
