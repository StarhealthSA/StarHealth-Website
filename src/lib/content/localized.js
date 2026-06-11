export function getLocalizedText(field, language = 'en') {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[language] || field.en || '';
}
