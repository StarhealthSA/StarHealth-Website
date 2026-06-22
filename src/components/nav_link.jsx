'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isNavLinkActive } from '@/constants/nav_routes';

export default function NavLink({
  href,
  className = '',
  activeClassName = '',
  children,
  onClick,
}) {
  const pathname = usePathname();
  const isActive = isNavLinkActive(href, pathname);

  return (
    <Link
      href={href}
      prefetch
      className={`${className} ${isActive ? activeClassName : ''}`.trim()}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </Link>
  );
}
