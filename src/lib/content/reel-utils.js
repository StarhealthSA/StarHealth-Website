export function detectReelPlatform(url = '') {
  const value = url.toLowerCase();
  if (value.includes('instagram.com')) return 'instagram';
  if (value.includes('youtube.com') || value.includes('youtu.be')) return 'youtube';
  if (value.includes('tiktok.com')) return 'tiktok';
  if (/\.(mp4|webm|mov)(\?|$)/i.test(value)) return 'upload';
  return 'upload';
}

export function getYoutubeVideoId(url = '') {
  const shorts = url.match(/shorts\/([^/?#]+)/i);
  const watch = url.match(/[?&]v=([^&]+)/i);
  const shortLink = url.match(/youtu\.be\/([^/?#]+)/i);
  return shorts?.[1] || watch?.[1] || shortLink?.[1] || '';
}

export function getYoutubeThumbnail(url = '') {
  const videoId = getYoutubeVideoId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';
}

export function getReelThumbnail(reel = {}) {
  if (reel.thumbnailUrl) return reel.thumbnailUrl;

  const platform = reel.platform || detectReelPlatform(reel.url);
  if (platform === 'youtube') return getYoutubeThumbnail(reel.url);

  return '';
}

export function getInstagramEmbedUrl(url = '') {
  const match = url.match(/instagram\.com\/(?:reel|p|tv)\/([^/?#]+)/i);
  return match ? `https://www.instagram.com/reel/${match[1]}/embed` : '';
}

export function getReelEmbedUrl(url, platform) {
  if (!url) return '';

  const resolvedPlatform = platform || detectReelPlatform(url);

  if (resolvedPlatform === 'instagram') {
    return getInstagramEmbedUrl(url);
  }

  if (resolvedPlatform === 'youtube') {
    const videoId = getYoutubeVideoId(url);
    if (videoId) return `https://www.youtube.com/embed/${videoId}?playsinline=1&rel=0`;
  }

  if (resolvedPlatform === 'tiktok') {
    const match = url.match(/video\/(\d+)/i);
    if (match) return `https://www.tiktok.com/embed/v2/${match[1]}`;
  }

  if (/\.(mp4|webm|mov)(\?|$)/i.test(url)) return url;

  return '';
}

export function isInlineVideoReel(reel = {}) {
  const platform = reel.platform || detectReelPlatform(reel.url);
  return platform === 'upload' || /\.(mp4|webm|mov)(\?|$)/i.test(reel.url || '');
}

export function isInstagramReel(reel = {}) {
  const platform = reel.platform || detectReelPlatform(reel.url);
  return platform === 'instagram' && Boolean(getInstagramEmbedUrl(reel.url));
}

export function isEmbeddableReel(reel = {}) {
  const platform = reel.platform || detectReelPlatform(reel.url);
  if (platform === 'youtube') return Boolean(getYoutubeVideoId(reel.url));
  if (platform === 'tiktok') return /video\/(\d+)/i.test(reel.url || '');
  return false;
}

export function getReelIframeSrc(reel = {}) {
  const platform = reel.platform || detectReelPlatform(reel.url);
  if (platform === 'youtube' || platform === 'tiktok') {
    return getReelEmbedUrl(reel.url, platform);
  }
  return '';
}

export function sortReels(reels = []) {
  return [...reels]
    .filter((reel) => reel.published !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function createEmptyReel(order = 1) {
  return {
    id: `reel-${Date.now()}`,
    title: { en: '', ar: '' },
    url: '',
    thumbnailUrl: '',
    platform: 'instagram',
    order,
    published: true,
  };
}
