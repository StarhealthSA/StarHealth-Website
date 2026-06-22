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
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('serviceListing.searchPlaceholder')}
          className="w-full rounded-xl border border-[#E9E7E6] bg-white px-4 py-3 font-inter text-sm text-[#002333] md:max-w-md"
        />
        <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setCategoryFilter('')}
            className={`shrink-0 rounded-full px-4 py-2 font-inter text-sm font-medium transition ${
              !categoryFilter ? 'bg-[#037B76] text-white' : 'bg-white text-[#586971] border border-[#E9E7E6]'
            }`}
          >
            {t('serviceListing.allCategories')}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryFilter(cat.id)}
              className={`shrink-0 rounded-full px-4 py-2 font-inter text-sm font-medium transition ${
                categoryFilter === cat.id ? 'bg-[#037B76] text-white' : 'bg-white text-[#586971] border border-[#E9E7E6]'
              }`}
            >
              {cat.displayName}
            </button>
          ))}
        </div>
      </div>

      {filteredServices.length === 0 ? (
        <p className="font-inter text-sm text-[#586971]">{t('serviceListing.noResults')}</p>
      ) : (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-4">
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
