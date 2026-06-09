'use client';

import IntroSection from './intro_section';
import DoctorsCard from '../doctors_card';
import Reveal, { staggerDelay } from '../reveal';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useLocalizedDoctors } from '@/contexts/content-context';

function DoctorsListSection() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const doctors = useLocalizedDoctors(i18n.language);

  const [selectedService, setSelectedService] = useState('all');

  const services = [
    { service: t('doctorsPage.services.all'), value: 'all' },
    { service: t('doctorsPage.services.generalMedicine'), value: 'generalMedicine' },
    { service: t('doctorsPage.services.paediatrics'), value: 'paediatrics' },
    { service: t('doctorsPage.services.dentistry'), value: 'dentistry' },
  ];

  const handleServiceClick = (serviceValue) => {
    setSelectedService(serviceValue);
  };

  const filteredDoctors = selectedService === 'all'
    ? doctors
    : doctors.filter((doctor) => doctor.category === selectedService);

  return (
    <section className="bg-[#FFFFFF] w-full">
      <IntroSection />
      <div className={`w-full px-[30px] ${isRTL ? 'lg:pr-[120px]' : 'lg:pl-[120px]'} pt-[5px] lg:pt-[20px]`}>
        <div className="overflow-x-auto space-x-3 lg:space-x-5 py-4 md:py-0 lg:ml-2.5 flex flex-row sm:whitespace-normal scrollbar-hide">
          {services.map((item, index) => (
            <button
              onClick={() => handleServiceClick(item.value)}
              className={`${selectedService === item.value
                ? 'bg-gradient-to-tl from-[#037B76] to-[#AED5C6] text-[#FFFFFF]'
                : 'border-[#DAD8D7] border-[1px] text-[#687276] hover:bg-gray-50'
                } whitespace-nowrap font-inter text-[14px] lg:text-[16px] font-weight-[400px] w-fit px-4 py-2 rounded-[8px] transition-all`}
              key={index}
            >
              {item.service}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8 md:mt-0 pb-[30px] pt-[25px] px-[20px] md:px-[60px] lg:px-[120px]">
        {filteredDoctors.map((item, index) => (
          <DoctorsCard
            imgs={item.image}
            name={item.displayName}
            specialty={item.displaySpecialty}
            revealDelay={staggerDelay(index)}
            key={item.id}
          />
        ))}
      </div>
    </section>
  );
}

export default DoctorsListSection;
