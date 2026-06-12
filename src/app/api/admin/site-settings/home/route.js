import { NextResponse } from 'next/server';
import { authenticateRequest, READ_ROLES, WRITE_ROLES } from '@/lib/firebase/auth';
import { getHomeSettings, updateHomeSettings } from '@/lib/content/site-settings';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await authenticateRequest(request, READ_ROLES);
    const settings = await getHomeSettings();
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function PUT(request) {
  try {
    await authenticateRequest(request, WRITE_ROLES);
    const body = await request.json();
    const settings = await updateHomeSettings(body);
    return NextResponse.json(settings);
  } catch (error) {
    const status = error.message.includes('not configured') ? 503 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
