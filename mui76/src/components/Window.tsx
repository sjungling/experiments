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
