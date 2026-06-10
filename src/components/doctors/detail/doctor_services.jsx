'use client';

import Reveal, { staggerDelay } from '@/components/reveal';
import Servicescard from '@/components/services_card';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '@/lib/content/localized';
import { resolveServiceIcon } from '@/lib/content/service-icons';

export default function DoctorServices({ doctor, relatedServices = [] }) {
  const { t, i18n } = useTranslation();

  const treatments = (doctor.treatmentsOffered || []).map((item) =>
    getLocalizedText(item, i18n.language)
  ).filter(Boolean);

  return (
    <section className="bg-[#F6F4F3] px-[20px] py-14 md:px-[60px] lg:px-[120px] lg:py-20">
      <div className="mx-auto max-w-6xl">
        {treatments.length > 0 && (
          <Reveal>
            <h2 className="font-inter text-2xl font-semibold text-[#002333]">{t('doctorDetail.treatmentsOffered')}</h2>
            <ul className="mt-4 grid gap-2 md:grid-cols-2">
              {treatments.map((item, i) => (
                <li key={i} className="flex items-start gap-2 rounded-lg bg-white p-4 font-inter text-[#687276]">
                  <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#037B76]" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        {relatedServices.length > 0 && (
          <div className="mt-10">
            <Reveal>
              <h2 className="font-inter text-2xl font-semibold text-[#002333]">{t('doctorDetail.relatedServices')}</h2>
            </Reveal>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {relatedServices.map((service, index) => (
                <Servicescard
                  key={service.id}
                  images={resolveServiceIcon(service)}
                  title={getLocalizedText(service.title, i18n.language)}
                  description={getLocalizedText(service.description, i18n.language)}
                  link="/services"
                  revealDelay={staggerDelay(index)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
