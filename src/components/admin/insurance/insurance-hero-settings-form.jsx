'use client';

import { useState } from 'react';
import LocalizedInput from '@/components/admin/localized-input';
import AutoTranslateBar from '@/components/admin/auto-translate-bar';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { adminFetch } from '@/lib/admin-api';

export default function InsuranceHeroSettingsForm({ initial }) {
  const { getIdToken, canWrite } = useAdminAuth();
  const [form, setForm] = useState({
    heroTitle: initial?.heroTitle || { en: '', ar: '' },
    heroSubtitle: initial?.heroSubtitle || { en: '', ar: '' },
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canWrite) return;

    setError('');
    setSuccess('');

    try {
      setSaving(true);
      const token = await getIdToken();
      const saved = await adminFetch('/api/admin/site-settings/insurance', {
        method: 'PUT',
        body: form,
        token,
      });
      setForm({
        heroTitle: saved.heroTitle || { en: '', ar: '' },
        heroSubtitle: saved.heroSubtitle || { en: '', ar: '' },
      });
      setSuccess('Hero banner text saved.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-5 rounded-2xl border border-[#d7e6e2] bg-white p-6"
    >
      <div>
        <h2 className="text-lg font-semibold text-[#002f3b]">Hero banner</h2>
        <p className="mt-1 text-sm text-[#586971]">
          Heading and subheading on the public insurance page. Leave blank to use the default site copy.
        </p>
      </div>

      <AutoTranslateBar form={form} onTranslated={setForm} />

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}
      {success && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{success}</p>
      )}

      <LocalizedInput
        label="Hero heading"
        value={form.heroTitle}
        onChange={(value) => setForm((prev) => ({ ...prev, heroTitle: value }))}
      />
      <LocalizedInput
        label="Hero subheading"
        value={form.heroSubtitle}
        onChange={(value) => setForm((prev) => ({ ...prev, heroSubtitle: value }))}
        multiline
      />

      {canWrite && (
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-[#037B76] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save hero text'}
        </button>
      )}
    </form>
  );
}
