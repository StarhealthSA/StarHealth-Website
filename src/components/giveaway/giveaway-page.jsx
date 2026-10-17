'use client';

import { useTranslation } from 'react-i18next';
import Reveal from '@/components/reveal';
import NavLink from '@/components/nav_link';
import Whatnext from '@/components/what_next';
import GiveawayCountdown from '@/components/giveaway/giveaway-countdown';
import GiveawayFaqSection from '@/components/giveaway/giveaway-faq-section';
import GiveawayOffersSection from '@/components/giveaway/giveaway-offers-section';
import GiveawayTermsSection from '@/components/giveaway/giveaway-terms-section';
import { GIVEAWAY } from '@/lib/giveaway/config';
import { staggerDelay } from '@/lib/stagger_delay';
import heroImage from '@/assets/giveaway/hero-iphones.png';
import journeyClinic from '@/assets/giveaway/star.jpeg';
import journeyCare from '@/assets/home/treatment.jpg';
import journeyFamily from '@/assets/home/Designed for Family Healthcare Journeys.png';
import journeyAnniversary from '@/assets/giveaway/-2.jpg';

function assetUrl(asset) {
  return typeof asset === 'string' ? asset : asset?.src || '';
}

export default function GiveawayPage({ offers = [] }) {
  const { t } = useTranslation();

  const steps = [
    t('giveawayPage.howToEnter.steps.s1'),
    t('giveawayPage.howToEnter.steps.s2'),
    t('giveawayPage.howToEnter.steps.s3'),
  ];

  const milestones = [
    {
      year: t('giveawayPage.journey.items.m1.year'),
      title: t('giveawayPage.journey.items.m1.title'),
      body: t('giveawayPage.journey.items.m1.body'),
      image: journeyClinic,
    },
    {
      year: t('giveawayPage.journey.items.m2.year'),
      title: t('giveawayPage.journey.items.m2.title'),
      body: t('giveawayPage.journey.items.m2.body'),
      image: journeyCare,
    },
    {
      year: t('giveawayPage.journey.items.m3.year'),
      title: t('giveawayPage.journey.items.m3.title'),
      body: t('giveawayPage.journey.items.m3.body'),
      image: journeyFamily,
    },
    {
      year: t('giveawayPage.journey.items.m4.year'),
      title: t('giveawayPage.journey.items.m4.title'),
      body: t('giveawayPage.journey.items.m4.body'),
      image: journeyAnniversary,
    },
  ];

  const countdownLabels = {
    eyebrow: t('giveawayPage.countdown.eyebrow'),
    days: t('giveawayPage.countdown.days'),
    hours: t('giveawayPage.countdown.hours'),
    minutes: t('giveawayPage.countdown.minutes'),
    seconds: t('giveawayPage.countdown.seconds'),
    ended: t('giveawayPage.countdown.ended'),
  };

  return (
    <div className="giveaway-page">
      <section
        className="giveaway-hero"
        style={{ backgroundImage: `url(${assetUrl(heroImage)})` }}
      >
        <div className="giveaway-hero__shade" aria-hidden />
        <div className="giveaway-hero__inner">
          <Reveal>
            <p className="giveaway-hero__eyebrow">{t('giveawayPage.hero.eyebrow')}</p>
            <h1 className="giveaway-hero__title">{t('giveawayPage.hero.title')}</h1>
            <p className="giveaway-hero__lead">{t('giveawayPage.hero.lead')}</p>
            <div className="giveaway-hero__actions">
              <a href="#how-to-enter" className="giveaway-cta">
                {t('giveawayPage.cta.enter')}
              </a>
              <NavLink href="/booking" className="giveaway-cta giveaway-cta--ghost">
                {t('giveawayPage.cta.book')}
              </NavLink>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="giveaway-timer-section" id="countdown">
        <div className="giveaway-timer-section__glow" aria-hidden />
        <Reveal className="giveaway-timer-section__inner">
          <p className="giveaway-timer-section__eyebrow">{t('giveawayPage.countdown.sectionEyebrow')}</p>
          <h2 className="giveaway-timer-section__title">{t('giveawayPage.countdown.sectionTitle')}</h2>
          <p className="giveaway-timer-section__lead">{t('giveawayPage.countdown.sectionLead')}</p>
          <GiveawayCountdown
            labels={countdownLabels}
            variant="flip"
            className="giveaway-timer-section__clock"
          />
        </Reveal>
      </section>

      <section className="giveaway-enter" id="how-to-enter">
        <div className="giveaway-enter__glow" aria-hidden />
        <Reveal className="giveaway-enter__intro">
          <p className="giveaway-enter__eyebrow">{t('giveawayPage.howToEnter.eyebrow')}</p>
          <h2 className="giveaway-enter__title">{t('giveawayPage.howToEnter.title')}</h2>
          <p className="giveaway-enter__lead">{t('giveawayPage.howToEnter.lead')}</p>
        </Reveal>

        <ol className="giveaway-enter__path">
          {steps.map((step, index) => (
            <Reveal
              key={step}
              delay={staggerDelay(index, 90)}
              className="giveaway-enter__step-wrap"
            >
              <li className="giveaway-enter__step">
                <span className="giveaway-enter__index" aria-hidden>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="giveaway-enter__step-title">{step}</h3>
              </li>
            </Reveal>
          ))}
        </ol>

        <Reveal className="giveaway-enter__cta">
          <p className="giveaway-enter__opening">{t('giveawayPage.howToEnter.openingDate')}</p>
          <div className="giveaway-enter__actions">
            <a
              href={GIVEAWAY.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="giveaway-cta giveaway-cta--enter"
            >
              {t('giveawayPage.howToEnter.branchLocation')}
            </a>
            <a href={`tel:${GIVEAWAY.phoneTel}`} className="giveaway-cta giveaway-cta--enter-ghost">
              {t('giveawayPage.howToEnter.callNow')}
            </a>
          </div>
        </Reveal>
      </section>

      <GiveawayOffersSection offers={offers} />

      <section className="giveaway-journey-section" id="journey">
        <div className="giveaway-journey-section__glow" aria-hidden />
        <Reveal className="giveaway-journey-section__intro">
          <p className="giveaway-journey-section__eyebrow">{t('giveawayPage.journey.eyebrow')}</p>
          <h2 className="giveaway-journey-section__title">{t('giveawayPage.journey.title')}</h2>
          <p className="giveaway-journey-section__lead">{t('giveawayPage.journey.lead')}</p>
        </Reveal>

        <Reveal className="giveaway-journey-stats" delay={50}>
          <div className="giveaway-journey-stats__item">
            <span className="giveaway-journey-stats__icon" aria-hidden>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="9" cy="8" r="3.2" />
                <circle cx="16.5" cy="9" r="2.6" />
                <path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5" />
                <path d="M14 14.2c1.7-.4 3.5.2 4.7 2.8" />
              </svg>
            </span>
            <div className="giveaway-journey-stats__copy">
              <p className="giveaway-journey-stats__value">
                {t('giveawayPage.journey.stats.clients.value')}
              </p>
              <p className="giveaway-journey-stats__label">
                {t('giveawayPage.journey.stats.clients.label')}
              </p>
            </div>
          </div>
          <div className="giveaway-journey-stats__divider" aria-hidden />
          <div className="giveaway-journey-stats__item">
            <span className="giveaway-journey-stats__icon" aria-hidden>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 20s-6.5-4.2-8.2-7.6C2.4 9.6 4 6.8 7 6.8c1.7 0 3 .9 3.8 2.2C11.6 7.7 12.9 6.8 14.6 6.8c3 0 4.6 2.8 3.2 5.6C16.1 15.8 12 20 12 20Z" />
                <path d="M12.2 11.2c.2-.7.8-1.2 1.5-1.2.9 0 1.5.8 1.2 1.7-.2.6-.8 1.2-1.7 1.8" />
              </svg>
            </span>
            <div className="giveaway-journey-stats__copy">
              <p className="giveaway-journey-stats__value">
                {t('giveawayPage.journey.stats.satisfaction.value')}
              </p>
              <p className="giveaway-journey-stats__label">
                {t('giveawayPage.journey.stats.satisfaction.label')}
              </p>
            </div>
          </div>
        </Reveal>

        <ol className="giveaway-journey">
          {milestones.map((item, index) => {
            const side = index % 2 === 0 ? 'left' : 'right';

            return (
              <Reveal
                key={item.title}
                delay={staggerDelay(index, 90)}
                className="giveaway-journey__row-wrap"
              >
                <li className={`giveaway-journey__row giveaway-journey__row--${side}`}>
                  <div className="giveaway-journey__card">
                    <p className="giveaway-journey__year">{item.year}</p>
                    <h3 className="giveaway-journey__title">{item.title}</h3>
                    <p className="giveaway-journey__body">{item.body}</p>
                  </div>

                  <span className="giveaway-journey__node" aria-hidden>
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div className="giveaway-journey__media">
                    <img
                      src={assetUrl(item.image)}
                      alt=""
                      className="giveaway-journey__image"
                      loading="lazy"
                    />
                  </div>
                </li>
              </Reveal>
            );
          })}
        </ol>
      </section>

      <GiveawayFaqSection />

      <GiveawayTermsSection />

      <Whatnext text={t('giveawayPage.whatNext')} />
    </div>
  );
}
