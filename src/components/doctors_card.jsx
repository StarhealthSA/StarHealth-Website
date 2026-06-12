'use client';

import Link from 'next/link';
import arrow from '../assets/home/arrow_right.svg';
import { useState } from 'react';
import Reveal from './reveal';
import { useTranslation } from 'react-i18next';
import AppointmentModal from './doctors/appointment-modal';

function DoctorsCard(props) {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Reveal delay={props.revealDelay ?? 0} className="h-full">
        <div className="flex h-full flex-col justify-between rounded-[12px] border-[1px] border-[#E9E7E6] bg-[#FFFFFF] px-[20px] py-[30px] lg:mb-1">
          <Link href={props.slug ? `/doctors/${props.slug}` : '#'} className="block flex-1">
            <img src={props.imgs} alt="doctor" className="h-auto w-full object-cover" />
            <h1 className="mt-4 font-inter text-[16px] font-medium text-[#002333] lg:text-[20px]">{props.name}</h1>
            <p className="mt-2 font-inter text-[12px] font-medium text-[#687276] lg:text-[16px] lg:font-normal">{props.specialty}</p>
            {props.specialization && (
              <p className="mt-1 font-inter text-[12px] text-[#037B76]">{props.specialization}</p>
            )}
          </Link>
          <div className="mt-8 flex flex-row items-center justify-between md:mt-4 lg:mt-8">
            <h1 className="font-inter text-[14px] font-medium text-[#002333] lg:text-[16px]">{t('medicalTeam.appointment')}</h1>
            <img
              src={arrow}
              alt="arrow"
              onClick={() => setShowModal(true)}
              className="h-[30px] w-[30px] cursor-pointer hover:brightness-90 hover:saturate-0 hover:invert-[0.3] hover:filter"
            />
          </div>
        </div>
      </Reveal>

      <AppointmentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        preselectedDoctor={props.name}
        preselectedDoctorId={props.doctorId}
      />
    </>
  );
}

export default DoctorsCard;
