'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LocalizedInput from '@/components/admin/localized-input';
import AutoTranslateBar from '@/components/admin/auto-translate-bar';
import AdminImagePreview from '@/components/admin/admin-image-preview';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { useAdminUpload } from '@/contexts/admin-upload-context';
import { adminFetch } from '@/lib/admin-api';
import { createEmptyPortfolioEntry } from '@/lib/content/portfolio-defaults';
import { resolvePortfolioCategoryForService } from '@/lib/content/portfolio-categories';

export default function PortfolioFormShell({ initial, services = [] }) {
  const router = useRouter();
  const { getIdToken } = useAdminAuth();
  const { isUploading, uploadFile } = useAdminUpload();
  const [form, setForm] = useState(initial || createEmptyPortfolioEntry());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const sortedServices = [...services].sort((a, b) => {
    const titleA = (a.title?.en || a.id || '').toLowerCase();
    const titleB = (b.title?.en || b.id || '').toLowerCase();
    return titleA.localeCompare(titleB);
  });

  const selectedService = sortedServices.find((service) => service.id === form.serviceId);
  const derivedCategory = resolvePortfolioCategoryForService(selectedService);

  const updateField = (path, value) => {
    setForm((prev) => {
      if (path.includes('.')) {
        const [parent, child] = path.split('.');
        return { ...prev, [parent]: { ...prev[parent], [child]: value } };
      }
      return { ...prev, [path]: value };
    });
  };

  const handleServiceChange = (serviceId) => {
    const selected = sortedServices.find((service) => service.id === serviceId);
    const category = resolvePortfolioCategoryForService(selected) || '';
    setForm((prev) => ({
      ...prev,
      serviceId: serviceId || '',
      serviceSlug: selected?.slug || selected?.id || '',
      category,
      serviceName: selected
        ? {
          en: selected.title?.en || selected.slug || selected.id || '',
          ar: selected.title?.ar || '',
        }
        : { en: '', ar: '' },
    }));
  };

  const handleUpload = async (file, field, folder, label) => {
    if (!file || isUploading) return;
    try {
      const token = await getIdToken();
      const url = await uploadFile(file, folder, token, label);
      updateField(field, url);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title?.en?.trim()) {
      setError('Case title (English) is required.');
      return;
    }

    if (!form.serviceId) {
      setError('Please select a service from the list.');
      return;
    }

    const selected = sortedServices.find((service) => service.id === form.serviceId);
    const category = resolvePortfolioCategoryForService(selected);
    if (!category) {
      setError(
        'Selected service is not mapped to a portfolio category (Dental or Dermatology). '
        + 'Use a dentistry/dermatology service, or extend portfolio-categories.js.'
      );
      return;
    }

    const hasMedia = Boolean(
      form.mediaUrl
      || (form.beforeImageUrl && form.afterImageUrl)
    );
    if (!hasMedia) {
      setError('Add a main image/video, or both before and after images.');
      return;
    }

    const serviceName = selected
      ? {
        en: selected.title?.en || selected.slug || selected.id || '',
        ar: selected.title?.ar || '',
      }
      : (form.serviceName || { en: '', ar: '' });
    const serviceSlug = selected?.slug || selected?.id || form.serviceSlug || '';

    const slug =
      form.slug
      || form.title.en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = form.id || slug;
    const payload = {
      ...form,
      id,
      slug,
      category,
      serviceId: form.serviceId,
      serviceSlug,
      serviceName,
      mediaType: form.mediaType === 'video' ? 'video' : 'image',
    };

    try {
      setSaving(true);
      const token = await getIdToken();

      if (initial?.id) {
        await adminFetch(`/api/admin/portfolio/${initial.id}`, {
          method: 'PUT',
          body: payload,
          token,
        });
      } else {
        await adminFetch('/api/admin/portfolio', {
          method: 'POST',
          body: payload,
          token,
        });
      }

      router.push('/admin/portfolio');
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
          label="Case title"
          value={form.title}
          onChange={(v) => updateField('title', v)}
        />

        <label className="block">
          <span className="text-sm font-medium text-[#586971]">Service</span>
          <select
            value={form.serviceId || ''}
            onChange={(e) => handleServiceChange(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
          >
            <option value="">Select a service…</option>
            {sortedServices.map((service) => (
              <option key={service.id} value={service.id}>
                {service.title?.en || service.slug || service.id}
                {service.title?.ar ? ` / ${service.title.ar}` : ''}
              </option>
            ))}
          </select>
          <span className="mt-1 block text-xs text-[#586971]">
            Category is set automatically from the selected service
            {derivedCategory ? ` → ${derivedCategory}` : ''}.
          </span>
          {!sortedServices.length ? (
            <span className="mt-1 block text-xs text-amber-700">
              No services found. Add services under Admin → Services first.
            </span>
          ) : null}
        </label>

        <LocalizedInput
          label="Doctor name"
          value={form.doctorName}
          onChange={(v) => updateField('doctorName', v)}
        />
        <LocalizedInput
          label="Short description"
          value={form.description}
          onChange={(v) => updateField('description', v)}
          multiline
        />
        <LocalizedInput
          label="Image / video alt text"
          value={form.altText}
          onChange={(v) => updateField('altText', v)}
        />

        <div className="grid gap-4 md:grid-cols-3">
          <label className="block">
            <span className="text-sm font-medium text-[#586971]">Media type</span>
            <select
              value={form.mediaType}
              onChange={(e) => updateField('mediaType', e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-[#586971]">Status</span>
            <select
              value={form.status}
              onChange={(e) => updateField('status', e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
            >
              <option value="draft">Draft</option>
              <option value="active">Published</option>
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
        </div>

        <label className="flex items-center gap-2 text-sm text-[#586971]">
          <input
            type="checkbox"
            checked={Boolean(form.featured)}
            onChange={(e) => updateField('featured', e.target.checked)}
          />
          Feature on homepage slider
        </label>

        <label className="block">
          <span className="text-sm font-medium text-[#586971]">Slug</span>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => updateField('slug', e.target.value)}
            placeholder="auto-generated-from-title"
            className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
          />
        </label>

        <div>
          <span className="text-sm font-medium text-[#586971]">
            Main {form.mediaType === 'video' ? 'video' : 'image'}
          </span>
          <p className="mt-0.5 text-xs text-[#586971]">
            Upload a file or paste an approved media URL below.
          </p>
          <input
            type="file"
            accept={form.mediaType === 'video' ? 'video/mp4,video/webm,video/quicktime' : 'image/*'}
            disabled={isUploading}
            onChange={(e) => handleUpload(
              e.target.files?.[0],
              'mediaUrl',
              form.mediaType === 'video' ? 'portfolio/videos' : 'portfolio',
              form.mediaType === 'video' ? 'Uploading portfolio video...' : 'Uploading portfolio image...'
            )}
            className="mt-2 block w-full text-sm"
          />
          <input
            type="url"
            value={form.mediaUrl}
            onChange={(e) => updateField('mediaUrl', e.target.value)}
            placeholder="https://..."
            className="mt-2 w-full rounded-lg border border-[#d7e6e2] px-3 py-2 text-sm"
          />
          {form.mediaType === 'image' && form.mediaUrl ? (
            <div className="mt-3">
              <AdminImagePreview src={form.mediaUrl} alt="Portfolio media" />
            </div>
          ) : null}
          {form.mediaType === 'video' && form.mediaUrl ? (
            <video
              src={form.mediaUrl}
              controls
              className="mt-3 max-h-56 w-full rounded-xl bg-black object-contain"
            >
              <track kind="captions" />
            </video>
          ) : null}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <span className="text-sm font-medium text-[#586971]">Before image (optional)</span>
            <p className="mt-0.5 text-xs text-[#586971]">
              Use with After for before-and-after cases.
            </p>
            <input
              type="file"
              accept="image/*"
              disabled={isUploading}
              onChange={(e) => handleUpload(
                e.target.files?.[0],
                'beforeImageUrl',
                'portfolio/before-after',
                'Uploading before image...'
              )}
              className="mt-2 block w-full text-sm"
            />
            <input
              type="url"
              value={form.beforeImageUrl}
              onChange={(e) => updateField('beforeImageUrl', e.target.value)}
              placeholder="https://..."
              className="mt-2 w-full rounded-lg border border-[#d7e6e2] px-3 py-2 text-sm"
            />
            {form.beforeImageUrl ? (
              <div className="mt-3">
                <AdminImagePreview src={form.beforeImageUrl} alt="Before" />
              </div>
            ) : null}
          </div>

          <div>
            <span className="text-sm font-medium text-[#586971]">After image (optional)</span>
            <input
              type="file"
              accept="image/*"
              disabled={isUploading}
              onChange={(e) => handleUpload(
                e.target.files?.[0],
                'afterImageUrl',
                'portfolio/before-after',
                'Uploading after image...'
              )}
              className="mt-2 block w-full text-sm"
            />
            <input
              type="url"
              value={form.afterImageUrl}
              onChange={(e) => updateField('afterImageUrl', e.target.value)}
              placeholder="https://..."
              className="mt-2 w-full rounded-lg border border-[#d7e6e2] px-3 py-2 text-sm"
            />
            {form.afterImageUrl ? (
              <div className="mt-3">
                <AdminImagePreview src={form.afterImageUrl} alt="After" />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving || isUploading}
          className="rounded-lg bg-[#037B76] px-6 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {saving ? 'Saving...' : initial?.id ? 'Update case' : 'Create case'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/portfolio')}
          className="rounded-lg border border-[#d7e6e2] px-6 py-2 text-sm font-medium text-[#586971]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
