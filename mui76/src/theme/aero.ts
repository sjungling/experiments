import { createTheme } from '@mui/material/styles';

/**
 * aero.ts — a Material UI theme inspired by Frutiger Aero / Windows Aero Glass
 * (the glossy, translucent, lush-blue-skies look of Vista / Windows 7).
 *
 * The look:
 *   - Frosted-glass surfaces: translucent white with a real `backdrop-filter`
 *     blur, so the lush blue→green desktop bleeds through.
 *   - Glossy gel controls with a top sheen and an Aero blue hover glow.
 *   - Rounded corners, soft glowy shadows, humanist Segoe/Open Sans type.
 *   - Aqua-blue accent and the signature glossy-green Windows 7 progress bar.
 */

// ── Palette ──────────────────────────────────────────────────────────────────
const BLUE = '#1E90D8';
const BLUE_LT = '#5BC8F5';
const BLUE_DK = '#1675B5';
const GREEN = '#5FB85F';
const TEXT = '#16384F'; // dark blue-gray, reads on glass
const TEXT_LIGHT = '#3F5F73';
const TEXT_DISABLED = '#8AA3B3';
const WHITE = '#FFFFFF';
const GLASS = 'rgba(255,255,255,0.80)';
const GLASS_LT = 'rgba(255,255,255,0.52)';
const GLASS_BORDER = 'rgba(255,255,255,0.65)';
const HAIRLINE = 'rgba(20,70,110,0.18)';
const BLUR = 'blur(12px)';

// ── Type ─────────────────────────────────────────────────────────────────────
const FONT = "'Segoe UI', 'Open Sans', 'Helvetica Neue', Arial, sans-serif";
const MONO = "'Fira Code', ui-monospace, monospace";

// ── Gloss recipes ────────────────────────────────────────────────────────────
const WHITE_GLOSS = 'linear-gradient(to bottom, #ffffff, #eef5fb 49%, #dde9f4 50%, #eaf2fa)';
const WHITE_GLOSS_HOVER = 'linear-gradient(to bottom, #ffffff, #f4f9fd 49%, #e6f0f9 50%, #f2f8fc)';
const BLUE_GLOSS =
  'linear-gradient(to bottom, rgba(255,255,255,0.55), rgba(255,255,255,0.06) 49%, rgba(255,255,255,0) 50%), linear-gradient(to bottom, #5bc3f0, #1f8fd6 49%, #1879c0 50%, #2a96da)';
const BLUE_GLOSS_HOVER =
  'linear-gradient(to bottom, rgba(255,255,255,0.65), rgba(255,255,255,0.1) 49%, rgba(255,255,255,0) 50%), linear-gradient(to bottom, #6fcef6, #2f9fe2 49%, #1f88cf 50%, #3aa3e4)';
const GREEN_GLOSS = 'linear-gradient(to bottom, rgba(255,255,255,0.55), rgba(255,255,255,0) 50%), linear-gradient(to bottom, #8fe08f, #45a845)';
const AERO_GLOW = `0 0 0 3px rgba(30,144,216,0.28)`;

