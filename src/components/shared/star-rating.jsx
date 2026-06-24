export default function StarRating({ count = 5, className = '' }) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`} aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, index) => (
        <svg
          key={index}
          viewBox="0 0 20 20"
          className="h-4 w-4 shrink-0 text-[#f4b400]"
          fill="currentColor"
          aria-hidden
        >
          <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.77l-4.94 2.6.94-5.5-4-3.9 5.53-.8L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}
