import { useRef, useCallback, useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { getComponentIcon } from './ComponentIcons';
import { WIRE_COLOR_MAP } from '../utils/wireColors';
import {
  screenToWorld,
  snapToGrid,
  findNearestPort,
  getPortWorldPosition,
  buildOrthogonalPath,
  distance,
} from '../utils/geometry';
import type { Point } from '../types';

export function Canvas() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<Point | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<Point>({ x: 0, y: 0 });
  const [mouseWorld, setMouseWorld] = useState<Point>({ x: 0, y: 0 });
  const [spaceHeld, setSpaceHeld] = useState(false);

  const canvas = useStore((s) => s.canvas);
  const setCanvas = useStore((s) => s.setCanvas);
  const tool = useStore((s) => s.tool);
  const setTool = useStore((s) => s.setTool);
  const placingType = useStore((s) => s.placingType);
  const setPlacingType = useStore((s) => s.setPlacingType);
  const wireColor = useStore((s) => s.wireColor);
  const components = useStore((s) => s.components);
  const addComponent = useStore((s) => s.addComponent);
  const moveComponent = useStore((s) => s.moveComponent);
  const wires = useStore((s) => s.wires);
  const addWire = useStore((s) => s.addWire);
  const rooms = useStore((s) => s.rooms);
  const addRoom = useStore((s) => s.addRoom);
  const selectedId = useStore((s) => s.selectedId);
  const setSelectedId = useStore((s) => s.setSelectedId);
  const drawingWire = useStore((s) => s.drawingWire);
  const setDrawingWire = useStore((s) => s.setDrawingWire);
  const drawingRoom = useStore((s) => s.drawingRoom);
  const setDrawingRoom = useStore((s) => s.setDrawingRoom);
  const toggleSwitch = useStore((s) => s.toggleSwitch);

  const getWorldPos = useCallback(
    (e: React.MouseEvent | MouseEvent): Point => {
      const rect = svgRef.current!.getBoundingClientRect();
      return screenToWorld(
        { x: e.clientX - rect.left, y: e.clientY - rect.top },
        canvas.offset,
        canvas.zoom,
      );
    },
    [canvas],
  );

  // Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.code === 'Space') { setSpaceHeld(true); e.preventDefault(); }
      if (e.key === 'v' || e.key === 'V') setTool('select');
      if (e.key === 'r' || e.key === 'R') setTool('draw-room');
      if (e.key === 'w' || e.key === 'W') setTool('draw-wire');
      if (e.key === 'Escape') {
        setDrawingWire(null);
        setDrawingRoom(null);
        setSelectedId(null);
        setPlacingType(null);
        setTool('select');
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const sel = useStore.getState().selectedId;
        if (sel) {
          useStore.getState().removeComponent(sel);
          useStore.getState().removeWire(sel);
          useStore.getState().removeRoom(sel);
        }
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') setSpaceHeld(false);
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [setTool, setDrawingWire, setDrawingRoom, setSelectedId, setPlacingType]);

  // Zoom
  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const rect = svgRef.current!.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.min(Math.max(canvas.zoom * zoomFactor, 0.1), 5);

      setCanvas({
        zoom: newZoom,
        offset: {
          x: mouseX - ((mouseX - canvas.offset.x) / canvas.zoom) * newZoom,
          y: mouseY - ((mouseY - canvas.offset.y) / canvas.zoom) * newZoom,
        },
      });
    },
    [canvas, setCanvas],
  );

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      const world = getWorldPos(e);
      const snapped = snapToGrid(world);

      // Space+drag = pan
      if (spaceHeld || tool === 'pan') {
        setIsPanning(true);
        setPanStart({ x: e.clientX - canvas.offset.x, y: e.clientY - canvas.offset.y });
        return;
      }

      if (tool === 'place-component' && placingType) {
        const comp = addComponent(placingType, snapped);
        setSelectedId(comp.id);
        return;
      }

      if (tool === 'draw-room') {
        setDrawingRoom({ start: snapped, current: snapped });
        return;
      }

      if (tool === 'draw-wire') {
        if (!drawingWire) {
          // Start new wire
          const snap = findNearestPort(world, components);
          const startPoint = snap ? getPortWorldPosition(snap.component, snap.port) : snapped;
          setDrawingWire({
            points: [startPoint],
            fromComponentId: snap?.component.id ?? null,
            fromPortId: snap?.port.id ?? null,
          });
        } else {
          // Add bend point or finish
          const snap = findNearestPort(world, components, 15, drawingWire.fromComponentId ?? undefined);
          if (snap) {
            // Finish wire at this port
            const endPoint = getPortWorldPosition(snap.component, snap.port);
            const lastPoint = drawingWire.points[drawingWire.points.length - 1];
            const pathSegment = buildOrthogonalPath(lastPoint, endPoint);
            const allPoints = [...drawingWire.points, ...pathSegment.slice(1)];
            addWire({
              points: allPoints,
              color: wireColor,
              fromComponentId: drawingWire.fromComponentId,
              fromPortId: drawingWire.fromPortId,
              toComponentId: snap.component.id,
              toPortId: snap.port.id,
            });
            setDrawingWire(null);
          } else {
            // Add bend
            const lastPoint = drawingWire.points[drawingWire.points.length - 1];
            const pathSegment = buildOrthogonalPath(lastPoint, snapped);
            setDrawingWire({
              ...drawingWire,
              points: [...drawingWire.points, ...pathSegment.slice(1)],
            });
          }
        }
        return;
      }

      // Select tool: check if clicking on something
      if (tool === 'select') {
        // Check components
        for (const comp of components) {
          if (distance(world, comp.position) < 25) {
            setSelectedId(comp.id);
            setDragId(comp.id);
            setDragOffset({
              x: comp.position.x - world.x,
              y: comp.position.y - world.y,
            });
            return;
          }
        }
        // Check wires (click near any segment)
        for (const wire of wires) {
          for (let i = 0; i < wire.points.length - 1; i++) {
            const a = wire.points[i];
            const b = wire.points[i + 1];
            const d = distanceToSegment(world, a, b);
            if (d < 8) {
              setSelectedId(wire.id);
              return;
            }
          }
        }
        // Check rooms
        for (const room of rooms) {
          if (
            world.x >= room.position.x &&
            world.x <= room.position.x + room.width &&
            world.y >= room.position.y &&
            world.y <= room.position.y + room.height
          ) {
            setSelectedId(room.id);
            return;
          }
        }
        setSelectedId(null);
      }
    },
    [
      tool,
      spaceHeld,
      canvas,
      placingType,
      drawingWire,
      components,
      wires,
      rooms,
      wireColor,
      getWorldPos,
      addComponent,
      addWire,
      setSelectedId,
      setDrawingWire,
      setDrawingRoom,
      setPlacingType,
    ],
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const world = getWorldPos(e);
      setMouseWorld(world);

      if (isPanning && panStart) {
        setCanvas({
          offset: {
            x: e.clientX - panStart.x,
            y: e.clientY - panStart.y,
          },
        });
        return;
      }

      if (dragId) {
        const snapped = snapToGrid({
          x: world.x + dragOffset.x,
          y: world.y + dragOffset.y,
        });
        moveComponent(dragId, snapped);
        return;
      }

      if (drawingRoom) {
        const snapped = snapToGrid(world);
        setDrawingRoom({ ...drawingRoom, current: snapped });
      }
    },
    [isPanning, panStart, dragId, dragOffset, drawingRoom, getWorldPos, setCanvas, moveComponent, setDrawingRoom],
  );

  const onMouseUp = useCallback(() => {
    if (isPanning) {
      setIsPanning(false);
      setPanStart(null);
    }
    if (dragId) {
      setDragId(null);
    }
    if (drawingRoom) {
      const x = Math.min(drawingRoom.start.x, drawingRoom.current.x);
      const y = Math.min(drawingRoom.start.y, drawingRoom.current.y);
      const w = Math.abs(drawingRoom.current.x - drawingRoom.start.x);
      const h = Math.abs(drawingRoom.current.y - drawingRoom.start.y);
      if (w > 20 && h > 20) {
        addRoom({
          position: { x, y },
          width: w,
          height: h,
          label: 'Room',
        });
      }
      setDrawingRoom(null);
    }
  }, [isPanning, dragId, drawingRoom, addRoom, setDrawingRoom]);

  const onDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      const world = getWorldPos(e);
      for (const comp of components) {
        if (distance(world, comp.position) < 25) {
          if (comp.type === 'switch' || comp.type === 'three-way-switch') {
            toggleSwitch(comp.id);
            useStore.getState().simulate();
          }
          return;
        }
      }
    },
    [components, getWorldPos, toggleSwitch],
  );

  // Grid pattern
  const gridSize = 20;
  const cursorClass =
    tool === 'pan' || spaceHeld
      ? 'cursor-grab'
      : tool === 'draw-room' || tool === 'draw-wire'
        ? 'cursor-crosshair'
        : tool === 'place-component'
          ? 'cursor-cell'
          : '';

  return (
    <svg
      ref={svgRef}
      className={`canvas ${cursorClass}`}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onWheel={onWheel}
      onDoubleClick={onDoubleClick}
    >
      <defs>
        <pattern
          id="grid"
          width={gridSize * canvas.zoom}
          height={gridSize * canvas.zoom}
          patternUnits="userSpaceOnUse"
          x={canvas.offset.x % (gridSize * canvas.zoom)}
          y={canvas.offset.y % (gridSize * canvas.zoom)}
        >
          <circle cx={gridSize * canvas.zoom / 2} cy={gridSize * canvas.zoom / 2} r={0.5} fill="#d4d4d8" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="#fafaf9" />
      <rect width="100%" height="100%" fill="url(#grid)" />

      <g transform={`translate(${canvas.offset.x},${canvas.offset.y}) scale(${canvas.zoom})`}>
        {/* Rooms */}
        {rooms.map((room) => (
          <g key={room.id} onClick={() => setSelectedId(room.id)}>
            <rect
              x={room.position.x}
              y={room.position.y}
              width={room.width}
              height={room.height}
              fill={selectedId === room.id ? 'rgba(59,130,246,0.05)' : 'rgba(0,0,0,0.02)'}
              stroke={selectedId === room.id ? '#3b82f6' : '#a8a29e'}
              strokeWidth={selectedId === room.id ? 2.5 : 2}
              strokeDasharray={selectedId === room.id ? 'none' : '8 4'}
            />
            <text
              x={room.position.x + room.width / 2}
              y={room.position.y + 18}
              textAnchor="middle"
              fontSize={14}
              fill="#78716c"
              fontWeight="500"
            >
              {room.label}
            </text>
          </g>
        ))}

        {/* Drawing room preview */}
        {drawingRoom && (
          <rect
            x={Math.min(drawingRoom.start.x, drawingRoom.current.x)}
            y={Math.min(drawingRoom.start.y, drawingRoom.current.y)}
            width={Math.abs(drawingRoom.current.x - drawingRoom.start.x)}
            height={Math.abs(drawingRoom.current.y - drawingRoom.start.y)}
            fill="rgba(59,130,246,0.08)"
            stroke="#3b82f6"
            strokeWidth={2}
            strokeDasharray="6 3"
          />
        )}

        {/* Wires */}
        {wires.map((wire) => {
          const pathData =
            'M ' + wire.points.map((p) => `${p.x},${p.y}`).join(' L ');
          return (
            <g key={wire.id}>
              {/* Hit area */}
              <path
                d={pathData}
                fill="none"
                stroke="transparent"
                strokeWidth={12}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedId(wire.id);
                }}
                style={{ cursor: 'pointer' }}
              />
              {/* Energized glow */}
              {wire.energized && (
                <path
                  d={pathData}
                  fill="none"
                  stroke={WIRE_COLOR_MAP[wire.color]}
                  strokeWidth={6}
                  opacity={0.3}
                  className="wire-glow"
                />
              )}
              {/* Wire */}
              <path
                d={pathData}
                fill="none"
                stroke={WIRE_COLOR_MAP[wire.color]}
                strokeWidth={wire.color === 'white' ? 2.5 : 2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={selectedId === wire.id ? 1 : 0.85}
              />
              {/* White wire outline for visibility */}
              {wire.color === 'white' && (
                <path
                  d={pathData}
                  fill="none"
                  stroke="#999"
                  strokeWidth={3.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={0.3}
                />
              )}
              {/* Selection highlight */}
              {selectedId === wire.id && (
                <path
                  d={pathData}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth={5}
                  strokeLinecap="round"
                  opacity={0.25}
                />
              )}
              {/* Color label at midpoint */}
              {wire.points.length >= 2 && (
                <text
                  x={wire.points[Math.floor(wire.points.length / 2)].x}
                  y={wire.points[Math.floor(wire.points.length / 2)].y - 8}
                  textAnchor="middle"
                  fontSize={9}
                  fill={WIRE_COLOR_MAP[wire.color]}
                  fontWeight="bold"
                  stroke="#fff"
                  strokeWidth={2}
                  paintOrder="stroke"
                >
                  {wire.color.toUpperCase()}
                </text>
              )}
            </g>
          );
        })}

        {/* Drawing wire preview */}
        {drawingWire && drawingWire.points.length > 0 && (() => {
          const lastPoint = drawingWire.points[drawingWire.points.length - 1];
          const snapped = snapToGrid(mouseWorld);
          const previewPath = buildOrthogonalPath(lastPoint, snapped);
          const allPoints = [...drawingWire.points, ...previewPath.slice(1)];
          const pathData = 'M ' + allPoints.map((p) => `${p.x},${p.y}`).join(' L ');
          return (
            <>
              <path
                d={pathData}
                fill="none"
                stroke={WIRE_COLOR_MAP[wireColor]}
                strokeWidth={2}
                strokeDasharray="6 3"
                opacity={0.7}
              />
              {/* Snap indicator */}
              {findNearestPort(mouseWorld, components) && (
                <circle
                  cx={getPortWorldPosition(
                    findNearestPort(mouseWorld, components)!.component,
                    findNearestPort(mouseWorld, components)!.port,
                  ).x}
                  cy={getPortWorldPosition(
                    findNearestPort(mouseWorld, components)!.component,
                    findNearestPort(mouseWorld, components)!.port,
                  ).y}
                  r={6}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  className="snap-indicator"
                />
              )}
            </>
          );
        })()}

        {/* Components */}
        {components.map((comp) => {
          const Icon = getComponentIcon(comp.type);
          const isSelected = selectedId === comp.id;
          // Check if any connected wire is energized
          const isEnergized = wires.some(
            (w) =>
              w.energized &&
              (w.fromComponentId === comp.id || w.toComponentId === comp.id),
          );
          return (
            <g
              key={comp.id}
              transform={`translate(${comp.position.x},${comp.position.y}) rotate(${comp.rotation})`}
              style={{ cursor: tool === 'select' ? 'move' : 'default' }}
            >
              {/* Selection ring */}
              {isSelected && (
                <circle r={28} fill="none" stroke="#3b82f6" strokeWidth={2} strokeDasharray="4 2" />
              )}
              <Icon
                size={40}
                on={comp.on}
                energized={isEnergized}
                travelerState={comp.travelerState}
              />
              {/* Ports */}
              {(tool === 'draw-wire' || tool === 'select') &&
                comp.ports.map((port) => {
                  const pos = port.offset;
                  return (
                    <circle
                      key={port.id}
                      cx={pos.x}
                      cy={pos.y}
                      r={4}
                      fill="#3b82f6"
                      opacity={tool === 'draw-wire' ? 0.7 : 0.3}
                      className="port-dot"
                    />
                  );
                })}
              {/* Label (unrotated) */}
              <g transform={`rotate(${-comp.rotation})`}>
                <text
                  y={32}
                  textAnchor="middle"
                  fontSize={10}
                  fill="#57534e"
                  fontWeight="500"
                >
                  {comp.label}
                </text>
              </g>
            </g>
          );
        })}

        {/* Placing component preview */}
        {tool === 'place-component' && placingType && (() => {
          const Icon = getComponentIcon(placingType);
          const snapped = snapToGrid(mouseWorld);
          return (
            <g
              transform={`translate(${snapped.x},${snapped.y})`}
              opacity={0.5}
            >
              <Icon size={40} />
            </g>
          );
        })()}
      </g>

      {/* Coordinates display */}
      <text x={10} y={20} fontSize={11} fill="#a8a29e" fontFamily="monospace">
        ({Math.round(mouseWorld.x)}, {Math.round(mouseWorld.y)}) zoom: {(canvas.zoom * 100).toFixed(0)}%
      </text>
    </svg>
  );
}

/** Distance from point P to line segment AB */
function distanceToSegment(p: Point, a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return distance(p, a);
  let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  return distance(p, { x: a.x + t * dx, y: a.y + t * dy });
}
