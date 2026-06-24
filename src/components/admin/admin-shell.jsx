'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import logo from '@/assets/doctors/logo1.svg';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { adminFetch } from '@/lib/admin-api';
import AdminPageLoader from '@/components/admin/admin-page-loader';
import { ROLE_LABELS } from '@/lib/firebase/roles';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/appointments', label: 'Bookings', badgeKey: 'bookings' },
  { href: '/admin/specializations', label: 'Specializations' },
  { href: '/admin/service-categories', label: 'Service Categories' },
  { href: '/admin/doctors', label: 'Doctors' },
  { href: '/admin/services', label: 'Services' },
  { href: '/admin/blogs', label: 'Blogs' },
  { href: '/admin/homepage', label: 'Homepage' },
  { href: '/admin/users', label: 'Users', requiresUserManagement: true },
];

function isNavActive(pathname, item) {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, loading, logout, configured, getIdToken, canManageUsers } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadBookings, setUnreadBookings] = useState(0);
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (loading || isLoginPage) return;
    if (!configured) return;
    if (!user) {
      router.replace('/admin/login');
    }
  }, [loading, user, configured, isLoginPage, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!user || isLoginPage) return undefined;

    let cancelled = false;

    async function loadUnread() {
      try {
        const token = await getIdToken();
        const data = await adminFetch('/api/admin/appointments/unread-count', { token });
        if (!cancelled) setUnreadBookings(data.count || 0);
      } catch {
        if (!cancelled) setUnreadBookings(0);
      }
    }

    loadUnread();
    const interval = setInterval(loadUnread, 30000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [user, isLoginPage, getIdToken, pathname]);

  if (isLoginPage) {
    return <div className="min-h-screen bg-[#f4f8f7]">{children}</div>;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f8f7] px-6">
        <AdminPageLoader
          label="Loading admin panel..."
          description="Checking your session and permissions."
          className="w-full max-w-md border-none bg-transparent"
        />
      </div>
    );
  }

  if (!configured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f8f7] px-6">
        <div className="max-w-lg rounded-2xl border border-[#d7e6e2] bg-white p-8 text-center">
          <h1 className="text-2xl font-semibold text-[#002f3b]">Firebase not configured</h1>
          <p className="mt-3 text-[#586971]">
            Add your Firebase environment variables to enable the admin panel. See `.env.example` for details.
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const sidebar = (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-[#d7e6e2] bg-white">
      <div className="border-b border-[#eef4f2] px-5 py-5">
        <Link href="/admin" className="inline-block">
          <img src={logo} alt="Star Health" className="h-8 w-auto lg:h-9" />
        </Link>
        <p className="mt-2 text-xs text-[#586971]">Admin panel</p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.filter((item) => !item.requiresUserManagement || canManageUsers).map((item) => {
          const active = isNavActive(pathname, item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-[#037B76] text-white'
                  : 'text-[#586971] hover:bg-[#f0f6f4] hover:text-[#002f3b]'
              }`}
            >
              <span>{item.label}</span>
              {item.badgeKey === 'bookings' && unreadBookings > 0 && (
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  active ? 'bg-white text-[#037B76]' : 'bg-amber-100 text-amber-800'
                }`}
                >
                  {unreadBookings}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#eef4f2] px-4 py-4">
        <p className="truncate text-sm font-medium text-[#002f3b]">{user.email}</p>
        <p className="mt-0.5 text-xs text-[#586971]">{ROLE_LABELS[role] || role}</p>
        <button
          type="button"
          onClick={logout}
          className="mt-4 w-full rounded-lg border border-[#037B76] px-4 py-2 text-sm font-medium text-[#037B76] transition-colors hover:bg-[#037B76] hover:text-white"
        >
          Log out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#f4f8f7]">
      <div className="flex min-h-screen">
        <div className="hidden lg:block">{sidebar}</div>

        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div
          className={`fixed inset-y-0 left-0 z-50 transition-transform duration-200 lg:hidden ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {sidebar}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-[#d7e6e2] bg-white px-4 py-3 lg:hidden">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg border border-[#d7e6e2] px-3 py-2 text-sm font-medium text-[#586971]"
              aria-label="Open menu"
            >
              Menu
            </button>
            <img src={logo} alt="Star Health" className="h-7 w-[88px] object-contain object-left" />
            <div className="flex items-center gap-3">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-[#037B76]"
              >
                View site
              </a>
              <button
                type="button"
                onClick={logout}
                className="text-sm font-medium text-[#037B76]"
              >
                Log out
              </button>
            </div>
          </header>

          <header className="hidden items-center justify-end border-b border-[#d7e6e2] bg-white px-6 py-3 lg:flex">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-[#037B76] px-4 py-2 text-sm font-medium text-[#037B76] transition-colors hover:bg-[#037B76] hover:text-white"
            >
              View Website
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path
                  d="M11 3h6v6M17 3 9 11M8 5H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-3"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
