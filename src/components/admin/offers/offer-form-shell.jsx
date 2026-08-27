'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LocalizedInput from '@/components/admin/localized-input';
import AutoTranslateBar from '@/components/admin/auto-translate-bar';
import AdminImagePreview from '@/components/admin/admin-image-preview';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { useAdminUpload } from '@/contexts/admin-upload-context';
import { adminFetch } from '@/lib/admin-api';
import { createEmptyOffer } from '@/lib/content/offer-defaults';

export default function OfferFormShell({ initial }) {
  const router = useRouter();
  const { getIdToken } = useAdminAuth();
  const { isUploading, uploadFile } = useAdminUpload();
  const [form, setForm] = useState(initial || createEmptyOffer());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const updateField = (path, value) => {
    setForm((prev) => {
      if (path.includes('.')) {
        const [parent, child] = path.split('.');
        return { ...prev, [parent]: { ...prev[parent], [child]: value } };
      }
      return { ...prev, [path]: value };
    });
  };

  const handleImageUpload = async (file) => {
    if (!file || isUploading) return;
    try {
      const token = await getIdToken();
      const imageUrl = await uploadFile(file, 'offers', token, 'Uploading offer image...');
      updateField('featuredImageUrl', imageUrl);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name?.en?.trim()) {
      setError('Offer name (English) is required.');
      return;
    }

    const slug =
      form.slug
      || form.name.en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = form.id || slug;
    const payload = {
      ...form,
      id,
      slug,
    };

    try {
      setSaving(true);
      const token = await getIdToken();

      if (initial?.id) {
        await adminFetch(`/api/admin/offers/${initial.id}`, {
          method: 'PUT',
          body: payload,
          token,
        });
      } else {
        await adminFetch('/api/admin/offers', {
          method: 'POST',
          body: payload,
          token,
        });
      }

      router.push('/admin/offers');
      router.refresh();
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

      <div className="rounded-2xl border border-[#d7e6e2] bg-white p-6 space-y-4">
        <LocalizedInput
          label="Offer name"
          value={form.name}
          onChange={(v) => updateField('name', v)}
        />
        <LocalizedInput
          label="Treatment"
          value={form.treatment}
          onChange={(v) => updateField('treatment', v)}
        />
        <LocalizedInput
          label="Description (optional)"
          value={form.description}
          onChange={(v) => updateField('description', v)}
          multiline
        />

        <div className="grid gap-4 md:grid-cols-3">
          <label className="block">
            <span className="text-sm font-medium text-[#586971]">Offer price</span>
            <input
              type="text"
              value={form.offerPrice}
              onChange={(e) => updateField('offerPrice', e.target.value)}
              placeholder="299"
              className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-[#586971]">Cross price</span>
            <input
              type="text"
              value={form.crossPrice}
              onChange={(e) => updateField('crossPrice', e.target.value)}
              placeholder="499"
              className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-[#586971]">Currency</span>
            <input
              type="text"
              value={form.currency}
              onChange={(e) => updateField('currency', e.target.value)}
              placeholder="SAR"
              className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-[#586971]">Offer valid until</span>
            <input
              type="date"
              value={form.validUntil || ''}
              onChange={(e) => updateField('validUntil', e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-[#586971]">Book appointment URL</span>
            <input
              type="text"
              value={form.bookAppointmentUrl}
              onChange={(e) => updateField('bookAppointmentUrl', e.target.value)}
              placeholder="/booking"
              className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-[#586971]">Slug</span>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => updateField('slug', e.target.value)}
            placeholder="auto-generated-from-offer-name"
            className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="block">
            <span className="text-sm font-medium text-[#586971]">Status</span>
            <select
              value={form.status}
              onChange={(e) => updateField('status', e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-[#586971]">Display order</span>
            <input
              type="number"
              value={form.order}
              onChange={(e) => updateField('order', Number(e.target.value) || 0)}
              className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
            />
          </label>
          <label className="mt-6 flex items-center gap-2 text-sm text-[#586971]">
            <input
              type="checkbox"
              checked={Boolean(form.featured)}
              onChange={(e) => updateField('featured', e.target.checked)}
            />
            Featured offer
          </label>
        </div>

        <div>
          <span className="text-sm font-medium text-[#586971]">Offer image (optional)</span>
          <p className="mt-0.5 text-xs text-[#586971]">Recommended: 1200 × 800 px</p>
          <input
            type="file"
            accept="image/*"
            disabled={isUploading}
            onChange={(e) => handleImageUpload(e.target.files?.[0])}
            className="mt-2 block w-full text-sm"
          />
          <div className="mt-3">
            <AdminImagePreview src={form.featuredImageUrl} alt="Offer" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving || isUploading}
          className="rounded-lg bg-[#037B76] px-6 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {saving ? 'Saving...' : initial?.id ? 'Update offer' : 'Create offer'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/offers')}
          className="rounded-lg border border-[#d7e6e2] px-6 py-2 text-sm font-medium text-[#586971]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
