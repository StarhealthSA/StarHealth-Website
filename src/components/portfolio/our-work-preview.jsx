'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Reveal from '@/components/reveal';
import OurWorkHomeCarousel from '@/components/portfolio/our-work-home-carousel';
import { toPublicPortfolioEntry } from '@/lib/content/portfolio-public';
import { getLocalizedText } from '@/lib/content/localized';
import {
  PORTFOLIO_CATEGORIES,
  getServicePathForPortfolioCategory,
} from '@/lib/content/portfolio-categories';

export default function OurWorkPreview({ entries = [], settings = null }) {
  const { t, i18n } = useTranslation();
  const language = i18n.language;

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

  const categoryLinks = useMemo(
    () => PORTFOLIO_CATEGORIES.map((category) => ({
      id: category.id,
      href: getServicePathForPortfolioCategory(category.id),
      label: category.label?.[language] || category.label?.en || category.id,
    })),
    [language]
  );

  if (!items.length) return null;

  return (
    <section className="our-work-preview" aria-labelledby="our-work-preview-title">
      <div className="our-work-preview__glow" aria-hidden />
      <div className="our-work-preview__shell">
        <Reveal>
          <header className="our-work-preview__header">
            <p className="our-work-preview__eyebrow">{copy.eyebrow}</p>
            <h2 id="our-work-preview-title" className="our-work-preview__title">
              {copy.title}
            </h2>
            <p className="our-work-preview__lead">{copy.lead}</p>
          </header>
        </Reveal>

        <Reveal delay={80}>
          <OurWorkHomeCarousel items={items} />
        </Reveal>

        <Reveal delay={120}>
          <div className="our-work-preview__cta-row">
            {categoryLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="our-work-preview__cta"
              >
                {t('portfolioPage.exploreCategory', { category: link.label })}
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
