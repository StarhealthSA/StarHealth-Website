import { NextResponse } from 'next/server';
import { authenticateRequest, WRITE_ROLES } from '@/lib/firebase/auth';
import { translateEnglishToArabic } from '@/lib/translate/server';

export async function POST(request) {
  try {
    await authenticateRequest(request, WRITE_ROLES);

    const body = await request.json();
    const texts = Array.isArray(body.texts) ? body.texts : [body.text];

    if (!texts.length || texts.every((text) => !String(text || '').trim())) {
      return NextResponse.json({ error: 'No text provided to translate' }, { status: 400 });
    }

    const toTranslate = texts.map((text) => String(text || ''));
    const translations = await translateEnglishToArabic(toTranslate);

    return NextResponse.json({
      translations,
      provider: process.env.GOOGLE_TRANSLATE_API_KEY ? 'google' : 'mymemory',
      target: 'ar',
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
