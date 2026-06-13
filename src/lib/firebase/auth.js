import { getAdminAuth } from './admin';
import {
  DELETE_ROLES,
  READ_ROLES,
  ROLES,
  USER_MANAGEMENT_ROLES,
  WRITE_ROLES,
} from './roles';

export {
  ROLES,
  ALL_ROLES,
  WRITE_ROLES,
  READ_ROLES,
  DELETE_ROLES,
  USER_MANAGEMENT_ROLES,
  getAssignableRoles,
  getRoleRank,
  canModifyUser,
  assertCanAssignRole,
  assertCanModifyUser,
  assertNoSelfRoleElevation,
} from './roles';

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
  return { decoded, role, uid: decoded.uid };
}
