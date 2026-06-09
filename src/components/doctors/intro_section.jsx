'use client';

import { useTranslation } from 'react-i18next';

function IntroSection() {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col items-center mt-2 px-[30px] lg:px-[120px]">
      <h1 className="text-[24px] lg:text-[44px] text-[#002333] font-medium font-inter leading-[32px] lg:leading-[56px]">
        {t('doctorsPage.title')}
      </h1>
      <p className="text-[14px] lg:text-[16px] text-[#687276] font-weight-[400px] text-center w-full md:w-5/9 leading-[22px] lg:leading-[24px] font-inter mt-4 mb-3">
        {t('doctorsPage.description')}
      </p>
    </section>
  );
}

export default IntroSection;
