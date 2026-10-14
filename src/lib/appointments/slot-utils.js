export const SLOT_DURATION_MINUTES = 30;
export const ALLOWED_SLOT_DURATIONS = [30, 40];
export const SLOTS_PER_DAY = Math.floor(1440 / SLOT_DURATION_MINUTES);

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export function normalizeSlotDuration(value) {
  const duration = Number(value);
  return ALLOWED_SLOT_DURATIONS.includes(duration) ? duration : SLOT_DURATION_MINUTES;
}

export function getDoctorSlotDuration(doctor) {
  return normalizeSlotDuration(doctor?.slotDurationMinutes);
}

export function getSlotsPerDay(duration = SLOT_DURATION_MINUTES) {
  return Math.floor(1440 / normalizeSlotDuration(duration));
}

export function slotIndexToMinutes(index, duration = SLOT_DURATION_MINUTES) {
  return Number(index) * normalizeSlotDuration(duration);
}

export function minutesToSlotIndex(totalMinutes, duration = SLOT_DURATION_MINUTES) {
  const step = normalizeSlotDuration(duration);
  return Math.round(Number(totalMinutes) / step);
}

export function formatTime12h(totalMinutes) {
  const mins = ((totalMinutes % 1440) + 1440) % 1440;
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  const period = hours < 12 ? 'AM' : 'PM';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${String(minutes).padStart(2, '0')} ${period}`;
}

export function formatSlotLabel(index, duration = SLOT_DURATION_MINUTES) {
  const step = normalizeSlotDuration(duration);
  const start = slotIndexToMinutes(index, step);
  const end = start + step;
  return `${formatTime12h(start)} - ${formatTime12h(end)}`;
}

export function getAllSlotOptions(duration = SLOT_DURATION_MINUTES) {
  const step = normalizeSlotDuration(duration);
  const count = getSlotsPerDay(step);
  return Array.from({ length: count }, (_, index) => ({
    index,
    label: formatSlotLabel(index, step),
  }));
}

export function getDayKey(date) {
  return DAY_KEYS[date.getDay()];
}

export function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateKey(dateKey) {
  const normalized = String(dateKey).trim().slice(0, 10);
  const [year, month, day] = normalized.split('-').map(Number);
  if (!year || !month || !day) {
    throw new Error('Invalid date');
  }
  return new Date(year, month - 1, day);
}

export function getDutySlotIndicesFromEntry(entry) {
  if (!entry?.enabled || entry.startSlot == null || entry.endSlot == null) return [];

  const start = Number(entry.startSlot);
  const end = Number(entry.endSlot);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return [];

  return Array.from({ length: end - start }, (_, offset) => start + offset);
}

export function getDutySlotIndices(dutySchedule, dayKey) {
  return getDutySlotIndicesFromEntry(dutySchedule?.[dayKey]);
}

export const OPEN_BOOKING_DAYS = 60;

export function doctorHasAvailabilitySchedule(doctor) {
  const availability = doctor?.dateAvailability || {};
  return Object.values(availability).some((entry) => entry?.enabled);
}

export function getDateAvailabilityEntry(doctor, date) {
  const dateKey = formatDateKey(date);
  const entry = doctor?.dateAvailability?.[dateKey];
  if (entry?.enabled) return entry;
  return null;
}

export function getDoctorDutySlotIndices(doctor, date) {
  const entry = getDateAvailabilityEntry(doctor, date);
  return getBookableSlotIndicesFromEntry(entry, doctor?.scheduleBreak);
}

export function getUpcomingDateKeys(days = 30, fromDate = new Date()) {
  const keys = [];
  const cursor = new Date(fromDate);
  cursor.setHours(0, 0, 0, 0);

  for (let index = 0; index < days; index += 1) {
    keys.push(formatDateKey(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return keys;
}

export function formatDateLabel(dateKey, locale = 'en') {
  const date = parseDateKey(dateKey);
  return date.toLocaleDateString(locale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function buildSlotAvailability(doctor, date, bookedSlotIndices = []) {
  const duration = getDoctorSlotDuration(doctor);
  const bookedSet = new Set(bookedSlotIndices);
  const dutySlots = getDoctorDutySlotIndices(doctor, date);

  return dutySlots.map((index) => ({
    index,
    label: formatSlotLabel(index, duration),
    status: bookedSet.has(index) ? 'booked' : 'available',
  }));
}

export function getDefaultDutySchedule(duration = SLOT_DURATION_MINUTES) {
  const step = normalizeSlotDuration(duration);
  // Default window: 9:00 AM – 5:00 PM
  return {
    startSlot: minutesToSlotIndex(9 * 60, step),
    endSlot: minutesToSlotIndex(17 * 60, step),
  };
}

export const DEFAULT_DUTY_SCHEDULE = getDefaultDutySchedule(SLOT_DURATION_MINUTES);

export const DEFAULT_SCHEDULE_BREAK = {
  breaks: [],
};

export function normalizeBreakPeriod(period) {
  const start = Number(period?.breakStartSlot);
  const end = Number(period?.breakEndSlot);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return null;

  return {
    id: period?.id || `break-${start}-${end}`,
    breakStartSlot: start,
    breakEndSlot: end,
  };
}

export function normalizeScheduleBreak(breakConfig) {
  if (!breakConfig) return { breaks: [] };

  if (Array.isArray(breakConfig.breaks)) {
    return {
      breaks: breakConfig.breaks.map(normalizeBreakPeriod).filter(Boolean),
    };
  }

  if (
    breakConfig.enabled &&
    (breakConfig.breakStartSlot != null || breakConfig.breakEndSlot != null)
  ) {
    const legacyBreak = normalizeBreakPeriod(breakConfig);
    return { breaks: legacyBreak ? [legacyBreak] : [] };
  }

  return { breaks: [] };
}

export function createDefaultBreakPeriod(existingBreaks = [], duration = SLOT_DURATION_MINUTES) {
  const step = normalizeSlotDuration(duration);
  const slotsPerDay = getSlotsPerDay(step);
  const lastBreak = existingBreaks[existingBreaks.length - 1];
  const noonSlot = minutesToSlotIndex(12 * 60, step);
  const start = lastBreak
    ? Math.min(lastBreak.breakEndSlot + 1, slotsPerDay - 2)
    : noonSlot;

  return {
    id: `break-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    breakStartSlot: start,
    breakEndSlot: Math.min(start + 1, slotsPerDay),
  };
}

