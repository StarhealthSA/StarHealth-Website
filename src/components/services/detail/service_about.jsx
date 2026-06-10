'use client';

import Reveal from '@/components/reveal';
import DoctorSectionHeader from '@/components/doctors/detail/doctor-section-header';
import { useTranslation } from 'react-i18next';

export default function ServiceAbout({ service }) {
  const { t } = useTranslation();

  if (!service.displayFullDescription) return null;

  return (
    <section id="about" className="service-detail-section scroll-mt-32">
      <Reveal>
        <DoctorSectionHeader
          eyebrow={t('serviceDetail.overview')}
          title={t('serviceDetail.aboutService')}
          description={t('serviceDetail.aboutLead')}
        />
      </Reveal>
      <Reveal delay={80}>
        <div className="doctor-credential-card mt-8">
          <p className="font-inter text-base leading-relaxed text-[#586971] whitespace-pre-line">
            {service.displayFullDescription}
          </p>
        </div>
      </Reveal>
    </section>
  );
}
