import { adminFetch } from './admin-api';
import {
  applyArabicTranslations,
  collectEnglishTexts,
} from './translate/localized-fields';

export async function translateTexts(texts, token) {
  const payload = texts.map((text) => String(text || ''));
  const data = await adminFetch('/api/admin/translate', {
    method: 'POST',
    body: { texts: payload },
    token,
  });
  return data.translations;
}

export async function translateSingleText(text, token) {
  const [translation] = await translateTexts([text], token);
  return translation || '';
}

export async function translateFormToArabic(form, token) {
  const entries = collectEnglishTexts(form);
  if (!entries.length) {
    throw new Error('No English content found to translate.');
  }

  const translations = await translateTexts(
    entries.map((entry) => entry.text),
    token
  );

  const mapped = entries.map((entry, index) => ({
    path: entry.path,
    translation: translations[index],
  }));

  return applyArabicTranslations(form, mapped);
}
