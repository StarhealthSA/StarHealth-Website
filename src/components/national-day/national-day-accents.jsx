'use client';

import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NATIONAL_DAY } from '@/lib/national-day/config';

const FIREWORK_COLORS = ['#006c35', '#ffffff', '#1fa05a', '#a8e6c1', '#f8fff9'];
const BURST_MS = 1600;
const TOGGLE_ICON = '/national-day/balloon-green.png';

/** All provided balloon assets — always shown together when enabled. */
const BALLOONS = [
  {
    id: 'green-ar',
    src: '/national-day/balloon-green.png',
    drift: 1,
    size: 'lg',
  },
  {
    id: 'red-ar',
    src: '/national-day/balloon-red.png',
    drift: 2,
    size: 'md',
  },
  {
    id: 'green-en',
    src: '/national-day/balloon-green-en.png',
    drift: 3,
    size: 'md',
  },
  {
    id: 'red-en',
    src: '/national-day/balloon-red-en.png',
    drift: 4,
    size: 'lg',
  },
];

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
        <img src={balloon.src} alt="" draggable={false} />
      </span>
    </button>
  );
}

/** Floating sky balloons — toggled from a control above WhatsApp. */
export default function NationalDayAccents() {
  const { t } = useTranslation();
  const [skyEnabled, setSkyEnabled] = useState(false);
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
  const toggleLabel = skyEnabled
    ? t('nationalDay.hideBalloons', { defaultValue: 'Hide National Day balloons' })
    : t('nationalDay.showBalloons', { defaultValue: 'Show National Day balloons' });

  return (
    <>
      <button
        type="button"
        className={`national-day-balloon-toggle${skyEnabled ? ' is-active' : ''}`}
        onClick={() => setSkyEnabled((current) => !current)}
        aria-pressed={skyEnabled}
        aria-label={toggleLabel}
        title={toggleLabel}
      >
        <img src={TOGGLE_ICON} alt="" draggable={false} />
      </button>

      {skyEnabled ? (
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
      ) : null}
    </>
  );
}
