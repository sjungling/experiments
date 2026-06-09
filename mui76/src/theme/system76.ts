import { createTheme } from '@mui/material/styles';

/**
 * system76.ts — a Material UI theme that mimics the aesthetic of
 * Mac System 7.6 / HyperCard (the "classic grayscale" / early-platinum look).
 *
 * Pass the default export to <ThemeProvider theme={...}> (it is already the
 * result of createTheme). The raw options object is also exported as
 * `system76Options` if you want to extend it with createTheme yourself.
 *
 * Design language:
 *   - 1-bit-ish monochrome palette: white windows on a dithered gray desktop.
 *   - Hard 1px black borders, zero blur. Shadows are crisp 1px/2px offsets.
 *   - Beveled "3D" controls: light top-left highlight, dark bottom-right shade.
 *   - Pressed controls invert the bevel (classic Mac mouse-down feedback).
 *   - Pixel typefaces: Chicago-substitute for UI chrome, Geneva-substitute body.
 */

// ── Palette constants ────────────────────────────────────────────────────────
const BLACK = '#000000';
const WHITE = '#FFFFFF';
const DESKTOP = '#878787'; // 50%-gray desktop
const DESKTOP_DITHER = '#7a7a7a'; // second tone for the dither pattern
const FACE = '#DDDDDD'; // platinum control face
const FACE_DARK = '#C4C4C4'; // pressed / hovered control face
const HIGHLIGHT = '#FFFFFF'; // bevel light edge (top-left)
const SHADE = '#808080'; // bevel dark edge (bottom-right)
const DISABLED = '#9E9E9E';

// ── Typeface stacks ──────────────────────────────────────────────────────────
// Chicago was the System UI font (menus, buttons, titles); Geneva was the
// readable Finder/content font. Both are self-hosted authentic recreations
// (see src/fonts.css). 'ChicagoPixel' is the crunchier bitmap alternative.
const CHICAGO = "'Chicago', 'ChicagoPixel', 'Geneva', sans-serif";
const GENEVA = "'Geneva', 'Chicago', 'Monaco', sans-serif";

// ── Bevel recipes ────────────────────────────────────────────────────────────
// A raised control: bright top-left, dark bottom-right (light from upper-left).
const RAISED = `inset 1px 1px 0 ${HIGHLIGHT}, inset -1px -1px 0 ${SHADE}`;
// A pressed control inverts the bevel so it reads as "pushed in".
const PRESSED = `inset 1px 1px 0 ${SHADE}, inset -1px -1px 0 ${HIGHLIGHT}`;
// An inset well (text fields, list boxes): recessed look.
const WELL = `inset 1px 1px 0 ${SHADE}, inset -1px -1px 0 ${HIGHLIGHT}`;
// Hard window drop shadow — no blur, just a 2px offset slab.
const WINDOW_DROP = `2px 2px 0 0 rgba(0,0,0,0.6)`;

