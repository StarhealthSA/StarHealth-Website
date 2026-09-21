'use client';

import Link from 'next/link';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const AUTO_PLAY_MS = 5000;
const PAUSE_AFTER_INTERACTION_MS = 12000;
const TRANSITION_MS = 520;
const SWIPE_THRESHOLD_PX = 48;

function getPerView(width) {
  if (width < 640) return 1.15;
  if (width < 900) return 2.2;
  if (width < 1200) return 3;
  return 4;
}

function TeaserSlide({ entry, inert = false }) {
  const { t } = useTranslation();
  const href = entry.serviceHref || '/our-work';
  const beforeSrc = entry.beforeImageUrl || '';
  const afterSrc = entry.afterImageUrl || '';
  const hasPair = Boolean(beforeSrc && afterSrc);
  const singleSrc =
    afterSrc
    || beforeSrc
    || (entry.mediaType === 'image' ? entry.mediaUrl : '')
    || '';
  const label = entry.title || entry.categoryLabel || '';

  return (
    <Link
      href={href}
      tabIndex={inert ? -1 : 0}
      aria-hidden={inert || undefined}
      className={`our-work-home-carousel__tile${hasPair ? ' our-work-home-carousel__tile--pair' : ''}`}
      aria-label={
        hasPair
          ? `${label} — ${t('portfolioPage.before')} / ${t('portfolioPage.after')}`
          : label
      }
      draggable={false}
    >
      {label ? (
        <p className="our-work-home-carousel__caption">{label}</p>
      ) : null}

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
        <div className="our-work-home-carousel__single">
          <img
            src={singleSrc}
            alt=""
            className="our-work-home-carousel__media"
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </div>
      ) : (
        <div className="our-work-home-carousel__fallback" aria-hidden />
      )}
    </Link>
  );
}

/**
 * Homepage Our Work carousel — multi-card before/after teasers.
 */
export default function OurWorkHomeCarousel({
  items = [],
  autoplay = true,
}) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const labelId = useId();
  const rootRef = useRef(null);
  const viewportRef = useRef(null);
  const pauseUntilRef = useRef(0);
  const isHoveredRef = useRef(false);
  const isFocusedRef = useRef(false);
  const reduceMotionRef = useRef(false);
  const pointerStartX = useRef(null);
  const pointerDeltaX = useRef(0);
  const didSwipeRef = useRef(false);

  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(4);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const count = items.length;
  const maxIndex = Math.max(0, count - Math.floor(perView));
  const hasMultiple = maxIndex > 0;
  const pageCount = maxIndex + 1;

  useEffect(() => {
    reduceMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return undefined;

    const update = () => {
      const next = getPerView(node.clientWidth);
      setPerView((current) => (Math.abs(current - next) < 0.01 ? current : next));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setIndex((current) => Math.min(current, Math.max(0, count - Math.floor(perView))));
  }, [count, perView]);

  useEffect(() => {
    setIndex(0);
    setDragOffset(0);
  }, [items]);

  const pauseAutoplay = useCallback(() => {
    pauseUntilRef.current = Date.now() + PAUSE_AFTER_INTERACTION_MS;
  }, []);

  const goTo = useCallback((next) => {
    if (pageCount <= 0) return;
    setIndex(((next % pageCount) + pageCount) % pageCount);
  }, [pageCount]);

  const goNext = useCallback(() => {
    pauseAutoplay();
    goTo(index + 1);
  }, [goTo, index, pauseAutoplay]);

  const goPrev = useCallback(() => {
    pauseAutoplay();
    goTo(index - 1);
  }, [goTo, index, pauseAutoplay]);

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
      setIndex((current) => (current + 1) % pageCount);
    }, AUTO_PLAY_MS);

    return () => window.clearInterval(timer);
  }, [autoplay, hasMultiple, pageCount]);

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
      goTo(pageCount - 1);
    }
  };

  if (!count) return null;

  const slideBasis = 100 / perView;
  const transition = reduceMotionRef.current || isDragging
    ? 'none'
    : `transform ${TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`;
  const translateX = `calc(${-index * slideBasis}% + ${dragOffset}px)`;

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

      <div className="our-work-home-carousel__stage">
        <div
          ref={viewportRef}
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
            {items.map((entry, slideIndex) => {
              const visibleStart = index;
              const visibleEnd = index + perView;
              const inert = slideIndex < visibleStart || slideIndex >= visibleEnd;
              return (
                <div
                  key={entry.id}
                  className="our-work-home-carousel__slide"
                  style={{ flex: `0 0 ${slideBasis}%` }}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={t('portfolioPage.goToSlide', { number: slideIndex + 1 })}
                  aria-hidden={inert}
                >
                  <TeaserSlide entry={entry} inert={inert} />
                </div>
              );
            })}
          </div>
        </div>

        {hasMultiple ? (
          <>
            <button
              type="button"
              className="our-work-home-carousel__arrow our-work-home-carousel__arrow--prev"
              onClick={isRTL ? goNext : goPrev}
              aria-label={isRTL ? t('portfolioPage.next') : t('portfolioPage.previous')}
            >
              <span aria-hidden>‹</span>
            </button>
            <button
              type="button"
              className="our-work-home-carousel__arrow our-work-home-carousel__arrow--next"
              onClick={isRTL ? goPrev : goNext}
              aria-label={isRTL ? t('portfolioPage.previous') : t('portfolioPage.next')}
            >
              <span aria-hidden>›</span>
            </button>
          </>
        ) : null}
      </div>

      {hasMultiple ? (
        <div
          className="our-work-home-carousel__dots"
          role="tablist"
          aria-label={t('portfolioPage.pagination')}
          dir="ltr"
        >
          {Array.from({ length: pageCount }, (_, dotIndex) => (
            <button
              key={`dot-${dotIndex}`}
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
      ) : null}

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {t('portfolioPage.goToSlide', { number: index + 1 })}
      </div>
    </div>
  );
}
