import { MenuItem, Select } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useThemeController } from '../theme/ThemeController';
import { THEMES, THEME_KEYS, type ThemeKey } from '../theme/registry';

/** A compact dropdown that swaps the active theme. Styles itself per theme. */
export default function ThemeSwitcher() {
  const { themeKey, setThemeKey } = useThemeController();
  const handleChange = (event: SelectChangeEvent) => setThemeKey(event.target.value as ThemeKey);

  return (
    <Select
      value={themeKey}
      onChange={handleChange}
      size="small"
      inputProps={{ 'aria-label': 'Select theme' }}
      sx={{ minWidth: 140 }}
    >
      {THEME_KEYS.map((key) => (
        <MenuItem key={key} value={key}>
          {THEMES[key].label}
        </MenuItem>
      ))}
    </Select>
  );
}
