'use client';

import { useMemo, useState } from 'react';
import Servicescard from '@/components/services_card';
import { staggerDelay } from '@/lib/stagger_delay';
import { useTranslation } from 'react-i18next';
import { useLocalizedServices, useServiceCategories } from '@/contexts/content-context';

export default function ServiceCardsGrid({ className = '' }) {
  const { t, i18n } = useTranslation();
  const services = useLocalizedServices(i18n.language);
  const categories = useServiceCategories(i18n.language);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const filteredServices = useMemo(() => {
    const query = search.trim().toLowerCase();
    return services.filter((item) => {
      const matchesCategory = !categoryFilter || item.categoryId === categoryFilter;
      if (!query) return matchesCategory;
      const title = item.displayTitle?.toLowerCase() || '';
      const description = item.displayDescription?.toLowerCase() || '';
      return matchesCategory && (title.includes(query) || description.includes(query));
    });
  }, [services, search, categoryFilter]);

  return (
    <div className={className}>
      <div className="mb-4 max-w-xl">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('serviceListing.searchPlaceholder')}
          className="w-full rounded-lg border border-[#DAD8D7] px-4 py-3 font-inter text-[14px] text-[#687276] focus:border-[#037B76] focus:outline-none"
        />
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-3 py-4 md:py-0 lg:ml-2.5 lg:gap-4">
          <button
            type="button"
            onClick={() => setCategoryFilter('')}
            className={`w-fit whitespace-nowrap rounded-[8px] px-4 py-2 font-inter text-[14px] font-weight-[400px] transition-all lg:text-[16px] ${
              !categoryFilter
                ? 'bg-gradient-to-tl from-[#037B76] to-[#AED5C6] text-[#FFFFFF]'
                : 'border-[1px] border-[#DAD8D7] text-[#687276] hover:bg-gray-50'
            }`}
          >
            {t('serviceListing.allCategories')}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryFilter(cat.id)}
              className={`w-fit whitespace-nowrap rounded-[8px] px-4 py-2 font-inter text-[14px] font-weight-[400px] transition-all lg:text-[16px] ${
                categoryFilter === cat.id
                  ? 'bg-gradient-to-tl from-[#037B76] to-[#AED5C6] text-[#FFFFFF]'
                  : 'border-[1px] border-[#DAD8D7] text-[#687276] hover:bg-gray-50'
              }`}
            >
              {cat.displayName}
            </button>
          ))}
        </div>
      )}

      {filteredServices.length === 0 ? (
        <p className="font-inter text-sm text-[#586971]">{t('serviceListing.noResults')}</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-2 md:grid-cols-3 md:items-stretch md:gap-4 lg:grid-cols-4 lg:gap-4">
          {filteredServices.map((item, index) => (
            <Servicescard
              key={item.id}
              images={item.icon}
              title={item.displayTitle}
              description={item.displayDescription}
              link={`/services/${item.slug}`}
              revealDelay={staggerDelay(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
