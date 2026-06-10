'use client';

import Reveal from '@/components/reveal';
import DoctorSectionHeader from '@/components/doctors/detail/doctor-section-header';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '@/lib/content/localized';

export default function ServiceProcedure({ service, lang }) {
  const { t } = useTranslation();
  const hasProcedure = getLocalizedText(service.procedureOverview, lang);
  const hasDuration = getLocalizedText(service.treatmentDuration, lang);
  const hasPrep = getLocalizedText(service.preparationGuidelines, lang);

  if (!hasProcedure && !hasDuration && !hasPrep) return null;

  return (
    <section id="procedure" className="service-detail-section scroll-mt-32">
      <Reveal>
        <DoctorSectionHeader
          eyebrow={t('serviceDetail.treatment')}
          title={t('serviceDetail.procedure')}
          description={t('serviceDetail.procedureLead')}
        />
      </Reveal>
      <div className="mt-8 space-y-4">
        {hasProcedure && (
          <Reveal delay={80}>
            <div className="doctor-credential-card">
              <h3 className="font-inter text-sm font-semibold text-[#002333]">{t('serviceDetail.procedureOverview')}</h3>
              <p className="mt-3 font-inter text-sm leading-relaxed text-[#586971] whitespace-pre-line">
                {hasProcedure}
              </p>
            </div>
          </Reveal>
        )}
        {hasDuration && (
          <Reveal delay={120}>
            <div className="doctor-credential-card">
              <h3 className="font-inter text-sm font-semibold text-[#002333]">{t('serviceDetail.treatmentDuration')}</h3>
              <p className="mt-3 font-inter text-sm text-[#586971]">{hasDuration}</p>
            </div>
          </Reveal>
        )}
        {hasPrep && (
          <Reveal delay={160}>
            <div className="doctor-credential-card">
              <h3 className="font-inter text-sm font-semibold text-[#002333]">{t('serviceDetail.preparation')}</h3>
              <p className="mt-3 font-inter text-sm leading-relaxed text-[#586971] whitespace-pre-line">
                {hasPrep}
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
