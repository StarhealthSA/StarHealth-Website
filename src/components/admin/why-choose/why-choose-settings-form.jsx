'use client';

import { useState } from 'react';
import LocalizedInput from '@/components/admin/localized-input';
import AutoTranslateBar from '@/components/admin/auto-translate-bar';
import AdminImagePreview from '@/components/admin/admin-image-preview';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { useAdminUpload } from '@/contexts/admin-upload-context';
import { adminFetch } from '@/lib/admin-api';
import { DEFAULT_WHY_CHOOSE_SETTINGS } from '@/lib/content/why-choose-defaults';

export default function WhyChooseSettingsForm({ initial }) {
  const { getIdToken, canWrite } = useAdminAuth();
  const { isUploading, uploadFile } = useAdminUpload();
  const [form, setForm] = useState(initial || DEFAULT_WHY_CHOOSE_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateCounter = (index, patch) => {
    setForm((prev) => ({
      ...prev,
      counters: prev.counters.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));
  };

  const handleIconUpload = async (index, file) => {
    if (!file || isUploading) return;
    try {
      const token = await getIdToken();
      const imageUrl = await uploadFile(file, 'why-choose', token, 'Uploading icon...');
      updateCounter(index, { iconUrl: imageUrl });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canWrite) return;
    setError('');
    setSuccess('');

    try {
      setSaving(true);
      const token = await getIdToken();
      const saved = await adminFetch('/api/admin/site-settings/why-choose', {
        method: 'PUT',
        body: form,
        token,
      });
      setForm(saved);
      setSuccess('Why Choose section saved. Changes appear on Home and About.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AutoTranslateBar form={form} onTranslated={setForm} />

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}
      {success && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{success}</p>
      )}

      <section className="space-y-4 rounded-2xl border border-[#d7e6e2] bg-white p-6">
        <div>
          <h2 className="text-lg font-semibold text-[#002f3b]">Section copy</h2>
          <p className="mt-1 text-sm text-[#586971]">
            Heading and body text shown on Home and About. Leave blank to use default site copy.
          </p>
        </div>
        <LocalizedInput
          label="Title"
          value={form.title}
          onChange={(value) => updateField('title', value)}
        />
        <LocalizedInput
          label="Paragraph 1"
          value={form.paragraph1}
          onChange={(value) => updateField('paragraph1', value)}
          multiline
        />
        <LocalizedInput
          label="Paragraph 2"
          value={form.paragraph2}
          onChange={(value) => updateField('paragraph2', value)}
          multiline
        />
        <LocalizedInput
          label="Paragraph 3"
          value={form.paragraph3}
          onChange={(value) => updateField('paragraph3', value)}
          multiline
        />
      </section>

      <section className="space-y-5 rounded-2xl border border-[#d7e6e2] bg-white p-6">
        <div>
          <h2 className="text-lg font-semibold text-[#002f3b]">Proof counters</h2>
          <p className="mt-1 text-sm text-[#586971]">
            Animated values (e.g. 63 + K, 92.5 + %). Optional icon image per counter.
          </p>
        </div>

        {(form.counters || []).map((counter, index) => (
          <div
            key={counter.id || index}
            className="space-y-3 rounded-xl border border-[#eef4f2] bg-[#f8fbfa] p-4"
          >
            <p className="text-sm font-semibold text-[#002f3b]">
              Counter {index + 1}
              {counter.id ? ` (${counter.id})` : ''}
            </p>
            <LocalizedInput
              label="Label"
              value={counter.label}
              onChange={(value) => updateCounter(index, { label: value })}
            />
            <div className="grid gap-3 sm:grid-cols-4">
              <label className="block text-sm">
                <span className="font-medium text-[#586971]">Value</span>
                <input
                  type="number"
                  step="any"
                  value={counter.value}
                  onChange={(e) => updateCounter(index, { value: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-[#586971]">Prefix</span>
                <input
                  type="text"
                  value={counter.prefix}
                  onChange={(e) => updateCounter(index, { prefix: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
                  placeholder="+"
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-[#586971]">Suffix</span>
                <input
                  type="text"
                  value={counter.suffix}
                  onChange={(e) => updateCounter(index, { suffix: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
                  placeholder="K or %"
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-[#586971]">Decimals</span>
                <input
                  type="number"
                  min="0"
                  max="2"
                  value={counter.decimals}
                  onChange={(e) => updateCounter(index, { decimals: Number(e.target.value) || 0 })}
                  className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
                />
              </label>
            </div>
            <div>
              <span className="text-sm font-medium text-[#586971]">Icon (optional)</span>
              <input
                type="file"
                accept="image/*"
                disabled={isUploading}
                onChange={(e) => handleIconUpload(index, e.target.files?.[0])}
                className="mt-2 block w-full text-sm"
              />
              {counter.iconUrl ? (
                <div className="mt-3 max-w-[6rem]">
                  <AdminImagePreview src={counter.iconUrl} alt="Counter icon" />
                  <button
                    type="button"
                    className="mt-2 text-xs text-red-600 hover:underline"
                    onClick={() => updateCounter(index, { iconUrl: '' })}
                  >
                    Remove icon
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-4 rounded-2xl border border-[#d7e6e2] bg-white p-6">
        <div>
          <h2 className="text-lg font-semibold text-[#002f3b]">CTAs</h2>
          <p className="mt-1 text-sm text-[#586971]">
            Book Now opens the booking form. WhatsApp uses the unified clinic number.
          </p>
        </div>
        <LocalizedInput
          label="Book Now button"
          value={form.bookNowLabel}
          onChange={(value) => updateField('bookNowLabel', value)}
        />
        <LocalizedInput
          label="WhatsApp button"
          value={form.whatsappLabel}
          onChange={(value) => updateField('whatsappLabel', value)}
        />
        <label className="block text-sm">
          <span className="font-medium text-[#586971]">WhatsApp number</span>
          <input
            type="text"
            value={form.whatsappNumber}
            onChange={(e) => updateField('whatsappNumber', e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
            placeholder="966505730003"
          />
        </label>
        <LocalizedInput
          label="WhatsApp prefilled message"
          value={form.whatsappMessage}
          onChange={(value) => updateField('whatsappMessage', value)}
          multiline
        />
      </section>

      {canWrite && (
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-[#037B76] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save Why Choose section'}
        </button>
      )}
    </form>
  );
}
