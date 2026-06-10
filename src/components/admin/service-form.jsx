'use client';

import { useState } from 'react';
import { SERVICE_ICONS } from '@/lib/content/service-icons';
import LocalizedInput from '@/components/admin/localized-input';
import AutoTranslateBar from '@/components/admin/auto-translate-bar';

const emptyService = {
  id: '',
  slug: '',
  title: { en: '', ar: '' },
  description: { en: '', ar: '' },
  iconKey: 'generalMedicine',
  imageUrl: '',
  order: 1,
  published: true,
};

export default function ServiceForm({ initial, onSubmit, onCancel, saving }) {
  const [form, setForm] = useState(initial || emptyService);

  const updateField = (path, value) => {
    setForm((prev) => {
      if (path.includes('.')) {
        const [parent, child] = path.split('.');
        return { ...prev, [parent]: { ...prev[parent], [child]: value } };
      }
      return { ...prev, [path]: value };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const slug = form.slug || form.title.en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = form.id || slug;
    onSubmit({ ...form, id, slug });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-[#d7e6e2] bg-white p-6">
      <h2 className="text-lg font-semibold text-[#002f3b]">{initial ? 'Edit Service' : 'Add Service'}</h2>

      <AutoTranslateBar form={form} onTranslated={setForm} />

      <LocalizedInput label="Title" value={form.title} onChange={(v) => updateField('title', v)} />
      <LocalizedInput label="Description" value={form.description} onChange={(v) => updateField('description', v)} multiline />

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-[#586971]">Icon Key</span>
          <select
            value={form.iconKey || ''}
            onChange={(e) => updateField('iconKey', e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
          >
            {Object.keys(SERVICE_ICONS).map((key) => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-[#586971]">Order</span>
          <input
            type="number"
            value={form.order}
            onChange={(e) => updateField('order', Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
          />
        </label>
        <label className="block md:col-span-2">
          <span className="text-sm font-medium text-[#586971]">Image URL (optional override)</span>
          <input
            value={form.imageUrl || ''}
            onChange={(e) => updateField('imageUrl', e.target.value)}
            placeholder="https://..."
            className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
          />
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm text-[#586971]">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(e) => updateField('published', e.target.checked)}
        />
        Published
      </label>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-[#037B76] px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save Service'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-[#d7e6e2] px-5 py-2 text-sm font-medium text-[#586971]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
