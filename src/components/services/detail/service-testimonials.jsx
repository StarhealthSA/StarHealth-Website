'use client';

import stars from '@/assets/home/stars.svg';
import avatar from '@/assets/home/avatar.svg';
import google from '@/assets/home/google.svg';
import Reveal from '@/components/reveal';
import ServiceSectionHeader from './service-section-header';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '@/lib/content/localized';

function TestimonialCard({ quote, name, isRTL }) {
  return (
    <div
      className="mx-3 flex min-h-[280px] w-[320px] flex-shrink-0 flex-col rounded-2xl border border-[#DAD8D7] bg-white p-5"
      style={isRTL ? { transform: 'scaleX(-1)' } : {}}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <img src={avatar} alt="" className="mr-3 h-[50px] rounded-full" />
          <h3 className="font-inter text-sm font-medium text-[#002333] sm:text-base">{name}</h3>
        </div>
        <img src={google} alt="" className="h-6 w-6" />
      </div>
      <img src={stars} alt="" className="mb-3 h-6 w-[135px]" />
      <p className="line-clamp-6 font-inter text-sm leading-relaxed text-[#687276] sm:text-base">{quote}</p>
    </div>
  );
}

export default function ServiceTestimonials({ marketing, lang }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const custom = (marketing?.testimonials || [])
    .filter((item) => getLocalizedText(item.quote, lang) && getLocalizedText(item.name, lang))
    .map((item) => ({
      quote: getLocalizedText(item.quote, lang),
      name: getLocalizedText(item.name, lang),
    }));

  const useGlobal = custom.length === 0 && marketing?.showGlobalTestimonials !== false;

  const globalPatients = [
    { commentKey: 'testimonials.patients.nadia.comment', nameKey: 'testimonials.patients.nadia.name' },
    { commentKey: 'testimonials.patients.subi.comment', nameKey: 'testimonials.patients.subi.name' },
    { commentKey: 'testimonials.patients.maria.comment', nameKey: 'testimonials.patients.maria.name' },
    { commentKey: 'testimonials.patients.rajesh.comment', nameKey: 'testimonials.patients.rajesh.name' },
    { commentKey: 'testimonials.patients.muntasr.comment', nameKey: 'testimonials.patients.muntasr.name' },
    { commentKey: 'testimonials.patients.amar.comment', nameKey: 'testimonials.patients.amar.name' },
  ];

  const items = custom.length
    ? custom
    : useGlobal
      ? globalPatients.map((p) => ({ quote: t(p.commentKey), name: t(p.nameKey) }))
      : [];

  if (!items.length) return null;

  const looped = [...items, ...items];

  return (
    <section id="testimonials" className="service-landing-section service-landing-section--muted">
      <div className="service-detail-container">
        <Reveal>
          <ServiceSectionHeader
            label={t('serviceDetail.patientStories')}
            title={t('serviceDetail.testimonialsTitle')}
            description={t('serviceDetail.testimonialsLead')}
            align="center"
            className="max-w-2xl"
          />
        </Reveal>
      </div>

      <div
        className="mt-8 w-full overflow-hidden"
        style={isRTL ? { transform: 'scaleX(-1)' } : {}}
      >
        <div dir="ltr" className="flex animate-marqueeAbout" style={{ animationDuration: '35s' }}>
          {looped.map((item, index) => (
            <TestimonialCard key={index} quote={item.quote} name={item.name} isRTL={isRTL} />
          ))}
        </div>
      </div>
    </section>
  );
}
