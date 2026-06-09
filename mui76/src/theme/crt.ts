import { createTheme } from '@mui/material/styles';

/**
 * crt.ts — a Material UI theme styled like a green-phosphor CRT terminal.
 *
 * The look:
 *   - Glowing green monospace (VT323) on near-black, with a phosphor text glow.
 *   - Full-screen scanline + vignette overlay (via the CssBaseline body
 *     pseudo-elements) and a blinking block cursor.
 *   - Flat TUI chrome: hard green 1px borders, no radii, and controls that
 *     invert (green fill, black text) on hover — the classic selected look.
 *   - Amber/red phosphors reserved for warnings and errors.
 */

// ── Palette ──────────────────────────────────────────────────────────────────
const GREEN = '#3BFF6E';
const GREEN_DIM = '#2BBF53';
const GREEN_DK = '#176B33';
const BG = '#050A05';
const PANEL = '#0A140A';
const AMBER = '#FFB000';
const RED = '#FF5C5C';
const BLACK = '#020402';

// ── Type ─────────────────────────────────────────────────────────────────────
const FONT = "'VT323', 'Courier New', monospace";
const GLOW = '0 0 3px rgba(59,255,110,0.5)';
const BOX_GLOW = '0 0 8px rgba(59,255,110,0.18)';

