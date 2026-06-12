import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en.json';
import arTranslations from './locales/ar.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations
      },
      ar: {
        translation: arTranslations
      }
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    // Inline resources: sync init so SSR and client render the same translated text.
    initImmediate: false,
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;
