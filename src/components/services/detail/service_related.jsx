'use client';

import Link from 'next/link';
import Reveal, { staggerDelay } from '@/components/reveal';
import ServiceSectionHeader from './service-section-header';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '@/lib/content/localized';
import { resolveServiceIcon } from '@/lib/content/service-icons';

function ServiceMiniCard({ item, lang, delay }) {
  const title = getLocalizedText(item.title, lang);
  const description = getLocalizedText(item.shortDescription || item.description, lang);
  const icon = resolveServiceIcon(item);

  return (
    <Reveal delay={delay}>
      <Link href={`/services/${item.slug}`} className="service-landing-related-card group block h-full">
        <div className="flex h-36 items-center justify-center overflow-hidden rounded-xl bg-[#F3FAF8] p-6">
          <img
            src={icon}
            alt=""
            className="h-16 w-16 object-contain transition duration-500 group-hover:scale-105"
          />
        </div>
        <p className="mt-4 font-inter text-sm font-semibold text-[#002333]">{title}</p>
        <p className="mt-1 line-clamp-2 font-inter text-xs leading-relaxed text-[#687276]">{description}</p>
      </Link>
    </Reveal>
  );
}

export default function ServiceRelated({ similarServices = [], recommendedServices = [], lang }) {
  const { t } = useTranslation();

  if (!similarServices.length && !recommendedServices.length) return null;

  return (
    <section id="related" className="service-landing-section">
      <div className="service-detail-container">
        {similarServices.length > 0 && (
          <>
            <Reveal>
              <ServiceSectionHeader
                label={t('serviceDetail.exploreMore')}
                title={t('serviceDetail.similarTreatments')}
                description={t('serviceDetail.similarLead')}
              />
            </Reveal>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {similarServices.map((item, index) => (
                <ServiceMiniCard key={item.id} item={item} lang={lang} delay={staggerDelay(index)} />
              ))}
            </div>
          </>
        )}

        {recommendedServices.length > 0 && (
          <div className={similarServices.length ? 'mt-14' : ''}>
            <Reveal>
              <ServiceSectionHeader
                label={t('serviceDetail.recommended')}
                title={t('serviceDetail.recommendedServices')}
                description={t('serviceDetail.recommendedLead')}
              />
            </Reveal>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {recommendedServices.map((item, index) => (
                <ServiceMiniCard key={item.id} item={item} lang={lang} delay={staggerDelay(index)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
