'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import DoctorFormShell from '@/components/admin/doctors/doctor-form-shell';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { adminFetch } from '@/lib/admin-api';
import { createEmptyDoctor, resolveDoctorFormTab } from '@/lib/content/doctor-defaults';

export default function AdminDoctorEditPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const initialTab = resolveDoctorFormTab(searchParams.get('tab'));
  const isNew = id === 'new';
  const { getIdToken } = useAdminAuth();
  const [doctor, setDoctor] = useState(null);
  const [specializations, setSpecializations] = useState([]);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const token = await getIdToken();
      const [specs, categories, svcs] = await Promise.all([
        adminFetch('/api/admin/specializations', { token }),
        adminFetch('/api/admin/service-categories', { token }),
        adminFetch('/api/admin/services', { token }),
      ]);
      setSpecializations(specs);
      setServiceCategories(categories);
      setServices(svcs);

      if (!isNew) {
        const data = await adminFetch(`/api/admin/doctors/${id}`, { token });
        setDoctor({
          ...data,
          certifications: (data.certifications || []).map((c) => ({
            en: c.title?.en || c.en || '',
            ar: c.title?.ar || c.ar || '',
            year: c.year || '',
          })),
          awards: (data.awards || []).map((a) => ({
            en: a.title?.en || a.en || '',
            ar: a.title?.ar || a.ar || '',
            year: a.year || '',
            description: a.description,
          })),
        });
      } else {
        setDoctor(createEmptyDoctor());
      }
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getIdToken, id, isNew]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return <p className="text-[#586971]">Loading...</p>;
  }

  if (error && !doctor) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold text-[#002f3b]">
        {isNew ? 'Add Doctor' : 'Edit Doctor'}
      </h1>
      <p className="mt-1 mb-6 text-sm text-[#586971]">
        Manage all doctor profile fields across tabs.
      </p>
      <DoctorFormShell
        initial={isNew ? null : doctor}
        initialTab={initialTab}
        specializations={specializations}
        serviceCategories={serviceCategories}
        services={services}
      />
    </div>
  );
}
