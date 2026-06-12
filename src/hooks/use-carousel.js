'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export function useCarousel(itemCount, { loop = true } = {}) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef(null);

  const goTo = useCallback((next) => {
    setIndex((prev) => {
      if (itemCount <= 0) return 0;
      if (loop) {
        return ((next % itemCount) + itemCount) % itemCount;
      }
      return Math.max(0, Math.min(itemCount - 1, next));
    });
  }, [itemCount, loop]);

  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (index >= itemCount && itemCount > 0) {
      setIndex(itemCount - 1);
    }
  }, [index, itemCount]);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      if (delta < 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
  };

  return {
    index,
    goTo,
    goNext,
    goPrev,
    onTouchStart,
    onTouchEnd,
    canGoPrev: loop || index > 0,
    canGoNext: loop || index < itemCount - 1,
  };
}
