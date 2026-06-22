'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import Button from '../web_button';
import Reveal, { staggerDelay } from '../reveal';
import { toPublicBlogPost } from '@/lib/content/blog-public';
import BlogMeta from '@/components/blogs/blog_meta';

function AllEvents({ blogs = [], showButton = false, excludeSlug = '' }) {
  const { t, i18n } = useTranslation();
  const posts = blogs
    .map((blog) => toPublicBlogPost(blog, i18n.language))
    .filter(Boolean)
    .filter((post) => !excludeSlug || post.slug !== excludeSlug);

  if (!posts.length) return null;

  return (
    <div
      className={
        showButton
          ? 'px-[30px] pb-12 pt-8 lg:px-[120px] lg:pb-16 lg:pt-10'
          : 'px-[30px] py-[15px] lg:px-[120px] lg:py-[80px]'
      }
    >
      <Reveal>
        <h2 className="mb-6 text-lg font-semibold text-gray-800">
          {t('blogs.allPosts', { defaultValue: 'All Events & News' })}
        </h2>
      </Reveal>
      <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2 lg:grid-cols-4">
        {posts.map((post, index) => (
          <Reveal key={post.id} delay={staggerDelay(index, 70)}>
            <Link href={`/blog/${post.slug}`} className="block hover:opacity-90 transition-opacity">
              <div className="relative flex-shrink-0">
                {post.imageUrl ? (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full object-cover rounded-[8px]"
                  />
                ) : (
                  <div className="flex h-40 w-full items-center justify-center rounded-[8px] bg-[#eef4f2]">
                    <span className="px-3 text-center text-sm text-[#687276]">{post.title}</span>
                  </div>
                )}
                {post.category && (
                  <div className="absolute bottom-4 right-4 md:bottom-2 md:right-2 bg-[#027B76] rounded-[100px] py-1 px-4">
                    <p className="text-[12px] lg:text-[14px] text-[#FFFFFF] font-inter font-medium">
                      {post.category}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-start mt-2 lg:mt-6">
                <h3 className="text-[#002333] font-semibold font-inter text-[16px] lg:text-[20px] hover:text-[#027B76] transition-colors">
                  {post.title}
                </h3>
                <BlogMeta post={post} variant="compact" className="mt-2" />
              </div>
            </Link>
          </Reveal>
        ))}
      </div>

      {showButton && (
        <Reveal className="mt-8 flex flex-row justify-center">
          <Link href="/blogs">
            <Button text={t('blogs.viewAll', { defaultValue: 'View All' })} />
          </Link>
        </Reveal>
      )}
    </div>
  );
}

export default AllEvents;
