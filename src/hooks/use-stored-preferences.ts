import { useEffect, useState } from 'react';

import type { ThemePreference } from '@/constants/theme';
import { i18n } from '@/lib/i18n';
import { readLanguagePreference } from '@/lib/language-storage';
import { readThemePreference } from '@/lib/theme-storage';

export function useStoredPreferences() {
  const [themePreference, setThemePreference] = useState<ThemePreference>();

  useEffect(() => {
    Promise.all([readThemePreference(), readLanguagePreference()])
      .then(async ([theme, language]) => {
        if (language) await i18n.changeLanguage(language);

        setThemePreference(theme);
      })
      .catch(() => setThemePreference('system'));
  }, []);

  return { themePreference, isLoaded: themePreference !== undefined };
}
