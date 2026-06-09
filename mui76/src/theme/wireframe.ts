import { createTheme } from '@mui/material/styles';

/**
 * wireframe.ts — a Material UI theme modeled after Moderne's "Neo" lo-fi
 * wireframe prototyping kit
 * (https://moderneinc.github.io/prototypes/Wireframes/wireframes.html).
 *
 * Pass the default export to <ThemeProvider>. The look:
 *   - Hand-drawn Handlee typeface, Fira Code for mono/code.
 *   - Light grayscale palette on a faint dotted "prototype paper" canvas.
 *   - Wobbly, asymmetric border-radii so every box looks hand-sketched.
 *   - 1.5px borders + hard, blur-free offset shadows.
 *   - Muted, desaturated semantic colors (sketch-marker greens/golds/mauves).
 *
 * Token values mirror the kit's CSS custom properties verbatim.
 */

// ── Palette ──────────────────────────────────────────────────────────────────
const BG = '#F9FAFB';
const SURFACE = '#FFFFFF';
const FILL = '#F3F4F6';
const FILL_DARK = '#E5E7EB';
const BORDER = '#D1D5DB';
const BORDER_DARK = '#9CA3AF';
const TEXT = '#1F2937';
const TEXT_LIGHT = '#6B7280';
const TEXT_LIGHTER = '#9CA3AF';
const ACCENT = '#4B5563';
const SUCCESS = '#9CB8A8';
const SUCCESS_TEXT = '#5E8478';
const WARNING = '#B8B080';
const WARNING_TEXT = '#7A6E3B';
const ERROR = '#B89098';
const ERROR_TEXT = '#8B5E68';

// ── Type ─────────────────────────────────────────────────────────────────────
const FONT = "'Handlee', 'Comic Sans MS', cursive";
const MONO = "'Fira Code', ui-monospace, monospace";

// ── Sketch geometry ──────────────────────────────────────────────────────────
const RADIUS = '3px 4px 3px 5px'; // wobbly corners — the signature trick
const RADIUS_LG = '5px 7px 6px 8px';
const BORDER_STYLE = `1.5px solid ${BORDER}`;
const SHADOW = '1px 2px 0px rgba(0,0,0,0.06)';
const SHADOW_LG = '2px 3px 0px rgba(0,0,0,0.08)';

