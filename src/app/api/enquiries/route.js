import { NextResponse } from 'next/server';
import { createEnquiry, isEnquiriesConfigured } from '@/lib/content/enquiries';
import { sendEnquiryEmail } from '@/lib/email/send-enquiry-email';
import { isEmailJsConfigured } from '@/lib/email/send-email';

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
    const hasDb = isEnquiriesConfigured();
    const hasEmail = isEmailJsConfigured();

    if (!hasDb && !hasEmail) {
      return NextResponse.json(
        { error: 'Enquiry submission is not available right now. Please try again later.' },
        { status: 503 }
      );
    }

    const enquiry = hasDb
      ? await createEnquiry(body, { source: 'website', read: false })
      : normalizeEnquiryBody(body);

    if (hasEmail) {
      try {
        await sendEnquiryEmail(enquiry);
      } catch (emailError) {
        console.error('Enquiry saved but email failed:', emailError);
        if (hasDb) {
          return NextResponse.json(
            {
              ...enquiry,
              warning: 'Your enquiry was received but we could not send a notification email. Our team will still follow up.',
            },
            { status: 201 }
          );
        }
        throw emailError;
      }
    } else {
      console.warn('EMAILJS_PRIVATE_KEY is not set — enquiry saved without email notification');
    }

    return NextResponse.json(enquiry, { status: 201 });
  } catch (error) {
    const status = error.message.includes('not available') ? 503 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
