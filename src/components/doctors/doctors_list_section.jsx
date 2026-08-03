'use client';

import IntroSection from './intro_section';
import DoctorsCard from '../doctors_card';
import Reveal, { staggerDelay } from '../reveal';
import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { useLocalizedDoctors } from '@/contexts/content-context';
import SearchInput from '@/components/shared/search-input';

function DoctorsListSection() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const doctors = useLocalizedDoctors(i18n.language);
  const [search, setSearch] = useState('');

  const filteredDoctors = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return doctors;

    return doctors.filter((doctor) => {
      const haystack = [
        doctor.displayName,
        doctor.displayQualification,
        doctor.displayDesignation,
        doctor.displaySpecialty,
        doctor.displaySpecialization,
        doctor.displaySubSpecialization,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [doctors, search]);

  return (
    <section className="w-full bg-[#FFFFFF]">
      <IntroSection />

      <div className={`w-full px-[30px] ${isRTL ? 'lg:pr-[120px]' : 'lg:pl-[120px]'} pt-[5px] lg:pt-[20px]`}>
        <div className="mb-4 max-w-xl">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('doctorsPage.searchPlaceholder')}
          />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 px-[20px] pb-[30px] pt-[25px] md:mt-0 md:grid-cols-3 md:px-[60px] lg:grid-cols-4 lg:px-[120px]">
        {filteredDoctors.length === 0 ? (
          <p className="col-span-full py-8 text-center font-inter text-[#687276]">
            {t('doctorsPage.noResults')}
          </p>
        ) : (
          filteredDoctors.map((item, index) => (
            <DoctorsCard
              imgs={item.image}
              name={item.displayName}
              specialty={item.displaySpecialty}
              specialization={item.displaySpecialization}
              slug={item.slug}
              doctorId={item.id}
              preselectedServiceId={item.relatedServiceIds?.[0]}
              revealDelay={staggerDelay(index)}
              key={item.id}
            />
          ))
        )}
      </div>
    </section>
  );
}

export default DoctorsListSection;
