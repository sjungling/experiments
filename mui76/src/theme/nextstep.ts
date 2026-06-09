import { createTheme } from '@mui/material/styles';

/**
 * nextstep.ts — a Material UI theme inspired by NeXTSTEP (1989–1995).
 *
 * The look:
 *   - Austere mid-gray panels on a dark workspace — no color, all light.
 *   - Thick 2px chiseled bevels: bright top-left, dark bottom-right, with a
 *     1px black keyline. Pressed controls invert the chisel.
 *   - Helvetica everywhere (bold for titles), the NeXT system typeface.
 *   - Recessed white text wells; dark recessed selection highlights.
 */

// ── Palette ──────────────────────────────────────────────────────────────────
const GRAY = '#A8A8A8'; // panel / control gray
const GRAY_LT = '#BEBEBE';
const GRAY_DK = '#909090';
const DESKTOP = '#555555'; // dark workspace
const WHITE = '#FFFFFF';
const BLACK = '#000000';
const BEVEL_LT = '#FFFFFF';
const BEVEL_DK = '#565656';
const TEXT = '#000000';
const TEXT_LIGHT = '#333333';
const TEXT_DISABLED = '#707070';
const SELECTION = '#3A3A3A'; // dark recessed highlight

// ── Type ─────────────────────────────────────────────────────────────────────
const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const MONO = "'Ohlfs', 'Monaco', ui-monospace, monospace";

// ── Chisel bevels (2px — the NeXT signature) ─────────────────────────────────
const RAISED = `inset 2px 2px 0 ${BEVEL_LT}, inset -2px -2px 0 ${BEVEL_DK}`;
const PRESSED = `inset 2px 2px 0 ${BEVEL_DK}, inset -2px -2px 0 ${BEVEL_LT}`;
const WELL = `inset 2px 2px 0 ${BEVEL_DK}, inset -1px -1px 0 ${BEVEL_LT}`;
const WINDOW_SHADOW = '3px 3px 7px rgba(0,0,0,0.45)';