const theme = createTheme({
  shape: { borderRadius: 4 },

  palette: {
    mode: 'light',
    common: { black: TEXT, white: SURFACE },
    primary: { main: TEXT, contrastText: SURFACE },
    secondary: { main: FILL_DARK, contrastText: TEXT },
    background: { default: BG, paper: SURFACE },
    text: { primary: TEXT, secondary: TEXT_LIGHT, disabled: TEXT_LIGHTER },
    divider: BORDER,
    info: { main: ACCENT, contrastText: SURFACE },
    success: { main: SUCCESS, dark: SUCCESS_TEXT, contrastText: SURFACE },
    warning: { main: WARNING, dark: WARNING_TEXT, contrastText: SURFACE },
    error: { main: ERROR, dark: ERROR_TEXT, contrastText: SURFACE },
    grey: {
      50: BG,
      100: FILL,
      200: FILL_DARK,
      300: BORDER,
      400: BORDER_DARK,
      500: TEXT_LIGHTER,
      600: TEXT_LIGHT,
      700: ACCENT,
      800: '#374151',
      900: TEXT,
    },
  },

  typography: {
    fontFamily: FONT,
    fontSize: 15,
    h1: { fontFamily: FONT, fontSize: 28, fontWeight: 400 },
    h2: { fontFamily: FONT, fontSize: 22, fontWeight: 400 },
    h3: { fontFamily: FONT, fontSize: 18, fontWeight: 400 },
    h4: { fontFamily: FONT, fontSize: 16, fontWeight: 400 },
    h5: { fontFamily: FONT, fontSize: 15, fontWeight: 400 },
    h6: { fontFamily: FONT, fontSize: 13, fontWeight: 400 },
    subtitle1: { fontFamily: FONT, fontSize: 15 },
    subtitle2: { fontFamily: FONT, fontSize: 13 },
    body1: { fontSize: 15, lineHeight: 1.6 },
    body2: { fontSize: 13, lineHeight: 1.6 },
    caption: { fontSize: 11, color: TEXT_LIGHT },
    button: { fontFamily: FONT, textTransform: 'none' },
    overline: {
      fontFamily: FONT,
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      color: TEXT_LIGHT,
    },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' },
        body: {
          backgroundColor: BG,
          // Faint dot grid — the "prototype paper" canvas.
          backgroundImage: `radial-gradient(${FILL_DARK} 0.5px, transparent 0.5px)`,
          backgroundSize: '18px 18px',
        },
        code: { fontFamily: MONO },
        '*::-webkit-scrollbar': { width: 12, height: 12 },
        '*::-webkit-scrollbar-track': { backgroundColor: FILL },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: FILL_DARK,
          border: `1px solid ${BORDER}`,
          borderRadius: 6,
        },
        '*::-webkit-scrollbar-thumb:hover': { backgroundColor: BORDER },
      },
    },

    // ── Surfaces ─────────────────────────────────────────────────────────────
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundColor: SURFACE,
          color: TEXT,
          border: BORDER_STYLE,
          borderRadius: RADIUS_LG,
          backgroundImage: 'none',
          boxShadow: SHADOW,
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: { root: { borderRadius: RADIUS_LG, boxShadow: SHADOW } },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: { borderBottom: BORDER_STYLE, padding: '10px 16px', backgroundColor: FILL },
        title: { fontFamily: FONT, fontSize: 16 },
        subheader: { fontFamily: FONT, fontSize: 13, color: TEXT_LIGHT },
      },
    },

    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'transparent', position: 'static' },
      styleOverrides: {
        root: {
          backgroundColor: SURFACE,
          color: TEXT,
          borderRadius: 0,
          borderBottom: BORDER_STYLE,
          boxShadow: 'none',
          backgroundImage: 'none',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: { minHeight: 56, '@media (min-width:600px)': { minHeight: 56 } },
      },
    },

    // ── Buttons ──────────────────────────────────────────────────────────────
    MuiButton: {
      defaultProps: { variant: 'outlined', disableElevation: true, disableRipple: true },
      styleOverrides: {
        root: {
          fontFamily: FONT,
          fontSize: 13,
          textTransform: 'none',
          borderRadius: RADIUS,
          border: '1.5px solid transparent',
          padding: '7px 16px',
          minWidth: 0,
          lineHeight: 1.4,
          boxShadow: SHADOW,
          transition: 'background 0.15s',
        },
        outlined: {
          borderColor: BORDER_DARK,
          backgroundColor: SURFACE,
          color: TEXT,
          '&:hover': { borderColor: BORDER_DARK, backgroundColor: FILL },
          '&.MuiButton-colorError': { borderColor: ERROR, color: ERROR_TEXT },
          '&.MuiButton-colorSuccess': { borderColor: SUCCESS, color: SUCCESS_TEXT },
          '&.Mui-disabled': { borderColor: BORDER, color: TEXT_LIGHTER, boxShadow: 'none' },
        },
        contained: {
          boxShadow: SHADOW,
          '&:hover': { boxShadow: SHADOW },
          '&.MuiButton-colorPrimary': {
            backgroundColor: TEXT,
            color: SURFACE,
            borderColor: TEXT,
            '&:hover': { backgroundColor: '#374151' },
          },
          '&.MuiButton-colorSecondary': {
            backgroundColor: FILL_DARK,
            color: TEXT,
            borderColor: BORDER_DARK,
            '&:hover': { backgroundColor: BORDER },
          },
          '&.Mui-disabled': { backgroundColor: FILL, color: TEXT_LIGHTER, boxShadow: 'none' },
        },
        text: {
          border: '1.5px solid transparent',
          backgroundColor: 'transparent',
          boxShadow: 'none',
          color: TEXT,
          '&:hover': { backgroundColor: FILL, boxShadow: 'none' },
        },
        sizeSmall: { padding: '4px 10px', fontSize: 11 },
        sizeLarge: { padding: '10px 22px', fontSize: 15 },
      },
    },
    MuiButtonGroup: {
      defaultProps: { disableRipple: true, disableElevation: true, variant: 'outlined' },
      styleOverrides: {
        grouped: { '&:not(:last-of-type)': { borderRightColor: BORDER_DARK } },
      },
    },
    MuiIconButton: {
      defaultProps: { disableRipple: true },
      styleOverrides: {
        root: {
          borderRadius: RADIUS,
          border: `1.5px solid ${BORDER_DARK}`,
          backgroundColor: SURFACE,
          color: TEXT,
          boxShadow: SHADOW,
          padding: 7,
          '&:hover': { backgroundColor: FILL },
          '&.Mui-disabled': { borderColor: BORDER, color: TEXT_LIGHTER, boxShadow: 'none' },
        },
      },
    },

    // ── Form controls ────────────────────────────────────────────────────────
    MuiTextField: { defaultProps: { variant: 'outlined', size: 'small' } },
    MuiFormControl: { defaultProps: { size: 'small' } },
    MuiSelect: { defaultProps: { size: 'small' } },
    MuiInputBase: {
      styleOverrides: {
        root: { fontFamily: FONT, fontSize: 15, backgroundColor: SURFACE },
        input: { '&::placeholder': { color: TEXT_LIGHTER, opacity: 1 } },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontFamily: FONT,
          backgroundColor: SURFACE,
          borderRadius: RADIUS,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: BORDER,
            borderWidth: 1.5,
            borderRadius: RADIUS,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: BORDER_DARK },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: ACCENT, borderWidth: 1.5 },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': { borderColor: ERROR },
        },
        input: { padding: '8px 12px' },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { fontFamily: FONT, color: TEXT_LIGHT, '&.Mui-focused': { color: ACCENT } },
      },
    },
    MuiFormLabel: {
      styleOverrides: { root: { fontFamily: FONT, color: TEXT, '&.Mui-focused': { color: ACCENT } } },
    },
    MuiFormControlLabel: { styleOverrides: { label: { fontFamily: FONT, fontSize: 15 } } },
    MuiFormHelperText: {
      styleOverrides: {
        root: { fontFamily: FONT, fontSize: 12, marginLeft: 2, '&.Mui-error': { color: ERROR_TEXT } },
      },
    },
    MuiCheckbox: {
      defaultProps: { disableRipple: true },
      styleOverrides: {
        root: { color: BORDER_DARK, '&.Mui-checked': { color: TEXT }, '&.Mui-disabled': { color: BORDER } },
      },
    },
    MuiRadio: {
      defaultProps: { disableRipple: true },
      styleOverrides: {
        root: { color: BORDER_DARK, '&.Mui-checked': { color: TEXT }, '&.Mui-disabled': { color: BORDER } },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: { width: 46, height: 26, padding: 7 },
        switchBase: {
          padding: 6,
          '&.Mui-checked': {
            transform: 'translateX(20px)',
            color: SURFACE,
            '& + .MuiSwitch-track': { backgroundColor: TEXT, opacity: 1, borderColor: TEXT },
          },
        },
        thumb: { width: 12, height: 12, boxShadow: 'none', backgroundColor: SURFACE, border: `1px solid ${BORDER_DARK}` },
        track: { borderRadius: 10, backgroundColor: FILL_DARK, border: `1.5px solid ${BORDER}`, opacity: 1 },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: { color: ACCENT, height: 6, padding: '13px 0' },
        rail: { backgroundColor: FILL_DARK, opacity: 1, borderRadius: 6, border: `1px solid ${BORDER}` },
        track: { backgroundColor: ACCENT, border: 'none', borderRadius: 6 },
        thumb: {
          width: 18,
          height: 18,
          backgroundColor: SURFACE,
          border: `1.5px solid ${BORDER_DARK}`,
          borderRadius: RADIUS,
          boxShadow: SHADOW,
          '&:hover, &.Mui-focusVisible': { boxShadow: SHADOW },
        },
        valueLabel: { backgroundColor: TEXT, color: SURFACE, borderRadius: RADIUS, fontFamily: FONT, fontSize: 12 },
        mark: { backgroundColor: BORDER_DARK },
        markLabel: { fontFamily: FONT, fontSize: 11 },
      },
    },

    // ── Navigation: tabs as a segmented control ──────────────────────────────
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 0,
          display: 'inline-flex',
          width: 'fit-content',
          backgroundColor: FILL,
          border: `1.5px solid ${BORDER}`,
          borderRadius: RADIUS,
          padding: 3,
        },
        indicator: { display: 'none' },
        flexContainer: { gap: 3 },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: FONT,
          fontSize: 13,
          textTransform: 'none',
          minHeight: 0,
          padding: '5px 14px',
          borderRadius: RADIUS,
          color: TEXT_LIGHT,
          '&.Mui-selected': { color: TEXT, backgroundColor: SURFACE, boxShadow: SHADOW },
        },
      },
    },

    // ── Overlays ─────────────────────────────────────────────────────────────
    MuiDialog: {
      styleOverrides: {
        paper: { border: BORDER_STYLE, borderRadius: RADIUS_LG, boxShadow: SHADOW_LG, backgroundColor: SURFACE },
      },
    },
    MuiDialogTitle: {
      styleOverrides: { root: { fontFamily: FONT, fontSize: 18, padding: '12px 20px', borderBottom: BORDER_STYLE } },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: { backgroundColor: 'rgba(17,24,39,0.35)' },
        invisible: { backgroundColor: 'transparent' },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: { borderRadius: RADIUS, border: BORDER_STYLE, boxShadow: SHADOW_LG },
        list: { padding: 4 },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: FONT,
          fontSize: 14,
          borderRadius: RADIUS,
          '&:hover': { backgroundColor: FILL },
          '&.Mui-selected': { backgroundColor: FILL_DARK, '&:hover': { backgroundColor: FILL_DARK } },
        },
      },
    },
    MuiTooltip: {
      defaultProps: { arrow: true },
      styleOverrides: {
        tooltip: { backgroundColor: TEXT, color: SURFACE, borderRadius: RADIUS, fontFamily: FONT, fontSize: 12, padding: '5px 9px' },
        arrow: { color: TEXT },
      },
    },

    // ── Feedback ─────────────────────────────────────────────────────────────
    MuiAlert: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: { fontFamily: FONT, fontSize: 13, borderRadius: RADIUS, borderWidth: 1.5, boxShadow: SHADOW, alignItems: 'center' },
        outlinedInfo: { borderColor: BORDER_DARK, backgroundColor: FILL, color: TEXT, '& .MuiAlert-icon': { color: ACCENT } },
        outlinedSuccess: { borderColor: SUCCESS, backgroundColor: '#F1F5F3', color: SUCCESS_TEXT, '& .MuiAlert-icon': { color: SUCCESS_TEXT } },
        outlinedWarning: { borderColor: WARNING, backgroundColor: '#F7F4EC', color: WARNING_TEXT, '& .MuiAlert-icon': { color: WARNING_TEXT } },
        outlinedError: { borderColor: ERROR, backgroundColor: '#F7F0F1', color: ERROR_TEXT, '& .MuiAlert-icon': { color: ERROR_TEXT } },
      },
    },
    MuiAlertTitle: { styleOverrides: { root: { fontFamily: FONT, fontSize: 14 } } },
    MuiLinearProgress: {
      styleOverrides: {
        root: { height: 10, borderRadius: RADIUS, border: `1px solid ${BORDER}`, backgroundColor: FILL_DARK },
        bar: { backgroundColor: ACCENT },
      },
    },
    MuiCircularProgress: { styleOverrides: { root: { color: ACCENT } } },

    // ── Data display ─────────────────────────────────────────────────────────
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 14, border: `1px solid ${BORDER}`, backgroundColor: SURFACE, color: TEXT, fontFamily: FONT, fontSize: 13, height: 26 },
        outlined: { backgroundColor: 'transparent' },
        deleteIcon: { color: TEXT_LIGHT, '&:hover': { color: TEXT } },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          borderRadius: '10px 12px 11px 10px',
          border: `1px solid ${BORDER}`,
          backgroundColor: FILL_DARK,
          color: TEXT_LIGHT,
          fontFamily: FONT,
          fontSize: 11,
          minWidth: 20,
          height: 20,
        },
      },
    },
    MuiDivider: { styleOverrides: { root: { borderColor: BORDER } } },
    MuiTableContainer: { styleOverrides: { root: { boxShadow: 'none' } } },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: BORDER, fontFamily: FONT, fontSize: 14, padding: '8px 12px' },
        head: { fontFamily: FONT, fontWeight: 400, backgroundColor: FILL, color: TEXT_LIGHT },
      },
    },
    MuiList: { styleOverrides: { root: { paddingTop: 4, paddingBottom: 4 } } },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: RADIUS,
          '&:hover': { backgroundColor: FILL },
          '&.Mui-selected': { backgroundColor: FILL_DARK, '&:hover': { backgroundColor: FILL_DARK } },
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
        root: {
          border: BORDER_STYLE,
          boxShadow: 'none',
          '&:not(:last-child)': { borderBottom: 0 },
          '&::before': { display: 'none' },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: { backgroundColor: FILL, fontFamily: FONT, minHeight: 0, '&.Mui-expanded': { minHeight: 0, borderBottom: BORDER_STYLE } },
        content: { margin: '10px 0', '&.Mui-expanded': { margin: '10px 0' } },
      },
    },
    MuiAccordionDetails: { styleOverrides: { root: { padding: 14, fontFamily: FONT } } },
  },
});

export const wireframe = theme;
export default theme;
