'use client';

import { useEffect, useState } from 'react';

export default function ServiceStickyNav({ sections = [] }) {
  const [activeId, setActiveId] = useState(sections[0]?.id || '');

  useEffect(() => {
    if (!sections.length) return undefined;

    const observers = sections.map(({ id }) => {
      const element = document.getElementById(id);
      if (!element) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id);
        },
        { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
      );

      observer.observe(element);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, [sections]);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (!element) return;
    const offset = 120;
    const top = element.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  if (sections.length < 2) return null;

  return (
    <nav
      aria-label="Service page sections"
      className="service-sticky-nav sticky top-[72px] z-30 border-b border-[#E9E7E6]/80 bg-white/90 backdrop-blur-md"
    >
      <div className="service-detail-container">
        <div className="scrollbar-hide flex gap-2 overflow-x-auto py-3">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => scrollTo(section.id)}
              className={`shrink-0 rounded-full px-4 py-2 font-inter text-sm font-medium transition-all ${
                activeId === section.id
                  ? 'bg-[#037B76] text-white shadow-md shadow-[#037B76]/20'
                  : 'text-[#586971] hover:bg-[#f0f6f4] hover:text-[#002333]'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
