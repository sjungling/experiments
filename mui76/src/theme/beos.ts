import { createTheme } from '@mui/material/styles';

/**
 * beos.ts — a Material UI theme inspired by BeOS / Haiku.
 *
 * The signature cues:
 *   - The iconic yellow window tab (drawn by the Window component).
 *   - Light gray beveled panels on a steel-blue desktop.
 *   - Clean Noto Sans type (Haiku's default UI font).
 *   - Subtle two-tone bevels on controls; pressed controls invert them.
 *   - A bright blue selection/accent highlight, and pale-yellow tooltips.
 */

// ── Palette ──────────────────────────────────────────────────────────────────
const DESKTOP = '#8A9BB0'; // steel-blue desktop
const PANEL = '#D8D8D8'; // window/dialog gray
const PANEL_LT = '#E6E6E6';
const CONTROL = '#D8D8D8';
const CONTROL_LT = '#E8E8E8';
const WHITE = '#FFFFFF';
const BEVEL_LT = '#FFFFFF';
const BEVEL_DK = '#828282';
const BORDER = '#4C4C4C'; // window outline
const BORDER_SOFT = '#A0A0A0';
const TEXT = '#101010';
const TEXT_LIGHT = '#505050';
const TEXT_DISABLED = '#9A9A9A';
const YELLOW = '#FFCB00'; // window-tab yellow
const YELLOW_DK = '#B58F00';
const BLUE = '#3399FF'; // selection / accent
const BLUE_DK = '#1F6FD6';
const SUCCESS = '#3E9B3E';
const WARNING = '#D08518';
const ERROR = '#C0392B';

// ── Type ─────────────────────────────────────────────────────────────────────
const FONT = "'Noto Sans', 'DejaVu Sans', 'Segoe UI', system-ui, sans-serif";
const MONO = "'Fira Code', ui-monospace, monospace";

// ── Bevels ───────────────────────────────────────────────────────────────────
const RAISED = `inset 1px 1px 0 ${BEVEL_LT}, inset -1px -1px 0 ${BEVEL_DK}`;
const PRESSED = `inset 1px 1px 0 ${BEVEL_DK}, inset -1px -1px 0 ${BEVEL_LT}`;
const WELL = `inset 1px 1px 0 ${BEVEL_DK}, inset -1px -1px 0 ${BEVEL_LT}`;
const PANEL_SHADOW = '2px 2px 5px rgba(0,0,0,0.30)';

