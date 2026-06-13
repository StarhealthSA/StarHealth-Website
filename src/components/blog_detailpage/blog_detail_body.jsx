'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { toPublicBlogPost } from '@/lib/content/blog-public';
import BlogMeta from '@/components/blogs/blog_meta';

function BlogDetailBody({ blog, relatedBlogs = [] }) {
  const { t, i18n } = useTranslation();
  const post = toPublicBlogPost(blog, i18n.language);
  const relatedPosts = relatedBlogs
    .map((item) => toPublicBlogPost(item, i18n.language))
    .filter(Boolean);

  if (!post) {
    return (
      <div className="px-[30px] lg:px-[120px] py-10 text-[#687276] font-inter">
        {t('blogs.notFound', { defaultValue: 'Post not found.' })}
      </div>
    );
  }

  return (
    <div className="bg-[#FFFFFF] flex flex-col lg:flex-row items-start px-[30px] lg:px-[120px] lg:gap-12 py-8">
      <article className="flex flex-col w-full lg:w-[80%] blog-content">
        <BlogMeta post={post} variant="detail" className="mb-6 border-b border-[#eef4f2] pb-4 lg:hidden" />
        {post.body ? (
          <div
            className="space-y-4 text-[14px] lg:text-[18px] text-[#687276] font-inter [&_h1]:text-[#002333] [&_h1]:text-[28px] [&_h1]:lg:text-[40px] [&_h1]:font-semibold [&_h2]:text-[#002333] [&_h2]:text-[22px] [&_h2]:lg:text-[32px] [&_h2]:font-semibold [&_h3]:text-[#002333] [&_h3]:text-[18px] [&_h3]:lg:text-[24px] [&_h3]:font-semibold [&_ul]:list-disc [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:ml-5 [&_a]:text-[#027B76] [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />
        ) : (
          <p className="text-[#687276]">{post.excerpt}</p>
        )}
      </article>

      {relatedPosts.length > 0 && (
        <aside className="hidden lg:flex flex-col items-start w-[20%]">
          <h2 className="text-[24px] text-[#002333] font-semibold font-inter mb-6 mt-6">
            {t('blogs.related', { defaultValue: 'You May Also Like' })}
          </h2>
          {relatedPosts.map((related) => (
            <Link
              key={related.id}
              href={`/blog/${related.slug}`}
              className="flex flex-col items-start gap-3 mb-4 hover:opacity-90 transition-opacity"
            >
              <div className="relative flex-shrink-0 w-full">
                {related.imageUrl ? (
                  <img
                    src={related.imageUrl}
                    alt={related.title}
                    className="w-full object-cover rounded-[8px]"
                  />
                ) : (
                  <div className="flex h-28 w-full items-center justify-center rounded-[8px] bg-[#eef4f2]">
                    <span className="px-2 text-center text-xs text-[#687276]">{related.title}</span>
                  </div>
                )}
                {related.category && (
                  <div className="absolute bottom-2 right-2 bg-[#027B76] rounded-[100px] py-1 px-4">
                    <p className="text-[12px] lg:text-[14px] text-[#FFFFFF] font-inter font-medium">
                      {related.category}
                    </p>
                  </div>
                )}
              </div>
              <h3 className="text-[#002333] font-semibold font-inter text-[16px] mb-2 hover:text-[#027B76] transition-colors">
                {related.title}
              </h3>
              <BlogMeta post={related} variant="compact" />
            </Link>
          ))}
        </aside>
      )}
    </div>
  );
}

export default BlogDetailBody;
