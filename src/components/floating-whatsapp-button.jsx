'use client';

import { useTranslation } from 'react-i18next';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import whatsappIcon from '@/assets/home/whatsapp.svg';

export default function FloatingWhatsAppButton() {
  const { t } = useTranslation();
  const label = t('floatingWhatsApp.label');
  const href = buildWhatsAppUrl(t('floatingWhatsApp.message'));

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="floating-whatsapp-button"
      aria-label={label}
      title={label}
    >
      <img src={whatsappIcon} alt="" className="floating-whatsapp-button__icon" />
      <span className="sr-only">{label}</span>
    </a>
  );
}
