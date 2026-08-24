'use client';

import Reveal, { staggerDelay } from '@/components/reveal';
import { useTranslation } from 'react-i18next';
import markIcon from '@/assets/home/mark.svg';
import familyMedicineIcon from '@/assets/home/familymedicine.svg';

const PILLARS = [
  {
    key: 'promise',
    icon: <img src={markIcon} alt="" className="h-5 w-5 object-contain" />,
  },
  {
    key: 'mission',
    icon: <img src={familyMedicineIcon} alt="" className="h-7 w-7 object-contain" />,
  },
  {
    key: 'vision',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
          stroke="#037B76"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="3" stroke="#037B76" strokeWidth="1.75" />
      </svg>
    ),
  },
];

export default function AboutPillarsSection() {
  const { t } = useTranslation();

  return (
    <section className="px-[20px] md:px-[30px] lg:px-[120px] py-14 lg:py-20">
      <div className="grid gap-4 md:grid-cols-3">
        {PILLARS.map((item, index) => (
          <Reveal key={item.key} delay={staggerDelay(index, 70)}>
            <article className="about-value-card">
              <div className="about-value-card__icon">{item.icon}</div>
              <h2 className="about-value-card__title">
                {t(`aboutPage.pillars.${item.key}.title`)}
              </h2>
              <p className="about-value-card__body">
                {t(`aboutPage.pillars.${item.key}.body`)}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
