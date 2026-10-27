'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PortfolioCard from '@/components/portfolio/portfolio-card';

const AUTO_PLAY_MS = 5500;
const PAUSE_AFTER_INTERACTION_MS = 12000;

export default function PortfolioCarousel({ items = [], compact = false }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const pauseUntilRef = useRef(0);
  const touchStartX = useRef(null);
  const reduceMotion = useRef(false);

  const count = items.length;

  useEffect(() => {
    reduceMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    setIndex(0);
  }, [items]);

  const goTo = useCallback((next) => {
    if (count <= 0) return;
    setIndex(((next % count) + count) % count);
  }, [count]);

  const goNext = useCallback(() => {
    pauseUntilRef.current = Date.now() + PAUSE_AFTER_INTERACTION_MS;
    goTo(index + 1);
  }, [goTo, index]);

  const goPrev = useCallback(() => {
    pauseUntilRef.current = Date.now() + PAUSE_AFTER_INTERACTION_MS;
    goTo(index - 1);
  }, [goTo, index]);

  useEffect(() => {
    if (count <= 1 || reduceMotion.current) return undefined;

    const timer = window.setInterval(() => {
      if (paused || Date.now() < pauseUntilRef.current) return;
      setIndex((current) => (current + 1) % count);
    }, AUTO_PLAY_MS);

    return () => window.clearInterval(timer);
  }, [count, paused]);

  if (!count) return null;

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      pauseUntilRef.current = Date.now() + PAUSE_AFTER_INTERACTION_MS;
      if (delta < 0) goTo(index + (isRTL ? -1 : 1));
      else goTo(index + (isRTL ? 1 : -1));
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="portfolio-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
    >
      <div
        className="portfolio-carousel__viewport"
        dir="ltr"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="portfolio-carousel__track"
          style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
        >
          {items.map((entry) => (
            <div key={entry.id} className="portfolio-carousel__slide">
              <PortfolioCard entry={entry} compact={compact} />
            </div>
          ))}
        </div>
      </div>

      {count > 1 ? (
        <>
          <div className="portfolio-carousel__nav" dir="ltr">
            <button
              type="button"
              className="portfolio-carousel__arrow"
              onClick={isRTL ? goNext : goPrev}
              aria-label={isRTL ? t('portfolioPage.next') : t('portfolioPage.previous')}
            >
              ‹
            </button>
            <button
              type="button"
              className="portfolio-carousel__arrow"
              onClick={isRTL ? goPrev : goNext}
              aria-label={isRTL ? t('portfolioPage.previous') : t('portfolioPage.next')}
            >
              ›
            </button>
          </div>

          <div className="portfolio-carousel__dots" role="tablist" aria-label={t('portfolioPage.pagination')}>
            {items.map((entry, dotIndex) => (
              <button
                key={entry.id}
                type="button"
                role="tab"
                aria-selected={dotIndex === index}
                aria-label={t('portfolioPage.goToSlide', { number: dotIndex + 1 })}
                className={dotIndex === index ? 'is-active' : undefined}
                onClick={() => {
                  pauseUntilRef.current = Date.now() + PAUSE_AFTER_INTERACTION_MS;
                  goTo(dotIndex);
                }}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
