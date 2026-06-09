import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { DEFAULT_THEME, THEMES, type ThemeKey } from './registry';

interface ThemeControllerValue {
  themeKey: ThemeKey;
  setThemeKey: (key: ThemeKey) => void;
}

const ThemeControllerContext = createContext<ThemeControllerValue | null>(null);

/** Read/write the active theme key, also driving the per-theme "chrome". */
export function useThemeController(): ThemeControllerValue {
  const ctx = useContext(ThemeControllerContext);
  if (!ctx) {
    throw new Error('useThemeController must be used within <ThemeController>');
  }
  return ctx;
}

const STORAGE_KEY = 'mui76.theme';

function readInitialKey(): ThemeKey {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved in THEMES) return saved as ThemeKey;
  } catch {
    // localStorage unavailable (private mode, SSR) — fall through to default.
  }
  return DEFAULT_THEME;
}

/**
 * Owns the active theme selection, persists it, and provides both the MUI
 * ThemeProvider and a small context so the showcase can swap its chrome.
 */
export function ThemeController({ children }: { children: ReactNode }) {
  const [themeKey, setThemeKey] = useState<ThemeKey>(readInitialKey);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, themeKey);
    } catch {
      // Ignore persistence failures.
    }
  }, [themeKey]);

  const value = useMemo(() => ({ themeKey, setThemeKey }), [themeKey]);

  return (
    <ThemeControllerContext.Provider value={value}>
      <ThemeProvider theme={THEMES[themeKey].theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeControllerContext.Provider>
  );
}

export default ThemeController;
