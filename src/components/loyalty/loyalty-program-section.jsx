'use client';

import Reveal from '@/components/reveal';
import Whatnext from '@/components/what_next';
import LoyaltyTierCard from '@/components/loyalty/loyalty-tier-card';
import { useTranslation } from 'react-i18next';
import { staggerDelay } from '@/lib/stagger_delay';

export default function LoyaltyProgramSection() {
  const { t } = useTranslation();

  const highlights = [
    {
      title: t('loyaltyPage.highlights.earn.title'),
      body: t('loyaltyPage.highlights.earn.body'),
    },
    {
      title: t('loyaltyPage.highlights.redeem.title'),
      body: t('loyaltyPage.highlights.redeem.body'),
    },
    {
      title: t('loyaltyPage.highlights.experience.title'),
      body: t('loyaltyPage.highlights.experience.body'),
    },
  ];

  const burgundyBenefits = [
    { icon: 'aesthetics', label: t('loyaltyPage.burgundy.benefits.aesthetics') },
    { icon: 'care', label: t('loyaltyPage.burgundy.benefits.care') },
    { icon: 'privileges', label: t('loyaltyPage.burgundy.benefits.privileges') },
  ];

  const blackBenefits = [
    { icon: 'premium', label: t('loyaltyPage.black.benefits.premium') },
    { icon: 'care', label: t('loyaltyPage.black.benefits.care') },
    { icon: 'privileges', label: t('loyaltyPage.black.benefits.privileges') },
  ];

  return (
    <div className="bg-[#f8fbfa]">
      <section className="loyalty-hero relative overflow-hidden px-[20px] py-16 md:px-[30px] md:py-20 lg:px-[120px] lg:py-24">
        <div className="loyalty-hero__pattern" aria-hidden />
        <Reveal className="relative mx-auto max-w-4xl text-center">
          <p className="loyalty-hero__eyebrow">{t('loyaltyPage.hero.eyebrow')}</p>
          <h1 className="loyalty-hero__title">{t('loyaltyPage.hero.title')}</h1>
          <p className="loyalty-hero__lead">{t('loyaltyPage.hero.description')}</p>
        </Reveal>
      </section>

      <section className="px-[20px] pb-14 md:px-[30px] lg:px-[120px] lg:pb-20">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-[28px] font-semibold text-[#002333]">{t('loyaltyPage.cardsTitle')}</h2>
            <p className="mt-3 text-[15px] leading-[25px] text-[#5b6a71]">{t('loyaltyPage.cardsDescription')}</p>
          </div>
        </Reveal>

        <div className="mt-10 grid items-stretch gap-8 xl:grid-cols-2">
          <Reveal delay={staggerDelay(0, 80)} className="h-full">
            <LoyaltyTierCard
              tier="burgundy"
              title={t('loyaltyPage.burgundy.title')}
              tagline={t('loyaltyPage.burgundy.tagline')}
              pointsLabel={t('loyaltyPage.pointsLabel')}
              pointsDescription={t('loyaltyPage.burgundy.points')}
              benefits={burgundyBenefits}
              cardTypeLabel={t('loyaltyPage.cardTypeLabel')}
              ctaLabel={t('loyaltyPage.cta')}
            />
          </Reveal>

          <Reveal delay={staggerDelay(1, 80)} className="h-full">
            <LoyaltyTierCard
              tier="black"
              title={t('loyaltyPage.black.title')}
              tagline={t('loyaltyPage.black.tagline')}
              inviteOnly={t('loyaltyPage.black.inviteOnly')}
              pointsLabel={t('loyaltyPage.pointsLabel')}
              pointsDescription={t('loyaltyPage.black.points')}
              benefits={blackBenefits}
              cardTypeLabel={t('loyaltyPage.cardTypeLabel')}
              ctaLabel={t('loyaltyPage.cta')}
            />
          </Reveal>
        </div>
      </section>

      <section className="px-[20px] pb-14 md:px-[30px] lg:px-[120px] lg:pb-20">
        <Reveal>
          <h2 className="text-center text-[28px] font-semibold text-[#002333]">
            {t('loyaltyPage.highlightsTitle')}
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {highlights.map((item, index) => (
            <Reveal key={item.title} delay={staggerDelay(index, 70)}>
              <article className="rounded-2xl border border-[#d8e6e2] bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[#002333]">{item.title}</h3>
                <p className="mt-3 text-[15px] leading-[24px] text-[#5b6a71]">{item.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <Whatnext text={t('loyaltyPage.whatNext')} />
    </div>
  );
}
