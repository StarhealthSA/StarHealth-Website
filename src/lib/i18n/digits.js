const ARABIC_INDIC = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

/** Convert Western digits in a string to Arabic-Indic when language is Arabic. */
export function toLocaleDigits(value, language = 'en') {
  const text = String(value ?? '');
  if (!language?.startsWith('ar')) return text;
  return text.replace(/\d/g, (digit) => ARABIC_INDIC[Number(digit)]);
}

export function pad2Locale(value, language = 'en') {
  return toLocaleDigits(String(value).padStart(2, '0'), language);
}
