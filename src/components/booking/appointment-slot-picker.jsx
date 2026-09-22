'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDateKey } from '@/lib/appointments/slot-utils';

export default function AppointmentSlotPicker({
  doctorId,
  date,
  selectedSlot,
  onSelect,
  excludeAppointmentId = null,
  className = '',
  gridClassName = '',
  variant = 'light',
  onAvailabilityChange,
}) {
  const isDark = variant === 'onDark';
  const { t } = useTranslation();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const onAvailabilityChangeRef = useRef(onAvailabilityChange);
  onAvailabilityChangeRef.current = onAvailabilityChange;

  useEffect(() => {
    if (!doctorId || !date) {
      setSlots([]);
      setError('');
      onAvailabilityChangeRef.current?.({ loading: false, freeCount: null });
      return undefined;
    }

    const controller = new AbortController();

    async function loadSlots() {
      try {
        setLoading(true);
        onAvailabilityChangeRef.current?.({ loading: true, freeCount: null });
        setError('');
        const dateKey = formatDateKey(date);
        const excludeQuery = excludeAppointmentId
          ? `&excludeAppointmentId=${encodeURIComponent(excludeAppointmentId)}`
          : '';
        const response = await fetch(
          `/api/appointments/slots?doctorId=${encodeURIComponent(doctorId)}&date=${dateKey}${excludeQuery}`,
          { signal: controller.signal }
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to load slots');
        }
        const nextSlots = data.slots || [];
        if (!controller.signal.aborted) {
          setSlots(nextSlots);
          const freeCount = nextSlots.filter((slot) => slot.status !== 'booked').length;
          onAvailabilityChangeRef.current?.({ loading: false, freeCount });
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          setSlots([]);
          setError(err.message || 'Failed to load slots');
          onAvailabilityChangeRef.current?.({ loading: false, freeCount: 0 });
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadSlots();
    return () => controller.abort();
  }, [doctorId, date, excludeAppointmentId]);

  const messageClass = isDark ? 'text-sm text-white/80' : 'text-sm text-[#586971]';
  const titleClass = isDark ? 'mb-3 text-sm font-medium text-white' : 'mb-3 text-sm font-medium text-[#002333]';
  const freeSlots = slots.filter((slot) => slot.status !== 'booked');

  if (!doctorId || !date) {
    return (
      <p className={`${messageClass} ${className}`}>
        {t('doctorModal.selectDoctorAndDate')}
      </p>
    );
  }

  if (loading) {
    return <p className={`${messageClass} ${className}`}>{t('doctorModal.loadingSlots')}</p>;
  }

  if (error) {
    return <p className={`text-sm ${isDark ? 'text-red-200' : 'text-red-600'} ${className}`}>{error}</p>;
  }

  if (!freeSlots.length) {
    return (
      <div className={className}>
        <p className={messageClass}>{t('doctorModal.noSlotsAvailable')}</p>
        <p className={`mt-2 ${messageClass}`}>{t('doctorModal.openScheduleNote')}</p>
      </div>
    );
  }

  const defaultGridClass = 'grid max-h-40 grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2';

  return (
    <div className={className}>
      <p className={`${titleClass} shrink-0`}>{t('doctorModal.timeSlot')}</p>
      <div className={gridClassName || defaultGridClass}>
        {slots.map((slot) => {
          const isBooked = slot.status === 'booked';
          const isSelected = selectedSlot === slot.index;

          return (
            <button
              key={slot.index}
              type="button"
              disabled={isBooked}
              onClick={() => onSelect(slot)}
              className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
                isBooked
                  ? isDark
                    ? 'cursor-not-allowed border-white/20 bg-white/10 text-white/40 line-through'
                    : 'cursor-not-allowed border-[#E9E7E6] bg-[#F5F5F4] text-[#A8B0B3] line-through'
                  : isSelected
                    ? 'border-white bg-white text-[#037B76]'
                    : isDark
                      ? 'border-white/40 bg-white/10 text-white hover:bg-white/20'
                      : 'border-[#DAD8D7] bg-white text-[#002333] hover:border-[#037B76] hover:bg-[#F3FAF8]'
              }`}
            >
              <span className="block font-medium">{slot.label}</span>
              {isBooked && (
                <span className="mt-0.5 block text-xs">{t('doctorModal.slotBooked')}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
