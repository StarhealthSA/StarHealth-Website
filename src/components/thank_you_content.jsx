'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Reveal from '@/components/reveal';
import { trackAppointmentBooked } from '@/lib/analytics/track-appointment-booked';
import {
  clearThankYouAccess,
  hasThankYouAccess,
} from '@/lib/booking/thank-you-access';

export default function ThankYouContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!hasThankYouAccess()) {
      router.replace('/');
      return;
    }

    setAllowed(true);
    // Backup if the event was not pushed before navigation (SPA edge cases).
    trackAppointmentBooked();
  }, [router]);

  if (!allowed) {
    return null;
  }

  return (
    <section className="bg-gradient-to-b from-[#E8F5F2] via-[#F3FAF8] to-[#FAFAF9] px-5 py-16 md:px-12 md:py-24 lg:px-[100px]">
      <Reveal>
        <div className="mx-auto max-w-2xl rounded-3xl border border-[#d7e6e2] bg-white px-6 py-12 text-center shadow-[0_20px_60px_rgba(3,123,118,0.08)] md:px-12 md:py-16">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#037B76] text-3xl text-white">
            ✓
          </div>
          <p className="mt-6 font-inter text-xs font-semibold uppercase tracking-[0.2em] text-[#037B76]">
            {t('thankYou.eyebrow')}
          </p>
          <h1 className="mt-3 font-inter text-3xl font-semibold leading-tight text-[#002333] md:text-4xl">
            {t('thankYou.title')}
          </h1>
          <p className="mx-auto mt-4 max-w-lg font-inter text-base leading-relaxed text-[#586971] md:text-lg">
            {t('thankYou.description')}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              onClick={clearThankYouAccess}
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-tl from-[#037B76] to-[#AED5C6] px-6 py-3 font-inter text-sm font-medium text-white transition hover:opacity-95"
            >
              {t('thankYou.backHome')}
            </Link>
            <Link
              href="/contact"
              onClick={clearThankYouAccess}
              className="inline-flex items-center justify-center rounded-xl border border-[#037B76] px-6 py-3 font-inter text-sm font-medium text-[#037B76] transition hover:bg-[#f3faf8]"
            >
              {t('thankYou.contactUs')}
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
