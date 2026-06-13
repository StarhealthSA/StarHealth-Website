import { getLocalizedText } from './localized';

export function toPublicBlogPost(blog, language = 'en') {
  if (!blog) return null;

  return {
    id: blog.id,
    slug: blog.slug,
    title: getLocalizedText(blog.title, language),
    excerpt: getLocalizedText(blog.excerpt, language),
    body: getLocalizedText(blog.body, language),
    category: getLocalizedText(blog.category, language),
    author: getLocalizedText(blog.author, language),
    imageUrl: blog.featuredImageUrl || blog.seo?.ogImage || '',
    publishedAt: blog.publishedAt,
    featured: Boolean(blog.featured),
  };
}

export function getBlogSeo(blog, language = 'en') {
  if (!blog) {
    return {
      title: 'Blog | Star Health',
      description: '',
      ogImage: 'https://starhealth.sa/socialimage.png',
    };
  }

  const title =
    getLocalizedText(blog.seo?.metaTitle, language) || getLocalizedText(blog.title, language);
  const description =
    getLocalizedText(blog.seo?.metaDescription, language)
    || getLocalizedText(blog.excerpt, language);
  const ogImage =
    blog.seo?.ogImage || blog.featuredImageUrl || 'https://starhealth.sa/socialimage.png';

  return { title, description, ogImage };
}

export function buildBlogArticleJsonLd(blog, language = 'en') {
  const seo = getBlogSeo(blog, language);

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: seo.title,
    description: seo.description,
    image: seo.ogImage,
    datePublished: blog.publishedAt,
    dateModified: blog.updatedAt || blog.publishedAt,
    author: {
      '@type': 'Organization',
      name: getLocalizedText(blog.author, language) || 'Star Health',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Star Health',
      logo: {
        '@type': 'ImageObject',
        url: 'https://starhealth.sa/socialimage.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://starhealth.sa/blog/${blog.slug}`,
    },
  };
}
