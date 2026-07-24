'use client';

import Link from 'next/link';
import Reveal, { staggerDelay } from '@/components/reveal';
import ServiceSectionHeader from './service-section-header';
import { useTranslation } from 'react-i18next';
import { getLocalizedText, formatSarPrice } from '@/lib/content/localized';
import { SERVICE_ICONS } from '@/lib/content/service-icons';

function SpecializationCard({ item, lang, delay, viewLabel }) {
  const title = getLocalizedText(item.name, lang);
  const description = getLocalizedText(item.shortDescription, lang);
  const price = formatSarPrice(item.priceAmount);
  const image = item.featuredImageUrl || (item.iconKey && SERVICE_ICONS[item.iconKey]) || '';

  return (
    <Reveal delay={delay}>
      <Link
        href={`/specializations/${item.slug}`}
        className="service-landing-related-card group block h-full min-w-[260px]"
      >
        <div className="relative h-40 overflow-hidden rounded-xl bg-[#F3FAF8]">
          {image ? (
            <img
              src={image}
              alt=""
              loading="lazy"
              className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${item.featuredImageUrl ? '' : 'object-contain p-8'}`}
            />
          ) : (
            <div className="flex h-full items-center justify-center font-inter text-sm text-[#037B76]">
              {title}
            </div>
          )}
        </div>
        <p className="mt-4 font-inter text-sm font-semibold text-[#002333]">{title}</p>
        {description && (
          <p className="mt-1 line-clamp-2 font-inter text-xs leading-relaxed text-[#687276]">{description}</p>
        )}
        {price && (
          <p className="mt-2 font-inter text-sm font-semibold text-[#037B76]">{price}</p>
        )}
        <span className="mt-3 inline-flex items-center gap-1 font-inter text-xs font-semibold text-[#037B76] opacity-0 transition group-hover:opacity-100">
          {viewLabel} →
        </span>
      </Link>
    </Reveal>
  );
}

export default function ServiceSpecializations({ items = [], lang }) {
  const { t } = useTranslation();

  if (!items.length) return null;

  return (
    <section id="specializations" className="service-landing-section service-landing-section--muted">
      <div className="service-detail-container">
        <Reveal>
          <ServiceSectionHeader
            label={t('serviceDetail.specializationsLabel')}
            title={t('serviceDetail.specializationsTitle')}
            description={t('serviceDetail.specializationsLead')}
          />
        </Reveal>
        <div className="scrollbar-hide mt-8 flex gap-5 overflow-x-auto pb-2 lg:grid lg:grid-cols-3 lg:overflow-visible">
          {items.map((item, index) => (
            <SpecializationCard
              key={item.id}
              item={item}
              lang={lang}
              delay={staggerDelay(index)}
              viewLabel={t('serviceDetail.viewSpecialization')}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
