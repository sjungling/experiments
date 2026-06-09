import { createTheme } from '@mui/material/styles';

/**
 * excalidraw.ts — a Material UI theme styled like an Excalidraw drawing.
 *
 * The look:
 *   - Virgil, Excalidraw's hand-drawn marker font, on a white dot-grid canvas.
 *   - Genuinely *rough* borders: a shared SVG turbulence/displacement filter
 *     (id "excalidraw-rough", injected by <RoughFilterDefs/> in App) gives every
 *     stroke a wavy, sketched-by-hand wobble — the rough.js signature.
 *   - The Excalidraw-violet accent for primary/selected, plus the marker
 *     palette (red/green/blue/orange) for semantics.
 *
 * Note: this theme references `filter: url(#excalidraw-rough)`, so it only looks
 * right while <RoughFilterDefs/> is mounted (it always is, in this app).
 */

// ── Palette ──────────────────────────────────────────────────────────────────
const STROKE = '#1E1E1E'; // hand-drawn ink
const TEXT = '#1E1E1E';
const TEXT_LIGHT = '#495057';
const TEXT_DISABLED = '#ADB5BD';
const VIOLET = '#6965DB'; // Excalidraw brand accent
const VIOLET_LT = '#E0DFFF'; // selected
const VIOLET_DK = '#5B57C2';
const WHITE = '#FFFFFF';
const APP_BG = '#FAFAFA';
const GRID = '#E8E8E8';
const FILL = '#F1F3F5';
const FILL_DK = '#E9ECEF';
const RED = '#E03131';
const GREEN = '#2F9E44';
const BLUE = '#1971C2';
const ORANGE = '#F08C00';

// ── Type ─────────────────────────────────────────────────────────────────────
const FONT = "'Virgil', 'Comic Sans MS', 'Segoe Print', cursive";
const MONO = "'Fira Code', ui-monospace, monospace";

// The shared rough-border filter (defined by <RoughFilterDefs/>).
const ROUGH = 'url(#excalidraw-rough)';
const STROKE_BORDER = `1.5px solid ${STROKE}`;
const SOFT_SHADOW = '0 1.5px 0 rgba(0,0,0,0.12)';

