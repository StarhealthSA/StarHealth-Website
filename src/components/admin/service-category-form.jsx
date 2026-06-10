'use client';

import { useState } from 'react';
import LocalizedInput from '@/components/admin/localized-input';
import AutoTranslateBar from '@/components/admin/auto-translate-bar';

const emptyCategory = {
  id: '',
  slug: '',
  name: { en: '', ar: '' },
  description: { en: '', ar: '' },
  order: 1,
  active: true,
};

export default function ServiceCategoryForm({ initial, onSubmit, onCancel, saving }) {
  const [form, setForm] = useState(initial || emptyCategory);

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
    const slug = form.slug || form.name.en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = form.id || slug;
    onSubmit({ ...form, id, slug });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-[#d7e6e2] bg-white p-6">
      <h2 className="text-lg font-semibold text-[#002f3b]">
        {initial ? 'Edit Service Category' : 'Add Service Category'}
      </h2>

      <AutoTranslateBar form={form} onTranslated={setForm} />

      <LocalizedInput label="Name" value={form.name} onChange={(v) => updateField('name', v)} />
      <LocalizedInput
        label="Description"
        value={form.description}
        onChange={(v) => updateField('description', v)}
        multiline
      />

      <label className="block">
        <span className="text-sm font-medium text-[#586971]">Order</span>
        <input
          type="number"
          value={form.order}
          onChange={(e) => updateField('order', Number(e.target.value))}
          className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2 md:max-w-xs"
        />
      </label>

      <label className="flex items-center gap-2 text-sm text-[#586971]">
        <input
          type="checkbox"
          checked={form.active}
          onChange={(e) => updateField('active', e.target.checked)}
        />
        Active
      </label>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-[#037B76] px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save'}
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
