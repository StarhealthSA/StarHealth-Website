'use client';

import { useState } from 'react';
import Reveal, { staggerDelay } from '@/components/reveal';
import ServiceSectionHeader from './service-section-header';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '@/lib/content/localized';

export default function ServiceFaqs({ service, lang }) {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const faqs = (service.faqs || []).filter(
    (faq) => getLocalizedText(faq.question, lang) && getLocalizedText(faq.answer, lang)
  );

  if (!faqs.length) return null;

  return (
    <section id="faqs" className="service-landing-section">
      <div className="service-detail-container">
        <Reveal>
          <ServiceSectionHeader
            label={t('serviceDetail.questions')}
            title={t('serviceDetail.faqs')}
            description={t('serviceDetail.faqsLead')}
            align="center"
            className="max-w-2xl"
          />
        </Reveal>
        <div className="mx-auto mt-10 max-w-2xl space-y-3">
          {faqs.map((faq, index) => (
            <Reveal key={index} delay={staggerDelay(index)}>
              <div className="service-landing-faq">
                <button
                  type="button"
                  onClick={() => setActiveIndex(activeIndex === index ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start"
                >
                  <span className="font-inter text-sm font-semibold text-[#002333]">
                    {getLocalizedText(faq.question, lang)}
                  </span>
                  <span className="service-landing-faq-toggle">{activeIndex === index ? '−' : '+'}</span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    activeIndex === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <p className="border-t border-[#EEF2F1] px-5 py-4 font-inter text-sm leading-relaxed text-[#586971]">
                    {getLocalizedText(faq.answer, lang)}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
