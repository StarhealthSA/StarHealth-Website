import { NextResponse } from 'next/server';
import { authenticateRequest, READ_ROLES, WRITE_ROLES } from '@/lib/firebase/auth';
import {
  deleteEnquiry,
  getEnquiryById,
  markEnquiryRead,
} from '@/lib/content/enquiries';

export async function GET(request, { params }) {
  try {
    await authenticateRequest(request, READ_ROLES);
    const { id } = await params;
    const enquiry = await getEnquiryById(id);
    if (!enquiry) {
      return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 });
    }

    if (!enquiry.read) {
      await markEnquiryRead(id);
      enquiry.read = true;
    }

    return NextResponse.json(enquiry);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await authenticateRequest(request, WRITE_ROLES);
    const { id } = await params;
    const result = await deleteEnquiry(id);
    return NextResponse.json(result);
  } catch (error) {
    const status = error.message === 'Enquiry not found' ? 404 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function PATCH(request, { params }) {
  try {
    await authenticateRequest(request, WRITE_ROLES);
    const { id } = await params;
    const body = await request.json();

    if (body.action === 'markRead') {
      const enquiry = await markEnquiryRead(id);
      return NextResponse.json(enquiry);
    }

    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
  } catch (error) {
    const status = error.message === 'Enquiry not found' ? 404 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
