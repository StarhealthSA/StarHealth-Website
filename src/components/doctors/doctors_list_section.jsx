'use client';

import IntroSection from './intro_section';
import DoctorsCard from '../doctors_card';
import Reveal, { staggerDelay } from '../reveal';
import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { useContent, useLocalizedDoctors, useServiceCategories } from '@/contexts/content-context';
import { getSpecializationCategoryId } from '@/lib/content/specialization-utils';

function DoctorsListSection() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { specializations } = useContent();
  const doctors = useLocalizedDoctors(i18n.language);
  const categories = useServiceCategories(i18n.language);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');

  const filteredDoctors = useMemo(() => {
    const query = search.trim().toLowerCase();
    return doctors.filter((doctor) => {
      const selectedSpec = specializations.find((spec) => spec.id === doctor.specializationId);
      const doctorCategoryId =
        doctor.categoryId ||
        getSpecializationCategoryId(selectedSpec) ||
        doctor.category;

      const matchesSpec =
        selectedCategory === 'all' ||
        doctorCategoryId === selectedCategory ||
        doctor.specializationId === selectedCategory ||
        doctor.subSpecializationId === selectedCategory ||
        doctor.category === selectedCategory;

      if (!query) return matchesSpec;

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

      return matchesSpec && haystack.includes(query);
    });
  }, [doctors, selectedCategory, search, specializations]);

  return (
    <section className="w-full bg-[#FFFFFF]">
      <IntroSection />

      <div className={`w-full px-[30px] ${isRTL ? 'lg:pr-[120px]' : 'lg:pl-[120px]'} pt-[5px] lg:pt-[20px]`}>
        <div className="mb-4 max-w-xl">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('doctorsPage.searchPlaceholder')}
            className="w-full rounded-lg border border-[#DAD8D7] px-4 py-3 font-inter text-[14px] text-[#687276] focus:border-[#037B76] focus:outline-none"
          />
        </div>

        <div className="scrollbar-hide flex flex-row space-x-3 overflow-x-auto py-4 sm:whitespace-normal md:py-0 lg:ml-2.5 lg:space-x-5">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`${selectedCategory === 'all'
              ? 'bg-gradient-to-tl from-[#037B76] to-[#AED5C6] text-[#FFFFFF]'
              : 'border-[1px] border-[#DAD8D7] text-[#687276] hover:bg-gray-50'
              } w-fit whitespace-nowrap rounded-[8px] px-4 py-2 font-inter text-[14px] font-weight-[400px] transition-all lg:text-[16px]`}
          >
            {t('doctorsPage.services.all')}
          </button>
          {categories.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedCategory(item.id)}
              className={`${selectedCategory === item.id
                ? 'bg-gradient-to-tl from-[#037B76] to-[#AED5C6] text-[#FFFFFF]'
                : 'border-[1px] border-[#DAD8D7] text-[#687276] hover:bg-gray-50'
                } w-fit whitespace-nowrap rounded-[8px] px-4 py-2 font-inter text-[14px] font-weight-[400px] transition-all lg:text-[16px]`}
            >
              {item.displayName}
            </button>
          ))}
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
