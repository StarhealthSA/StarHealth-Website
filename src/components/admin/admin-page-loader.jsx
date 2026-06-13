export default function AdminPageLoader({
  label = 'Loading...',
  description = 'Please wait while we fetch your data.',
  variant = 'page',
  className = '',
}) {
  const spinner = (
    <span
      className="inline-block h-8 w-8 animate-spin rounded-full border-[3px] border-[#037B76] border-t-transparent"
      aria-hidden="true"
    />
  );

  if (variant === 'inline') {
    return (
      <div className={`flex items-center justify-center gap-3 py-8 text-[#586971] ${className}`} role="status" aria-live="polite">
        <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-[#037B76] border-t-transparent" aria-hidden="true" />
        <span className="text-sm">{label}</span>
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className={`flex flex-col items-center justify-center gap-2 py-10 ${className}`} role="status" aria-live="polite">
        {spinner}
        <p className="text-sm font-medium text-[#002f3b]">{label}</p>
        {description && <p className="text-xs text-[#586971]">{description}</p>}
      </div>
    );
  }

  return (
    <div
      className={`flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-[#d7e6e2] bg-white px-6 py-16 text-center ${className}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      {spinner}
      <p className="mt-4 text-base font-medium text-[#002f3b]">{label}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-[#586971]">{description}</p>}
    </div>
  );
}