export function getBreakSlotIndicesFromBreaks(breaks = []) {
  const indices = new Set();

  breaks.forEach((period) => {
    const start = Number(period?.breakStartSlot);
    const end = Number(period?.breakEndSlot);
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return;

    for (let index = start; index < end; index += 1) {
      indices.add(index);
    }
  });

  return [...indices].sort((a, b) => a - b);
}

export function formatBreakPeriodLabel(period, duration = SLOT_DURATION_MINUTES) {
  const normalized = normalizeBreakPeriod(period);
  if (!normalized) return '';
  const step = normalizeSlotDuration(duration);
  return `${formatSlotLabel(normalized.breakStartSlot, step)} – ${formatTime12h(slotIndexToMinutes(normalized.breakEndSlot, step))}`;
}

export function getBreakSlotIndicesFromEntry(entry, scheduleBreak) {
  const breaks = entry?.breaks != null
    ? normalizeScheduleBreak({ breaks: entry.breaks }).breaks
    : normalizeScheduleBreak(scheduleBreak).breaks;

  return getBreakSlotIndicesFromBreaks(breaks);
}

export function getBookableSlotIndicesFromEntry(entry, scheduleBreak) {
  const dutySlots = getDutySlotIndicesFromEntry(entry);
  const breakSlots = new Set(getBreakSlotIndicesFromEntry(entry, scheduleBreak));
  return dutySlots.filter((index) => !breakSlots.has(index));
}

function remapSlotIndex(index, fromDuration, toDuration, slotsPerDay) {
  if (!Number.isFinite(Number(index))) return index;
  const minutes = slotIndexToMinutes(index, fromDuration);
  return Math.min(Math.max(minutesToSlotIndex(minutes, toDuration), 0), slotsPerDay);
}

/** Remap duty/break slot indices when a doctor switches 30 <-> 40 minute duration. */
export function remapScheduleForDuration({
  dateAvailability = {},
  scheduleBreak = DEFAULT_SCHEDULE_BREAK,
  fromDuration = SLOT_DURATION_MINUTES,
  toDuration = SLOT_DURATION_MINUTES,
} = {}) {
  const from = normalizeSlotDuration(fromDuration);
  const to = normalizeSlotDuration(toDuration);
  if (from === to) {
    return { dateAvailability, scheduleBreak: normalizeScheduleBreak(scheduleBreak) };
  }

  const slotsPerDay = getSlotsPerDay(to);
  const defaults = getDefaultDutySchedule(to);

  const nextAvailability = Object.fromEntries(
    Object.entries(dateAvailability).map(([dateKey, entry]) => {
      if (!entry || typeof entry !== 'object') return [dateKey, entry];

      const startSlot = remapSlotIndex(entry.startSlot ?? defaults.startSlot, from, to, slotsPerDay);
      let endSlot = remapSlotIndex(entry.endSlot ?? defaults.endSlot, from, to, slotsPerDay);
      if (endSlot <= startSlot) {
        endSlot = Math.min(startSlot + 1, slotsPerDay);
      }

      return [
        dateKey,
        {
          ...entry,
          startSlot,
          endSlot,
        },
      ];
    })
  );

  const breaks = normalizeScheduleBreak(scheduleBreak).breaks.map((period) => {
    const breakStartSlot = remapSlotIndex(period.breakStartSlot, from, to, slotsPerDay);
    let breakEndSlot = remapSlotIndex(period.breakEndSlot, from, to, slotsPerDay);
    if (breakEndSlot <= breakStartSlot) {
      breakEndSlot = Math.min(breakStartSlot + 1, slotsPerDay);
    }
    return {
      ...period,
      breakStartSlot,
      breakEndSlot,
    };
  });

  return {
    dateAvailability: nextAvailability,
    scheduleBreak: { breaks },
  };
}
