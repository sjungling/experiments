import type { ReactNode } from 'react';
import { Box, Paper } from '@mui/material';

const STRIPES = 'repeating-linear-gradient(#000 0 1px, transparent 1px 3px)';

/** A small inert "close box" like the one in a System 7 window title bar. */
function CloseBox() {
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

/** The pinstriped title bar that sits atop a classic Mac window. */
function TitleBar({ title }: { title: string }) {
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
      <CloseBox />
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
      {/* Balance the close box so the title stays centered. */}
      <Box sx={{ width: 13, height: 13, flex: 'none' }} />
    </Box>
  );
}

export interface WindowProps {
  title: string;
  children: ReactNode;
  /** Disable the inner body padding when the content manages its own spacing. */
  disablePadding?: boolean;
}

/** A draggable-looking classic Mac window: title bar + bordered content slab. */
export function Window({ title, children, disablePadding }: WindowProps) {
  return (
    <Paper sx={{ boxShadow: '2px 2px 0 0 rgba(0,0,0,0.6)' }}>
      <TitleBar title={title} />
      <Box sx={{ p: disablePadding ? 0 : 2 }}>{children}</Box>
    </Paper>
  );
}

export default Window;
