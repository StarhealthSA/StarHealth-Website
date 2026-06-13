'use client';

function RemoveIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden>
      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
  );
}

export default function AdminImagePreview({
  src,
  alt = '',
  onRemove,
  removeLabel = 'Remove image',
  wrapperClassName = '',
  imageClassName = 'h-24 w-32 rounded-lg object-cover',
}) {
  if (!src) return null;

  return (
    <div className={`inline-flex flex-col gap-2 ${wrapperClassName}`}>
      <div className="relative inline-block">
        <img src={src} alt={alt} className={imageClassName} />
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={removeLabel}
            className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow-md transition-colors hover:bg-red-700"
          >
            <RemoveIcon />
          </button>
        )}
      </div>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="self-start text-xs font-medium text-red-600 hover:underline"
        >
          {removeLabel}
        </button>
      )}
    </div>
  );
}
