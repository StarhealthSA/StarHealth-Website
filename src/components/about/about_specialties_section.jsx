'use client';

import Reveal, { staggerDelay } from '@/components/reveal';
import { SERVICE_ICONS } from '@/lib/content/service-icons';
import { useTranslation } from 'react-i18next';

const SPECIALTY_KEYS = [
  { key: 'generalMedicine', iconKey: 'generalMedicine' },
  { key: 'familyMedicine', iconKey: 'familyMedicine' },
  { key: 'internalMedicine', iconKey: 'internalMedicine' },
  { key: 'obg', iconKey: 'obg' },
  { key: 'dentistryOrthodontics', iconKey: 'generalDentistry' },
  { key: 'pediatrics', iconKey: 'pediatrics' },
  { key: 'orthopedics', iconKey: 'ortho' },
  { key: 'laboratory', iconKey: 'laboratory' },
];

export default function AboutSpecialtiesSection() {
  const { t } = useTranslation();

  return (
    <section className="px-[20px] md:px-[30px] lg:px-[120px] pb-14 lg:pb-20">
      <Reveal>
        <h2 className="text-[28px] font-semibold text-[#002333]">
          {t('aboutPage.specialties.title')}
        </h2>
        <p className="mt-3 max-w-3xl text-[15px] leading-[25px] text-[#5b6a71]">
          {t('aboutPage.specialties.description')}
        </p>
      </Reveal>
      <div className="about-equal-cards mt-6 grid gap-3 sm:grid-cols-2 sm:items-stretch lg:grid-cols-4">
        {SPECIALTY_KEYS.map((item, index) => (
          <Reveal key={item.key} delay={staggerDelay(index, 60)} className="h-full">
            <div className="about-specialty-card flex h-full min-h-[52px] cursor-default items-center gap-3 rounded-xl border border-[#d8e6e2] bg-white px-4 py-3 text-[15px] font-medium text-[#123f49]">
              <div className="about-specialty-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C5E4DC]">
                <img
                  src={SERVICE_ICONS[item.iconKey]}
                  alt=""
                  className="h-8 w-8 object-contain"
                />
              </div>
              <span>{t(`aboutPage.specialties.items.${item.key}`)}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
