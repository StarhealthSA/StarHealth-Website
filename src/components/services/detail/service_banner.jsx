'use client';

import Link from 'next/link';
import Reveal from '@/components/reveal';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '@/lib/content/localized';

export default function ServiceBanner({ service, onBookClick, lang }) {
  const { t } = useTranslation();
  const bannerImage = service.featuredImageUrl || service.imageUrl || service.icon;
  const duration = getLocalizedText(service.treatmentDuration, lang);

  return (
    <section className="service-landing-hero border-b border-[#E9E7E6]/80 bg-white">
      <div className="service-detail-container py-8 md:py-12 lg:py-16">
        <Reveal>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 font-inter text-sm font-medium text-[#687276] transition hover:text-[#037B76]"
          >
            <span aria-hidden>←</span>
            {t('serviceDetail.backToServices')}
          </Link>
        </Reveal>

        <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <Reveal delay={60}>
              {service.displayCategory && (
                <span className="service-landing-pill">
                  {service.displayCategory}
                </span>
              )}
              <h1 className="service-display-title mt-5 text-[2rem] font-semibold leading-[1.15] text-[#002333] md:text-5xl lg:text-[3.25rem]">
                {service.displayTitle}
              </h1>
            </Reveal>

            <Reveal delay={120}>
              <p className="mt-5 max-w-xl font-inter text-lg leading-relaxed text-[#586971]">
                {service.displayShortDescription}
              </p>
            </Reveal>

            <Reveal delay={180}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={onBookClick}
                  className="service-landing-cta-primary"
                >
                  {t('serviceDetail.bookAppointment')}
                </button>
                <a href="#overview" className="service-landing-cta-secondary">
                  {t('serviceDetail.learnMore')}
                </a>
              </div>
            </Reveal>

            <Reveal delay={220}>
              <ul className="mt-8 grid gap-3 sm:grid-cols-3">
                <li className="service-landing-trust-item">
                  <span className="service-landing-trust-icon" aria-hidden>✓</span>
                  <span>{t('serviceDetail.trustExpert')}</span>
                </li>
                <li className="service-landing-trust-item">
                  <span className="service-landing-trust-icon" aria-hidden>✓</span>
                  <span>{duration || t('serviceDetail.trustFlexible')}</span>
                </li>
                <li className="service-landing-trust-item">
                  <span className="service-landing-trust-icon" aria-hidden>✓</span>
                  <span>{t('serviceDetail.trustCare')}</span>
                </li>
              </ul>
            </Reveal>
          </div>

          <Reveal delay={100} className="mx-auto w-full max-w-md lg:max-w-none">
            <div className="service-landing-visual">
              <div className="service-landing-visual-glow" aria-hidden />
              {bannerImage && (
                <img
                  src={bannerImage}
                  alt=""
                  className="service-landing-visual-image"
                />
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
