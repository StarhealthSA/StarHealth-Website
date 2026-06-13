import { getAdminAuth } from './admin';
import {
  ROLES,
  assertCanAssignRole,
  assertCanModifyUser,
  assertNoSelfRoleElevation,
  canModifyUser,
} from './roles';

function getAuthOrThrow() {
  const auth = getAdminAuth();
  if (!auth) {
    throw new Error('Firebase Admin is not configured');
  }
  return auth;
}

function mapUserRecord(user) {
  return {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || '',
    disabled: user.disabled || false,
    role: user.customClaims?.role || null,
    createdAt: user.metadata?.creationTime || null,
  };
}

async function countUsersWithRole(role) {
  const auth = getAuthOrThrow();
  let count = 0;
  let pageToken;

  do {
    const result = await auth.listUsers(1000, pageToken);
    count += result.users.filter((user) => user.customClaims?.role === role).length;
    pageToken = result.pageToken;
  } while (pageToken);

  return count;
}

export async function listAdminUsers() {
  const auth = getAuthOrThrow();
  const users = [];
  let pageToken;

  do {
    const result = await auth.listUsers(1000, pageToken);
    users.push(
      ...result.users
        .filter((user) => user.customClaims?.role)
        .map(mapUserRecord)
    );
    pageToken = result.pageToken;
  } while (pageToken);

  return users.sort((a, b) => (a.email || '').localeCompare(b.email || ''));
}

export async function createAdminUser(actorRole, { email, password, role }) {
  assertCanAssignRole(actorRole, role);

  const auth = getAuthOrThrow();
  const user = await auth.createUser({
    email: email.trim(),
    password,
    emailVerified: false,
  });

  await auth.setCustomUserClaims(user.uid, { role });

  const created = await auth.getUser(user.uid);
  return mapUserRecord(created);
}

export async function updateAdminUser(actorRole, actorUid, targetUid, payload = {}) {
  const auth = getAuthOrThrow();
  const target = await auth.getUser(targetUid);
  const targetRole = target.customClaims?.role;

  if (!targetRole) {
    const error = new Error('User is not an admin panel user.');
    error.statusCode = 404;
    throw error;
  }

  assertCanModifyUser(actorRole, targetRole, { actorUid, targetUid });

  const { role, disabled, password } = payload;
  const updates = {};

  if (typeof disabled === 'boolean') {
    updates.disabled = disabled;
  }

  if (password) {
    updates.password = password;
  }

  if (Object.keys(updates).length > 0) {
    await auth.updateUser(targetUid, updates);
  }

  if (role && role !== targetRole) {
    assertCanModifyUser(actorRole, targetRole, { actorUid, targetUid });
    assertCanAssignRole(actorRole, role);
    assertNoSelfRoleElevation(actorRole, role, { actorUid, targetUid });

    if (
      targetRole === ROLES.SUPER_ADMIN &&
      role !== ROLES.SUPER_ADMIN &&
      (await countUsersWithRole(ROLES.SUPER_ADMIN)) <= 1
    ) {
      const error = new Error('Cannot demote the last super admin.');
      error.statusCode = 403;
      throw error;
    }

    await auth.setCustomUserClaims(targetUid, { role });
  }

  const updated = await auth.getUser(targetUid);
  return mapUserRecord(updated);
}

export async function deleteAdminUser(actorRole, actorUid, targetUid) {
  if (actorUid === targetUid) {
    const error = new Error('You cannot delete your own account.');
    error.statusCode = 403;
    throw error;
  }

  const auth = getAuthOrThrow();
  const target = await auth.getUser(targetUid);
  const targetRole = target.customClaims?.role;

  if (!targetRole) {
    const error = new Error('User is not an admin panel user.');
    error.statusCode = 404;
    throw error;
  }

  assertCanModifyUser(actorRole, targetRole, { actorUid, targetUid });

  if (targetRole === ROLES.SUPER_ADMIN && (await countUsersWithRole(ROLES.SUPER_ADMIN)) <= 1) {
    const error = new Error('Cannot delete the last super admin.');
    error.statusCode = 403;
    throw error;
  }

  await auth.deleteUser(targetUid);
  return { success: true };
}

export function canActorModifyTarget(actorRole, targetRole, context = {}) {
  return canModifyUser(actorRole, targetRole, context);
}
