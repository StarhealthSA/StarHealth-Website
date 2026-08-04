'use client';

import LocalizedInput from '@/components/admin/localized-input';
import { useAdminUpload } from '@/contexts/admin-upload-context';

function TestimonialsEditor({ testimonials = [], onChange }) {
  const addItem = () => {
    onChange([...testimonials, { quote: { en: '', ar: '' }, name: { en: '', ar: '' }, rating: 5 }]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[#586971]">Service Testimonials</span>
        <button type="button" onClick={addItem} className="text-sm text-[#037B76] hover:underline">
          + Add testimonial
        </button>
      </div>
      {testimonials.map((item, index) => (
        <div key={index} className="space-y-2 rounded-lg border border-[#eef4f2] p-3">
          <LocalizedInput
            label="Quote"
            value={item.quote}
            onChange={(v) => {
              const next = [...testimonials];
              next[index] = { ...item, quote: v };
              onChange(next);
            }}
            multiline
          />
          <LocalizedInput
            label="Patient name"
            value={item.name}
            onChange={(v) => {
              const next = [...testimonials];
              next[index] = { ...item, name: v };
              onChange(next);
            }}
          />
          <label className="block">
            <span className="text-xs font-medium text-[#586971]">Rating (1–5)</span>
            <input
              type="number"
              min={1}
              max={5}
              value={item.rating ?? 5}
              onChange={(e) => {
                const next = [...testimonials];
                next[index] = { ...item, rating: Number(e.target.value) };
                onChange(next);
              }}
              className="mt-1 w-24 rounded-lg border border-[#d7e6e2] px-3 py-2 text-sm"
            />
          </label>
          <button
            type="button"
            onClick={() => onChange(testimonials.filter((_, i) => i !== index))}
            className="text-sm text-red-600"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

export default function ServiceMarketingEditor({
  marketing,
  doctors = [],
  onUpdate,
  onHeroVideoUpload,
}) {
  const { isUploading } = useAdminUpload();
  const updateMarketing = (field, value) => {
    onUpdate('marketing', { ...marketing, [field]: value });
  };

  const toggleDoctorId = (doctorId) => {
    const ids = marketing.featuredDoctorIds || [];
    updateMarketing(
      'featuredDoctorIds',
      ids.includes(doctorId) ? ids.filter((id) => id !== doctorId) : [...ids, doctorId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#d7e6e2] bg-[#f8fbfa] p-4">
        <h3 className="text-sm font-semibold text-[#002f3b]">Hero Video Background</h3>
        <p className="mt-1 text-xs text-[#586971]">Optional cinematic background for the service landing hero.</p>
        <label className="mt-4 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={Boolean(marketing.heroVideo?.enabled)}
            onChange={(e) => updateMarketing('heroVideo', { ...marketing.heroVideo, enabled: e.target.checked })}
          />
          Enable hero video
        </label>
        <label className="mt-3 block">
          <span className="text-sm font-medium text-[#586971]">Video URL (YouTube, Vimeo, or MP4)</span>
          <input
            value={marketing.heroVideo?.url || ''}
            onChange={(e) => updateMarketing('heroVideo', { ...marketing.heroVideo, url: e.target.value })}
            placeholder="https://youtube.com/..."
            className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2 text-sm"
          />
        </label>
        <label className="mt-3 block">
          <span className="text-sm font-medium text-[#586971]">Or upload MP4/WebM</span>
          <input
            type="file"
            accept="video/mp4,video/webm"
            onChange={onHeroVideoUpload}
            disabled={isUploading}
            className="mt-1 block w-full text-sm"
          />
        </label>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-[#586971]">Featured Doctors (max 4 shown)</p>
        <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border border-[#d7e6e2] p-3">
          {doctors.map((doctor) => (
            <label key={doctor.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={(marketing.featuredDoctorIds || []).includes(doctor.id)}
                onChange={() => toggleDoctorId(doctor.id)}
              />
              {doctor.name?.en || doctor.id}
            </label>
          ))}
          {!doctors.length && (
            <p className="text-xs text-[#586971]">No published doctors available.</p>
          )}
        </div>
      </div>

      <TestimonialsEditor
        testimonials={marketing.testimonials || []}
        onChange={(v) => updateMarketing('testimonials', v)}
      />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={marketing.showGlobalTestimonials !== false}
          onChange={(e) => updateMarketing('showGlobalTestimonials', e.target.checked)}
        />
        Show global testimonials when no service-specific testimonials are set
      </label>

      <LocalizedInput
        label="Urgency Note (final CTA)"
        value={marketing.urgencyNote}
        onChange={(v) => updateMarketing('urgencyNote', v)}
        multiline
      />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={marketing.whatsappEnabled !== false}
          onChange={(e) => updateMarketing('whatsappEnabled', e.target.checked)}
        />
        Show WhatsApp contact buttons on this service page
      </label>
    </div>
  );
}
