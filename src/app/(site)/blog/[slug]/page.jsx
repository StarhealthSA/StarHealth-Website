import BlogDetailPage from '@/components/blog_detailpage/blog_detailSection';
import { getPostBySlug, getRelatedPosts, getPosts } from '@/lib/sanity';

export default async function BlogDetailRoute({ params }) {
  const { slug } = await params;
  const [post, relatedPosts, posts] = await Promise.all([
    getPostBySlug(slug),
    getRelatedPosts(slug),
    getPosts(),
  ]);

  return <BlogDetailPage post={post} relatedPosts={relatedPosts} posts={posts} />;
}
