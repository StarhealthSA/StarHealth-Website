import { createEmptyBlog } from './blog-defaults';

function normalizeLocalized(value) {
  if (!value) return { en: '', ar: '' };
  if (typeof value === 'string') return { en: value, ar: '' };
  return { en: value.en || '', ar: value.ar || '' };
}

export function isBlogPublished(blog) {
  if (!blog) return false;
  if (blog.status) return blog.status === 'active';
  return blog.published !== false;
}

export function normalizeBlog(raw = {}) {
  const defaults = createEmptyBlog();

  return {
    ...defaults,
    ...raw,
    id: raw.id ?? raw.slug ?? '',
    slug: raw.slug ?? raw.id ?? '',
    title: normalizeLocalized(raw.title),
    excerpt: normalizeLocalized(raw.excerpt || raw.about || raw.summary),
    body: normalizeLocalized(raw.body),
    category: normalizeLocalized(raw.category),
    author: normalizeLocalized(raw.author || defaults.author),
    featuredImageUrl: raw.featuredImageUrl || raw.mainImageUrl || '',
    status: raw.status ?? (raw.published === false ? 'draft' : 'active'),
    featured: Boolean(raw.featured),
    order: raw.order ?? 0,
    publishedAt: raw.publishedAt || raw.createdAt || new Date().toISOString(),
    seo: {
      metaTitle: normalizeLocalized(raw.seo?.metaTitle),
      metaDescription: normalizeLocalized(raw.seo?.metaDescription),
      ogImage: raw.seo?.ogImage || raw.featuredImageUrl || '',
    },
    createdAt: raw.createdAt || null,
    updatedAt: raw.updatedAt || null,
  };
}
