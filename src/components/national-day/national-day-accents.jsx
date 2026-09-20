'use client';

import { useCallback, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NATIONAL_DAY } from '@/lib/national-day/config';

const FIREWORK_COLORS = ['#006c35', '#ffffff', '#1fa05a', '#a8e6c1', '#f8fff9'];
const BURST_MS = 1600;

const BALLOONS = [
  { id: 'a', tone: 'green', drift: 1, size: 'lg' },
  { id: 'b', tone: 'burgundy', drift: 2, size: 'md' },
  { id: 'c', tone: 'green', drift: 3, size: 'sm' },
  { id: 'd', tone: 'burgundy', drift: 4, size: 'md' },
  { id: 'e', tone: 'green', drift: 5, size: 'sm' },
];

function HotAirBalloon({ tone = 'green', gradientPrefix }) {
  const isBurgundy = tone === 'burgundy';
  const envelope = `${gradientPrefix}-envelope`;
  const shine = `${gradientPrefix}-shine`;
  const gore = `${gradientPrefix}-gore`;
  const basket = `${gradientPrefix}-basket`;

  return (
    <svg viewBox="0 0 160 220" aria-hidden focusable="false">
      <defs>
        <radialGradient id={envelope} cx="38%" cy="30%" r="70%">
          {isBurgundy ? (
            <>
              <stop offset="0%" stopColor="#d45a6e" />
              <stop offset="45%" stopColor="#8b1538" />
              <stop offset="100%" stopColor="#4a0f1c" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#3dce7a" />
              <stop offset="42%" stopColor="#008b4b" />
              <stop offset="100%" stopColor="#004d26" />
            </>
          )}
        </radialGradient>
        <linearGradient id={shine} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={gore} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.18" />
        </linearGradient>
        <linearGradient id={basket} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c48a4a" />
          <stop offset="100%" stopColor="#7a4a22" />
        </linearGradient>
      </defs>

      {/* Envelope */}
      <ellipse cx="80" cy="78" rx="62" ry="72" fill={`url(#${envelope})`} />
      {/* Vertical gores */}
      <path d="M80 8 C68 40 66 90 72 148 L88 148 C94 90 92 40 80 8 Z" fill={`url(#${gore})`} />
      <path d="M40 36 C48 70 52 110 58 148 L42 148 C34 100 28 60 40 36 Z" fill="#000" opacity="0.1" />
      <path d="M120 36 C112 70 108 110 102 148 L118 148 C126 100 132 60 120 36 Z" fill="#000" opacity="0.1" />
      {/* Pattern band */}
      <path
        d="M28 70 Q80 58 132 70 Q130 86 80 92 Q30 86 28 70 Z"
        fill={isBurgundy ? '#6b1d2a' : '#006c35'}
        opacity="0.35"
      />
      <path
        d="M34 74 H50 V82 H34 Z M58 72 H74 V84 H58 Z M82 72 H98 V84 H82 Z M106 74 H122 V82 H106 Z"
        fill="#fff"
        opacity="0.35"
      />
      {/* Gloss highlight */}
      <ellipse cx="58" cy="48" rx="22" ry="34" fill={`url(#${shine})`} />
      {/* Bottom throat */}
      <path d="M58 148 L80 168 L102 148 Z" fill={`url(#${envelope})`} />
      <ellipse cx="80" cy="148" rx="22" ry="6" fill="#000" opacity="0.18" />

      {/* Rigging */}
      <path d="M62 166 L70 188 M80 168 L80 190 M98 166 L90 188" stroke="#5c4030" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M66 168 L94 168" stroke="#5c4030" strokeWidth="1.2" opacity="0.7" />

      {/* Basket */}
      <rect x="66" y="188" width="28" height="20" rx="2.5" fill={`url(#${basket})`} />
      <path d="M68 192 H92 M68 196 H92 M68 200 H92 M70 188 V208 M76 188 V208 M82 188 V208 M88 188 V208" stroke="#5a3416" strokeWidth="1" opacity="0.55" />
      <rect x="64" y="186" width="32" height="4" rx="1.5" fill="#8b5a2b" />
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

function BalloonButton({ balloon, label, onBurst }) {
  const reactId = useId();
  const gradientPrefix = `nd-sky-${balloon.id}-${reactId.replace(/:/g, '')}`;

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
      className={`national-day-sky-balloon national-day-sky-balloon--${balloon.size} national-day-sky-balloon--drift-${balloon.drift}`}
      onClick={handleClick}
      aria-label={label}
    >
      <span className="national-day-sky-balloon__bob">
        <HotAirBalloon tone={balloon.tone} gradientPrefix={gradientPrefix} />
      </span>
    </button>
  );
}

/** Realistic floating sky balloons — click for Saudi flag glare. */
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
      {BALLOONS.map((balloon) => (
        <BalloonButton
          key={balloon.id}
          balloon={balloon}
          label={popLabel}
          onBurst={spawnBurst}
        />
      ))}

      <div className="national-day-fireworks" aria-hidden>
        {bursts.map((burst) => (
          <FireworkBurst key={burst.id} burst={burst} />
        ))}
      </div>
    </div>
  );
}
