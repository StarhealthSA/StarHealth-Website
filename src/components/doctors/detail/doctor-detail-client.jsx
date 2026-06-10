'use client';

import { useContent } from '@/contexts/content-context';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '@/lib/content/localized';
import { resolveDoctorImage } from '@/lib/content/doctor-images';
import { getDoctorDisplayLine } from '@/lib/content/normalize-doctor';
import { findSpecializationName } from '@/lib/content/specialization-utils';
import DoctorBanner from './doctor_banner';
import DoctorProfile from './doctor_profile';
import DoctorServices from './doctor_services';
import DoctorConsultation from './doctor_consultation';

export default function DoctorDetailClient({ doctor: rawDoctor, relatedServices }) {
  const { i18n } = useTranslation();
  const { specializations } = useContent();
  const lang = i18n.language;

  const doctor = {
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
  };

  return (
    <div className="bg-white">
      <DoctorBanner doctor={doctor} />
      <DoctorProfile doctor={doctor} />
      <DoctorServices doctor={doctor} relatedServices={relatedServices} />
      <DoctorConsultation doctor={doctor} />
    </div>
  );
}
