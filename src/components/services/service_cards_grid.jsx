'use client';

import Servicescard from '@/components/services_card';
import { staggerDelay } from '@/lib/stagger_delay';
import { useTranslation } from 'react-i18next';
import { SERVICE_ITEMS } from './service_items';

export default function ServiceCardsGrid({ link, className = '' }) {
  const { t } = useTranslation();

  return (
    <div className={`grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-4 ${className}`}>
      {SERVICE_ITEMS.map((item, index) => (
        <Servicescard
          key={item.titleKey}
          images={item.imgSrc}
          title={t(item.titleKey)}
          description={t(item.descriptionKey)}
          link={link}
          revealDelay={staggerDelay(index)}
        />
      ))}
    </div>
  );
}
