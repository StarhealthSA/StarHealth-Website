'use client';

import { useEffect, useState } from 'react';

function getScrollTop() {
  return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

function getViewportHeight() {
  return window.visualViewport?.height ?? document.documentElement.clientHeight ?? window.innerHeight;
}

export default function ScrollTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      setVisible(getScrollTop() >= getViewportHeight());
    };

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    document.addEventListener('scroll', updateVisibility, { passive: true });
    window.addEventListener('resize', updateVisibility);
    window.visualViewport?.addEventListener('resize', updateVisibility);

    return () => {
      window.removeEventListener('scroll', updateVisibility);
      document.removeEventListener('scroll', updateVisibility);
      window.removeEventListener('resize', updateVisibility);
      window.visualViewport?.removeEventListener('resize', updateVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`scroll-top-button${visible ? ' is-visible' : ''}`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path
          d="M12 5l-7 7M12 5l7 7M12 5v14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
