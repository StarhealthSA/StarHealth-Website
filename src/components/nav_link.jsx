'use client';

import Link from 'next/link';

export default function NavLink({ href, className, children, onClick }) {
  return (
    <Link href={href} prefetch className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
