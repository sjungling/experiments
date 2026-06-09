# mui76 — retro Material UI themes + a live theme switcher

Six custom [Material UI](https://mui.com/material-ui/customization/theming/) themes that
restyle the same modern MUI components into wildly different aesthetics, plus a showcase
page with a dropdown that morphs the **entire interface** between them at runtime.

| Theme | Looks like |
| --- | --- |
| **Classic Mac** (`src/theme/system76.ts`) | Macintosh System 7.6 / HyperCard — dithered desktop, pinstriped window title bars, beveled platinum controls that invert when pressed, monochrome alerts, barber-pole progress, pixel Chicago/Geneva type. |
| **Lo-Fi Sketch** (`src/theme/wireframe.ts`) | Moderne's "Neo" [wireframe kit](https://moderneinc.github.io/prototypes/Wireframes/wireframes.html) — Handlee type, wobbly asymmetric corners, dotted "prototype paper", muted sketch-marker semantics. |
| **BeOS / Haiku** (`src/theme/beos.ts`) | Yellow window tabs, gray beveled panels on a steel-blue desktop, Noto Sans, bright-blue selection highlights. |
| **Mac OS X Aqua** (`src/theme/aqua.ts`) | Glossy gel buttons, red/yellow/green traffic lights, pinstriped title bars, blue focus glow, Lucida Grande — on a deep-blue Aqua desktop. |
| **NeXTSTEP** (`src/theme/nextstep.ts`) | Austere mid-gray panels on a dark workspace, chunky 2px chiseled bevels, Helvetica, recessed white wells, dark selection. |
| **Excalidraw** (`src/theme/excalidraw.ts`) | Hand-drawn Virgil type on a dot-grid canvas, genuinely **rough** wavy borders (an SVG displacement filter), the Excalidraw-violet accent + marker palette. |

## The themes

Each theme is a single standalone file that exports the result of `createTheme(...)`, so
you can drop any of them into any MUI app:

```tsx
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import system76 from './theme/system76'; // or wireframe / beos / aqua / nextstep / excalidraw

<ThemeProvider theme={system76}>
  <CssBaseline />
  {/* your app */}
</ThemeProvider>;
```

> The **Excalidraw** theme references `filter: url(#excalidraw-rough)` for its rough
> borders, so it needs `<RoughFilterDefs/>` (the shared SVG filter) mounted in the tree —
> `App.tsx` always renders it.

### Fonts

- **Classic Mac** — **self-hosted** smooth **Chicago** (`ChicagoFLF`) + **Geneva**
  (`FindersKeepers`) in `public/fonts/`, from MIT-licensed
  [`@sakun/system.css`](https://github.com/sakofchit/system.css).
- **Excalidraw** — **self-hosted** **Virgil**, Excalidraw's hand-drawn font.
- **Lo-Fi Sketch** (Handlee), **BeOS** (Noto Sans) — loaded from Google Fonts in `index.html`.
- **Aqua** (Lucida Grande) and **NeXTSTEP** (Helvetica) use fonts already on the system.

Self-hosted faces are declared in `src/fonts.css`.

## The theme switcher

The active theme is owned by `src/theme/ThemeController.tsx`, which holds the selection
in React state, persists it to `localStorage`, and provides the `ThemeProvider`. The
registry of available themes lives in `src/theme/registry.ts`.

- `src/components/ThemeSwitcher.tsx` — the `<Select>` dropdown (it restyles itself per theme).
- Switching is **live** — no reload — and the whole interface morphs, including the
  bespoke chrome: `src/components/Window.tsx` renders a different window per theme
  (Mac pinstripe, sketch card, BeOS yellow tab, Aqua traffic-lights, NeXT chisel,
  Excalidraw frame), and the top bar swaps between each OS's menu/navbar.

To add a theme: create `src/theme/<name>.ts`, then add one entry to `THEMES` in
`registry.ts` (and, if you want bespoke window chrome, a branch in `Window.tsx` / the
top bar). The `ThemeKey` union keeps everything type-checked.

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
