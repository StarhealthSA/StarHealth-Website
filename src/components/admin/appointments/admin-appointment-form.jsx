'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppointmentSlotPicker from '@/components/booking/appointment-slot-picker';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { adminFetch } from '@/lib/admin-api';
import AdminPageLoader from '@/components/admin/admin-page-loader';
import { doctorAvailabilityAdminPath } from '@/lib/content/doctor-defaults';
import { formatDateLabel, parseDateKey } from '@/lib/appointments/slot-utils';

export default function AdminAppointmentForm({ doctors = [], appointment = null }) {
  const router = useRouter();
  const { getIdToken } = useAdminAuth();
  const isEdit = Boolean(appointment?.id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  const [scheduleMode, setScheduleMode] = useState('configured');
  const [loadingDates, setLoadingDates] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(
    appointment
      ? { index: appointment.slotIndex, label: appointment.slotLabel }
      : null
  );
  const [form, setForm] = useState({
    doctorId: appointment?.doctorId || '',
    dateKey: appointment?.date || '',
    patientName: appointment?.patientName || '',
    phone: appointment?.phone || '',
    age: appointment?.age || '',
    speciality: appointment?.speciality || '',
  });

  const selectedDoctor = useMemo(
    () => doctors.find((doctor) => doctor.id === form.doctorId),
    [doctors, form.doctorId]
  );

  const selectedDate = form.dateKey ? parseDateKey(form.dateKey) : null;
  const needsAvailabilitySetup = scheduleMode === 'open'
    || (scheduleMode === 'configured' && !loadingDates && !availableDates.length);

  useEffect(() => {
    if (!form.doctorId) {
      setAvailableDates([]);
      if (!isEdit) {
        setForm((prev) => ({ ...prev, dateKey: '' }));
      }
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
        let dates = data.dates || [];
        if (isEdit && appointment?.date && appointment.doctorId === form.doctorId) {
          const hasCurrent = dates.some((item) => item.dateKey === appointment.date);
          if (!hasCurrent) {
            dates = [
              { dateKey: appointment.date, label: formatDateLabel(appointment.date) },
              ...dates,
            ];
          }
        }

        setAvailableDates(dates);
        setForm((prev) => ({
          ...prev,
          dateKey: dates.some((item) => item.dateKey === prev.dateKey)
            ? prev.dateKey
            : '',
        }));
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
  }, [form.doctorId, getIdToken, isEdit, appointment?.date, appointment?.doctorId]);

  const update = (key, value) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'doctorId') {
        next.dateKey = '';
      }
      if (key === 'doctorId' || key === 'dateKey') {
        setSelectedSlot(null);
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.doctorId || !form.patientName || !form.phone) {
      setError('Please fill in doctor and patient details.');
      return;
    }

    if (scheduleMode === 'configured' && (!form.dateKey || !selectedSlot)) {
      setError('Please select a doctor, date, and available time slot.');
      return;
    }

    const payload = {
      doctorId: form.doctorId,
      doctorName: selectedDoctor?.name?.en || '',
      patientName: form.patientName,
      phone: form.phone,
      age: form.age,
      speciality: form.speciality,
    };

    if (scheduleMode === 'configured') {
      payload.date = form.dateKey;
      payload.slotIndex = selectedSlot.index;
      payload.slotLabel = selectedSlot.label;
    }

    try {
      setSaving(true);
      const token = await getIdToken();

      if (isEdit) {
        const updated = await adminFetch(`/api/admin/appointments/${appointment.id}`, {
          method: 'PUT',
          token,
          body: payload,
        });
        router.push(`/admin/appointments/${updated.id}`);
        return;
      }

      await adminFetch('/api/admin/appointments', {
        method: 'POST',
        token,
        body: payload,
      });
      router.push('/admin/appointments');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-[#d7e6e2] bg-white p-6">
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-[#586971]">Doctor</span>
          <select
            value={form.doctorId}
            onChange={(e) => update('doctorId', e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
          >
            <option value="">Select doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>{doctor.name?.en || doctor.id}</option>
            ))}
          </select>
        </label>

        {scheduleMode === 'configured' && loadingDates && form.doctorId && (
          <AdminPageLoader
            variant="inline"
            label="Loading available dates..."
            description=""
            className="justify-start py-1"
          />
        )}

        {scheduleMode === 'configured' && (
          <label className="block">
            <span className="text-sm font-medium text-[#586971]">Available date</span>
            <select
              value={form.dateKey}
              onChange={(e) => update('dateKey', e.target.value)}
              required
              disabled={!form.doctorId || loadingDates}
              className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2 disabled:opacity-60"
            >
              <option value="">
                {loadingDates ? 'Loading dates...' : 'Select date'}
              </option>
              {availableDates.map((item) => (
                <option key={item.dateKey} value={item.dateKey}>{item.label}</option>
              ))}
            </select>
          </label>
        )}

        <label className="block">
          <span className="text-sm font-medium text-[#586971]">Patient name</span>
          <input
            value={form.patientName}
            onChange={(e) => update('patientName', e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-[#586971]">Phone</span>
          <input
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-[#586971]">Age</span>
          <input
            value={form.age}
            onChange={(e) => update('age', e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-[#586971]">Speciality</span>
          <input
            value={form.speciality}
            onChange={(e) => update('speciality', e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
          />
        </label>
      </div>

      {needsAvailabilitySetup && form.doctorId && !loadingDates && (
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
          excludeAppointmentId={isEdit ? appointment.id : null}
        />
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-[#037B76] px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Create appointment'}
        </button>
        <button
          type="button"
          onClick={() => router.push(isEdit ? `/admin/appointments/${appointment.id}` : '/admin/appointments')}
          className="rounded-lg border border-[#d7e6e2] px-5 py-2 text-sm font-medium text-[#586971]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
