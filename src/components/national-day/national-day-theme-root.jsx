'use client';

import { useEffect } from 'react';
import { NATIONAL_DAY } from '@/lib/national-day/config';

/** Applies / removes the National Day theme class on <html>. */
export default function NationalDayThemeRoot({ children }) {
  useEffect(() => {
    const root = document.documentElement;
    if (!NATIONAL_DAY.enabled) {
      root.classList.remove(NATIONAL_DAY.themeClass);
      return undefined;
    }

    root.classList.add(NATIONAL_DAY.themeClass);
    return () => {
      root.classList.remove(NATIONAL_DAY.themeClass);
    };
  }, []);

  if (!NATIONAL_DAY.enabled) return children;

  return (
    <div className="national-day-shell">
      {children}
    </div>
  );
}
