'use client';

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Reveal, { staggerDelay } from '@/components/reveal';
import PortfolioCard from '@/components/portfolio/portfolio-card';
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

  const categoriesInUse = useMemo(() => {
    const present = new Set(items.map((item) => item.category));
    const known = PORTFOLIO_CATEGORIES.filter((category) => present.has(category.id));
    const extras = [...present]
      .filter((id) => !PORTFOLIO_CATEGORIES.some((category) => category.id === id))
      .map((id) => ({
        id,
        label: {
          en: id,
          ar: id,
        },
      }));
    return [...known, ...extras];
  }, [items]);

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return items;
    return items.filter((item) => item.category === activeCategory);
  }, [items, activeCategory]);

  return (
    <section className="portfolio-page">
      <div className="portfolio-page__shell">
        <Reveal>
          <header className="portfolio-page__intro">
            <p className="portfolio-page__eyebrow">{t('portfolioPage.eyebrow')}</p>
            <h1 className="portfolio-page__title">{t('portfolioPage.title')}</h1>
            <p className="portfolio-page__lead">{t('portfolioPage.lead')}</p>
          </header>
        </Reveal>

        {categoriesInUse.length > 0 ? (
          <Reveal delay={60}>
            <div className="portfolio-page__filters" role="tablist" aria-label={t('portfolioPage.categories')}>
              <button
                type="button"
                role="tab"
                aria-selected={activeCategory === 'all'}
                className={activeCategory === 'all' ? 'is-active' : undefined}
                onClick={() => setActiveCategory('all')}
              >
                {t('portfolioPage.all')}
              </button>
              {categoriesInUse.map((category) => {
                const label = i18n.language === 'ar'
                  ? (category.label?.ar || category.label?.en || category.id)
                  : (category.label?.en || category.id);
                return (
                  <button
                    key={category.id}
                    type="button"
                    role="tab"
                    aria-selected={activeCategory === category.id}
                    className={activeCategory === category.id ? 'is-active' : undefined}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </Reveal>
        ) : null}

        {filtered.length === 0 ? (
          <p className="portfolio-page__empty">{t('portfolioPage.empty')}</p>
        ) : (
          <div className="portfolio-page__grid">
            {filtered.map((entry, index) => (
              <Reveal key={entry.id} delay={staggerDelay(index, 50)}>
                <PortfolioCard entry={entry} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
