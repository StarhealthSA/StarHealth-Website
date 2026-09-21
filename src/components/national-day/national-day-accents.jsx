'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NATIONAL_DAY } from '@/lib/national-day/config';

const TOGGLE_ICON = '/national-day/balloon-green.png';

const BALLOON_SETS = {
  ar: {
    green: '/national-day/balloon-green.png',
    red: '/national-day/balloon-red.png',
  },
  en: {
    green: '/national-day/balloon-green-en.png',
    red: '/national-day/balloon-red-en.png',
  },
};

/** Corner National Day balloons — toggled from a control above WhatsApp. */
export default function NationalDayAccents() {
  const { t, i18n } = useTranslation();
  const [skyEnabled, setSkyEnabled] = useState(false);
  const isArabic = (i18n.language || '').toLowerCase().startsWith('ar');
  const set = isArabic ? BALLOON_SETS.ar : BALLOON_SETS.en;

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
          <div className="national-day-sky-balloon national-day-sky-balloon--lg national-day-sky-balloon--left national-day-sky-balloon--mid">
            <img src={set.green} alt="" draggable={false} />
          </div>
          <div className="national-day-sky-balloon national-day-sky-balloon--lg national-day-sky-balloon--right national-day-sky-balloon--mid">
            <img src={set.red} alt="" draggable={false} />
          </div>
        </div>
      ) : null}
    </>
  );
}
