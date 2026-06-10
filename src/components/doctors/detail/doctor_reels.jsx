'use client';

import Reveal, { staggerDelay } from '@/components/reveal';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '@/lib/content/localized';
import { getReelEmbedUrl, sortReels } from '@/lib/content/reel-utils';

function ReelPlayer({ reel, title }) {
  const platform = reel.platform || 'upload';
  const embedUrl = getReelEmbedUrl(reel.url, platform);

  if (!embedUrl) return null;

  if (platform === 'upload' || (!embedUrl.includes('instagram.com') && !embedUrl.includes('youtube.com') && !embedUrl.includes('tiktok.com'))) {
    return (
      <video
        src={embedUrl}
        controls
        playsInline
        poster={reel.thumbnailUrl || undefined}
        className="h-full w-full rounded-xl bg-black object-cover"
      />
    );
  }

  return (
    <iframe
      src={embedUrl}
      title={title}
      className="h-full w-full rounded-xl border-0 bg-black"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    />
  );
}

export default function DoctorReels({ doctor }) {
  const { t, i18n } = useTranslation();
  const reels = sortReels(doctor.reels || []);

  if (!reels.length) return null;

  return (
    <section className="bg-[#F6F4F3] px-[20px] py-14 md:px-[60px] lg:px-[120px] lg:py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="font-inter text-2xl font-semibold text-[#002333]">{t('doctorDetail.reels')}</h2>
          <p className="mt-2 font-inter text-sm text-[#687276]">{t('doctorDetail.reelsDescription')}</p>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reels.map((reel, index) => {
            const title = getLocalizedText(reel.title, i18n.language) || t('doctorDetail.reelFallback');
            return (
              <Reveal key={reel.id || index} delay={staggerDelay(index)}>
                <article className="overflow-hidden rounded-2xl border border-[#E9E7E6] bg-white shadow-sm">
                  <div className="aspect-[9/16] w-full bg-[#111]">
                    <ReelPlayer reel={reel} title={title} />
                  </div>
                  <div className="p-4">
                    <h3 className="font-inter text-base font-medium text-[#002333]">{title}</h3>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
