import type { ReactNode } from 'react';
import { Box, Paper } from '@mui/material';
import { useThemeController } from '../theme/ThemeController';

const STRIPES = 'repeating-linear-gradient(#000 0 1px, transparent 1px 3px)';

// ── Classic Mac chrome ───────────────────────────────────────────────────────
function MacCloseBox() {
  return (
    <Box
      sx={{
        width: 13,
        height: 13,
        flex: 'none',
        border: '1px solid #000',
        bgcolor: '#fff',
        boxShadow: 'inset 1px 1px 0 #fff, inset -1px -1px 0 #808080',
      }}
    />
  );
}

function MacTitleBar({ title }: { title: string }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 1,
        height: 22,
        borderBottom: '1px solid #000',
        bgcolor: '#fff',
      }}
    >
      <MacCloseBox />
      <Box
        sx={{
          flex: 1,
          height: 13,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: STRIPES,
        }}
      >
        <Box
          sx={{
            bgcolor: '#fff',
            px: 1,
            fontFamily: "'Chicago', sans-serif",
            fontSize: 13,
            lineHeight: 1,
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </Box>
      </Box>
      <Box sx={{ width: 13, height: 13, flex: 'none' }} />
    </Box>
  );
}

// ── Lo-Fi Sketch chrome ──────────────────────────────────────────────────────
function SketchTitleBar({ title }: { title: string }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 1.5,
        height: 34,
        borderBottom: '1.5px solid',
        borderColor: 'divider',
        bgcolor: 'grey.100',
      }}
    >
      {/* "traffic-light" window dots, hand-drawn */}
      <Box sx={{ display: 'flex', gap: 0.75, flex: 'none' }}>
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              border: '1.5px solid',
              borderColor: 'grey.400',
              bgcolor: 'background.paper',
            }}
          />
        ))}
      </Box>
      <Box
        sx={{
          flex: 1,
          textAlign: 'center',
          fontFamily: "'Handlee', cursive",
          fontSize: 14,
          color: 'text.primary',
          whiteSpace: 'nowrap',
        }}
      >
        {title}
      </Box>
      {/* balance the dots so the title stays centered */}
      <Box sx={{ width: 42, flex: 'none' }} />
    </Box>
  );
}

// ── BeOS / Haiku chrome ──────────────────────────────────────────────────────
/** A BeOS window: the iconic yellow tab perched on a gray beveled panel. */
function BeWindow({ title, children, disablePadding }: WindowProps) {
  return (
    <Box sx={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))' }}>
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          height: 21,
          ml: '6px',
          px: 1.5,
          bgcolor: '#FFCB00',
          border: '1px solid #4C4C4C',
          borderBottom: 'none',
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.5)',
          fontFamily: "'Noto Sans', sans-serif",
          fontWeight: 700,
          fontSize: 12,
          color: '#101010',
          whiteSpace: 'nowrap',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {title}
      </Box>
      <Paper sx={{ mt: '-1px', boxShadow: 'none' }}>
        <Box sx={{ p: disablePadding ? 0 : 2 }}>{children}</Box>
      </Paper>
    </Box>
  );
}

// ── Mac OS X Aqua chrome ─────────────────────────────────────────────────────
const TRAFFIC_LIGHTS: Array<[string, string]> = [
  ['#FF5F57', '#E0443E'], // close
  ['#FEBC2E', '#DEA123'], // minimize
  ['#28C840', '#1AAB29'], // zoom
];

