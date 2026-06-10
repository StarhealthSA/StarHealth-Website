'use client';

import Reveal, { staggerDelay } from '@/components/reveal';
import ServiceSectionHeader from './service-section-header';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '@/lib/content/localized';

export default function ServiceProcedure({ service, lang }) {
  const { t } = useTranslation();
  const hasProcedure = getLocalizedText(service.procedureOverview, lang);
  const hasDuration = getLocalizedText(service.treatmentDuration, lang);
  const hasPrep = getLocalizedText(service.preparationGuidelines, lang);

  if (!hasProcedure && !hasDuration && !hasPrep) return null;

  const steps = hasProcedure
    ? hasProcedure.split(/\n+/).map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <section id="procedure" className="service-landing-section">
      <div className="service-detail-container">
        <Reveal>
          <ServiceSectionHeader
            label={t('serviceDetail.treatment')}
            title={t('serviceDetail.procedure')}
            description={t('serviceDetail.procedureLead')}
          />
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          {steps.length > 0 && (
            <div className="space-y-4">
              {steps.map((step, index) => (
                <Reveal key={index} delay={staggerDelay(index)}>
                  <div className="service-landing-step">
                    <span className="service-landing-step-index">{index + 1}</span>
                    <p className="font-inter text-sm leading-relaxed text-[#586971]">{step}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          )}

          {steps.length === 0 && hasProcedure && (
            <Reveal delay={80}>
              <div className="service-landing-info-panel">
                <h3 className="font-inter text-sm font-semibold text-[#002333]">{t('serviceDetail.procedureOverview')}</h3>
                <p className="mt-3 whitespace-pre-line font-inter text-sm leading-relaxed text-[#586971]">{hasProcedure}</p>
              </div>
            </Reveal>
          )}

          <div className="space-y-4">
            {hasDuration && (
              <Reveal delay={120}>
                <div className="service-landing-highlight-card">
                  <p className="font-inter text-xs font-semibold uppercase tracking-wider text-[#037B76]">
                    {t('serviceDetail.treatmentDuration')}
                  </p>
                  <p className="mt-2 font-inter text-lg font-medium text-[#002333]">{hasDuration}</p>
                </div>
              </Reveal>
            )}
            {hasPrep && (
              <Reveal delay={160}>
                <div className="service-landing-info-panel">
                  <h3 className="font-inter text-sm font-semibold text-[#002333]">{t('serviceDetail.preparation')}</h3>
                  <p className="mt-3 whitespace-pre-line font-inter text-sm leading-relaxed text-[#586971]">{hasPrep}</p>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
