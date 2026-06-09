import AllEvents from '@/components/blogs/all_events';
import ExpertAdvice from '@/components/blogs/expert_advice';
import WhatNext from '@/components/what_next';
import { getPosts } from '@/lib/sanity';

export default async function BlogsPage() {
  const posts = await getPosts();

  return (
    <div>
      <ExpertAdvice posts={posts} />
      <AllEvents posts={posts} />
      <WhatNext />
    </div>
  );
}
