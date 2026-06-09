# mui76 — a Mac System 7.6 / HyperCard Material UI theme

A custom [Material UI](https://mui.com/material-ui/customization/theming/) theme that
dresses modern MUI components up as classic Macintosh **System 7.6** and **HyperCard**:
a dithered gray desktop, white windows with pinstriped title bars, beveled platinum
controls that invert when pressed, monochrome alerts, barber-pole progress bars, and
pixel typefaces.

## The theme

The entire look lives in one standalone file:

```
src/theme/system76.ts
```

It exports the result of `createTheme(...)`, so you can drop it into any MUI app:

```tsx
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import system76 from './theme/system76';

<ThemeProvider theme={system76}>
  <CssBaseline />
  {/* your app */}
</ThemeProvider>;
```

> Fonts are **self-hosted** in `public/fonts/` and declared in `src/fonts.css`:
> the smooth **Chicago** (`ChicagoFLF`) for UI chrome and **Geneva**
> (`FindersKeepers`) for body text — the authentic System 7 pairing, plus
> `Monaco` and a crunchier pixel `ChicagoPixel` (`ChiKareGo2`) if you want them.
> They come from the MIT-licensed [`@sakun/system.css`](https://github.com/sakofchit/system.css)
> project. Swap the `CHICAGO` / `GENEVA` constants at the top of `system76.ts` to
> change the pairing.

## The showcase

`src/App.tsx` is a sample "Component Gallery" that exercises the major MUI components
under the theme — buttons, inputs, selects, checkboxes/radios/switches, sliders,
alerts, progress, chips, badges, tooltips, tabs, accordions, tables, lists, dialogs,
and menus — laid out as a desktop full of classic Mac windows.

`src/components/Window.tsx` is a small reusable component that draws the pinstriped
title bar + close box used by each window.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
```
