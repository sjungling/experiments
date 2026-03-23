export type Point = { x: number; y: number };

export type ComponentType =
  | 'outlet'
  | 'switch'
  | 'three-way-switch'
  | 'light'
  | 'junction-box'
  | 'panel';

export type WireColor = 'black' | 'white' | 'red' | 'green' | 'blue' | 'yellow';

export interface SnapPort {
  id: string;
  /** Offset from component center */
  offset: Point;
  /** Which side of the component */
  side: 'top' | 'right' | 'bottom' | 'left';
}

export interface ElectricalComponent {
  id: string;
  type: ComponentType;
  position: Point;
  label: string;
  rotation: number; // 0, 90, 180, 270
  ports: SnapPort[];
  /** For switches: current toggle state */
  on: boolean;
  /** For 3-way switches: which traveler is active (0 or 1) */
  travelerState?: 0 | 1;
}

export interface WireSegment {
  id: string;
  points: Point[]; // polyline: bends at 90 degrees
  color: WireColor;
  /** Source component + port */
  fromComponentId: string | null;
  fromPortId: string | null;
  /** Target component + port */
  toComponentId: string | null;
  toPortId: string | null;
  /** Is this wire currently energized? */
  energized: boolean;
}

export interface Room {
  id: string;
  position: Point;
  width: number;
  height: number;
  label: string;
}

export interface Circuit {
  id: string;
  label: string;
  components: string[]; // component IDs
  wires: string[]; // wire IDs
}

export type ToolMode =
  | 'select'
  | 'pan'
  | 'draw-room'
  | 'draw-wire'
  | 'place-component';

export interface CanvasState {
  offset: Point;
  zoom: number;
}
