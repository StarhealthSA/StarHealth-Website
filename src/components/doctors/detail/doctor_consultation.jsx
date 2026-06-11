'use client';

import Reveal from '@/components/reveal';
import DoctorSectionHeader from './doctor-section-header';
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

export default function DoctorConsultation({ doctor, onBookClick }) {
  const { t, i18n } = useTranslation();

  const timings = getLocalizedText(doctor.consultationTimings, i18n.language);
  const affiliation = getLocalizedText(doctor.affiliation, i18n.language);

  return (
    <section id="consultation" className="doctor-detail-section scroll-mt-32">
      <Reveal>
        <div className="doctor-consultation-band overflow-hidden rounded-[2rem]">
          <div className="grid gap-0">
            <div className="p-8 md:p-10 lg:p-12">
              <DoctorSectionHeader
                eyebrow={t('doctorDetail.scheduleVisit')}
                title={t('doctorDetail.consultation')}
                description={t('doctorDetail.consultationLead')}
                className="[&_.doctor-display-title]:text-white [&_p]:text-white/75 [&_p:first-child]:text-[#AED5C6]"
              />

              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {timings && (
                  <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
                    <p className="font-inter text-xs font-semibold uppercase tracking-[0.16em] text-[#AED5C6]">
                      {t('doctorDetail.consultationHours')}
                    </p>
                    <p className="mt-3 font-inter text-base leading-relaxed text-white/90">{timings}</p>
                  </div>
                )}

                {(doctor.workingDays || []).length > 0 && (
                  <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
                    <p className="font-inter text-xs font-semibold uppercase tracking-[0.16em] text-[#AED5C6]">
                      {t('doctorDetail.workingDays')}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {doctor.workingDays.map((day) => (
                        <span key={day} className="rounded-lg bg-white/15 px-3 py-1.5 font-inter text-sm text-white">
                          {t(DAY_LABELS[day] || day)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {affiliation && (
                  <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm sm:col-span-2">
                    <p className="font-inter text-xs font-semibold uppercase tracking-[0.16em] text-[#AED5C6]">
                      {t('doctorDetail.affiliation')}
                    </p>
                    <p className="mt-3 font-inter text-base leading-relaxed text-white/90">{affiliation}</p>
                  </div>
                )}
              </div>

              {doctor.onlineConsultationAvailable && (
                <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#AED5C6]/20 px-4 py-2 font-inter text-sm text-[#E9F5F3]">
                  <span className="h-2 w-2 rounded-full bg-[#39ff14]" />
                  {t('doctorDetail.onlineAvailable')}
                </p>
              )}
            </div>

            {/* <div className="flex flex-col justify-center border-t border-white/10 bg-[#002333]/30 p-8 md:p-10 lg:border-t-0 lg:border-s">
              <p className="font-inter text-sm uppercase tracking-[0.2em] text-[#AED5C6]">
                {t('doctorDetail.readyToVisit')}
              </p>
              <p className="doctor-display-title mt-3 text-2xl font-semibold text-white md:text-3xl">
                {doctor.displayName}
              </p>
              <p className="mt-3 font-inter text-sm leading-relaxed text-white/70">
                {t('doctorDetail.bookingNote')}
              </p>
              <button
                type="button"
                onClick={onBookClick}
                className="doctor-cta-button mt-8 w-full rounded-xl px-6 py-4 font-inter text-base font-semibold text-white"
              >
                {t('doctorDetail.bookAppointment')}
              </button>
            </div> */}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
