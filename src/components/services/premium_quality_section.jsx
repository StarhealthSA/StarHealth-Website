'use client';

import premiumQuality from '@/assets/home/treatment.jpg';
import Reveal, { staggerDelay } from '@/components/reveal';
import { useTranslation } from 'react-i18next';

const STEP_KEYS = ['s1', 's2', 's3', 's4'];

export default function PremiumQualitySection() {
  const { t } = useTranslation();
  const process = STEP_KEYS.map((key) => ({
    key,
    title: t(`servicesPage.premiumQuality.steps.${key}.title`),
    body: t(`servicesPage.premiumQuality.steps.${key}.body`),
  }));

  return (
    <Reveal>
      <div className="overflow-hidden rounded-3xl bg-[#063330] text-white">
        <div className="grid md:grid-cols-2 md:items-stretch">
          <div className="flex flex-col justify-center p-8 md:h-full md:p-10 lg:p-12">
            <h2 className="text-[28px] font-semibold leading-[36px]">
              {t('servicesPage.premiumQuality.title')}
            </h2>
            <p className="mt-3 text-[15px] leading-[25px] text-[#c9e2d9]">
              {t('servicesPage.premiumQuality.description')}
            </p>
            <div className="premium-quality-process-grid mt-6 grid flex-1 gap-4 sm:grid-cols-2 sm:grid-rows-2 sm:items-stretch">
              {process.map((item, index) => (
                <Reveal key={item.key} delay={staggerDelay(index, 70)} className="h-full min-h-[148px] sm:min-h-0">
                  <article className="relative flex h-full flex-col rounded-xl bg-white/10 p-4 pe-12">
                    <span className="absolute end-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-[14px] font-semibold text-[#d8efe6]">
                      {index + 1}
                    </span>
                    <h3 className="text-[18px] font-semibold text-[#d8efe6]">{item.title}</h3>
                    <p className="mt-2 flex-1 text-[14px] leading-[23px] text-[#cde3da]">{item.body}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="relative min-h-[280px] md:min-h-[420px] md:h-full">
            <img
              src={premiumQuality}
              alt={t('servicesPage.premiumQuality.title')}
              className="h-full w-full object-cover object-center md:object-right"
            />
          </div>
        </div>
      </div>
    </Reveal>
  );
}
