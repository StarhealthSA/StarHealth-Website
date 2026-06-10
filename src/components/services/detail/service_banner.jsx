'use client';

import Link from 'next/link';
import Reveal from '@/components/reveal';
import { useTranslation } from 'react-i18next';

export default function ServiceBanner({ service, onBookClick }) {
  const { t } = useTranslation();
  const bannerImage = service.featuredImageUrl || service.imageUrl || service.icon;

  return (
    <section className="service-hero relative overflow-hidden">
      {bannerImage && (
        <img
          src={bannerImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden
        />
      )}
      <div className="service-hero-overlay absolute inset-0" aria-hidden />
      <div className="doctor-hero-bg absolute inset-0 opacity-90" aria-hidden />

      <div className="service-detail-container relative z-10 py-10 md:py-14 lg:py-20">
        <Reveal>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 font-inter text-sm font-medium text-white/80 transition hover:text-white"
          >
            <span aria-hidden>←</span>
            {t('serviceDetail.backToServices')}
          </Link>
        </Reveal>

        <div className="mt-8 max-w-3xl">
          <Reveal delay={80}>
            {service.displayCategory && (
              <span className="inline-block rounded-full bg-white/15 px-3 py-1 font-inter text-xs font-semibold uppercase tracking-wider text-[#AED5C6]">
                {service.displayCategory}
              </span>
            )}
            <h1 className="doctor-display-title mt-4 text-4xl font-semibold leading-tight text-white md:text-5xl">
              {service.displayTitle}
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="mt-5 font-inter text-lg leading-relaxed text-white/90 md:text-xl">
              {service.displayShortDescription}
            </p>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onBookClick}
                className="doctor-cta-button rounded-xl px-6 py-3.5 font-inter text-sm font-semibold text-white"
              >
                {t('serviceDetail.bookAppointment')}
              </button>
              <a
                href="#about"
                className="rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 font-inter text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                {t('serviceDetail.exploreService')}
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
