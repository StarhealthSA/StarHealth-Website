'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Reveal from '@/components/reveal';
import OurWorkHomeCarousel from '@/components/portfolio/our-work-home-carousel';
import { toPublicPortfolioEntry } from '@/lib/content/portfolio-public';
import { getLocalizedText } from '@/lib/content/localized';

export default function OurWorkPreview({ entries = [], settings = null }) {
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  const isRTL = language === 'ar';

  const copy = useMemo(() => ({
    eyebrow:
      getLocalizedText(settings?.eyebrow, language)
      || t('portfolioPage.eyebrow'),
    title:
      getLocalizedText(settings?.title, language)
      || t('portfolioPage.homeTitle'),
    lead:
      getLocalizedText(settings?.lead, language)
      || t('portfolioPage.homeLead'),
  }), [settings, language, t]);

  const items = useMemo(
    () => entries
      .map((entry) => toPublicPortfolioEntry(entry, language))
      .filter(Boolean)
      .filter((entry) => entry.hasBeforeAfter || entry.mediaUrl),
    [entries, language]
  );

  if (!items.length) return null;

  return (
    <section className="our-work-preview nd-bg nd-bg--green" aria-labelledby="our-work-preview-title">
      <div className="our-work-preview__shell">
        <div className={`our-work-preview__layout${isRTL ? ' our-work-preview__layout--rtl' : ''}`}>
          <Reveal className="our-work-preview__carousel-col">
            <OurWorkHomeCarousel items={items} />
          </Reveal>

          <Reveal delay={80} className="our-work-preview__copy-col">
            <header className="our-work-preview__header">
              <p className="our-work-preview__eyebrow">{copy.eyebrow}</p>
              <h2 id="our-work-preview-title" className="our-work-preview__title">
                {copy.title}
              </h2>
              {copy.lead ? (
                <p className="our-work-preview__lead">{copy.lead}</p>
              ) : null}
            </header>
            <Link href="/our-work" className="our-work-preview__cta">
              {t('portfolioPage.viewAll')}
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
