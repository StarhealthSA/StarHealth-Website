import { NextResponse } from 'next/server';
import { authenticateRequest, DELETE_ROLES, READ_ROLES, WRITE_ROLES } from '@/lib/firebase/auth';
import {
  deletePortfolioEntry,
  getPortfolioEntryById,
  updatePortfolioEntry,
} from '@/lib/content/portfolio';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    await authenticateRequest(request, READ_ROLES);
    const { id } = await params;
    const entry = await getPortfolioEntryById(id);
    if (!entry) {
      return NextResponse.json({ error: 'Portfolio entry not found' }, { status: 404 });
    }
    return NextResponse.json(entry);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function PUT(request, { params }) {
  try {
    await authenticateRequest(request, WRITE_ROLES);
    const { id } = await params;
    const body = await request.json();
    const entry = await updatePortfolioEntry(id, body);
    return NextResponse.json(entry);
  } catch (error) {
    const status = error.message.includes('not configured') ? 503 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function DELETE(request, { params }) {
  try {
    await authenticateRequest(request, DELETE_ROLES);
    const { id } = await params;
    await deletePortfolioEntry(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const status = error.message.includes('permissions') ? 403 : 401;
    return NextResponse.json({ error: error.message }, { status });
  }
}