const theme = createTheme({
  shape: { borderRadius: 3 },

  palette: {
    mode: 'light',
    common: { black: TEXT, white: WHITE },
    primary: { main: BLUE, dark: BLUE_DK, contrastText: WHITE },
    secondary: { main: YELLOW, dark: YELLOW_DK, contrastText: TEXT },
    background: { default: DESKTOP, paper: PANEL },
    text: { primary: TEXT, secondary: TEXT_LIGHT, disabled: TEXT_DISABLED },
    divider: BORDER_SOFT,
    info: { main: BLUE, contrastText: WHITE },
    success: { main: SUCCESS, contrastText: WHITE },
    warning: { main: WARNING, contrastText: WHITE },
    error: { main: ERROR, contrastText: WHITE },
    grey: {
      50: '#F5F5F5',
      100: PANEL_LT,
      200: PANEL,
      300: '#C4C4C4',
      400: BORDER_SOFT,
      500: '#888888',
      600: BEVEL_DK,
      700: TEXT_LIGHT,
      800: '#303030',
      900: TEXT,
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
    subtitle1: { fontFamily: FONT, fontSize: 14, fontWeight: 500 },
    subtitle2: { fontFamily: FONT, fontSize: 12, fontWeight: 500 },
    body1: { fontSize: 13, lineHeight: 1.55 },
    body2: { fontSize: 12, lineHeight: 1.55 },
    caption: { fontSize: 11, color: TEXT_LIGHT },
    button: { fontFamily: FONT, fontWeight: 500, textTransform: 'none' },
    overline: { fontFamily: FONT, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: TEXT_LIGHT },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' },
        body: { backgroundColor: DESKTOP },
        code: { fontFamily: MONO },
        '::selection': { backgroundColor: BLUE, color: WHITE },
        '*::-webkit-scrollbar': { width: 16, height: 16 },
        '*::-webkit-scrollbar-track': { backgroundColor: PANEL, border: `1px solid ${BORDER_SOFT}` },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: CONTROL,
          border: `1px solid ${BORDER}`,
          borderRadius: 3,
          boxShadow: RAISED,
        },
        '*::-webkit-scrollbar-thumb:active': { boxShadow: PRESSED },
        '*::-webkit-scrollbar-button': {
          display: 'block',
          height: 16,
          width: 16,
          backgroundColor: CONTROL,
          border: `1px solid ${BORDER}`,
          boxShadow: RAISED,
        },
      },
    },

    // ── Surfaces ─────────────────────────────────────────────────────────────
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundColor: PANEL,
          color: TEXT,
          border: `1px solid ${BORDER}`,
          borderRadius: 0,
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: { root: { borderRadius: 0, boxShadow: PANEL_SHADOW } },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: { borderBottom: `1px solid ${BORDER_SOFT}`, padding: '8px 14px' },
        title: { fontFamily: FONT, fontSize: 14, fontWeight: 700 },
        subheader: { fontFamily: FONT, fontSize: 12, color: TEXT_LIGHT },
      },
    },

    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'transparent', position: 'static' },
      styleOverrides: {
        root: {
          backgroundColor: PANEL,
          color: TEXT,
          borderRadius: 0,
          borderBottom: `1px solid ${BORDER}`,
          boxShadow: `inset 0 1px 0 ${BEVEL_LT}`,
          backgroundImage: 'none',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: { root: { minHeight: 34, '@media (min-width:600px)': { minHeight: 34 } } },
    },

    // ── Buttons ──────────────────────────────────────────────────────────────
    MuiButton: {
      defaultProps: { variant: 'outlined', disableElevation: true, disableRipple: true },
      styleOverrides: {
        root: {
          fontFamily: FONT,
          fontWeight: 500,
          fontSize: 13,
          textTransform: 'none',
          borderRadius: 3,
          border: `1px solid ${BORDER}`,
          backgroundColor: CONTROL,
          color: TEXT,
          boxShadow: RAISED,
          padding: '4px 16px',
          minWidth: 70,
          lineHeight: 1.4,
          transition: 'none',
          '&:hover': { backgroundColor: CONTROL_LT, boxShadow: RAISED },
          '&:active': { boxShadow: PRESSED, backgroundColor: PANEL },
          '&.Mui-disabled': { color: TEXT_DISABLED, borderColor: BORDER_SOFT, boxShadow: 'none', backgroundColor: PANEL },
        },
        // The default/affirmative button: a blue Haiku-style fill.
        contained: {
          backgroundColor: BLUE,
          color: WHITE,
          borderColor: BLUE_DK,
          boxShadow: `${RAISED}, inset 0 0 0 1px rgba(255,255,255,0.25)`,
          '&:hover': { backgroundColor: '#47A4FF' },
          '&:active': { boxShadow: PRESSED, backgroundColor: BLUE_DK },
        },
        outlined: { borderColor: BORDER, '&:hover': { borderColor: BORDER } },
        text: {
          border: '1px solid transparent',
          backgroundColor: 'transparent',
          boxShadow: 'none',
          minWidth: 0,
          padding: '4px 10px',
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.06)', boxShadow: 'none' },
          '&:active': { boxShadow: 'none' },
        },
        sizeSmall: { padding: '2px 10px', fontSize: 12 },
        sizeLarge: { padding: '7px 22px', fontSize: 14 },
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
          borderRadius: 3,
          border: `1px solid ${BORDER}`,
          backgroundColor: CONTROL,
          color: TEXT,
          boxShadow: RAISED,
          padding: 5,
          '&:hover': { backgroundColor: CONTROL_LT },
          '&:active': { boxShadow: PRESSED, backgroundColor: PANEL },
          '&.Mui-disabled': { color: TEXT_DISABLED, borderColor: BORDER_SOFT, boxShadow: 'none' },
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
          borderRadius: 2,
          boxShadow: WELL,
          '& .MuiOutlinedInput-notchedOutline': { borderColor: BORDER_SOFT, borderRadius: 2 },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: BEVEL_DK },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: BLUE, borderWidth: 2 },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': { borderColor: ERROR },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: { root: { fontFamily: FONT, fontSize: 13, color: TEXT, '&.Mui-focused': { color: BLUE_DK } } },
    },
    MuiFormLabel: {
      styleOverrides: { root: { fontFamily: FONT, color: TEXT, '&.Mui-focused': { color: BLUE_DK } } },
    },
    MuiFormControlLabel: { styleOverrides: { label: { fontFamily: FONT, fontSize: 13 } } },
    MuiFormHelperText: {
      styleOverrides: { root: { fontFamily: FONT, fontSize: 11, marginLeft: 2, '&.Mui-error': { color: ERROR } } },
    },
    MuiCheckbox: {
      defaultProps: { disableRipple: true },
      styleOverrides: {
        root: { color: BORDER, padding: 4, '&.Mui-checked': { color: BLUE_DK }, '&.Mui-disabled': { color: BORDER_SOFT } },
      },
    },
    MuiRadio: {
      defaultProps: { disableRipple: true },
      styleOverrides: {
        root: { color: BORDER, padding: 4, '&.Mui-checked': { color: BLUE_DK }, '&.Mui-disabled': { color: BORDER_SOFT } },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: { width: 46, height: 26, padding: 7 },
        switchBase: {
          padding: 5,
          '&.Mui-checked': {
            transform: 'translateX(20px)',
            color: WHITE,
            '& + .MuiSwitch-track': { backgroundColor: BLUE, opacity: 1, borderColor: BLUE_DK },
          },
        },
        thumb: { width: 14, height: 14, borderRadius: 2, backgroundColor: CONTROL_LT, border: `1px solid ${BORDER}`, boxShadow: RAISED },
        track: { borderRadius: 3, backgroundColor: WHITE, border: `1px solid ${BORDER_SOFT}`, opacity: 1, boxShadow: WELL },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: { color: BLUE, height: 6, padding: '13px 0' },
        rail: { backgroundColor: WHITE, opacity: 1, borderRadius: 2, border: `1px solid ${BORDER_SOFT}`, boxShadow: WELL },
        track: { backgroundColor: BLUE, border: `1px solid ${BLUE_DK}`, borderRadius: 2 },
        thumb: {
          width: 16,
          height: 20,
          borderRadius: 3,
          backgroundColor: CONTROL,
          border: `1px solid ${BORDER}`,
          boxShadow: RAISED,
          '&:hover, &.Mui-focusVisible': { boxShadow: RAISED },
          '&:active': { boxShadow: PRESSED },
        },
        valueLabel: { backgroundColor: BLUE_DK, color: WHITE, borderRadius: 2, fontFamily: FONT, fontSize: 11 },
        mark: { backgroundColor: BORDER_SOFT },
        markLabel: { fontFamily: FONT, fontSize: 10 },
      },
    },

    // ── Navigation: tabs as yellow folder tabs (echoing the window tab) ───────
    MuiTabs: {
      styleOverrides: {
        root: { minHeight: 0, borderBottom: `1px solid ${BORDER}` },
        indicator: { display: 'none' },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: FONT,
          fontWeight: 500,
          fontSize: 13,
          textTransform: 'none',
          minHeight: 0,
          padding: '5px 16px',
          marginRight: 3,
          color: TEXT,
          backgroundColor: PANEL_LT,
          border: `1px solid ${BORDER}`,
          borderBottom: 'none',
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
          boxShadow: `inset 1px 1px 0 ${BEVEL_LT}`,
          '&.Mui-selected': { color: TEXT, backgroundColor: YELLOW, marginBottom: -1, zIndex: 1 },
        },
      },
    },

    // ── Overlays ─────────────────────────────────────────────────────────────
    MuiDialog: {
      styleOverrides: {
        paper: { border: `1px solid ${BORDER}`, borderRadius: 0, boxShadow: PANEL_SHADOW, backgroundColor: PANEL },
      },
    },
    MuiDialogTitle: {
      styleOverrides: { root: { fontFamily: FONT, fontSize: 15, fontWeight: 700, padding: '8px 16px', borderBottom: `1px solid ${BORDER_SOFT}` } },
    },
    MuiBackdrop: {
      styleOverrides: { root: { backgroundColor: 'rgba(20,28,40,0.4)' }, invisible: { backgroundColor: 'transparent' } },
    },
    MuiMenu: {
      styleOverrides: {
        paper: { borderRadius: 0, border: `1px solid ${BORDER}`, boxShadow: PANEL_SHADOW, backgroundColor: WHITE },
        list: { padding: 2 },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: FONT,
          fontSize: 13,
          borderRadius: 2,
          // BeOS menu highlight: bright blue.
          '&:hover': { backgroundColor: BLUE, color: WHITE },
          '&.Mui-selected': { backgroundColor: BLUE, color: WHITE, '&:hover': { backgroundColor: BLUE } },
        },
      },
    },
    MuiTooltip: {
      defaultProps: { arrow: true },
      styleOverrides: {
        // Pale-yellow sticky-note tooltip.
        tooltip: { backgroundColor: '#FFFFC0', color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 2, fontFamily: FONT, fontSize: 12, boxShadow: PANEL_SHADOW, padding: '4px 8px' },
        arrow: { color: '#FFFFC0', '&::before': { border: `1px solid ${BORDER}` } },
      },
    },

    // ── Feedback ─────────────────────────────────────────────────────────────
    MuiAlert: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: { fontFamily: FONT, fontSize: 12, borderRadius: 2, border: `1px solid ${BORDER_SOFT}`, backgroundColor: PANEL_LT, color: TEXT, boxShadow: RAISED },
        outlinedInfo: { borderLeft: `4px solid ${BLUE}`, '& .MuiAlert-icon': { color: BLUE_DK } },
        outlinedSuccess: { borderLeft: `4px solid ${SUCCESS}`, '& .MuiAlert-icon': { color: SUCCESS } },
        outlinedWarning: { borderLeft: `4px solid ${WARNING}`, '& .MuiAlert-icon': { color: WARNING } },
        outlinedError: { borderLeft: `4px solid ${ERROR}`, '& .MuiAlert-icon': { color: ERROR } },
        message: { color: TEXT },
      },
    },
    MuiAlertTitle: { styleOverrides: { root: { fontFamily: FONT, fontSize: 13, fontWeight: 700 } } },
    MuiLinearProgress: {
      styleOverrides: {
        root: { height: 16, borderRadius: 2, border: `1px solid ${BORDER}`, backgroundColor: WHITE, boxShadow: WELL },
        bar: { backgroundColor: BLUE, backgroundImage: `linear-gradient(${'#54A6FF'}, ${BLUE})` },
      },
    },
    MuiCircularProgress: { styleOverrides: { root: { color: BLUE } } },

    // ── Data display ─────────────────────────────────────────────────────────
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 3, border: `1px solid ${BORDER}`, backgroundColor: CONTROL, color: TEXT, fontFamily: FONT, fontSize: 12, height: 24, boxShadow: `inset 1px 1px 0 ${BEVEL_LT}` },
        outlined: { backgroundColor: WHITE, boxShadow: 'none' },
        deleteIcon: { color: TEXT_LIGHT, '&:hover': { color: TEXT } },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: { borderRadius: 9, border: `1px solid ${BLUE_DK}`, backgroundColor: BLUE, color: WHITE, fontFamily: FONT, fontSize: 11, minWidth: 18, height: 18 },
      },
    },
    MuiDivider: { styleOverrides: { root: { borderColor: BORDER_SOFT } } },
    MuiTableContainer: { styleOverrides: { root: { boxShadow: 'none' } } },
    MuiTable: { styleOverrides: { root: { backgroundColor: WHITE } } },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: BORDER_SOFT, fontFamily: FONT, fontSize: 12, padding: '5px 10px' },
        head: { fontFamily: FONT, fontWeight: 700, backgroundColor: PANEL, color: TEXT },
      },
    },
    MuiList: { styleOverrides: { root: { paddingTop: 0, paddingBottom: 0, backgroundColor: WHITE } } },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: BLUE,
            color: WHITE,
            '& .MuiListItemIcon-root': { color: WHITE },
            '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.8)' },
            '&:hover': { backgroundColor: BLUE },
          },
          '&:hover': { backgroundColor: PANEL_LT },
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
        root: { border: `1px solid ${BORDER}`, boxShadow: 'none', '&:not(:last-child)': { borderBottom: 0 }, '&::before': { display: 'none' } },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: { backgroundColor: PANEL, fontFamily: FONT, fontWeight: 700, minHeight: 0, boxShadow: `inset 0 1px 0 ${BEVEL_LT}`, '&.Mui-expanded': { minHeight: 0, borderBottom: `1px solid ${BORDER_SOFT}` } },
        content: { margin: '8px 0', '&.Mui-expanded': { margin: '8px 0' } },
      },
    },
    MuiAccordionDetails: { styleOverrides: { root: { padding: 12, fontFamily: FONT, backgroundColor: PANEL_LT } } },
  },
});

export const beos = theme;
export default theme;
