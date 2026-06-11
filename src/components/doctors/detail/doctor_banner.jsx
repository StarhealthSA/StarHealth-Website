'use client';

import Link from 'next/link';
import Reveal from '@/components/reveal';
import { useTranslation } from 'react-i18next';

export default function DoctorBanner({ doctor, onBookClick }) {
  const { t } = useTranslation();

  return (
    <section className="doctor-hero relative overflow-hidden">
      <div className="doctor-hero-bg absolute inset-0" aria-hidden />
      <div className="doctor-hero-pattern absolute inset-0 opacity-40" aria-hidden />

      <div className="doctor-detail-container relative z-10 py-10 md:py-14 lg:py-20">
        <Reveal>
          <Link
            href="/doctors"
            className="inline-flex items-center gap-2 font-inter text-sm font-medium text-white/80 transition hover:text-white"
          >
            <span aria-hidden>←</span>
            {t('doctorDetail.backToDoctors')}
          </Link>
        </Reveal>

        <div className="mt-8 grid items-center gap-10 lg:grid-cols-[minmax(280px,360px)_1fr] lg:gap-14">
          <Reveal delay={80} className="mx-auto w-full max-w-[360px] lg:mx-0">
            <div className="doctor-hero-portrait relative">
              <div className="doctor-hero-portrait-glow absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-[#AED5C6]/50 to-transparent blur-xl" />
              <img
                src={doctor.image}
                alt={doctor.displayName}
                className="relative z-10 aspect-[4/5] w-full rounded-[1.75rem] object-cover shadow-2xl shadow-[#002333]/30 ring-1 ring-white/30"
              />
              {doctor.featured && (
                <span className="absolute left-4 top-4 z-20 rounded-full bg-white/95 px-3 py-1 font-inter text-xs font-semibold text-[#037B76] shadow-sm">
                  {t('doctorDetail.featured')}
                </span>
              )}
            </div>
          </Reveal>

          <div className="text-center lg:text-start">
            <Reveal delay={120}>
              <p className="font-inter text-xs font-semibold uppercase tracking-[0.24em] text-[#AED5C6]">
                {t('doctorDetail.meetYourDoctor')}
              </p>
              <h1 className="doctor-display-title mt-3 text-4xl font-semibold leading-tight text-white md:text-5xl lg:text-[3.25rem]">
                {doctor.displayName}
              </h1>
            </Reveal>

            <Reveal delay={180}>
              {doctor.displayQualification && (
                <p className="mt-4 font-inter text-lg text-white/95 md:text-xl">{doctor.displayQualification}</p>
              )}
              {doctor.displayDesignation && (
                <p className="mt-2 font-inter text-base text-white/75">{doctor.displayDesignation}</p>
              )}
            </Reveal>

            <Reveal delay={220}>
              <div className="mt-6 flex flex-wrap justify-center gap-2 lg:justify-start">
                {doctor.displaySpecialization && (
                  <span className="doctor-hero-chip">{doctor.displaySpecialization}</span>
                )}
                {doctor.displaySubSpecialization && (
                  <span className="doctor-hero-chip">{doctor.displaySubSpecialization}</span>
                )}
                {doctor.experienceYears && (
                  <span className="doctor-hero-chip">
                    {doctor.experienceYears} {t('doctorDetail.yearsExperience')}
                  </span>
                )}
                {doctor.onlineConsultationAvailable && (
                  <span className="doctor-hero-chip">{t('doctorDetail.onlineAvailable')}</span>
                )}
              </div>
            </Reveal>

            {doctor.displayShortIntro && (
              <Reveal delay={260}>
                <p className="mx-auto mt-8 max-w-2xl font-inter text-base leading-relaxed text-white/85 lg:mx-0 lg:text-lg">
                  {doctor.displayShortIntro}
                </p>
              </Reveal>
            )}

            <Reveal delay={300} className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              <button
                type="button"
                onClick={onBookClick}
                className="doctor-cta-button rounded-xl px-8 py-3.5 font-inter text-sm font-semibold text-white shadow-lg shadow-[#002333]/20"
              >
                {t('doctorDetail.bookNow')}
              </button>
              <a
                href="#about"
                className="rounded-xl border border-white/30 bg-white/10 px-8 py-3.5 font-inter text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                {t('doctorDetail.exploreProfile')}
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
