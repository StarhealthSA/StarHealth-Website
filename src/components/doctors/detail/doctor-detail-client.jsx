'use client';

import { useMemo, useState } from 'react';
import { useContent } from '@/contexts/content-context';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '@/lib/content/localized';
import { resolveDoctorImage } from '@/lib/content/doctor-images';
import { getDoctorDisplayLine } from '@/lib/content/normalize-doctor';
import { findSpecializationName } from '@/lib/content/specialization-utils';
import { sortReels } from '@/lib/content/reel-utils';
import AppointmentModal from '@/components/doctors/appointment-modal';
import DoctorBanner from './doctor_banner';
import DoctorStickyNav from './doctor-sticky-nav';
import DoctorSidebar from './doctor-sidebar';
import DoctorProfile from './doctor_profile';
import DoctorReels from './doctor_reels';
import DoctorServices from './doctor_services';
import DoctorConsultation from './doctor_consultation';

export default function DoctorDetailClient({ doctor: rawDoctor, relatedServices }) {
  const { i18n, t } = useTranslation();
  const { specializations } = useContent();
  const [showModal, setShowModal] = useState(false);
  const lang = i18n.language;

  const doctor = useMemo(() => ({
    ...rawDoctor,
    displayName: getLocalizedText(rawDoctor.name, lang),
    displayQualification: getLocalizedText(rawDoctor.qualification, lang),
    displayDesignation: getLocalizedText(rawDoctor.designation, lang),
    displayShortIntro: getLocalizedText(rawDoctor.shortIntro, lang),
    displayBiography: getLocalizedText(rawDoctor.biography, lang),
    displaySpecialty: getDoctorDisplayLine(rawDoctor, lang),
    displaySpecialization: findSpecializationName(specializations, rawDoctor.specializationId, lang),
    displaySubSpecialization: findSpecializationName(specializations, rawDoctor.subSpecializationId, lang),
    image: resolveDoctorImage(rawDoctor),
  }), [rawDoctor, lang, specializations]);

  const sections = useMemo(() => {
    const items = [];

    if (doctor.displayBiography || (doctor.areasOfExpertise || []).length) {
      items.push({ id: 'about', label: t('doctorDetail.biography') });
    } else {
      items.push({ id: 'about', label: t('doctorDetail.aboutDoctor') });
    }

    if ((doctor.areasOfExpertise || []).length) {
      items.push({ id: 'expertise', label: t('doctorDetail.expertise') });
    }

    const hasCredentials = (doctor.certifications || []).length || (doctor.awards || []).length;
    if (hasCredentials) {
      items.push({ id: 'credentials', label: t('doctorDetail.credentials') });
    }

    if ((doctor.galleryImages || []).length) {
      items.push({ id: 'gallery', label: t('doctorDetail.gallery') });
    }

    if (sortReels(rawDoctor.reels).length) {
      items.push({ id: 'reels', label: t('doctorDetail.reels') });
    }

    if ((doctor.treatmentsOffered || []).length) {
      items.push({ id: 'treatments', label: t('doctorDetail.treatmentsOffered') });
    }

    if (relatedServices.length) {
      items.push({ id: 'services', label: t('doctorDetail.relatedServices') });
    }

    items.push({ id: 'consultation', label: t('doctorDetail.consultation') });

    return items;
  }, [doctor, rawDoctor.reels, relatedServices.length, t]);

  const openBooking = () => setShowModal(true);

  return (
    <div className="doctor-detail-page bg-[#FAFAF9]">
      <DoctorBanner doctor={doctor} onBookClick={openBooking} />
      <DoctorStickyNav sections={sections} />

      <div className="doctor-detail-container py-10 md:py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_320px]">
          <main className="min-w-0 space-y-16">
            <DoctorProfile doctor={doctor} />
            <DoctorReels doctor={rawDoctor} />
            <DoctorServices doctor={doctor} relatedServices={relatedServices} />
            <DoctorConsultation doctor={doctor} onBookClick={openBooking} />
          </main>
          <DoctorSidebar doctor={doctor} onBookClick={openBooking} />
        </div>
      </div>

      <div className="doctor-mobile-cta fixed inset-x-0 bottom-0 z-40 border-t border-[#E9E7E6] bg-white/95 p-4 backdrop-blur-md lg:hidden">
        <button
          type="button"
          onClick={openBooking}
          className="doctor-cta-button w-full rounded-xl px-6 py-3.5 font-inter text-sm font-semibold text-white"
        >
          {t('doctorDetail.bookNow')}
        </button>
      </div>

      <div className="h-20 lg:hidden" aria-hidden />

      <AppointmentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        preselectedDoctor={doctor.displayName}
      />
    </div>
  );
}
