'use client';

import Reveal from '@/components/reveal';
import Whatnext from '@/components/what_next';
import LoyaltyTierCard from '@/components/loyalty/loyalty-tier-card';
import { useTranslation } from 'react-i18next';
import { staggerDelay } from '@/lib/stagger_delay';

const JOIN_NUJOOM_URL =
  'https://site.brand-wallet.com/b3b991f5-06e7-4603-93d1-7153a20b569a/08212e92-023b-4975-a3b8-7f8e41bb06fc';

export default function LoyaltyProgramSection() {
  const { t } = useTranslation();

  const howItWorks = [
    t('loyaltyPage.howItWorks.steps.register'),
    t('loyaltyPage.howItWorks.steps.earn'),
    t('loyaltyPage.howItWorks.steps.enjoy'),
    t('loyaltyPage.howItWorks.steps.redeem'),
  ];

  const redeemAmounts = [
    t('loyaltyPage.redeem.amounts.a'),
    t('loyaltyPage.redeem.amounts.b'),
    t('loyaltyPage.redeem.amounts.c'),
    t('loyaltyPage.redeem.amounts.d'),
  ];

  const terms = [
    t('loyaltyPage.terms.items.amounts'),
    t('loyaltyPage.terms.items.services'),
    t('loyaltyPage.terms.items.nonTransferable'),
    t('loyaltyPage.terms.items.modify'),
  ];

  const burgundyBenefits = [
    { icon: 'aesthetics', label: t('loyaltyPage.burgundy.benefits.aesthetics') },
    { icon: 'care', label: t('loyaltyPage.burgundy.benefits.care') },
    { icon: 'privileges', label: t('loyaltyPage.burgundy.benefits.privileges') },
  ];

  return (
    <div className="bg-[#f8fbfa]">
      <section className="loyalty-hero relative overflow-hidden px-[20px] py-16 md:px-[30px] md:py-20 lg:px-[120px] lg:py-24">
        <div className="loyalty-hero__pattern" aria-hidden />
        <Reveal className="relative mx-auto max-w-4xl text-center">
          <p className="loyalty-hero__eyebrow">{t('loyaltyPage.hero.eyebrow')}</p>
          <h1 className="loyalty-hero__title">{t('loyaltyPage.hero.title')}</h1>

          <div className="loyalty-hero__what-is">
            <h2 className="loyalty-hero__what-is-title">{t('loyaltyPage.hero.whatIsTitle')}</h2>
            <p className="loyalty-hero__what-is-body">{t('loyaltyPage.hero.whatIsBody')}</p>
          </div>

          <a
            href={JOIN_NUJOOM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="loyalty-hero__cta"
          >
            {t('loyaltyPage.cta')}
          </a>
        </Reveal>
      </section>

      <section className="px-[20px] pb-14 md:px-[30px] lg:px-[120px] lg:pb-20">
        <Reveal>
          <div className="loyalty-section-intro">
            <p className="loyalty-section-intro__eyebrow">{t('loyaltyPage.cardsEyebrow')}</p>
            <h2 className="loyalty-section-intro__title">{t('loyaltyPage.cardsTitle')}</h2>
            <span className="loyalty-section-intro__rule" aria-hidden />
            <p className="loyalty-section-intro__lead">{t('loyaltyPage.cardsDescription')}</p>
          </div>
        </Reveal>

        <div className="loyalty-main-split mt-10">
          <Reveal delay={staggerDelay(0, 80)} className="loyalty-main-split__card h-full">
            <LoyaltyTierCard
              tier="burgundy"
              title={t('loyaltyPage.burgundy.title')}
              tagline={t('loyaltyPage.burgundy.tagline')}
              pointsLabel={t('loyaltyPage.pointsLabel')}
              pointsDescription={t('loyaltyPage.burgundy.points')}
              benefits={burgundyBenefits}
              cardTypeLabel={t('loyaltyPage.cardTypeLabel')}
              ctaLabel={t('loyaltyPage.cta')}
              ctaHref={JOIN_NUJOOM_URL}
            />
          </Reveal>

          <div className="loyalty-main-split__steps">
            <Reveal>
              <h3 className="loyalty-main-split__steps-title">
                {t('loyaltyPage.howItWorks.title')}
              </h3>
            </Reveal>
            <div className="loyalty-main-split__steps-list">
              {howItWorks.map((step, index) => (
                <Reveal key={step} delay={staggerDelay(index, 70)} className="h-full">
                  <article className="loyalty-info-card h-full">
                    <span className="loyalty-info-card__step">{String(index + 1).padStart(2, '0')}</span>
                    <p className="loyalty-info-card__body">{step}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-[20px] pb-14 md:px-[30px] lg:px-[120px] lg:pb-20">
        <Reveal>
          <article className="loyalty-earning-banner mx-auto max-w-4xl text-center">
            <h2 className="text-[28px] font-semibold text-[#002333]">{t('loyaltyPage.earning.title')}</h2>
            <p className="mt-4 text-[17px] leading-[28px] text-[#5b6a71]">{t('loyaltyPage.earning.body')}</p>
          </article>
        </Reveal>
      </section>

      <section className="px-[20px] pb-14 md:px-[30px] lg:px-[120px] lg:pb-20">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-[28px] font-semibold text-[#002333]">{t('loyaltyPage.redeem.title')}</h2>
            <p className="mt-3 text-[15px] leading-[25px] text-[#5b6a71]">{t('loyaltyPage.redeem.description')}</p>
          </div>
        </Reveal>
        <div className="mt-8 grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {redeemAmounts.map((amount, index) => (
            <Reveal key={amount} delay={staggerDelay(index, 60)} className="h-full">
              <article className="loyalty-points-card h-full">
                <p className="loyalty-points-card__value">{amount}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-[20px] pb-14 md:px-[30px] lg:px-[120px] lg:pb-20">
        <Reveal>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-[28px] font-semibold text-[#002333]">
              {t('loyaltyPage.terms.title')}
            </h2>
            <ul className="loyalty-terms mt-8">
              {terms.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      <Whatnext text={t('loyaltyPage.whatNext')} />
    </div>
  );
}
