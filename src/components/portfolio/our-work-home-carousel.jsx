'use client';

import Link from 'next/link';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const AUTO_PLAY_MS = 5000;
const PAUSE_AFTER_INTERACTION_MS = 12000;
const TRANSITION_MS = 520;
const SWIPE_THRESHOLD_PX = 48;

function TeaserSlide({ entry, inert = false }) {
  const { t } = useTranslation();
  const href = entry.serviceHref || '/services';
  const beforeSrc = entry.beforeImageUrl || '';
  const afterSrc = entry.afterImageUrl || '';
  const hasPair = Boolean(beforeSrc && afterSrc);
  const singleSrc =
    afterSrc
    || beforeSrc
    || (entry.mediaType === 'image' ? entry.mediaUrl : '')
    || '';

  return (
    <Link
      href={href}
      tabIndex={inert ? -1 : 0}
      aria-hidden={inert || undefined}
      className={`our-work-home-carousel__tile${hasPair ? ' our-work-home-carousel__tile--pair' : ''}`}
      aria-label={
        hasPair
          ? `${entry.categoryLabel || entry.title} — ${t('portfolioPage.before')} / ${t('portfolioPage.after')}`
          : (entry.categoryLabel || entry.title)
      }
      draggable={false}
    >
      {hasPair ? (
        <div className="our-work-home-carousel__pair">
          <figure className="our-work-home-carousel__half">
            <img
              src={beforeSrc}
              alt=""
              className="our-work-home-carousel__media"
              loading="lazy"
              decoding="async"
              draggable={false}
            />
            <figcaption className="our-work-home-carousel__badge">
              {t('portfolioPage.before')}
            </figcaption>
          </figure>
          <figure className="our-work-home-carousel__half">
            <img
              src={afterSrc}
              alt=""
              className="our-work-home-carousel__media"
              loading="lazy"
              decoding="async"
              draggable={false}
            />
            <figcaption className="our-work-home-carousel__badge our-work-home-carousel__badge--after">
              {t('portfolioPage.after')}
            </figcaption>
          </figure>
        </div>
      ) : singleSrc ? (
        <img
          src={singleSrc}
          alt=""
          className="our-work-home-carousel__media"
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      ) : (
        <div className="our-work-home-carousel__fallback" aria-hidden />
      )}
    </Link>
  );
}

/**
 * Homepage Our Work carousel — visuals only (before/after pairs).
 * Supports arrows, dots, swipe, optional autoplay (pauses on hover/focus/interaction).
 */
