'use client';

import { useEffect, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  DEFAULT_DUTY_SCHEDULE,
  DEFAULT_SCHEDULE_BREAK,
  formatDateKey,
  formatDateLabel,
  formatTime12h,
  getAllSlotOptions,
  getBookableSlotIndicesFromEntry,
  getBreakSlotIndicesFromEntry,
  getUpcomingDateKeys,
  parseDateKey,
  slotIndexToMinutes,
  SLOTS_PER_DAY,
} from '@/lib/appointments/slot-utils';
import AdminPageLoader from '@/components/admin/admin-page-loader';

const SLOT_OPTIONS = getAllSlotOptions();
const UPCOMING_DAYS = 30;

function getEndTimeLabel(endSlot) {
  return formatTime12h(slotIndexToMinutes(endSlot));
}

export default function DoctorAvailabilityCalendar({
  dateAvailability = {},
  onChange,
  scheduleBreak = DEFAULT_SCHEDULE_BREAK,
  onScheduleBreakChange,
  doctorId = '',
}) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingBooked, setLoadingBooked] = useState(false);

  const selectedDateKey = formatDateKey(selectedDate);
  const upcomingDateKeys = useMemo(() => getUpcomingDateKeys(UPCOMING_DAYS), []);
  const enabledDateKeys = useMemo(
    () => upcomingDateKeys.filter((key) => dateAvailability[key]?.enabled),
    [dateAvailability, upcomingDateKeys]
  );
  const highlightDates = useMemo(
    () => enabledDateKeys.map((key) => parseDateKey(key)),
    [enabledDateKeys]
  );

  const selectedEntry = dateAvailability[selectedDateKey];
  const isSelectedEnabled = Boolean(selectedEntry?.enabled);
  const startSlot = selectedEntry?.startSlot ?? DEFAULT_DUTY_SCHEDULE.startSlot;
  const endSlot = selectedEntry?.endSlot ?? DEFAULT_DUTY_SCHEDULE.endSlot;
  const breakEnabled = Boolean(scheduleBreak?.enabled);
  const breakStartSlot = scheduleBreak?.breakStartSlot ?? DEFAULT_SCHEDULE_BREAK.breakStartSlot;
  const breakEndSlot = scheduleBreak?.breakEndSlot ?? DEFAULT_SCHEDULE_BREAK.breakEndSlot;

  const slotPreview = useMemo(() => {
    if (!isSelectedEnabled) return [];
    const entry = { enabled: true, startSlot, endSlot };
    return getBookableSlotIndicesFromEntry(entry, scheduleBreak).map((index) => {
      const option = SLOT_OPTIONS.find((slot) => slot.index === index);
      return option?.label || '';
    });
  }, [isSelectedEnabled, startSlot, endSlot, scheduleBreak]);

  const breakPreview = useMemo(() => {
    if (!isSelectedEnabled || !breakEnabled) return [];
    const entry = { enabled: true, startSlot, endSlot };
    return getBreakSlotIndicesFromEntry(entry, scheduleBreak).map((index) => {
      const option = SLOT_OPTIONS.find((slot) => slot.index === index);
      return option?.label || '';
    });
  }, [isSelectedEnabled, startSlot, endSlot, scheduleBreak, breakEnabled]);

  useEffect(() => {
    if (!doctorId || !isSelectedEnabled) {
      setBookedSlots([]);
      return undefined;
    }

    const controller = new AbortController();

    async function loadBooked() {
      try {
        setLoadingBooked(true);
        const response = await fetch(
          `/api/appointments/slots?doctorId=${encodeURIComponent(doctorId)}&date=${selectedDateKey}`,
          { signal: controller.signal }
        );
        const data = await response.json();
        setBookedSlots((data.slots || []).filter((slot) => slot.status === 'booked'));
      } catch {
        setBookedSlots([]);
      } finally {
        setLoadingBooked(false);
      }
    }

    loadBooked();
    return () => controller.abort();
  }, [doctorId, isSelectedEnabled, selectedDateKey]);

  const updateSelectedEntry = (patch) => {
    onChange({
      ...dateAvailability,
      [selectedDateKey]: {
        ...(dateAvailability[selectedDateKey] || DEFAULT_DUTY_SCHEDULE),
        enabled: true,
        ...patch,
      },
    });
  };

  const toggleDateEnabled = (dateKey, enabled) => {
    if (!enabled) {
      const next = { ...dateAvailability };
      if (next[dateKey]) {
        next[dateKey] = { ...next[dateKey], enabled: false };
      }
      onChange(next);
      return;
    }

    onChange({
      ...dateAvailability,
      [dateKey]: {
        ...(dateAvailability[dateKey] || DEFAULT_DUTY_SCHEDULE),
        enabled: true,
      },
    });
  };

  const selectDateKey = (dateKey) => {
    setSelectedDate(parseDateKey(dateKey));
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-[#002f3b]">Availability calendar</h3>
        <p className="mt-1 text-xs text-[#586971]">
          Enable specific upcoming dates, set consultation hours, and configure a daily break that is hidden from booking.
        </p>
      </div>

      <div className="rounded-xl border border-[#d7e6e2] bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-[#002f3b]">Daily break time</p>
            <p className="mt-0.5 text-xs text-[#586971]">Applied to every enabled date. Break slots are not shown to patients.</p>
          </div>
          <label className="flex items-center gap-2 text-sm text-[#002f3b]">
            <input
              type="checkbox"
              checked={breakEnabled}
              onChange={(e) => onScheduleBreakChange?.({
                ...scheduleBreak,
                enabled: e.target.checked,
              })}
              className="h-4 w-4 rounded border-[#d7e6e2] text-[#037B76]"
            />
            Enable daily break
          </label>
        </div>

        {breakEnabled && (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-xs font-medium text-[#586971]">Break starts at</span>
              <select
                value={breakStartSlot}
                onChange={(e) => {
                  const nextStart = Number(e.target.value);
                  const nextEnd = breakEndSlot <= nextStart
                    ? Math.min(nextStart + 1, SLOTS_PER_DAY)
                    : breakEndSlot;
                  onScheduleBreakChange?.({
                    ...scheduleBreak,
                    enabled: true,
                    breakStartSlot: nextStart,
                    breakEndSlot: nextEnd,
                  });
                }}
                className="mt-1 w-full rounded-lg border border-[#d7e6e2] bg-white px-3 py-2 text-sm"
              >
                {SLOT_OPTIONS.map((slot) => (
                  <option key={slot.index} value={slot.index}>{slot.label}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-medium text-[#586971]">Break ends at</span>
              <select
                value={breakEndSlot}
                onChange={(e) => onScheduleBreakChange?.({
                  ...scheduleBreak,
                  enabled: true,
                  breakEndSlot: Number(e.target.value),
                })}
                className="mt-1 w-full rounded-lg border border-[#d7e6e2] bg-white px-3 py-2 text-sm"
              >
                {Array.from({ length: SLOTS_PER_DAY - breakStartSlot }, (_, offset) => breakStartSlot + offset + 1).map((index) => (
                  <option key={index} value={index}>{getEndTimeLabel(index)}</option>
                ))}
              </select>
            </label>
          </div>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-[auto_minmax(0,1fr)]">
        <div className="rounded-xl border border-[#d7e6e2] bg-white p-3">
          <DatePicker
            inline
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            minDate={new Date()}
            maxDate={parseDateKey(upcomingDateKeys[upcomingDateKeys.length - 1])}
            highlightDates={highlightDates}
            calendarClassName="admin-availability-calendar"
          />
          <p className="mt-2 px-1 text-xs text-[#586971]">
            <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-[#037B76]" />
            Enabled dates
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-[#d7e6e2] bg-[#f8fbfa] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-[#002f3b]">
                  {formatDateLabel(selectedDateKey)}
                </p>
                <p className="mt-0.5 text-xs text-[#586971]">Selected date</p>
              </div>
              <label className="flex items-center gap-2 text-sm text-[#002f3b]">
                <input
                  type="checkbox"
                  checked={isSelectedEnabled}
                  onChange={(e) => toggleDateEnabled(selectedDateKey, e.target.checked)}
                  className="h-4 w-4 rounded border-[#d7e6e2] text-[#037B76]"
                />
                Enable this date
              </label>
            </div>

            {isSelectedEnabled && (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-medium text-[#586971]">Duty starts at</span>
                  <select
                    value={startSlot}
                    onChange={(e) => {
                      const nextStart = Number(e.target.value);
                      const nextEnd = endSlot <= nextStart
                        ? Math.min(nextStart + 1, SLOTS_PER_DAY)
                        : endSlot;
                      updateSelectedEntry({ startSlot: nextStart, endSlot: nextEnd });
                    }}
                    className="mt-1 w-full rounded-lg border border-[#d7e6e2] bg-white px-3 py-2 text-sm"
                  >
                    {SLOT_OPTIONS.map((slot) => (
                      <option key={slot.index} value={slot.index}>{slot.label}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-[#586971]">Duty ends at</span>
                  <select
                    value={endSlot}
                    onChange={(e) => updateSelectedEntry({ endSlot: Number(e.target.value) })}
                    className="mt-1 w-full rounded-lg border border-[#d7e6e2] bg-white px-3 py-2 text-sm"
                  >
                    {Array.from({ length: SLOTS_PER_DAY - startSlot }, (_, offset) => startSlot + offset + 1).map((index) => (
                      <option key={index} value={index}>{getEndTimeLabel(index)}</option>
                    ))}
                  </select>
                </label>
              </div>
            )}

            {isSelectedEnabled && (
              <p className="mt-3 text-xs text-[#586971]">
                {slotPreview.length
                  ? `${slotPreview.length} bookable slots: ${slotPreview[0]} … ${slotPreview[slotPreview.length - 1]}`
                  : 'Adjust the duty window to create bookable slots.'}
              </p>
            )}

            {isSelectedEnabled && breakPreview.length > 0 && (
              <p className="mt-2 text-xs text-[#586971]">
                Daily break (hidden from booking): {breakPreview[0]} … {breakPreview[breakPreview.length - 1]}
              </p>
            )}

            {doctorId && isSelectedEnabled && (
              <div className="mt-4 border-t border-[#eef4f2] pt-4">
                <p className="text-xs font-medium text-[#586971]">Booked slots on this date</p>
                {loadingBooked ? (
                  <AdminPageLoader
                    variant="inline"
                    label="Loading booked slots..."
                    className="justify-start py-2"
                  />
                ) : bookedSlots.length ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {bookedSlots.map((slot) => (
                      <span
                        key={slot.index}
                        className="rounded-full bg-red-50 px-2.5 py-1 text-xs text-red-700 line-through"
                      >
                        {slot.label}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-[#586971]">No bookings yet for this date.</p>
                )}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-[#d7e6e2] bg-white p-4">
            <p className="text-sm font-medium text-[#002f3b]">Upcoming dates</p>
            <p className="mt-1 text-xs text-[#586971]">Next {UPCOMING_DAYS} days — enable dates patients can book.</p>
            <div className="mt-3 max-h-72 space-y-2 overflow-y-auto">
              {upcomingDateKeys.map((dateKey) => {
                const enabled = Boolean(dateAvailability[dateKey]?.enabled);
                const isSelected = dateKey === selectedDateKey;

                return (
                  <div
                    key={dateKey}
                    className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2 ${
                      isSelected ? 'border-[#037B76] bg-[#f3faf8]' : 'border-[#eef4f2] bg-white'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => selectDateKey(dateKey)}
                      className="min-w-0 flex-1 text-left text-sm text-[#002f3b] hover:text-[#037B76]"
                    >
                      {formatDateLabel(dateKey)}
                    </button>
                    <label className="flex shrink-0 items-center gap-2 text-xs text-[#586971]">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => toggleDateEnabled(dateKey, e.target.checked)}
                        className="h-4 w-4 rounded border-[#d7e6e2] text-[#037B76]"
                      />
                      Enable
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
