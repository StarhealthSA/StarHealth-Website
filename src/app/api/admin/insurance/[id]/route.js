import { NextResponse } from 'next/server';
import { authenticateRequest, DELETE_ROLES, READ_ROLES, WRITE_ROLES } from '@/lib/firebase/auth';
import {
  deleteInsurancePartner,
  getInsurancePartnerById,
  updateInsurancePartner,
} from '@/lib/content/insurance';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    await authenticateRequest(request, READ_ROLES);
    const { id } = await params;
    const partner = await getInsurancePartnerById(id);
    if (!partner) {
      return NextResponse.json({ error: 'Insurance partner not found' }, { status: 404 });
    }
    return NextResponse.json(partner);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function PUT(request, { params }) {
  try {
    await authenticateRequest(request, WRITE_ROLES);
    const { id } = await params;
    const body = await request.json();
    const partner = await updateInsurancePartner(id, body);
    return NextResponse.json(partner);
  } catch (error) {
    const status = error.message.includes('not configured') ? 503 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function DELETE(request, { params }) {
  try {
    await authenticateRequest(request, DELETE_ROLES);
    const { id } = await params;
    await deleteInsurancePartner(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const status = error.message.includes('permissions') ? 403 : 401;
    return NextResponse.json({ error: error.message }, { status });
  }
}
