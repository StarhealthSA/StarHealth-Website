const TARGET_LANGUAGE = 'ar';

async function translateWithGoogle(texts, apiKey) {
  const response = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: texts,
        source: 'en',
        target: TARGET_LANGUAGE,
        format: 'text',
      }),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Google Translate request failed');
  }

  return data.data.translations.map((item) => item.translatedText);
}

async function translateWithMyMemory(text) {
  const url = new URL('https://api.mymemory.translated.net/get');
  url.searchParams.set('q', text);
  url.searchParams.set('langpair', 'en|ar');

  const response = await fetch(url.toString());
  const data = await response.json();

  if (data.responseStatus !== 200) {
    throw new Error(data.responseDetails || 'MyMemory translation failed');
  }

  return data.responseData.translatedText;
}

export async function translateEnglishToArabic(texts) {
  const input = texts.map((t) => (typeof t === 'string' ? t : ''));
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;

  if (apiKey) {
    return translateWithGoogle(input, apiKey);
  }

  return Promise.all(input.map((text) => (text.trim() ? translateWithMyMemory(text) : '')));
}

export function isTranslationConfigured() {
  return Boolean(process.env.GOOGLE_TRANSLATE_API_KEY) || true;
}
