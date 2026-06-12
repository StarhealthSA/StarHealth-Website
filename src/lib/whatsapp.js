const DEFAULT_WHATSAPP_NUMBER = '966505730003';

export function getWhatsAppNumber() {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_NUMBER;
  return raw.replace(/\D/g, '');
}

export function buildWhatsAppUrl(message = '') {
  const number = getWhatsAppNumber();
  const text = encodeURIComponent(message);
  return `https://wa.me/${number}${text ? `?text=${text}` : ''}`;
}
