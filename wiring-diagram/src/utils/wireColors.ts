import type { WireColor } from '../types';

export const WIRE_COLOR_MAP: Record<WireColor, string> = {
  black: '#1a1a1a',
  white: '#e8e8e8',
  red: '#dc2626',
  green: '#16a34a',
  blue: '#2563eb',
  yellow: '#eab308',
};

export const WIRE_COLOR_LABELS: Record<WireColor, string> = {
  black: 'Hot (Line)',
  white: 'Neutral',
  red: 'Traveler / 2nd Hot',
  green: 'Ground',
  blue: 'Traveler 2',
  yellow: 'Switched Hot',
};

export const ALL_WIRE_COLORS: WireColor[] = ['black', 'white', 'red', 'green', 'blue', 'yellow'];

/**
 * Given a circuit configuration, return what wire colors you'd expect
 * behind a given device plate.
 */
export function getExpectedWires(
  _deviceType: string,
  config: '2-way' | '3-way' | 'outlet' | 'light',
): { color: WireColor; purpose: string }[] {
  switch (config) {
    case 'outlet':
      return [
        { color: 'black', purpose: 'Hot (Line in)' },
        { color: 'white', purpose: 'Neutral' },
        { color: 'green', purpose: 'Ground' },
      ];
    case '2-way':
      return [
        { color: 'black', purpose: 'Hot (Line in)' },
        { color: 'black', purpose: 'Switched Hot (to light)' },
        { color: 'white', purpose: 'Neutral (pass-through)' },
        { color: 'green', purpose: 'Ground' },
      ];
    case '3-way':
      return [
        { color: 'black', purpose: 'Common terminal' },
        { color: 'red', purpose: 'Traveler 1' },
        { color: 'white', purpose: 'Traveler 2 (or neutral)' },
        { color: 'green', purpose: 'Ground' },
      ];
    case 'light':
      return [
        { color: 'black', purpose: 'Switched Hot (from switch)' },
        { color: 'white', purpose: 'Neutral' },
        { color: 'green', purpose: 'Ground' },
      ];
    default:
      return [];
  }
}
