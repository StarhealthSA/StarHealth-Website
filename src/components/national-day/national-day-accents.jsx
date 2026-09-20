'use client';

import { useCallback, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NATIONAL_DAY } from '@/lib/national-day/config';

const FIREWORK_COLORS = ['#006c35', '#ffffff', '#1fa05a', '#a8e6c1', '#f8fff9'];
const BURST_MS = 1600;

function BalloonIcon({ tone = 'green', gradientId }) {
  const fill = `url(#${gradientId})`;
  const isBurgundy = tone === 'burgundy';

  return (
    <svg viewBox="0 0 120 160" aria-hidden focusable="false">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          {isBurgundy ? (
            <>
              <stop offset="0%" stopColor="#a8324a" />
              <stop offset="55%" stopColor="#6b1d2a" />
              <stop offset="100%" stopColor="#4a1320" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#1fa05a" />
              <stop offset="55%" stopColor="#006c35" />
              <stop offset="100%" stopColor="#004d26" />
            </>
          )}
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="58" rx="46" ry="54" fill={fill} />
      <path d="M40 100 L60 118 L80 100" fill={fill} opacity="0.9" />
      <rect x="48" y="118" width="24" height="18" rx="2" fill="#8b5a2b" />
      <path d="M52 118 L52 112 M68 118 L68 112" stroke="#6b4420" strokeWidth="2" />
    </svg>
  );
}

/** Compact Saudi flag glare (same burst style as before). */
function SaudiFlagGlare() {
  return (
    <svg
      className="national-day-firework__flag"
      viewBox="0 0 60 40"
      aria-hidden
      focusable="false"
    >
      <rect width="60" height="40" fill="#006C35" rx="2" />
      <g fill="#fff">
        <text
          x="30"
          y="15"
          textAnchor="middle"
          fontSize="6.5"
          fontWeight="700"
          fontFamily="'Saudi', 'Saudi Font', Tahoma, sans-serif"
          style={{ direction: 'rtl' }}
        >
          لا إله إلا الله
        </text>
        <text
          x="30"
          y="23"
          textAnchor="middle"
          fontSize="5.5"
          fontWeight="700"
          fontFamily="'Saudi', 'Saudi Font', Tahoma, sans-serif"
          style={{ direction: 'rtl' }}
        >
          محمد رسول الله
        </text>
        <path d="M48 30 H12 V28 H48 Z" />
        <path d="M12 27 L8 29 L12 31 Z" />
        <rect x="48" y="27" width="4" height="4" rx="0.5" />
      </g>
    </svg>
  );
}

function FireworkBurst({ burst }) {
  const sparks = Array.from({ length: 18 }, (_, index) => {
    const angle = (index / 18) * Math.PI * 2;
    const distance = 56 + (index % 3) * 18;
    return {
      id: `${burst.id}-s${index}`,
      color: FIREWORK_COLORS[index % FIREWORK_COLORS.length],
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      delay: (index % 4) * 40,
      size: index % 3 === 0 ? 7 : 5,
    };
  });

  return (
    <div
      className="national-day-firework"
      style={{ left: burst.x, top: burst.y }}
      aria-hidden
    >
      <span className="national-day-firework__glare" />
      <SaudiFlagGlare />
      {sparks.map((spark) => (
        <span
          key={spark.id}
          className="national-day-firework__spark"
          style={{
            '--nd-spark-x': `${spark.x}px`,
            '--nd-spark-y': `${spark.y}px`,
            '--nd-spark-color': spark.color,
            '--nd-spark-delay': `${spark.delay}ms`,
            '--nd-spark-size': `${spark.size}px`,
          }}
        />
      ))}
    </div>
  );
}

function BalloonButton({ className, tone, label, onBurst }) {
  const reactId = useId();
  const gradientId = `nd-balloon-${tone}-${reactId.replace(/:/g, '')}`;

  const handleClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    onBurst({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 3,
    });
  };

  return (
    <button
      type="button"
      className={`national-day-accents__balloon ${className}`}
      onClick={handleClick}
      aria-label={label}
    >
      <BalloonIcon tone={tone} gradientId={gradientId} />
    </button>
  );
}

/** Decorative National Day balloons — click for fireworks / flag glare. */
export default function NationalDayAccents() {
  const { t } = useTranslation();
  const [bursts, setBursts] = useState([]);

  const spawnBurst = useCallback((point) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setBursts((current) => [...current, { id, ...point }]);
    window.setTimeout(() => {
      setBursts((current) => current.filter((item) => item.id !== id));
    }, BURST_MS);
  }, []);

  if (!NATIONAL_DAY.enabled) return null;

  const popLabel = t('nationalDay.popBalloon', {
    defaultValue: 'Celebrate — pop balloon',
  });

  return (
    <div className="national-day-accents">
      <BalloonButton
        className="national-day-accents__balloon--tl"
        tone="green"
        label={popLabel}
        onBurst={spawnBurst}
      />
      <BalloonButton
        className="national-day-accents__balloon--tr"
        tone="burgundy"
        label={popLabel}
        onBurst={spawnBurst}
      />
      <BalloonButton
        className="national-day-accents__balloon--bl"
        tone="burgundy"
        label={popLabel}
        onBurst={spawnBurst}
      />
      <BalloonButton
        className="national-day-accents__balloon--br"
        tone="green"
        label={popLabel}
        onBurst={spawnBurst}
      />

      <div className="national-day-fireworks" aria-hidden>
        {bursts.map((burst) => (
          <FireworkBurst key={burst.id} burst={burst} />
        ))}
      </div>
    </div>
  );
}
