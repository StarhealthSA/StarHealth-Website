'use client';

import { useState } from 'react';
import Button from '../web_button';
import Link from 'next/link';
import downarrow from '../../assets/home/downarrow.svg';
import Reveal, { staggerDelay } from '../reveal';
import { useTranslation } from 'react-i18next';
import Servicescard from '../services_card';
import { useLocalizedServices } from '@/contexts/content-context';

const SpecializedServices = () => {
  const { t, i18n } = useTranslation();
  const [showAll, setShowAll] = useState(false);
  const services = useLocalizedServices(i18n.language);
  const displayedServices = showAll ? services : services.slice(0, 4);

  return (
    <div className="bg-[#E9E7E6] flex flex-col justify-start items-center px-[30px] md:px-[10px] py-[50px] lg:py-[80px]">
      <Reveal className="flex flex-col items-center">
        <h1 className="w-full text-center font-inter text-[24px] font-medium leading-[32px] text-[#002333] lg:text-[44px] lg:leading-[56px]">
          {t('services.title')}
        </h1>
        <p className="mt-[5px] hidden w-full text-center font-inter text-[14px] font-normal leading-[20px] text-[#687276] md:block md:w-3/4 lg:mt-[20px] lg:w-3/5 lg:text-[16px]">
          {t('services.description')}
        </p>
      </Reveal>

      <div className="mb-5 hidden w-full gap-2 pb-[20px] pt-[30px] md:grid md:grid-cols-3 lg:grid-cols-4 lg:gap-4 lg:px-[120px]">
        {services.map((item, index) => (
          <Servicescard
            images={item.icon}
            title={item.displayTitle}
            description={item.displayDescription}
            link={`/services/${item.slug}`}
            revealDelay={staggerDelay(index)}
            key={item.id}
          />
        ))}
      </div>

      <div className="mb-5 grid w-full grid-cols-1 gap-4 pb-[20px] pt-[30px] md:hidden">
        {displayedServices.map((item, index) => (
          <Servicescard
            images={item.icon}
            title={item.displayTitle}
            description={item.displayDescription}
            link={`/services/${item.slug}`}
            revealDelay={staggerDelay(index)}
            key={item.id}
          />
        ))}
      </div>
      {!showAll && services.length > 4 && (
        <button
          onClick={() => setShowAll(true)}
          className="mb-[20px] rounded-md border border-[#037B76] px-4 py-2 transition-colors hover:bg-[#037B76] hover:text-white md:hidden"
        >
          <div className='flex flex-row items-center'>
            <p className="font-inter text-[14px] leading-[22px]">{t('services.showMore')}</p>
            <img src={downarrow} alt='arrow' className='h-[15px] w-[25px]' />
          </div>
        </button>
      )}
      {showAll && (
        <Link href={'/contact'}>
          <Button text={t('services.contactUs')} />
        </Link>
      )}
      <Link href={'/contact'} className='hidden md:block'>
        <Button text={t('services.contactUs')} />
      </Link>
    </div>
  );
};

export default SpecializedServices;
