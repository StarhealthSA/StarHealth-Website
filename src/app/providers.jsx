'use client';

import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import AppToaster from '@/components/ui/app-toaster';

export default function Providers({ children }) {
  return (
    <I18nextProvider i18n={i18n}>
      {children}
      <AppToaster />
    </I18nextProvider>
  );
}
