'use client';

import welcomeimg from '../../assets/home/welcomeimg.png';
import Reveal from '../reveal';
import { useTranslation } from 'react-i18next';
import { NATIONAL_DAY } from '@/lib/national-day/config';

function WelcomePart() {
  const { t } = useTranslation();
  const isNationalDay = NATIONAL_DAY.enabled;

  return (
    <div className={`w-full bg-[#F6F4F3] flex justify-center${isNationalDay ? ' welcome-nd' : ''}`}>
      {isNationalDay ? (
        <div className="welcome-nd__edge welcome-nd__edge--top" aria-hidden />
      ) : null}

      <Reveal className="welcome-nd__content relative z-[1] mx-auto max-w-[1200px] px-[30px] py-[60px] text-center lg:px-[120px]">
        <img src={welcomeimg} alt="Welcome Image" className="w-full h-fit mb-6 md:hidden" />

        <div className="welcome-nd__title-row mb-6 flex items-center justify-center gap-3 md:gap-4">
          {isNationalDay ? (
            <span className="welcome-nd__motif" aria-hidden />
          ) : null}
          <p className="md:hidden linear-text mb-0 text-[14px] font-normal font-inter sm:text-[16px]">
            {t('welcome.title')}
          </p>
          <p className="mb-0 hidden text-[14px] font-normal font-inter text-[#AFAEAD] md:block sm:text-[16px]">
            {t('welcome.title')}
          </p>
          {isNationalDay ? (
            <span className="welcome-nd__motif" aria-hidden />
          ) : null}
        </div>

        <p className="mx-auto text-center font-inter text-[20px] font-normal leading-[28px] text-[#002333] md:w-5/6 lg:w-3/3 lg:text-[32px] lg:leading-[44px]">
          {t('welcome.description')}
        </p>

        {isNationalDay ? (
          <p className="welcome-nd__slogan nd-slogan mt-5 text-sm font-medium text-[#006c35] md:text-base" lang="ar">
            {NATIONAL_DAY.sloganAr}
            <span className="mx-2 text-[#AFAEAD]">·</span>
            {t('nationalDay.yearLabel')}
          </p>
        ) : null}
      </Reveal>

      {isNationalDay ? (
        <div className="welcome-nd__edge welcome-nd__edge--bottom" aria-hidden />
      ) : null}
    </div>
  );
}

export default WelcomePart;
