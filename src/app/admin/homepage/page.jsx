'use client';

import { useCallback, useEffect, useState } from 'react';
import HomepageSettingsForm from '@/components/admin/homepage-settings-form';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { adminFetch } from '@/lib/admin-api';
import AdminPageLoader from '@/components/admin/admin-page-loader';

export default function AdminHomepagePage() {
  const { getIdToken } = useAdminAuth();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getIdToken();
      const data = await adminFetch('/api/admin/site-settings/home', { token });
      setSettings(data);
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

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-semibold text-[#002f3b]">Homepage</h1>
        <div className="mt-6">
          <AdminPageLoader
            label="Loading homepage settings..."
            description="Fetching homepage hero and banner settings from the database."
          />
        </div>
      </div>
    );
  }

  if (error && !settings) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold text-[#002f3b]">Homepage</h1>
      <p className="mt-1 mb-6 text-sm text-[#586971]">
        Manage homepage SEO, hero text, and banner carousel (images or videos) shown on the public site.
      </p>
      <HomepageSettingsForm initial={settings} />
    </div>
  );
}
