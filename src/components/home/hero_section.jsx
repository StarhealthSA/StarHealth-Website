'use client';

import HeaderForm from './header_form';
import Button from '../web_button';
import NavLink from '@/components/nav_link';
import { useTranslation } from 'react-i18next';

function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="home-header bground relative flex w-full min-h-[70vh] items-center bg-cover sm:min-h-[520px] lg:min-h-[calc(100dvh-130px)]">
      <div className="flex w-full flex-col items-center justify-center gap-8 px-[30px] py-10 sm:flex-row sm:justify-between lg:px-[100px] lg:py-16">
        <div className="flex w-full flex-col items-center text-center sm:w-2/3 sm:items-start sm:text-left">
          <p className="mb-4 w-full font-nudica text-[32px] font-medium leading-[40px] text-white lg:mb-[19px] lg:w-3/4 lg:text-[64px] lg:leading-[72px]">
            {t('hero.title')}
          </p>
          <p className="mb-5 w-full text-[16px] font-normal leading-[24px] text-white lg:mb-6 lg:w-3/4 lg:text-[23px] lg:leading-[28px]">
            {t('hero.subtitle')}
          </p>
          <NavLink href="/services">
            <Button text={t('hero.cta')} />
          </NavLink>
        </div>
        <div className="hidden shrink-0 sm:block">
          <HeaderForm />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