export default function OurWorkHomeCarousel({
  items = [],
  autoplay = true,
}) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const labelId = useId();
  const rootRef = useRef(null);
  const pauseUntilRef = useRef(0);
  const isHoveredRef = useRef(false);
  const isFocusedRef = useRef(false);
  const reduceMotionRef = useRef(false);
  const pointerStartX = useRef(null);
  const pointerDeltaX = useRef(0);
  const didSwipeRef = useRef(false);

  const [index, setIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const count = items.length;
  const hasMultiple = count > 1;

  useEffect(() => {
    reduceMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    setIndex(0);
    setDragOffset(0);
  }, [items]);

  const pauseAutoplay = useCallback(() => {
    pauseUntilRef.current = Date.now() + PAUSE_AFTER_INTERACTION_MS;
  }, []);

  const goTo = useCallback((next) => {
    if (count <= 0) return;
    setIndex(((next % count) + count) % count);
  }, [count]);

  const goNext = useCallback(() => {
    pauseAutoplay();
    goTo(index + 1);
  }, [goTo, index, pauseAutoplay]);

  const goPrev = useCallback(() => {
    pauseAutoplay();
    goTo(index - 1);
  }, [goTo, index, pauseAutoplay]);

  // Optional autoplay — pauses on hover, focus, interaction, hidden tab, reduced motion.
  useEffect(() => {
    if (!autoplay || !hasMultiple || reduceMotionRef.current) return undefined;

    const timer = window.setInterval(() => {
      if (
        isHoveredRef.current
        || isFocusedRef.current
        || document.hidden
        || Date.now() < pauseUntilRef.current
      ) {
        return;
      }
      setIndex((current) => (current + 1) % count);
    }, AUTO_PLAY_MS);

    return () => window.clearInterval(timer);
  }, [autoplay, hasMultiple, count]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) pauseAutoplay();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [pauseAutoplay]);

  const onPointerDown = (event) => {
    if (!hasMultiple || event.pointerType === 'mouse' && event.button !== 0) return;
    pointerStartX.current = event.clientX;
    pointerDeltaX.current = 0;
    didSwipeRef.current = false;
    setIsDragging(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (pointerStartX.current == null) return;
    const delta = event.clientX - pointerStartX.current;
    pointerDeltaX.current = delta;
    if (Math.abs(delta) > 8) didSwipeRef.current = true;
    setDragOffset(delta);
  };

  const finishPointer = () => {
    if (pointerStartX.current == null) return;
    const delta = pointerDeltaX.current;
    pointerStartX.current = null;
    setIsDragging(false);
    setDragOffset(0);

    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;

    // Track is LTR; swipe left → next, swipe right → previous (swap for RTL UI).
    if (delta < 0) (isRTL ? goPrev : goNext)();
    else (isRTL ? goNext : goPrev)();
  };

  const onClickCapture = (event) => {
    if (!didSwipeRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    didSwipeRef.current = false;
  };

  const onKeyDown = (event) => {
    if (!hasMultiple) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      (isRTL ? goNext : goPrev)();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      (isRTL ? goPrev : goNext)();
    } else if (event.key === 'Home') {
      event.preventDefault();
      pauseAutoplay();
      goTo(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      pauseAutoplay();
      goTo(count - 1);
    }
  };

  if (!count) return null;

  const transition = reduceMotionRef.current || isDragging
    ? 'none'
    : `transform ${TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`;
  const translateX = `calc(${-index * 100}% + ${dragOffset}px)`;

  return (
    <div
      ref={rootRef}
      className="our-work-home-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-labelledby={labelId}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
      onFocusCapture={() => {
        isFocusedRef.current = true;
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          isFocusedRef.current = false;
        }
      }}
      onKeyDown={onKeyDown}
    >
      <p id={labelId} className="sr-only">
        {t('portfolioPage.pagination')}
      </p>

      <div
        className="our-work-home-carousel__viewport"
        dir="ltr"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishPointer}
        onPointerCancel={finishPointer}
        onClickCapture={onClickCapture}
      >
        <div
          className="our-work-home-carousel__track"
          style={{
            transform: `translate3d(${translateX}, 0, 0)`,
            transition,
          }}
        >
          {items.map((entry, slideIndex) => (
            <div
              key={entry.id}
              className="our-work-home-carousel__slide"
              role="group"
              aria-roledescription="slide"
              aria-label={t('portfolioPage.goToSlide', { number: slideIndex + 1 })}
              aria-hidden={slideIndex !== index}
            >
              <TeaserSlide entry={entry} inert={slideIndex !== index} />
            </div>
          ))}
        </div>
      </div>

      {hasMultiple ? (
        <div className="our-work-home-carousel__controls" dir="ltr">
          <div className="our-work-home-carousel__nav">
            <button
              type="button"
              className="our-work-home-carousel__arrow"
              onClick={isRTL ? goNext : goPrev}
              aria-label={isRTL ? t('portfolioPage.next') : t('portfolioPage.previous')}
            >
              <span aria-hidden>‹</span>
            </button>
            <button
              type="button"
              className="our-work-home-carousel__arrow"
              onClick={isRTL ? goPrev : goNext}
              aria-label={isRTL ? t('portfolioPage.previous') : t('portfolioPage.next')}
            >
              <span aria-hidden>›</span>
            </button>
          </div>

          <div
            className="our-work-home-carousel__dots"
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
                  pauseAutoplay();
                  goTo(dotIndex);
                }}
              />
            ))}
          </div>
        </div>
      ) : null}

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {t('portfolioPage.goToSlide', { number: index + 1 })}
      </div>
    </div>
  );
}
