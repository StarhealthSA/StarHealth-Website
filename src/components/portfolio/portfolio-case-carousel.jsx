'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PortfolioCase from '@/components/portfolio/portfolio-case';

const AUTO_PLAY_MS = 5500;
const PAUSE_AFTER_INTERACTION_MS = 12000;
const SWIPE_THRESHOLD_PX = 48;

/**
 * Carousel of full portfolio case cards for one category.
 * Arrows, dots, swipe, and autoplay (pauses on hover/focus/interaction).
 */
export default function PortfolioCaseCarousel({ items = [] }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const labelId = useId();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const pauseUntilRef = useRef(0);
  const reduceMotionRef = useRef(false);
  const pointerStartX = useRef(null);
  const pointerDeltaX = useRef(0);

  const count = items.length;

  useEffect(() => {
    reduceMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
    if (count <= 1 || reduceMotionRef.current) return undefined;

    const timer = window.setInterval(() => {
      if (paused || Date.now() < pauseUntilRef.current) return;
      setIndex((current) => (current + 1) % count);
    }, AUTO_PLAY_MS);

    return () => window.clearInterval(timer);
  }, [count, paused]);

  if (!count) return null;

  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    pointerStartX.current = e.clientX;
    pointerDeltaX.current = 0;
  };

  const onPointerMove = (e) => {
    if (pointerStartX.current === null) return;
    pointerDeltaX.current = e.clientX - pointerStartX.current;
  };

  const onPointerUp = () => {
    if (pointerStartX.current === null) return;
    const delta = pointerDeltaX.current;
    pointerStartX.current = null;
    pointerDeltaX.current = 0;
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX || count <= 1) return;
    pauseUntilRef.current = Date.now() + PAUSE_AFTER_INTERACTION_MS;
    if (delta < 0) goTo(index + (isRTL ? -1 : 1));
    else goTo(index + (isRTL ? 1 : -1));
  };

  return (
    <div
      className="portfolio-case-carousel"
      aria-roledescription="carousel"
      aria-labelledby={labelId}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
    >
      <p id={labelId} className="sr-only">
        {t('portfolioPage.pagination')}
      </p>

      <div
        className="portfolio-case-carousel__viewport"
        dir="ltr"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className="portfolio-case-carousel__track"
          style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
        >
          {items.map((entry, slideIndex) => (
            <div
              key={entry.id}
              className="portfolio-case-carousel__slide"
              aria-hidden={slideIndex !== index || undefined}
              inert={slideIndex !== index || undefined}
            >
              <PortfolioCase entry={entry} />
            </div>
          ))}
        </div>
      </div>

      {count > 1 ? (
        <div className="portfolio-case-carousel__controls" dir="ltr">
          <div className="portfolio-case-carousel__nav">
            <button
              type="button"
              className="portfolio-case-carousel__arrow"
              onClick={isRTL ? goNext : goPrev}
              aria-label={isRTL ? t('portfolioPage.next') : t('portfolioPage.previous')}
            >
              ‹
            </button>
            <button
              type="button"
              className="portfolio-case-carousel__arrow"
              onClick={isRTL ? goPrev : goNext}
              aria-label={isRTL ? t('portfolioPage.previous') : t('portfolioPage.next')}
            >
              ›
            </button>
          </div>

          <div
            className="portfolio-case-carousel__dots"
            role="tablist"
            aria-label={t('portfolioPage.pagination')}
          >
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
        </div>
      ) : null}
    </div>
  );
}
