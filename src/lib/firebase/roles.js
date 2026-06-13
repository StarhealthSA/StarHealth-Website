export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer',
};

export const ALL_ROLES = [
  ROLES.SUPER_ADMIN,
  ROLES.ADMIN,
  ROLES.EDITOR,
  ROLES.VIEWER,
];

export const WRITE_ROLES = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EDITOR];
export const READ_ROLES = ALL_ROLES;
export const DELETE_ROLES = [ROLES.SUPER_ADMIN, ROLES.ADMIN];
export const USER_MANAGEMENT_ROLES = [ROLES.SUPER_ADMIN, ROLES.ADMIN];

const ROLE_RANK = {
  [ROLES.SUPER_ADMIN]: 4,
  [ROLES.ADMIN]: 3,
  [ROLES.EDITOR]: 2,
  [ROLES.VIEWER]: 1,
};

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: 'Super Admin',
  [ROLES.ADMIN]: 'Admin',
  [ROLES.EDITOR]: 'Editor',
  [ROLES.VIEWER]: 'Viewer',
};

export function getRoleRank(role) {
  return ROLE_RANK[role] ?? 0;
}

export function getAssignableRoles(actorRole) {
  if (actorRole === ROLES.SUPER_ADMIN) {
    return ALL_ROLES;
  }
  if (actorRole === ROLES.ADMIN) {
    return [ROLES.EDITOR, ROLES.VIEWER];
  }
  return [];
}

export function canModifyUser(actorRole, targetRole) {
  if (!USER_MANAGEMENT_ROLES.includes(actorRole)) {
    return false;
  }

  if (actorRole === ROLES.SUPER_ADMIN) {
    return true;
  }

  if (actorRole === ROLES.ADMIN) {
    return targetRole === ROLES.EDITOR || targetRole === ROLES.VIEWER;
  }

  return false;
}

export function assertCanAssignRole(actorRole, newRole) {
  const assignable = getAssignableRoles(actorRole);
  if (!assignable.includes(newRole)) {
    const error = new Error(
      actorRole === ROLES.ADMIN
        ? 'Admins can only assign editor or viewer roles.'
        : 'You cannot assign this role.'
    );
    error.statusCode = 403;
    throw error;
  }
}

export function assertCanModifyUser(actorRole, targetRole) {
  if (!canModifyUser(actorRole, targetRole)) {
    const error = new Error(
      actorRole === ROLES.ADMIN && (targetRole === ROLES.SUPER_ADMIN || targetRole === ROLES.ADMIN)
        ? 'Admins cannot modify super admin or admin users.'
        : 'You cannot modify this user.'
    );
    error.statusCode = 403;
    throw error;
  }
}

export function assertNoSelfRoleElevation(actorRole, newRole, { actorUid, targetUid }) {
  if (actorUid && targetUid && actorUid === targetUid) {
    if (getRoleRank(newRole) > getRoleRank(actorRole)) {
      const error = new Error('You cannot elevate your own role.');
      error.statusCode = 403;
      throw error;
    }
  }
}
