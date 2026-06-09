import { createTheme } from '@mui/material/styles';

/**
 * aqua.ts — a Material UI theme inspired by the original Mac OS X "Aqua"
 * (10.0 Cheetah … 10.4 Tiger): glossy, lickable, candy-coated.
 *
 * The flavor:
 *   - Lucida Grande type on a deep-blue Aqua desktop gradient.
 *   - Glossy gel buttons: a white "aqua" default and a blue affirmative.
 *   - Pinstriped title bars with red/yellow/green traffic lights.
 *   - Capsule/pill radii, soft drop shadows, and the signature blue focus glow.
 *   - Gel-blue selection highlights and progress bars; pale-yellow help tags.
 */

// ── Palette ──────────────────────────────────────────────────────────────────
const AQUA = '#2E6FD6';
const AQUA_DK = '#1A5FCC';
const AQUA_LT = '#6FB0F5';
const SELECTION = '#3875D7';
const WHITE = '#FFFFFF';
const TEXT = '#1D1D1F';
const TEXT_LIGHT = '#6E6E73';
const TEXT_DISABLED = '#AEAEB2';
const BORDER = 'rgba(0,0,0,0.18)';
const BORDER_SOFT = 'rgba(0,0,0,0.12)';
const PANEL = '#ECECEC';
const SUCCESS = '#34A24B';
const WARNING = '#E8A317';
const ERROR = '#D7322B';

// ── Type ─────────────────────────────────────────────────────────────────────
const FONT = "'Lucida Grande', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const MONO = "'Monaco', 'Fira Code', ui-monospace, monospace";

// ── Gloss recipes ────────────────────────────────────────────────────────────
// A white "aqua" surface: bright top, faint crease at the mid-line.
const WHITE_GEL = 'linear-gradient(to bottom, #ffffff, #f0f0f0 45%, #e2e2e2 55%, #ededed)';
const WHITE_GEL_HOVER = 'linear-gradient(to bottom, #ffffff, #f6f6f6 45%, #e9e9e9 55%, #f4f4f4)';
const WHITE_GEL_DOWN = 'linear-gradient(to bottom, #d8d8d8, #c9c9c9)';
// The blue affirmative button: a white sheen over the top, blue body below.
const BLUE_GEL =
  'linear-gradient(to bottom, rgba(255,255,255,0.55), rgba(255,255,255,0.06) 48%, rgba(255,255,255,0) 50%), linear-gradient(to bottom, #62a4f3, #2e74e0 50%, #1f64d6 51%, #2c71dc)';
const BLUE_GEL_HOVER =
  'linear-gradient(to bottom, rgba(255,255,255,0.65), rgba(255,255,255,0.1) 48%, rgba(255,255,255,0) 50%), linear-gradient(to bottom, #74b0f7, #3a82e8 50%, #2a6cda 51%, #3a7ce2)';
const BLUE_GEL_DOWN = 'linear-gradient(to bottom, #2a6fdc, #1a5bc4)';

