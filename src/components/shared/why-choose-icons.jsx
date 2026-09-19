export function ClientsIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M16.5 14.5a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"
        stroke="currentColor"
        strokeWidth="2.1"
      />
      <path
        d="M31.5 16a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4Z"
        stroke="currentColor"
        strokeWidth="2.1"
      />
      <path
        d="M6.8 35.8c1.2-6.6 5.5-9.9 9.7-9.9 4.3 0 8.5 3.3 9.7 9.9"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <path
        d="M27.2 27.8c2.5-1.7 5.5-2 8.2-.7 3.1 1.4 5.1 4.5 5.8 8.7"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <path
        d="M24 22.5c2.2 0 4 1.5 4 3.8v1.2"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}

export function SatisfactionIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M24.1 38.2s-11.8-7.2-14.6-14.1C7.1 18.7 9.8 13 15.2 12.2c3-.5 5.7 1 7.1 3.2 1.1-2.1 3.6-3.6 6.5-3.3 5.3.6 8.3 6.2 5.9 11.6-2.5 5.7-10.6 14.5-10.6 14.5Z"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinejoin="round"
      />
      <path
        d="M24 18.8l1.15 2.95 3.15.12-2.5 1.95.9 3-2.7-1.7-2.7 1.7.9-3-2.5-1.95 3.15-.12L24 18.8Z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  );
}

export function getCounterFallbackIcon(counterId = '', suffix = '') {
  if (counterId === 'satisfaction' || suffix === '%') return SatisfactionIcon;
  return ClientsIcon;
}
