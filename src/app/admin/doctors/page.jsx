'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { adminFetch } from '@/lib/admin-api';
import { resolveDoctorImage } from '@/lib/content/doctor-images';

export default function AdminDoctorsPage() {
  const { getIdToken, canWrite, isAdmin } = useAdminAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDoctors = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getIdToken();
      const data = await adminFetch('/api/admin/doctors', { token });
      setDoctors(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getIdToken]);

  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  const handleDelete = async (doctorId) => {
    if (!window.confirm('Delete this doctor?')) return;
    try {
      const token = await getIdToken();
      await adminFetch(`/api/admin/doctors/${doctorId}`, { method: 'DELETE', token });
      await loadDoctors();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-[#002f3b]">Doctors</h1>
          <p className="mt-1 text-sm text-[#586971]">Manage doctors shown on the website.</p>
        </div>
        {canWrite && (
          <Link
            href="/admin/doctors/new"
            className="rounded-lg bg-[#037B76] px-4 py-2 text-sm font-medium text-white"
          >
            Add Doctor
          </Link>
        )}
      </div>

      {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="mt-8 overflow-x-auto rounded-2xl border border-[#d7e6e2] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[#d7e6e2] bg-[#f8fbfa]">
            <tr>
              <th className="px-4 py-3 font-medium text-[#586971]">Photo</th>
              <th className="px-4 py-3 font-medium text-[#586971]">Name</th>
              <th className="px-4 py-3 font-medium text-[#586971]">Specialization</th>
              <th className="px-4 py-3 font-medium text-[#586971]">Status</th>
              <th className="px-4 py-3 font-medium text-[#586971]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-6 text-[#586971]">Loading...</td></tr>
            ) : doctors.map((doctor) => (
              <tr key={doctor.id} className="border-b border-[#eef4f2]">
                <td className="px-4 py-3">
                  <img src={resolveDoctorImage(doctor)} alt="" className="h-12 w-12 rounded-lg object-cover" />
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-[#002f3b]">{doctor.name?.en}</p>
                  <p className="text-xs text-[#586971]">{doctor.designation?.en || doctor.qualification?.en}</p>
                </td>
                <td className="px-4 py-3 text-[#586971]">{doctor.specializationId || doctor.category || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs ${doctor.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {doctor.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                  {doctor.featured && (
                    <span className="ml-1 rounded-full bg-[#e6f4f2] px-2 py-1 text-xs text-[#037B76]">Featured</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link href={`/admin/doctors/${doctor.id}`} className="text-[#037B76] hover:underline">
                      Edit
                    </Link>
                    {isAdmin && (
                      <button type="button" onClick={() => handleDelete(doctor.id)} className="text-red-600 hover:underline">
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
