'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import Reveal, { staggerDelay } from '../reveal';
import { toPublicBlogPost } from '@/lib/content/blog-public';
import BlogMeta from '@/components/blogs/blog_meta';

function ExpertAdvice({ blogs = [] }) {
  const { t, i18n } = useTranslation();
  const posts = blogs.map((blog) => toPublicBlogPost(blog, i18n.language)).filter(Boolean);

  if (!posts.length) return null;

  const featuredPost = posts.find((post) => post.featured) || posts[0];
  const sidePosts = posts.filter((post) => post.id !== featuredPost.id).slice(0, 4);

  return (
    <div className="flex flex-col items-center justify-start bg-[#FFFFFF] px-[30px] pt-6 md:pt-0 lg:px-[120px]">
      <Reveal className="flex flex-col items-center">
        <h1 className="text-[24px] lg:text-[44px] text-[#002333] font-medium font-inter leading-[32px] lg:leading-[54px]">
          {t('blogs.title')}
        </h1>
        <p className="text-[14px] lg:text-[16px] text-[#687276] font-normal text-center w-full lg:w-3/5 leading-[22px] lg:leading-[24px] font-inter mt-4 sm:mt-[10px] mb-0 md:mb-0">
          {t('blogs.description')}
        </p>
      </Reveal>

      <div className="mt-6 flex flex-col items-start gap-8 md:justify-between lg:mt-10 lg:flex-row lg:gap-12">
        <Reveal className="flex w-full flex-col items-start lg:w-1/2">
          <Link href={`/blog/${featuredPost.slug}`} className="w-full">
            {featuredPost.imageUrl ? (
              <img
                src={featuredPost.imageUrl}
                alt={featuredPost.title}
                className="h-auto w-full mb-[8px] lg:mb-[12px] rounded-[8px] object-cover cursor-pointer hover:opacity-90 transition-opacity"
              />
            ) : (
              <div className="mb-[8px] flex h-56 w-full items-center justify-center rounded-[8px] bg-[#eef4f2] lg:mb-[12px]">
                <span className="text-sm text-[#687276]">{featuredPost.title}</span>
              </div>
            )}
          </Link>
          {featuredPost.category && (
            <div className="bg-[#027B76] rounded-[100px] py-1 px-5 mb-[8px] lg:mb-[12px]">
              <p className="text-[14px] lg:text-[16px] text-[#FFFFFF] font-inter font-medium">
                {featuredPost.category}
              </p>
            </div>
          )}
          <Link href={`/blog/${featuredPost.slug}`}>
            <h2 className="text-[#002333] font-semibold font-inter text-[18px] lg:text-[24px] mb-[8px] lg:mb-[12px] hover:text-[#027B76] transition-colors">
              {featuredPost.title}
            </h2>
          </Link>
          <p className="text-[14px] lg:text-[16px] text-[#687276] font-inter mb-[8px] lg:mb-[12px]">
            {featuredPost.excerpt}
          </p>
          <BlogMeta post={featuredPost} variant="compact" className="mb-[8px] lg:mb-[12px]" />
          <Link href={`/blog/${featuredPost.slug}`}>
            <p className="text-[14px] lg:text-[16px] text-[#687276] font-inter decoration-solid underline cursor-pointer hover:text-[#027B76]">
              {t('blogs.readMore', { defaultValue: 'Read more' })}
            </p>
          </Link>
        </Reveal>

        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:w-1/2 lg:grid-cols-1">
          {sidePosts.map((post, index) => (
            <Reveal key={post.id} delay={staggerDelay(index)}>
              <Link href={`/blog/${post.slug}`} className="flex flex-col items-start gap-3 hover:opacity-90 transition-opacity lg:flex-row">
                <div className="relative flex-shrink-0 w-full lg:w-[230px]">
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full object-cover rounded-[8px]"
                    />
                  ) : (
                    <div className="flex h-36 w-full items-center justify-center rounded-[8px] bg-[#eef4f2]">
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
                <div className="flex flex-col items-start">
                  <h3 className="text-[#002333] font-semibold font-inter text-[16px] lg:text-[20px] mb-1 hover:text-[#027B76] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-[14px] lg:text-[16px] text-[#687276] font-inter leading-[20px] line-clamp-2">
                    {post.excerpt}
                  </p>
                  <BlogMeta post={post} variant="compact" className="mt-2" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ExpertAdvice;