const theme = createTheme({
  shape: { borderRadius: 0 },

  palette: {
    mode: 'light',
    common: { black: BLACK, white: WHITE },
    primary: { main: BLACK, contrastText: WHITE },
    secondary: { main: GRAY_DK, contrastText: BLACK },
    background: { default: DESKTOP, paper: GRAY },
    text: { primary: TEXT, secondary: TEXT_LIGHT, disabled: TEXT_DISABLED },
    divider: BLACK,
    info: { main: BLACK, contrastText: WHITE },
    success: { main: BLACK, contrastText: WHITE },
    warning: { main: BLACK, contrastText: WHITE },
    error: { main: BLACK, contrastText: WHITE },
    grey: {
      50: '#EDEDED',
      100: '#DCDCDC',
      200: GRAY_LT,
      300: GRAY,
      400: GRAY_DK,
      500: '#7E7E7E',
      600: BEVEL_DK,
      700: '#454545',
      800: '#2C2C2C',
      900: BLACK,
    },
  },

  typography: {
    fontFamily: FONT,
    fontSize: 13,
    h1: { fontFamily: FONT, fontSize: 30, fontWeight: 700 },
    h2: { fontFamily: FONT, fontSize: 24, fontWeight: 700 },
    h3: { fontFamily: FONT, fontSize: 19, fontWeight: 700 },
    h4: { fontFamily: FONT, fontSize: 16, fontWeight: 700 },
    h5: { fontFamily: FONT, fontSize: 14, fontWeight: 700 },
    h6: { fontFamily: FONT, fontSize: 13, fontWeight: 700 },
    subtitle1: { fontFamily: FONT, fontSize: 14, fontWeight: 700 },
    subtitle2: { fontFamily: FONT, fontSize: 12, fontWeight: 700 },
    body1: { fontSize: 13, lineHeight: 1.5 },
    body2: { fontSize: 12, lineHeight: 1.5 },
    caption: { fontSize: 11, color: TEXT_LIGHT },
    button: { fontFamily: FONT, fontWeight: 700, textTransform: 'none' },
    overline: { fontFamily: FONT, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: TEXT_LIGHT },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' },
        body: {
          backgroundColor: DESKTOP,
          // Faint NeXT workspace tiling.
          backgroundImage: 'repeating-conic-gradient(#525252 0% 25%, #585858 0% 50%)',
          backgroundSize: '3px 3px',
        },
        code: { fontFamily: MONO },
        '::selection': { backgroundColor: SELECTION, color: WHITE },
        '*::-webkit-scrollbar': { width: 18, height: 18 },
        '*::-webkit-scrollbar-track': { backgroundColor: GRAY, border: `1px solid ${BLACK}` },
        '*::-webkit-scrollbar-thumb': { backgroundColor: GRAY, border: `1px solid ${BLACK}`, boxShadow: RAISED },
        '*::-webkit-scrollbar-thumb:active': { boxShadow: PRESSED },
        '*::-webkit-scrollbar-button': { display: 'block', height: 18, width: 18, backgroundColor: GRAY, border: `1px solid ${BLACK}`, boxShadow: RAISED },
      },
    },

    // ── Surfaces ─────────────────────────────────────────────────────────────
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundColor: GRAY,
          color: TEXT,
          border: `1px solid ${BLACK}`,
          borderRadius: 0,
          backgroundImage: 'none',
          boxShadow: RAISED,
        },
      },
    },
    MuiCard: { defaultProps: { elevation: 0 }, styleOverrides: { root: { borderRadius: 0, boxShadow: `${RAISED}, ${WINDOW_SHADOW}` } } },
    MuiCardHeader: {
      styleOverrides: {
        root: { borderBottom: `1px solid ${BLACK}`, padding: '8px 14px' },
        title: { fontFamily: FONT, fontSize: 14, fontWeight: 700 },
        subheader: { fontFamily: FONT, fontSize: 12, color: TEXT_LIGHT },
      },
    },

    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'transparent', position: 'static' },
      styleOverrides: {
        root: {
          backgroundColor: GRAY,
          color: TEXT,
          borderRadius: 0,
          borderBottom: `1px solid ${BLACK}`,
          boxShadow: `inset 0 2px 0 ${BEVEL_LT}, inset 0 -2px 0 ${BEVEL_DK}`,
          backgroundImage: 'none',
        },
      },
    },
    MuiToolbar: { styleOverrides: { root: { minHeight: 34, '@media (min-width:600px)': { minHeight: 34 } } } },

    // ── Buttons ──────────────────────────────────────────────────────────────
    MuiButton: {
      defaultProps: { variant: 'outlined', disableElevation: true, disableRipple: true },
      styleOverrides: {
        root: {
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 13,
          textTransform: 'none',
          borderRadius: 0,
          border: `1px solid ${BLACK}`,
          backgroundColor: GRAY,
          color: TEXT,
          boxShadow: RAISED,
          padding: '5px 16px',
          minWidth: 72,
          lineHeight: 1.3,
          transition: 'none',
          '&:hover': { backgroundColor: GRAY_LT, boxShadow: RAISED },
          '&:active': { boxShadow: PRESSED, backgroundColor: GRAY },
          '&.Mui-disabled': { color: TEXT_DISABLED, borderColor: BEVEL_DK, boxShadow: 'none', backgroundColor: GRAY },
        },
        // The default/return button: an extra black keyline.
        contained: {
          backgroundColor: GRAY,
          color: TEXT,
          boxShadow: `${RAISED}, 0 0 0 2px ${BLACK}`,
          '&:hover': { backgroundColor: GRAY_LT, boxShadow: `${RAISED}, 0 0 0 2px ${BLACK}` },
          '&:active': { boxShadow: `${PRESSED}, 0 0 0 2px ${BLACK}` },
        },
        outlined: { borderColor: BLACK, '&:hover': { borderColor: BLACK } },
        text: {
          border: '1px solid transparent',
          backgroundColor: 'transparent',
          boxShadow: 'none',
          minWidth: 0,
          padding: '5px 10px',
          '&:hover': { backgroundColor: 'transparent', boxShadow: 'none', textDecoration: 'underline' },
          '&:active': { boxShadow: 'none' },
        },
        sizeSmall: { padding: '3px 10px', fontSize: 12 },
        sizeLarge: { padding: '8px 22px', fontSize: 14 },
      },
    },
    MuiButtonGroup: {
      defaultProps: { disableRipple: true, disableElevation: true, variant: 'outlined' },
      styleOverrides: { grouped: { '&:not(:last-of-type)': { borderRightColor: BLACK } } },
    },
    MuiIconButton: {
      defaultProps: { disableRipple: true },
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: `1px solid ${BLACK}`,
          backgroundColor: GRAY,
          color: TEXT,
          boxShadow: RAISED,
          padding: 6,
          '&:hover': { backgroundColor: GRAY_LT },
          '&:active': { boxShadow: PRESSED },
          '&.Mui-disabled': { color: TEXT_DISABLED, borderColor: BEVEL_DK, boxShadow: 'none' },
        },
      },
    },

    // ── Form controls ────────────────────────────────────────────────────────
    MuiTextField: { defaultProps: { variant: 'outlined', size: 'small' } },
    MuiFormControl: { defaultProps: { size: 'small' } },
    MuiSelect: { defaultProps: { size: 'small' } },
    MuiInputBase: {
      styleOverrides: {
        root: { fontFamily: FONT, fontSize: 13, backgroundColor: WHITE },
        input: { padding: '5px 8px', '&::placeholder': { color: TEXT_DISABLED, opacity: 1 } },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: WHITE,
          borderRadius: 0,
          boxShadow: WELL,
          '& .MuiOutlinedInput-notchedOutline': { borderColor: BLACK, borderRadius: 0 },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: BLACK },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: BLACK, borderWidth: 1 },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': { borderColor: BLACK },
        },
      },
    },
    MuiInputLabel: { styleOverrides: { root: { fontFamily: FONT, fontSize: 13, fontWeight: 700, color: TEXT, '&.Mui-focused': { color: TEXT } } } },
    MuiFormLabel: { styleOverrides: { root: { fontFamily: FONT, fontWeight: 700, color: TEXT, '&.Mui-focused': { color: TEXT } } } },
    MuiFormControlLabel: { styleOverrides: { label: { fontFamily: FONT, fontSize: 13 } } },
    MuiFormHelperText: { styleOverrides: { root: { fontFamily: FONT, fontSize: 11, marginLeft: 2 } } },
    MuiCheckbox: {
      defaultProps: { disableRipple: true },
      styleOverrides: { root: { color: BLACK, padding: 4, '&.Mui-checked': { color: BLACK }, '&.Mui-disabled': { color: TEXT_DISABLED } } },
    },
    MuiRadio: {
      defaultProps: { disableRipple: true },
      styleOverrides: { root: { color: BLACK, padding: 4, '&.Mui-checked': { color: BLACK }, '&.Mui-disabled': { color: TEXT_DISABLED } } },
    },
    MuiSwitch: {
      styleOverrides: {
        root: { width: 48, height: 26, padding: 7 },
        switchBase: {
          padding: 5,
          '&.Mui-checked': {
            transform: 'translateX(22px)',
            color: GRAY,
            '& + .MuiSwitch-track': { backgroundColor: SELECTION, opacity: 1, borderColor: BLACK },
          },
        },
        thumb: { width: 14, height: 14, borderRadius: 0, backgroundColor: GRAY, border: `1px solid ${BLACK}`, boxShadow: RAISED },
        track: { borderRadius: 0, backgroundColor: WHITE, border: `1px solid ${BLACK}`, opacity: 1, boxShadow: WELL },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: { color: BLACK, height: 8, padding: '13px 0' },
        rail: { backgroundColor: WHITE, opacity: 1, borderRadius: 0, border: `1px solid ${BLACK}`, boxShadow: WELL, height: 8 },
        track: { backgroundColor: GRAY_DK, border: `1px solid ${BLACK}`, borderRadius: 0, height: 8 },
        thumb: {
          width: 16,
          height: 22,
          borderRadius: 0,
          backgroundColor: GRAY,
          border: `1px solid ${BLACK}`,
          boxShadow: RAISED,
          '&:hover, &.Mui-focusVisible': { boxShadow: RAISED },
          '&:active': { boxShadow: PRESSED },
        },
        valueLabel: { backgroundColor: BLACK, color: WHITE, borderRadius: 0, fontFamily: FONT, fontSize: 11 },
        markLabel: { fontFamily: FONT, fontSize: 10 },
      },
    },

    // ── Navigation: beveled tabs ─────────────────────────────────────────────
    MuiTabs: {
      styleOverrides: { root: { minHeight: 0, borderBottom: `1px solid ${BLACK}` }, indicator: { display: 'none' } },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 13,
          textTransform: 'none',
          minHeight: 0,
          padding: '6px 16px',
          marginRight: 3,
          color: TEXT,
          backgroundColor: GRAY,
          border: `1px solid ${BLACK}`,
          borderBottom: 'none',
          boxShadow: `inset 2px 2px 0 ${BEVEL_LT}`,
          '&.Mui-selected': { color: TEXT, backgroundColor: GRAY_LT, marginBottom: -1, zIndex: 1 },
        },
      },
    },

    // ── Overlays ─────────────────────────────────────────────────────────────
    MuiDialog: {
      styleOverrides: { paper: { border: `1px solid ${BLACK}`, borderRadius: 0, boxShadow: `${RAISED}, ${WINDOW_SHADOW}`, backgroundColor: GRAY } },
    },
    MuiDialogTitle: { styleOverrides: { root: { fontFamily: FONT, fontSize: 15, fontWeight: 700, padding: '8px 16px', borderBottom: `1px solid ${BLACK}` } } },
    MuiBackdrop: { styleOverrides: { root: { backgroundColor: 'rgba(0,0,0,0.4)' }, invisible: { backgroundColor: 'transparent' } } },
    MuiMenu: {
      styleOverrides: {
        paper: { borderRadius: 0, border: `1px solid ${BLACK}`, boxShadow: `${RAISED}, ${WINDOW_SHADOW}`, backgroundColor: GRAY },
        list: { padding: 0 },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: FONT,
          fontSize: 13,
          // NeXT menu highlight: recessed dark cell.
          '&:hover': { backgroundColor: SELECTION, color: WHITE },
          '&.Mui-selected': { backgroundColor: SELECTION, color: WHITE, '&:hover': { backgroundColor: SELECTION } },
        },
      },
    },
    MuiTooltip: {
      defaultProps: { arrow: true },
      styleOverrides: {
        tooltip: { backgroundColor: GRAY, color: TEXT, border: `1px solid ${BLACK}`, borderRadius: 0, fontFamily: FONT, fontSize: 12, boxShadow: WINDOW_SHADOW, padding: '4px 8px' },
        arrow: { color: GRAY, '&::before': { border: `1px solid ${BLACK}` } },
      },
    },

    // ── Feedback ─────────────────────────────────────────────────────────────
    MuiAlert: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: { fontFamily: FONT, fontSize: 12, borderRadius: 0, border: `1px solid ${BLACK}`, backgroundColor: GRAY, color: TEXT, boxShadow: RAISED },
        icon: { color: BLACK },
        message: { color: TEXT },
      },
    },
    MuiAlertTitle: { styleOverrides: { root: { fontFamily: FONT, fontSize: 13, fontWeight: 700 } } },
    MuiLinearProgress: {
      styleOverrides: {
        root: { height: 16, borderRadius: 0, border: `1px solid ${BLACK}`, backgroundColor: WHITE, boxShadow: WELL },
        bar: { backgroundColor: GRAY_DK, backgroundImage: `linear-gradient(${GRAY_DK}, ${BEVEL_DK})` },
      },
    },
    MuiCircularProgress: { styleOverrides: { root: { color: BLACK } } },

    // ── Data display ─────────────────────────────────────────────────────────
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 0, border: `1px solid ${BLACK}`, backgroundColor: GRAY, color: TEXT, fontFamily: FONT, fontSize: 12, height: 24, boxShadow: `inset 1px 1px 0 ${BEVEL_LT}` },
        outlined: { backgroundColor: GRAY_LT, boxShadow: 'none' },
        deleteIcon: { color: TEXT_LIGHT, '&:hover': { color: BLACK } },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: { borderRadius: 0, border: `1px solid ${BLACK}`, backgroundColor: SELECTION, color: WHITE, fontFamily: FONT, fontSize: 11, minWidth: 18, height: 18 },
      },
    },
    MuiDivider: { styleOverrides: { root: { borderColor: BLACK } } },
    MuiTableContainer: { styleOverrides: { root: { boxShadow: 'none' } } },
    MuiTable: { styleOverrides: { root: { backgroundColor: WHITE } } },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: '#B0B0B0', fontFamily: FONT, fontSize: 12, padding: '5px 10px' },
        head: { fontFamily: FONT, fontWeight: 700, backgroundColor: GRAY, color: TEXT, borderColor: BLACK },
      },
    },
    MuiList: { styleOverrides: { root: { paddingTop: 0, paddingBottom: 0, backgroundColor: WHITE } } },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: SELECTION,
            color: WHITE,
            '& .MuiListItemIcon-root': { color: WHITE },
            '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.8)' },
            '&:hover': { backgroundColor: SELECTION },
          },
          '&:hover': { backgroundColor: '#E0E0E0' },
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: { fontFamily: FONT, fontSize: 13 },
        secondary: { fontFamily: FONT, fontSize: 11, color: TEXT_LIGHT },
      },
    },
    MuiListItemIcon: { styleOverrides: { root: { color: TEXT_LIGHT, minWidth: 32 } } },

    // ── Disclosure ───────────────────────────────────────────────────────────
    MuiAccordion: {
      defaultProps: { disableGutters: true, elevation: 0, square: true },
      styleOverrides: {
        root: { border: `1px solid ${BLACK}`, boxShadow: 'none', '&:not(:last-child)': { borderBottom: 0 }, '&::before': { display: 'none' } },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: { backgroundColor: GRAY, fontFamily: FONT, fontWeight: 700, minHeight: 0, boxShadow: `inset 0 2px 0 ${BEVEL_LT}`, '&.Mui-expanded': { minHeight: 0, borderBottom: `1px solid ${BLACK}` } },
        content: { margin: '8px 0', '&.Mui-expanded': { margin: '8px 0' } },
      },
    },
    MuiAccordionDetails: { styleOverrides: { root: { padding: 12, fontFamily: FONT, backgroundColor: GRAY_LT } } },
  },
});

export const nextstep = theme;
export default theme;
