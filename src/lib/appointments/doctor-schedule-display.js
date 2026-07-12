import {
  doctorHasAvailabilitySchedule,
  formatDateKey,
  formatDateLabel,
  formatTime12h,
  getDateAvailabilityEntry,
  getUpcomingDateKeys,
  normalizeBreakPeriod,
  normalizeScheduleBreak,
  OPEN_BOOKING_DAYS,
  parseDateKey,
  slotIndexToMinutes,
} from '@/lib/appointments/slot-utils';
import { getLocalizedText } from '@/lib/content/localized';

function formatConsultationWindow(startSlot, endSlot) {
  return `${formatTime12h(slotIndexToMinutes(startSlot))} - ${formatTime12h(slotIndexToMinutes(endSlot))}`;
}

export function getConsultationWindowsFromEntry(entry, scheduleBreak) {
  if (!entry?.enabled || entry.startSlot == null || entry.endSlot == null) {
    return [];
  }

  const dutyStart = Number(entry.startSlot);
  const dutyEnd = Number(entry.endSlot);
  if (!Number.isFinite(dutyStart) || !Number.isFinite(dutyEnd) || dutyEnd <= dutyStart) {
    return [];
  }

  const breaks = normalizeScheduleBreak(scheduleBreak).breaks
    .map(normalizeBreakPeriod)
    .filter(Boolean)
    .filter((period) => period.breakStartSlot < dutyEnd && period.breakEndSlot > dutyStart)
    .sort((a, b) => a.breakStartSlot - b.breakStartSlot);

  if (!breaks.length) {
    return [formatConsultationWindow(dutyStart, dutyEnd)];
  }

  const windows = [];
  let cursor = dutyStart;

  breaks.forEach((period) => {
    if (period.breakStartSlot > cursor) {
      windows.push(formatConsultationWindow(cursor, period.breakStartSlot));
    }
    cursor = Math.max(cursor, period.breakEndSlot);
  });

  if (cursor < dutyEnd) {
    windows.push(formatConsultationWindow(cursor, dutyEnd));
  }

  return windows;
}

export function getTodayConsultationWindows(doctor, date = new Date()) {
  const entry = getDateAvailabilityEntry(doctor, date);
  if (!entry) return [];
  return getConsultationWindowsFromEntry(entry, doctor?.scheduleBreak);
}

export function getUpcomingEnabledDates(
  doctor,
  { days = OPEN_BOOKING_DAYS, locale = 'en', fromDate = new Date() } = {}
) {
  const resolvedLocale = locale === 'ar' ? 'ar-SA' : 'en-US';

  return getUpcomingDateKeys(days, fromDate)
    .filter((dateKey) => doctor?.dateAvailability?.[dateKey]?.enabled)
    .map((dateKey) => ({
      dateKey,
      label: formatDateLabel(dateKey, resolvedLocale),
      shortLabel: parseDateKey(dateKey).toLocaleDateString(resolvedLocale, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
    }));
}

export function getDoctorScheduleDisplay(doctor, language = 'en', date = new Date()) {
  const hasSchedule = doctorHasAvailabilitySchedule(doctor);
  const todayWindows = getTodayConsultationWindows(doctor, date);
  const upcomingDates = getUpcomingEnabledDates(doctor, { locale: language });
  const fallbackTimings = getLocalizedText(doctor?.consultationTimings, language);

  return {
    hasSchedule,
    todayWindows,
    todayAvailable: todayWindows.length > 0,
    upcomingDates,
    fallbackTimings: !hasSchedule ? fallbackTimings : '',
    todayDateKey: formatDateKey(date),
  };
}
