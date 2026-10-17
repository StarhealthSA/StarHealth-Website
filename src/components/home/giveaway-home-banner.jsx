'use client';

import { ArrowRight } from 'lucide-react';
import Reveal from '@/components/reveal';
import NavLink from '@/components/nav_link';
import GiveawayCountdown from '@/components/giveaway/giveaway-countdown';
import { useTranslation } from 'react-i18next';
import { GIVEAWAY } from '@/lib/giveaway/config';
import bannerImageEn from '@/assets/giveaway/hero-iphones-home.png';
import bannerImageAr from '@/assets/giveaway/arabic-home-banner.png';

function assetUrl(asset) {
  return typeof asset === 'string' ? asset : asset?.src || '';
}

export default function GiveawayHomeBanner() {
  const { t, i18n } = useTranslation();

  if (!GIVEAWAY.enabled) return null;

  const isArabic = i18n.language?.startsWith('ar');
  const bannerImage = isArabic ? bannerImageAr : bannerImageEn;

  const countdownLabels = {
    eyebrow: t('giveawayPage.countdown.eyebrow'),
    days: t('giveawayPage.countdown.days'),
    hours: t('giveawayPage.countdown.hours'),
    minutes: t('giveawayPage.countdown.minutes'),
    seconds: t('giveawayPage.countdown.seconds'),
    ended: t('giveawayPage.countdown.ended'),
  };

  return (
    <section className="giveaway-home px-[20px] py-12 md:px-[30px] md:py-16 lg:px-[120px]">
      <Reveal>
        <div
          className="giveaway-home__panel"
          style={{ backgroundImage: `url(${assetUrl(bannerImage)})` }}
        >
          <div className="giveaway-home__shade" aria-hidden />

          <div className="giveaway-home__content">
            <p className="giveaway-home__eyebrow">{t('homeGiveawayBanner.eyebrow')}</p>
            <h2 className="giveaway-home__title">{t('homeGiveawayBanner.title')}</h2>
            <p className="giveaway-home__lead">{t('homeGiveawayBanner.description')}</p>
            <div className="giveaway-home__actions">
              <NavLink href={GIVEAWAY.path} className="giveaway-cta">
                <span>{t('homeGiveawayBanner.cta')}</span>
                <ArrowRight className="giveaway-home__cta-icon" aria-hidden />
              </NavLink>
              <p className="giveaway-home__note">{t('homeGiveawayBanner.note')}</p>
            </div>
          </div>

          <div className="giveaway-home__timer">
            <GiveawayCountdown
              labels={countdownLabels}
              variant="flip"
              className="flip-clock--compact"
            />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
