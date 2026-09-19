'use client';

import { useCallback, useEffect, useState } from 'react';
import WhyChooseSettingsForm from '@/components/admin/why-choose/why-choose-settings-form';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { adminFetch } from '@/lib/admin-api';
import AdminPageLoader from '@/components/admin/admin-page-loader';

export default function AdminWhyChoosePage() {
  const { getIdToken } = useAdminAuth();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getIdToken();
      const data = await adminFetch('/api/admin/site-settings/why-choose', { token });
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
        <h1 className="text-3xl font-semibold text-[#002f3b]">Why Choose Star Health</h1>
        <div className="mt-6">
          <AdminPageLoader
            label="Loading section settings..."
            description="Fetching Why Choose copy, counters, and CTAs."
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
      <h1 className="text-3xl font-semibold text-[#002f3b]">Why Choose Star Health</h1>
      <p className="mt-1 mb-6 text-sm text-[#586971]">
        Shared section on Home (after hero) and About Us. Edit once — both pages update.
      </p>
      <WhyChooseSettingsForm initial={settings} />
    </div>
  );
}