const theme = createTheme({
  shape: { borderRadius: 0 },

  palette: {
    mode: 'dark',
    common: { black: BLACK, white: GREEN },
    primary: { main: GREEN, dark: GREEN_DIM, contrastText: BLACK },
    secondary: { main: GREEN_DIM, contrastText: BLACK },
    background: { default: BG, paper: PANEL },
    text: { primary: GREEN, secondary: GREEN_DIM, disabled: GREEN_DK },
    divider: GREEN_DK,
    info: { main: GREEN, contrastText: BLACK },
    success: { main: GREEN, contrastText: BLACK },
    warning: { main: AMBER, contrastText: BLACK },
    error: { main: RED, contrastText: BLACK },
    grey: {
      50: '#0E1A0E',
      100: PANEL,
      200: '#10200F',
      300: GREEN_DK,
      400: '#1F8F44',
      500: GREEN_DIM,
      600: GREEN_DIM,
      700: GREEN,
      800: '#9BFFB8',
      900: GREEN,
    },
  },

  typography: {
    fontFamily: FONT,
    fontSize: 17,
    h1: { fontFamily: FONT, fontSize: 38, fontWeight: 400 },
    h2: { fontFamily: FONT, fontSize: 30, fontWeight: 400 },
    h3: { fontFamily: FONT, fontSize: 24, fontWeight: 400 },
    h4: { fontFamily: FONT, fontSize: 21, fontWeight: 400 },
    h5: { fontFamily: FONT, fontSize: 18, fontWeight: 400 },
    h6: { fontFamily: FONT, fontSize: 17, fontWeight: 400 },
    subtitle1: { fontFamily: FONT, fontSize: 17 },
    subtitle2: { fontFamily: FONT, fontSize: 15 },
    body1: { fontSize: 17, lineHeight: 1.35 },
    body2: { fontSize: 16, lineHeight: 1.35 },
    caption: { fontSize: 14, color: GREEN_DIM },
    button: { fontFamily: FONT, textTransform: 'none' },
    overline: { fontFamily: FONT, fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, color: GREEN_DIM },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@keyframes crt-blink': { '0%, 49%': { opacity: 1 }, '50%, 100%': { opacity: 0 } },
        html: { WebkitFontSmoothing: 'antialiased' },
        body: {
          backgroundColor: BG,
          color: GREEN,
          // The phosphor glow — inherited by all text.
          textShadow: GLOW,
        },
        // Vignette (darkened CRT corners).
        'body::before': {
          content: '""',
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 9998,
          background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)',
        },
        // Scanlines across the whole screen.
        'body::after': {
          content: '""',
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 9999,
          background: 'repeating-linear-gradient(to bottom, rgba(0,0,0,0) 0 2px, rgba(0,0,0,0.22) 2px 3px)',
        },
        code: { fontFamily: FONT },
        '::selection': { backgroundColor: GREEN, color: BLACK, textShadow: 'none' },
        '*::-webkit-scrollbar': { width: 14, height: 14 },
        '*::-webkit-scrollbar-track': { backgroundColor: BG, borderLeft: `1px solid ${GREEN_DK}` },
        '*::-webkit-scrollbar-thumb': { backgroundColor: GREEN_DK, border: `1px solid ${GREEN_DIM}` },
        '*::-webkit-scrollbar-thumb:hover': { backgroundColor: GREEN_DIM },
      },
    },

    // ── Surfaces ─────────────────────────────────────────────────────────────
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { backgroundColor: PANEL, color: GREEN, border: `1px solid ${GREEN}`, borderRadius: 0, backgroundImage: 'none', boxShadow: BOX_GLOW },
      },
    },
    MuiCard: { defaultProps: { elevation: 0 }, styleOverrides: { root: { borderRadius: 0, boxShadow: BOX_GLOW } } },
    MuiCardHeader: {
      styleOverrides: {
        root: { borderBottom: `1px solid ${GREEN}`, padding: '6px 12px' },
        title: { fontFamily: FONT, fontSize: 18 },
        subheader: { fontFamily: FONT, fontSize: 15, color: GREEN_DIM },
      },
    },

    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'transparent', position: 'static' },
      styleOverrides: {
        root: { backgroundColor: PANEL, color: GREEN, borderRadius: 0, borderBottom: `1px solid ${GREEN}`, boxShadow: 'none', backgroundImage: 'none' },
      },
    },
    MuiToolbar: { styleOverrides: { root: { minHeight: 34, '@media (min-width:600px)': { minHeight: 34 } } } },

    // ── Buttons (bracketed TUI controls) ─────────────────────────────────────
    MuiButton: {
      defaultProps: { variant: 'outlined', disableElevation: true, disableRipple: true },
      styleOverrides: {
        root: {
          fontFamily: FONT,
          fontSize: 16,
          textTransform: 'none',
          borderRadius: 0,
          border: `1px solid ${GREEN}`,
          backgroundColor: 'transparent',
          color: GREEN,
          boxShadow: 'none',
          padding: '2px 12px',
          minWidth: 0,
          lineHeight: 1.3,
          transition: 'none',
          '&::before': { content: '"["', marginRight: 5, opacity: 0.7 },
          '&::after': { content: '"]"', marginLeft: 5, opacity: 0.7 },
          '&:hover': { backgroundColor: GREEN, color: BLACK, textShadow: 'none' },
          '&:active': { backgroundColor: GREEN_DIM, color: BLACK },
          '&.Mui-disabled': { color: GREEN_DK, borderColor: GREEN_DK },
        },
        contained: {
          backgroundColor: GREEN,
          color: BLACK,
          textShadow: 'none',
          '&:hover': { backgroundColor: '#7BFF9E' },
          '&:active': { backgroundColor: GREEN_DIM },
        },
        text: {
          border: '1px solid transparent',
          padding: '2px 6px',
          '&::before': { content: '""', marginRight: 0 },
          '&::after': { content: '""', marginLeft: 0 },
          '&:hover': { backgroundColor: 'transparent', color: GREEN, textDecoration: 'underline' },
        },
      },
    },
    MuiButtonGroup: {
      defaultProps: { disableRipple: true, disableElevation: true, variant: 'outlined' },
      styleOverrides: { grouped: { '&:not(:last-of-type)': { borderRightColor: GREEN } } },
    },
    MuiIconButton: {
      defaultProps: { disableRipple: true },
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: `1px solid ${GREEN}`,
          backgroundColor: 'transparent',
          color: GREEN,
          padding: 5,
          '&:hover': { backgroundColor: GREEN, color: BLACK },
          '&.Mui-disabled': { color: GREEN_DK, borderColor: GREEN_DK },
        },
      },
    },

    // ── Form controls ────────────────────────────────────────────────────────
    MuiTextField: { defaultProps: { variant: 'outlined', size: 'small' } },
    MuiFormControl: { defaultProps: { size: 'small' } },
    MuiSelect: { defaultProps: { size: 'small' } },
    MuiInputBase: {
      styleOverrides: {
        root: { fontFamily: FONT, fontSize: 17, backgroundColor: '#06100A', color: GREEN, caretColor: GREEN },
        input: { padding: '4px 8px', '&::placeholder': { color: GREEN_DK, opacity: 1 } },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#06100A',
          borderRadius: 0,
          '& .MuiOutlinedInput-notchedOutline': { borderColor: GREEN, borderRadius: 0 },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: GREEN },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: GREEN, borderWidth: 1, boxShadow: BOX_GLOW },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': { borderColor: RED },
        },
      },
    },
    MuiInputLabel: { styleOverrides: { root: { fontFamily: FONT, fontSize: 17, color: GREEN_DIM, '&.Mui-focused': { color: GREEN } } } },
    MuiFormLabel: { styleOverrides: { root: { fontFamily: FONT, color: GREEN, '&.Mui-focused': { color: GREEN } } } },
    MuiFormControlLabel: { styleOverrides: { label: { fontFamily: FONT, fontSize: 17 } } },
    MuiFormHelperText: { styleOverrides: { root: { fontFamily: FONT, fontSize: 14, marginLeft: 2, '&.Mui-error': { color: RED } } } },
    MuiCheckbox: {
      defaultProps: { disableRipple: true },
      styleOverrides: { root: { color: GREEN, padding: 4, '&.Mui-checked': { color: GREEN }, '&.Mui-disabled': { color: GREEN_DK } } },
    },
    MuiRadio: {
      defaultProps: { disableRipple: true },
      styleOverrides: { root: { color: GREEN, padding: 4, '&.Mui-checked': { color: GREEN }, '&.Mui-disabled': { color: GREEN_DK } } },
    },
    MuiSwitch: {
      styleOverrides: {
        root: { width: 50, height: 24, padding: 6 },
        switchBase: {
          padding: 5,
          color: GREEN,
          '&.Mui-checked': { transform: 'translateX(26px)', color: BLACK, '& + .MuiSwitch-track': { backgroundColor: GREEN, opacity: 1, borderColor: GREEN } },
        },
        thumb: { width: 12, height: 12, borderRadius: 0, boxShadow: 'none' },
        track: { borderRadius: 0, backgroundColor: 'transparent', border: `1px solid ${GREEN}`, opacity: 1 },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: { color: GREEN, height: 6, padding: '13px 0' },
        rail: { backgroundColor: 'transparent', opacity: 1, borderRadius: 0, border: `1px solid ${GREEN_DK}` },
        track: { backgroundColor: GREEN, border: `1px solid ${GREEN}`, borderRadius: 0 },
        thumb: { width: 12, height: 18, borderRadius: 0, backgroundColor: GREEN, border: `1px solid ${GREEN}`, boxShadow: GLOW, '&:hover, &.Mui-focusVisible': { boxShadow: BOX_GLOW } },
        valueLabel: { backgroundColor: GREEN, color: BLACK, borderRadius: 0, fontFamily: FONT, fontSize: 14 },
        markLabel: { fontFamily: FONT, fontSize: 13, color: GREEN_DIM },
      },
    },

    // ── Tabs ─────────────────────────────────────────────────────────────────
    MuiTabs: { styleOverrides: { root: { minHeight: 0, borderBottom: `1px solid ${GREEN}` }, indicator: { display: 'none' } } },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: FONT,
          fontSize: 16,
          textTransform: 'none',
          minHeight: 0,
          padding: '4px 14px',
          marginRight: 3,
          color: GREEN,
          border: `1px solid ${GREEN}`,
          borderBottom: 'none',
          '&.Mui-selected': { color: BLACK, backgroundColor: GREEN, textShadow: 'none' },
        },
      },
    },

    // ── Overlays ─────────────────────────────────────────────────────────────
    MuiDialog: { styleOverrides: { paper: { border: `1px solid ${GREEN}`, borderRadius: 0, boxShadow: '0 0 18px rgba(59,255,110,0.3)', backgroundColor: PANEL } } },
    MuiDialogTitle: { styleOverrides: { root: { fontFamily: FONT, fontSize: 19, padding: '6px 14px', borderBottom: `1px solid ${GREEN}` } } },
    MuiBackdrop: { styleOverrides: { root: { backgroundColor: 'rgba(0,8,0,0.6)' }, invisible: { backgroundColor: 'transparent' } } },
    MuiMenu: {
      styleOverrides: { paper: { borderRadius: 0, border: `1px solid ${GREEN}`, boxShadow: BOX_GLOW, backgroundColor: PANEL }, list: { padding: 0 } },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: FONT,
          fontSize: 17,
          '&:hover': { backgroundColor: GREEN, color: BLACK, textShadow: 'none' },
          '&.Mui-selected': { backgroundColor: GREEN, color: BLACK, '&:hover': { backgroundColor: GREEN } },
        },
      },
    },
    MuiTooltip: {
      defaultProps: { arrow: false },
      styleOverrides: {
        tooltip: { backgroundColor: PANEL, color: GREEN, border: `1px solid ${GREEN}`, borderRadius: 0, fontFamily: FONT, fontSize: 15, boxShadow: BOX_GLOW, padding: '3px 8px' },
      },
    },

    // ── Feedback ─────────────────────────────────────────────────────────────
    MuiAlert: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: { fontFamily: FONT, fontSize: 16, borderRadius: 0, border: `1px solid ${GREEN}`, backgroundColor: PANEL, color: GREEN, boxShadow: 'none' },
        outlinedInfo: { borderColor: GREEN, '& .MuiAlert-icon': { color: GREEN } },
        outlinedSuccess: { borderColor: GREEN, '& .MuiAlert-icon': { color: GREEN } },
        outlinedWarning: { borderColor: AMBER, color: AMBER, '& .MuiAlert-icon': { color: AMBER } },
        outlinedError: { borderColor: RED, color: RED, '& .MuiAlert-icon': { color: RED } },
        message: { color: 'inherit' },
      },
    },
    MuiAlertTitle: { styleOverrides: { root: { fontFamily: FONT, fontSize: 16 } } },
    MuiLinearProgress: {
      styleOverrides: {
        root: { height: 16, borderRadius: 0, border: `1px solid ${GREEN}`, backgroundColor: 'transparent' },
        // A blocky, glowing green fill.
        bar: { backgroundColor: GREEN, backgroundImage: `repeating-linear-gradient(90deg, ${GREEN} 0 8px, ${BG} 8px 10px)`, boxShadow: BOX_GLOW },
      },
    },
    MuiCircularProgress: { styleOverrides: { root: { color: GREEN } } },

    // ── Data display ─────────────────────────────────────────────────────────
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 0, border: `1px solid ${GREEN}`, backgroundColor: 'transparent', color: GREEN, fontFamily: FONT, fontSize: 15, height: 24 },
        outlined: { backgroundColor: 'transparent' },
        deleteIcon: { color: GREEN_DIM, '&:hover': { color: GREEN } },
      },
    },
    MuiBadge: {
      styleOverrides: { badge: { borderRadius: 0, border: `1px solid ${GREEN}`, backgroundColor: GREEN, color: BLACK, fontFamily: FONT, fontSize: 13, minWidth: 18, height: 18, textShadow: 'none' } },
    },
    MuiDivider: { styleOverrides: { root: { borderColor: GREEN_DK } } },
    MuiTableContainer: { styleOverrides: { root: { boxShadow: 'none' } } },
    MuiTable: { styleOverrides: { root: { backgroundColor: 'transparent' } } },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: GREEN_DK, fontFamily: FONT, fontSize: 16, padding: '4px 10px', color: GREEN },
        head: { fontFamily: FONT, backgroundColor: '#0E1A0E', color: GREEN, borderColor: GREEN },
      },
    },
    MuiList: { styleOverrides: { root: { paddingTop: 0, paddingBottom: 0, backgroundColor: 'transparent' } } },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': { backgroundColor: GREEN, color: BLACK, textShadow: 'none', '& .MuiListItemIcon-root': { color: BLACK }, '& .MuiListItemText-secondary': { color: BLACK }, '&:hover': { backgroundColor: GREEN } },
          '&:hover': { backgroundColor: '#10240F' },
        },
      },
    },
    MuiListItemText: {
      styleOverrides: { primary: { fontFamily: FONT, fontSize: 17 }, secondary: { fontFamily: FONT, fontSize: 14, color: GREEN_DIM } },
    },
    MuiListItemIcon: { styleOverrides: { root: { color: GREEN_DIM, minWidth: 30 } } },

    // ── Disclosure ───────────────────────────────────────────────────────────
    MuiAccordion: {
      defaultProps: { disableGutters: true, elevation: 0, square: true },
      styleOverrides: { root: { border: `1px solid ${GREEN}`, boxShadow: 'none', backgroundColor: PANEL, '&:not(:last-child)': { borderBottom: 0 }, '&::before': { display: 'none' } } },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: { backgroundColor: '#0E1A0E', fontFamily: FONT, minHeight: 0, '&.Mui-expanded': { minHeight: 0, borderBottom: `1px solid ${GREEN}` } },
        content: { margin: '7px 0', '&.Mui-expanded': { margin: '7px 0' } },
      },
    },
    MuiAccordionDetails: { styleOverrides: { root: { padding: 12, fontFamily: FONT, backgroundColor: PANEL } } },
  },
});

export const crt = theme;
export default theme;
