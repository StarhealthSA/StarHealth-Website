'use client';

import Reveal, { staggerDelay } from '@/components/reveal';
import Servicescard from '@/components/services_card';
import DoctorSectionHeader from './doctor-section-header';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '@/lib/content/localized';
import { resolveServiceIcon } from '@/lib/content/service-icons';

export default function DoctorServices({ doctor, relatedServices = [] }) {
  const { t, i18n } = useTranslation();

  const treatments = (doctor.treatmentsOffered || []).map((item) =>
    getLocalizedText(item, i18n.language)
  ).filter(Boolean);

  if (!treatments.length && !relatedServices.length) return null;

  return (
    <div className="space-y-16">
      {treatments.length > 0 && (
        <section id="treatments" className="doctor-detail-section scroll-mt-32">
          <Reveal>
            <DoctorSectionHeader
              eyebrow={t('doctorDetail.patientCare')}
              title={t('doctorDetail.treatmentsOffered')}
              description={t('doctorDetail.treatmentsLead')}
            />
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {treatments.map((item, i) => (
              <Reveal key={i} delay={staggerDelay(i)}>
                <div className="doctor-treatment-card flex items-start gap-4">
                  <span className="doctor-treatment-index">{String(i + 1).padStart(2, '0')}</span>
                  <p className="font-inter text-base leading-relaxed text-[#586971]">{item}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {relatedServices.length > 0 && (
        <section id="services" className="doctor-detail-section scroll-mt-32">
          <Reveal>
            <DoctorSectionHeader
              eyebrow={t('doctorDetail.starHealthServices')}
              title={t('doctorDetail.relatedServices')}
              description={t('doctorDetail.relatedServicesLead')}
            />
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {relatedServices.map((service, index) => (
              <Servicescard
                key={service.id}
                images={service.featuredImageUrl || service.imageUrl || resolveServiceIcon(service)}
                title={getLocalizedText(service.title, i18n.language)}
                description={getLocalizedText(service.shortDescription || service.description, i18n.language)}
                link={`/services/${service.slug}`}
                revealDelay={staggerDelay(index)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
