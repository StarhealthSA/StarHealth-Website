'use client';

import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import AppToaster from '@/components/ui/app-toaster';

function syncDocumentLanguage(language) {
  const lang = language?.startsWith('ar') ? 'ar' : 'en';
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
}

export default function Providers({ children }) {
  useEffect(() => {
    syncDocumentLanguage(i18n.language);
    const onLanguageChanged = (language) => syncDocumentLanguage(language);
    i18n.on('languageChanged', onLanguageChanged);
    return () => i18n.off('languageChanged', onLanguageChanged);
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      {children}
      <AppToaster />
    </I18nextProvider>
  );
}
