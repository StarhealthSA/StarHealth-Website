'use client';

import { useState } from 'react';
import Reveal, { staggerDelay } from '@/components/reveal';
import ServiceSectionHeader from './service-section-header';
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
    <section id="gallery" className="service-landing-section service-landing-section--muted">
      <div className="service-detail-container">
        <Reveal>
          <ServiceSectionHeader
            label={t('serviceDetail.media')}
            title={t('serviceDetail.gallery')}
            description={t('serviceDetail.galleryLead')}
            align="center"
            className="max-w-2xl"
          />
        </Reveal>

        {gallery.length > 0 && (
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {gallery.map((url, index) => (
              <Reveal key={url} delay={staggerDelay(index)}>
                <button
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  className="service-landing-gallery-item group"
                >
                  <img
                    src={url}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </button>
              </Reveal>
            ))}
          </div>
        )}

        {videoUrl && (
          <Reveal delay={120} className="mx-auto mt-6 max-w-3xl">
            <div className="service-landing-video overflow-hidden rounded-2xl bg-[#111]">
              <iframe
                src={videoUrl}
                title={service.displayTitle}
                className="aspect-video h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </Reveal>
        )}
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#002333]/85 p-4 backdrop-blur-sm"
          onClick={() => setLightboxIndex(null)}
          role="presentation"
        >
          <img
            src={gallery[lightboxIndex]}
            alt=""
            className="max-h-[90vh] max-w-full rounded-2xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
