'use client';

import Reveal, { staggerDelay } from '@/components/reveal';
import DoctorSectionHeader from '@/components/doctors/detail/doctor-section-header';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '@/lib/content/localized';

export default function ServiceRecovery({ service, lang }) {
  const { t } = useTranslation();
  const recovery = getLocalizedText(service.recoveryInfo, lang);
  const risks = getLocalizedText(service.risksAndPrecautions, lang);
  const suitable = (service.suitableFor || []).filter((item) => getLocalizedText(item, lang));

  if (!recovery && !risks && !suitable.length) return null;

  return (
    <section id="recovery" className="service-detail-section scroll-mt-32">
      <Reveal>
        <DoctorSectionHeader
          eyebrow={t('serviceDetail.afterCare')}
          title={t('serviceDetail.recovery')}
          description={t('serviceDetail.recoveryLead')}
        />
      </Reveal>
      <div className="mt-8 space-y-4">
        {recovery && (
          <Reveal delay={80}>
            <div className="doctor-credential-card">
              <h3 className="font-inter text-sm font-semibold text-[#002333]">{t('serviceDetail.recoveryProcess')}</h3>
              <p className="mt-3 font-inter text-sm leading-relaxed text-[#586971] whitespace-pre-line">{recovery}</p>
            </div>
          </Reveal>
        )}
        {risks && (
          <Reveal delay={120}>
            <div className="doctor-credential-card">
              <h3 className="font-inter text-sm font-semibold text-[#002333]">{t('serviceDetail.risks')}</h3>
              <p className="mt-3 font-inter text-sm leading-relaxed text-[#586971] whitespace-pre-line">{risks}</p>
            </div>
          </Reveal>
        )}
        {suitable.length > 0 && (
          <Reveal delay={160}>
            <div className="doctor-credential-card">
              <h3 className="font-inter text-sm font-semibold text-[#002333]">{t('serviceDetail.suitableFor')}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {suitable.map((item, index) => (
                  <span
                    key={index}
                    className="rounded-full border border-[#D8E7E4] bg-[#F3FAF8] px-3 py-1.5 font-inter text-xs font-medium text-[#037B76]"
                  >
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
