import { useStore } from '../store/useStore';
import { ComponentPreview } from './ComponentIcons';
import { WIRE_COLOR_MAP, WIRE_COLOR_LABELS, ALL_WIRE_COLORS } from '../utils/wireColors';
import type { ComponentType, WireColor } from '../types';

const COMPONENT_TYPES: { type: ComponentType; label: string }[] = [
  { type: 'panel', label: 'Panel' },
  { type: 'outlet', label: 'Outlet' },
  { type: 'switch', label: 'Switch (2-way)' },
  { type: 'three-way-switch', label: '3-Way Switch' },
  { type: 'light', label: 'Light' },
  { type: 'junction-box', label: 'Junction Box' },
];

export function Toolbar() {
  const tool = useStore((s) => s.tool);
  const setTool = useStore((s) => s.setTool);
  const placingType = useStore((s) => s.placingType);
  const setPlacingType = useStore((s) => s.setPlacingType);
  const wireColor = useStore((s) => s.wireColor);
  const setWireColor = useStore((s) => s.setWireColor);
  const simulate = useStore((s) => s.simulate);
  const showWireInfo = useStore((s) => s.showWireInfo);
  const setShowWireInfo = useStore((s) => s.setShowWireInfo);
  const selectedId = useStore((s) => s.selectedId);
  const components = useStore((s) => s.components);
  const removeComponent = useStore((s) => s.removeComponent);
  const removeWire = useStore((s) => s.removeWire);
  const removeRoom = useStore((s) => s.removeRoom);
  const wires = useStore((s) => s.wires);
  const rooms = useStore((s) => s.rooms);
  const rotateComponent = useStore((s) => s.rotateComponent);

  const selectedComp = components.find((c) => c.id === selectedId);
  const selectedWire = wires.find((w) => w.id === selectedId);
  const selectedRoom = rooms.find((r) => r.id === selectedId);

  return (
    <div className="toolbar">
      <div className="toolbar-section">
        <h3>Tools</h3>
        <div className="tool-buttons">
          <button
            className={tool === 'select' ? 'active' : ''}
            onClick={() => setTool('select')}
            title="Select & Move (V)"
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path d="M2,1 L2,14 L6,10 L10,16 L12,15 L8,9 L13,9 Z" fill="currentColor" />
            </svg>
          </button>
          <button
            className={tool === 'pan' ? 'active' : ''}
            onClick={() => setTool('pan')}
            title="Pan Canvas (Space+Drag)"
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path
                d="M9,1 L6,4 H8 V7 H5 V5 L2,8 L5,11 V9 H8 V12 H6 L9,15 L12,12 H10 V9 H13 V11 L16,8 L13,5 V7 H10 V4 H12 Z"
                fill="currentColor"
              />
            </svg>
          </button>
          <button
            className={tool === 'draw-room' ? 'active' : ''}
            onClick={() => setTool('draw-room')}
            title="Draw Room (R)"
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <rect x="2" y="2" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 2" />
            </svg>
          </button>
          <button
            className={tool === 'draw-wire' ? 'active' : ''}
            onClick={() => setTool('draw-wire')}
            title="Draw Wire (W)"
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path d="M2,16 L2,8 L16,8 L16,2" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="2" cy="16" r="2" fill="currentColor" />
              <circle cx="16" cy="2" r="2" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>

      <div className="toolbar-section">
        <h3>Components</h3>
        <div className="component-palette">
          {COMPONENT_TYPES.map(({ type, label }) => (
            <button
              key={type}
              className={`component-btn ${placingType === type ? 'active' : ''}`}
              onClick={() => setPlacingType(placingType === type ? null : type)}
              title={label}
            >
              <ComponentPreview type={type} size={28} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {tool === 'draw-wire' && (
        <div className="toolbar-section">
          <h3>Wire Color</h3>
          <div className="wire-colors">
            {ALL_WIRE_COLORS.map((color) => (
              <button
                key={color}
                className={`wire-color-btn ${wireColor === color ? 'active' : ''}`}
                onClick={() => setWireColor(color as WireColor)}
                title={WIRE_COLOR_LABELS[color]}
              >
                <span
                  className="wire-color-swatch"
                  style={{
                    backgroundColor: WIRE_COLOR_MAP[color],
                    border: color === 'white' ? '1px solid #ccc' : 'none',
                  }}
                />
                <span className="wire-color-label">{color}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="toolbar-section">
        <h3>Simulate</h3>
        <button className="simulate-btn" onClick={simulate}>
          Run Simulation
        </button>
        <button
          className={`info-btn ${showWireInfo ? 'active' : ''}`}
          onClick={() => setShowWireInfo(!showWireInfo)}
        >
          Wire Color Guide
        </button>
      </div>

      {selectedId && (
        <div className="toolbar-section">
          <h3>Selected</h3>
          {selectedComp && (
            <div className="selection-info">
              <p>{selectedComp.label} ({selectedComp.type})</p>
              <button onClick={() => rotateComponent(selectedComp.id)}>Rotate 90°</button>
              {(selectedComp.type === 'switch' || selectedComp.type === 'three-way-switch') && (
                <button onClick={() => useStore.getState().toggleSwitch(selectedComp.id)}>
                  Toggle
                </button>
              )}
              <button className="delete-btn" onClick={() => removeComponent(selectedComp.id)}>
                Delete
              </button>
            </div>
          )}
          {selectedWire && (
            <div className="selection-info">
              <p>
                Wire ({selectedWire.color})
                {selectedWire.energized && <span className="energized-badge"> LIVE</span>}
              </p>
              <button className="delete-btn" onClick={() => removeWire(selectedWire.id)}>
                Delete
              </button>
            </div>
          )}
          {selectedRoom && (
            <div className="selection-info">
              <p>{selectedRoom.label}</p>
              <button className="delete-btn" onClick={() => removeRoom(selectedRoom.id)}>
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