/** A Mac OS X window: pinstriped title bar, traffic lights, glossy panel. */
function AquaWindow({ title, children, disablePadding }: WindowProps) {
  return (
    <Box
      sx={{
        borderRadius: '7px',
        overflow: 'hidden',
        bgcolor: 'background.paper',
        border: '1px solid rgba(0,0,0,0.18)',
        boxShadow: '0 12px 28px rgba(0,0,0,0.22)',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          height: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: 'linear-gradient(to bottom, #ededed, #d6d6d6)',
          borderBottom: '1px solid #b0b0b0',
        }}
      >
        <Box sx={{ position: 'absolute', left: 8, top: 0, bottom: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          {TRAFFIC_LIGHTS.map(([fill, ring]) => (
            <Box
              key={fill}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: fill,
                border: `0.5px solid ${ring}`,
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.55)',
              }}
            />
          ))}
        </Box>
        <Box
          sx={{
            fontFamily: "'Lucida Grande', 'Helvetica Neue', sans-serif",
            fontSize: 13,
            fontWeight: 500,
            color: '#4a4a4a',
            textShadow: '0 1px 0 rgba(255,255,255,0.6)',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </Box>
      </Box>
      <Box sx={{ p: disablePadding ? 0 : 2 }}>{children}</Box>
    </Box>
  );
}

// ── NeXTSTEP chrome ──────────────────────────────────────────────────────────
/** A small chiseled square widget used in a NeXT title bar. */
function NextTitleWidget({ children }: { children?: ReactNode }) {
  return (
    <Box
      sx={{
        width: 17,
        height: 17,
        flex: 'none',
        bgcolor: '#A8A8A8',
        border: '1px solid #000',
        boxShadow: 'inset 2px 2px 0 #fff, inset -2px -2px 0 #565656',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
        fontSize: 11,
        fontWeight: 700,
        lineHeight: 1,
      }}
    >
      {children}
    </Box>
  );
}

/** A NeXTSTEP window: chiseled gray title bar with miniaturize/close widgets. */
function NextWindow({ title, children, disablePadding }: WindowProps) {
  return (
    <Box sx={{ border: '1px solid #000', boxShadow: '3px 3px 7px rgba(0,0,0,0.45)' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: '3px',
          py: '2px',
          bgcolor: '#A8A8A8',
          borderBottom: '1px solid #000',
          boxShadow: 'inset 2px 2px 0 #fff, inset 0 -2px 0 #565656',
        }}
      >
        <NextTitleWidget />
        <Box
          sx={{
            flex: 1,
            textAlign: 'center',
            fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
            fontSize: 13,
            fontWeight: 700,
            color: '#000',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </Box>
        <NextTitleWidget>×</NextTitleWidget>
      </Box>
      <Box sx={{ bgcolor: '#A8A8A8', p: disablePadding ? 0 : 2 }}>{children}</Box>
    </Box>
  );
}

// ── Excalidraw chrome ────────────────────────────────────────────────────────
/** An Excalidraw "frame": a hand-drawn label over a rough-bordered card. */
function ExcalidrawWindow({ title, children, disablePadding }: WindowProps) {
  return (
    <Box>
      <Box
        sx={{
          fontFamily: "'Virgil', cursive",
          fontSize: 15,
          color: '#6965DB',
          mb: 0.5,
          ml: 0.5,
        }}
      >
        {title}
      </Box>
      <Box sx={{ position: 'relative' }}>
        {/* A border-only overlay carries the rough filter so content stays crisp. */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            border: '1.5px solid #1E1E1E',
            borderRadius: '10px',
            filter: 'url(#excalidraw-rough)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            bgcolor: 'background.paper',
            borderRadius: '10px',
            boxShadow: '0 2px 0 rgba(0,0,0,0.10)',
            p: disablePadding ? 0 : 2,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

// ── Plan 9 (rio / acme) chrome ───────────────────────────────────────────────
/** An acme window: a pale-cyan tag bar + a left scroll column on a yellow body. */
function Plan9Window({ title, children, disablePadding }: WindowProps) {
  return (
    <Box sx={{ border: '1px solid #5B8AA0', boxShadow: '1px 1px 0 rgba(0,0,0,0.2)' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          bgcolor: '#EAFFFF',
          borderBottom: '1px solid #5B8AA0',
          px: '4px',
          py: '2px',
        }}
      >
        {/* the acme "layout box" you drag to manipulate the window */}
        <Box sx={{ width: 12, height: 12, flex: 'none', bgcolor: '#CBEEF0', border: '1px solid #5B8AA0' }} />
        <Box sx={{ fontFamily: "'Lucida Grande', sans-serif", fontSize: 13, color: '#000', whiteSpace: 'nowrap' }}>
          {title}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', bgcolor: '#FFFFEA' }}>
        {/* acme's left scrollbar column */}
        <Box sx={{ width: 12, flex: 'none', borderRight: '1px solid #9FBEC9' }}>
          <Box sx={{ height: 44, bgcolor: '#CBEEF0', borderBottom: '1px solid #9FBEC9' }} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0, p: disablePadding ? 0 : 2 }}>{children}</Box>
      </Box>
    </Box>
  );
}

// ── Frutiger Aero chrome ─────────────────────────────────────────────────────
/** A glossy Aero window control (minimize / maximize / close). */
function AeroControl({ gloss }: { gloss: string }) {
  return (
    <Box
      sx={{
        width: 22,
        height: 16,
        borderRadius: '3px',
        border: '1px solid rgba(255,255,255,0.55)',
        backgroundImage: gloss,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)',
      }}
    />
  );
}

/** A frosted-glass Aero window: translucent, rounded, glossy title bar. */
function AeroWindow({ title, children, disablePadding }: WindowProps) {
  const blueGloss = 'linear-gradient(to bottom, #bfe6ff, #5bb3ec)';
  const redGloss = 'linear-gradient(to bottom, #ff9a8c, #e23b2e)';
  return (
    <Box
      sx={{
        borderRadius: '10px',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.65)',
        boxShadow: '0 12px 30px rgba(0,30,60,0.30)',
        bgcolor: 'rgba(255,255,255,0.52)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 1,
          backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.78), rgba(255,255,255,0.32))',
          borderBottom: '1px solid rgba(255,255,255,0.5)',
        }}
      >
        <Box
          sx={{
            fontFamily: "'Segoe UI', 'Open Sans', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: '#16384F',
            textShadow: '0 1px 0 rgba(255,255,255,0.85)',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </Box>
        <Box sx={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: 0.5 }}>
          <AeroControl gloss={blueGloss} />
          <AeroControl gloss={blueGloss} />
          <AeroControl gloss={redGloss} />
        </Box>
      </Box>
      <Box sx={{ bgcolor: 'rgba(255,255,255,0.4)', p: disablePadding ? 0 : 2 }}>{children}</Box>
    </Box>
  );
}

// ── CRT terminal chrome ──────────────────────────────────────────────────────
/** A TUI "pane": a glowing green border with a prompt-style title and [X]. */
function CrtWindow({ title, children, disablePadding }: WindowProps) {
  return (
    <Box sx={{ border: '1px solid #3BFF6E', bgcolor: '#0A140A', boxShadow: '0 0 8px rgba(59,255,110,0.18)' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          borderBottom: '1px solid #3BFF6E',
          px: 1,
          py: '1px',
          color: '#3BFF6E',
          fontFamily: "'VT323', monospace",
          fontSize: 18,
          textShadow: '0 0 3px rgba(59,255,110,0.5)',
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {`> ${title}`}
        </Box>
        <Box component="span">[X]</Box>
      </Box>
      <Box sx={{ p: disablePadding ? 0 : 2 }}>{children}</Box>
    </Box>
  );
}

export interface WindowProps {
  title: string;
  children: ReactNode;
  /** Disable the inner body padding when the content manages its own spacing. */
  disablePadding?: boolean;
}

/**
 * A titled container that morphs with the active theme: a classic Mac window
 * (pinstripe title bar + close box) under the "mac" theme, or a hand-sketched
 * wireframe card (wobbly border + window dots) under the "sketch" theme.
 */
export function Window({ title, children, disablePadding }: WindowProps) {
  const { themeKey } = useThemeController();

  if (themeKey === 'beos') {
    return (
      <BeWindow title={title} disablePadding={disablePadding}>
        {children}
      </BeWindow>
    );
  }

  if (themeKey === 'aqua') {
    return (
      <AquaWindow title={title} disablePadding={disablePadding}>
        {children}
      </AquaWindow>
    );
  }

  if (themeKey === 'nextstep') {
    return (
      <NextWindow title={title} disablePadding={disablePadding}>
        {children}
      </NextWindow>
    );
  }

  if (themeKey === 'excalidraw') {
    return (
      <ExcalidrawWindow title={title} disablePadding={disablePadding}>
        {children}
      </ExcalidrawWindow>
    );
  }

  if (themeKey === 'plan9') {
    return (
      <Plan9Window title={title} disablePadding={disablePadding}>
        {children}
      </Plan9Window>
    );
  }

  if (themeKey === 'aero') {
    return (
      <AeroWindow title={title} disablePadding={disablePadding}>
        {children}
      </AeroWindow>
    );
  }

  if (themeKey === 'crt') {
    return (
      <CrtWindow title={title} disablePadding={disablePadding}>
        {children}
      </CrtWindow>
    );
  }

  const sketch = themeKey === 'sketch';
  return (
    <Paper
      sx={{
        overflow: 'hidden',
        // The sketch Paper already carries its soft offset shadow from the
        // theme; the Mac window wants the crisp 2px slab instead.
        boxShadow: sketch ? undefined : '2px 2px 0 0 rgba(0,0,0,0.6)',
      }}
    >
      {sketch ? <SketchTitleBar title={title} /> : <MacTitleBar title={title} />}
      <Box sx={{ p: disablePadding ? 0 : 2 }}>{children}</Box>
    </Paper>
  );
}

export default Window;
