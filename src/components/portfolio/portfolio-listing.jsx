'use client';

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Reveal, { staggerDelay } from '@/components/reveal';
import PortfolioCase from '@/components/portfolio/portfolio-case';
import { PORTFOLIO_CATEGORIES } from '@/lib/content/portfolio-categories';
import { toPublicPortfolioEntry } from '@/lib/content/portfolio-public';

export default function PortfolioListing({ entries = [] }) {
  const { t, i18n } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');

  const items = useMemo(
    () => entries
      .map((entry) => toPublicPortfolioEntry(entry, i18n.language))
      .filter(Boolean),
    [entries, i18n.language]
  );

  const filters = useMemo(() => {
    const present = new Set(items.map((item) => item.category).filter(Boolean));
    const categoryFilters = PORTFOLIO_CATEGORIES
      .filter((category) => present.has(category.id))
      .map((category) => ({
        id: category.id,
        label: i18n.language === 'ar'
          ? (category.label?.ar || category.label?.en || category.id)
          : (category.label?.en || category.id),
      }));

    return [
      { id: 'all', label: t('portfolioPage.all') },
      ...categoryFilters,
    ];
  }, [items, i18n.language, t]);

  const visibleItems = useMemo(() => {
    if (activeCategory === 'all') return items;
    return items.filter((item) => item.category === activeCategory);
  }, [items, activeCategory]);

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
            <>
              {filters.length > 1 ? (
                <Reveal>
                  <div
                    className="portfolio-page__filters"
                    role="tablist"
                    aria-label={t('portfolioPage.categories')}
                  >
                    {filters.map((filter) => (
                      <button
                        key={filter.id}
                        type="button"
                        role="tab"
                        aria-selected={activeCategory === filter.id}
                        className={
                          activeCategory === filter.id
                            ? 'portfolio-page__filter is-active'
                            : 'portfolio-page__filter'
                        }
                        onClick={() => setActiveCategory(filter.id)}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </Reveal>
              ) : null}

              {visibleItems.length === 0 ? (
                <p className="portfolio-page__empty">{t('portfolioPage.empty')}</p>
              ) : (
                <div className="portfolio-gallery">
                  {visibleItems.map((entry, index) => (
                    <Reveal key={entry.id} delay={staggerDelay(index, 40)}>
                      <PortfolioCase entry={entry} />
                    </Reveal>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
