'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Reveal from '@/components/reveal';
import HeroBannerVideo from '@/components/home/hero-banner-video';
import { useTranslation } from 'react-i18next';
import { getLocalizedText, formatSarPrice } from '@/lib/content/localized';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

export default function ServiceBanner({
  service,
  marketing,
  onBookClick,
  lang,
  showWhatsApp = true,
  backHref = '/services',
  backLabel,
}) {
  const { t } = useTranslation();
  const resolvedBackLabel = backLabel || t('serviceDetail.backToServices');
  const bannerImage = service.bannerImage || service.featuredImageUrl || '';
  const duration = getLocalizedText(service.treatmentDuration, lang);
  const priceLabel = formatSarPrice(service.priceAmount);
  const heroVideo = marketing?.heroVideo;
  const hasVideo = Boolean(heroVideo?.enabled && heroVideo?.playback);
  const stats = (marketing?.stats || []).filter(
    (stat) => getLocalizedText(stat.value, lang) || getLocalizedText(stat.label, lang)
  );

  const imageRef = useRef(null);
  const [parallaxY, setParallaxY] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !bannerImage) return undefined;

    const onScroll = () => {
      const y = Math.min(window.scrollY * 0.12, 40);
      setParallaxY(y);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [bannerImage]);

  const whatsappUrl = buildWhatsAppUrl(
    t('serviceDetail.whatsappMessage', { service: service.displayTitle })
  );

  const trustItems = stats.length
    ? stats.slice(0, 3).map((stat) => ({
        value: getLocalizedText(stat.value, lang),
        label: getLocalizedText(stat.label, lang),
      }))
    : [
        { value: '✓', label: t('serviceDetail.trustExpert') },
        { value: '✓', label: duration || t('serviceDetail.trustFlexible') },
        { value: '✓', label: t('serviceDetail.trustCare') },
      ];

  return (
    <section
      className={`service-landing-hero relative overflow-hidden border-b border-[#E9E7E6]/80 ${
        hasVideo ? 'service-landing-hero--video' : 'service-landing-hero--gradient'
      }`}
    >
      {hasVideo && <HeroBannerVideo playback={heroVideo.playback} />}
      <div className={`absolute inset-0 ${hasVideo ? 'hero-banner-overlay' : 'service-landing-hero__overlay'}`} aria-hidden />

      <div className="service-detail-container relative z-10 py-8 md:py-12 lg:py-16">
        <Reveal>
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 font-inter text-sm font-medium text-white/80 transition hover:text-white"
          >
            <span aria-hidden>←</span>
            {resolvedBackLabel}
          </Link>
        </Reveal>

        <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <Reveal delay={60}>
              <div className="flex flex-wrap items-center gap-2">
                {service.icon && (
                  <span className="service-landing-icon-badge">
                    <img src={service.icon} alt="" className="h-6 w-6 object-contain" />
                  </span>
                )}
                {service.displayCategory && (
                  <span className="service-landing-pill service-landing-pill--on-dark">
                    {service.displayCategory}
                  </span>
                )}
              </div>
              <h1
                className="service-display-title mt-5 text-[2rem] font-semibold leading-[1.15] text-white md:text-5xl lg:text-[3.25rem]"
              >
                {service.displayTitle}
              </h1>
            </Reveal>

            {priceLabel ? (
              <Reveal delay={90}>
                <div className="service-landing-hero-price">
                  <span className="service-landing-hero-price__label">{t('serviceDetail.startingFrom')}</span>
                  <span className="service-landing-hero-price__value">{priceLabel}</span>
                </div>
              </Reveal>
            ) : null}

            <Reveal delay={120}>
              <p
                className="mt-5 max-w-xl font-inter text-lg leading-relaxed text-white/90"
              >
                {service.displayShortDescription}
              </p>
            </Reveal>

            <Reveal delay={180}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button type="button" onClick={onBookClick} className="service-landing-cta-primary">
                  {t('serviceDetail.bookAppointment')}
                </button>
                {showWhatsApp && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="service-landing-cta-whatsapp"
                  >
                    {t('serviceDetail.whatsappCta')}
                  </a>
                )}
                <a
                  href="#overview"
                  className="service-landing-cta-secondary service-landing-cta-secondary--on-dark"
                >
                  {t('serviceDetail.learnMore')}
                </a>
              </div>
            </Reveal>

            <Reveal delay={220}>
              <ul className="mt-8 grid gap-3 sm:grid-cols-3">
                {trustItems.map((item, index) => (
                  <li
                    key={index}
                    className="service-landing-trust-item service-landing-trust-item--on-dark"
                  >
                    {stats.length ? (
                      <>
                        <span className="service-landing-trust-stat">{item.value}</span>
                        <span>{item.label}</span>
                      </>
                    ) : (
                      <>
                        <span className="service-landing-trust-icon" aria-hidden>✓</span>
                        <span>{item.label}</span>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={100} className="mx-auto w-full max-w-md lg:max-w-none">
            <div className="service-landing-visual">
              <div className="service-landing-visual-glow" aria-hidden />
              {bannerImage && (
                <img
                  ref={imageRef}
                  src={bannerImage}
                  alt=""
                  loading="eager"
                  className="service-landing-visual-image"
                  style={{ transform: `translateY(${parallaxY}px)` }}
                />
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
