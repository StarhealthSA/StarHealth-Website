'use client';

import { useState } from 'react';
import Reveal, { staggerDelay } from '@/components/reveal';
import DoctorSectionHeader from '@/components/doctors/detail/doctor-section-header';
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
    <section id="faqs" className="service-detail-section scroll-mt-32">
      <Reveal>
        <DoctorSectionHeader
          eyebrow={t('serviceDetail.questions')}
          title={t('serviceDetail.faqs')}
          description={t('serviceDetail.faqsLead')}
        />
      </Reveal>
      <div className="mt-8 space-y-3">
        {faqs.map((faq, index) => (
          <Reveal key={index} delay={staggerDelay(index)}>
            <div className="overflow-hidden rounded-2xl border border-[#E9E7E6] bg-white">
              <button
                type="button"
                onClick={() => setActiveIndex(activeIndex === index ? -1 : index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start"
              >
                <span className="font-inter text-sm font-semibold text-[#002333]">
                  {getLocalizedText(faq.question, lang)}
                </span>
                <span className="text-[#037B76]">{activeIndex === index ? '−' : '+'}</span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  activeIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <p className="border-t border-[#E9E7E6] px-5 py-4 font-inter text-sm leading-relaxed text-[#586971]">
                  {getLocalizedText(faq.answer, lang)}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