const theme = createTheme({
  shape: {
    borderRadius: 0,
  },

  palette: {
    mode: 'light',
    common: { black: BLACK, white: WHITE },
    primary: { main: BLACK, contrastText: WHITE },
    secondary: { main: SHADE, contrastText: WHITE },
    background: { default: DESKTOP, paper: WHITE },
    text: { primary: BLACK, secondary: '#333333', disabled: DISABLED },
    divider: BLACK,
    // Keep severities monochrome so nothing breaks the 1-bit look.
    error: { main: BLACK, contrastText: WHITE },
    warning: { main: BLACK, contrastText: WHITE },
    info: { main: BLACK, contrastText: WHITE },
    success: { main: BLACK, contrastText: WHITE },
    grey: {
      50: '#F5F5F5',
      100: '#EDEDED',
      200: FACE,
      300: FACE_DARK,
      400: '#B0B0B0',
      500: DISABLED,
      600: SHADE,
      700: '#666666',
      800: '#3D3D3D',
      900: '#1A1A1A',
    },
  },

  typography: {
    fontFamily: GENEVA,
    // Geneva is a 9px bitmap face, so it needs a little more size and leading
    // than a vector font to stay comfortably readable.
    fontSize: 15,
    htmlFontSize: 16,
    h1: { fontFamily: CHICAGO, fontSize: 30, fontWeight: 400, letterSpacing: 0 },
    h2: { fontFamily: CHICAGO, fontSize: 24, fontWeight: 400, letterSpacing: 0 },
    h3: { fontFamily: CHICAGO, fontSize: 19, fontWeight: 400, letterSpacing: 0 },
    h4: { fontFamily: CHICAGO, fontSize: 16, fontWeight: 400, letterSpacing: 0 },
    h5: { fontFamily: CHICAGO, fontSize: 14, fontWeight: 400, letterSpacing: 0 },
    h6: { fontFamily: CHICAGO, fontSize: 13, fontWeight: 400, letterSpacing: 0 },
    subtitle1: { fontFamily: CHICAGO, fontSize: 14 },
    subtitle2: { fontFamily: CHICAGO, fontSize: 12 },
    body1: { fontSize: 15, lineHeight: 1.6 },
    body2: { fontSize: 14, lineHeight: 1.6 },
    caption: { fontSize: 13, lineHeight: 1.5 },
    button: { fontFamily: CHICAGO, textTransform: 'none', letterSpacing: 0 },
    overline: { fontFamily: CHICAGO, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 },
  },

  components: {
    // ── Global resets: dithered desktop + classic chunky scrollbars ──────────
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          // Smooth the vector Chicago crisply, the way the Mac UI rendered it.
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          textRendering: 'optimizeLegibility',
        },
        body: {
          backgroundColor: DESKTOP,
          // 2px checker = the classic 50% gray desktop dither.
          backgroundImage: `repeating-conic-gradient(${DESKTOP_DITHER} 0% 25%, ${DESKTOP} 0% 50%)`,
          backgroundSize: '4px 4px',
        },
        '::selection': { backgroundColor: BLACK, color: WHITE },
        // Chunky beveled scrollbars (WebKit/Blink).
        '*::-webkit-scrollbar': { width: 15, height: 15 },
        '*::-webkit-scrollbar-track': {
          backgroundColor: '#CFCFCF',
          backgroundImage: `repeating-conic-gradient(#C7C7C7 0% 25%, #D9D9D9 0% 50%)`,
          backgroundSize: '2px 2px',
          border: `1px solid ${BLACK}`,
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: FACE,
          border: `1px solid ${BLACK}`,
          boxShadow: RAISED,
        },
        '*::-webkit-scrollbar-thumb:active': { boxShadow: PRESSED, backgroundColor: FACE_DARK },
        '*::-webkit-scrollbar-button': {
          display: 'block',
          height: 15,
          width: 15,
          backgroundColor: FACE,
          border: `1px solid ${BLACK}`,
          boxShadow: RAISED,
        },
        '*::-webkit-scrollbar-corner': { backgroundColor: '#CFCFCF' },
      },
    },

    // ── Surfaces ─────────────────────────────────────────────────────────────
    MuiPaper: {
      defaultProps: { elevation: 0, square: true },
      styleOverrides: {
        root: {
          backgroundColor: WHITE,
          color: BLACK,
          border: `1px solid ${BLACK}`,
          borderRadius: 0,
          backgroundImage: 'none',
        },
        rounded: { borderRadius: 0 },
      },
    },

    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { borderRadius: 0, boxShadow: WINDOW_DROP },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: { borderBottom: `1px solid ${BLACK}`, padding: '6px 12px' },
        title: { fontFamily: CHICAGO, fontSize: 13 },
        subheader: { fontFamily: GENEVA, fontSize: 11, color: '#333333' },
      },
    },

    // ── Menu bar / title bar ─────────────────────────────────────────────────
    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'transparent', position: 'static' },
      styleOverrides: {
        root: {
          backgroundColor: WHITE,
          color: BLACK,
          borderRadius: 0,
          borderBottom: `1px solid ${BLACK}`,
          boxShadow: 'none',
          backgroundImage: 'none',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: 30,
          '@media (min-width:600px)': { minHeight: 30 },
        },
      },
    },

    // ── Buttons ──────────────────────────────────────────────────────────────
    MuiButton: {
      defaultProps: { disableElevation: true, disableRipple: true, variant: 'outlined' },
      styleOverrides: {
        root: {
          fontFamily: CHICAGO,
          fontSize: 13,
          textTransform: 'none',
          borderRadius: 8, // System 7 push-buttons were rounded rectangles
          border: `1px solid ${BLACK}`,
          backgroundColor: FACE,
          color: BLACK,
          boxShadow: RAISED,
          padding: '4px 16px',
          minWidth: 64,
          lineHeight: 1.4,
          transition: 'none',
          '&:hover': { backgroundColor: FACE, boxShadow: RAISED },
          '&:active': { boxShadow: PRESSED, backgroundColor: FACE_DARK },
          '&.Mui-disabled': {
            color: DISABLED,
            borderColor: DISABLED,
            backgroundColor: FACE,
            boxShadow: 'none',
          },
        },
        // "contained" reads as the default button: a bold black ring around it.
        contained: {
          backgroundColor: FACE,
          color: BLACK,
          boxShadow: `${RAISED}, 0 0 0 2px ${BLACK}`,
          '&:hover': { boxShadow: `${RAISED}, 0 0 0 2px ${BLACK}` },
          '&:active': { boxShadow: `${PRESSED}, 0 0 0 2px ${BLACK}`, backgroundColor: FACE_DARK },
        },
        outlined: {
          borderColor: BLACK,
          '&:hover': { borderColor: BLACK },
        },
        // "text" reads as a HyperCard-style hot link.
        text: {
          border: '1px solid transparent',
          backgroundColor: 'transparent',
          boxShadow: 'none',
          minWidth: 0,
          padding: '2px 6px',
          '&:hover': { backgroundColor: 'transparent', boxShadow: 'none', textDecoration: 'underline' },
          '&:active': { boxShadow: 'none' },
        },
      },
    },

    MuiButtonGroup: {
      defaultProps: { disableRipple: true, disableElevation: true },
      styleOverrides: {
        grouped: { '&:not(:last-of-type)': { borderRight: `1px solid ${BLACK}` } },
      },
    },

    MuiIconButton: {
      defaultProps: { disableRipple: true },
      styleOverrides: {
        root: {
          borderRadius: 6,
          border: `1px solid ${BLACK}`,
          backgroundColor: FACE,
          color: BLACK,
          boxShadow: RAISED,
          padding: 5,
          transition: 'none',
          '&:hover': { backgroundColor: FACE },
          '&:active': { boxShadow: PRESSED, backgroundColor: FACE_DARK },
          '&.Mui-disabled': { color: DISABLED, borderColor: DISABLED, boxShadow: 'none' },
        },
      },
    },

    // ── Form controls ────────────────────────────────────────────────────────
    MuiTextField: { defaultProps: { variant: 'outlined', size: 'small' } },
    MuiFormControl: { defaultProps: { size: 'small' } },
    MuiSelect: { defaultProps: { size: 'small' } },

    MuiInputBase: {
      styleOverrides: {
        root: { fontFamily: GENEVA, fontSize: 15, backgroundColor: WHITE, borderRadius: 0 },
        input: {
          padding: '5px 8px',
          '&::placeholder': { color: DISABLED, opacity: 1 },
        },
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
          '&.Mui-disabled': {
            boxShadow: 'none',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: DISABLED },
          },
        },
        notchedOutline: { borderColor: BLACK },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { fontFamily: CHICAGO, fontSize: 13, color: BLACK, '&.Mui-focused': { color: BLACK } },
      },
    },
    MuiFormLabel: {
      styleOverrides: { root: { fontFamily: CHICAGO, color: BLACK, '&.Mui-focused': { color: BLACK } } },
    },
    MuiFormControlLabel: {
      styleOverrides: { label: { fontFamily: GENEVA, fontSize: 15 } },
    },
    MuiFormHelperText: {
      styleOverrides: { root: { fontFamily: GENEVA, fontSize: 13, marginLeft: 2 } },
    },

    MuiCheckbox: {
      defaultProps: { disableRipple: true },
      styleOverrides: {
        root: { color: BLACK, padding: 4, '&.Mui-checked': { color: BLACK }, '&.Mui-disabled': { color: DISABLED } },
      },
    },
    MuiRadio: {
      defaultProps: { disableRipple: true },
      styleOverrides: {
        root: { color: BLACK, padding: 4, '&.Mui-checked': { color: BLACK }, '&.Mui-disabled': { color: DISABLED } },
      },
    },

    MuiSwitch: {
      styleOverrides: {
        root: { width: 46, height: 26, padding: 6 },
        switchBase: {
          padding: 7,
          '&.Mui-checked': {
            transform: 'translateX(20px)',
            color: WHITE,
            '& + .MuiSwitch-track': { backgroundColor: BLACK, opacity: 1 },
            '& .MuiSwitch-thumb': { backgroundColor: WHITE },
          },
        },
        thumb: {
          width: 12,
          height: 12,
          borderRadius: 1,
          backgroundColor: WHITE,
          border: `1px solid ${BLACK}`,
          boxShadow: 'none',
        },
        track: {
          borderRadius: 1,
          backgroundColor: WHITE,
          border: `1px solid ${BLACK}`,
          opacity: 1,
        },
      },
    },

    MuiSlider: {
      styleOverrides: {
        root: { color: BLACK, height: 6, padding: '13px 0' },
        rail: { backgroundColor: WHITE, opacity: 1, border: `1px solid ${BLACK}`, borderRadius: 0, height: 6 },
        track: { backgroundColor: BLACK, border: `1px solid ${BLACK}`, borderRadius: 0, height: 6 },
        thumb: {
          width: 14,
          height: 20,
          borderRadius: 2,
          backgroundColor: FACE,
          border: `1px solid ${BLACK}`,
          boxShadow: RAISED,
          '&:hover, &.Mui-focusVisible': { boxShadow: RAISED },
          '&:active': { boxShadow: PRESSED },
          '&::before': { display: 'none' },
        },
        valueLabel: {
          backgroundColor: BLACK,
          color: WHITE,
          borderRadius: 0,
          fontFamily: GENEVA,
          fontSize: 13,
        },
        mark: { backgroundColor: BLACK, height: 6 },
        markLabel: { fontFamily: GENEVA, fontSize: 12 },
      },
    },

    // ── Navigation: tabs as folder tabs ──────────────────────────────────────
    MuiTabs: {
      styleOverrides: {
        root: { minHeight: 0, borderBottom: `1px solid ${BLACK}` },
        indicator: { display: 'none' },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: CHICAGO,
          fontSize: 13,
          textTransform: 'none',
          minHeight: 0,
          padding: '5px 16px',
          marginRight: 3,
          color: BLACK,
          backgroundColor: FACE,
          border: `1px solid ${BLACK}`,
          borderBottom: 'none',
          borderTopLeftRadius: 7,
          borderTopRightRadius: 7,
          boxShadow: `inset 1px 1px 0 ${HIGHLIGHT}`,
          '&.Mui-selected': { color: BLACK, backgroundColor: WHITE, marginBottom: -1, zIndex: 1 },
        },
      },
    },

    // ── Overlays ─────────────────────────────────────────────────────────────
    MuiDialog: {
      styleOverrides: {
        paper: {
          border: `2px solid ${BLACK}`,
          borderRadius: 0,
          boxShadow: WINDOW_DROP,
          backgroundColor: WHITE,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontFamily: CHICAGO,
          fontSize: 13,
          textAlign: 'center',
          padding: '6px 12px',
          borderBottom: `1px solid ${BLACK}`,
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        // Dim the desktop behind a modal with a 50% dither rather than a soft tint.
        root: {
          backgroundColor: 'transparent',
          backgroundImage: `repeating-conic-gradient(rgba(0,0,0,0.55) 0% 25%, transparent 0% 50%)`,
          backgroundSize: '3px 3px',
        },
        invisible: { backgroundImage: 'none' },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: { borderRadius: 0, border: `1px solid ${BLACK}`, boxShadow: WINDOW_DROP },
        list: { paddingTop: 2, paddingBottom: 2 },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: GENEVA,
          fontSize: 15,
          // Classic Mac menu highlight: invert to black-on-white.
          '&:hover': { backgroundColor: BLACK, color: WHITE },
          '&.Mui-selected': { backgroundColor: BLACK, color: WHITE },
          '&.Mui-selected:hover': { backgroundColor: BLACK, color: WHITE },
        },
      },
    },
    MuiTooltip: {
      defaultProps: { arrow: true },
      styleOverrides: {
        // Balloon Help: white bubble, hard black outline.
        tooltip: {
          backgroundColor: WHITE,
          color: BLACK,
          border: `1px solid ${BLACK}`,
          borderRadius: 0,
          fontFamily: GENEVA,
          fontSize: 13,
          boxShadow: WINDOW_DROP,
          padding: '4px 8px',
        },
        arrow: { color: WHITE, '&::before': { border: `1px solid ${BLACK}`, borderRadius: 0 } },
      },
    },

    // ── Feedback ─────────────────────────────────────────────────────────────
    MuiAlert: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: `1px solid ${BLACK}`,
          backgroundColor: WHITE,
          color: BLACK,
          fontFamily: GENEVA,
          fontSize: 14,
          boxShadow: WINDOW_DROP,
        },
        icon: { color: BLACK },
        message: { color: BLACK },
        action: { color: BLACK },
      },
    },
    MuiAlertTitle: {
      styleOverrides: { root: { fontFamily: CHICAGO, fontSize: 13 } },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 16,
          borderRadius: 0,
          border: `1px solid ${BLACK}`,
          backgroundColor: WHITE,
        },
        bar: {
          // Barber-pole stripes — the classic "thermometer" progress fill.
          backgroundColor: BLACK,
          backgroundImage: `repeating-linear-gradient(-45deg, ${BLACK} 0 5px, ${SHADE} 5px 10px)`,
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: { root: { color: BLACK } },
    },

    // ── Data display ─────────────────────────────────────────────────────────
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: `1px solid ${BLACK}`,
          backgroundColor: FACE,
          color: BLACK,
          fontFamily: GENEVA,
          fontSize: 13,
          boxShadow: `inset 1px 1px 0 ${HIGHLIGHT}`,
          height: 24,
        },
        outlined: { backgroundColor: WHITE, boxShadow: 'none' },
        deleteIcon: { color: BLACK, '&:hover': { color: SHADE } },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          borderRadius: 0,
          border: `1px solid ${BLACK}`,
          backgroundColor: WHITE,
          color: BLACK,
          fontFamily: GENEVA,
          fontSize: 12,
          minWidth: 20,
          height: 20,
          padding: '0 4px',
        },
      },
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: BLACK } },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: BLACK, fontFamily: GENEVA, fontSize: 14, padding: '6px 10px' },
        head: { fontFamily: CHICAGO, fontSize: 13, fontWeight: 400, backgroundColor: FACE },
      },
    },
    MuiTableContainer: {
      styleOverrides: { root: { boxShadow: 'none' } },
    },
    MuiList: {
      styleOverrides: { root: { paddingTop: 0, paddingBottom: 0 } },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: BLACK,
            color: WHITE,
            '& .MuiListItemIcon-root': { color: WHITE },
            '&:hover': { backgroundColor: BLACK },
          },
          '&:hover': { backgroundColor: '#E0E0E0' },
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: { fontFamily: GENEVA, fontSize: 15 },
        secondary: { fontFamily: GENEVA, fontSize: 13 },
      },
    },
    MuiListItemIcon: {
      styleOverrides: { root: { color: BLACK, minWidth: 32 } },
    },

    // ── Accordion (disclosure) ───────────────────────────────────────────────
    MuiAccordion: {
      defaultProps: { disableGutters: true, elevation: 0, square: true },
      styleOverrides: {
        root: {
          border: `1px solid ${BLACK}`,
          '&:not(:last-child)': { borderBottom: 0 },
          '&::before': { display: 'none' },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          backgroundColor: FACE,
          fontFamily: CHICAGO,
          minHeight: 0,
          '&.Mui-expanded': { minHeight: 0, borderBottom: `1px solid ${BLACK}` },
        },
        content: { margin: '8px 0', '&.Mui-expanded': { margin: '8px 0' } },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: { root: { padding: 12, fontFamily: GENEVA } },
    },
  },
});

export const system76 = theme;
export default theme;
