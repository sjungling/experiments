/**
 * The shared SVG filter that gives the Excalidraw theme its hand-drawn,
 * wavy borders. Themes reference it as `filter: url(#excalidraw-rough)`, so
 * this must be mounted somewhere in the document for those borders to render.
 *
 * feTurbulence makes smooth low-frequency noise; feDisplacementMap nudges each
 * pixel by that noise, turning straight strokes into wobbly, sketched ones.
 */
export default function RoughFilterDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute', pointerEvents: 'none' }}>
      <defs>
        <filter id="excalidraw-rough" x="-3%" y="-3%" width="106%" height="106%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.015" numOctaves={2} seed={7} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}
