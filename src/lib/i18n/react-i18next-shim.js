'use client';

// App-wide shim: register the shared i18n instance before any hook runs.
// Prevents raw translation keys when client chunks resolve separate react-i18next copies.
import '@/i18n';

export {
  I18nContext,
  I18nextProvider,
  Trans,
  Translation,
  useTranslation,
  withTranslation,
  useSSR,
  withSSR,
  initReactI18next,
  setI18n,
  getI18n,
  setDefaults,
  getDefaults,
  composeInitialProps,
  getInitialProps,
} from 'react-i18next-original';
