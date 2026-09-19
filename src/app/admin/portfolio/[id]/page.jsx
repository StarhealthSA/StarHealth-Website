'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PortfolioFormShell from '@/components/admin/portfolio/portfolio-form-shell';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { adminFetch } from '@/lib/admin-api';
import AdminPageLoader from '@/components/admin/admin-page-loader';
import { createEmptyPortfolioEntry } from '@/lib/content/portfolio-defaults';

export default function AdminPortfolioEditPage() {
  const { id } = useParams();
  const isNew = id === 'new';
  const { getIdToken } = useAdminAuth();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      if (isNew) {
        setEntry(createEmptyPortfolioEntry());
        setError('');
        setLoading(false);
        return;
      }

      const token = await getIdToken();
      const data = await adminFetch(`/api/admin/portfolio/${id}`, { token });
      setEntry(data);
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
          {isNew ? 'Add portfolio case' : 'Edit portfolio case'}
        </h1>
        <div className="mt-6">
          <AdminPageLoader
            label={isNew ? 'Preparing portfolio form...' : 'Loading portfolio case...'}
            description="Fetching case details from the database."
          />
        </div>
      </div>
    );
  }

  if (error && !entry) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold text-[#002f3b]">
        {isNew ? 'Add portfolio case' : 'Edit portfolio case'}
      </h1>
      <p className="mt-1 mb-6 text-sm text-[#586971]">
        Set case media, before/after images, bilingual content, category, and homepage featuring.
      </p>
      <PortfolioFormShell initial={isNew ? null : entry} />
    </div>
  );
}
