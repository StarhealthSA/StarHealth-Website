'use client';

import { useState } from 'react';
import LocalizedInput from '@/components/admin/localized-input';
import AutoTranslateBar from '@/components/admin/auto-translate-bar';

const emptySpec = {
  id: '',
  slug: '',
  name: { en: '', ar: '' },
  parentId: null,
  order: 1,
  active: true,
};

export default function SpecializationForm({ initial, parents = [], onSubmit, onCancel, saving }) {
  const [form, setForm] = useState(initial || emptySpec);

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
    onSubmit({ ...form, id, slug, parentId: form.parentId || null });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-[#d7e6e2] bg-white p-6">
      <h2 className="text-lg font-semibold text-[#002f3b]">
        {initial ? 'Edit Specialization' : 'Add Specialization'}
      </h2>

      <AutoTranslateBar form={form} onTranslated={setForm} />

      <LocalizedInput label="Name" value={form.name} onChange={(v) => updateField('name', v)} />

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-[#586971]">Parent Specialization</span>
          <select
            value={form.parentId || ''}
            onChange={(e) => updateField('parentId', e.target.value || null)}
            className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
          >
            <option value="">Top-level specialization</option>
            {parents.map((p) => (
              <option key={p.id} value={p.id}>{p.name?.en}</option>
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
      </div>
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
