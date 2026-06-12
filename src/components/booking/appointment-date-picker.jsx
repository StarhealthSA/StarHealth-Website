'use client';

import { useEffect, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useTranslation } from 'react-i18next';
import { parseDateKey } from '@/lib/appointments/slot-utils';

export default function AppointmentDatePicker({
  doctorId,
  selectedDate,
  onChange,
  className = '',
  inputClassName = '',
  isRTL = false,
  calendarIcon = null,
  variant = 'light',
}) {
  const isDark = variant === 'onDark';
  const { t } = useTranslation();
  const [availableDates, setAvailableDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!doctorId) {
      setAvailableDates([]);
      setError('');
      return undefined;
    }

    const controller = new AbortController();

    async function loadDates() {
      try {
        setLoading(true);
        setError('');
        const response = await fetch(
          `/api/appointments/available-dates?doctorId=${encodeURIComponent(doctorId)}`,
          { signal: controller.signal }
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to load available dates');
        }
        if (data.scheduleMode !== 'configured') {
          setAvailableDates([]);
          return;
        }
        setAvailableDates(data.dates || []);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setAvailableDates([]);
          setError(err.message || 'Failed to load available dates');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadDates();
    return () => controller.abort();
  }, [doctorId]);

  const includeDates = useMemo(
    () => availableDates.map((item) => parseDateKey(item.dateKey)),
    [availableDates]
  );

  const messageClass = isDark ? 'text-sm text-white/80' : 'text-sm text-[#586971]';

  if (!doctorId) {
    return (
      <p className={`${messageClass} ${className}`}>
        {t('doctorModal.selectDoctorFirst')}
      </p>
    );
  }

  if (loading) {
    return <p className={`${messageClass} ${className}`}>{t('doctorModal.loadingDates')}</p>;
  }

  if (error) {
    return <p className={`text-sm ${isDark ? 'text-red-200' : 'text-red-600'} ${className}`}>{error}</p>;
  }

  if (!includeDates.length) {
    return (
      <p className={`${messageClass} ${className}`}>
        {t('doctorModal.noAvailableDates')}
      </p>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <DatePicker
        selected={selectedDate}
        onChange={onChange}
        includeDates={includeDates}
        minDate={includeDates[0] || new Date()}
        maxDate={includeDates[includeDates.length - 1] || null}
        placeholderText={t('doctorModal.selectDate')}
        className={inputClassName}
        calendarClassName={isDark ? 'font-inter bg-[#037B76] text-white border border-[#FFFFFF66] rounded-lg' : undefined}
        showPopperArrow={false}
        popperClassName="!z-50"
        required
      />
      {calendarIcon && (
        <div className={`pointer-events-none absolute inset-y-0 ${isRTL ? 'left-0' : 'right-0'} flex items-center px-3`}>
          {calendarIcon}
        </div>
      )}
    </div>
  );
}
