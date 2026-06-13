/**
 * Set a Firebase user's custom role claim.
 * Usage: node scripts/set-admin-role.js user@example.com super_admin
 *
 * Roles: super_admin | admin | editor | viewer
 *
 * Bootstrap your account as super admin (one-time):
 *   node scripts/set-admin-role.js your@email.com super_admin
 */

import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getAdminCredential, loadEnv } from './load-env.js';

loadEnv();

const VALID_ROLES = ['super_admin', 'admin', 'editor', 'viewer'];
const [email, role = 'admin'] = process.argv.slice(2);

if (!email) {
  console.error('Usage: node scripts/set-admin-role.js <email> [role]');
  console.error(`Valid roles: ${VALID_ROLES.join(', ')}`);
  process.exit(1);
}

if (!VALID_ROLES.includes(role)) {
  console.error(`Invalid role "${role}". Valid roles: ${VALID_ROLES.join(', ')}`);
  process.exit(1);
}

if (!getApps().length) {
  const credential = getAdminCredential();
  initializeApp({
    credential: cert(credential),
  });
}

const auth = getAuth();

const user = await auth.getUserByEmail(email);
await auth.setCustomUserClaims(user.uid, { role });
console.log(`Set role "${role}" for ${email} (${user.uid})`);
console.log('User must sign out and sign back in for the new role to take effect.');
