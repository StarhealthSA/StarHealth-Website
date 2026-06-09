import BlogsSection from '@/components/blogs/blogs_Section';
import { getPosts } from '@/lib/sanity';

export default async function BlogsPage() {
  const posts = await getPosts();

  return <BlogsSection posts={posts} />;
}
