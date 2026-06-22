'use client';

import arrow from '../../assets/contact/contactus_arrow.svg';
import Reveal from '../reveal';
import FaqAccordion, { FaqSectionTitle } from '@/components/shared/faq-accordion';
import { getFaqItemsFromTranslations } from '@/lib/faq/get-faq-items';
import { useTranslation } from 'react-i18next';

function FaqSection() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const faqs = getFaqItemsFromTranslations(t, 'contactPage.faq');

  return (
    <div className="bg-white pb-[40px] lg:py-[80px]">
      <div className="mx-[30px] lg:mx-[120px]">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:gap-12">
          <Reveal className={`${isRTL ? 'pl-0 lg:pl-8' : 'pr-0 lg:pr-8'}`}>
            <FaqSectionTitle className="mb-0 mt-5 md:hidden">
              {t('contactPage.faq.title')}
            </FaqSectionTitle>
            <FaqSectionTitle className="mb-3 hidden md:block lg:mb-6">
              {t('contactPage.faq.titleLine1')}
              <br />
              {t('contactPage.faq.titleLine2')}
            </FaqSectionTitle>

            <p className="mb-6 font-inter text-[14px] font-normal leading-[22px] text-[#687276] lg:text-[16px] lg:leading-[24px]">
              {t('contactPage.faq.helpText')}
            </p>

            <div className="flex flex-row items-center">
              <h1 className={`flex items-center font-inter text-[14px] font-semibold lg:text-[16px] ${isRTL ? 'ml-3' : 'mr-3'}`}>
                {t('contactPage.faq.contactUs')}
              </h1>
              <a href="mailto:contact@starhealth.sa">
                <img
                  src={arrow}
                  alt="arrow"
                  className={`h-[20px] w-[20px] md:h-[30px] md:w-[30px] ${isRTL ? 'rotate-180' : ''}`}
                />
              </a>
            </div>
          </Reveal>

          <FaqAccordion items={faqs} />
        </div>
      </div>
    </div>
  );
}

export default FaqSection;
