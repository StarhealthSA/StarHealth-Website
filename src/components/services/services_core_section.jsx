'use client';

import Reveal from '@/components/reveal';
import ServiceCardsGrid from '@/components/services/service_cards_grid';
import { useTranslation } from 'react-i18next';

export default function ServicesCoreSection() {
  const { t } = useTranslation();

  return (
    <section className="nd-bg nd-bg--blue px-[20px] py-14 md:px-[30px] lg:px-[120px] lg:py-20">
      <Reveal>
        <h2 className="text-[28px] font-semibold text-[#002333]">
          {t('servicesPage.coreServices.title')}
        </h2>
        <p className="mt-3 max-w-3xl text-[15px] leading-[25px] text-[#586971]">
          {t('servicesPage.coreServices.description')}
        </p>
      </Reveal>
      <ServiceCardsGrid className="mt-7" />
    </section>
  );
}
