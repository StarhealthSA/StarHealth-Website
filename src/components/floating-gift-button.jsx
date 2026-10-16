'use client';

import Link from 'next/link';
import { Gift } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GIVEAWAY } from '@/lib/giveaway/config';

export default function FloatingGiftButton() {
  const { t } = useTranslation();

  if (!GIVEAWAY.enabled) return null;

  const label = t('floatingGift.label');

  return (
    <Link
      href={GIVEAWAY.path}
      prefetch
      className="floating-gift-button"
      aria-label={label}
      title={label}
    >
      <span className="floating-gift-button__ring" aria-hidden />
      <span className="floating-gift-button__ring floating-gift-button__ring--delay" aria-hidden />
      <span className="floating-gift-button__badge" aria-hidden>
        {t('floatingGift.badge')}
      </span>
      <Gift className="floating-gift-button__icon" aria-hidden />
      <span className="sr-only">{label}</span>
    </Link>
  );
}
