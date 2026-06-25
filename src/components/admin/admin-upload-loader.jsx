'use client';

import { useAdminUpload } from '@/contexts/admin-upload-context';

export default function AdminUploadLoader({
  show,
  label,
  variant = 'main',
}) {
  const { uploadLabel } = useAdminUpload();
  const message = label ?? uploadLabel;

  if (!show) return null;

  const overlayClass = variant === 'main'
    ? 'absolute inset-0 z-40 flex items-center justify-center bg-black/30'
    : 'fixed inset-0 z-50 flex items-center justify-center bg-black/30';

  return (
    <div
      className={overlayClass}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex items-center gap-3 rounded-xl border border-[#d7e6e2] bg-white px-6 py-4 shadow-lg">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#037B76] border-t-transparent" />
        <span className="text-sm font-medium text-[#002f3b]">{message}</span>
      </div>
    </div>
  );
}
