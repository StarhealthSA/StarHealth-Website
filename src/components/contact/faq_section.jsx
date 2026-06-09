'use client';

import { useState } from 'react';
import arrow from '../../assets/contact/contactus_arrow.svg';
import Reveal, { staggerDelay } from '../reveal';
import { useTranslation } from 'react-i18next';

function FaqSection() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [activeIndex, setActiveIndex] = useState(0);

  const faqs = [
    {
      question: t('contactPage.faq.questions.q1.question'),
      answer: t('contactPage.faq.questions.q1.answer')
    },
    {
      question: t('contactPage.faq.questions.q2.question'),
      answer: t('contactPage.faq.questions.q2.answer')
    },
    {
      question: t('contactPage.faq.questions.q3.question'),
      answer: t('contactPage.faq.questions.q3.answer')
    },
    {
      question: t('contactPage.faq.questions.q4.question'),
      answer: t('contactPage.faq.questions.q4.answer')
    },
    {
      question: t('contactPage.faq.questions.q5.question'),
      answer: t('contactPage.faq.questions.q5.answer')
    },
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="bg-white pb-[40px] lg:py-[80px]">
      <div className="mx-[30px] lg:mx-[120px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:gap-12 ">
          <Reveal className={`${isRTL ? 'pl-0 lg:pl-8' : 'pr-0 lg:pr-8'}`}>
            <h2 className='md:hidden font-inter mt-5 font-medium text-[24px] leading-[32px] text-[#002333] mb-0'>
              {t('contactPage.faq.title')}
            </h2>
            <h2 className="hidden md:block font-medium text-[24px] lg:text-[44px] font-inter text-[#002333] mb-3 lg:mb-6">
              {t('contactPage.faq.titleLine1')}
              <br />
              {t('contactPage.faq.titleLine2')}
            </h2>

            <p className="text-[14px] lg:text-[16px] leading-[22px] lg:leading-[24px] font-normal font-inter text-[#687276] mb-6">
              {t('contactPage.faq.helpText')}
            </p>

            <div className='flex flex-row items-center'>
              <h1 className={`flex items-center text-[14px] lg:text-[16px] font-semibold font-inter ${isRTL ? 'ml-3' : 'mr-3'}`}>
                {t('contactPage.faq.contactUs')}
              </h1>
              <a href="mailto:contact@starhealth.sa">
                <img src={arrow} alt='arrow' className={`w-[20px] h-[20px] md:w-[30px] md:h-[30px] ${isRTL ? 'rotate-180' : ''}`} />
              </a>
            </div>
          </Reveal>

          <div className="space-y-0">
            {faqs.map((faq, index) => (
              <Reveal key={index} delay={staggerDelay(index, 70)}>
              <div className="border-b border-[#DAD8D7]">
                <button
                  className={`w-full py-4 lg:py-5 ${isRTL ? 'text-right' : 'text-left'} flex items-center justify-between transition-colors duration-200 ${activeIndex === index ? 'bg-[#FFFFFF]' : ''}`}
                  onClick={() => toggleAccordion(index)}
                >
                  <span className="font-medium text-[16px] lg:text-[20px] font-inter text-[#002333]">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-5 h-5 text-[#027B76] flex-shrink-0 transition-transform duration-200 ${isRTL ? 'ml-2' : 'mr-2'} ${activeIndex === index ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${activeIndex === index ? 'max-h-96' : 'max-h-0'}`}
                >
                  <div className="pb-4 lg:pb-5 px-1">
                    <p className={`text-[#687276] text-[14px] lg:text-[16px] leading-[22px] lg:leading-[24px] font-normal font-inter ${isRTL ? 'text-right' : 'text-left'}`}>
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FaqSection;