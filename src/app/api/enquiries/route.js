import { NextResponse } from 'next/server';
import { createEnquiry, isEnquiriesConfigured } from '@/lib/content/enquiries';

function normalizeEnquiryBody(body) {
  const name = body.name?.trim() || '';
  const phone = body.phone?.trim() || '';
  const email = body.email?.trim() || '';

  if (!name) throw new Error('Name is required');
  if (!phone) throw new Error('Phone number is required');
  if (!email) throw new Error('Email is required');

  return {
    name,
    phone,
    email,
    country: body.country?.trim() || '',
    speciality: body.speciality?.trim() || '',
    address: body.address?.trim() || '',
    message: body.message?.trim() || '',
  };
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!isEnquiriesConfigured()) {
      return NextResponse.json(
        { error: 'Enquiry submission is not available right now. Please try again later.' },
        { status: 503 }
      );
    }

    const enquiry = await createEnquiry(body, { source: 'website', read: false });
    return NextResponse.json(enquiry, { status: 201 });
  } catch (error) {
    const status = error.message.includes('not available') ? 503 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
