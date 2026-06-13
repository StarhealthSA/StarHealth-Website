export default function AdminUploadLoader({ show, label = 'Uploading...' }) {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex items-center gap-3 rounded-xl bg-white px-6 py-4 shadow-lg">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#037B76] border-t-transparent" />
        <span className="text-sm font-medium text-[#002f3b]">{label}</span>
      </div>
    </div>
  );
}
