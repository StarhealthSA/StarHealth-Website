'use client';

import DoctorsCard from '@/components/doctors_card';
import Reveal, { staggerDelay } from '@/components/reveal';
import ServiceSectionHeader from './service-section-header';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '@/lib/content/localized';
import { resolveDoctorImage } from '@/lib/content/doctor-images';

export default function ServiceDoctors({ matchedDoctors = [], lang }) {
  const { t } = useTranslation();

  if (!matchedDoctors.length) return null;

  const localized = matchedDoctors.map((doctor) => ({
    ...doctor,
    displayName: getLocalizedText(doctor.name, lang),
    displaySpecialty: getLocalizedText(doctor.designation, lang) || getLocalizedText(doctor.qualification, lang),
    image: resolveDoctorImage(doctor),
  }));

  return (
    <section id="doctors" className="service-landing-section service-landing-section--green">
      <div className="service-detail-container">
        <Reveal>
          <ServiceSectionHeader
            label={t('serviceDetail.specialists')}
            title={t('serviceDetail.meetDoctors')}
            description={t('serviceDetail.meetDoctorsLead')}
          />
        </Reveal>
        <div className="scrollbar-hide mt-8 flex gap-6 overflow-x-auto pb-2 lg:grid lg:grid-cols-4 lg:overflow-visible">
          {localized.map((doctor, index) => (
            <div key={doctor.id} className="min-w-[220px] flex-shrink-0 lg:min-w-0">
              <DoctorsCard
                imgs={doctor.image}
                name={doctor.displayName}
                specialty={doctor.displaySpecialty}
                slug={doctor.slug}
                doctorId={doctor.id}
                revealDelay={staggerDelay(index)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
