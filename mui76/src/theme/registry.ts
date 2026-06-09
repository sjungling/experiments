import type { Theme } from '@mui/material/styles';
import system76 from './system76';
import wireframe from './wireframe';

/** The available theme identities. Also doubles as the "chrome" style key. */
export type ThemeKey = 'mac' | 'sketch';

export interface ThemeEntry {
  label: string;
  theme: Theme;
}

export const THEMES: Record<ThemeKey, ThemeEntry> = {
  mac: { label: 'Classic Mac', theme: system76 },
  sketch: { label: 'Lo-Fi Sketch', theme: wireframe },
};

export const THEME_KEYS = Object.keys(THEMES) as ThemeKey[];

export const DEFAULT_THEME: ThemeKey = 'mac';
