'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import TestimonialCard from '@/components/shared/testimonial-card';
import { useTranslation } from 'react-i18next';

const AUTO_PLAY_MS = 2000;
const PAUSE_AFTER_INTERACTION_MS = 10000;
const TRANSITION_MS = 450;

export default function TestimonialsCarousel({ items = [], isRTL = false }) {
  const { t } = useTranslation();
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const stepPxRef = useRef(0);
  const positionRef = useRef(0);
  const pauseUntilRef = useRef(0);
  const isHoveredRef = useRef(false);

  const [position, setPosition] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [stepPx, setStepPx] = useState(0);

  const itemCount = items.length;
  const hasMultiple = itemCount > 1;
  const loopedItems = useMemo(
    () => (hasMultiple ? [...items, ...items] : items),
    [hasMultiple, items]
  );

  const translateIndex = hasMultiple
    ? ((position % (itemCount * 2)) + itemCount * 2) % (itemCount * 2)
    : 0;

  positionRef.current = position;

  const measureStep = useCallback(() => {
    const track = trackRef.current;
    const firstSlide = track?.children[0];
    if (!firstSlide || !track) return;

    const secondSlide = track.children[1];
    let nextStep = firstSlide.getBoundingClientRect().width;

    if (secondSlide) {
      // Use absolute distance so RTL document direction cannot invert the step.
      nextStep = Math.abs(
        secondSlide.getBoundingClientRect().left - firstSlide.getBoundingClientRect().left
      );
    }

    if (!nextStep) return;

    stepPxRef.current = nextStep;
    setStepPx(nextStep);
  }, []);

  useEffect(() => {
    setPosition(0);
    setAnimate(false);
    measureStep();

    const frame = requestAnimationFrame(() => {
      measureStep();
      setAnimate(true);
    });

    return () => cancelAnimationFrame(frame);
  }, [items, isRTL, measureStep]);

  useEffect(() => {
    measureStep();
    const viewport = viewportRef.current;
    if (!viewport) return undefined;

    const observer = new ResizeObserver(() => {
      measureStep();
    });

    observer.observe(viewport);
    window.addEventListener('resize', measureStep);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measureStep);
    };
  }, [measureStep, loopedItems.length, isRTL]);

  const handleTransitionEnd = useCallback((event) => {
    if (event.target !== trackRef.current || event.propertyName !== 'transform') return;
    if (!hasMultiple) return;

    const current = positionRef.current;
    const index = ((current % (itemCount * 2)) + itemCount * 2) % (itemCount * 2);
    if (index < itemCount) return;

    setAnimate(false);
    setPosition(current - itemCount);
    requestAnimationFrame(() => {
      setAnimate(true);
    });
  }, [hasMultiple, itemCount]);

  const goNext = useCallback(() => {
    pauseUntilRef.current = Date.now() + PAUSE_AFTER_INTERACTION_MS;
    setAnimate(true);
    setPosition((current) => current + 1);
  }, []);

  const goPrev = useCallback(() => {
    pauseUntilRef.current = Date.now() + PAUSE_AFTER_INTERACTION_MS;

    const current = positionRef.current;
    const index = ((current % (itemCount * 2)) + itemCount * 2) % (itemCount * 2);
    if (index === 0) {
      setAnimate(false);
      setPosition(itemCount);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimate(true);
          setPosition(itemCount - 1);
        });
      });
      return;
    }

    setAnimate(true);
    setPosition(current - 1);
  }, [itemCount]);

  useEffect(() => {
    if (!hasMultiple) return undefined;

    const timer = window.setInterval(() => {
      if (isHoveredRef.current || Date.now() < pauseUntilRef.current) return;
      setAnimate(true);
      setPosition((current) => current + 1);
    }, AUTO_PLAY_MS);

    return () => window.clearInterval(timer);
  }, [hasMultiple]);

  if (!itemCount) return null;

  // Keep transform math in LTR coordinates (viewport is forced dir="ltr").
  const translateX = -(stepPx || stepPxRef.current) * translateIndex;

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
      {/* Force LTR geometry so RTL page direction does not break slide offsets. */}
      <div ref={viewportRef} className="testimonials-carousel__viewport" dir="ltr">
        <div
          ref={trackRef}
          className="testimonials-carousel__track"
          style={{
            transform: `translate3d(${translateX}px, 0, 0)`,
            transition: animate ? `transform ${TRANSITION_MS}ms ease` : 'none',
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {loopedItems.map((item, index) => (
            <div key={`${item.name}-${index}`} className="testimonials-carousel__slide">
              <TestimonialCard name={item.name} quote={item.quote} isRTL={isRTL} />
            </div>
          ))}
        </div>
      </div>

      {hasMultiple && (
        <div className="testimonials-carousel__nav" dir="ltr">
          <button
            type="button"
            className="testimonials-carousel__arrow"
            onClick={isRTL ? goNext : goPrev}
            aria-label={isRTL ? t('testimonials.next') : t('testimonials.previous')}
          >
            ‹
          </button>
          <button
            type="button"
            className="testimonials-carousel__arrow"
            onClick={isRTL ? goPrev : goNext}
            aria-label={isRTL ? t('testimonials.previous') : t('testimonials.next')}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
