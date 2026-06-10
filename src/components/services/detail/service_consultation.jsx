'use client';

import Reveal from '@/components/reveal';
import { useTranslation } from 'react-i18next';

export default function ServiceConsultation({ onBookClick }) {
  const { t } = useTranslation();

  return (
    <section id="consultation" className="service-detail-section scroll-mt-32">
      <Reveal>
        <div className="doctor-consultation-band overflow-hidden rounded-[2rem]">
          <div className="px-6 py-10 md:px-10 md:py-12">
            <p className="font-inter text-xs font-semibold uppercase tracking-[0.2em] text-[#AED5C6]">
              {t('serviceDetail.readyToStart')}
            </p>
            <h2 className="doctor-display-title mt-3 text-2xl font-semibold text-white md:text-3xl">
              {t('serviceDetail.bookAppointment')}
            </h2>
            <p className="mt-4 max-w-2xl font-inter text-base leading-relaxed text-white/85">
              {t('serviceDetail.consultationNote')}
            </p>
            <button
              type="button"
              onClick={onBookClick}
              className="mt-8 rounded-xl bg-white px-6 py-3.5 font-inter text-sm font-semibold text-[#037B76] transition hover:bg-[#F3FAF8]"
            >
              {t('serviceDetail.bookNow')}
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
