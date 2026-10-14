'use client';

import { useTranslation } from 'react-i18next';

function BottomNav() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[64px] flex-col items-center justify-center gap-1 bg-[#1F4745] px-4 py-3 sm:flex-row sm:gap-3">
      <p className="text-center font-inter text-[14px] font-normal leading-[22px] text-white lg:text-[16px] lg:leading-[24px]">
        {t('footer.companyName')}
      </p>
      <span className="hidden text-[#FFFFFF66] sm:inline" aria-hidden>
        |
      </span>
      <p className="text-center font-inter text-[13px] font-normal leading-[20px] text-[#FFFFFFCC] lg:text-[14px]">
        {t('footer.designedBy')}{' '}
        <a
          href="https://www.mentecode.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-white underline-offset-2 transition-colors hover:text-[#AED5C6] hover:underline"
        >
          Mentecode
        </a>
      </p>
    </div>
  );
}

export default BottomNav;
