import { getLocales } from 'expo-localization';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import es from './locales/es.json';

const resources = {
  en: { translation: en },
  es: { translation: es },
};

export type AppLanguage = keyof typeof resources;

const fallbackLanguage: AppLanguage = 'en';
const deviceLanguage = getLocales()[0]?.languageCode ?? fallbackLanguage;

const i18n = createInstance();

i18n.use(initReactI18next).init({
  resources,
  lng: deviceLanguage in resources ? deviceLanguage : fallbackLanguage,
  fallbackLng: fallbackLanguage,
  interpolation: { escapeValue: false },
});

export { i18n };
