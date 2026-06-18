import { detectReelPlatform, getYoutubeVideoId } from '@/lib/content/reel-utils';

export function getVimeoVideoId(url = '') {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  return match?.[1] || '';
}

export function detectBannerVideoPlatform(url = '') {
  const value = url.trim().toLowerCase();
  if (!value) return '';

  if (value.includes('youtube.com') || value.includes('youtu.be')) return 'youtube';
  if (value.includes('vimeo.com')) return 'vimeo';
  if (/\.(mp4|webm|mov)(\?|$)/i.test(value)) return 'file';

  const reelPlatform = detectReelPlatform(url);
  if (reelPlatform === 'upload' && /\.(mp4|webm|mov)(\?|$)/i.test(value)) return 'file';

  return '';
}

export function resolveBannerVideo(url = '', { loop = true } = {}) {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const platform = detectBannerVideoPlatform(trimmed);

  if (platform === 'youtube') {
    const videoId = getYoutubeVideoId(trimmed);
    if (!videoId) return null;
    const params = new URLSearchParams({
      autoplay: '1',
      mute: '1',
      controls: '0',
      rel: '0',
      modestbranding: '1',
      playsinline: '1',
      iv_load_policy: '3',
      cc_load_policy: '0',
      disablekb: '1',
      fs: '0',
      enablejsapi: loop ? '0' : '1',
      origin: typeof window !== 'undefined' ? window.location.origin : '',
    });

    if (loop) {
      params.set('loop', '1');
      params.set('playlist', videoId);
    }

    return {
      platform,
      type: 'iframe',
      src: `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`,
    };
  }

  if (platform === 'vimeo') {
    const videoId = getVimeoVideoId(trimmed);
    if (!videoId) return null;
    const params = new URLSearchParams({
      background: loop ? '1' : '0',
      autoplay: '1',
      muted: '1',
      playsinline: '1',
      controls: '0',
      title: '0',
      byline: '0',
      portrait: '0',
      dnt: '1',
    });

    if (loop) {
      params.set('loop', '1');
    }

    return {
      platform,
      type: 'iframe',
      src: `https://player.vimeo.com/video/${videoId}?${params.toString()}`,
    };
  }

  if (platform === 'file') {
    return {
      platform,
      type: 'video',
      src: trimmed,
      loop,
    };
  }

  return null;
}

export function isBannerVideoSupported(url = '') {
  return Boolean(resolveBannerVideo(url));
}
