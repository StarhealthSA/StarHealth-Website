'use client';

import HeaderForm from './header_form';
import Button from '../web_button';
import NavLink from '@/components/nav_link';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '@/lib/content/localized';

export default function HeroSectionContent({ homeSettings = null }) {
  const { t, i18n } = useTranslation();

  const title = getLocalizedText(homeSettings?.heroTitle, i18n.language) || t('hero.title');
  const subtitle = getLocalizedText(homeSettings?.heroSubtitle, i18n.language) || t('hero.subtitle');

  return (
    <div className="relative z-10 flex w-full flex-col items-center justify-end gap-8 px-[30px] pb-12 pt-10 sm:flex-row sm:items-center sm:justify-between sm:py-10 lg:px-[100px] lg:py-16">
      <div className="hero-section-copy flex w-full flex-col items-center text-center sm:w-2/3 sm:items-start sm:text-left">
        <p className="mb-4 w-full font-nudica text-[32px] font-medium leading-[40px] text-white lg:mb-[19px] lg:w-3/4 lg:text-[64px] lg:leading-[72px]">
          {title}
        </p>
        <p className="mb-5 w-full text-[16px] font-normal leading-[24px] text-white lg:mb-6 lg:w-3/4 lg:text-[23px] lg:leading-[28px]">
          {subtitle}
        </p>
        <NavLink href="/services">
          <Button text={t('Explore')} />
        </NavLink>
      </div>
      <div className="hidden shrink-0 sm:block">
        <HeaderForm />
      </div>
    </div>
  );
}
