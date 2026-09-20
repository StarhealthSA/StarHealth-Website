'use client';

import { useTranslation } from 'react-i18next';
import { NATIONAL_DAY } from '@/lib/national-day/config';
import sloganBannerAr from '@/assets/national-day/slogan-banner-ar.png';
import sloganBannerEn from '@/assets/national-day/slogan-banner-en.jpg';

/**
 * Official National Day 96 slogan strip — sits mid-top (below contact bar, above main nav).
 * Switches Arabic / English artwork with the site language.
 */
export default function NationalDayBanner() {
  const { t, i18n } = useTranslation();
  const isArabic = (i18n.language || '').toLowerCase().startsWith('ar');
  const bannerSrc = isArabic ? sloganBannerAr : sloganBannerEn;

  if (!NATIONAL_DAY.enabled) return null;

  return (
    <div
      className="national-day-banner"
      role="region"
      aria-label={t('nationalDay.bannerLabel')}
    >
      <div className="national-day-banner__inner">
        <img
          key={isArabic ? 'ar' : 'en'}
          src={bannerSrc}
          alt={t('nationalDay.sloganAlt')}
          className="national-day-banner__art"
          decoding="async"
          fetchPriority="high"
        />
        <p className="sr-only" lang={isArabic ? 'ar' : 'en'}>
          {isArabic ? NATIONAL_DAY.sloganAr : NATIONAL_DAY.sloganEn}
          {' — '}
          {t('nationalDay.yearLabel')}
        </p>
      </div>
    </div>
  );
}
