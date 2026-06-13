'use client';

import { useTranslation } from 'react-i18next';
import { formatBlogPublishedDate } from '@/lib/content/blog-public';

export default function BlogMeta({ post, variant = 'default', className = '' }) {
  const { t, i18n } = useTranslation();

  if (!post) return null;

  const publishedDate = formatBlogPublishedDate(post.publishedAt, i18n.language);
  const author = post.author?.trim();

  if (!publishedDate && !author) return null;

  if (variant === 'compact') {
    return (
      <p className={`text-xs text-[#687276] font-inter ${className}`}>
        {publishedDate && (
          <span>
            {t('blogs.publishedOn')}: {publishedDate}
          </span>
        )}
        {publishedDate && author && <span className="mx-1.5">·</span>}
        {author && (
          <span>
            {t('blogs.author')}: {author}
          </span>
        )}
      </p>
    );
  }

  if (variant === 'detail') {
    return (
      <div className={`flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:gap-x-6 ${className}`}>
        {publishedDate && (
          <p className="text-sm text-[#687276] font-inter">
            <span className="font-medium text-[#002333]">{t('blogs.publishedOn')}:</span>{' '}
            {publishedDate}
          </p>
        )}
        {author && (
          <p className="text-sm text-[#687276] font-inter">
            <span className="font-medium text-[#002333]">{t('blogs.author')}:</span>{' '}
            {author}
          </p>
        )}
      </div>
    );
  }

  return (
    <p className={`text-xs text-[#687276] font-inter ${className}`}>
      {author && (
        <span>
          {t('blogs.publishedBy')}: {author}
        </span>
      )}
      {author && publishedDate && <span className="mx-1.5">·</span>}
      {publishedDate && (
        <span>
          {t('blogs.publishedOn')}: {publishedDate}
        </span>
      )}
    </p>
  );
}
