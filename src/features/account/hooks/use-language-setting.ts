import { useTranslation } from 'react-i18next';

import type { AppLanguage } from '@/lib/i18n';
import { saveLanguagePreference } from '@/lib/language-storage';

export function useLanguageSetting() {
  const { i18n } = useTranslation();
  const language: AppLanguage = i18n.language.startsWith('es') ? 'es' : 'en';

  const setLanguage = (next: AppLanguage) => {
    i18n.changeLanguage(next);
    saveLanguagePreference(next).catch(() => {});
  };

  return { language, setLanguage };
}
