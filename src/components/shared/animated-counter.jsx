'use client';

import { useEffect, useRef, useState } from 'react';

function formatCounterValue(value, decimals = 0) {
  if (decimals > 0) {
    return value.toFixed(decimals);
  }
  return String(Math.round(value));
}

export default function AnimatedCounter({
  value = 0,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 1600,
}) {
  const [display, setDisplay] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return undefined;

    const target = Number(value) || 0;
    const start = performance.now();
    let frame = 0;

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(target * eased);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, value, duration]);

  return (
    <span ref={ref} className="why-choose-star-health__counter-value">
      {prefix}
      {formatCounterValue(display, decimals)}
      {suffix}
    </span>
  );
}
