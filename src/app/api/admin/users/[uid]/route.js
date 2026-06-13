import { NextResponse } from 'next/server';
import { authenticateRequest, USER_MANAGEMENT_ROLES } from '@/lib/firebase/auth';
import { deleteAdminUser, updateAdminUser } from '@/lib/firebase/user-management';

export const dynamic = 'force-dynamic';

function errorResponse(error) {
  const status = error.statusCode || (error.message.includes('permissions') ? 403 : 400);
  return NextResponse.json({ error: error.message }, { status });
}

export async function PUT(request, { params }) {
  try {
    const { uid: actorUid, role: actorRole } = await authenticateRequest(request, USER_MANAGEMENT_ROLES);
    const { uid: targetUid } = await params;
    const body = await request.json();

    if (body.password && body.password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    const user = await updateAdminUser(actorRole, actorUid, targetUid, body);
    return NextResponse.json(user);
  } catch (error) {
    if (error.statusCode) {
      return errorResponse(error);
    }
    const status = error.message.includes('token') || error.message.includes('permissions') ? 401 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { uid: actorUid, role: actorRole } = await authenticateRequest(request, USER_MANAGEMENT_ROLES);
    const { uid: targetUid } = await params;

    await deleteAdminUser(actorRole, actorUid, targetUid);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error.statusCode) {
      return errorResponse(error);
    }
    const status = error.message.includes('token') || error.message.includes('permissions') ? 401 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
