'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ServiceFormShell from '@/components/admin/services/service-form-shell';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { adminFetch } from '@/lib/admin-api';
import { createEmptyService } from '@/lib/content/service-defaults';

export default function AdminServiceEditPage() {
  const { id } = useParams();
  const isNew = id === 'new';
  const { getIdToken } = useAdminAuth();
  const [service, setService] = useState(null);
  const [categories, setCategories] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const token = await getIdToken();
      const [cats, svcs, drs] = await Promise.all([
        adminFetch('/api/admin/service-categories', { token }),
        adminFetch('/api/admin/services', { token }),
        adminFetch('/api/admin/doctors', { token }),
      ]);
      setCategories(cats);
      setAllServices(svcs);
      setDoctors((drs || []).filter((d) => d.status === 'active' || d.published !== false));

      if (!isNew) {
        const data = await adminFetch(`/api/admin/services/${id}`, { token });
        setService(data);
      } else {
        setService(createEmptyService());
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

  if (error && !service) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold text-[#002f3b]">
        {isNew ? 'Add Service' : 'Edit Service'}
      </h1>
      <p className="mt-1 mb-6 text-sm text-[#586971]">
        Manage service content, media, and SEO across tabs.
      </p>
      <ServiceFormShell
        initial={isNew ? null : service}
        categories={categories}
        allServices={allServices}
        doctors={doctors}
      />
    </div>
  );
}
