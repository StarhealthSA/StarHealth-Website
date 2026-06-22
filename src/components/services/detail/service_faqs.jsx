'use client';

import Reveal from '@/components/reveal';
import FaqAccordion, { FaqSectionTitle } from '@/components/shared/faq-accordion';
import { getFaqItemsFromTranslations } from '@/lib/faq/get-faq-items';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '@/lib/content/localized';

export default function ServiceFaqs({ service, lang }) {
  const { t } = useTranslation();

  const cmsFaqs = (service.faqs || [])
    .filter((faq) => getLocalizedText(faq.question, lang) && getLocalizedText(faq.answer, lang))
    .map((faq, index) => ({
      id: `cms-${index}`,
      question: getLocalizedText(faq.question, lang),
      answer: getLocalizedText(faq.answer, lang),
    }));

  const fallbackFaqs = getFaqItemsFromTranslations(t, 'contactPage.faq');
  const faqs = cmsFaqs.length ? cmsFaqs : fallbackFaqs;

  if (!faqs.length) return null;

  return (
    <section id="faqs" className="service-landing-section">
      <div className="service-detail-container">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-inter text-xs font-semibold uppercase tracking-[0.18em] text-[#037B76]">
              {t('serviceDetail.questions')}
            </p>
            <FaqSectionTitle className="mt-2">
              {t('serviceDetail.faqs')}
            </FaqSectionTitle>
            <p className="mt-3 font-inter text-[14px] font-normal leading-[22px] text-[#687276] lg:text-[16px] lg:leading-[24px]">
              {t('serviceDetail.faqsLead')}
            </p>
          </div>
        </Reveal>
        <div className="mx-auto mt-10 w-full max-w-3xl">
          <FaqAccordion items={faqs} />
        </div>
      </div>
    </section>
  );
}
