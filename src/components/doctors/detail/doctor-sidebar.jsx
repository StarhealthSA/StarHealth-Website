'use client';

import Reveal from '@/components/reveal';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '@/lib/content/localized';

const DAY_LABELS = {
  sun: 'doctorDetail.days.sun',
  mon: 'doctorDetail.days.mon',
  tue: 'doctorDetail.days.tue',
  wed: 'doctorDetail.days.wed',
  thu: 'doctorDetail.days.thu',
  fri: 'doctorDetail.days.fri',
  sat: 'doctorDetail.days.sat',
};

export default function DoctorSidebar({ doctor, onBookClick }) {
  const { t, i18n } = useTranslation();
  const timings = getLocalizedText(doctor.consultationTimings, i18n.language);
  const hasSchedule = timings || (doctor.workingDays || []).length > 0;

  return (
    <aside className="hidden lg:block">
      <Reveal className="doctor-sidebar-card sticky top-36 space-y-6 rounded-3xl border border-[#E9E7E6] bg-white p-6 shadow-[0_24px_60px_rgba(0,35,51,0.08)]">
        <div className="flex items-center gap-4">
          <img
            src={doctor.image}
            alt={doctor.displayName}
            className="h-16 w-16 rounded-2xl object-cover ring-2 ring-[#AED5C6]/60"
          />
          <div>
            <p className="font-inter text-sm font-semibold text-[#002333]">{doctor.displayName}</p>
            {doctor.displaySpecialization && (
              <p className="mt-0.5 font-inter text-xs text-[#037B76]">{doctor.displaySpecialization}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {doctor.experienceYears && (
            <div className="rounded-2xl bg-[#F6F4F3] px-3 py-3 text-center">
              <p className="doctor-display-title text-2xl font-semibold text-[#037B76]">{doctor.experienceYears}+</p>
              <p className="mt-1 font-inter text-[11px] uppercase tracking-wide text-[#687276]">
                {t('doctorDetail.yearsExperience')}
              </p>
            </div>
          )}
          {doctor.onlineConsultationAvailable && (
            <div className="rounded-2xl bg-[#E9F5F3] px-3 py-3 text-center">
              <p className="text-lg">✦</p>
              <p className="mt-1 font-inter text-[11px] font-medium uppercase tracking-wide text-[#037B76]">
                {t('doctorDetail.onlineShort')}
              </p>
            </div>
          )}
        </div>

        {hasSchedule && (
          <div className="space-y-3 border-t border-[#E9E7E6] pt-5">
            <p className="font-inter text-xs font-semibold uppercase tracking-[0.16em] text-[#037B76]">
              {t('doctorDetail.quickInfo')}
            </p>
            {timings && (
              <p className="font-inter text-sm leading-relaxed text-[#586971]">{timings}</p>
            )}
            {(doctor.workingDays || []).length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {doctor.workingDays.map((day) => (
                  <span
                    key={day}
                    className="rounded-md bg-[#F6F4F3] px-2 py-1 font-inter text-[11px] font-medium text-[#586971]"
                  >
                    {t(DAY_LABELS[day] || day)}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={onBookClick}
          className="doctor-cta-button w-full rounded-xl px-5 py-3.5 font-inter text-sm font-semibold text-white"
        >
          {t('doctorDetail.bookNow')}
        </button>
      </Reveal>
    </aside>
  );
}
