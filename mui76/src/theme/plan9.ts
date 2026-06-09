import { createTheme } from '@mui/material/styles';

/**
 * plan9.ts — a Material UI theme inspired by Plan 9 from Bell Labs (rio / acme).
 *
 * The look:
 *   - Acme's washed-out palette: pale-yellow bodies, pale-cyan tag bars, and
 *     a soft yellow selection highlight, on a muted blue rio desktop.
 *   - Utterly flat — thin 1px borders, no bevels, no gradients, no shadows.
 *   - Lucida (the family acme's bitmap fonts were derived from).
 *   - Text-first and minimal, the way Plan 9's UI was.
 */

// ── Palette ──────────────────────────────────────────────────────────────────
const BODY = '#FFFFEA'; // acme text background (pale yellow)
const TAG = '#EAFFFF'; // tag bar background (pale cyan)
const TAG_DK = '#CBEEF0'; // deeper cyan for hovers/fills
const SEL = '#EEEE9E'; // acme selection highlight
const DESKTOP = '#6C8C99'; // muted blue rio desktop
const INK = '#000000';
const INK_SOFT = '#2A3A3A';
const BORDER = '#5B8AA0'; // soft blue window borders
const BORDER_SOFT = '#9FBEC9';
const BLUE = '#2F6E8F'; // accent
const WHITE = '#FFFFFF';
const DISABLED = '#8A9A9A';

// ── Type ─────────────────────────────────────────────────────────────────────
const FONT = "'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', 'Helvetica Neue', sans-serif";
const MONO = "'Fira Code', ui-monospace, monospace";

