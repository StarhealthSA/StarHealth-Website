'use client';

import { useState } from 'react';
import { DOCTOR_IMAGES } from '@/lib/content/doctor-images';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { uploadAdminFile } from '@/lib/admin-api';

const CATEGORIES = [
  { value: 'generalMedicine', label: 'General Medicine' },
  { value: 'paediatrics', label: 'Paediatrics' },
  { value: 'dentistry', label: 'Dentistry' },
];

const emptyDoctor = {
  id: '',
  slug: '',
  name: { en: '', ar: '' },
  specialty: { en: '', ar: '' },
  category: 'generalMedicine',
  imageKey: 'dr_hany',
  imageUrl: '',
  order: 1,
  published: true,
  featured: false,
};

export default function DoctorForm({ initial, onSubmit, onCancel, saving }) {
  const { getIdToken } = useAdminAuth();
  const [form, setForm] = useState(initial || emptyDoctor);
  const [uploading, setUploading] = useState(false);

  const updateField = (path, value) => {
    setForm((prev) => {
      if (path.includes('.')) {
        const [parent, child] = path.split('.');
        return { ...prev, [parent]: { ...prev[parent], [child]: value } };
      }
      return { ...prev, [path]: value };
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const token = await getIdToken();
      const imageUrl = await uploadAdminFile(file, 'doctors', token);
      updateField('imageUrl', imageUrl);
    } catch (err) {
      alert(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const slug = form.slug || form.name.en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = form.id || slug;
    onSubmit({ ...form, id, slug });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-[#d7e6e2] bg-white p-6">
      <h2 className="text-lg font-semibold text-[#002f3b]">{initial ? 'Edit Doctor' : 'Add Doctor'}</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-[#586971]">Name (EN)</span>
          <input
            required
            value={form.name.en}
            onChange={(e) => updateField('name.en', e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-[#586971]">Name (AR)</span>
          <input
            required
            value={form.name.ar}
            onChange={(e) => updateField('name.ar', e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
            dir="rtl"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-[#586971]">Specialty (EN)</span>
          <input
            required
            value={form.specialty.en}
            onChange={(e) => updateField('specialty.en', e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-[#586971]">Specialty (AR)</span>
          <input
            required
            value={form.specialty.ar}
            onChange={(e) => updateField('specialty.ar', e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
            dir="rtl"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-[#586971]">Category</span>
          <select
            value={form.category}
            onChange={(e) => updateField('category', e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
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
        <label className="block">
          <span className="text-sm font-medium text-[#586971]">Image Key (local fallback)</span>
          <select
            value={form.imageKey || ''}
            onChange={(e) => updateField('imageKey', e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
          >
            {Object.keys(DOCTOR_IMAGES).map((key) => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-[#586971]">Image URL (Firebase Storage)</span>
          <input
            value={form.imageUrl || ''}
            onChange={(e) => updateField('imageUrl', e.target.value)}
            placeholder="https://..."
            className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-[#586971]">Upload photo</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="mt-1 w-full text-sm text-[#586971]"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-[#586971]">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => updateField('published', e.target.checked)}
          />
          Published
        </label>
        <label className="flex items-center gap-2 text-sm text-[#586971]">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => updateField('featured', e.target.checked)}
          />
          Featured on home page
        </label>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-[#037B76] px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save Doctor'}
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
