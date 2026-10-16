'use client';

import { useEffect, useRef, useState } from 'react';
import { getGiveawayEndDate } from '@/lib/giveaway/config';

const DROP_MS = 560;

function getRemaining(endDate) {
  const diff = Math.max(0, endDate.getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    expired: diff <= 0,
  };
}

function pad2(value) {
  return String(value).padStart(2, '0');
}

function DropDigit({ digit }) {
  const next = String(digit);
  const [active, setActive] = useState(next);
  const [outgoing, setOutgoing] = useState(null);
  const [tick, setTick] = useState(0);
  const activeRef = useRef(next);
  activeRef.current = active;

  useEffect(() => {
    if (next === activeRef.current) return undefined;

    const previous = activeRef.current;
    setOutgoing(previous);
    setActive(next);
    setTick((value) => value + 1);

    const timer = window.setTimeout(() => {
      setOutgoing(null);
    }, DROP_MS);

    return () => window.clearTimeout(timer);
  }, [next]);

  return (
    <div className="flip-digit">
      {outgoing != null ? (
        <span
          key={`out-${tick}`}
          className="flip-digit__layer flip-digit__layer--out"
          aria-hidden
        >
          {outgoing}
        </span>
      ) : null}
      <span
        key={`in-${tick}`}
        className={`flip-digit__layer flip-digit__layer--in${outgoing != null ? ' is-enter' : ''}`}
        aria-hidden
      >
        {active}
      </span>
      <span className="sr-only">{active}</span>
    </div>
  );
}

function FlipUnit({ value, label }) {
  const digits = pad2(value).split('');

  return (
    <div className="flip-unit">
      <div className="flip-unit__digits">
        <DropDigit digit={digits[0]} />
        <DropDigit digit={digits[1]} />
      </div>
      <span className="flip-unit__label">{label}</span>
    </div>
  );
}

function FlipClock({ remaining, labels, className = '' }) {
  const units = [
    { key: 'days', value: remaining.days, label: labels.days },
    { key: 'hours', value: remaining.hours, label: labels.hours },
    { key: 'minutes', value: remaining.minutes, label: labels.minutes },
    { key: 'seconds', value: remaining.seconds, label: labels.seconds },
  ];

  return (
    <div
      className={`flip-clock ${className}`.trim()}
      aria-live="polite"
      aria-label={labels.eyebrow}
    >
      {units.map((unit) => (
        <FlipUnit key={unit.key} value={unit.value} label={unit.label} />
      ))}
    </div>
  );
}

/** Stable SSR placeholder — avoids Date.now() hydration mismatches. */
function FlipClockPlaceholder({ labels, className = '' }) {
  const units = [
    { key: 'days', label: labels.days },
    { key: 'hours', label: labels.hours },
    { key: 'minutes', label: labels.minutes },
    { key: 'seconds', label: labels.seconds },
  ];

  return (
    <div
      className={`flip-clock ${className}`.trim()}
      aria-hidden
    >
      {units.map((unit) => (
        <div key={unit.key} className="flip-unit">
          <div className="flip-unit__digits">
            <div className="flip-digit">
              <span className="flip-digit__layer flip-digit__layer--in">0</span>
            </div>
            <div className="flip-digit">
              <span className="flip-digit__layer flip-digit__layer--in">0</span>
            </div>
          </div>
          <span className="flip-unit__label">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function GiveawayCountdown({
  labels,
  className = '',
  variant = 'default',
}) {
  const [remaining, setRemaining] = useState(null);

  useEffect(() => {
    const endDate = getGiveawayEndDate();
    const tick = () => setRemaining(getRemaining(endDate));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const isFlip = variant === 'stage' || variant === 'flip';

  // Wait until client mount so SSR HTML matches first client paint.
  if (!remaining) {
    if (isFlip) {
      return <FlipClockPlaceholder labels={labels} className={className} />;
    }
    return (
      <div className={`giveaway-countdown ${className}`} aria-hidden>
        <p className="giveaway-countdown__eyebrow">{labels.eyebrow}</p>
        <div className="giveaway-countdown__grid">
          {[labels.days, labels.hours, labels.minutes, labels.seconds].map((label) => (
            <div key={label} className="giveaway-countdown__unit">
              <span className="giveaway-countdown__value">00</span>
              <span className="giveaway-countdown__label">{label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (remaining.expired) {
    return (
      <div className={`giveaway-countdown giveaway-countdown--ended ${className}`}>
        <p className="giveaway-countdown__ended">{labels.ended}</p>
      </div>
    );
  }

  if (isFlip) {
    return <FlipClock remaining={remaining} labels={labels} className={className} />;
  }

  return (
    <div className={`giveaway-countdown ${className}`} aria-live="polite">
      <p className="giveaway-countdown__eyebrow">{labels.eyebrow}</p>
      <div className="giveaway-countdown__grid">
        {[
          { key: 'days', value: remaining.days, label: labels.days },
          { key: 'hours', value: remaining.hours, label: labels.hours },
          { key: 'minutes', value: remaining.minutes, label: labels.minutes },
          { key: 'seconds', value: remaining.seconds, label: labels.seconds },
        ].map((unit) => (
          <div key={unit.key} className="giveaway-countdown__unit">
            <span className="giveaway-countdown__value">{pad2(unit.value)}</span>
            <span className="giveaway-countdown__label">{unit.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
