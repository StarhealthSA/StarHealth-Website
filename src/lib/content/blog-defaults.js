const emptyLocalized = () => ({ en: '', ar: '' });

export function createEmptyBlog() {
  return {
    id: '',
    slug: '',
    title: emptyLocalized(),
    excerpt: emptyLocalized(),
    body: emptyLocalized(),
    category: emptyLocalized(),
    author: { en: 'Star Health', ar: 'ستار هيلث' },
    featuredImageUrl: '',
    status: 'draft',
    featured: false,
    order: 0,
    publishedAt: new Date().toISOString(),
    seo: {
      metaTitle: emptyLocalized(),
      metaDescription: emptyLocalized(),
      ogImage: '',
    },
  };
}
