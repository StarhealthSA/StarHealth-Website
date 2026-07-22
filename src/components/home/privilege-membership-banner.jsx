'use client';

import { ArrowRight } from 'lucide-react';
import Reveal from '@/components/reveal';
import NavLink from '@/components/nav_link';
import { useTranslation } from 'react-i18next';
import bannerImage from '@/assets/home/black.png';

export default function PrivilegeMembershipBanner() {
  const { t } = useTranslation();

  return (
    <section className="privilege-banner px-[20px] py-12 md:px-[30px] md:py-16 lg:px-[120px]">
      <Reveal>
        <div className="privilege-banner__panel">
          <div className="privilege-banner__glow" aria-hidden />
          <div className="privilege-banner__pattern" aria-hidden />

          <div className="privilege-banner__media" aria-hidden>
            <img
              src={bannerImage}
              alt=""
              className="privilege-banner__image"
            />
            <div className="privilege-banner__media-fade" />
          </div>

          <div className="privilege-banner__content">
            <p className="privilege-banner__eyebrow">{t('homePrivilegeBanner.eyebrow')}</p>
            <h2 className="privilege-banner__title">{t('homePrivilegeBanner.title')}</h2>
            <p className="privilege-banner__lead">{t('homePrivilegeBanner.description')}</p>

            <div className="privilege-banner__actions">
              <NavLink href="/loyalty-program" className="privilege-banner__cta">
                <span>{t('homePrivilegeBanner.cta')}</span>
                <ArrowRight className="privilege-banner__cta-icon" aria-hidden />
              </NavLink>
              <p className="privilege-banner__note">{t('homePrivilegeBanner.note')}</p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
