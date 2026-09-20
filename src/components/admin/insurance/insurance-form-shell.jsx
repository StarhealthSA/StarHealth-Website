'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LocalizedInput from '@/components/admin/localized-input';
import AutoTranslateBar from '@/components/admin/auto-translate-bar';
import AdminImagePreview from '@/components/admin/admin-image-preview';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { useAdminUpload } from '@/contexts/admin-upload-context';
import { adminFetch } from '@/lib/admin-api';
import { createEmptyInsurancePartner } from '@/lib/content/insurance-defaults';

export default function InsuranceFormShell({ initial }) {
  const router = useRouter();
  const { getIdToken } = useAdminAuth();
  const { isUploading, uploadFile } = useAdminUpload();
  const [form, setForm] = useState(initial || createEmptyInsurancePartner());
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

  const handleLogoUpload = async (file) => {
    if (!file || isUploading) return;
    try {
      const token = await getIdToken();
      const imageUrl = await uploadFile(file, 'insurance', token, 'Uploading logo...');
      updateField('logoUrl', imageUrl);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name?.en?.trim()) {
      setError('Partner name (English) is required.');
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
        await adminFetch(`/api/admin/insurance/${initial.id}`, {
          method: 'PUT',
          body: payload,
          token,
        });
      } else {
        await adminFetch('/api/admin/insurance', {
          method: 'POST',
          body: payload,
          token,
        });
      }

      router.push('/admin/insurance');
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

      <div className="space-y-4 rounded-2xl border border-[#d7e6e2] bg-white p-6">
        <LocalizedInput
          label="Partner name"
          value={form.name}
          onChange={(v) => updateField('name', v)}
        />

        <div>
          <span className="text-sm font-medium text-[#586971]">Logo</span>
          <p className="mt-0.5 text-xs text-[#586971]">
            Recommended: transparent PNG, about 400 × 200 px
          </p>
          <input
            type="file"
            accept="image/*"
            disabled={isUploading}
            onChange={(e) => handleLogoUpload(e.target.files?.[0])}
            className="mt-2 block w-full text-sm"
          />
          <div className="mt-3 rounded-xl border border-[#eef4f2] bg-[#f8fbfa] p-4">
            <AdminImagePreview src={form.logoUrl} alt="Insurance logo" />
          </div>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-[#586971]">Website URL (optional)</span>
          <input
            type="url"
            value={form.websiteUrl}
            onChange={(e) => updateField('websiteUrl', e.target.value)}
            placeholder="https://"
            className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-[#586971]">Slug</span>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => updateField('slug', e.target.value)}
            placeholder="auto-generated-from-name"
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
            Featured partner
          </label>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving || isUploading}
          className="rounded-lg bg-[#037B76] px-6 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {saving ? 'Saving...' : initial?.id ? 'Update partner' : 'Create partner'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/insurance')}
          className="rounded-lg border border-[#d7e6e2] px-6 py-2 text-sm font-medium text-[#586971]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
