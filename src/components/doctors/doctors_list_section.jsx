'use client';

import IntroSection from './intro_section';
import DoctorsCard from '../doctors_card';
import Reveal, { staggerDelay } from '../reveal';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { useLocalizedDoctors, useServiceCategories } from '@/contexts/content-context';
import {
  doctorMatchesCategory,
  getCategoriesWithDoctors,
  getDoctorsWithCategory,
} from '@/lib/content/doctor-category-utils';
import SearchInput from '@/components/shared/search-input';

function DoctorsListSection() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const allDoctors = useLocalizedDoctors(i18n.language);
  const allCategories = useServiceCategories(i18n.language);

  const doctors = useMemo(() => getDoctorsWithCategory(allDoctors), [allDoctors]);
  const categories = useMemo(
    () => getCategoriesWithDoctors(allCategories, doctors),
    [allCategories, doctors]
  );

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (selectedCategory !== 'all' && !categories.some((category) => category.id === selectedCategory)) {
      setSelectedCategory('all');
    }
  }, [categories, selectedCategory]);

  const filteredDoctors = useMemo(() => {
    const query = search.trim().toLowerCase();
    return doctors.filter((doctor) => {
      const matchesCategory = doctorMatchesCategory(doctor, selectedCategory);

      if (!query) return matchesCategory;

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

      return matchesCategory && haystack.includes(query);
    });
  }, [doctors, selectedCategory, search]);

  const showCategoryFilters = categories.length > 0;

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

        {showCategoryFilters && (
          <div className="flex flex-wrap gap-3 py-4 md:py-0 lg:ml-2.5 lg:gap-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`${selectedCategory === 'all'
                ? 'bg-gradient-to-tl from-[#037B76] to-[#AED5C6] text-[#FFFFFF]'
                : 'border-[1px] border-[#DAD8D7] text-[#687276] hover:bg-gray-50'
                } w-fit whitespace-nowrap rounded-[8px] px-4 py-2 font-inter text-[14px] font-weight-[400px] transition-all lg:text-[16px]`}
            >
              {t('doctorsPage.all')}
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
        )}
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
              categoryId={item.categoryId}
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
