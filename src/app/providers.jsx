'use client';

import '@/i18n';
import AppToaster from '@/components/ui/app-toaster';

export default function Providers({ children }) {
  return (
    <>
      {children}
      <AppToaster />
    </>
  );
}
