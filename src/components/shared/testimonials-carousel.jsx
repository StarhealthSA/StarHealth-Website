'use client';

import { useCallback, useEffect, useRef } from 'react';
import TestimonialCard from '@/components/shared/testimonial-card';
import { useTranslation } from 'react-i18next';

const AUTO_PLAY_MS = 5000;
const PAUSE_AFTER_INTERACTION_MS = 10000;

export default function TestimonialsCarousel({ items = [], isRTL = false }) {
  const { t } = useTranslation();
  const viewportRef = useRef(null);
  const slideRefs = useRef([]);
  const isNavigatingRef = useRef(false);
  const navigateTimerRef = useRef(null);
  const activeIndexRef = useRef(0);
  const pauseUntilRef = useRef(0);
  const isHoveredRef = useRef(false);

  const itemCount = items.length;
  const hasMultiple = itemCount > 1;

  const getSlideScrollLeft = useCallback((index) => {
    const viewport = viewportRef.current;
    const slide = slideRefs.current[index];
    if (!viewport || !slide) return 0;

    return slide.getBoundingClientRect().left
      - viewport.getBoundingClientRect().left
      + viewport.scrollLeft;
  }, []);

  const scrollToIndex = useCallback((index) => {
    const viewport = viewportRef.current;
    if (!viewport || itemCount === 0) return;

    const nextIndex = ((index % itemCount) + itemCount) % itemCount;
    const slide = slideRefs.current[nextIndex];
    if (!slide) return;

    if (navigateTimerRef.current) {
      window.clearTimeout(navigateTimerRef.current);
    }

    isNavigatingRef.current = true;
    activeIndexRef.current = nextIndex;

    viewport.scrollTo({
      left: getSlideScrollLeft(nextIndex),
      behavior: 'smooth',
    });

    navigateTimerRef.current = window.setTimeout(() => {
      isNavigatingRef.current = false;
    }, 450);
  }, [getSlideScrollLeft, itemCount]);

  const goNext = useCallback(() => {
    pauseUntilRef.current = Date.now() + PAUSE_AFTER_INTERACTION_MS;
    scrollToIndex(activeIndexRef.current + 1);
  }, [scrollToIndex]);

  const goPrev = useCallback(() => {
    pauseUntilRef.current = Date.now() + PAUSE_AFTER_INTERACTION_MS;
    scrollToIndex(activeIndexRef.current - 1);
  }, [scrollToIndex]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !hasMultiple) return undefined;

    let scrollTimer;

    const syncActiveIndex = () => {
      if (isNavigatingRef.current) return;

      const scrollLeft = viewport.scrollLeft;
      let closest = 0;
      let minDistance = Infinity;

      slideRefs.current.forEach((slide, index) => {
        if (!slide) return;
        const distance = Math.abs(getSlideScrollLeft(index) - scrollLeft);
        if (distance < minDistance) {
          minDistance = distance;
          closest = index;
        }
      });

      activeIndexRef.current = closest;
      pauseUntilRef.current = Date.now() + PAUSE_AFTER_INTERACTION_MS;
    };

    const handleScroll = () => {
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(syncActiveIndex, 80);
    };

    viewport.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      viewport.removeEventListener('scroll', handleScroll);
      window.clearTimeout(scrollTimer);
      if (navigateTimerRef.current) {
        window.clearTimeout(navigateTimerRef.current);
      }
    };
  }, [getSlideScrollLeft, hasMultiple]);

  useEffect(() => {
    if (!hasMultiple) return undefined;

    const timer = window.setInterval(() => {
      if (isHoveredRef.current || Date.now() < pauseUntilRef.current) return;
      scrollToIndex(activeIndexRef.current + 1);
    }, AUTO_PLAY_MS);

    return () => window.clearInterval(timer);
  }, [hasMultiple, scrollToIndex]);

  if (!itemCount) return null;

  return (
    <div
      className="testimonials-carousel"
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
    >
      <div
        ref={viewportRef}
        dir={isRTL ? 'rtl' : 'ltr'}
        className="testimonials-carousel__viewport scrollbar-hide"
      >
        {items.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            ref={(node) => {
              slideRefs.current[index] = node;
            }}
            className="testimonials-carousel__slide"
          >
            <TestimonialCard name={item.name} quote={item.quote} />
          </div>
        ))}
      </div>

      {hasMultiple && (
        <div className="testimonials-carousel__nav">
          <button
            type="button"
            className="testimonials-carousel__arrow"
            onClick={goPrev}
            aria-label={t('testimonials.previous')}
          >
            ‹
          </button>
          <button
            type="button"
            className="testimonials-carousel__arrow"
            onClick={goNext}
            aria-label={t('testimonials.next')}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
