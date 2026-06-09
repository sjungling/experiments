import type { Theme } from '@mui/material/styles';
import system76 from './system76';
import wireframe from './wireframe';
import beos from './beos';
import aqua from './aqua';
import nextstep from './nextstep';
import excalidraw from './excalidraw';
import plan9 from './plan9';
import aero from './aero';

/** The available theme identities. Also doubles as the "chrome" style key. */
export type ThemeKey =
  | 'mac'
  | 'sketch'
  | 'beos'
  | 'aqua'
  | 'nextstep'
  | 'excalidraw'
  | 'plan9'
  | 'aero';

export interface ThemeEntry {
  label: string;
  theme: Theme;
}

export const THEMES: Record<ThemeKey, ThemeEntry> = {
  mac: { label: 'Classic Mac', theme: system76 },
  sketch: { label: 'Lo-Fi Sketch', theme: wireframe },
  beos: { label: 'BeOS / Haiku', theme: beos },
  aqua: { label: 'Mac OS X Aqua', theme: aqua },
  nextstep: { label: 'NeXTSTEP', theme: nextstep },
  excalidraw: { label: 'Excalidraw', theme: excalidraw },
  plan9: { label: 'Plan 9', theme: plan9 },
  aero: { label: 'Frutiger Aero', theme: aero },
};

export const THEME_KEYS = Object.keys(THEMES) as ThemeKey[];

export const DEFAULT_THEME: ThemeKey = 'mac';
