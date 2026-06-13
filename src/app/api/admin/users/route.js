import { NextResponse } from 'next/server';
import { authenticateRequest, USER_MANAGEMENT_ROLES } from '@/lib/firebase/auth';
import { createAdminUser, listAdminUsers } from '@/lib/firebase/user-management';

export const dynamic = 'force-dynamic';

function errorResponse(error) {
  const status = error.statusCode || (error.message.includes('permissions') ? 403 : 400);
  return NextResponse.json({ error: error.message }, { status });
}

export async function GET(request) {
  try {
    await authenticateRequest(request, USER_MANAGEMENT_ROLES);
    const users = await listAdminUsers();
    return NextResponse.json(users);
  } catch (error) {
    const status = error.message.includes('token') || error.message.includes('permissions') ? 401 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function POST(request) {
  try {
    const { role: actorRole } = await authenticateRequest(request, USER_MANAGEMENT_ROLES);
    const body = await request.json();
    const { email, password, role } = body;

    if (!email?.trim() || !password || !role) {
      return NextResponse.json({ error: 'Email, password, and role are required.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    const user = await createAdminUser(actorRole, { email, password, role });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error.statusCode) {
      return errorResponse(error);
    }
    const status = error.message.includes('email-already-exists') ? 409 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
