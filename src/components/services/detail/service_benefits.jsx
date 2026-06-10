'use client';

import Reveal, { staggerDelay } from '@/components/reveal';
import DoctorSectionHeader from '@/components/doctors/detail/doctor-section-header';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '@/lib/content/localized';

export default function ServiceBenefits({ service, lang }) {
  const { t } = useTranslation();
  const benefits = (service.benefits || []).filter((b) => getLocalizedText(b, lang));

  if (!benefits.length) return null;

  return (
    <section id="benefits" className="service-detail-section scroll-mt-32">
      <Reveal>
        <DoctorSectionHeader
          eyebrow={t('serviceDetail.whyChoose')}
          title={t('serviceDetail.benefits')}
          description={t('serviceDetail.benefitsLead')}
        />
      </Reveal>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {benefits.map((benefit, index) => (
          <Reveal key={index} delay={staggerDelay(index)}>
            <div className="doctor-treatment-card h-full">
              <p className="font-inter text-sm leading-relaxed text-[#586971]">
                {getLocalizedText(benefit, lang)}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
