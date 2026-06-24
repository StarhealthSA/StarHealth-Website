'use client';

import Reveal from '../reveal';
import TestimonialsCarousel from '@/components/shared/testimonials-carousel';
import StarRating from '@/components/shared/star-rating';
import { useTranslation } from 'react-i18next';

const PATIENT_KEYS = [
  { commentKey: 'testimonials.patients.nadia.comment', nameKey: 'testimonials.patients.nadia.name' },
  { commentKey: 'testimonials.patients.subi.comment', nameKey: 'testimonials.patients.subi.name' },
  { commentKey: 'testimonials.patients.maria.comment', nameKey: 'testimonials.patients.maria.name' },
  { commentKey: 'testimonials.patients.rajesh.comment', nameKey: 'testimonials.patients.rajesh.name' },
  { commentKey: 'testimonials.patients.muntasr.comment', nameKey: 'testimonials.patients.muntasr.name' },
  { commentKey: 'testimonials.patients.amar.comment', nameKey: 'testimonials.patients.amar.name' },
];

function Testimonials() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const patients = PATIENT_KEYS.map((item) => ({
    name: t(item.nameKey),
    quote: t(item.commentKey),
  }));

  return (
    <section className="testimonials-section">
      <div className="testimonials-section__glow" aria-hidden />

      <div className="relative z-[1] mx-auto max-w-3xl px-6 text-center lg:px-8">
        <Reveal>
          <span className="testimonials-eyebrow">{t('testimonials.eyebrow')}</span>
          <h2 className="testimonials-title">{t('testimonials.title')}</h2>
          <p className="testimonials-lead">{t('testimonials.description')}</p>
          <div className="testimonials-rating-pill">
            <StarRating />
            <span>{t('testimonials.ratingLabel')}</span>
          </div>
        </Reveal>
      </div>

      <div className="relative z-[1] mt-10 lg:mt-12">
        <TestimonialsCarousel items={patients} isRTL={isRTL} />
      </div>
    </section>
  );
}

export default Testimonials;
