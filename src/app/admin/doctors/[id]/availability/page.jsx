'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import DoctorAvailabilityForm from '@/components/admin/doctors/doctor-availability-form';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { adminFetch } from '@/lib/admin-api';
import AdminPageLoader from '@/components/admin/admin-page-loader';

export default function AdminDoctorAvailabilityPage() {
  const { id } = useParams();
  const { getIdToken } = useAdminAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getIdToken();
      const data = await adminFetch(`/api/admin/doctors/${id}`, { token });
      setDoctor(data);
      setError('');
    } catch (err) {
      setError(err.message);
      setDoctor(null);
    } finally {
      setLoading(false);
    }
  }, [getIdToken, id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-semibold text-[#002f3b]">Doctor Availability</h1>
        <div className="mt-6">
          <AdminPageLoader
            label="Loading availability..."
            description="Fetching doctor schedule and booking settings."
          />
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div>
        <h1 className="text-3xl font-semibold text-[#002f3b]">Doctor Availability</h1>
        <p className="mt-4 text-red-600">{error || 'Doctor not found.'}</p>
        <Link href="/admin/doctors" className="mt-4 inline-block text-sm text-[#037B76] hover:underline">
          Back to Doctors
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-[#002f3b]">Doctor Availability</h1>
          <p className="mt-1 text-sm text-[#586971]">
            Manage booking calendar, duty hours, and breaks for {doctor.name?.en || 'this doctor'}.
          </p>
        </div>
        <Link
          href={`/admin/doctors/${doctor.id}`}
          className="text-sm text-[#037B76] hover:underline"
        >
          Edit doctor profile →
        </Link>
      </div>

      <div className="mt-6">
        <DoctorAvailabilityForm doctor={doctor} />
      </div>
    </div>
  );
}
