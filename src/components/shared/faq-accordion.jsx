'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Reveal, { staggerDelay } from '@/components/reveal';

export function FaqSectionTitle({ children, className = '' }) {
  return (
    <h2
      className={`font-inter text-[24px] font-medium leading-[32px] text-[#002333] lg:text-[44px] lg:leading-[56px] ${className}`}
    >
      {children}
    </h2>
  );
}

export default function FaqAccordion({
  items = [],
  defaultOpenIndex = 0,
  reveal = true,
  revealStagger = 70,
  className = '',
}) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [activeIndex, setActiveIndex] = useState(defaultOpenIndex);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  if (!items.length) return null;

  return (
    <div className={`space-y-0 ${className}`}>
      {items.map((faq, index) => {
        const item = (
          <div className="border-b border-[#DAD8D7]">
            <button
              type="button"
              className={`flex w-full items-center justify-between py-4 transition-colors duration-200 lg:py-5 ${
                isRTL ? 'text-right' : 'text-left'
              }`}
              onClick={() => toggleAccordion(index)}
            >
              <span className="font-inter text-[16px] font-medium text-[#002333] lg:text-[20px]">
                {faq.question}
              </span>
              <svg
                className={`h-5 w-5 flex-shrink-0 text-[#027B76] transition-transform duration-200 ${
                  isRTL ? 'ml-2' : 'mr-2'
                } ${activeIndex === index ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                activeIndex === index ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <div className="px-1 pb-4 lg:pb-5">
                <p
                  className={`font-inter text-[14px] font-normal leading-[22px] text-[#687276] lg:text-[16px] lg:leading-[24px] ${
                    isRTL ? 'text-right' : 'text-left'
                  }`}
                >
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        );

        if (!reveal) {
          return <div key={faq.id || index}>{item}</div>;
        }

        return (
          <Reveal key={faq.id || index} delay={staggerDelay(index, revealStagger)}>
            {item}
          </Reveal>
        );
      })}
    </div>
  );
}
