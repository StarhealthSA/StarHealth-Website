'use client';

import HeaderForm from './header_form';
import HeroBannerVideo from './hero-banner-video';
import Button from '../web_button';
import NavLink from '@/components/nav_link';
import Reveal from '../reveal';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '@/lib/content/localized';

function HeroSection({ homeSettings = null }) {
  const { t, i18n } = useTranslation();
  const heroVideo = homeSettings?.heroVideo;
  const hasVideo = Boolean(heroVideo?.enabled && heroVideo?.playback);

  const title = getLocalizedText(homeSettings?.heroTitle, i18n.language) || t('hero.title');
  const subtitle = getLocalizedText(homeSettings?.heroSubtitle, i18n.language) || t('hero.subtitle');

  return (
    <section
      className={`home-header relative flex w-full min-h-[85vh] items-center overflow-hidden ${
        hasVideo ? 'hero-header--video' : 'bground bg-cover'
      }`}
    >
      {hasVideo && <HeroBannerVideo playback={heroVideo.playback} />}
      <div className={`absolute inset-0 ${hasVideo ? 'hero-banner-overlay' : ''}`} aria-hidden />

      <div className="relative z-10 flex w-full flex-col items-center justify-center gap-8 px-[30px] py-10 sm:flex-row sm:justify-between lg:px-[100px] lg:py-16">
        <Reveal className="flex w-full flex-col items-center text-center sm:w-2/3 sm:items-start sm:text-left">
          <p className="mb-4 w-full font-nudica text-[32px] font-medium leading-[40px] text-white lg:mb-[19px] lg:w-3/4 lg:text-[64px] lg:leading-[72px]">
            {title}
          </p>
          <p className="mb-5 w-full text-[16px] font-normal leading-[24px] text-white lg:mb-6 lg:w-3/4 lg:text-[23px] lg:leading-[28px]">
            {subtitle}
          </p>
          <NavLink href="/services">
            <Button text={t('Explore')} />
          </NavLink>
        </Reveal>
        <Reveal delay={150} className="hidden shrink-0 sm:block">
          <HeaderForm />
        </Reveal>
      </div>
    </section>
  );
}

export default HeroSection;
