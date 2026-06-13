import AllEvents from '@/components/blogs/all_events';
import ExpertAdvice from '@/components/blogs/expert_advice';
import WhatNext from '@/components/what_next';
import { getPublishedBlogs } from '@/lib/content/blogs';

export const revalidate = 60;

export const metadata = {
  title: 'Blog | Star Health',
  description:
    'Expert health advice, clinic updates, and wellness insights from Star Health medical centre in Riyadh.',
  openGraph: {
    title: 'Blog | Star Health',
    description:
      'Expert health advice, clinic updates, and wellness insights from Star Health medical centre in Riyadh.',
    url: 'https://starhealth.sa/blogs',
    type: 'website',
    images: ['https://starhealth.sa/socialimage.png'],
  },
  alternates: {
    canonical: 'https://starhealth.sa/blogs',
  },
};

export default async function BlogsPage() {
  const blogs = await getPublishedBlogs();

  return (
    <div>
      <ExpertAdvice blogs={blogs} />
      <AllEvents blogs={blogs} />
      <WhatNext />
    </div>
  );
}
