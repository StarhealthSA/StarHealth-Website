'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { adminFetch } from '@/lib/admin-api';
import AdminPageLoader from '@/components/admin/admin-page-loader';

export default function AdminBlogsPage() {
  const { getIdToken, canWrite, canDeleteContent } = useAdminAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const loadBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getIdToken();
      const data = await adminFetch('/api/admin/blogs', { token });
      setBlogs(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getIdToken]);

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  const filteredBlogs = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return blogs;
    return blogs.filter((blog) => {
      const titleEn = blog.title?.en?.toLowerCase() || '';
      const titleAr = blog.title?.ar?.toLowerCase() || '';
      const slug = blog.slug?.toLowerCase() || '';
      return titleEn.includes(query) || titleAr.includes(query) || slug.includes(query);
    });
  }, [blogs, search]);

  const handleDelete = async (blogId) => {
    if (!window.confirm('Delete this blog post?')) return;
    try {
      const token = await getIdToken();
      await adminFetch(`/api/admin/blogs/${blogId}`, { method: 'DELETE', token });
      await loadBlogs();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-[#002f3b]">Blogs</h1>
          <p className="mt-1 text-sm text-[#586971]">Manage SEO blog posts for the public site.</p>
        </div>
        {canWrite && (
          <Link
            href="/admin/blogs/new"
            className="rounded-lg bg-[#037B76] px-4 py-2 text-sm font-medium text-white"
          >
            Add blog
          </Link>
        )}
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <div className="mt-6 max-w-md">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or slug..."
          className="w-full rounded-lg border border-[#d7e6e2] px-3 py-2 text-sm"
        />
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-[#d7e6e2] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[#d7e6e2] bg-[#f8fbfa]">
            <tr>
              <th className="px-4 py-3 font-medium text-[#586971]">Title</th>
              <th className="px-4 py-3 font-medium text-[#586971]">Category</th>
              <th className="px-4 py-3 font-medium text-[#586971]">Status</th>
              <th className="px-4 py-3 font-medium text-[#586971]">Published</th>
              <th className="px-4 py-3 font-medium text-[#586971]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5}>
                  <AdminPageLoader
                    variant="table"
                    label="Loading blog posts..."
                    description="Fetching blog content from the database."
                  />
                </td>
              </tr>
            ) : filteredBlogs.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-6 text-[#586971]">No blog posts yet.</td></tr>
            ) : (
              filteredBlogs.map((blog) => (
                <tr key={blog.id} className="border-b border-[#eef4f2]">
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#002f3b]">{blog.title?.en || blog.slug}</p>
                    <p className="text-xs text-[#586971]">/{blog.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-[#586971]">{blog.category?.en || '—'}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        blog.status === 'active'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {blog.status === 'active' ? 'Published' : 'Draft'}
                    </span>
                    {blog.featured && (
                      <span className="ml-1 rounded-full bg-[#e6f4f2] px-2 py-1 text-xs text-[#037B76]">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[#586971]">
                    {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link href={`/admin/blogs/${blog.id}`} className="text-[#037B76] hover:underline">
                        Edit
                      </Link>
                      {blog.status === 'active' && (
                        <a
                          href={`/blog/${blog.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#586971] hover:underline"
                        >
                          View
                        </a>
                      )}
                      {canDeleteContent && (
                        <button
                          type="button"
                          onClick={() => handleDelete(blog.id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
