'use client';

import Reveal from '@/components/reveal';
import { useTranslation } from 'react-i18next';

export default function ServiceConsultation({ service, onBookClick }) {
  const { t } = useTranslation();

  return (
    <section id="book" className="service-landing-section pb-20 md:pb-24">
      <div className="service-detail-container">
        <Reveal>
          <div className="service-landing-final-cta">
            <div className="service-landing-final-cta-content">
              <p className="font-inter text-xs font-semibold uppercase tracking-[0.2em] text-[#037B76]">
                {t('serviceDetail.readyToStart')}
              </p>
              <h2 className="service-display-title mt-3 text-2xl font-semibold text-[#002333] md:text-4xl">
                {service.displayTitle}
              </h2>
              <p className="mt-4 max-w-xl font-inter text-base leading-relaxed text-[#586971]">
                {t('serviceDetail.consultationNote')}
              </p>
              <button
                type="button"
                onClick={onBookClick}
                className="service-landing-cta-primary mt-8"
              >
                {t('serviceDetail.bookNow')}
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
