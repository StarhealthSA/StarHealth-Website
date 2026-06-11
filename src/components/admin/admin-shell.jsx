'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import logo from '@/assets/doctors/logo1.svg';
import { useAdminAuth } from '@/contexts/admin-auth-context';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/specializations', label: 'Specializations' },
  { href: '/admin/service-categories', label: 'Service Categories' },
  { href: '/admin/doctors', label: 'Doctors' },
  { href: '/admin/services', label: 'Services' },
];

function isNavActive(pathname, item) {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, loading, logout, configured } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  if (isLoginPage) {
    return <div className="min-h-screen bg-[#f4f8f7]">{children}</div>;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f8f7]">
        <p className="text-[#586971]">Loading admin panel...</p>
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
        {NAV_ITEMS.map((item) => {
          const active = isNavActive(pathname, item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-[#037B76] text-white'
                  : 'text-[#586971] hover:bg-[#f0f6f4] hover:text-[#002f3b]'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#eef4f2] px-4 py-4">
        <p className="truncate text-sm font-medium text-[#002f3b]">{user.email}</p>
        <p className="mt-0.5 text-xs capitalize text-[#586971]">{role}</p>
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
            <button
              type="button"
              onClick={logout}
              className="text-sm font-medium text-[#037B76]"
            >
              Log out
            </button>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
