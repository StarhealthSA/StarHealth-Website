'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import AdminAppointmentForm from '@/components/admin/appointments/admin-appointment-form';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { adminFetch } from '@/lib/admin-api';
import AdminPageLoader from '@/components/admin/admin-page-loader';

export default function AdminNewAppointmentPage() {
  const { getIdToken } = useAdminAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const token = await getIdToken();
      const data = await adminFetch('/api/admin/doctors', { token });
      setDoctors(data.filter((doctor) => doctor.status === 'active' || doctor.published !== false));
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getIdToken]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <Link href="/admin/appointments" className="text-sm text-[#037B76] hover:underline">
        ← Back to bookings
      </Link>
      <h1 className="mt-4 text-3xl font-semibold text-[#002f3b]">New appointment</h1>
      <p className="mt-1 text-sm text-[#586971]">
        Create a booking manually using the doctor&apos;s enabled dates and live slot availability.
      </p>

      {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {loading ? (
        <div className="mt-6">
          <AdminPageLoader
            label="Loading doctors..."
            description="Fetching available doctors for this booking."
          />
        </div>
      ) : (
        <div className="mt-6">
          <AdminAppointmentForm doctors={doctors} />
        </div>
      )}
    </div>
  );
}
