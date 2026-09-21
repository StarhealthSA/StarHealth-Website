'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NATIONAL_DAY } from '@/lib/national-day/config';

const TOGGLE_ICON = '/national-day/balloon-green.png';

/** Static corner balloons — left / right only. */
const CORNER_BALLOONS = [
  {
    id: 'left-green',
    src: '/national-day/balloon-green.png',
    corner: 'left',
    size: 'lg',
    offset: 'upper',
  },
  {
    id: 'left-red',
    src: '/national-day/balloon-red.png',
    corner: 'left',
    size: 'md',
    offset: 'lower',
  },
  {
    id: 'right-green',
    src: '/national-day/balloon-green-en.png',
    corner: 'right',
    size: 'md',
    offset: 'upper',
  },
  {
    id: 'right-red',
    src: '/national-day/balloon-red-en.png',
    corner: 'right',
    size: 'lg',
    offset: 'lower',
  },
];

/** Corner National Day balloons — toggled from a control above WhatsApp. */
export default function NationalDayAccents() {
  const { t } = useTranslation();
  const [skyEnabled, setSkyEnabled] = useState(false);

  if (!NATIONAL_DAY.enabled) return null;

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
        <div className="national-day-accents" aria-hidden>
          {CORNER_BALLOONS.map((balloon) => (
            <div
              key={balloon.id}
              className={[
                'national-day-sky-balloon',
                `national-day-sky-balloon--${balloon.size}`,
                `national-day-sky-balloon--${balloon.corner}`,
                `national-day-sky-balloon--${balloon.offset}`,
              ].join(' ')}
            >
              <img src={balloon.src} alt="" draggable={false} />
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
}
