'use client';

import { useState } from 'react';
import Reveal from '@/components/reveal';
import Button from '@/components/web_button';
import AppointmentModal from '@/components/doctors/appointment-modal';
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

export default function DoctorConsultation({ doctor }) {
  const { t, i18n } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  const timings = getLocalizedText(doctor.consultationTimings, i18n.language);
  const affiliation = getLocalizedText(doctor.affiliation, i18n.language);

  return (
    <>
      <section className="px-[20px] py-14 md:px-[60px] lg:px-[120px] lg:py-20">
        <Reveal className="mx-auto max-w-6xl rounded-2xl border border-[#E9E7E6] bg-white p-8 lg:p-12">
          <h2 className="font-inter text-2xl font-semibold text-[#002333]">{t('doctorDetail.consultation')}</h2>

          {timings && (
            <div className="mt-6">
              <h3 className="font-inter text-sm font-semibold uppercase tracking-wide text-[#037B76]">
                {t('doctorDetail.consultationHours')}
              </h3>
              <p className="mt-2 font-inter text-base text-[#687276]">{timings}</p>
            </div>
          )}

          {(doctor.workingDays || []).length > 0 && (
            <div className="mt-6">
              <h3 className="font-inter text-sm font-semibold uppercase tracking-wide text-[#037B76]">
                {t('doctorDetail.workingDays')}
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {doctor.workingDays.map((day) => (
                  <span key={day} className="rounded-lg bg-[#E9F5F3] px-3 py-1 text-sm text-[#037B76]">
                    {t(DAY_LABELS[day] || day)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {doctor.onlineConsultationAvailable && (
            <p className="mt-4 font-inter text-sm text-[#037B76]">{t('doctorDetail.onlineAvailable')}</p>
          )}

          {affiliation && (
            <div className="mt-6">
              <h3 className="font-inter text-sm font-semibold uppercase tracking-wide text-[#037B76]">
                {t('doctorDetail.affiliation')}
              </h3>
              <p className="mt-2 font-inter text-base text-[#687276]">{affiliation}</p>
            </div>
          )}

          <div className="mt-8">
            <Button text={t('doctorDetail.bookAppointment')} onClick={() => setShowModal(true)} />
          </div>
        </Reveal>
      </section>

      <AppointmentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        preselectedDoctor={doctor.displayName}
      />
    </>
  );
}
