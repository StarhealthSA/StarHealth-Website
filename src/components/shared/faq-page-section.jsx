'use client';

import Reveal from '@/components/reveal';
import FaqAccordion, { FaqSectionTitle } from '@/components/shared/faq-accordion';
import { getFaqItemsFromTranslations } from '@/lib/faq/get-faq-items';
import { useTranslation } from 'react-i18next';

export default function FaqPageSection({
  titleKey,
  faqPrefix = 'contactPage.faq',
  faqKeys,
  className = 'px-[20px] md:px-[30px] lg:px-[120px] pb-16 lg:pb-20',
  maxWidthClassName = 'max-w-3xl',
}) {
  const { t } = useTranslation();
  const items = getFaqItemsFromTranslations(t, faqPrefix, faqKeys);

  if (!items.length) return null;

  return (
    <section className={className}>
      <div className={`mx-auto w-full ${maxWidthClassName}`}>
        <Reveal>
          <FaqSectionTitle className="text-center">{t(titleKey)}</FaqSectionTitle>
        </Reveal>
        <div className="mt-6">
          <FaqAccordion items={items} />
        </div>
      </div>
    </section>
  );
}
