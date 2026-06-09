'use client';

import Servicescard from '@/components/services_card';
import { staggerDelay } from '@/lib/stagger_delay';
import { useTranslation } from 'react-i18next';
import { useLocalizedServices } from '@/contexts/content-context';

export default function ServiceCardsGrid({ link, className = '' }) {
  const { i18n } = useTranslation();
  const services = useLocalizedServices(i18n.language);

  return (
    <div className={`grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-4 ${className}`}>
      {services.map((item, index) => (
        <Servicescard
          key={item.id}
          images={item.icon}
          title={item.displayTitle}
          description={item.displayDescription}
          link={link}
          revealDelay={staggerDelay(index)}
        />
      ))}
    </div>
  );
}