const theme = createTheme({
  shape: { borderRadius: 0 },

  palette: {
    mode: 'light',
    common: { black: INK, white: WHITE },
    primary: { main: BLUE, contrastText: WHITE },
    secondary: { main: TAG_DK, contrastText: INK },
    background: { default: DESKTOP, paper: BODY },
    text: { primary: INK, secondary: INK_SOFT, disabled: DISABLED },
    divider: BORDER,
    info: { main: BLUE, contrastText: WHITE },
    success: { main: '#3C7A3C', contrastText: WHITE },
    warning: { main: '#9A7A2E', contrastText: WHITE },
    error: { main: '#9A3A3A', contrastText: WHITE },
    grey: {
      50: '#FAFAF2',
      100: BODY,
      200: '#F0F0DE',
      300: BORDER_SOFT,
      400: '#9FBEC9',
      500: DISABLED,
      600: '#5F7A7A',
      700: INK_SOFT,
      800: '#1F2A2A',
      900: INK,
    },
  },

  typography: {
    fontFamily: FONT,
    fontSize: 14,
    h1: { fontFamily: FONT, fontSize: 28, fontWeight: 400 },
    h2: { fontFamily: FONT, fontSize: 22, fontWeight: 400 },
    h3: { fontFamily: FONT, fontSize: 18, fontWeight: 400 },
    h4: { fontFamily: FONT, fontSize: 16, fontWeight: 400 },
    h5: { fontFamily: FONT, fontSize: 14, fontWeight: 700 },
    h6: { fontFamily: FONT, fontSize: 13, fontWeight: 700 },
    subtitle1: { fontFamily: FONT, fontSize: 14 },
    subtitle2: { fontFamily: FONT, fontSize: 12 },
    body1: { fontSize: 14, lineHeight: 1.5 },
    body2: { fontSize: 13, lineHeight: 1.5 },
    caption: { fontSize: 12, color: INK_SOFT },
    button: { fontFamily: FONT, textTransform: 'none' },
    overline: { fontFamily: FONT, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, color: INK_SOFT },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' },
        body: { backgroundColor: DESKTOP },
        code: { fontFamily: MONO },
        '::selection': { backgroundColor: SEL, color: INK },
        // Acme-style flat scrollbars (pale, no bevel).
        '*::-webkit-scrollbar': { width: 14, height: 14 },
        '*::-webkit-scrollbar-track': { backgroundColor: BODY, borderLeft: `1px solid ${BORDER}` },
        '*::-webkit-scrollbar-thumb': { backgroundColor: TAG_DK, border: `1px solid ${BORDER}` },
        '*::-webkit-scrollbar-thumb:hover': { backgroundColor: '#A8E0E4' },
      },
    },

    // ── Surfaces ─────────────────────────────────────────────────────────────
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { backgroundColor: BODY, color: INK, border: `1px solid ${BORDER}`, borderRadius: 0, backgroundImage: 'none', boxShadow: 'none' },
      },
    },
    MuiCard: { defaultProps: { elevation: 0 }, styleOverrides: { root: { borderRadius: 0, boxShadow: '1px 1px 0 rgba(0,0,0,0.15)' } } },
    MuiCardHeader: {
      styleOverrides: {
        root: { backgroundColor: TAG, borderBottom: `1px solid ${BORDER}`, padding: '6px 12px' },
        title: { fontFamily: FONT, fontSize: 14, fontWeight: 700 },
        subheader: { fontFamily: FONT, fontSize: 12, color: INK_SOFT },
      },
    },

    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'transparent', position: 'static' },
      styleOverrides: {
        root: { backgroundColor: TAG, color: INK, borderRadius: 0, borderBottom: `1px solid ${BORDER}`, boxShadow: 'none', backgroundImage: 'none' },
      },
    },
    MuiToolbar: { styleOverrides: { root: { minHeight: 30, '@media (min-width:600px)': { minHeight: 30 } } } },

    // ── Buttons (flat acme "commands") ───────────────────────────────────────
    MuiButton: {
      defaultProps: { variant: 'outlined', disableElevation: true, disableRipple: true },
      styleOverrides: {
        root: {
          fontFamily: FONT,
          fontSize: 14,
          textTransform: 'none',
          borderRadius: 0,
          border: `1px solid ${BORDER}`,
          backgroundColor: TAG,
          color: INK,
          boxShadow: 'none',
          padding: '3px 14px',
          minWidth: 0,
          lineHeight: 1.4,
          transition: 'none',
          '&:hover': { backgroundColor: TAG_DK, borderColor: BORDER },
          '&:active': { backgroundColor: SEL },
          '&.Mui-disabled': { color: DISABLED, borderColor: BORDER_SOFT, backgroundColor: BODY },
        },
        contained: {
          backgroundColor: TAG_DK,
          color: INK,
          borderColor: BORDER,
          '&:hover': { backgroundColor: '#A8E0E4' },
          '&:active': { backgroundColor: SEL },
        },
        outlined: { backgroundColor: BODY, '&:hover': { backgroundColor: SEL } },
        text: {
          border: '1px solid transparent',
          backgroundColor: 'transparent',
          minWidth: 0,
          padding: '3px 8px',
          '&:hover': { backgroundColor: SEL, textDecoration: 'none' },
        },
      },
    },
    MuiButtonGroup: {
      defaultProps: { disableRipple: true, disableElevation: true, variant: 'outlined' },
      styleOverrides: { grouped: { '&:not(:last-of-type)': { borderRightColor: BORDER } } },
    },
    MuiIconButton: {
      defaultProps: { disableRipple: true },
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: `1px solid ${BORDER}`,
          backgroundColor: TAG,
          color: INK,
          padding: 5,
          '&:hover': { backgroundColor: TAG_DK },
          '&:active': { backgroundColor: SEL },
          '&.Mui-disabled': { color: DISABLED, borderColor: BORDER_SOFT },
        },
      },
    },

    // ── Form controls ────────────────────────────────────────────────────────
    MuiTextField: { defaultProps: { variant: 'outlined', size: 'small' } },
    MuiFormControl: { defaultProps: { size: 'small' } },
    MuiSelect: { defaultProps: { size: 'small' } },
    MuiInputBase: {
      styleOverrides: {
        root: { fontFamily: FONT, fontSize: 14, backgroundColor: WHITE },
        input: { padding: '5px 8px', '&::placeholder': { color: DISABLED, opacity: 1 } },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: WHITE,
          borderRadius: 0,
          '& .MuiOutlinedInput-notchedOutline': { borderColor: BORDER, borderRadius: 0 },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: BLUE },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: BLUE, borderWidth: 1 },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': { borderColor: '#9A3A3A' },
        },
      },
    },
    MuiInputLabel: { styleOverrides: { root: { fontFamily: FONT, fontSize: 14, color: INK_SOFT, '&.Mui-focused': { color: BLUE } } } },
    MuiFormLabel: { styleOverrides: { root: { fontFamily: FONT, color: INK, '&.Mui-focused': { color: BLUE } } } },
    MuiFormControlLabel: { styleOverrides: { label: { fontFamily: FONT, fontSize: 14 } } },
    MuiFormHelperText: { styleOverrides: { root: { fontFamily: FONT, fontSize: 12, marginLeft: 2 } } },
    MuiCheckbox: {
      defaultProps: { disableRipple: true },
      styleOverrides: { root: { color: BORDER, padding: 4, '&.Mui-checked': { color: BLUE }, '&.Mui-disabled': { color: BORDER_SOFT } } },
    },
    MuiRadio: {
      defaultProps: { disableRipple: true },
      styleOverrides: { root: { color: BORDER, padding: 4, '&.Mui-checked': { color: BLUE }, '&.Mui-disabled': { color: BORDER_SOFT } } },
    },
    MuiSwitch: {
      styleOverrides: {
        root: { width: 46, height: 24, padding: 6 },
        switchBase: {
          padding: 5,
          '&.Mui-checked': { transform: 'translateX(22px)', color: WHITE, '& + .MuiSwitch-track': { backgroundColor: BLUE, opacity: 1, borderColor: BORDER } },
        },
        thumb: { width: 12, height: 12, borderRadius: 0, backgroundColor: WHITE, border: `1px solid ${BORDER}`, boxShadow: 'none' },
        track: { borderRadius: 0, backgroundColor: TAG, border: `1px solid ${BORDER}`, opacity: 1 },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: { color: BLUE, height: 4, padding: '12px 0' },
        rail: { backgroundColor: WHITE, opacity: 1, borderRadius: 0, border: `1px solid ${BORDER}` },
        track: { backgroundColor: TAG_DK, border: `1px solid ${BORDER}`, borderRadius: 0 },
        thumb: { width: 12, height: 18, borderRadius: 0, backgroundColor: TAG, border: `1px solid ${BORDER}`, boxShadow: 'none', '&:hover, &.Mui-focusVisible': { boxShadow: 'none' }, '&:active': { backgroundColor: SEL } },
        valueLabel: { backgroundColor: BLUE, color: WHITE, borderRadius: 0, fontFamily: FONT, fontSize: 11 },
        markLabel: { fontFamily: FONT, fontSize: 10 },
      },
    },

    // ── Tabs (flat tag-colored) ──────────────────────────────────────────────
    MuiTabs: { styleOverrides: { root: { minHeight: 0, borderBottom: `1px solid ${BORDER}` }, indicator: { display: 'none' } } },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: FONT,
          fontSize: 14,
          textTransform: 'none',
          minHeight: 0,
          padding: '5px 14px',
          marginRight: 2,
          color: INK,
          backgroundColor: TAG,
          border: `1px solid ${BORDER}`,
          borderBottom: 'none',
          '&.Mui-selected': { color: INK, backgroundColor: BODY, marginBottom: -1, zIndex: 1 },
        },
      },
    },

    // ── Overlays ─────────────────────────────────────────────────────────────
    MuiDialog: { styleOverrides: { paper: { border: `1px solid ${BORDER}`, borderRadius: 0, boxShadow: '2px 2px 0 rgba(0,0,0,0.2)', backgroundColor: BODY } } },
    MuiDialogTitle: { styleOverrides: { root: { fontFamily: FONT, fontSize: 15, fontWeight: 700, padding: '6px 14px', backgroundColor: TAG, borderBottom: `1px solid ${BORDER}` } } },
    MuiBackdrop: { styleOverrides: { root: { backgroundColor: 'rgba(40,55,60,0.35)' }, invisible: { backgroundColor: 'transparent' } } },
    MuiMenu: {
      styleOverrides: {
        paper: { borderRadius: 0, border: `1px solid ${BORDER}`, boxShadow: '2px 2px 0 rgba(0,0,0,0.2)', backgroundColor: BODY },
        list: { padding: 0 },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: FONT,
          fontSize: 14,
          '&:hover': { backgroundColor: SEL },
          '&.Mui-selected': { backgroundColor: SEL, '&:hover': { backgroundColor: SEL } },
        },
      },
    },
    MuiTooltip: {
      defaultProps: { arrow: false },
      styleOverrides: {
        tooltip: { backgroundColor: SEL, color: INK, border: `1px solid ${BORDER}`, borderRadius: 0, fontFamily: FONT, fontSize: 12, boxShadow: 'none', padding: '3px 7px' },
      },
    },

    // ── Feedback ─────────────────────────────────────────────────────────────
    MuiAlert: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: { fontFamily: FONT, fontSize: 13, borderRadius: 0, border: `1px solid ${BORDER}`, backgroundColor: BODY, color: INK, boxShadow: 'none' },
        outlinedInfo: { borderLeft: `4px solid ${BLUE}` },
        outlinedSuccess: { borderLeft: '4px solid #3C7A3C' },
        outlinedWarning: { borderLeft: '4px solid #9A7A2E' },
        outlinedError: { borderLeft: '4px solid #9A3A3A' },
        message: { color: INK },
      },
    },
    MuiAlertTitle: { styleOverrides: { root: { fontFamily: FONT, fontSize: 13, fontWeight: 700 } } },
    MuiLinearProgress: {
      styleOverrides: {
        root: { height: 12, borderRadius: 0, border: `1px solid ${BORDER}`, backgroundColor: WHITE },
        bar: { backgroundColor: TAG_DK },
      },
    },
    MuiCircularProgress: { styleOverrides: { root: { color: BLUE } } },

    // ── Data display ─────────────────────────────────────────────────────────
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 0, border: `1px solid ${BORDER}`, backgroundColor: TAG, color: INK, fontFamily: FONT, fontSize: 12, height: 22 },
        outlined: { backgroundColor: BODY },
        deleteIcon: { color: INK_SOFT, '&:hover': { color: INK } },
      },
    },
    MuiBadge: {
      styleOverrides: { badge: { borderRadius: 0, border: `1px solid ${BORDER}`, backgroundColor: TAG_DK, color: INK, fontFamily: FONT, fontSize: 11, minWidth: 18, height: 18 } },
    },
    MuiDivider: { styleOverrides: { root: { borderColor: BORDER_SOFT } } },
    MuiTableContainer: { styleOverrides: { root: { boxShadow: 'none' } } },
    MuiTable: { styleOverrides: { root: { backgroundColor: BODY } } },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: BORDER_SOFT, fontFamily: FONT, fontSize: 13, padding: '5px 10px' },
        head: { fontFamily: FONT, fontWeight: 700, backgroundColor: TAG, color: INK, borderColor: BORDER },
      },
    },
    MuiList: { styleOverrides: { root: { paddingTop: 0, paddingBottom: 0, backgroundColor: BODY } } },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': { backgroundColor: SEL, '& .MuiListItemIcon-root': { color: INK }, '&:hover': { backgroundColor: SEL } },
          '&:hover': { backgroundColor: TAG },
        },
      },
    },
    MuiListItemText: {
      styleOverrides: { primary: { fontFamily: FONT, fontSize: 14 }, secondary: { fontFamily: FONT, fontSize: 12, color: INK_SOFT } },
    },
    MuiListItemIcon: { styleOverrides: { root: { color: INK_SOFT, minWidth: 30 } } },

    // ── Disclosure ───────────────────────────────────────────────────────────
    MuiAccordion: {
      defaultProps: { disableGutters: true, elevation: 0, square: true },
      styleOverrides: { root: { border: `1px solid ${BORDER}`, boxShadow: 'none', '&:not(:last-child)': { borderBottom: 0 }, '&::before': { display: 'none' } } },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: { backgroundColor: TAG, fontFamily: FONT, fontWeight: 700, minHeight: 0, '&.Mui-expanded': { minHeight: 0, borderBottom: `1px solid ${BORDER}` } },
        content: { margin: '8px 0', '&.Mui-expanded': { margin: '8px 0' } },
      },
    },
    MuiAccordionDetails: { styleOverrides: { root: { padding: 12, fontFamily: FONT, backgroundColor: BODY } } },
  },
});

export const plan9 = theme;
export default theme;
