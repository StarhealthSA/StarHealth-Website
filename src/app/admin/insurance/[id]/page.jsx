'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import InsuranceFormShell from '@/components/admin/insurance/insurance-form-shell';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { adminFetch } from '@/lib/admin-api';
import AdminPageLoader from '@/components/admin/admin-page-loader';
import { createEmptyInsurancePartner } from '@/lib/content/insurance-defaults';

export default function AdminInsuranceEditPage() {
  const { id } = useParams();
  const isNew = id === 'new';
  const { getIdToken } = useAdminAuth();
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      if (isNew) {
        setPartner(createEmptyInsurancePartner());
        setError('');
        setLoading(false);
        return;
      }

      const token = await getIdToken();
      const data = await adminFetch(`/api/admin/insurance/${id}`, { token });
      setPartner(data);
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
    return (
      <div>
        <h1 className="text-3xl font-semibold text-[#002f3b]">
          {isNew ? 'Add insurance partner' : 'Edit insurance partner'}
        </h1>
        <div className="mt-6">
          <AdminPageLoader
            label={isNew ? 'Preparing partner form...' : 'Loading partner...'}
            description="Fetching insurance partner details from the database."
          />
        </div>
      </div>
    );
  }

  if (error && !partner) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold text-[#002f3b]">
        {isNew ? 'Add insurance partner' : 'Edit insurance partner'}
      </h1>
      <p className="mt-1 mb-6 text-sm text-[#586971]">
        Set partner name, logo, and visibility for the public insurance page.
      </p>
      <InsuranceFormShell initial={isNew ? null : partner} />
    </div>
  );
}
