'use client';

import { useTranslation } from 'react-i18next';

function SearchIcon({ className = '' }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
      />
    </svg>
  );
}

export default function SearchInput({
  value,
  onChange,
  placeholder,
  className = '',
}) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className={`relative ${className}`}>
      <SearchIcon
        className={`pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 text-[#687276] ${
          isRTL ? 'right-4' : 'left-4'
        }`}
      />
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-lg border border-[#DAD8D7] py-3 font-inter text-[14px] text-[#687276] focus:border-[#037B76] focus:outline-none ${
          isRTL ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4 text-left'
        }`}
      />
    </div>
  );
}
