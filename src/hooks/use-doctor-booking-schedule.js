'use client';

import { useEffect, useState } from 'react';

export function useDoctorBookingSchedule(doctorId) {
  const [scheduleMode, setScheduleMode] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!doctorId) {
      setScheduleMode(null);
      return undefined;
    }

    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/appointments/available-dates?doctorId=${encodeURIComponent(doctorId)}`,
          { signal: controller.signal }
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to load schedule');
        }
        if (!controller.signal.aborted) {
          setScheduleMode(data.scheduleMode || 'open');
        }
      } catch {
        if (!controller.signal.aborted) {
          setScheduleMode('open');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    load();
    return () => controller.abort();
  }, [doctorId]);

  return {
    loading,
    scheduleMode,
    isConfigured: scheduleMode === 'configured',
    isOpenSchedule: scheduleMode === 'open',
  };
}
