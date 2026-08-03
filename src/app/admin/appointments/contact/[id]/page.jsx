'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

/** Redirect legacy contact detail URLs to the dedicated Contact Form section. */
export default function LegacyContactEnquiryRedirect() {
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    router.replace(`/admin/contact/${id}`);
  }, [id, router]);

  return null;
}
