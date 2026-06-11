import { getAdminAuth } from './admin';

export const ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer',
};

export const WRITE_ROLES = [ROLES.ADMIN, ROLES.EDITOR];
export const DELETE_ROLES = [ROLES.ADMIN];

export async function verifyAdminToken(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Missing authorization token');
  }

  const token = authHeader.slice(7);
  const adminAuth = getAdminAuth();

  if (!adminAuth) {
    throw new Error('Firebase Admin is not configured');
  }

  return adminAuth.verifyIdToken(token);
}

export function requireRole(decodedToken, allowedRoles) {
  const role = decodedToken.role || decodedToken.claims?.role;
  if (!role || !allowedRoles.includes(role)) {
    throw new Error('Insufficient permissions');
  }
  return role;
}

export async function authenticateRequest(request, allowedRoles) {
  const decoded = await verifyAdminToken(request);
  const role = requireRole(decoded, allowedRoles);
  return { decoded, role };
}
