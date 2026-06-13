'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LocalizedInput from '@/components/admin/localized-input';
import AutoTranslateBar from '@/components/admin/auto-translate-bar';
import AdminImagePreview from '@/components/admin/admin-image-preview';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { adminFetch, uploadAdminFile } from '@/lib/admin-api';
import { createEmptyBlog } from '@/lib/content/blog-defaults';

const TABS = ['Basic', 'Content', 'SEO', 'Media'];

export default function BlogFormShell({ initial }) {
  const router = useRouter();
  const { getIdToken } = useAdminAuth();
  const [form, setForm] = useState(initial || createEmptyBlog());
  const [tab, setTab] = useState('Basic');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const updateField = (path, value) => {
    setForm((prev) => {
      if (path.startsWith('seo.')) {
        const key = path.split('.')[1];
        return { ...prev, seo: { ...prev.seo, [key]: value } };
      }
      if (path.includes('.')) {
        const [parent, child] = path.split('.');
        return { ...prev, [parent]: { ...prev[parent], [child]: value } };
      }
      return { ...prev, [path]: value };
    });
  };

  const handleImageUpload = async (file, field) => {
    try {
      setUploading(true);
      const token = await getIdToken();
      const imageUrl = await uploadAdminFile(file, 'blogs', token);
      if (field === 'featuredImageUrl') {
        updateField('featuredImageUrl', imageUrl);
      } else {
        updateField('seo.ogImage', imageUrl);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const slug =
      form.slug
      || form.title.en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = form.id || slug;
    const payload = {
      ...form,
      id,
      slug,
      publishedAt: form.publishedAt || new Date().toISOString(),
    };

    try {
      setSaving(true);
      const token = await getIdToken();

      if (initial?.id) {
        await adminFetch(`/api/admin/blogs/${initial.id}`, {
          method: 'PUT',
          body: payload,
          token,
        });
      } else {
        await adminFetch('/api/admin/blogs', {
          method: 'POST',
          body: payload,
          token,
        });
      }

      router.push('/admin/blogs');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {TABS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              tab === item
                ? 'bg-[#037B76] text-white'
                : 'border border-[#d7e6e2] text-[#586971]'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <AutoTranslateBar form={form} onTranslated={setForm} />

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <div className="rounded-2xl border border-[#d7e6e2] bg-white p-6">
        {tab === 'Basic' && (
          <div className="space-y-4">
            <LocalizedInput label="Title" value={form.title} onChange={(v) => updateField('title', v)} />
            <LocalizedInput
              label="Excerpt"
              value={form.excerpt}
              onChange={(v) => updateField('excerpt', v)}
              multiline
            />
            <LocalizedInput
              label="Category"
              value={form.category}
              onChange={(v) => updateField('category', v)}
            />
            <LocalizedInput
              label="Author"
              value={form.author}
              onChange={(v) => updateField('author', v)}
            />
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
            <label className="block">
              <span className="text-sm font-medium text-[#586971]">Published date</span>
              <input
                type="datetime-local"
                value={form.publishedAt ? form.publishedAt.slice(0, 16) : ''}
                onChange={(e) => updateField('publishedAt', new Date(e.target.value).toISOString())}
                className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2 md:max-w-sm"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-[#586971]">Status</span>
              <select
                value={form.status}
                onChange={(e) => updateField('status', e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2 md:max-w-xs"
              >
                <option value="draft">Draft</option>
                <option value="active">Published</option>
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm text-[#586971]">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => updateField('featured', e.target.checked)}
              />
              Featured on blog listing
            </label>
          </div>
        )}

        {tab === 'Content' && (
          <div className="space-y-4">
            <LocalizedInput
              label="Body (HTML supported)"
              value={form.body}
              onChange={(v) => updateField('body', v)}
              multiline
            />
            <p className="text-xs text-[#586971]">
              Use basic HTML tags such as p, h2, h3, ul, ol, li, strong, and a for links.
            </p>
          </div>
        )}

        {tab === 'SEO' && (
          <div className="space-y-4">
            <LocalizedInput
              label="Meta title"
              value={form.seo.metaTitle}
              onChange={(v) => updateField('seo.metaTitle', v)}
            />
            <LocalizedInput
              label="Meta description"
              value={form.seo.metaDescription}
              onChange={(v) => updateField('seo.metaDescription', v)}
              multiline
            />
            <label className="block">
              <span className="text-sm font-medium text-[#586971]">Open Graph image URL</span>
              <input
                type="url"
                value={form.seo.ogImage}
                onChange={(e) => updateField('seo.ogImage', e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-[#586971]">Upload OG image</span>
              <input
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'ogImage')}
                className="mt-1 block w-full text-sm"
              />
            </label>
            {form.seo.ogImage && <AdminImagePreview src={form.seo.ogImage} alt="OG preview" />}
          </div>
        )}

        {tab === 'Media' && (
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-[#586971]">Featured image URL</span>
              <input
                type="url"
                value={form.featuredImageUrl}
                onChange={(e) => updateField('featuredImageUrl', e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-[#586971]">Upload featured image</span>
              <input
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'featuredImageUrl')}
                className="mt-1 block w-full text-sm"
              />
            </label>
            {form.featuredImageUrl && (
              <AdminImagePreview src={form.featuredImageUrl} alt="Featured preview" />
            )}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving || uploading}
          className="rounded-lg bg-[#037B76] px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save blog'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/blogs')}
          className="rounded-lg border border-[#d7e6e2] px-5 py-2 text-sm font-medium text-[#586971]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
