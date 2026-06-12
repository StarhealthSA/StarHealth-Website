'use client';

import { useMemo, useState } from 'react';
import LocalizedInput from '@/components/admin/localized-input';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { adminFetch, uploadAdminFile } from '@/lib/admin-api';
import {
  detectBannerVideoPlatform,
  isBannerVideoSupported,
  resolveBannerVideo,
} from '@/lib/video/banner-video';

export default function HomepageSettingsForm({ initial }) {
  const { getIdToken } = useAdminAuth();
  const [form, setForm] = useState({
    heroTitle: initial?.heroTitle || { en: '', ar: '' },
    heroSubtitle: initial?.heroSubtitle || { en: '', ar: '' },
    enabled: initial?.heroVideo?.enabled ?? false,
    url: initial?.heroVideo?.url ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const platform = useMemo(() => detectBannerVideoPlatform(form.url), [form.url]);
  const preview = useMemo(
    () => (form.url.trim() ? resolveBannerVideo(form.url) : null),
    [form.url]
  );

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError('');
      const token = await getIdToken();
      const url = await uploadAdminFile(file, 'homepage', token);
      setForm((prev) => ({ ...prev, url, enabled: true }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.enabled && form.url.trim() && !isBannerVideoSupported(form.url)) {
      setError('Unsupported video link. Use YouTube, Vimeo, or a direct MP4/WebM URL.');
      return;
    }

    try {
      setSaving(true);
      const token = await getIdToken();
      await adminFetch('/api/admin/site-settings/home', {
        method: 'PUT',
        token,
        body: {
          heroTitle: form.heroTitle,
          heroSubtitle: form.heroSubtitle,
          heroVideo: {
            enabled: form.enabled,
            url: form.url.trim(),
          },
        },
      });
      setSuccess('Homepage settings saved.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {success && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{success}</p>}

      <section className="space-y-5 rounded-2xl border border-[#d7e6e2] bg-white p-6">
        <div>
          <h2 className="text-lg font-semibold text-[#002f3b]">Hero text</h2>
          <p className="mt-1 text-sm text-[#586971]">
            Title and subtitle shown on the homepage banner. Leave blank to use the default site copy.
          </p>
          <p className="mt-2 text-sm text-[#586971]">
            The call-to-action button is fixed as <strong>Explore</strong> and links to the services page.
          </p>
        </div>

        <LocalizedInput
          label="Hero title"
          value={form.heroTitle}
          onChange={(value) => setForm((prev) => ({ ...prev, heroTitle: value }))}
        />
        <LocalizedInput
          label="Hero subtitle"
          value={form.heroSubtitle}
          onChange={(value) => setForm((prev) => ({ ...prev, heroSubtitle: value }))}
          multiline
        />
      </section>

      <section className="space-y-5 rounded-2xl border border-[#d7e6e2] bg-white p-6">
        <div>
          <h2 className="text-lg font-semibold text-[#002f3b]">Hero banner video</h2>
          <p className="mt-1 text-sm text-[#586971]">
            Plays behind the homepage hero as a muted background video. Supports YouTube, Vimeo, or a hosted MP4/WebM link.
          </p>
        </div>

        <label className="flex items-center gap-3 text-sm text-[#002f3b]">
          <input
            type="checkbox"
            checked={form.enabled}
            onChange={(e) => setForm((prev) => ({ ...prev, enabled: e.target.checked }))}
            className="h-4 w-4 rounded border-[#d7e6e2] text-[#037B76]"
          />
          Enable video banner on homepage
        </label>

        <label className="block">
          <span className="text-sm font-medium text-[#586971]">Video URL</span>
          <input
            type="url"
            value={form.url}
            onChange={(e) => setForm((prev) => ({ ...prev, url: e.target.value }))}
            placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/... or MP4 URL"
            className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2 text-sm"
          />
          {platform && (
            <p className="mt-1 text-xs text-[#586971]">
              Detected platform: <span className="font-medium capitalize">{platform}</span>
            </p>
          )}
          {form.url && !preview && (
            <p className="mt-1 text-xs text-amber-700">
              This link format is not supported for banner playback.
            </p>
          )}
        </label>

        <label className="block">
          <span className="text-sm font-medium text-[#586971]">Or upload a video file</span>
          <input
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            onChange={handleUpload}
            disabled={uploading}
            className="mt-1 w-full text-sm"
          />
          <p className="mt-1 text-xs text-[#586971]">
            {uploading ? 'Uploading...' : 'Uploaded videos are stored and the URL is filled in automatically.'}
          </p>
        </label>

        {preview && (
          <div className="overflow-hidden rounded-xl border border-[#d7e6e2] bg-[#f8fbfa] p-3">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[#586971]">Preview</p>
            <div className="relative aspect-video overflow-hidden rounded-lg bg-[#002333]">
              {preview.type === 'video' ? (
                <video
                  src={preview.src}
                  className="h-full w-full object-cover"
                  muted
                  loop
                  playsInline
                  autoPlay
                  controls
                />
              ) : (
                <iframe
                  src={preview.src}
                  title="Banner preview"
                  className="h-full w-full"
                  allow="autoplay; fullscreen"
                />
              )}
            </div>
          </div>
        )}
      </section>

      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-[#037B76] px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {saving ? 'Saving...' : 'Save settings'}
      </button>
    </form>
  );
}
