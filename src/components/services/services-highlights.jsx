'use client';

import Reveal from '@/components/reveal';
import { useCountUp } from '@/hooks/use-count-up';
import { staggerDelay } from '@/lib/stagger_delay';
import { useTranslation } from 'react-i18next';

const HIGHLIGHTS = [
  { key: 'h1', value: '8+' },
  { key: 'h2', value: '20 min' },
  { key: 'h3', value: '48 hrs' },
  { key: 'h4', value: '100%' },
];

function HighlightStat({ item, index }) {
  const displayValue = useCountUp(item.value, { duration: 1400 });

  return (
    <Reveal delay={staggerDelay(index)} className="h-full">
      <article className="flex h-full flex-col rounded-2xl border border-[#d7e6e2] bg-white p-6">
        <p className="text-[13px] font-semibold tracking-[0.09em] uppercase text-[#5d737b]">{item.label}</p>
        <p className="mt-auto pt-2 text-[34px] font-semibold leading-[40px] text-[#002f3b]">{displayValue}</p>
      </article>
    </Reveal>
  );
}

export default function ServicesHighlights() {
  const { t } = useTranslation();
  const highlights = HIGHLIGHTS.map((item) => ({
    key: item.key,
    value: item.value,
    label: t(`servicesPage.highlights.${item.key}`),
  }));

  return (
    <section className="px-[20px] md:px-[30px] lg:px-[120px] py-14 lg:py-20">
      <div className="grid gap-4 sm:grid-cols-2 sm:items-stretch lg:grid-cols-4">
        {highlights.map((item, index) => (
          <HighlightStat key={item.key} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}
