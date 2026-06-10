'use client';

import Reveal from '@/components/reveal';
import { useTranslation } from 'react-i18next';

export default function DoctorBanner({ doctor }) {
  const { t } = useTranslation();

  return (
    <section className="bg-gradient-to-br from-[#037B76] to-[#AED5C6] px-[20px] py-14 md:px-[60px] lg:px-[120px] lg:py-20">
      <Reveal className="mx-auto flex max-w-6xl flex-col items-center gap-8 md:flex-row md:items-start">
        <img
          src={doctor.image}
          alt={doctor.displayName}
          className="h-48 w-48 rounded-2xl border-4 border-white object-cover shadow-lg md:h-56 md:w-56"
        />
        <div className="text-center md:text-left">
          <h1 className="font-inter text-3xl font-semibold text-white lg:text-5xl">{doctor.displayName}</h1>
          {doctor.displayQualification && (
            <p className="mt-3 font-inter text-lg text-white/90">{doctor.displayQualification}</p>
          )}
          {doctor.displayDesignation && (
            <p className="mt-1 font-inter text-base text-white/80">{doctor.displayDesignation}</p>
          )}
          <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
            {doctor.displaySpecialization && (
              <span className="rounded-full bg-white/20 px-4 py-1 text-sm text-white">
                {doctor.displaySpecialization}
              </span>
            )}
            {doctor.displaySubSpecialization && (
              <span className="rounded-full bg-white/20 px-4 py-1 text-sm text-white">
                {doctor.displaySubSpecialization}
              </span>
            )}
            {doctor.experienceYears && (
              <span className="rounded-full bg-white/20 px-4 py-1 text-sm text-white">
                {doctor.experienceYears} {t('doctorDetail.yearsExperience')}
              </span>
            )}
          </div>
          {doctor.displayShortIntro && (
            <p className="mt-6 max-w-2xl font-inter text-base leading-relaxed text-white/90">
              {doctor.displayShortIntro}
            </p>
          )}
        </div>
      </Reveal>
    </section>
  );
}
