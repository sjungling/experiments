# mui76 — retro Material UI themes + a live theme switcher

Two custom [Material UI](https://mui.com/material-ui/customization/theming/) themes that
restyle the same modern MUI components into wildly different aesthetics, plus a showcase
page with a dropdown that morphs the **entire interface** between them at runtime.

| Theme | Looks like |
| --- | --- |
| **Classic Mac** (`src/theme/system76.ts`) | Macintosh System 7.6 / HyperCard — dithered gray desktop, white windows with pinstriped title bars, beveled platinum controls that invert when pressed, monochrome alerts, barber-pole progress, pixel Chicago/Geneva type. |
| **Lo-Fi Sketch** (`src/theme/wireframe.ts`) | Moderne's "Neo" [wireframe prototyping kit](https://moderneinc.github.io/prototypes/Wireframes/wireframes.html) — hand-drawn Handlee type, wobbly asymmetric corners, light grayscale on dotted "prototype paper", muted sketch-marker semantic colors. |

## The themes

Each theme is a single standalone file that exports the result of `createTheme(...)`, so
you can drop either into any MUI app:

```tsx
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import system76 from './theme/system76'; // or: import wireframe from './theme/wireframe';

<ThemeProvider theme={system76}>
  <CssBaseline />
  {/* your app */}
</ThemeProvider>;
```

### Fonts

- **Classic Mac** fonts are **self-hosted** in `public/fonts/` and declared in
  `src/fonts.css`: smooth **Chicago** (`ChicagoFLF`) for UI chrome and **Geneva**
  (`FindersKeepers`) for body, from the MIT-licensed
  [`@sakun/system.css`](https://github.com/sakofchit/system.css) project. Swap the
  `CHICAGO` / `GENEVA` constants at the top of `system76.ts` to change the pairing.
- **Lo-Fi Sketch** uses **Handlee** (hand-drawn) + **Fira Code**, loaded from Google
  Fonts in `index.html` — the same fonts the reference kit uses.

## The theme switcher

The active theme is owned by `src/theme/ThemeController.tsx`, which holds the selection
in React state, persists it to `localStorage`, and provides the `ThemeProvider`. The
registry of available themes lives in `src/theme/registry.ts`.

- `src/components/ThemeSwitcher.tsx` — the `<Select>` dropdown (it restyles itself per theme).
- Switching is **live** — no reload — and the whole interface morphs, including the
  bespoke chrome: `src/components/Window.tsx` renders a pinstriped Mac window under
  *Classic Mac* and a wobbly sketch card (with window dots) under *Lo-Fi Sketch*, and
  the top bar swaps between a Mac menu bar and a wireframe navbar.

To add a third theme: create `src/theme/<name>.ts`, then add one entry to `THEMES` in
`registry.ts`.

## The showcase

`src/App.tsx` is a "Component Gallery" exercising the major MUI components under whichever
theme is active — buttons, inputs, selects, checkboxes/radios/switches, sliders, alerts,
progress, chips, badges, tooltips, tabs, accordions, tables, lists, dialogs, and menus.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
```
