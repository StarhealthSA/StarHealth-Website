'use client';

import Link from 'next/link';
import { useState } from 'react';
import Reveal from './reveal';
import { useTranslation } from 'react-i18next';
import AppointmentModal from '@/components/doctors/appointment-modal';

function WhatNext() {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="w-full bg-[#F6F4F3] pt-10 pb-10">
      <Reveal className="mx-auto flex flex-col items-center justify-center px-[10px] lg:px-[20px]">
        <h1 className="text-[#002333] text-[24px] lg:text-[44px] font-inter font-medium leading-[32px] pt-[15px] lg:pt-[25px]">
          {t('whatNextSection.title')}
        </h1>
        <p className="text-[14px] lg:text-[16px] text-[#687276] font-normal text-center w-full md:w-3/4 lg:w-3/5 px-[30px] lg:px-[120px] leading-[22px] lg:leading-[24px] font-inter mt-[10px] lg:mt-[25px] mb-[15px]">
          {t('whatNextSection.modalDescription')}
        </p>

        <div className="mt-[25px] flex flex-col items-center justify-center gap-[10px] px-[20px] pb-[25px] md:w-full md:pb-[30px] lg:flex-row lg:gap-[20px] lg:px-[120px]">
          <button
            type="button"
            className="bg-gradient-to-tl from-[#037B76] to-[#AED5C6] hover:bg-gradient-to-br hover:from-[#037B76] hover:to-[#AED5C6] text-white font-inter font-semibold text-[14px] lg:text-[16px] w-[250px] px-4 py-2 sm:px-8 sm:py-3 rounded-lg"
            onClick={() => setShowModal(true)}
          >
            {t('whatNextSection.bookAppointment')}
          </button>

          <a href="tel:+966505730003">
            <button
              type="button"
              className="bg-gradient-to-tl from-[#037B76] to-[#AED5C6] hover:bg-gradient-to-br hover:from-[#037B76] hover:to-[#AED5C6] text-white font-inter font-semibold text-[14px] lg:text-[16px] w-[250px] px-4 py-2 sm:px-8 sm:py-3 rounded-lg"
            >
              {t('whatNextSection.specialities')}
            </button>
          </a>

          <Link href="https://maps.app.goo.gl/8niyr59pCeujLD6Y6?g_st=ac">
            <button
              type="button"
              className="bg-gradient-to-tl from-[#037B76] to-[#AED5C6] hover:bg-gradient-to-br hover:from-[#037B76] hover:to-[#AED5C6] text-white font-inter font-semibold text-[14px] lg:text-[16px] w-[250px] px-4 py-2 sm:px-8 sm:py-3 rounded-lg"
            >
              {t('whatNextSection.findLocation')}
            </button>
          </Link>
        </div>
      </Reveal>

      <AppointmentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}

export default WhatNext;
