'use client';

import { Toaster } from 'sonner';

export default function AppToaster() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      expand
      visibleToasts={4}
      toastOptions={{
        duration: 4500,
        classNames: {
          toast: 'font-inter shadow-lg border border-[#d7e6e2]',
          title: 'font-medium',
          description: 'text-sm',
        },
      }}
    />
  );
}
