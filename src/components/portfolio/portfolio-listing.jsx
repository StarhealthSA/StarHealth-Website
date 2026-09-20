'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Reveal from '@/components/reveal';
import PortfolioCaseCarousel from '@/components/portfolio/portfolio-case-carousel';
import { PORTFOLIO_CATEGORIES } from '@/lib/content/portfolio-categories';
import { toPublicPortfolioEntry } from '@/lib/content/portfolio-public';

export default function PortfolioListing({ entries = [] }) {
  const { t, i18n } = useTranslation();

  const items = useMemo(
    () => entries
      .map((entry) => toPublicPortfolioEntry(entry, i18n.language))
      .filter(Boolean),
    [entries, i18n.language]
  );

  const groups = useMemo(() => {
    const byCategory = new Map();
    items.forEach((item) => {
      const key = item.category || 'other';
      if (!byCategory.has(key)) byCategory.set(key, []);
      byCategory.get(key).push(item);
    });

    const ordered = [];
    PORTFOLIO_CATEGORIES.forEach((category) => {
      const list = byCategory.get(category.id);
      if (!list?.length) return;
      ordered.push({
        id: category.id,
        label: i18n.language === 'ar'
          ? (category.label?.ar || category.label?.en || category.id)
          : (category.label?.en || category.id),
        items: list,
      });
      byCategory.delete(category.id);
    });

    byCategory.forEach((list, id) => {
      ordered.push({
        id,
        label: list[0]?.categoryLabel || id,
        items: list,
      });
    });

    return ordered;
  }, [items, i18n.language]);

  return (
    <section className="portfolio-page" aria-labelledby="portfolio-page-title">
      <div className="portfolio-page__hero">
        <div className="portfolio-page__hero-glow" aria-hidden />
        <div className="portfolio-page__shell portfolio-page__shell--hero">
          <Reveal>
            <header className="portfolio-page__intro">
              <p className="portfolio-page__eyebrow">{t('portfolioPage.eyebrow')}</p>
              <h1 id="portfolio-page-title" className="portfolio-page__title">
                {t('portfolioPage.title')}
              </h1>
              <p className="portfolio-page__lead">{t('portfolioPage.lead')}</p>
              {items.length > 0 ? (
                <p className="portfolio-page__count">
                  {t('portfolioPage.caseCount', { count: items.length })}
                </p>
              ) : null}
            </header>
          </Reveal>
        </div>
      </div>

      <div className="portfolio-page__body">
        <div className="portfolio-page__shell">
          {items.length === 0 ? (
            <p className="portfolio-page__empty">{t('portfolioPage.empty')}</p>
          ) : (
            groups.map((group) => (
              <div key={group.id} className="portfolio-page__group">
                <Reveal>
                  <div className="portfolio-page__group-head">
                    <h2 className="portfolio-page__group-title">{group.label}</h2>
                    <span className="portfolio-page__group-count">
                      {t('portfolioPage.caseCount', { count: group.items.length })}
                    </span>
                  </div>
                </Reveal>

                <Reveal delay={60}>
                  <PortfolioCaseCarousel items={group.items} />
                </Reveal>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
