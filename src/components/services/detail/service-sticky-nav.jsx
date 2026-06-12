'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ServiceStickyNav({ sections = [] }) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [activeId, setActiveId] = useState(sections[0]?.id || '');

  useEffect(() => {
    if (!sections.length) return undefined;

    const observers = sections.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id);
        },
        { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
      );
      observer.observe(el);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, [sections]);

  if (!sections.length) return null;

  return (
    <nav
      className="service-sticky-nav sticky top-[106px] z-30 border-b border-[#E9E7E6]/80 bg-white/95 backdrop-blur-md"
      aria-label="Service sections"
    >
      <div className="service-detail-container py-3">
        <div
          className={`scrollbar-hide flex gap-2 overflow-x-auto ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          {sections.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`service-sticky-nav__pill whitespace-nowrap ${
                activeId === id ? 'service-sticky-nav__pill--active' : ''
              }`}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
