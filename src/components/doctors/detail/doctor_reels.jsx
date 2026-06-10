'use client';

import Reveal, { staggerDelay } from '@/components/reveal';
import DoctorSectionHeader from './doctor-section-header';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '@/lib/content/localized';
import { getReelEmbedUrl, sortReels } from '@/lib/content/reel-utils';

function ReelPlayer({ reel, title }) {
  const platform = reel.platform || 'upload';
  const embedUrl = getReelEmbedUrl(reel.url, platform);

  if (!embedUrl) return null;

  if (
    platform === 'upload'
    || (!embedUrl.includes('instagram.com') && !embedUrl.includes('youtube.com') && !embedUrl.includes('tiktok.com'))
  ) {
    return (
      <video
        src={embedUrl}
        controls
        playsInline
        poster={reel.thumbnailUrl || undefined}
        className="h-full w-full bg-black object-cover"
      />
    );
  }

  return (
    <iframe
      src={embedUrl}
      title={title}
      className="h-full w-full border-0 bg-black"
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
    <section id="reels" className="doctor-detail-section scroll-mt-32">
      <Reveal>
        <DoctorSectionHeader
          eyebrow={t('doctorDetail.watchAndLearn')}
          title={t('doctorDetail.reels')}
          description={t('doctorDetail.reelsDescription')}
        />
      </Reveal>

      <div className="doctor-reels-track mt-8 flex gap-5 overflow-x-auto pb-4">
        {reels.map((reel, index) => {
          const title = getLocalizedText(reel.title, i18n.language) || t('doctorDetail.reelFallback');
          return (
            <Reveal key={reel.id || index} delay={staggerDelay(index)} className="shrink-0">
              <article className="doctor-reel-card w-[260px] overflow-hidden sm:w-[280px]">
                <div className="aspect-[9/16] w-full bg-[#111]">
                  <ReelPlayer reel={reel} title={title} />
                </div>
                <div className="border-t border-[#E9E7E6] bg-white p-4">
                  <p className="font-inter text-sm font-semibold text-[#002333]">{title}</p>
                  <p className="mt-1 font-inter text-xs text-[#037B76]">{t('doctorDetail.tapToWatch')}</p>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
