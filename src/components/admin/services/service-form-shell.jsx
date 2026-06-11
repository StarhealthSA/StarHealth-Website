'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SERVICE_ICONS } from '@/lib/content/service-icons';
import { createEmptyService, SERVICE_FORM_TABS } from '@/lib/content/service-defaults';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { adminFetch, uploadAdminFile } from '@/lib/admin-api';
import LocalizedInput from '@/components/admin/localized-input';
import LocalizedListEditor from '@/components/admin/localized-list-editor';
import AutoTranslateBar from '@/components/admin/auto-translate-bar';
import AdminImagePreview from '@/components/admin/admin-image-preview';
import ServiceFaqsEditor from '@/components/admin/services/service-faqs-editor';

export default function ServiceFormShell({
  initial,
  categories = [],
  allServices = [],
}) {
  const router = useRouter();
  const { getIdToken } = useAdminAuth();
  const [tab, setTab] = useState('basic');
  const [form, setForm] = useState(initial || createEmptyService());
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const update = (path, value) => {
    setForm((prev) => {
      if (path.includes('.')) {
        const [parent, child] = path.split('.');
        return { ...prev, [parent]: { ...prev[parent], [child]: value } };
      }
      return { ...prev, [path]: value };
    });
  };

  const handleFeaturedUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const token = await getIdToken();
      const url = await uploadAdminFile(file, 'services', token);
      update('featuredImageUrl', url);
      update('imageUrl', url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleIconUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const token = await getIdToken();
      const url = await uploadAdminFile(file, 'services/icons', token);
      update('iconUrl', url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    try {
      setUploading(true);
      const token = await getIdToken();
      const urls = await Promise.all(files.map((f) => uploadAdminFile(f, 'services/gallery', token)));
      update('galleryImages', [...(form.galleryImages || []), ...urls]);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const toggleServiceId = (field, serviceId) => {
    const ids = form[field] || [];
    update(
      field,
      ids.includes(serviceId) ? ids.filter((id) => id !== serviceId) : [...ids, serviceId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setSaving(true);
      const slug = form.slug || form.title.en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const id = form.id || slug;
      const payload = {
        ...form,
        id,
        slug,
        published: form.status !== 'inactive',
      };
      const token = await getIdToken();
      if (initial?.id) {
        await adminFetch(`/api/admin/services/${initial.id}`, {
          method: 'PUT',
          body: payload,
          token,
        });
      } else {
        await adminFetch('/api/admin/services', {
          method: 'POST',
          body: payload,
          token,
        });
      }
      router.push('/admin/services');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const otherServices = allServices.filter((s) => s.id !== form.id);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-wrap gap-2 border-b border-[#d7e6e2] pb-4">
        {SERVICE_FORM_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              tab === t.id ? 'bg-[#037B76] text-white' : 'bg-[#f0f6f4] text-[#586971]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <AutoTranslateBar form={form} onTranslated={setForm} />

      {tab === 'basic' && (
        <div className="space-y-4">
          <LocalizedInput label="Service Name" value={form.title} onChange={(v) => update('title', v)} />
          <LocalizedInput
            label="Short Description"
            value={form.shortDescription}
            onChange={(v) => update('shortDescription', v)}
            multiline
          />
          <LocalizedInput
            label="Full Description"
            value={form.fullDescription}
            onChange={(v) => update('fullDescription', v)}
            multiline
          />
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-[#586971]">Icon Key</span>
              <select
                value={form.iconKey || ''}
                onChange={(e) => update('iconKey', e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
              >
                {Object.keys(SERVICE_ICONS).map((key) => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-[#586971]">Custom Icon Upload</span>
              <input type="file" accept="image/*" onChange={handleIconUpload} disabled={uploading} className="mt-1 block w-full text-sm" />
            </label>
          </div>
          {form.iconUrl && (
            <AdminImagePreview
              src={form.iconUrl}
              imageClassName="h-16 w-16 rounded-lg object-cover"
              onRemove={() => update('iconUrl', '')}
            />
          )}
          <label className="block">
            <span className="text-sm font-medium text-[#586971]">Featured Image</span>
            <input type="file" accept="image/*" onChange={handleFeaturedUpload} disabled={uploading} className="mt-1 block w-full text-sm" />
          </label>
          {form.featuredImageUrl && (
            <AdminImagePreview
              src={form.featuredImageUrl}
              wrapperClassName="block max-w-md"
              imageClassName="h-40 w-full rounded-xl object-cover"
              onRemove={() => {
                update('featuredImageUrl', '');
                update('imageUrl', '');
              }}
            />
          )}
        </div>
      )}

      {tab === 'details' && (
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-[#586971]">Service Category</span>
            <select
              value={form.categoryId || ''}
              onChange={(e) => update('categoryId', e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name?.en}</option>
              ))}
            </select>
          </label>
          <LocalizedListEditor
            label="Service Benefits"
            items={form.benefits || []}
            onChange={(v) => update('benefits', v)}
          />
          <LocalizedInput
            label="Procedure Overview"
            value={form.procedureOverview}
            onChange={(v) => update('procedureOverview', v)}
            multiline
          />
          <LocalizedInput
            label="Treatment Duration"
            value={form.treatmentDuration}
            onChange={(v) => update('treatmentDuration', v)}
          />
          <LocalizedInput
            label="Recovery Information"
            value={form.recoveryInfo}
            onChange={(v) => update('recoveryInfo', v)}
            multiline
          />
          <LocalizedInput
            label="Preparation Guidelines"
            value={form.preparationGuidelines}
            onChange={(v) => update('preparationGuidelines', v)}
            multiline
          />
          <LocalizedListEditor
            label="Suitable For"
            items={form.suitableFor || []}
            onChange={(v) => update('suitableFor', v)}
          />
          <LocalizedInput
            label="Risks & Precautions"
            value={form.risksAndPrecautions}
            onChange={(v) => update('risksAndPrecautions', v)}
            multiline
          />
        </div>
      )}

      {tab === 'faqs' && (
        <ServiceFaqsEditor
          faqs={form.faqs || []}
          onChange={(v) => update('faqs', v)}
          disabled={saving}
        />
      )}

      {tab === 'media' && (
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-[#586971]">Gallery Images</span>
            <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} disabled={uploading} className="mt-1 block w-full text-sm" />
          </label>
          {(form.galleryImages || []).length > 0 && (
            <div className="flex flex-wrap gap-3">
              {form.galleryImages.map((url, index) => (
                <AdminImagePreview
                  key={`${url}-${index}`}
                  src={url}
                  imageClassName="h-24 w-32 rounded-lg object-cover"
                  onRemove={() => update('galleryImages', form.galleryImages.filter((_, i) => i !== index))}
                />
              ))}
            </div>
          )}
          <label className="block">
            <span className="text-sm font-medium text-[#586971]">Video URL (optional)</span>
            <input
              value={form.videoUrl || ''}
              onChange={(e) => update('videoUrl', e.target.value)}
              placeholder="https://youtube.com/..."
              className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
            />
          </label>
        </div>
      )}

      {tab === 'relations' && (
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-medium text-[#586971]">Similar Treatments</p>
            <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border border-[#d7e6e2] p-3">
              {otherServices.map((service) => (
                <label key={service.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={(form.similarServiceIds || []).includes(service.id)}
                    onChange={() => toggleServiceId('similarServiceIds', service.id)}
                  />
                  {service.title?.en || service.id}
                </label>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-[#586971]">Recommended Services</p>
            <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border border-[#d7e6e2] p-3">
              {otherServices.map((service) => (
                <label key={service.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={(form.recommendedServiceIds || []).includes(service.id)}
                    onChange={() => toggleServiceId('recommendedServiceIds', service.id)}
                  />
                  {service.title?.en || service.id}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'seo' && (
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-[#586971]">URL Slug</span>
            <input
              value={form.slug || ''}
              onChange={(e) => update('slug', e.target.value)}
              placeholder="auto-generated from title"
              className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
            />
          </label>
          <LocalizedInput label="Meta Title" value={form.metaTitle} onChange={(v) => update('metaTitle', v)} />
          <LocalizedInput
            label="Meta Description"
            value={form.metaDescription}
            onChange={(v) => update('metaDescription', v)}
            multiline
          />
        </div>
      )}

      {tab === 'status' && (
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-[#586971]">Status</span>
            <select
              value={form.status || 'active'}
              onChange={(e) => update('status', e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2 md:max-w-xs"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-[#586971]">Display Order</span>
            <input
              type="number"
              value={form.order ?? 1}
              onChange={(e) => update('order', Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2 md:max-w-xs"
            />
          </label>
        </div>
      )}

      <div className="flex gap-3 border-t border-[#d7e6e2] pt-4">
        <button
          type="submit"
          disabled={saving || uploading}
          className="rounded-lg bg-[#037B76] px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save Service'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/services')}
          className="rounded-lg border border-[#d7e6e2] px-5 py-2 text-sm font-medium text-[#586971]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
