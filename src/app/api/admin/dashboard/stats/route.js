import { NextResponse } from 'next/server';
import { authenticateRequest, READ_ROLES } from '@/lib/firebase/auth';
import { getDashboardStats } from '@/lib/admin/dashboard-stats';

export const dynamic = 'force-dynamic';

const VALID_PERIODS = new Set(['today', '7days', 'month', 'year']);

export async function GET(request) {
  try {
    const { role } = await authenticateRequest(request, READ_ROLES);
    const { searchParams } = new URL(request.url);
    const periodParam = searchParams.get('period') || '7days';
    const period = VALID_PERIODS.has(periodParam) ? periodParam : '7days';
    const stats = await getDashboardStats({ period, role });
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
