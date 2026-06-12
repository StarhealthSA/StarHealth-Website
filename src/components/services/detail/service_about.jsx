'use client';

import Reveal from '@/components/reveal';
import ServiceSectionHeader from './service-section-header';
import { useTranslation } from 'react-i18next';

export default function ServiceAbout({ service }) {
  const { t } = useTranslation();

  if (!service.displayFullDescription) return null;

  const aboutImage = service.galleryImages?.[0] || '';

  return (
    <section id="overview" className="service-landing-section service-landing-section--green">
      <div className="service-detail-container">
        {aboutImage ? (
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <Reveal>
                <ServiceSectionHeader
                  label={t('serviceDetail.overview')}
                  title={t('serviceDetail.aboutService')}
                  description={t('serviceDetail.aboutLead')}
                  align="start"
                />
              </Reveal>
              <Reveal delay={80}>
                <div className="service-landing-prose mt-6">
                  <p className="whitespace-pre-line">{service.displayFullDescription}</p>
                </div>
              </Reveal>
            </div>
            <Reveal delay={60}>
              <div className="service-landing-visual overflow-hidden">
                <img
                  src={aboutImage}
                  alt=""
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
            </Reveal>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </section>
  );
}
