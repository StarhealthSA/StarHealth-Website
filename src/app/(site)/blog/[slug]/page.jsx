import IntroSection from '@/components/blog_detailpage/intro_section';
import BlogDetailBody from '@/components/blog_detailpage/blog_detail_body';
import AllEvents from '@/components/blogs/all_events';
import WhatNext from '@/components/what_next';
import { getPostBySlug, getRelatedPosts, getPosts } from '@/lib/sanity';

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const [post, relatedPosts, posts] = await Promise.all([
    getPostBySlug(slug),
    getRelatedPosts(slug),
    getPosts(),
  ]);

  return (
    <>
      <IntroSection post={post} />
      <BlogDetailBody post={post} relatedPosts={relatedPosts} />
      <AllEvents posts={posts} showButton />
      <WhatNext />
    </>
  );
}
