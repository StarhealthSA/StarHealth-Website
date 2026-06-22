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
    .filter(Boolean)
    .slice(0, 3);

  if (!post) {
    return (
      <div className="px-[30px] py-10 font-inter text-[#687276] lg:px-[120px]">
        {t('blogs.notFound', { defaultValue: 'Post not found.' })}
      </div>
    );
  }

  return (
    <div className="bg-[#FFFFFF] px-[30px] pb-8 pt-8 lg:px-[120px]">
      <article className="blog-content mx-auto w-full max-w-4xl">
        <BlogMeta post={post} variant="detail" className="mb-6 border-b border-[#eef4f2] pb-4 lg:hidden" />
        {post.body ? (
          <div
            className="space-y-4 font-inter text-[14px] text-[#687276] lg:text-[18px] [&_a]:text-[#027B76] [&_a]:underline [&_h1]:text-[28px] [&_h1]:font-semibold [&_h1]:text-[#002333] lg:[&_h1]:text-[40px] [&_h2]:text-[22px] [&_h2]:font-semibold [&_h2]:text-[#002333] lg:[&_h2]:text-[32px] [&_h3]:text-[18px] [&_h3]:font-semibold [&_h3]:text-[#002333] lg:[&_h3]:text-[24px] [&_ol]:ml-5 [&_ol]:list-decimal [&_ul]:ml-5 [&_ul]:list-disc"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />
        ) : (
          <p className="text-[#687276]">{post.excerpt}</p>
        )}
      </article>

      {relatedPosts.length > 0 && (
        <aside className="mx-auto mt-10 w-full max-w-6xl border-t border-[#eef4f2] pt-8">
          <h2 className="mb-5 font-inter text-[20px] font-semibold text-[#002333] lg:text-[24px]">
            {t('blogs.related', { defaultValue: 'You May Also Like' })}
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((related) => (
              <Link
                key={related.id}
                href={`/blog/${related.slug}`}
                className="group flex flex-col overflow-hidden rounded-[8px] border border-[#eef4f2] bg-white transition hover:border-[#d8e7e4] hover:shadow-sm"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  {related.imageUrl ? (
                    <img
                      src={related.imageUrl}
                      alt={related.title}
                      className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#eef4f2]">
                      <span className="px-2 text-center text-xs text-[#687276]">{related.title}</span>
                    </div>
                  )}
                  {related.category && (
                    <div className="absolute bottom-2 right-2 rounded-[100px] bg-[#027B76] px-3 py-1">
                      <p className="font-inter text-[12px] font-medium text-[#FFFFFF]">
                        {related.category}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="mb-2 line-clamp-2 font-inter text-[16px] font-semibold text-[#002333] transition group-hover:text-[#027B76]">
                    {related.title}
                  </h3>
                  <BlogMeta post={related} variant="compact" className="mt-auto" />
                </div>
              </Link>
            ))}
          </div>
        </aside>
      )}
    </div>
  );
}

export default BlogDetailBody;
