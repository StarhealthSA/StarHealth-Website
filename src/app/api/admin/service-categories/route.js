import { NextResponse } from 'next/server';
import { authenticateRequest, WRITE_ROLES } from '@/lib/firebase/auth';
import { createServiceCategory, getAllServiceCategories } from '@/lib/content/service-categories';

export async function GET(request) {
  try {
    await authenticateRequest(request, WRITE_ROLES);
    const categories = await getAllServiceCategories();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function POST(request) {
  try {
    await authenticateRequest(request, WRITE_ROLES);
    const body = await request.json();
    const category = await createServiceCategory(body);
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    const status = error.message.includes('not configured') ? 503 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
