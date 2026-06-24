'use client';

import Reveal from '@/components/reveal';
import TestimonialsCarousel from '@/components/shared/testimonials-carousel';
import ServiceSectionHeader from './service-section-header';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '@/lib/content/localized';

const GLOBAL_PATIENT_KEYS = [
  { commentKey: 'testimonials.patients.nadia.comment', nameKey: 'testimonials.patients.nadia.name' },
  { commentKey: 'testimonials.patients.subi.comment', nameKey: 'testimonials.patients.subi.name' },
  { commentKey: 'testimonials.patients.maria.comment', nameKey: 'testimonials.patients.maria.name' },
  { commentKey: 'testimonials.patients.rajesh.comment', nameKey: 'testimonials.patients.rajesh.name' },
  { commentKey: 'testimonials.patients.muntasr.comment', nameKey: 'testimonials.patients.muntasr.name' },
  { commentKey: 'testimonials.patients.amar.comment', nameKey: 'testimonials.patients.amar.name' },
];

export default function ServiceTestimonials({ marketing, lang }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const custom = (marketing?.testimonials || [])
    .filter((item) => getLocalizedText(item.quote, lang) && getLocalizedText(item.name, lang))
    .map((item) => ({
      quote: getLocalizedText(item.quote, lang),
      name: getLocalizedText(item.name, lang),
    }));

  const useGlobal = custom.length === 0 && marketing?.showGlobalTestimonials !== false;

  const items = custom.length
    ? custom
    : useGlobal
      ? GLOBAL_PATIENT_KEYS.map((patient) => ({
          quote: t(patient.commentKey),
          name: t(patient.nameKey),
        }))
      : [];

  if (!items.length) return null;

  return (
    <section id="testimonials" className="testimonials-section testimonials-section--compact">
      <div className="testimonials-section__glow" aria-hidden />

      <div className="service-detail-container relative z-[1]">
        <Reveal>
          <ServiceSectionHeader
            label={t('serviceDetail.patientStories')}
            title={t('serviceDetail.testimonialsTitle')}
            description={t('serviceDetail.testimonialsLead')}
            align="center"
            className="max-w-2xl"
          />
        </Reveal>
      </div>

      <div className="relative z-[1] mt-8">
        <TestimonialsCarousel items={items} isRTL={isRTL} />
      </div>
    </section>
  );
}
