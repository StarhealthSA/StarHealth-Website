'use client';

import HeaderForm from './header_form';
import Button from '../web_button';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="home-header h-[70vh] sm:h-fit lg:h-screen bground flex flex-col w-full bg-cover relative">
      <div className="border-b border-[#FFFFFF33] w-full sm:hidden" />

      <div className="flex flex-col sm:flex-row w-full mt-5 md:mt-0 justify-between items-center px-[30px] lg:px-[100px]">
        <div className="flex flex-col w-full sm:w-2/3 justify-evenly mb-20 sm:mb-20 mt-6 sm:mt-0">
          <div className="mt-[30px] sm:mt-[30px]">
            <p className="md:hidden text-white text-[32px] lg:text-[64px] font-medium leading-[40px] font-nudica lg:leading-[72px] mb-4 lg:mb-[19px] w-full lg:w-3/4">
              {t('hero.title')}
            </p>
            <p className="hidden md:block text-white text-[32px] lg:text-[64px] font-medium leading-[40px] font-nudica lg:leading-[72px] mb-4 lg:mb-[19px] w-full lg:w-3/4">
              {t('hero.title')}
            </p>
            <p className="text-white text-[16px] lg:text-[23px] font-normal mb-5 lg:mb-6 w-full lg:w-3/4 leading-[24px] lg:leading-[28px]">
              {t('hero.subtitle')}
            </p>
            <Link href="/services">
              <Button text={t('hero.cta')} />
            </Link>
          </div>
        </div>
        <div className="hidden sm:block">
          <HeaderForm />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
