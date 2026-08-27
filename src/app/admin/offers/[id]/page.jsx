'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import OfferFormShell from '@/components/admin/offers/offer-form-shell';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { adminFetch } from '@/lib/admin-api';
import AdminPageLoader from '@/components/admin/admin-page-loader';
import { createEmptyOffer } from '@/lib/content/offer-defaults';

export default function AdminOfferEditPage() {
  const { id } = useParams();
  const isNew = id === 'new';
  const { getIdToken } = useAdminAuth();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      if (isNew) {
        setOffer(createEmptyOffer());
        setError('');
        setLoading(false);
        return;
      }

      const token = await getIdToken();
      const data = await adminFetch(`/api/admin/offers/${id}`, { token });
      setOffer(data);
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
          {isNew ? 'Add offer' : 'Edit offer'}
        </h1>
        <div className="mt-6">
          <AdminPageLoader
            label={isNew ? 'Preparing offer form...' : 'Loading offer...'}
            description="Fetching offer details from the database."
          />
        </div>
      </div>
    );
  }

  if (error && !offer) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold text-[#002f3b]">
        {isNew ? 'Add offer' : 'Edit offer'}
      </h1>
      <p className="mt-1 mb-6 text-sm text-[#586971]">
        Set offer name, treatment, pricing, validity, and booking link.
      </p>
      <OfferFormShell initial={isNew ? null : offer} />
    </div>
  );
}
