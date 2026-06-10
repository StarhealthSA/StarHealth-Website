'use client';

import { useState } from 'react';
import LocalizedInput from '@/components/admin/localized-input';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { uploadAdminFile } from '@/lib/admin-api';
import { createEmptyReel, detectReelPlatform } from '@/lib/content/reel-utils';

const PLATFORMS = [
  { value: 'instagram', label: 'Instagram Reel' },
  { value: 'youtube', label: 'YouTube Short' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'upload', label: 'Uploaded Video' },
];

export default function DoctorReelsEditor({ reels = [], onChange, disabled = false }) {
  const { getIdToken } = useAdminAuth();
  const [uploadingId, setUploadingId] = useState(null);

  const updateReel = (index, patch) => {
    const next = [...reels];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  const addReel = () => {
    onChange([...reels, createEmptyReel(reels.length + 1)]);
  };

  const removeReel = (index) => {
    onChange(reels.filter((_, i) => i !== index));
  };

  const handleUrlChange = (index, url) => {
    updateReel(index, {
      url,
      platform: detectReelPlatform(url),
    });
  };

  const handleVideoUpload = async (index, file) => {
    if (!file) return;
    try {
      setUploadingId(reels[index]?.id || index);
      const token = await getIdToken();
      const videoUrl = await uploadAdminFile(file, 'doctors/reels', token);
      updateReel(index, {
        url: videoUrl,
        platform: 'upload',
        thumbnailUrl: reels[index]?.thumbnailUrl || '',
      });
    } catch (error) {
      alert(error.message || 'Video upload failed');
    } finally {
      setUploadingId(null);
    }
  };

  const handleThumbnailUpload = async (index, file) => {
    if (!file) return;
    try {
      setUploadingId(reels[index]?.id || index);
      const token = await getIdToken();
      const imageUrl = await uploadAdminFile(file, 'doctors/reels/thumbnails', token);
      updateReel(index, { thumbnailUrl: imageUrl });
    } catch (error) {
      alert(error.message || 'Thumbnail upload failed');
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-[#002f3b]">Doctor Reels</h3>
          <p className="text-xs text-[#586971]">
            Add Instagram, YouTube, TikTok links, or upload a video for the doctor detail page.
          </p>
        </div>
        <button
          type="button"
          onClick={addReel}
          disabled={disabled}
          className="rounded-lg border border-[#037B76] px-3 py-1.5 text-sm font-medium text-[#037B76] hover:bg-[#037B76] hover:text-white disabled:opacity-50"
        >
          + Add Reel
        </button>
      </div>

      {reels.length === 0 && (
        <p className="rounded-lg border border-dashed border-[#d7e6e2] px-4 py-6 text-center text-sm text-[#586971]">
          No reels added yet.
        </p>
      )}

      {reels.map((reel, index) => (
        <div key={reel.id || index} className="space-y-4 rounded-xl border border-[#d7e6e2] bg-[#f8fbfa] p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#002f3b]">Reel {index + 1}</p>
            <button
              type="button"
              onClick={() => removeReel(index)}
              className="text-sm text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>

          <LocalizedInput
            label="Reel Title"
            value={reel.title || { en: '', ar: '' }}
            onChange={(title) => updateReel(index, { title })}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-[#586971]">Reel URL</span>
              <input
                value={reel.url || ''}
                onChange={(e) => handleUrlChange(index, e.target.value)}
                placeholder="https://www.instagram.com/reel/..."
                className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-[#586971]">Platform</span>
              <select
                value={reel.platform || 'instagram'}
                onChange={(e) => updateReel(index, { platform: e.target.value })}
                className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2 text-sm"
              >
                {PLATFORMS.map((platform) => (
                  <option key={platform.value} value={platform.value}>{platform.label}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-[#586971]">Upload Video (optional)</span>
              <input
                type="file"
                accept="video/*"
                disabled={uploadingId === (reel.id || index)}
                onChange={(e) => handleVideoUpload(index, e.target.files?.[0])}
                className="mt-1 w-full text-sm"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-[#586971]">Thumbnail (optional)</span>
              <input
                type="file"
                accept="image/*"
                disabled={uploadingId === (reel.id || index)}
                onChange={(e) => handleThumbnailUpload(index, e.target.files?.[0])}
                className="mt-1 w-full text-sm"
              />
            </label>
          </div>

          {reel.thumbnailUrl && (
            <img src={reel.thumbnailUrl} alt="" className="h-24 w-40 rounded-lg object-cover" />
          )}

          <div className="flex flex-wrap items-center gap-4">
            <label className="block">
              <span className="text-sm font-medium text-[#586971]">Order</span>
              <input
                type="number"
                value={reel.order ?? index + 1}
                onChange={(e) => updateReel(index, { order: Number(e.target.value) })}
                className="mt-1 w-24 rounded-lg border border-[#d7e6e2] px-3 py-2 text-sm"
              />
            </label>
            <label className="flex items-center gap-2 pt-6 text-sm text-[#586971]">
              <input
                type="checkbox"
                checked={reel.published !== false}
                onChange={(e) => updateReel(index, { published: e.target.checked })}
              />
              Show on doctor page
            </label>
          </div>
        </div>
      ))}
    </div>
  );
}
