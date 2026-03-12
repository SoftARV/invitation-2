import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './en.json';
import es from './es.json';

i18n
  .use(LanguageDetector) // Auto-detect browser language
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
    fallbackLng: 'en',      // Fall back to English if language not found
    supportedLngs: ['en', 'es'],
    interpolation: {
      escapeValue: false,   // React already escapes values
    },
    detection: {
      order: ['navigator'], // Use browser navigator language setting
      caches: [],           // Don't cache - always re-detect
    },
  });

export default i18n;
