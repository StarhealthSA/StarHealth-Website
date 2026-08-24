'use client';

import Reveal, { staggerDelay } from '@/components/reveal';
import { useTranslation } from 'react-i18next';

const STAT_KEYS = ['s1', 's2', 's3', 's4'];

export default function AboutExperienceSection() {
  const { t } = useTranslation();

  return (
    <section className="px-[20px] md:px-[30px] lg:px-[120px] pb-14 lg:pb-20">
      <Reveal>
        <div className="overflow-hidden rounded-3xl bg-[#063330] text-white">
          <div className="grid gap-8 p-8 md:grid-cols-2 lg:p-12">
            <div>
              <h2 className="text-[28px] leading-[36px] font-semibold">
                {t('aboutPage.experience.title')}
              </h2>
              <p className="mt-4 text-[15px] leading-[25px] text-[#d0e2dc]">
                {t('aboutPage.experience.description')}
              </p>
            </div>
            <div className="about-equal-cards grid grid-cols-2 gap-4 items-stretch">
              {STAT_KEYS.map((key, index) => (
                <Reveal key={key} delay={staggerDelay(index, 70)} className="h-full">
                  <div className="flex h-full min-h-[108px] flex-col rounded-xl bg-white/10 p-4">
                    <p className="text-[12px] uppercase tracking-[0.12em] text-[#aed5c6]">
                      {t(`aboutPage.experience.stats.${key}.label`)}
                    </p>
                    <p className="mt-auto pt-2 text-[15px] font-semibold leading-[22px] md:text-[16px] md:leading-[24px]">
                      {t(`aboutPage.experience.stats.${key}.value`)}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
