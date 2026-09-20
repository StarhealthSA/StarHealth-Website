'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { adminFetch } from '@/lib/admin-api';
import AdminPageLoader from '@/components/admin/admin-page-loader';
import AdminPagination, { usePagination } from '@/components/admin/admin-pagination';
import { AdminActionButton, AdminActionGroup, AdminActionLink } from '@/components/admin/admin-action-button';
import notify from '@/lib/ui/notify';
import OurWorkHomepageSettingsForm from '@/components/admin/portfolio/our-work-homepage-settings-form';
import {
  PORTFOLIO_CATEGORIES,
  getPortfolioCategoryLabel,
  getPortfolioServicePath,
} from '@/lib/content/portfolio-categories';

export default function AdminPortfolioPage() {
  const { getIdToken, canWrite, canDeleteContent } = useAdminAuth();
  const [entries, setEntries] = useState([]);
  const [homepageSettings, setHomepageSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const loadPage = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getIdToken();
      const [entriesData, settingsData] = await Promise.all([
        adminFetch('/api/admin/portfolio', { token }),
        adminFetch('/api/admin/site-settings/our-work', { token }),
      ]);
      setEntries(entriesData);
      setHomepageSettings(settingsData);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getIdToken]);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  const filteredEntries = useMemo(() => {
    const query = search.trim().toLowerCase();
    return entries.filter((entry) => {
      if (categoryFilter !== 'all' && entry.category !== categoryFilter) return false;
      if (!query) return true;
      const titleEn = entry.title?.en?.toLowerCase() || '';
      const titleAr = entry.title?.ar?.toLowerCase() || '';
      const serviceEn = entry.serviceName?.en?.toLowerCase() || '';
      const slug = entry.slug?.toLowerCase() || '';
      const category = entry.category?.toLowerCase() || '';
      return (
        titleEn.includes(query)
        || titleAr.includes(query)
        || serviceEn.includes(query)
        || slug.includes(query)
        || category.includes(query)
      );
    });
  }, [entries, search, categoryFilter]);

  const {
    page,
    setPage,
    totalPages,
    paginatedItems,
    totalItems,
    pageSize,
  } = usePagination(filteredEntries, undefined, `${search}:${categoryFilter}`);

  const handleDelete = async (entryId) => {
    const confirmed = await notify.confirm({
      title: 'Delete portfolio case?',
      text: 'This case will be permanently removed.',
      confirmText: 'Delete',
      danger: true,
    });
    if (!confirmed) return;
    try {
      const token = await getIdToken();
      await adminFetch(`/api/admin/portfolio/${entryId}`, { method: 'DELETE', token });
      await loadPage();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-[#002f3b]">Our Work Portfolio</h1>
          <p className="mt-1 text-sm text-[#586971]">
            Edit homepage section copy, then publish Dental and Dermatology cases for the slider and service pages.
          </p>
        </div>
        {canWrite && (
          <Link
            href="/admin/portfolio/new"
            className="rounded-lg bg-[#037B76] px-4 py-2 text-sm font-medium text-white"
          >
            Add case
          </Link>
        )}
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {loading ? (
        <div className="mt-8">
          <AdminPageLoader
            label="Loading portfolio..."
            description="Fetching homepage copy and portfolio cases."
          />
        </div>
      ) : (
        <>
          {homepageSettings && (
            <OurWorkHomepageSettingsForm initial={homepageSettings} />
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, service, or category..."
              className="w-full max-w-md rounded-lg border border-[#d7e6e2] px-3 py-2 text-sm"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-[#d7e6e2] px-3 py-2 text-sm"
            >
              <option value="all">All categories</option>
              {PORTFOLIO_CATEGORIES.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label.en}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6 overflow-x-auto rounded-2xl border border-[#d7e6e2] bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-[#d7e6e2] bg-[#f8fbfa]">
                <tr>
                  <th className="px-4 py-3 font-medium text-[#586971]">Case</th>
                  <th className="px-4 py-3 font-medium text-[#586971]">Category</th>
                  <th className="px-4 py-3 font-medium text-[#586971]">Media</th>
                  <th className="px-4 py-3 font-medium text-[#586971]">Order</th>
                  <th className="px-4 py-3 font-medium text-[#586971]">Status</th>
                  <th className="px-4 py-3 font-medium text-[#586971]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-[#586971]">
                      No portfolio cases found.
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((entry) => (
                    <tr key={entry.id} className="border-b border-[#eef4f2]">
                      <td className="px-4 py-3 font-medium text-[#002f3b]">
                        {entry.title?.en || entry.slug}
                        {entry.featured ? (
                          <span className="ml-2 rounded-full bg-[#e8f5f2] px-2 py-0.5 text-[10px] font-semibold uppercase text-[#037B76]">
                            Homepage
                          </span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-[#586971]">
                        {getPortfolioCategoryLabel(entry.category, 'en') || entry.category}
                      </td>
                      <td className="px-4 py-3 text-[#586971]">
                        {entry.mediaType === 'video' ? 'Video' : 'Image'}
                        {entry.beforeImageUrl && entry.afterImageUrl ? ' · Before/After' : ''}
                      </td>
                      <td className="px-4 py-3 text-[#586971]">{entry.order ?? 0}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            entry.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {entry.status === 'active' ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <AdminActionGroup>
                          <AdminActionLink href={`/admin/portfolio/${entry.id}`} action="edit" />
                      <AdminActionLink
                        href={getPortfolioServicePath({
                          serviceSlug: entry.serviceSlug || entry.serviceId,
                          categoryId: entry.category,
                        })}
                        action="view"
                        label="Service page"
                      />
                          {canDeleteContent && (
                            <AdminActionButton
                              action="delete"
                              onClick={() => handleDelete(entry.id)}
                            />
                          )}
                        </AdminActionGroup>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <AdminPagination
            page={page}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
