'use client';

import Reveal, { staggerDelay } from '@/components/reveal';
import { useTranslation } from 'react-i18next';
import careProcessImage from '@/assets/home/treatment.jpg';

const STEP_KEYS = ['s1', 's2', 's3', 's4'];

export default function AboutCareProcessSection() {
  const { t } = useTranslation();

  const process = STEP_KEYS.map((key, index) => ({
    key,
    step: String(index + 1).padStart(2, '0'),
    title: t(`aboutPage.careProcess.steps.${key}.title`),
    body: t(`aboutPage.careProcess.steps.${key}.body`),
  }));

  const processCard = (item, index) => (
    <Reveal key={item.key} delay={staggerDelay(index, 70)}>
      <article className="about-care-step-card">
        <span className="about-care-step-card__badge">{item.step}</span>
        <h3 className="about-care-step-card__title">{item.title}</h3>
        <p className="about-care-step-card__body">{item.body}</p>
      </article>
    </Reveal>
  );

  return (
    <section className="px-[20px] md:px-[30px] lg:px-[120px] pb-14 lg:pb-20">
      <Reveal>
        <h2 className="text-[28px] font-semibold text-[#002333]">
          {t('aboutPage.careProcess.title')}
        </h2>
      </Reveal>

      <div className="mt-6 lg:hidden">
        <Reveal delay={staggerDelay(0, 60)}>
          <div className="about-care-process-image overflow-hidden rounded-3xl">
            <img
              src={careProcessImage}
              alt={t('aboutPage.careProcess.imageAlt')}
              className="h-[260px] w-full object-cover object-center sm:h-[320px]"
            />
          </div>
        </Reveal>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {process.map((item, index) => processCard(item, index))}
        </div>
      </div>

      <div className="about-care-process-grid mt-8 hidden lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)_minmax(0,1fr)] lg:items-center lg:gap-8">
        <div className="flex flex-col gap-3">
          {processCard(process[0], 0)}
          {processCard(process[2], 2)}
        </div>

        <Reveal delay={staggerDelay(1, 80)}>
          <div className="about-care-process-image overflow-hidden rounded-3xl">
            <img
              src={careProcessImage}
              alt={t('aboutPage.careProcess.imageAlt')}
              className="aspect-[4/5] w-full object-cover object-center"
            />
          </div>
        </Reveal>

        <div className="flex flex-col gap-3">
          {processCard(process[1], 1)}
          {processCard(process[3], 3)}
        </div>
      </div>
    </section>
  );
}
