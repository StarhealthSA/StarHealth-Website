'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { adminFetch } from '@/lib/admin-api';
import AdminPageLoader from '@/components/admin/admin-page-loader';
import AdminPagination, { usePagination } from '@/components/admin/admin-pagination';
import { AdminActionButton, AdminActionGroup, AdminActionLink } from '@/components/admin/admin-action-button';
import InsuranceHeroSettingsForm from '@/components/admin/insurance/insurance-hero-settings-form';
import notify from '@/lib/ui/notify';

export default function AdminInsurancePage() {
  const { getIdToken, canWrite, canDeleteContent } = useAdminAuth();
  const [partners, setPartners] = useState([]);
  const [heroSettings, setHeroSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const loadPage = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getIdToken();
      const [partnersData, settingsData] = await Promise.all([
        adminFetch('/api/admin/insurance', { token }),
        adminFetch('/api/admin/site-settings/insurance', { token }),
      ]);
      setPartners(partnersData);
      setHeroSettings(settingsData);
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

  const filteredPartners = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return partners;
    return partners.filter((partner) => {
      const nameEn = partner.name?.en?.toLowerCase() || '';
      const nameAr = partner.name?.ar?.toLowerCase() || '';
      const slug = partner.slug?.toLowerCase() || '';
      return nameEn.includes(query) || nameAr.includes(query) || slug.includes(query);
    });
  }, [partners, search]);

  const {
    page,
    setPage,
    totalPages,
    paginatedItems,
    totalItems,
    pageSize,
  } = usePagination(filteredPartners, undefined, search);

  const handleDelete = async (partnerId) => {
    const confirmed = await notify.confirm({
      title: 'Delete insurance partner?',
      text: 'This partner will be permanently removed from the listing.',
      confirmText: 'Delete',
      danger: true,
    });
    if (!confirmed) return;
    try {
      const token = await getIdToken();
      await adminFetch(`/api/admin/insurance/${partnerId}`, { method: 'DELETE', token });
      const data = await adminFetch('/api/admin/insurance', { token });
      setPartners(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-[#002f3b]">Insurance Partners</h1>
          <p className="mt-1 text-sm text-[#586971]">
            Manage insurers shown on the public insurance listing page.
          </p>
        </div>
        {canWrite && (
          <Link
            href="/admin/insurance/new"
            className="rounded-lg bg-[#037B76] px-4 py-2 text-sm font-medium text-white"
          >
            Add partner
          </Link>
        )}
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {loading ? (
        <div className="mt-8">
          <AdminPageLoader
            label="Loading insurance settings..."
            description="Fetching hero copy and partner list."
          />
        </div>
      ) : (
        <>
          {heroSettings && <InsuranceHeroSettingsForm initial={heroSettings} />}

          <div className="mt-8 max-w-md">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or slug..."
              className="w-full rounded-lg border border-[#d7e6e2] px-3 py-2 text-sm"
            />
          </div>

          <div className="mt-6 overflow-x-auto rounded-2xl border border-[#d7e6e2] bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-[#d7e6e2] bg-[#f8fbfa]">
                <tr>
                  <th className="px-4 py-3 font-medium text-[#586971]">Logo</th>
                  <th className="px-4 py-3 font-medium text-[#586971]">Name</th>
                  <th className="px-4 py-3 font-medium text-[#586971]">Order</th>
                  <th className="px-4 py-3 font-medium text-[#586971]">Status</th>
                  <th className="px-4 py-3 font-medium text-[#586971]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-[#586971]">
                      No insurance partners found.
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((partner) => (
                    <tr key={partner.id} className="border-b border-[#eef4f2]">
                      <td className="px-4 py-3">
                        {partner.logoUrl ? (
                          <img
                            src={partner.logoUrl}
                            alt=""
                            className="h-10 w-16 object-contain"
                          />
                        ) : (
                          <span className="text-xs text-[#8a9aa1]">No logo</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-[#002f3b]">
                        {partner.name?.en || partner.slug}
                        {partner.featured ? (
                          <span className="ml-2 rounded-full bg-[#e8f5f2] px-2 py-0.5 text-[10px] font-semibold uppercase text-[#037B76]">
                            Featured
                          </span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-[#586971]">{partner.order}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            partner.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {partner.status === 'active' ? 'Active' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <AdminActionGroup>
                          <AdminActionLink href={`/admin/insurance/${partner.id}`} action="edit" />
                          <AdminActionLink href="/insurance" action="view" label="Public page" />
                          {canDeleteContent && (
                            <AdminActionButton
                              action="delete"
                              onClick={() => handleDelete(partner.id)}
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
