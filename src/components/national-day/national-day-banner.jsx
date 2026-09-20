'use client';

import { useTranslation } from 'react-i18next';
import { NATIONAL_DAY } from '@/lib/national-day/config';
import sloganBanner from '@/assets/national-day/slogan-banner.png';

/**
 * Official National Day 96 slogan strip — sits mid-top (below contact bar, above main nav).
 */
export default function NationalDayBanner() {
  const { t } = useTranslation();

  if (!NATIONAL_DAY.enabled) return null;

  return (
    <div
      className="national-day-banner"
      role="region"
      aria-label={t('nationalDay.bannerLabel')}
    >
      <div className="national-day-banner__inner">
        <img
          src={sloganBanner}
          alt={t('nationalDay.sloganAlt')}
          className="national-day-banner__art"
          decoding="async"
          fetchPriority="high"
        />
        <p className="sr-only" lang="ar">
          {NATIONAL_DAY.sloganAr}
          {' — '}
          {t('nationalDay.yearLabel')}
        </p>
      </div>
    </div>
  );
}
