import { NextResponse } from 'next/server';
import { authenticateRequest, DELETE_ROLES, WRITE_ROLES } from '@/lib/firebase/auth';
import { deleteService, getServiceById, updateService } from '@/lib/content/services';

export async function GET(request, { params }) {
  try {
    await authenticateRequest(request, WRITE_ROLES);
    const { id } = await params;
    const service = await getServiceById(id);
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }
    return NextResponse.json(service);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function PUT(request, { params }) {
  try {
    await authenticateRequest(request, WRITE_ROLES);
    const { id } = await params;
    const body = await request.json();
    const service = await updateService(id, body);
    return NextResponse.json(service);
  } catch (error) {
    const status = error.message.includes('not configured') ? 503 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function DELETE(request, { params }) {
  try {
    await authenticateRequest(request, DELETE_ROLES);
    const { id } = await params;
    await deleteService(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const status = error.message.includes('permissions') ? 403 : 401;
    return NextResponse.json({ error: error.message }, { status });
  }
}
