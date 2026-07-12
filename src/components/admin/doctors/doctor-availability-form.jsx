'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DEFAULT_SCHEDULE_BREAK } from '@/lib/appointments/slot-utils';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { adminFetch } from '@/lib/admin-api';
import LocalizedInput from '@/components/admin/localized-input';
import DoctorAvailabilityCalendar from '@/components/admin/doctors/doctor-availability-calendar';

export default function DoctorAvailabilityForm({ doctor }) {
  const router = useRouter();
  const { getIdToken, canWrite } = useAdminAuth();
  const [form, setForm] = useState({
    consultationTimings: doctor.consultationTimings || { en: '', ar: '' },
    dateAvailability: doctor.dateAvailability || {},
    scheduleBreak: doctor.scheduleBreak || DEFAULT_SCHEDULE_BREAK,
    onlineConsultationAvailable: Boolean(doctor.onlineConsultationAvailable),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const update = (path, value) => {
    setForm((prev) => ({ ...prev, [path]: value }));
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canWrite) return;

    setError('');
    setSuccess('');

    try {
      setSaving(true);
      const token = await getIdToken();
      await adminFetch(`/api/admin/doctors/${doctor.id}`, {
        method: 'PUT',
        token,
        body: {
          ...doctor,
          consultationTimings: form.consultationTimings,
          dateAvailability: form.dateAvailability,
          scheduleBreak: form.scheduleBreak,
          onlineConsultationAvailable: form.onlineConsultationAvailable,
        },
      });
      setSuccess('Availability saved successfully.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {success && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{success}</p>}

      <div className="rounded-2xl border border-[#d7e6e2] bg-white p-6 space-y-4">
        <LocalizedInput
          label="Consultation Timings"
          value={form.consultationTimings}
          onChange={(value) => update('consultationTimings', value)}
          multiline
        />

        <DoctorAvailabilityCalendar
          dateAvailability={form.dateAvailability}
          onChange={(dateAvailability) => update('dateAvailability', dateAvailability)}
          scheduleBreak={form.scheduleBreak}
          onScheduleBreakChange={(scheduleBreak) => update('scheduleBreak', scheduleBreak)}
          doctorId={doctor.id}
        />

        <label className="flex items-center gap-2 text-sm text-[#586971]">
          <input
            type="checkbox"
            checked={form.onlineConsultationAvailable}
            onChange={(e) => update('onlineConsultationAvailable', e.target.checked)}
          />
          Online Consultation Available
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        {canWrite && (
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[#037B76] px-6 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Availability'}
          </button>
        )}
        <button
          type="button"
          onClick={() => router.push('/admin/doctors')}
          className="rounded-lg border border-[#d7e6e2] px-6 py-2 text-sm font-medium text-[#586971]"
        >
          Back to Doctors
        </button>
        <button
          type="button"
          onClick={() => router.push(`/admin/doctors/${doctor.id}`)}
          className="rounded-lg border border-[#d7e6e2] px-6 py-2 text-sm font-medium text-[#586971]"
        >
          Edit Doctor Profile
        </button>
      </div>
    </form>
  );
}
