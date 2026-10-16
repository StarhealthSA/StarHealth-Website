import i18n from 'i18next';
import { initReactI18next, setI18n } from 'react-i18next-original';
import enTranslations from './locales/en.json';
import arTranslations from './locales/ar.json';

const resources = {
  en: { translation: enTranslations },
  ar: { translation: arTranslations },
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    // Inline resources: sync init so SSR and client render the same translated text.
    initImmediate: false,
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false,
    },
  });
} else {
  // Keep locale JSON fresh after HMR.
  i18n.addResourceBundle('en', 'translation', enTranslations, true, true);
  i18n.addResourceBundle('ar', 'translation', arTranslations, true, true);
}

// Always re-bind: HMR can reset react-i18next's singleton while i18next stays initialized.
setI18n(i18n);

export default i18n;
