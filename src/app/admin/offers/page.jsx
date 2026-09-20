'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { adminFetch } from '@/lib/admin-api';
import AdminPageLoader from '@/components/admin/admin-page-loader';
import AdminPagination, { usePagination } from '@/components/admin/admin-pagination';
import { AdminActionButton, AdminActionGroup, AdminActionLink } from '@/components/admin/admin-action-button';
import notify from '@/lib/ui/notify';
import { isOfferCurrentlyValid } from '@/lib/content/normalize-offer';

export default function AdminOffersPage() {
  const { getIdToken, canWrite, canDeleteContent } = useAdminAuth();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const loadOffers = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getIdToken();
      const data = await adminFetch('/api/admin/offers', { token });
      setOffers(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getIdToken]);

  useEffect(() => {
    loadOffers();
  }, [loadOffers]);

  const filteredOffers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return offers;
    return offers.filter((offer) => {
      const nameEn = offer.name?.en?.toLowerCase() || '';
      const nameAr = offer.name?.ar?.toLowerCase() || '';
      const treatmentEn = offer.treatment?.en?.toLowerCase() || '';
      const slug = offer.slug?.toLowerCase() || '';
      return (
        nameEn.includes(query)
        || nameAr.includes(query)
        || treatmentEn.includes(query)
        || slug.includes(query)
      );
    });
  }, [offers, search]);

  const {
    page,
    setPage,
    totalPages,
    paginatedItems,
    totalItems,
    pageSize,
  } = usePagination(filteredOffers, undefined, search);

  const handleDelete = async (offerId) => {
    const confirmed = await notify.confirm({
      title: 'Delete offer?',
      text: 'This offer will be permanently removed.',
      confirmText: 'Delete',
      danger: true,
    });
    if (!confirmed) return;
    try {
      const token = await getIdToken();
      await adminFetch(`/api/admin/offers/${offerId}`, { method: 'DELETE', token });
      await loadOffers();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-[#002f3b]">Offers</h1>
          <p className="mt-1 text-sm text-[#586971]">
            Create and manage promotional offers shown on the public offers page.
          </p>
        </div>
        {canWrite && (
          <Link
            href="/admin/offers/new"
            className="rounded-lg bg-[#037B76] px-4 py-2 text-sm font-medium text-white"
          >
            Add offer
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
          placeholder="Search by name, treatment, or slug..."
          className="w-full rounded-lg border border-[#d7e6e2] px-3 py-2 text-sm"
        />
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-[#d7e6e2] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[#d7e6e2] bg-[#f8fbfa]">
            <tr>
              <th className="px-4 py-3 font-medium text-[#586971]">Offer</th>
              <th className="px-4 py-3 font-medium text-[#586971]">Treatment</th>
              <th className="px-4 py-3 font-medium text-[#586971]">Price</th>
              <th className="px-4 py-3 font-medium text-[#586971]">Valid until</th>
              <th className="px-4 py-3 font-medium text-[#586971]">Status</th>
              <th className="px-4 py-3 font-medium text-[#586971]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6}>
                  <AdminPageLoader
                    variant="inline"
                    label="Loading offers..."
                    className="justify-start px-4 py-8"
                  />
                </td>
              </tr>
            ) : paginatedItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[#586971]">
                  No offers found.
                </td>
              </tr>
            ) : (
              paginatedItems.map((offer) => {
                const expired = offer.status === 'active' && !isOfferCurrentlyValid(offer);
                return (
                  <tr key={offer.id} className="border-b border-[#eef4f2]">
                    <td className="px-4 py-3 font-medium text-[#002f3b]">
                      {offer.name?.en || offer.slug}
                      {offer.featured ? (
                        <span className="ml-2 rounded-full bg-[#e8f5f2] px-2 py-0.5 text-[10px] font-semibold uppercase text-[#037B76]">
                          Featured
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-[#586971]">{offer.treatment?.en || '—'}</td>
                    <td className="px-4 py-3 text-[#586971]">
                      {offer.offerPrice ? (
                        <span>
                          <span className="font-medium text-[#002f3b]">
                            {offer.currency} {offer.offerPrice}
                          </span>
                          {offer.crossPrice ? (
                            <span className="ml-2 text-xs line-through opacity-60">
                              {offer.currency} {offer.crossPrice}
                            </span>
                          ) : null}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#586971]">{offer.validUntil || 'No end date'}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          offer.status === 'active'
                            ? expired
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {offer.status === 'active' ? (expired ? 'Expired' : 'Active') : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <AdminActionGroup>
                        <AdminActionLink href={`/admin/offers/${offer.id}`} action="edit" />
                        <AdminActionLink href="/offers" action="view" label="Public page" />
                        {canDeleteContent && (
                          <AdminActionButton
                            action="delete"
                            onClick={() => handleDelete(offer.id)}
                          />
                        )}
                      </AdminActionGroup>
                    </td>
                  </tr>
                );
              })
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
    </div>
  );
}
