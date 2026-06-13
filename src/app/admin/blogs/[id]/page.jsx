'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import BlogFormShell from '@/components/admin/blogs/blog-form-shell';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { adminFetch } from '@/lib/admin-api';
import { createEmptyBlog } from '@/lib/content/blog-defaults';

export default function AdminBlogEditPage() {
  const { id } = useParams();
  const isNew = id === 'new';
  const { getIdToken } = useAdminAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      if (isNew) {
        setBlog(createEmptyBlog());
        setError('');
        setLoading(false);
        return;
      }

      const token = await getIdToken();
      const data = await adminFetch(`/api/admin/blogs/${id}`, { token });
      setBlog(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getIdToken, id, isNew]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return <p className="text-[#586971]">Loading...</p>;
  }

  if (error && !blog) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold text-[#002f3b]">
        {isNew ? 'Add blog' : 'Edit blog'}
      </h1>
      <p className="mt-1 mb-6 text-sm text-[#586971]">
        Manage blog content, media, and SEO settings.
      </p>
      <BlogFormShell initial={isNew ? null : blog} />
    </div>
  );
}
