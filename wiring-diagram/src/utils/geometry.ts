import type { Point, ElectricalComponent, SnapPort } from '../types';

/** Get the world position of a port on a component */
export function getPortWorldPosition(
  component: ElectricalComponent,
  port: SnapPort,
): Point {
  const rad = (component.rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return {
    x: component.position.x + port.offset.x * cos - port.offset.y * sin,
    y: component.position.y + port.offset.x * sin + port.offset.y * cos,
  };
}

/** Distance between two points */
export function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Snap a point to the nearest grid position */
export function snapToGrid(p: Point, gridSize: number = 10): Point {
  return {
    x: Math.round(p.x / gridSize) * gridSize,
    y: Math.round(p.y / gridSize) * gridSize,
  };
}

/** Find the nearest port within a snap radius */
export function findNearestPort(
  worldPoint: Point,
  components: ElectricalComponent[],
  snapRadius: number = 15,
  excludeComponentId?: string,
): { component: ElectricalComponent; port: SnapPort; distance: number } | null {
  let best: { component: ElectricalComponent; port: SnapPort; distance: number } | null = null;

  for (const comp of components) {
    if (comp.id === excludeComponentId) continue;
    for (const port of comp.ports) {
      const portPos = getPortWorldPosition(comp, port);
      const d = distance(worldPoint, portPos);
      if (d <= snapRadius && (!best || d < best.distance)) {
        best = { component: comp, port, distance: d };
      }
    }
  }

  return best;
}

/** Build an orthogonal path (90-degree bends) between two points */
export function buildOrthogonalPath(from: Point, to: Point): Point[] {
  // If mostly horizontal difference, go horizontal first
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
    return [from, to];
  }

  const midX = from.x + dx / 2;

  return [
    from,
    { x: midX, y: from.y },
    { x: midX, y: to.y },
    to,
  ];
}

/** Screen coords to world coords */
export function screenToWorld(
  screenPoint: Point,
  offset: Point,
  zoom: number,
): Point {
  return {
    x: (screenPoint.x - offset.x) / zoom,
    y: (screenPoint.y - offset.y) / zoom,
  };
}

/** World coords to screen coords */
export function worldToScreen(
  worldPoint: Point,
  offset: Point,
  zoom: number,
): Point {
  return {
    x: worldPoint.x * zoom + offset.x,
    y: worldPoint.y * zoom + offset.y,
  };
}
