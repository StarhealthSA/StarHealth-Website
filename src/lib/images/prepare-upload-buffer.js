import sharp from 'sharp';

const CONVERTIBLE_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/avif',
  'image/tiff',
  'image/bmp',
  'image/heic',
  'image/heif',
]);

export function isConvertibleImage(mimeType) {
  return CONVERTIBLE_IMAGE_TYPES.has((mimeType || '').toLowerCase());
}

export async function prepareUploadBuffer(buffer, mimeType) {
  const normalizedType = (mimeType || '').toLowerCase();

  if (!isConvertibleImage(normalizedType)) {
    return {
      buffer,
      contentType: mimeType || 'application/octet-stream',
      extension: null,
    };
  }

  const isAnimated = normalizedType === 'image/gif';
  const webpBuffer = await sharp(buffer, { animated: isAnimated })
    .webp({ quality: 85, effort: 4 })
    .toBuffer();

  return {
    buffer: webpBuffer,
    contentType: 'image/webp',
    extension: 'webp',
  };
}
