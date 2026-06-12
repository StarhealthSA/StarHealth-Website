'use client';

import { useEffect, useRef, useState } from 'react';
import Reveal, { staggerDelay } from '@/components/reveal';
import { useCountUp } from '@/hooks/use-count-up';
import { getLocalizedText } from '@/lib/content/localized';

function StatItem({ stat, lang, delay }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const value = getLocalizedText(stat.value, lang);
  const label = getLocalizedText(stat.label, lang);
  const displayValue = useCountUp(value, { enabled: inView });

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!value && !label) return null;

  return (
    <Reveal delay={delay}>
      <div ref={ref} className="service-stats-strip__item text-center">
        <p className="service-stats-strip__value">{displayValue}</p>
        <p className="service-stats-strip__label">{label}</p>
      </div>
    </Reveal>
  );
}

export default function ServiceStatsStrip({ stats = [], lang }) {
  const items = (stats || []).filter(
    (stat) => getLocalizedText(stat.value, lang) || getLocalizedText(stat.label, lang)
  );

  if (!items.length) return null;

  return (
    <section className="service-stats-strip" aria-label="Service statistics">
      <div className="service-detail-container">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((stat, index) => (
            <StatItem key={index} stat={stat} lang={lang} delay={staggerDelay(index)} />
          ))}
        </div>
      </div>
    </section>
  );
}
