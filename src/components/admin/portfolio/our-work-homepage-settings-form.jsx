'use client';

import { useState } from 'react';
import LocalizedInput from '@/components/admin/localized-input';
import AutoTranslateBar from '@/components/admin/auto-translate-bar';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { adminFetch } from '@/lib/admin-api';
import { DEFAULT_OUR_WORK_SETTINGS } from '@/lib/content/our-work-defaults';

export default function OurWorkHomepageSettingsForm({ initial }) {
  const { getIdToken, canWrite } = useAdminAuth();
  const [form, setForm] = useState(initial || DEFAULT_OUR_WORK_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canWrite) return;

    setError('');
    setSuccess('');

    try {
      setSaving(true);
      const token = await getIdToken();
      const saved = await adminFetch('/api/admin/site-settings/our-work', {
        method: 'PUT',
        body: form,
        token,
      });
      setForm(saved);
      setSuccess('Homepage Our Work section copy saved.');
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
        <h2 className="text-lg font-semibold text-[#002f3b]">Homepage section copy</h2>
        <p className="mt-1 text-sm text-[#586971]">
          Eyebrow, title, and lead text for the Our Work block on the home page.
          Leave a field blank to fall back to the default site copy.
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
        label="Eyebrow"
        value={form.eyebrow}
        onChange={(v) => updateField('eyebrow', v)}
        placeholder={{
          en: DEFAULT_OUR_WORK_SETTINGS.eyebrow.en,
          ar: DEFAULT_OUR_WORK_SETTINGS.eyebrow.ar,
        }}
      />
      <LocalizedInput
        label="Title"
        value={form.title}
        onChange={(v) => updateField('title', v)}
        placeholder={{
          en: DEFAULT_OUR_WORK_SETTINGS.title.en,
          ar: DEFAULT_OUR_WORK_SETTINGS.title.ar,
        }}
      />
      <LocalizedInput
        label="Lead / description"
        value={form.lead}
        onChange={(v) => updateField('lead', v)}
        multiline
        placeholder={{
          en: DEFAULT_OUR_WORK_SETTINGS.lead.en,
          ar: DEFAULT_OUR_WORK_SETTINGS.lead.ar,
        }}
      />

      {canWrite && (
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-[#037B76] px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save homepage copy'}
        </button>
      )}
    </form>
  );
}
