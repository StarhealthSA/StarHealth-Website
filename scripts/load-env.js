import { existsSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

function parseEnvFile(filePath) {
  const content = readFileSync(filePath, 'utf8');
  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) return;

    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
}

export function loadEnv() {
  for (const file of ['.env', '.env.local']) {
    const filePath = resolve(rootDir, file);
    if (existsSync(filePath)) {
      parseEnvFile(filePath);
    }
  }
}

export function getAdminCredential() {
  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL?.trim();
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    const missing = [
      !projectId && 'FIREBASE_ADMIN_PROJECT_ID',
      !clientEmail && 'FIREBASE_ADMIN_CLIENT_EMAIL',
      !privateKey && 'FIREBASE_ADMIN_PRIVATE_KEY',
    ].filter(Boolean);

    throw new Error(
      `Missing Firebase Admin credentials: ${missing.join(', ')}. ` +
        'Add them to .env or .env.local (see .env.example).'
    );
  }

  return { projectId, clientEmail, privateKey };
}
