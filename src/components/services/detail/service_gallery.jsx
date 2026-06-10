'use client';

import { useState } from 'react';
import Reveal, { staggerDelay } from '@/components/reveal';
import DoctorSectionHeader from '@/components/doctors/detail/doctor-section-header';
import { useTranslation } from 'react-i18next';
import { getYoutubeVideoId } from '@/lib/content/reel-utils';

function getEmbedVideoUrl(url = '') {
  const youtubeId = getYoutubeVideoId(url);
  if (youtubeId) return `https://www.youtube.com/embed/${youtubeId}`;
  return url;
}

export default function ServiceGallery({ service }) {
  const { t } = useTranslation();
  const gallery = service.galleryImages || [];
  const videoUrl = service.videoUrl ? getEmbedVideoUrl(service.videoUrl) : '';
  const [lightboxIndex, setLightboxIndex] = useState(null);

  if (!gallery.length && !videoUrl) return null;

  return (
    <section id="gallery" className="service-detail-section scroll-mt-32">
      <Reveal>
        <DoctorSectionHeader
          eyebrow={t('serviceDetail.media')}
          title={t('serviceDetail.gallery')}
          description={t('serviceDetail.galleryLead')}
        />
      </Reveal>

      {gallery.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
          {gallery.map((url, index) => (
            <Reveal key={url} delay={staggerDelay(index)}>
              <button
                type="button"
                onClick={() => setLightboxIndex(index)}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl"
              >
                <img
                  src={url}
                  alt=""
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </button>
            </Reveal>
          ))}
        </div>
      )}

      {videoUrl && (
        <Reveal delay={120} className="mt-6">
          <div className="aspect-video overflow-hidden rounded-2xl bg-[#111]">
            <iframe
              src={videoUrl}
              title={service.displayTitle}
              className="h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </Reveal>
      )}

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightboxIndex(null)}
          role="presentation"
        >
          <img
            src={gallery[lightboxIndex]}
            alt=""
            className="max-h-[90vh] max-w-full rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
