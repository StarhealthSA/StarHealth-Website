'use client';

import Reveal from '@/components/reveal';
import ServiceSectionHeader from './service-section-header';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '@/lib/content/localized';

export default function ServiceRecovery({ service, lang }) {
  const { t } = useTranslation();
  const recovery = getLocalizedText(service.recoveryInfo, lang);
  const risks = getLocalizedText(service.risksAndPrecautions, lang);
  const suitable = (service.suitableFor || []).filter((item) => getLocalizedText(item, lang));

  if (!recovery && !risks && !suitable.length) return null;

  return (
    <section id="recovery" className="service-landing-section service-landing-section--muted">
      <div className="service-detail-container">
        <Reveal>
          <ServiceSectionHeader
            label={t('serviceDetail.afterCare')}
            title={t('serviceDetail.recovery')}
            description={t('serviceDetail.recoveryLead')}
            align="center"
            className="max-w-3xl"
          />
        </Reveal>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {recovery && (
            <Reveal delay={80}>
              <div className="service-landing-info-panel h-full">
                <h3 className="font-inter text-sm font-semibold text-[#002333]">{t('serviceDetail.recoveryProcess')}</h3>
                <p className="mt-3 whitespace-pre-line font-inter text-sm leading-relaxed text-[#586971]">{recovery}</p>
              </div>
            </Reveal>
          )}
          {risks && (
            <Reveal delay={120}>
              <div className="service-landing-info-panel h-full">
                <h3 className="font-inter text-sm font-semibold text-[#002333]">{t('serviceDetail.risks')}</h3>
                <p className="mt-3 whitespace-pre-line font-inter text-sm leading-relaxed text-[#586971]">{risks}</p>
              </div>
            </Reveal>
          )}
        </div>

        {suitable.length > 0 && (
          <Reveal delay={160}>
            <div className="mt-5 service-landing-info-panel">
              <h3 className="font-inter text-sm font-semibold text-[#002333]">{t('serviceDetail.suitableFor')}</h3>
              <div className="mt-4 flex flex-wrap justify-center gap-2 lg:justify-start">
                {suitable.map((item, index) => (
                  <span key={index} className="service-landing-pill">
                    {getLocalizedText(item, lang)}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
