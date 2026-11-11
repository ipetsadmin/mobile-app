import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemeNames, type ThemePreference } from '@/constants/theme';

const THEME_PREFERENCE_STORAGE_KEY = 'theme-preference';

const isThemeName = (value: string | null): value is Exclude<ThemePreference, 'system'> =>
  ThemeNames.some((name) => name === value);

export async function readStoredThemePreference() {
  const stored = await AsyncStorage.getItem(THEME_PREFERENCE_STORAGE_KEY);

  return isThemeName(stored) ? stored : undefined;
}

export async function readThemePreference(): Promise<ThemePreference> {
  return (await readStoredThemePreference()) ?? 'system';
}

export function saveThemePreference(preference: ThemePreference) {
  return AsyncStorage.setItem(THEME_PREFERENCE_STORAGE_KEY, preference);
}
