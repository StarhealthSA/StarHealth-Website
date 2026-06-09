'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PREFETCH_ROUTES } from '@/constants/nav_routes';

export default function RoutePrefetcher() {
  const router = useRouter();

  useEffect(() => {
    PREFETCH_ROUTES.forEach((route) => {
      router.prefetch(route);
    });
  }, [router]);

  return null;
}
