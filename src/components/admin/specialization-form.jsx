'use client';

import { useState } from 'react';
import { SERVICE_ICONS } from '@/lib/content/service-icons';
import { createEmptySpecialization } from '@/lib/content/specialization-defaults';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { useAdminUpload } from '@/contexts/admin-upload-context';
import { uploadAdminFile } from '@/lib/admin-api';
import LocalizedInput from '@/components/admin/localized-input';
import LocalizedListEditor from '@/components/admin/localized-list-editor';
import AutoTranslateBar from '@/components/admin/auto-translate-bar';
import AdminImagePreview from '@/components/admin/admin-image-preview';
import ServiceBenefitsEditor from '@/components/admin/services/service-benefits-editor';
import ServiceFaqsEditor from '@/components/admin/services/service-faqs-editor';

export default function SpecializationForm({
  initial,
  services = [],
  onSubmit,
  onCancel,
  saving,
}) {
  const { getIdToken } = useAdminAuth();
  const { isUploading, uploadFile, runWithUpload } = useAdminUpload();
  const [form, setForm] = useState(() => ({
    ...createEmptySpecialization(),
    ...initial,
    parentServiceId: initial?.parentServiceId || '',
  }));
  const [tab, setTab] = useState('basic');

  const updateField = (path, value) => {
    setForm((prev) => {
      if (!path.includes('.')) {
        return { ...prev, [path]: value };
      }
      const parts = path.split('.');
      if (parts.length === 2) {
        const [parent, child] = parts;
        return { ...prev, [parent]: { ...prev[parent], [child]: value } };
      }
      return { ...prev, [path]: value };
    });
  };

  const handleFeaturedUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || isUploading) return;
    try {
      const token = await getIdToken();
      const url = await uploadFile(file, 'specializations', token, 'Uploading featured image...');
      updateField('featuredImageUrl', url);
    } catch {
      // upload errors surface via global loader ending
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length || isUploading) return;
    try {
      await runWithUpload(async () => {
        const token = await getIdToken();
        const urls = await Promise.all(files.map((f) => uploadAdminFile(f, 'specializations/gallery', token)));
        updateField('galleryImages', [...(form.galleryImages || []), ...urls]);
      }, 'Uploading gallery images...');
    } catch {
      // upload errors surface via global loader ending
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const slug = form.slug || form.name.en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = form.id || slug;
    onSubmit({
      ...form,
      id,
      slug,
      parentServiceId: form.parentServiceId || '',
      parentId: null,
    });
  };

  const tabs = [
    { id: 'basic', label: 'Basic' },
    { id: 'content', label: 'Content' },
    { id: 'media', label: 'Media' },
    { id: 'seo', label: 'SEO' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-[#d7e6e2] bg-white p-6">
      <h2 className="text-lg font-semibold text-[#002f3b]">
        {initial ? 'Edit Specialization' : 'Add Specialization'}
      </h2>

      <div className="flex flex-wrap gap-2 border-b border-[#d7e6e2] pb-4">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            disabled={isUploading}
            onClick={() => setTab(item.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 ${
              tab === item.id ? 'bg-[#037B76] text-white' : 'bg-[#f0f6f4] text-[#586971]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <AutoTranslateBar form={form} onTranslated={setForm} />

      {tab === 'basic' && (
        <div className="space-y-4">
          <LocalizedInput label="Name" value={form.name} onChange={(v) => updateField('name', v)} />
          <label className="block">
            <span className="text-sm font-medium text-[#586971]">Parent Service</span>
            <select
              value={form.parentServiceId || ''}
              onChange={(e) => updateField('parentServiceId', e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
            >
              <option value="">None</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.title?.en || service.id}
                </option>
              ))}
            </select>
          </label>
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
        </div>
      )}

      {tab === 'content' && (
        <div className="space-y-4">
          <LocalizedInput
            label="Short Description"
            value={form.shortDescription}
            onChange={(v) => updateField('shortDescription', v)}
            multiline
          />
          <LocalizedInput
            label="Full Description"
            value={form.fullDescription}
            onChange={(v) => updateField('fullDescription', v)}
            multiline
          />
          <ServiceBenefitsEditor
            items={form.benefits || []}
            onChange={(v) => updateField('benefits', v)}
          />
          <LocalizedInput
            label="Procedure Overview"
            value={form.procedureOverview}
            onChange={(v) => updateField('procedureOverview', v)}
            multiline
          />
          <LocalizedInput
            label="Treatment Duration"
            value={form.treatmentDuration}
            onChange={(v) => updateField('treatmentDuration', v)}
          />
          <label className="block">
            <span className="text-sm font-medium text-[#586971]">Treatment Price (SAR)</span>
            <input
              type="number"
              min="0"
              step="1"
              value={form.priceAmount ?? ''}
              onChange={(e) => updateField('priceAmount', e.target.value)}
              placeholder="e.g. 500"
              className="mt-1 w-full rounded-lg border border-[#d7e6e2] bg-white px-3 py-2"
            />
            <span className="mt-1 block text-xs text-[#7a8a91]">
              Leave empty to hide the price on the treatment page hero.
            </span>
          </label>
          <LocalizedInput
            label="Recovery Information"
            value={form.recoveryInfo}
            onChange={(v) => updateField('recoveryInfo', v)}
            multiline
          />
          <LocalizedListEditor
            label="Suitable For"
            items={form.suitableFor || []}
            onChange={(v) => updateField('suitableFor', v)}
          />
          <ServiceFaqsEditor
            faqs={form.faqs || []}
            onChange={(v) => updateField('faqs', v)}
            disabled={saving}
          />
        </div>
      )}

      {tab === 'media' && (
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-[#586971]">Icon Key</span>
            <select
              value={form.iconKey || ''}
              onChange={(e) => updateField('iconKey', e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#d7e6e2] bg-white px-3 py-2"
            >
              {Object.keys(SERVICE_ICONS).map((key) => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-[#586971]">Featured Image</span>
            <input type="file" accept="image/*" onChange={handleFeaturedUpload} disabled={isUploading} className="mt-1 block w-full text-sm" />
          </label>
          {form.featuredImageUrl && (
            <AdminImagePreview
              src={form.featuredImageUrl}
              imageClassName="h-40 w-full max-w-md rounded-xl object-cover"
              onRemove={() => updateField('featuredImageUrl', '')}
            />
          )}
          <label className="block">
            <span className="text-sm font-medium text-[#586971]">Gallery Images</span>
            <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} disabled={isUploading} className="mt-1 block w-full text-sm" />
          </label>
          {(form.galleryImages || []).length > 0 && (
            <div className="flex flex-wrap gap-3">
              {form.galleryImages.map((url, index) => (
                <AdminImagePreview
                  key={`${url}-${index}`}
                  src={url}
                  imageClassName="h-24 w-32 rounded-lg object-cover"
                  onRemove={() => updateField('galleryImages', form.galleryImages.filter((_, i) => i !== index))}
                />
              ))}
            </div>
          )}
          <label className="block">
            <span className="text-sm font-medium text-[#586971]">Video URL (optional)</span>
            <input
              value={form.videoUrl || ''}
              onChange={(e) => updateField('videoUrl', e.target.value)}
              placeholder="https://youtube.com/..."
              className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
            />
          </label>
        </div>
      )}

      {tab === 'seo' && (
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-[#586971]">URL Slug</span>
            <input
              value={form.slug || ''}
              onChange={(e) => updateField('slug', e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
            />
          </label>
          <LocalizedInput label="Meta Title" value={form.metaTitle} onChange={(v) => updateField('metaTitle', v)} />
          <LocalizedInput
            label="Meta Description"
            value={form.metaDescription}
            onChange={(v) => updateField('metaDescription', v)}
            multiline
          />
        </div>
      )}

      <div className="flex gap-3 border-t border-[#d7e6e2] pt-4">
        <button
          type="submit"
          disabled={saving || isUploading}
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
