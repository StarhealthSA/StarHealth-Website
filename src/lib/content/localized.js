export function getLocalizedText(field, language = 'en') {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[language] || field.en || '';
}

/** Returns a display string like "SAR 500", or empty if no amount is set. */
export function formatSarPrice(amount) {
  if (amount === null || amount === undefined) return '';
  const raw = String(amount).trim();
  if (!raw) return '';
  const match = raw.replace(/,/g, '').match(/(\d+(?:\.\d+)?)/);
  if (!match) return '';
  return `SAR ${match[1]}`;
}
