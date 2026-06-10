'use client';

import Link from 'next/link';
import Reveal, { staggerDelay } from '@/components/reveal';
import DoctorSectionHeader from '@/components/doctors/detail/doctor-section-header';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '@/lib/content/localized';
import { resolveServiceIcon } from '@/lib/content/service-icons';

function ServiceMiniCard({ item, lang, delay }) {
  const title = getLocalizedText(item.title, lang);
  const description = getLocalizedText(item.shortDescription || item.description, lang);
  const image = item.featuredImageUrl || item.imageUrl || resolveServiceIcon(item);

  return (
    <Reveal delay={delay}>
      <Link
        href={`/services/${item.slug}`}
        className="doctor-treatment-card block h-full transition hover:shadow-lg"
      >
        <img src={image} alt="" className="mb-4 h-12 w-12 rounded-lg object-cover" />
        <p className="font-inter text-sm font-semibold text-[#002333]">{title}</p>
        <p className="mt-2 line-clamp-2 font-inter text-xs text-[#586971]">{description}</p>
      </Link>
    </Reveal>
  );
}

export default function ServiceRelated({ similarServices = [], recommendedServices = [], lang }) {
  const { t } = useTranslation();

  if (!similarServices.length && !recommendedServices.length) return null;

  return (
    <section id="related" className="service-detail-section scroll-mt-32">
      {similarServices.length > 0 && (
        <>
          <Reveal>
            <DoctorSectionHeader
              eyebrow={t('serviceDetail.exploreMore')}
              title={t('serviceDetail.similarTreatments')}
              description={t('serviceDetail.similarLead')}
            />
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {similarServices.map((item, index) => (
              <ServiceMiniCard key={item.id} item={item} lang={lang} delay={staggerDelay(index)} />
            ))}
          </div>
        </>
      )}

      {recommendedServices.length > 0 && (
        <div className={similarServices.length ? 'mt-14' : ''}>
          <Reveal>
            <DoctorSectionHeader
              eyebrow={t('serviceDetail.recommended')}
              title={t('serviceDetail.recommendedServices')}
              description={t('serviceDetail.recommendedLead')}
            />
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommendedServices.map((item, index) => (
              <ServiceMiniCard key={item.id} item={item} lang={lang} delay={staggerDelay(index)} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
