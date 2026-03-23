import { useStore } from '../store/useStore';
import { WIRE_COLOR_MAP, WIRE_COLOR_LABELS, ALL_WIRE_COLORS } from '../utils/wireColors';
import { getExpectedWires } from '../utils/wireColors';

export function WireColorGuide() {
  const showWireInfo = useStore((s) => s.showWireInfo);
  const setShowWireInfo = useStore((s) => s.setShowWireInfo);

  if (!showWireInfo) return null;

  const configs = [
    { label: 'Standard Outlet', config: 'outlet' as const },
    { label: '2-Way Switch', config: '2-way' as const },
    { label: '3-Way Switch', config: '3-way' as const },
    { label: 'Light Fixture', config: 'light' as const },
  ];

  return (
    <div className="wire-guide-overlay">
      <div className="wire-guide">
        <div className="wire-guide-header">
          <h2>Wire Color Reference Guide</h2>
          <button onClick={() => setShowWireInfo(false)}>&times;</button>
        </div>

        <div className="wire-guide-legend">
          <h3>Standard Wire Colors (NEC)</h3>
          <div className="color-legend">
            {ALL_WIRE_COLORS.map((color) => (
              <div key={color} className="legend-item">
                <span
                  className="legend-swatch"
                  style={{
                    backgroundColor: WIRE_COLOR_MAP[color],
                    border: color === 'white' ? '1px solid #ccc' : 'none',
                  }}
                />
                <strong>{color.charAt(0).toUpperCase() + color.slice(1)}</strong>
                <span>{WIRE_COLOR_LABELS[color]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="wire-guide-configs">
          {configs.map(({ label, config }) => {
            const wires = getExpectedWires('', config);
            return (
              <div key={config} className="config-card">
                <h3>{label}</h3>
                <p className="config-subtitle">
                  Wires behind the plate:
                </p>
                <ul>
                  {wires.map((w, i) => (
                    <li key={i}>
                      <span
                        className="legend-swatch small"
                        style={{
                          backgroundColor: WIRE_COLOR_MAP[w.color],
                          border: w.color === 'white' ? '1px solid #ccc' : 'none',
                        }}
                      />
                      <strong>{w.color}</strong> &mdash; {w.purpose}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="wire-guide-notes">
          <h3>3-Way Switch Wiring</h3>
          <p>
            A 3-way circuit uses two switches to control one light. The wiring between
            switches uses <strong>traveler wires</strong> (typically red and white/black).
          </p>
          <div className="diagram-ascii">
            <pre>{`
  Panel ──[black]──> Switch 1 ──[red]──────> Switch 2 ──[black]──> Light
  (Hot)              │ common    travelers    common │              │
                     └──[white/blue]─────────────────┘              │
  Panel ──[white]──────────────── neutral ──────────────────────────┘
  Panel ──[green]──────────────── ground ───────────────────────────┘
            `}</pre>
          </div>
          <p>
            Toggle each 3-way switch to see how the traveler position affects the circuit.
            The light is ON when both switches connect to the <em>same</em> traveler.
          </p>
        </div>
      </div>
    </div>
  );
}
