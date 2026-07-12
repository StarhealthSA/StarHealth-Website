'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getDoctorScheduleDisplay } from '@/lib/appointments/doctor-schedule-display';

function ScheduleTimings({ windows, fallbackTimings, unavailableLabel, className = '' }) {
  if (windows.length > 0) {
    return (
      <div className={`space-y-1 ${className}`}>
        {windows.map((window) => (
          <p key={window} className={`font-inter leading-relaxed ${className}`}>
            {window}
          </p>
        ))}
      </div>
    );
  }

  if (fallbackTimings) {
    return <p className={`font-inter leading-relaxed ${className}`}>{fallbackTimings}</p>;
  }

  return (
    <p className={`font-inter leading-relaxed opacity-80 ${className}`}>
      {unavailableLabel}
    </p>
  );
}

function ScheduleDates({ dates, emptyLabel, badgeClassName }) {
  if (!dates.length) {
    return (
      <p className="font-inter text-sm leading-relaxed opacity-80">
        {emptyLabel}
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {dates.map((date) => (
        <span key={date.dateKey} className={badgeClassName}>
          {date.shortLabel}
        </span>
      ))}
    </div>
  );
}

export function DoctorScheduleBand({ doctor }) {
  const { t, i18n } = useTranslation();
  const schedule = useMemo(
    () => getDoctorScheduleDisplay(doctor, i18n.language),
    [doctor, i18n.language]
  );

  const showTimings = schedule.todayAvailable || schedule.fallbackTimings || schedule.hasSchedule;
  const showDates = schedule.hasSchedule || schedule.upcomingDates.length > 0;

  if (!showTimings && !showDates) return null;

  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2">
      {showTimings && (
        <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
          <p className="font-inter text-xs font-semibold uppercase tracking-[0.16em] text-[#AED5C6]">
            {t('doctorDetail.todaysConsultationTiming')}
          </p>
          <div className="mt-3 text-base text-white/90">
            <ScheduleTimings
              windows={schedule.todayWindows}
              fallbackTimings={schedule.fallbackTimings}
              unavailableLabel={t('doctorDetail.noConsultationToday')}
              className="text-base text-white/90"
            />
          </div>
        </div>
      )}

      {showDates && (
        <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
          <p className="font-inter text-xs font-semibold uppercase tracking-[0.16em] text-[#AED5C6]">
            {t('doctorDetail.upcomingDates')}
          </p>
          <div className="mt-3">
            <ScheduleDates
              dates={schedule.upcomingDates}
              emptyLabel={t('doctorDetail.noUpcomingDates')}
              badgeClassName="rounded-lg bg-white/15 px-3 py-1.5 font-inter text-sm text-white"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function DoctorScheduleSidebar({ doctor }) {
  const { t, i18n } = useTranslation();
  const schedule = useMemo(
    () => getDoctorScheduleDisplay(doctor, i18n.language),
    [doctor, i18n.language]
  );

  const hasContent =
    schedule.todayAvailable
    || schedule.fallbackTimings
    || schedule.upcomingDates.length > 0
    || schedule.hasSchedule;

  if (!hasContent) return null;

  return (
    <div className="space-y-3 border-t border-[#E9E7E6] pt-5">
      <p className="font-inter text-xs font-semibold uppercase tracking-[0.16em] text-[#037B76]">
        {t('doctorDetail.quickInfo')}
      </p>

      <div>
        <p className="font-inter text-[11px] font-semibold uppercase tracking-[0.12em] text-[#037B76]">
          {t('doctorDetail.todaysConsultationTiming')}
        </p>
        <div className="mt-1 text-[#586971]">
          <ScheduleTimings
            windows={schedule.todayWindows}
            fallbackTimings={schedule.fallbackTimings}
            unavailableLabel={t('doctorDetail.noConsultationToday')}
            className="text-sm"
          />
        </div>
      </div>

      <div>
        <p className="font-inter text-[11px] font-semibold uppercase tracking-[0.12em] text-[#037B76]">
          {t('doctorDetail.upcomingDates')}
        </p>
        <div className="mt-1">
          <ScheduleDates
            dates={schedule.upcomingDates}
            emptyLabel={t('doctorDetail.noUpcomingDates')}
            badgeClassName="rounded-md bg-[#F6F4F3] px-2 py-1 font-inter text-[11px] font-medium text-[#586971]"
          />
        </div>
      </div>
    </div>
  );
}