const theme = createTheme({
  shape: { borderRadius: 6 },

  palette: {
    mode: 'light',
    common: { black: TEXT, white: WHITE },
    primary: { main: BLUE, dark: BLUE_DK, light: BLUE_LT, contrastText: WHITE },
    secondary: { main: GREEN, contrastText: WHITE },
    background: { default: '#3F97E0', paper: WHITE },
    text: { primary: TEXT, secondary: TEXT_LIGHT, disabled: TEXT_DISABLED },
    divider: HAIRLINE,
    info: { main: BLUE, contrastText: WHITE },
    success: { main: GREEN, contrastText: WHITE },
    warning: { main: '#E8A317', contrastText: WHITE },
    error: { main: '#D9544D', contrastText: WHITE },
    grey: {
      50: '#F7FAFD',
      100: '#EEF4F9',
      200: '#E2EBF2',
      300: '#CFDBE6',
      400: '#B6C7D4',
      500: '#8AA3B3',
      600: '#5F7C8E',
      700: TEXT_LIGHT,
      800: '#23485E',
      900: TEXT,
    },
  },

  typography: {
    fontFamily: FONT,
    fontSize: 13,
    h1: { fontFamily: FONT, fontSize: 30, fontWeight: 300 },
    h2: { fontFamily: FONT, fontSize: 24, fontWeight: 300 },
    h3: { fontFamily: FONT, fontSize: 19, fontWeight: 400 },
    h4: { fontFamily: FONT, fontSize: 16, fontWeight: 600 },
    h5: { fontFamily: FONT, fontSize: 14, fontWeight: 600 },
    h6: { fontFamily: FONT, fontSize: 13, fontWeight: 600 },
    subtitle1: { fontFamily: FONT, fontSize: 14, fontWeight: 600 },
    subtitle2: { fontFamily: FONT, fontSize: 12, fontWeight: 600 },
    body1: { fontSize: 13, lineHeight: 1.5 },
    body2: { fontSize: 12, lineHeight: 1.5 },
    caption: { fontSize: 11, color: TEXT_LIGHT },
    button: { fontFamily: FONT, fontWeight: 600, textTransform: 'none' },
    overline: { fontFamily: FONT, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4, color: TEXT_LIGHT },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' },
        body: {
          backgroundColor: '#3F97E0',
          // Lush blue-skies-into-green Frutiger desktop with a soft sky glow.
          backgroundImage:
            'radial-gradient(120% 80% at 50% -10%, rgba(255,255,255,0.55), rgba(255,255,255,0) 55%), linear-gradient(170deg, #9FE0F6 0%, #4DAEEE 32%, #3F97E0 52%, #66C56A 100%)',
          backgroundAttachment: 'fixed',
        },
        code: { fontFamily: MONO },
        '::selection': { backgroundColor: 'rgba(30,144,216,0.32)', color: TEXT },
        '*::-webkit-scrollbar': { width: 15, height: 15 },
        '*::-webkit-scrollbar-track': { backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 8 },
        '*::-webkit-scrollbar-thumb': { borderRadius: 8, border: '3px solid transparent', backgroundClip: 'content-box', backgroundImage: 'linear-gradient(to bottom, #bfe2f4, #7fc0e8)' },
        '*::-webkit-scrollbar-thumb:hover': { backgroundImage: 'linear-gradient(to bottom, #cfeafa, #8fccf0)' },
      },
    },

    // ── Surfaces (frosted glass) ─────────────────────────────────────────────
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundColor: GLASS,
          backdropFilter: BLUR,
          WebkitBackdropFilter: BLUR,
          color: TEXT,
          border: `1px solid ${GLASS_BORDER}`,
          borderRadius: 8,
          backgroundImage: 'none',
          boxShadow: '0 4px 14px rgba(10,50,90,0.18)',
        },
      },
    },
    MuiCard: { defaultProps: { elevation: 0 }, styleOverrides: { root: { borderRadius: 10, boxShadow: '0 8px 24px rgba(10,50,90,0.22)' } } },
    MuiCardHeader: {
      styleOverrides: {
        root: { borderBottom: `1px solid ${HAIRLINE}`, padding: '10px 16px' },
        title: { fontFamily: FONT, fontSize: 15, fontWeight: 600 },
        subheader: { fontFamily: FONT, fontSize: 12, color: TEXT_LIGHT },
      },
    },

    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'transparent', position: 'static' },
      styleOverrides: {
        root: {
          backgroundColor: GLASS_LT,
          backdropFilter: BLUR,
          WebkitBackdropFilter: BLUR,
          color: TEXT,
          borderRadius: 0,
          borderBottom: '1px solid rgba(255,255,255,0.5)',
          boxShadow: '0 2px 10px rgba(10,50,90,0.15)',
          backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.65), rgba(255,255,255,0.35))',
        },
      },
    },
    MuiToolbar: { styleOverrides: { root: { minHeight: 40, '@media (min-width:600px)': { minHeight: 40 } } } },

    // ── Buttons (glossy gel) ─────────────────────────────────────────────────
    MuiButton: {
      defaultProps: { variant: 'outlined', disableElevation: true, disableRipple: true },
      styleOverrides: {
        root: {
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: 13,
          textTransform: 'none',
          borderRadius: 5,
          border: '1px solid #7FAAC8',
          color: TEXT,
          backgroundImage: WHITE_GLOSS,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
          padding: '4px 16px',
          minWidth: 0,
          lineHeight: 1.4,
          transition: 'box-shadow 0.12s',
          '&:hover': { backgroundImage: WHITE_GLOSS_HOVER, borderColor: BLUE, boxShadow: AERO_GLOW },
          '&:active': { backgroundImage: 'linear-gradient(to bottom, #d6e6f2, #c4dAed)' },
          '&.Mui-disabled': { backgroundImage: 'none', backgroundColor: 'rgba(255,255,255,0.5)', color: TEXT_DISABLED, borderColor: '#B6C7D4', boxShadow: 'none' },
        },
        contained: {
          border: '1px solid #1565A0',
          color: WHITE,
          textShadow: '0 -1px 0 rgba(0,0,0,0.25)',
          backgroundImage: BLUE_GLOSS,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)',
          '&:hover': { backgroundImage: BLUE_GLOSS_HOVER, borderColor: BLUE_DK, boxShadow: AERO_GLOW },
          '&:active': { backgroundImage: 'linear-gradient(to bottom, #1f88cf, #156aa8)' },
          '&.Mui-disabled': { backgroundImage: 'none', backgroundColor: '#A8CBE4', color: '#EAF3FB', borderColor: '#A8CBE4', textShadow: 'none' },
        },
        text: {
          border: '1px solid transparent',
          backgroundImage: 'none',
          backgroundColor: 'transparent',
          boxShadow: 'none',
          color: BLUE_DK,
          minWidth: 0,
          padding: '4px 10px',
          '&:hover': { backgroundColor: 'rgba(255,255,255,0.45)', boxShadow: 'none' },
        },
        sizeSmall: { padding: '2px 10px', fontSize: 12 },
        sizeLarge: { padding: '7px 22px', fontSize: 14 },
      },
    },
    MuiButtonGroup: {
      defaultProps: { disableRipple: true, disableElevation: true, variant: 'outlined' },
      styleOverrides: { grouped: { '&:not(:last-of-type)': { borderRightColor: '#7FAAC8' } } },
    },
    MuiIconButton: {
      defaultProps: { disableRipple: true },
      styleOverrides: {
        root: {
          borderRadius: 6,
          border: '1px solid #7FAAC8',
          color: TEXT,
          backgroundImage: WHITE_GLOSS,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
          padding: 6,
          '&:hover': { backgroundImage: WHITE_GLOSS_HOVER, borderColor: BLUE, boxShadow: AERO_GLOW },
          '&.Mui-disabled': { backgroundImage: 'none', backgroundColor: 'rgba(255,255,255,0.5)', color: TEXT_DISABLED, borderColor: '#B6C7D4', boxShadow: 'none' },
        },
      },
    },

    // ── Form controls ────────────────────────────────────────────────────────
    MuiTextField: { defaultProps: { variant: 'outlined', size: 'small' } },
    MuiFormControl: { defaultProps: { size: 'small' } },
    MuiSelect: { defaultProps: { size: 'small' } },
    MuiInputBase: {
      styleOverrides: {
        root: { fontFamily: FONT, fontSize: 13, backgroundColor: 'rgba(255,255,255,0.9)' },
        input: { padding: '5px 9px', '&::placeholder': { color: TEXT_DISABLED, opacity: 1 } },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255,255,255,0.9)',
          borderRadius: 4,
          boxShadow: 'inset 0 1px 2px rgba(20,70,110,0.14)',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#9DBBD0', borderRadius: 4 },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: BLUE },
          '&.Mui-focused': { boxShadow: `inset 0 1px 2px rgba(20,70,110,0.1), ${AERO_GLOW}` },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: BLUE, borderWidth: 1 },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': { borderColor: '#D9544D' },
        },
      },
    },
    MuiInputLabel: { styleOverrides: { root: { fontFamily: FONT, fontSize: 13, color: TEXT_LIGHT, '&.Mui-focused': { color: BLUE_DK } } } },
    MuiFormLabel: { styleOverrides: { root: { fontFamily: FONT, color: TEXT, '&.Mui-focused': { color: BLUE_DK } } } },
    MuiFormControlLabel: { styleOverrides: { label: { fontFamily: FONT, fontSize: 13 } } },
    MuiFormHelperText: { styleOverrides: { root: { fontFamily: FONT, fontSize: 11, marginLeft: 2, '&.Mui-error': { color: '#C0392B' } } } },
    MuiCheckbox: {
      defaultProps: { disableRipple: true },
      styleOverrides: { root: { color: '#7FAAC8', padding: 4, '&.Mui-checked': { color: BLUE }, '&.Mui-disabled': { color: '#B6C7D4' } } },
    },
    MuiRadio: {
      defaultProps: { disableRipple: true },
      styleOverrides: { root: { color: '#7FAAC8', padding: 4, '&.Mui-checked': { color: BLUE }, '&.Mui-disabled': { color: '#B6C7D4' } } },
    },
    MuiSwitch: {
      styleOverrides: {
        root: { width: 48, height: 26, padding: 7 },
        switchBase: {
          padding: 6,
          '&.Mui-checked': { transform: 'translateX(20px)', color: WHITE, '& + .MuiSwitch-track': { opacity: 1, backgroundImage: 'linear-gradient(to bottom, #5bc3f0, #1f8fd6)', border: `1px solid ${BLUE_DK}` } },
        },
        thumb: { width: 14, height: 14, backgroundImage: 'linear-gradient(to bottom, #ffffff, #dde9f4)', boxShadow: '0 1px 2px rgba(0,0,0,0.3)' },
        track: { borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.7)', border: '1px solid #9DBBD0', opacity: 1 },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: { color: BLUE, height: 5, padding: '13px 0' },
        rail: { backgroundColor: 'rgba(255,255,255,0.7)', opacity: 1, borderRadius: 4, border: '1px solid #9DBBD0' },
        track: { backgroundImage: 'linear-gradient(to bottom, #5bc3f0, #1f8fd6)', border: 'none', borderRadius: 4 },
        thumb: {
          width: 16,
          height: 16,
          backgroundImage: 'radial-gradient(circle at 50% 35%, #ffffff, #d6e6f2)',
          border: '1px solid #6F9AC0',
          boxShadow: '0 1px 2px rgba(0,0,0,0.25)',
          '&:hover, &.Mui-focusVisible': { boxShadow: AERO_GLOW },
        },
        valueLabel: { backgroundColor: BLUE_DK, color: WHITE, borderRadius: 4, fontFamily: FONT, fontSize: 11 },
        markLabel: { fontFamily: FONT, fontSize: 10 },
      },
    },

    // ── Navigation: glossy tabs ──────────────────────────────────────────────
    MuiTabs: {
      styleOverrides: {
        root: { minHeight: 0, display: 'inline-flex', width: 'fit-content', borderRadius: 8, padding: 2, border: '1px solid rgba(255,255,255,0.6)', backgroundColor: GLASS_LT, backdropFilter: BLUR, WebkitBackdropFilter: BLUR },
        indicator: { display: 'none' },
        flexContainer: { gap: 2 },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: 13,
          textTransform: 'none',
          minHeight: 0,
          padding: '5px 16px',
          borderRadius: 6,
          color: TEXT,
          '&.Mui-selected': { color: WHITE, textShadow: '0 -1px 0 rgba(0,0,0,0.2)', backgroundImage: BLUE_GLOSS, boxShadow: '0 1px 3px rgba(0,0,0,0.2)' },
        },
      },
    },

    // ── Overlays ─────────────────────────────────────────────────────────────
    MuiDialog: {
      styleOverrides: { paper: { border: '1px solid rgba(255,255,255,0.7)', borderRadius: 10, boxShadow: '0 18px 50px rgba(0,30,60,0.4)', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: BLUR, WebkitBackdropFilter: BLUR } },
    },
    MuiDialogTitle: { styleOverrides: { root: { fontFamily: FONT, fontSize: 16, fontWeight: 600, padding: '12px 20px', color: BLUE_DK } } },
    MuiBackdrop: { styleOverrides: { root: { backgroundColor: 'rgba(10,40,70,0.28)' }, invisible: { backgroundColor: 'transparent' } } },
    MuiMenu: {
      styleOverrides: {
        paper: { borderRadius: 6, border: '1px solid rgba(255,255,255,0.65)', boxShadow: '0 10px 26px rgba(0,30,60,0.3)', backgroundColor: 'rgba(255,255,255,0.92)', backdropFilter: BLUR, WebkitBackdropFilter: BLUR },
        list: { padding: 3 },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: FONT,
          fontSize: 13,
          borderRadius: 4,
          '&:hover': { color: WHITE, backgroundImage: BLUE_GLOSS },
          '&.Mui-selected': { color: WHITE, backgroundImage: BLUE_GLOSS, '&:hover': { backgroundImage: BLUE_GLOSS } },
        },
      },
    },
    MuiTooltip: {
      defaultProps: { arrow: true },
      styleOverrides: {
        tooltip: { backgroundColor: 'rgba(255,255,255,0.95)', color: TEXT, border: '1px solid #9DBBD0', borderRadius: 5, fontFamily: FONT, fontSize: 12, boxShadow: '0 3px 10px rgba(0,30,60,0.25)', padding: '5px 9px' },
        arrow: { color: 'rgba(255,255,255,0.95)', '&::before': { border: '1px solid #9DBBD0' } },
      },
    },

    // ── Feedback ─────────────────────────────────────────────────────────────
    MuiAlert: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: { fontFamily: FONT, fontSize: 12, borderRadius: 6, border: '1px solid rgba(255,255,255,0.6)', backgroundColor: GLASS, backdropFilter: BLUR, WebkitBackdropFilter: BLUR, color: TEXT, boxShadow: '0 2px 8px rgba(10,50,90,0.14)', alignItems: 'center' },
        outlinedInfo: { '& .MuiAlert-icon': { color: BLUE } },
        outlinedSuccess: { '& .MuiAlert-icon': { color: GREEN } },
        outlinedWarning: { '& .MuiAlert-icon': { color: '#E8A317' } },
        outlinedError: { '& .MuiAlert-icon': { color: '#D9544D' } },
        message: { color: TEXT },
      },
    },
    MuiAlertTitle: { styleOverrides: { root: { fontFamily: FONT, fontSize: 13, fontWeight: 600 } } },
    MuiLinearProgress: {
      styleOverrides: {
        root: { height: 16, borderRadius: 7, border: '1px solid #9DBBD0', backgroundColor: 'rgba(255,255,255,0.8)', boxShadow: 'inset 0 1px 2px rgba(20,70,110,0.16)' },
        // The glossy-green Windows 7 progress bar.
        bar: { borderRadius: 7, backgroundImage: GREEN_GLOSS },
      },
    },
    MuiCircularProgress: { styleOverrides: { root: { color: BLUE } } },

    // ── Data display ─────────────────────────────────────────────────────────
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 11, border: '1px solid #9DBBD0', color: TEXT, fontFamily: FONT, fontSize: 12, height: 24, backgroundImage: WHITE_GLOSS },
        outlined: { backgroundImage: 'none', backgroundColor: 'rgba(255,255,255,0.6)' },
        deleteIcon: { color: TEXT_LIGHT, '&:hover': { color: TEXT } },
      },
    },
    MuiBadge: {
      styleOverrides: { badge: { borderRadius: 9, border: '1px solid #1565A0', backgroundImage: 'linear-gradient(to bottom, #5bc3f0, #1f8fd6)', color: WHITE, fontFamily: FONT, fontSize: 11, minWidth: 18, height: 18 } },
    },
    MuiDivider: { styleOverrides: { root: { borderColor: HAIRLINE } } },
    MuiTableContainer: { styleOverrides: { root: { boxShadow: 'none' } } },
    MuiTable: { styleOverrides: { root: { backgroundColor: 'rgba(255,255,255,0.55)' } } },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: HAIRLINE, fontFamily: FONT, fontSize: 12, padding: '6px 10px' },
        head: { fontFamily: FONT, fontWeight: 600, color: TEXT, backgroundColor: 'rgba(255,255,255,0.45)' },
      },
    },
    MuiList: { styleOverrides: { root: { paddingTop: 2, paddingBottom: 2 } } },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 5,
          margin: '0 3px',
          '&.Mui-selected': { color: WHITE, backgroundImage: BLUE_GLOSS, '& .MuiListItemIcon-root': { color: WHITE }, '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.85)' }, '&:hover': { backgroundImage: BLUE_GLOSS } },
          '&:hover': { backgroundColor: 'rgba(255,255,255,0.45)' },
        },
      },
    },
    MuiListItemText: {
      styleOverrides: { primary: { fontFamily: FONT, fontSize: 13 }, secondary: { fontFamily: FONT, fontSize: 11, color: TEXT_LIGHT } },
    },
    MuiListItemIcon: { styleOverrides: { root: { color: TEXT_LIGHT, minWidth: 32 } } },

    // ── Disclosure ───────────────────────────────────────────────────────────
    MuiAccordion: {
      defaultProps: { disableGutters: true, elevation: 0, square: true },
      styleOverrides: { root: { border: `1px solid ${HAIRLINE}`, boxShadow: 'none', backgroundColor: 'transparent', '&:not(:last-child)': { borderBottom: 0 }, '&::before': { display: 'none' } } },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: { backgroundColor: 'rgba(255,255,255,0.45)', fontFamily: FONT, fontWeight: 600, minHeight: 0, '&.Mui-expanded': { minHeight: 0, borderBottom: `1px solid ${HAIRLINE}` } },
        content: { margin: '9px 0', '&.Mui-expanded': { margin: '9px 0' } },
      },
    },
    MuiAccordionDetails: { styleOverrides: { root: { padding: 12, fontFamily: FONT } } },
  },
});

export const aero = theme;
export default theme;
