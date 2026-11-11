import AsyncStorage from '@react-native-async-storage/async-storage';

import type { AppLanguage } from './i18n';

const LANGUAGE_PREFERENCE_STORAGE_KEY = 'language-preference';

const isAppLanguage = (value: string | null): value is AppLanguage =>
  value === 'en' || value === 'es';

export async function readLanguagePreference() {
  const stored = await AsyncStorage.getItem(LANGUAGE_PREFERENCE_STORAGE_KEY);

  return isAppLanguage(stored) ? stored : undefined;
}

export function saveLanguagePreference(language: AppLanguage) {
  return AsyncStorage.setItem(LANGUAGE_PREFERENCE_STORAGE_KEY, language);
}