const theme = createTheme({
  shape: { borderRadius: 8 },

  palette: {
    mode: 'light',
    common: { black: STROKE, white: WHITE },
    primary: { main: VIOLET, dark: VIOLET_DK, light: VIOLET_LT, contrastText: WHITE },
    secondary: { main: FILL_DK, contrastText: TEXT },
    background: { default: APP_BG, paper: WHITE },
    text: { primary: TEXT, secondary: TEXT_LIGHT, disabled: TEXT_DISABLED },
    divider: '#CED4DA',
    info: { main: BLUE, contrastText: WHITE },
    success: { main: GREEN, contrastText: WHITE },
    warning: { main: ORANGE, contrastText: WHITE },
    error: { main: RED, contrastText: WHITE },
    grey: {
      50: '#F8F9FA',
      100: FILL,
      200: FILL_DK,
      300: '#DEE2E6',
      400: '#CED4DA',
      500: '#ADB5BD',
      600: '#868E96',
      700: TEXT_LIGHT,
      800: '#343A40',
      900: STROKE,
    },
  },

  typography: {
    fontFamily: FONT,
    fontSize: 15,
    h1: { fontFamily: FONT, fontSize: 30, fontWeight: 400 },
    h2: { fontFamily: FONT, fontSize: 24, fontWeight: 400 },
    h3: { fontFamily: FONT, fontSize: 19, fontWeight: 400 },
    h4: { fontFamily: FONT, fontSize: 17, fontWeight: 400 },
    h5: { fontFamily: FONT, fontSize: 15, fontWeight: 400 },
    h6: { fontFamily: FONT, fontSize: 14, fontWeight: 400 },
    subtitle1: { fontFamily: FONT, fontSize: 15 },
    subtitle2: { fontFamily: FONT, fontSize: 13 },
    body1: { fontSize: 15, lineHeight: 1.5 },
    body2: { fontSize: 13, lineHeight: 1.5 },
    caption: { fontSize: 12, color: TEXT_LIGHT },
    button: { fontFamily: FONT, textTransform: 'none' },
    overline: { fontFamily: FONT, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, color: TEXT_LIGHT },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' },
        body: {
          backgroundColor: APP_BG,
          // The Excalidraw canvas dot grid.
          backgroundImage: `radial-gradient(${GRID} 1.2px, transparent 1.2px)`,
          backgroundSize: '22px 22px',
        },
        code: { fontFamily: MONO },
        '::selection': { backgroundColor: VIOLET_LT, color: TEXT },
        '*::-webkit-scrollbar': { width: 12, height: 12 },
        '*::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
        '*::-webkit-scrollbar-thumb': { backgroundColor: '#CED4DA', borderRadius: 6, border: '3px solid transparent', backgroundClip: 'content-box' },
        '*::-webkit-scrollbar-thumb:hover': { backgroundColor: '#ADB5BD' },
      },
    },

    // ── Surfaces ─────────────────────────────────────────────────────────────
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundColor: WHITE,
          color: TEXT,
          border: STROKE_BORDER,
          borderRadius: 8,
          backgroundImage: 'none',
          boxShadow: SOFT_SHADOW,
          filter: ROUGH,
        },
      },
    },
    MuiCard: { defaultProps: { elevation: 0 }, styleOverrides: { root: { borderRadius: 8, boxShadow: '0 2px 0 rgba(0,0,0,0.12)' } } },
    MuiCardHeader: {
      styleOverrides: {
        root: { borderBottom: STROKE_BORDER, padding: '10px 16px' },
        title: { fontFamily: FONT, fontSize: 17 },
        subheader: { fontFamily: FONT, fontSize: 13, color: TEXT_LIGHT },
      },
    },

    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'transparent', position: 'static' },
      styleOverrides: {
        root: {
          backgroundColor: WHITE,
          color: TEXT,
          borderRadius: 0,
          borderBottom: STROKE_BORDER,
          boxShadow: 'none',
          backgroundImage: 'none',
        },
      },
    },
    MuiToolbar: { styleOverrides: { root: { minHeight: 52, '@media (min-width:600px)': { minHeight: 52 } } } },

    // ── Buttons ──────────────────────────────────────────────────────────────
    MuiButton: {
      defaultProps: { variant: 'outlined', disableElevation: true, disableRipple: true },
      styleOverrides: {
        root: {
          fontFamily: FONT,
          fontSize: 15,
          textTransform: 'none',
          borderRadius: 8,
          border: STROKE_BORDER,
          backgroundColor: WHITE,
          color: TEXT,
          boxShadow: SOFT_SHADOW,
          filter: ROUGH,
          padding: '4px 16px',
          minWidth: 0,
          lineHeight: 1.4,
          transition: 'none',
          '&:hover': { backgroundColor: '#F4F3FF', boxShadow: SOFT_SHADOW },
          '&:active': { transform: 'translateY(0.5px)', boxShadow: '0 0.5px 0 rgba(0,0,0,0.12)' },
          '&.Mui-disabled': { color: TEXT_DISABLED, borderColor: '#CED4DA', boxShadow: 'none' },
        },
        outlined: {
          '&.MuiButton-colorError': { borderColor: RED, color: RED },
          '&.MuiButton-colorSuccess': { borderColor: GREEN, color: GREEN },
        },
        contained: {
          backgroundColor: VIOLET,
          color: WHITE,
          borderColor: VIOLET_DK,
          '&:hover': { backgroundColor: '#7A77E0' },
          '&.Mui-disabled': { backgroundColor: '#C7C5F0', color: WHITE, borderColor: '#C7C5F0' },
        },
        text: {
          border: '1.5px solid transparent',
          backgroundColor: 'transparent',
          boxShadow: 'none',
          filter: 'none',
          color: VIOLET_DK,
          minWidth: 0,
          padding: '4px 10px',
          '&:hover': { backgroundColor: FILL, boxShadow: 'none' },
        },
        sizeSmall: { padding: '2px 10px', fontSize: 13 },
        sizeLarge: { padding: '8px 22px', fontSize: 17 },
      },
    },
    MuiButtonGroup: {
      defaultProps: { disableRipple: true, disableElevation: true, variant: 'outlined' },
      styleOverrides: { grouped: { '&:not(:last-of-type)': { borderRightColor: STROKE } } },
    },
    MuiIconButton: {
      defaultProps: { disableRipple: true },
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: STROKE_BORDER,
          backgroundColor: WHITE,
          color: TEXT,
          boxShadow: SOFT_SHADOW,
          filter: ROUGH,
          padding: 6,
          '&:hover': { backgroundColor: '#F4F3FF' },
          '&.Mui-disabled': { color: TEXT_DISABLED, borderColor: '#CED4DA', boxShadow: 'none' },
        },
      },
    },

    // ── Form controls ────────────────────────────────────────────────────────
    MuiTextField: { defaultProps: { variant: 'outlined', size: 'small' } },
    MuiFormControl: { defaultProps: { size: 'small' } },
    MuiSelect: { defaultProps: { size: 'small' } },
    MuiInputBase: {
      styleOverrides: {
        root: { fontFamily: FONT, fontSize: 15, backgroundColor: WHITE },
        input: { padding: '6px 10px', '&::placeholder': { color: TEXT_DISABLED, opacity: 1 } },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: WHITE,
          borderRadius: 8,
          // Rough only the outline so typed text stays crisp.
          '& .MuiOutlinedInput-notchedOutline': { borderColor: STROKE, borderWidth: 1.5, borderRadius: 8, filter: ROUGH },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: STROKE },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: VIOLET, borderWidth: 2 },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': { borderColor: RED },
        },
      },
    },
    MuiInputLabel: { styleOverrides: { root: { fontFamily: FONT, fontSize: 15, color: TEXT_LIGHT, '&.Mui-focused': { color: VIOLET_DK } } } },
    MuiFormLabel: { styleOverrides: { root: { fontFamily: FONT, color: TEXT, '&.Mui-focused': { color: VIOLET_DK } } } },
    MuiFormControlLabel: { styleOverrides: { label: { fontFamily: FONT, fontSize: 15 } } },
    MuiFormHelperText: { styleOverrides: { root: { fontFamily: FONT, fontSize: 12, marginLeft: 2, '&.Mui-error': { color: RED } } } },
    MuiCheckbox: {
      defaultProps: { disableRipple: true },
      styleOverrides: { root: { color: STROKE, padding: 4, '&.Mui-checked': { color: VIOLET }, '&.Mui-disabled': { color: '#CED4DA' } } },
    },
    MuiRadio: {
      defaultProps: { disableRipple: true },
      styleOverrides: { root: { color: STROKE, padding: 4, '&.Mui-checked': { color: VIOLET }, '&.Mui-disabled': { color: '#CED4DA' } } },
    },
    MuiSwitch: {
      styleOverrides: {
        root: { width: 48, height: 28, padding: 7 },
        switchBase: {
          padding: 6,
          '&.Mui-checked': {
            transform: 'translateX(20px)',
            color: WHITE,
            '& + .MuiSwitch-track': { backgroundColor: VIOLET, opacity: 1, borderColor: VIOLET_DK },
          },
        },
        thumb: { width: 14, height: 14, borderRadius: '50%', backgroundColor: WHITE, border: `1.5px solid ${STROKE}`, boxShadow: 'none' },
        track: { borderRadius: 14, backgroundColor: WHITE, border: STROKE_BORDER, opacity: 1 },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: { color: VIOLET, height: 4, padding: '13px 0' },
        rail: { backgroundColor: FILL_DK, opacity: 1, borderRadius: 4, border: `1px solid ${STROKE}` },
        track: { backgroundColor: VIOLET, border: `1px solid ${VIOLET_DK}`, borderRadius: 4 },
        thumb: {
          width: 18,
          height: 18,
          backgroundColor: WHITE,
          border: `1.5px solid ${STROKE}`,
          boxShadow: SOFT_SHADOW,
          '&:hover, &.Mui-focusVisible': { boxShadow: '0 0 0 6px rgba(105,101,219,0.16)' },
        },
        valueLabel: { backgroundColor: STROKE, color: WHITE, borderRadius: 6, fontFamily: FONT, fontSize: 12 },
        markLabel: { fontFamily: FONT, fontSize: 11 },
      },
    },

    // ── Navigation: segmented sketch tabs ────────────────────────────────────
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 0,
          display: 'inline-flex',
          width: 'fit-content',
          borderRadius: 8,
          padding: 3,
          border: STROKE_BORDER,
          backgroundColor: WHITE,
          filter: ROUGH,
        },
        indicator: { display: 'none' },
        flexContainer: { gap: 3 },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: FONT,
          fontSize: 15,
          textTransform: 'none',
          minHeight: 0,
          padding: '5px 16px',
          borderRadius: 6,
          color: TEXT,
          '&.Mui-selected': { color: VIOLET_DK, backgroundColor: VIOLET_LT },
        },
      },
    },

    // ── Overlays ─────────────────────────────────────────────────────────────
    MuiDialog: {
      styleOverrides: { paper: { border: STROKE_BORDER, borderRadius: 10, boxShadow: '0 10px 30px rgba(0,0,0,0.2)', backgroundColor: WHITE, filter: ROUGH } },
    },
    MuiDialogTitle: { styleOverrides: { root: { fontFamily: FONT, fontSize: 19, padding: '12px 20px', borderBottom: `1.5px solid ${STROKE}` } } },
    MuiBackdrop: { styleOverrides: { root: { backgroundColor: 'rgba(30,30,30,0.28)' }, invisible: { backgroundColor: 'transparent' } } },
    MuiMenu: {
      styleOverrides: {
        paper: { borderRadius: 8, border: STROKE_BORDER, boxShadow: '0 8px 24px rgba(0,0,0,0.18)', filter: ROUGH },
        list: { padding: 4 },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: FONT,
          fontSize: 15,
          borderRadius: 6,
          '&:hover': { backgroundColor: FILL },
          '&.Mui-selected': { backgroundColor: VIOLET_LT, color: VIOLET_DK, '&:hover': { backgroundColor: VIOLET_LT } },
        },
      },
    },
    MuiTooltip: {
      defaultProps: { arrow: true },
      styleOverrides: {
        tooltip: { backgroundColor: STROKE, color: WHITE, borderRadius: 6, fontFamily: FONT, fontSize: 13, padding: '5px 9px' },
        arrow: { color: STROKE },
      },
    },

    // ── Feedback ─────────────────────────────────────────────────────────────
    MuiAlert: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: { fontFamily: FONT, fontSize: 14, borderRadius: 8, border: STROKE_BORDER, backgroundColor: WHITE, color: TEXT, boxShadow: SOFT_SHADOW, filter: ROUGH, alignItems: 'center' },
        outlinedInfo: { borderLeft: `5px solid ${BLUE}`, '& .MuiAlert-icon': { color: BLUE } },
        outlinedSuccess: { borderLeft: `5px solid ${GREEN}`, '& .MuiAlert-icon': { color: GREEN } },
        outlinedWarning: { borderLeft: `5px solid ${ORANGE}`, '& .MuiAlert-icon': { color: ORANGE } },
        outlinedError: { borderLeft: `5px solid ${RED}`, '& .MuiAlert-icon': { color: RED } },
        message: { color: TEXT },
      },
    },
    MuiAlertTitle: { styleOverrides: { root: { fontFamily: FONT, fontSize: 15 } } },
    MuiLinearProgress: {
      styleOverrides: {
        root: { height: 12, borderRadius: 8, border: STROKE_BORDER, backgroundColor: WHITE, filter: ROUGH },
        bar: { backgroundColor: VIOLET },
      },
    },
    MuiCircularProgress: { styleOverrides: { root: { color: VIOLET } } },

    // ── Data display ─────────────────────────────────────────────────────────
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 14, border: STROKE_BORDER, backgroundColor: WHITE, color: TEXT, fontFamily: FONT, fontSize: 13, height: 26, filter: ROUGH },
        outlined: { backgroundColor: 'transparent' },
        deleteIcon: { color: TEXT_LIGHT, '&:hover': { color: TEXT } },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: { borderRadius: 10, border: `1.5px solid ${VIOLET_DK}`, backgroundColor: VIOLET, color: WHITE, fontFamily: FONT, fontSize: 12, minWidth: 20, height: 20 },
      },
    },
    MuiDivider: { styleOverrides: { root: { borderColor: '#CED4DA' } } },
    MuiTableContainer: { styleOverrides: { root: { boxShadow: 'none' } } },
    MuiTable: { styleOverrides: { root: { backgroundColor: WHITE } } },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: '#DEE2E6', fontFamily: FONT, fontSize: 14, padding: '7px 12px' },
        head: { fontFamily: FONT, fontWeight: 400, backgroundColor: FILL, color: TEXT },
      },
    },
    MuiList: { styleOverrides: { root: { paddingTop: 4, paddingBottom: 4, backgroundColor: WHITE } } },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          margin: '0 4px',
          '&.Mui-selected': {
            backgroundColor: VIOLET_LT,
            color: VIOLET_DK,
            '& .MuiListItemIcon-root': { color: VIOLET_DK },
            '&:hover': { backgroundColor: VIOLET_LT },
          },
          '&:hover': { backgroundColor: FILL },
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: { fontFamily: FONT, fontSize: 15 },
        secondary: { fontFamily: FONT, fontSize: 13, color: TEXT_LIGHT },
      },
    },
    MuiListItemIcon: { styleOverrides: { root: { color: TEXT_LIGHT, minWidth: 32 } } },

    // ── Disclosure ───────────────────────────────────────────────────────────
    MuiAccordion: {
      defaultProps: { disableGutters: true, elevation: 0, square: true },
      styleOverrides: {
        root: { border: STROKE_BORDER, boxShadow: 'none', '&:not(:last-child)': { borderBottom: 0 }, '&::before': { display: 'none' } },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: { backgroundColor: FILL, fontFamily: FONT, minHeight: 0, '&.Mui-expanded': { minHeight: 0, borderBottom: STROKE_BORDER } },
        content: { margin: '10px 0', '&.Mui-expanded': { margin: '10px 0' } },
      },
    },
    MuiAccordionDetails: { styleOverrides: { root: { padding: 14, fontFamily: FONT } } },
  },
});

export const excalidraw = theme;
export default theme;
