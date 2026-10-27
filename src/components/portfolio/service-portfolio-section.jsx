'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Reveal, { staggerDelay } from '@/components/reveal';
import PortfolioCard from '@/components/portfolio/portfolio-card';
import PortfolioCarousel from '@/components/portfolio/portfolio-carousel';
import { toPublicPortfolioEntry } from '@/lib/content/portfolio-public';

/**
 * Our Work block for a single service/category page.
 * Renders a carousel on smaller viewports and a grid on desktop.
 */
export default function ServicePortfolioSection({
  entries = [],
  categoryLabel = '',
}) {
  const { t, i18n } = useTranslation();

  const items = useMemo(
    () => entries
      .map((entry) => toPublicPortfolioEntry(entry, i18n.language))
      .filter(Boolean),
    [entries, i18n.language]
  );

  if (!items.length) return null;

  return (
    <section className="service-portfolio" aria-labelledby="service-portfolio-title">
      <div className="service-detail-container pb-12 lg:pb-16">
        <Reveal>
          <header className="service-portfolio__header">
            <p className="service-portfolio__eyebrow">{t('portfolioPage.eyebrow')}</p>
            <h2 id="service-portfolio-title" className="service-portfolio__title">
              {t('portfolioPage.serviceTitle', {
                category: categoryLabel || t('portfolioPage.homeTitle'),
              })}
            </h2>
            <p className="service-portfolio__lead">{t('portfolioPage.serviceLead')}</p>
          </header>
        </Reveal>

        <div className="service-portfolio__carousel md:hidden">
          <Reveal delay={60}>
            <PortfolioCarousel items={items} compact />
          </Reveal>
        </div>

        <div className="service-portfolio__grid hidden md:grid">
          {items.map((entry, index) => (
            <Reveal key={entry.id} delay={staggerDelay(index, 50)}>
              <PortfolioCard entry={entry} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
