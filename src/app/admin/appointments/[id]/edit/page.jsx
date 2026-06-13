'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AdminAppointmentForm from '@/components/admin/appointments/admin-appointment-form';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { adminFetch } from '@/lib/admin-api';
import AdminPageLoader from '@/components/admin/admin-page-loader';

export default function AdminEditAppointmentPage() {
  const { id } = useParams();
  const { getIdToken, canWrite } = useAdminAuth();
  const [doctors, setDoctors] = useState([]);
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getIdToken();
      const [doctorsData, appointmentData] = await Promise.all([
        adminFetch('/api/admin/doctors', { token }),
        adminFetch(`/api/admin/appointments/${id}`, { token }),
      ]);
      setDoctors(doctorsData.filter((doctor) => doctor.status === 'active' || doctor.published !== false));
      setAppointment(appointmentData);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getIdToken, id]);

  useEffect(() => {
    load();
  }, [load]);

  if (!canWrite) {
    return <p className="text-[#586971]">You do not have permission to edit bookings.</p>;
  }

  if (loading) {
    return (
      <div>
        <Link href={`/admin/appointments/${id}`} className="text-sm text-[#037B76] hover:underline">
          ← Back to booking
        </Link>
        <div className="mt-6">
          <AdminPageLoader
            label="Loading booking..."
            description="Fetching appointment and doctor data from the database."
          />
        </div>
      </div>
    );
  }

  if (error && !appointment) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!appointment) {
    return <p className="text-[#586971]">Appointment not found.</p>;
  }

  if (appointment.status === 'cancelled') {
    return (
      <div>
        <Link href={`/admin/appointments/${id}`} className="text-sm text-[#037B76] hover:underline">
          ← Back to appointment
        </Link>
        <p className="mt-4 text-[#586971]">Cancelled appointments cannot be edited.</p>
      </div>
    );
  }

  return (
    <div>
      <Link href={`/admin/appointments/${id}`} className="text-sm text-[#037B76] hover:underline">
        ← Back to appointment
      </Link>
      <h1 className="mt-4 text-3xl font-semibold text-[#002f3b]">Edit appointment</h1>
      <p className="mt-1 text-sm text-[#586971]">
        Update patient details or move the booking to another available slot.
      </p>

      {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="mt-6">
        <AdminAppointmentForm doctors={doctors} appointment={appointment} />
      </div>
    </div>
  );
}
