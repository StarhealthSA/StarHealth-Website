import { NextResponse } from 'next/server';
import { authenticateRequest, READ_ROLES, WRITE_ROLES } from '@/lib/firebase/auth';
import { createOffer, getAllOffers } from '@/lib/content/offers';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await authenticateRequest(request, READ_ROLES);
    const offers = await getAllOffers();
    return NextResponse.json(offers);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function POST(request) {
  try {
    await authenticateRequest(request, WRITE_ROLES);
    const body = await request.json();
    const offer = await createOffer(body);
    return NextResponse.json(offer, { status: 201 });
  } catch (error) {
    const status = error.message.includes('not configured') ? 503 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
