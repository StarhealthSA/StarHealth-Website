'use client';

import { useEffect, useRef, useState } from 'react';

function parseNumericValue(value = '') {
  const match = String(value).match(/[\d.]+/);
  return match ? parseFloat(match[0]) : null;
}

function getSuffix(value = '') {
  const str = String(value);
  const numMatch = str.match(/[\d.]+/);
  if (!numMatch) return str;
  return str.slice(numMatch.index + numMatch[0].length);
}

export function useCountUp(targetValue, { duration = 1200, enabled = true } = {}) {
  const [display, setDisplay] = useState(targetValue);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      setDisplay(targetValue);
      return undefined;
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setDisplay(targetValue);
      return undefined;
    }

    const numeric = parseNumericValue(targetValue);
    if (numeric === null) {
      setDisplay(targetValue);
      return undefined;
    }

    const suffix = getSuffix(targetValue);
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      const current = Math.round(numeric * eased);
      setDisplay(`${current}${suffix}`);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [targetValue, duration, enabled]);

  return display;
}
