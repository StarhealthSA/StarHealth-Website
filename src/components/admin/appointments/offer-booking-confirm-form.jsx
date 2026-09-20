'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import AppointmentSlotPicker from '@/components/booking/appointment-slot-picker';
import AdminPageLoader from '@/components/admin/admin-page-loader';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { adminFetch } from '@/lib/admin-api';
import { doctorAvailabilityAdminPath } from '@/lib/content/doctor-defaults';
import { parseDateKey } from '@/lib/appointments/slot-utils';

export default function OfferBookingConfirmForm({ appointment, onConfirmed }) {
  const { getIdToken } = useAdminAuth();
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  const [scheduleMode, setScheduleMode] = useState('configured');
  const [loadingDates, setLoadingDates] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [form, setForm] = useState({
    doctorId: '',
    dateKey: '',
  });

  const selectedDoctor = useMemo(
    () => doctors.find((doctor) => doctor.id === form.doctorId),
    [doctors, form.doctorId]
  );

  const selectedDate = form.dateKey ? parseDateKey(form.dateKey) : null;
  const needsAvailabilitySetup = scheduleMode === 'open'
    || (scheduleMode === 'configured' && !loadingDates && !availableDates.length);

  useEffect(() => {
    let cancelled = false;

    async function loadDoctors() {
      try {
        setLoadingDoctors(true);
        const token = await getIdToken();
        const data = await adminFetch('/api/admin/doctors', { token });
        if (cancelled) return;
        setDoctors(
          (data || []).filter((doctor) => doctor.status === 'active' || doctor.published !== false)
        );
        setError('');
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoadingDoctors(false);
      }
    }

    loadDoctors();
    return () => {
      cancelled = true;
    };
  }, [getIdToken]);

  useEffect(() => {
    if (!form.doctorId) {
      setAvailableDates([]);
      setScheduleMode('configured');
      return undefined;
    }

    let cancelled = false;

    async function loadDates() {
      try {
        setLoadingDates(true);
        const token = await getIdToken();
        const data = await adminFetch(
          `/api/admin/appointments/available-dates?doctorId=${encodeURIComponent(form.doctorId)}`,
          { token }
        );
        if (cancelled) return;
        setScheduleMode(data.scheduleMode || 'open');
        setAvailableDates(data.dates || []);
        setForm((prev) => ({
          ...prev,
          dateKey: (data.dates || []).some((item) => item.dateKey === prev.dateKey)
            ? prev.dateKey
            : '',
        }));
        setSelectedSlot(null);
        setError('');
      } catch (err) {
        if (!cancelled) {
          setAvailableDates([]);
          setError(err.message);
        }
      } finally {
        if (!cancelled) setLoadingDates(false);
      }
    }

    loadDates();
    return () => {
      cancelled = true;
    };
  }, [form.doctorId, getIdToken]);

  const updateDoctor = (doctorId) => {
    setForm({ doctorId, dateKey: '' });
    setSelectedSlot(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.doctorId) {
      setError('Please select a doctor.');
      return;
    }

    if (scheduleMode === 'configured' && (!form.dateKey || !selectedSlot)) {
      setError('Please select an available date and time slot.');
      return;
    }

    const payload = {
      action: 'confirm',
      doctorId: form.doctorId,
      doctorName: selectedDoctor?.name?.en || '',
      patientName: appointment.patientName,
      phone: appointment.phone,
      age: appointment.age,
      speciality: appointment.offerName || appointment.speciality,
    };

    if (scheduleMode === 'configured') {
      payload.date = form.dateKey;
      payload.slotIndex = selectedSlot.index;
      payload.slotLabel = selectedSlot.label;
    }

    try {
      setSaving(true);
      const token = await getIdToken();
      const confirmed = await adminFetch(`/api/admin/appointments/${appointment.id}`, {
        method: 'PATCH',
        token,
        body: payload,
      });
      onConfirmed?.(confirmed);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loadingDoctors) {
    return (
      <div className="mt-8 rounded-2xl border border-[#d7e6e2] bg-white p-6">
        <AdminPageLoader
          variant="inline"
          label="Loading doctors..."
          description="Fetching doctors and availability from the database."
        />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-5 rounded-2xl border border-[#d7e6e2] bg-white p-6"
    >
      <div>
        <h2 className="text-lg font-semibold text-[#002f3b]">Assign doctor & confirm</h2>
        <p className="mt-1 text-sm text-[#586971]">
          Choose a doctor and available slot to confirm this offer booking. It will move into Active bookings.
        </p>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-[#586971]">Doctor</span>
          <select
            value={form.doctorId}
            onChange={(e) => updateDoctor(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
          >
            <option value="">Select doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name?.en || doctor.id}
              </option>
            ))}
          </select>
        </label>

        {scheduleMode === 'configured' && (
          <label className="block">
            <span className="text-sm font-medium text-[#586971]">Available date</span>
            <select
              value={form.dateKey}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, dateKey: e.target.value }));
                setSelectedSlot(null);
              }}
              required
              disabled={!form.doctorId || loadingDates}
              className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2 disabled:opacity-60"
            >
              <option value="">
                {loadingDates ? 'Loading dates...' : 'Select date'}
              </option>
              {availableDates.map((item) => (
                <option key={item.dateKey} value={item.dateKey}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {scheduleMode === 'open' && form.doctorId && !loadingDates && (
        <p className="rounded-lg border border-[#E9E7E6] bg-[#F8FBFA] px-4 py-3 text-sm text-[#687276]">
          This doctor has an open schedule. Confirming will create a booked appointment and the team can finalize the time later.
        </p>
      )}

      {needsAvailabilitySetup && form.doctorId && !loadingDates && scheduleMode === 'configured' && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-[#586971]">
          <p>This doctor has no bookable dates or time slots yet.</p>
          <Link
            href={doctorAvailabilityAdminPath(form.doctorId)}
            className="mt-2 inline-block font-medium text-[#037B76] hover:underline"
          >
            Set availability &amp; duty times →
          </Link>
        </div>
      )}

      {scheduleMode === 'configured' && (
        <AppointmentSlotPicker
          doctorId={form.doctorId}
          date={selectedDate}
          selectedSlot={selectedSlot?.index ?? null}
          onSelect={setSelectedSlot}
          excludeAppointmentId={appointment.id}
        />
      )}

      <button
        type="submit"
        disabled={saving || (scheduleMode === 'configured' && needsAvailabilitySetup)}
        className="rounded-lg bg-[#037B76] px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {saving ? 'Confirming...' : 'Confirm booking'}
      </button>
    </form>
  );
}
