import { NextResponse } from 'next/server';
import { createOfferCallbackBooking } from '@/lib/content/appointments';

export async function POST(request) {
  try {
    const body = await request.json();
    const booking = await createOfferCallbackBooking(body, {
      source: 'offers',
      read: false,
    });
    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    const status = error.message.includes('not available') ? 503 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
