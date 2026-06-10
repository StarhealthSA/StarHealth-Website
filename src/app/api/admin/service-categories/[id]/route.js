import { NextResponse } from 'next/server';
import { authenticateRequest, DELETE_ROLES, WRITE_ROLES } from '@/lib/firebase/auth';
import {
  deleteServiceCategory,
  getServiceCategoryById,
  updateServiceCategory,
} from '@/lib/content/service-categories';

export async function GET(request, { params }) {
  try {
    await authenticateRequest(request, WRITE_ROLES);
    const { id } = await params;
    const category = await getServiceCategoryById(id);
    if (!category) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function PUT(request, { params }) {
  try {
    await authenticateRequest(request, WRITE_ROLES);
    const { id } = await params;
    const body = await request.json();
    const category = await updateServiceCategory(id, body);
    return NextResponse.json(category);
  } catch (error) {
    const status = error.message.includes('not configured') ? 503 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function DELETE(request, { params }) {
  try {
    await authenticateRequest(request, DELETE_ROLES);
    const { id } = await params;
    await deleteServiceCategory(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
