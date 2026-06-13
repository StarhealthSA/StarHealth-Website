import { notFound } from 'next/navigation';
import IntroSection from '@/components/blog_detailpage/intro_section';
import BlogDetailBody from '@/components/blog_detailpage/blog_detail_body';
import AllEvents from '@/components/blogs/all_events';
import WhatNext from '@/components/what_next';
import { buildBlogArticleJsonLd, getBlogSeo } from '@/lib/content/blog-public';
import { getBlogBySlug, getPublishedBlogs, getRelatedBlogs } from '@/lib/content/blogs';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return { title: 'Blog Not Found | Star Health' };
  }

  const seo = getBlogSeo(blog, 'en');
  const pageTitle = `${seo.title} | Star Health`;
  const pageUrl = `https://starhealth.sa/blog/${slug}`;

  return {
    title: pageTitle,
    description: seo.description,
    openGraph: {
      title: pageTitle,
      description: seo.description,
      url: pageUrl,
      type: 'article',
      publishedTime: blog.publishedAt,
      modifiedTime: blog.updatedAt || blog.publishedAt,
      images: [seo.ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: seo.description,
      images: [seo.ogImage],
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const [blog, relatedBlogs, blogs] = await Promise.all([
    getBlogBySlug(slug),
    getRelatedBlogs(slug),
    getPublishedBlogs(),
  ]);

  if (!blog) {
    notFound();
  }

  const jsonLd = buildBlogArticleJsonLd(blog, 'en');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <IntroSection blog={blog} />
      <BlogDetailBody blog={blog} relatedBlogs={relatedBlogs} />
      <AllEvents blogs={blogs} showButton />
      <WhatNext />
    </>
  );
}
