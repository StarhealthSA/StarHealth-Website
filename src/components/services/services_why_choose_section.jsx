'use client';

import Reveal, { staggerDelay } from '@/components/reveal';
import { useTranslation } from 'react-i18next';
import whyPatientsImage from '@/assets/home/Why Patients Search for Star Health Services.png';
import familyHealthcareImage from '@/assets/home/Designed for Family Healthcare Journeys.png';
import clinicalQualityImage from '@/assets/home/Clinical Quality with Operational Clarity.png';

const CARDS = [
  { key: 'c1', image: whyPatientsImage },
  { key: 'c2', image: familyHealthcareImage },
  { key: 'c3', image: clinicalQualityImage },
];

export default function ServicesWhyChooseSection() {
  const { t } = useTranslation();

  return (
    <section className="px-[20px] md:px-[30px] lg:px-[120px] pb-14 lg:pb-20">
      <Reveal>
        <h2 className="text-[28px] font-semibold text-[#002333]">
          {t('servicesPage.whyChoose.title')}
        </h2>
      </Reveal>
      <div className="mt-6 grid gap-5 lg:grid-cols-3 lg:items-stretch">
        {CARDS.map((card, index) => (
          <Reveal key={card.key} delay={staggerDelay(index)} className="h-full">
            <article className="services-why-card flex h-full flex-col overflow-hidden rounded-2xl border border-[#d7e5e1] bg-white">
              <div className="relative h-52 overflow-hidden sm:h-56">
                <img
                  src={card.image}
                  alt={t(`servicesPage.whyChoose.cards.${card.key}.alt`)}
                  className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-[20px] font-semibold leading-[28px] text-[#0a3944]">
                  {t(`servicesPage.whyChoose.cards.${card.key}.title`)}
                </h3>
                <p className="mt-3 flex-1 text-[15px] leading-[25px] text-[#5e6f77]">
                  {t(`servicesPage.whyChoose.cards.${card.key}.text`)}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
