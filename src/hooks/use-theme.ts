import { use } from 'react';

import { ThemeContext } from '@/providers/theme-provider';
import { Themes } from '@/constants/theme';

export function useTheme() {
  return Themes[use(ThemeContext).themeName];
}

export function useThemePreference() {
  return use(ThemeContext);
}
