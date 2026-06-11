'use client';

import Reveal from '@/components/reveal';
import ServiceSectionHeader from './service-section-header';
import { useTranslation } from 'react-i18next';

export default function ServiceAbout({ service }) {
  const { t } = useTranslation();

  if (!service.displayFullDescription) return null;

  return (
    <section id="overview" className="service-landing-section">
      <div className="service-detail-container">
        <Reveal>
          <ServiceSectionHeader
            label={t('serviceDetail.overview')}
            title={t('serviceDetail.aboutService')}
            description={t('serviceDetail.aboutLead')}
            align="center"
            className="max-w-3xl"
          />
        </Reveal>
        <Reveal delay={80}>
          <div className="service-landing-prose mx-auto mt-10 max-w-3xl text-center">
            <p className="whitespace-pre-line">{service.displayFullDescription}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
