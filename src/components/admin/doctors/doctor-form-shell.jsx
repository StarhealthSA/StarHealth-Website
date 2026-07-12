'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createEmptyDoctor,
  DOCTOR_FORM_TABS,
  GENDERS,
  resolveDoctorFormTab,
} from '@/lib/content/doctor-defaults';
import {
  getSpecializationCategoryId,
  getSpecializationsByCategory,
} from '@/lib/content/specialization-utils';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { useAdminUpload } from '@/contexts/admin-upload-context';
import { adminFetch, uploadAdminFile } from '@/lib/admin-api';
import LocalizedInput from '@/components/admin/localized-input';
import LocalizedListEditor from '@/components/admin/localized-list-editor';
import AutoTranslateBar from '@/components/admin/auto-translate-bar';
import AdminImagePreview from '@/components/admin/admin-image-preview';
import DoctorReelsEditor from '@/components/admin/doctors/doctor-reels-editor';

export default function DoctorFormShell({
  initial,
  initialTab = 'basic',
  specializations = [],
  serviceCategories = [],
  services = [],
}) {
  const router = useRouter();
  const { getIdToken } = useAdminAuth();
  const { isUploading, uploadFile, runWithUpload } = useAdminUpload();
  const [tab, setTab] = useState(() => resolveDoctorFormTab(initialTab));
  const [form, setForm] = useState(() => {
    const base = initial || createEmptyDoctor();
    const activeSpecId = base.subSpecializationId || base.specializationId;
    const selectedSpec = specializations.find((spec) => spec.id === activeSpecId);
    const categoryId = base.categoryId || getSpecializationCategoryId(selectedSpec);
    return {
      ...base,
      categoryId: categoryId || '',
      specializationId: activeSpecId || base.specializationId || '',
    };
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setTab(resolveDoctorFormTab(initialTab));
  }, [initialTab]);

  const categorySpecs = form.categoryId
    ? getSpecializationsByCategory(specializations, form.categoryId)
    : [];

  const update = (path, value) => {
    setForm((prev) => {
      if (path.includes('.')) {
        const [parent, child] = path.split('.');
        return { ...prev, [parent]: { ...prev[parent], [child]: value } };
      }
      return { ...prev, [path]: value };
    });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || isUploading) return;
    try {
      const token = await getIdToken();
      const url = await uploadFile(file, 'doctors', token, 'Uploading doctor photo...');
      update('profilePhotoUrl', url);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length || isUploading) return;
    try {
      await runWithUpload(async () => {
        const token = await getIdToken();
        const urls = await Promise.all(files.map((f) => uploadAdminFile(f, 'doctors/gallery', token)));
        update('galleryImages', [...(form.galleryImages || []), ...urls]);
      }, 'Uploading gallery images...');
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleService = (serviceId) => {
    const ids = form.relatedServiceIds || [];
    update(
      'relatedServiceIds',
      ids.includes(serviceId) ? ids.filter((id) => id !== serviceId) : [...ids, serviceId]
    );
  };

  const normalizeListItems = (items) =>
    (items || []).map((item) => ({
      en: item.en || item.title?.en || '',
      ar: item.ar || item.title?.ar || '',
      year: item.year || '',
      description: item.description || { en: item.description?.en || '', ar: item.description?.ar || '' },
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setSaving(true);
      const slug = form.slug || form.name.en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const id = form.id || slug;
      const payload = {
        ...form,
        id,
        slug,
        categoryId: form.categoryId || null,
        specializationId: form.specializationId || null,
        subSpecializationId: form.subSpecializationId || null,
        certifications: normalizeListItems(form.certifications).map((c) => ({
          title: { en: c.en, ar: c.ar },
          year: c.year,
        })),
        awards: normalizeListItems(form.awards).map((a) => ({
          title: { en: a.en, ar: a.ar },
          year: a.year,
          description: a.description,
        })),
        areasOfExpertise: normalizeListItems(form.areasOfExpertise),
        treatmentsOffered: normalizeListItems(form.treatmentsOffered),
        languagesKnown: normalizeListItems(form.languagesKnown),
      };
      const token = await getIdToken();

      if (initial?.id) {
        await adminFetch(`/api/admin/doctors/${initial.id}`, { method: 'PUT', body: payload, token });
      } else {
        await adminFetch('/api/admin/doctors', { method: 'POST', body: payload, token });
      }
      router.push('/admin/doctors');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative space-y-6">
      <AutoTranslateBar form={form} onTranslated={setForm} />

      <div className="flex flex-wrap gap-2 border-b border-[#d7e6e2] pb-4">
        {DOCTOR_FORM_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            disabled={isUploading}
            onClick={() => setTab(t.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 ${
              tab === t.id ? 'bg-[#037B76] text-white' : 'bg-white text-[#586971] border border-[#d7e6e2]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="rounded-2xl border border-[#d7e6e2] bg-white p-6">
        {tab === 'basic' && (
          <div className="space-y-4">
            <LocalizedInput label="Doctor Name" value={form.name} onChange={(v) => update('name', v)} />
            <LocalizedInput label="Qualification" value={form.qualification} onChange={(v) => update('qualification', v)} />
            <LocalizedInput label="Designation" value={form.designation} onChange={(v) => update('designation', v)} />
            <div className="grid gap-4 md:grid-cols-3">
              <label className="block">
                <span className="text-sm font-medium text-[#586971]">Gender</span>
                <select value={form.gender} onChange={(e) => update('gender', e.target.value)} className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2">
                  {GENDERS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-[#586971]">Experience (Years)</span>
                <input type="number" value={form.experienceYears ?? ''} onChange={(e) => update('experienceYears', Number(e.target.value) || null)} className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2" />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-[#586971]">Order</span>
                <input type="number" value={form.order} onChange={(e) => update('order', Number(e.target.value))} className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2" />
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-[#586971]">Service Category</span>
                <select
                  value={form.categoryId || ''}
                  onChange={(e) => {
                    update('categoryId', e.target.value);
                    update('specializationId', '');
                    update('subSpecializationId', null);
                  }}
                  className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
                >
                  <option value="">Select category</option>
                  {serviceCategories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name?.en}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-[#586971]">Specialization</span>
                <select
                  value={form.specializationId || ''}
                  onChange={(e) => {
                    update('specializationId', e.target.value);
                    update('subSpecializationId', null);
                  }}
                  className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
                  disabled={!form.categoryId}
                >
                  <option value="">Select specialization</option>
                  {categorySpecs.map((spec) => (
                    <option key={spec.id} value={spec.id}>{spec.name?.en}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-[#586971]">Profile Photo URL</span>
                <input value={form.profilePhotoUrl || ''} onChange={(e) => update('profilePhotoUrl', e.target.value)} className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2" />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-[#586971]">Upload Photo</span>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} disabled={isUploading} className="mt-1 w-full text-sm" />
              </label>
            </div>
            {form.profilePhotoUrl && (
              <AdminImagePreview
                src={form.profilePhotoUrl}
                imageClassName="h-32 w-32 rounded-xl object-cover"
                onRemove={() => update('profilePhotoUrl', '')}
              />
            )}
          </div>
        )}

        {tab === 'professional' && (
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-[#586971]">Medical Registration Number</span>
              <input value={form.medicalRegistrationNumber || ''} onChange={(e) => update('medicalRegistrationNumber', e.target.value)} className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2" />
            </label>
            <LocalizedInput label="Hospital/Clinic Affiliation" value={form.affiliation} onChange={(v) => update('affiliation', v)} />
            <LocalizedListEditor label="Certifications" items={form.certifications || []} onChange={(v) => update('certifications', v)} fields={['en', 'ar', 'year']} />
            <LocalizedListEditor label="Awards" items={form.awards || []} onChange={(v) => update('awards', v)} fields={['en', 'ar', 'year']} />
            <LocalizedListEditor label="Languages Known" items={form.languagesKnown || []} onChange={(v) => update('languagesKnown', v)} />
          </div>
        )}

        {tab === 'profile' && (
          <div className="space-y-4">
            <LocalizedInput label="Short Introduction" value={form.shortIntro} onChange={(v) => update('shortIntro', v)} multiline />
            <LocalizedInput label="Detailed Biography" value={form.biography} onChange={(v) => update('biography', v)} multiline />
            <LocalizedListEditor label="Areas of Expertise" items={form.areasOfExpertise || []} onChange={(v) => update('areasOfExpertise', v)} />
            <LocalizedListEditor label="Treatments Offered" items={form.treatmentsOffered || []} onChange={(v) => update('treatmentsOffered', v)} />
          </div>
        )}

        {tab === 'media' && (
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-[#586971]">Upload Gallery Images</span>
              <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} disabled={isUploading} className="mt-1 w-full text-sm" />
            </label>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {(form.galleryImages || []).map((url, i) => (
                <AdminImagePreview
                  key={`${url}-${i}`}
                  src={url}
                  wrapperClassName="w-full"
                  imageClassName="h-24 w-full rounded-lg object-cover"
                  onRemove={() => update('galleryImages', form.galleryImages.filter((_, idx) => idx !== i))}
                />
              ))}
            </div>
          </div>
        )}

        {tab === 'reels' && (
          <DoctorReelsEditor
            reels={form.reels || []}
            onChange={(reels) => update('reels', reels)}
            disabled={isUploading}
          />
        )}

        {tab === 'seo' && (
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-[#586971]">URL Slug</span>
              <input value={form.slug || ''} onChange={(e) => update('slug', e.target.value)} placeholder="dr-name-slug" className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2" />
            </label>
            <LocalizedInput label="Meta Title" value={form.metaTitle} onChange={(v) => update('metaTitle', v)} />
            <LocalizedInput label="Meta Description" value={form.metaDescription} onChange={(v) => update('metaDescription', v)} multiline />
          </div>
        )}

        {tab === 'status' && (
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-[#586971]">Status</span>
              <select value={form.status} onChange={(e) => update('status', e.target.value)} className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm text-[#586971]">
              <input type="checkbox" checked={form.featured} onChange={(e) => update('featured', e.target.checked)} />
              Featured on home page
            </label>
            <div>
              <span className="text-sm font-medium text-[#586971]">Related Services</span>
              <div className="mt-2 grid gap-2 md:grid-cols-2">
                {services.map((service) => (
                  <label key={service.id} className="flex items-center gap-2 rounded-lg border border-[#eef4f2] px-3 py-2 text-sm">
                    <input
                      type="checkbox"
                      checked={(form.relatedServiceIds || []).includes(service.id)}
                      onChange={() => toggleService(service.id)}
                    />
                    {service.title?.en || service.id}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={saving || isUploading} className="rounded-lg bg-[#037B76] px-6 py-2 text-sm font-medium text-white disabled:opacity-60">
          {saving ? 'Saving...' : 'Save Doctor'}
        </button>
        <button type="button" onClick={() => router.push('/admin/doctors')} className="rounded-lg border border-[#d7e6e2] px-6 py-2 text-sm font-medium text-[#586971]">
          Cancel
        </button>
      </div>
    </form>
  );
}