const theme = createTheme({
  shape: { borderRadius: 6 },

  palette: {
    mode: 'light',
    common: { black: TEXT, white: WHITE },
    primary: { main: AQUA, dark: AQUA_DK, light: AQUA_LT, contrastText: WHITE },
    secondary: { main: '#8E8E93', contrastText: WHITE },
    background: { default: '#2E6FD6', paper: WHITE },
    text: { primary: TEXT, secondary: TEXT_LIGHT, disabled: TEXT_DISABLED },
    divider: BORDER_SOFT,
    info: { main: AQUA, contrastText: WHITE },
    success: { main: SUCCESS, contrastText: WHITE },
    warning: { main: WARNING, contrastText: WHITE },
    error: { main: ERROR, contrastText: WHITE },
    grey: {
      50: '#FAFAFA',
      100: '#F2F2F2',
      200: PANEL,
      300: '#DDDDDD',
      400: '#C7C7C7',
      500: '#AEAEB2',
      600: '#8E8E93',
      700: TEXT_LIGHT,
      800: '#3A3A3C',
      900: TEXT,
    },
  },

  typography: {
    fontFamily: FONT,
    fontSize: 13,
    h1: { fontFamily: FONT, fontSize: 30, fontWeight: 500 },
    h2: { fontFamily: FONT, fontSize: 24, fontWeight: 500 },
    h3: { fontFamily: FONT, fontSize: 19, fontWeight: 500 },
    h4: { fontFamily: FONT, fontSize: 16, fontWeight: 500 },
    h5: { fontFamily: FONT, fontSize: 14, fontWeight: 700 },
    h6: { fontFamily: FONT, fontSize: 13, fontWeight: 700 },
    subtitle1: { fontFamily: FONT, fontSize: 14, fontWeight: 500 },
    subtitle2: { fontFamily: FONT, fontSize: 12, fontWeight: 500 },
    body1: { fontSize: 13, lineHeight: 1.5 },
    body2: { fontSize: 12, lineHeight: 1.5 },
    caption: { fontSize: 11, color: TEXT_LIGHT },
    button: { fontFamily: FONT, fontWeight: 500, textTransform: 'none' },
    overline: { fontFamily: FONT, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4, color: TEXT_LIGHT },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' },
        body: {
          // The deep-blue Aqua desktop gradient.
          backgroundColor: '#2E6FD6',
          backgroundImage: 'radial-gradient(ellipse at 50% -10%, #7CC0FB 0%, #2E6FD6 55%, #143F86 100%)',
          backgroundAttachment: 'fixed',
        },
        code: { fontFamily: MONO },
        '::selection': { backgroundColor: SELECTION, color: WHITE },
        '*::-webkit-scrollbar': { width: 15, height: 15 },
        '*::-webkit-scrollbar-track': { backgroundColor: '#E8E8E8', borderRadius: 8 },
        '*::-webkit-scrollbar-thumb': {
          borderRadius: 8,
          border: '2px solid #E8E8E8',
          backgroundImage: 'linear-gradient(to bottom, #8fbdf6, #3b80e6)',
        },
        '*::-webkit-scrollbar-thumb:hover': { backgroundImage: 'linear-gradient(to bottom, #a0c8f8, #4a8aea)' },
      },
    },

    // ── Surfaces ─────────────────────────────────────────────────────────────
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundColor: WHITE,
          color: TEXT,
          border: `1px solid ${BORDER_SOFT}`,
          borderRadius: 8,
          backgroundImage: 'none',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        },
      },
    },
    MuiCard: { defaultProps: { elevation: 0 }, styleOverrides: { root: { borderRadius: 8, boxShadow: '0 6px 18px rgba(0,0,0,0.18)' } } },
    MuiCardHeader: {
      styleOverrides: {
        root: { borderBottom: `1px solid ${BORDER_SOFT}`, padding: '10px 16px' },
        title: { fontFamily: FONT, fontSize: 15, fontWeight: 700 },
        subheader: { fontFamily: FONT, fontSize: 12, color: TEXT_LIGHT },
      },
    },

    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'transparent', position: 'static' },
      styleOverrides: {
        root: {
          color: TEXT,
          borderRadius: 0,
          borderBottom: '1px solid #B5B5B5',
          boxShadow: '0 1px 0 rgba(255,255,255,0.6)',
          backgroundImage: 'linear-gradient(to bottom, #fbfbfb, #e6e6e6)',
        },
      },
    },
    MuiToolbar: { styleOverrides: { root: { minHeight: 30, '@media (min-width:600px)': { minHeight: 30 } } } },

    // ── Buttons ──────────────────────────────────────────────────────────────
    MuiButton: {
      defaultProps: { variant: 'outlined', disableElevation: true, disableRipple: true },
      styleOverrides: {
        root: {
          fontFamily: FONT,
          fontWeight: 500,
          fontSize: 13,
          textTransform: 'none',
          borderRadius: 13, // capsule
          padding: '4px 18px',
          minWidth: 68,
          lineHeight: 1.4,
          transition: 'none',
        },
        outlined: {
          border: '1px solid #A6A6A6',
          color: TEXT,
          backgroundImage: WHITE_GEL,
          boxShadow: '0 1px 1.5px rgba(0,0,0,0.16), inset 0 1px 0 rgba(255,255,255,0.9)',
          '&:hover': { borderColor: '#A6A6A6', backgroundImage: WHITE_GEL_HOVER },
          '&:active': { backgroundImage: WHITE_GEL_DOWN, boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)' },
          '&.Mui-disabled': { backgroundImage: 'none', backgroundColor: '#f0f0f0', color: TEXT_DISABLED, borderColor: BORDER_SOFT, boxShadow: 'none' },
        },
        contained: {
          border: '1px solid #1657B8',
          color: WHITE,
          textShadow: '0 -1px 0 rgba(0,0,0,0.28)',
          backgroundImage: BLUE_GEL,
          boxShadow: '0 1px 2px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.4)',
          '&:hover': { backgroundImage: BLUE_GEL_HOVER },
          '&:active': { backgroundImage: BLUE_GEL_DOWN, boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)' },
          '&.Mui-disabled': { backgroundImage: 'none', backgroundColor: '#cfd9ea', color: '#eef3fb', borderColor: BORDER_SOFT, textShadow: 'none' },
        },
        text: {
          border: '1px solid transparent',
          backgroundColor: 'transparent',
          color: AQUA_DK,
          minWidth: 0,
          padding: '4px 10px',
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' },
        },
        sizeSmall: { padding: '2px 12px', fontSize: 12, borderRadius: 11 },
        sizeLarge: { padding: '7px 24px', fontSize: 14, borderRadius: 16 },
      },
    },
    MuiButtonGroup: {
      defaultProps: { disableRipple: true, disableElevation: true, variant: 'outlined' },
      styleOverrides: { grouped: { '&:not(:last-of-type)': { borderRightColor: '#A6A6A6' } } },
    },
    MuiIconButton: {
      defaultProps: { disableRipple: true },
      styleOverrides: {
        root: {
          borderRadius: 9,
          border: '1px solid #A6A6A6',
          color: TEXT,
          backgroundImage: WHITE_GEL,
          boxShadow: '0 1px 1.5px rgba(0,0,0,0.16), inset 0 1px 0 rgba(255,255,255,0.9)',
          padding: 6,
          '&:hover': { backgroundImage: WHITE_GEL_HOVER },
          '&:active': { backgroundImage: WHITE_GEL_DOWN, boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)' },
          '&.Mui-disabled': { backgroundImage: 'none', backgroundColor: '#f0f0f0', color: TEXT_DISABLED, borderColor: BORDER_SOFT, boxShadow: 'none' },
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
        input: { padding: '5px 9px', '&::placeholder': { color: TEXT_DISABLED, opacity: 1 } },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: WHITE,
          borderRadius: 6,
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.12)',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#B0B0B0', borderRadius: 6 },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#8E8E93' },
          // The signature Aqua blue focus glow.
          '&.Mui-focused': { boxShadow: `inset 0 1px 2px rgba(0,0,0,0.10), 0 0 0 3px rgba(46,111,214,0.35)` },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: AQUA, borderWidth: 1 },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': { borderColor: ERROR },
        },
      },
    },
    MuiInputLabel: { styleOverrides: { root: { fontFamily: FONT, fontSize: 13, color: TEXT_LIGHT, '&.Mui-focused': { color: AQUA_DK } } } },
    MuiFormLabel: { styleOverrides: { root: { fontFamily: FONT, color: TEXT, '&.Mui-focused': { color: AQUA_DK } } } },
    MuiFormControlLabel: { styleOverrides: { label: { fontFamily: FONT, fontSize: 13 } } },
    MuiFormHelperText: { styleOverrides: { root: { fontFamily: FONT, fontSize: 11, marginLeft: 2, '&.Mui-error': { color: ERROR } } } },
    MuiCheckbox: {
      defaultProps: { disableRipple: true },
      styleOverrides: { root: { color: '#8E8E93', padding: 4, '&.Mui-checked': { color: AQUA }, '&.Mui-disabled': { color: TEXT_DISABLED } } },
    },
    MuiRadio: {
      defaultProps: { disableRipple: true },
      styleOverrides: { root: { color: '#8E8E93', padding: 4, '&.Mui-checked': { color: AQUA }, '&.Mui-disabled': { color: TEXT_DISABLED } } },
    },
    MuiSwitch: {
      styleOverrides: {
        root: { width: 48, height: 28, padding: 7 },
        switchBase: {
          padding: 6,
          '&.Mui-checked': {
            transform: 'translateX(20px)',
            color: WHITE,
            '& + .MuiSwitch-track': { opacity: 1, backgroundImage: 'linear-gradient(to bottom, #3a80e8, #2e6fd6)', border: `1px solid ${AQUA_DK}` },
          },
        },
        thumb: { width: 16, height: 16, backgroundImage: 'linear-gradient(to bottom, #ffffff, #e8e8e8)', boxShadow: '0 1px 2px rgba(0,0,0,0.3)' },
        track: { borderRadius: 14, backgroundColor: '#E2E2E2', border: '1px solid #B5B5B5', opacity: 1 },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: { color: AQUA, height: 5, padding: '13px 0' },
        rail: { backgroundColor: '#D2D2D2', opacity: 1, borderRadius: 4, boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.18)' },
        track: { backgroundImage: 'linear-gradient(to bottom, #6fb0f5, #2e6fd6)', border: 'none', borderRadius: 4 },
        thumb: {
          width: 18,
          height: 18,
          backgroundImage: 'radial-gradient(circle at 50% 35%, #ffffff, #dcdcdc)',
          border: '1px solid #9a9a9a',
          boxShadow: '0 1px 2px rgba(0,0,0,0.25)',
          '&:hover, &.Mui-focusVisible': { boxShadow: '0 0 0 6px rgba(46,111,214,0.16)' },
        },
        valueLabel: { backgroundColor: AQUA_DK, color: WHITE, borderRadius: 4, fontFamily: FONT, fontSize: 11 },
        markLabel: { fontFamily: FONT, fontSize: 10 },
      },
    },

    // ── Navigation: glossy capsule tabs ──────────────────────────────────────
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 0,
          display: 'inline-flex',
          width: 'fit-content',
          borderRadius: 14,
          padding: 2,
          border: '1px solid #B0B0B0',
          backgroundImage: 'linear-gradient(to bottom, #e4e4e4, #d2d2d2)',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.12)',
        },
        indicator: { display: 'none' },
        flexContainer: { gap: 2 },
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
          borderRadius: 12,
          color: TEXT,
          '&.Mui-selected': {
            color: WHITE,
            textShadow: '0 -1px 0 rgba(0,0,0,0.25)',
            backgroundImage: 'linear-gradient(to bottom, #62a4f3, #2e74e0 50%, #1f64d6 51%, #2c71dc)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.25)',
          },
        },
      },
    },

    // ── Overlays ─────────────────────────────────────────────────────────────
    MuiDialog: {
      styleOverrides: { paper: { border: `1px solid ${BORDER}`, borderRadius: 10, boxShadow: '0 18px 50px rgba(0,0,0,0.4)', backgroundColor: WHITE } },
    },
    MuiDialogTitle: { styleOverrides: { root: { fontFamily: FONT, fontSize: 16, fontWeight: 700, padding: '12px 20px' } } },
    MuiBackdrop: { styleOverrides: { root: { backgroundColor: 'rgba(0,0,0,0.32)' }, invisible: { backgroundColor: 'transparent' } } },
    MuiMenu: {
      styleOverrides: {
        paper: { borderRadius: 6, border: `1px solid ${BORDER}`, boxShadow: '0 8px 24px rgba(0,0,0,0.3)' },
        list: { padding: 3 },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: FONT,
          fontSize: 13,
          borderRadius: 4,
          // Aqua menu highlight: a glossy blue gradient.
          '&:hover': { color: WHITE, backgroundImage: 'linear-gradient(to bottom, #4a8af0, #2f6fd6)' },
          '&.Mui-selected': { color: WHITE, backgroundImage: 'linear-gradient(to bottom, #4a8af0, #2f6fd6)', '&:hover': { backgroundImage: 'linear-gradient(to bottom, #4a8af0, #2f6fd6)' } },
        },
      },
    },
    MuiTooltip: {
      defaultProps: { arrow: true },
      styleOverrides: {
        // The classic pale-yellow macOS help tag.
        tooltip: { backgroundColor: '#FFFFC8', color: '#3A3A3C', border: '1px solid #C9C28A', borderRadius: 4, fontFamily: FONT, fontSize: 12, boxShadow: '0 2px 6px rgba(0,0,0,0.25)', padding: '4px 8px' },
        arrow: { color: '#FFFFC8', '&::before': { border: '1px solid #C9C28A' } },
      },
    },

    // ── Feedback ─────────────────────────────────────────────────────────────
    MuiAlert: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: { fontFamily: FONT, fontSize: 12, borderRadius: 8, border: `1px solid ${BORDER_SOFT}`, backgroundColor: WHITE, color: TEXT, boxShadow: '0 1px 3px rgba(0,0,0,0.12)', alignItems: 'center' },
        outlinedInfo: { '& .MuiAlert-icon': { color: AQUA } },
        outlinedSuccess: { '& .MuiAlert-icon': { color: SUCCESS } },
        outlinedWarning: { '& .MuiAlert-icon': { color: WARNING } },
        outlinedError: { '& .MuiAlert-icon': { color: ERROR } },
        message: { color: TEXT },
      },
    },
    MuiAlertTitle: { styleOverrides: { root: { fontFamily: FONT, fontSize: 13, fontWeight: 700 } } },
    MuiLinearProgress: {
      styleOverrides: {
        root: { height: 14, borderRadius: 8, border: '1px solid #B5B5B5', backgroundColor: '#ECECEC', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.14)' },
        bar: { borderRadius: 8, backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(255,255,255,0) 55%), linear-gradient(to bottom, #62a4f3, #2e6fd6)' },
      },
    },
    MuiCircularProgress: { styleOverrides: { root: { color: AQUA } } },

    // ── Data display ─────────────────────────────────────────────────────────
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 12, border: '1px solid #B5B5B5', color: TEXT, fontFamily: FONT, fontSize: 12, height: 24, backgroundImage: WHITE_GEL },
        outlined: { backgroundImage: 'none', backgroundColor: WHITE },
        deleteIcon: { color: TEXT_LIGHT, '&:hover': { color: TEXT } },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: { borderRadius: 9, backgroundImage: 'linear-gradient(to bottom, #5ea2f2, #2e6fd6)', color: WHITE, fontFamily: FONT, fontSize: 11, minWidth: 18, height: 18, boxShadow: '0 1px 1px rgba(0,0,0,0.25)' },
      },
    },
    MuiDivider: { styleOverrides: { root: { borderColor: BORDER_SOFT } } },
    MuiTableContainer: { styleOverrides: { root: { boxShadow: 'none' } } },
    MuiTable: { styleOverrides: { root: { backgroundColor: WHITE } } },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: BORDER_SOFT, fontFamily: FONT, fontSize: 12, padding: '6px 10px' },
        head: { fontFamily: FONT, fontWeight: 700, color: TEXT, backgroundImage: 'linear-gradient(to bottom, #fbfbfb, #ececec)' },
      },
    },
    MuiList: { styleOverrides: { root: { paddingTop: 2, paddingBottom: 2, backgroundColor: WHITE } } },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 5,
          margin: '0 3px',
          '&.Mui-selected': {
            color: WHITE,
            backgroundImage: 'linear-gradient(to bottom, #4a8af0, #2f6fd6)',
            '& .MuiListItemIcon-root': { color: WHITE },
            '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.85)' },
            '&:hover': { backgroundImage: 'linear-gradient(to bottom, #4a8af0, #2f6fd6)' },
          },
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' },
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
        root: { border: `1px solid ${BORDER_SOFT}`, boxShadow: 'none', '&:not(:last-child)': { borderBottom: 0 }, '&::before': { display: 'none' } },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: { backgroundImage: 'linear-gradient(to bottom, #fbfbfb, #ededed)', fontFamily: FONT, fontWeight: 500, minHeight: 0, '&.Mui-expanded': { minHeight: 0, borderBottom: `1px solid ${BORDER_SOFT}` } },
        content: { margin: '9px 0', '&.Mui-expanded': { margin: '9px 0' } },
      },
    },
    MuiAccordionDetails: { styleOverrides: { root: { padding: 12, fontFamily: FONT } } },
  },
});

export const aqua = theme;
export default theme;
