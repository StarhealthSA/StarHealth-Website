'use client';

import { useMemo, useState } from 'react';
import Servicescard from '@/components/services_card';
import { staggerDelay } from '@/lib/stagger_delay';
import { useTranslation } from 'react-i18next';
import { useLocalizedServices } from '@/contexts/content-context';
import SearchInput from '@/components/shared/search-input';

export default function ServiceCardsGrid({ className = '' }) {
  const { t, i18n } = useTranslation();
  const services = useLocalizedServices(i18n.language);
  const [search, setSearch] = useState('');

  const filteredServices = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return services;
    return services.filter((item) => {
      const title = item.displayTitle?.toLowerCase() || '';
      const description = item.displayDescription?.toLowerCase() || '';
      return title.includes(query) || description.includes(query);
    });
  }, [services, search]);

  return (
    <div className={className}>
      <div className="mb-4 max-w-xl">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('serviceListing.searchPlaceholder')}
        />
      </div>

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
