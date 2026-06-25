'use client';

import { useMemo, useState } from 'react';
import LocalizedInput from '@/components/admin/localized-input';
import AdminImagePreview from '@/components/admin/admin-image-preview';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { useAdminUpload } from '@/contexts/admin-upload-context';
import { adminFetch } from '@/lib/admin-api';
import {
  createEmptyHeroSlide,
  isBannerImageUrl,
  migrateHeroSlidesFromLegacy,
  validateHeroSlideInput,
} from '@/lib/content/hero-slides';
import {
  detectBannerVideoPlatform,
  resolveBannerVideo,
} from '@/lib/video/banner-video';

function sortSlides(slides) {
  return [...slides].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export default function HomepageSettingsForm({ initial }) {
  const { getIdToken } = useAdminAuth();
  const { isUploading, uploadFile } = useAdminUpload();
  const [form, setForm] = useState({
    heroTitle: initial?.heroTitle || { en: '', ar: '' },
    heroSubtitle: initial?.heroSubtitle || { en: '', ar: '' },
    heroSlides: sortSlides(migrateHeroSlidesFromLegacy(initial || {})),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const updateSlide = (slideId, patch) => {
    setForm((prev) => ({
      ...prev,
      heroSlides: prev.heroSlides.map((slide) => (
        slide.id === slideId ? { ...slide, ...patch } : slide
      )),
    }));
  };

  const addSlide = () => {
    setForm((prev) => ({
      ...prev,
      heroSlides: sortSlides([
        ...prev.heroSlides,
        createEmptyHeroSlide(prev.heroSlides.length + 1),
      ]),
    }));
  };

  const removeSlide = (slideId) => {
    setForm((prev) => ({
      ...prev,
      heroSlides: prev.heroSlides
        .filter((slide) => slide.id !== slideId)
        .map((slide, index) => ({ ...slide, order: index + 1 })),
    }));
  };

  const moveSlide = (slideId, direction) => {
    setForm((prev) => {
      const slides = sortSlides(prev.heroSlides);
      const index = slides.findIndex((slide) => slide.id === slideId);
      if (index < 0) return prev;

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= slides.length) return prev;

      const next = [...slides];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return {
        ...prev,
        heroSlides: next.map((slide, orderIndex) => ({ ...slide, order: orderIndex + 1 })),
      };
    });
  };

  const handleUpload = async (slideId, file, type) => {
    if (!file || isUploading) return;

    try {
      setError('');
      const token = await getIdToken();
      const folder = type === 'video' ? 'homepage/videos' : 'homepage/images';
      const label = type === 'video' ? 'Uploading hero video...' : 'Uploading hero image...';
      const url = await uploadFile(file, folder, token, label);
      updateSlide(slideId, { url, type, enabled: true });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    for (let index = 0; index < form.heroSlides.length; index += 1) {
      const slide = form.heroSlides[index];
      if (!slide.enabled) continue;
      const message = validateHeroSlideInput(slide);
      if (message) {
        setError(`Slide ${index + 1}: ${message}`);
        return;
      }
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
          heroSlides: sortSlides(form.heroSlides),
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
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-[#002f3b]">Hero banner carousel</h2>
            <p className="mt-1 text-sm text-[#586971]">
              Add banner images or videos. Multiple slides rotate automatically. Videos play fully before moving to the next slide.
            </p>
          </div>
          <button
            type="button"
            onClick={addSlide}
            className="rounded-lg border border-[#037B76] px-3 py-1.5 text-sm font-medium text-[#037B76] hover:bg-[#f3faf8]"
          >
            Add slide
          </button>
        </div>

        {!form.heroSlides.length ? (
          <p className="text-sm text-[#586971]">
            No custom banner slides yet. The default homepage background image will be used.
          </p>
        ) : (
          <div className="space-y-4">
            {sortSlides(form.heroSlides).map((slide, index) => (
              <SlideEditor
                key={slide.id}
                slide={slide}
                index={index}
                total={form.heroSlides.length}
                onUpdate={(patch) => updateSlide(slide.id, patch)}
                onRemove={() => removeSlide(slide.id)}
                onMoveUp={() => moveSlide(slide.id, 'up')}
                onMoveDown={() => moveSlide(slide.id, 'down')}
                onUpload={(file) => handleUpload(slide.id, file, slide.type)}
              />
            ))}
          </div>
        )}
      </section>

      <button
        type="submit"
        disabled={saving || isUploading}
        className="rounded-lg bg-[#037B76] px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {saving ? 'Saving...' : 'Save settings'}
      </button>
    </form>
  );
}

function SlideEditor({
  slide,
  index,
  total,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  onUpload,
}) {
  const { isUploading } = useAdminUpload();
  const platform = useMemo(
    () => (slide.type === 'video' ? detectBannerVideoPlatform(slide.url) : ''),
    [slide.type, slide.url]
  );

  const preview = useMemo(() => {
    if (!slide.url?.trim()) return null;
    if (slide.type === 'image') {
      return { type: 'image', src: slide.url };
    }
    return resolveBannerVideo(slide.url, { loop: total <= 1 });
  }, [slide.type, slide.url, total]);

  return (
    <div className="rounded-xl border border-[#eef4f2] bg-[#f8fbfa] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#002f3b]">Slide {index + 1}</p>
          <p className="text-xs text-[#586971]">{slide.type === 'video' ? 'Video banner' : 'Image banner'}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 text-xs text-[#586971]">
            <input
              type="checkbox"
              checked={slide.enabled !== false}
              onChange={(e) => onUpdate({ enabled: e.target.checked })}
              className="h-4 w-4 rounded border-[#d7e6e2] text-[#037B76]"
            />
            Enabled
          </label>
          <button type="button" onClick={onMoveUp} disabled={index === 0} className="rounded border border-[#d7e6e2] px-2 py-1 text-xs disabled:opacity-40">Up</button>
          <button type="button" onClick={onMoveDown} disabled={index === total - 1} className="rounded border border-[#d7e6e2] px-2 py-1 text-xs disabled:opacity-40">Down</button>
          <button type="button" onClick={onRemove} className="rounded border border-red-200 px-2 py-1 text-xs text-red-600">Remove</button>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-[#586971]">Slide type</span>
          <select
            value={slide.type}
            onChange={(e) => onUpdate({ type: e.target.value })}
            className="mt-1 w-full rounded-lg border border-[#d7e6e2] bg-white px-3 py-2 text-sm"
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-[#586971]">
            {slide.type === 'video' ? 'Display duration (seconds)' : 'Image duration (seconds)'}
          </span>
          <input
            type="number"
            min="3"
            max="120"
            value={slide.durationSeconds || (slide.type === 'image' ? 6 : 30)}
            onChange={(e) => onUpdate({ durationSeconds: Number(e.target.value) || 6 })}
            className="mt-1 w-full rounded-lg border border-[#d7e6e2] bg-white px-3 py-2 text-sm"
          />
          <p className="mt-1 text-xs text-[#586971]">
            {slide.type === 'video'
              ? 'Used as fallback for YouTube/Vimeo if end detection is unavailable.'
              : 'How long this image stays visible before the next slide.'}
          </p>
        </label>
      </div>

      <label className="mt-4 block">
        <span className="text-sm font-medium text-[#586971]">
          {slide.type === 'video' ? 'Video URL' : 'Image URL'}
        </span>
        <input
          type="url"
          value={slide.url || ''}
          onChange={(e) => onUpdate({ url: e.target.value })}
          placeholder={slide.type === 'video'
            ? 'YouTube, Vimeo, or direct MP4/WebM URL'
            : 'https://example.com/banner.jpg'}
          className="mt-1 w-full rounded-lg border border-[#d7e6e2] bg-white px-3 py-2 text-sm"
        />
        {platform && (
          <p className="mt-1 text-xs text-[#586971]">
            Detected platform: <span className="font-medium capitalize">{platform}</span>
          </p>
        )}
        {slide.type === 'image' && slide.url && !isBannerImageUrl(slide.url) && detectBannerVideoPlatform(slide.url) && (
          <p className="mt-1 text-xs text-amber-700">This URL looks like a video. Switch slide type to video.</p>
        )}
      </label>

      <label className="mt-4 block">
        <span className="text-sm font-medium text-[#586971]">
          Or upload {slide.type === 'video' ? 'a video file' : 'an image file'}
        </span>
        <input
          type="file"
          accept={slide.type === 'video' ? 'video/mp4,video/webm,video/quicktime' : 'image/*'}
          onChange={(e) => onUpload(e.target.files?.[0])}
          disabled={isUploading}
          className="mt-1 w-full text-sm"
        />
        <p className="mt-1 text-xs text-[#586971]">
          {isUploading ? 'Uploading...' : 'Uploaded files are stored and the URL is filled automatically.'}
        </p>
      </label>

      {preview && (
        <div className="mt-4 overflow-hidden rounded-xl border border-[#d7e6e2] bg-white p-3">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[#586971]">Preview</p>
          <div className="relative aspect-video overflow-hidden rounded-lg bg-[#002333]">
            {preview.type === 'image' ? (
              <AdminImagePreview
                src={preview.src}
                imageClassName="h-full w-full object-cover"
              />
            ) : preview.type === 'video' ? (
              <video
                src={preview.src}
                className="h-full w-full object-cover"
                muted
                loop
                playsInline
                autoPlay
                controls
              />
            ) : preview?.src ? (
              <iframe
                src={preview.src}
                title="Banner preview"
                className="h-full w-full"
                allow="autoplay; fullscreen"
              />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
