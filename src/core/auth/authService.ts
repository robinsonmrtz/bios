import { dbGet, dbSet, dbDelete } from '../db/db';

const AUTH_KEY = 'auth-credentials';
const SESSION_FLAG = 'bios_authenticated';

interface StoredCredentials {
  saltHex: string;
  hashHex: string;
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBuffer(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

async function hashPassword(password: string, salt: Uint8Array): Promise<string> {
  const encoder = new TextEncoder();
  const passwordBytes = encoder.encode(password);
  const combined = new Uint8Array(salt.length + passwordBytes.length);
  combined.set(salt, 0);
  combined.set(passwordBytes, salt.length);
  const digest = await crypto.subtle.digest('SHA-256', combined);
  return bufferToHex(digest);
}

export async function hasPassword(): Promise<boolean> {
  const stored = await dbGet<StoredCredentials>(AUTH_KEY);
  return !!stored;
}

export async function setPassword(password: string): Promise<void> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hashHex = await hashPassword(password, salt);
  const saltHex = bufferToHex(salt.buffer);
  await dbSet<StoredCredentials>(AUTH_KEY, { saltHex, hashHex });
}

export async function verifyPassword(password: string): Promise<boolean> {
  const stored = await dbGet<StoredCredentials>(AUTH_KEY);
  if (!stored) return false;
  const salt = hexToBuffer(stored.saltHex);
  const hashHex = await hashPassword(password, salt);
  return hashHex === stored.hashHex;
}

export async function resetPassword(): Promise<void> {
  await dbDelete(AUTH_KEY);
}

/** La sesión se mantiene mientras el navegador/pestaña siga abierto.
 *  Al cerrar por completo (o reiniciar el equipo) se pide la clave de nuevo. */
export function markSessionAuthenticated(): void {
  sessionStorage.setItem(SESSION_FLAG, '1');
}

export function isSessionAuthenticated(): boolean {
  return sessionStorage.getItem(SESSION_FLAG) === '1';
}

export function clearSession(): void {
  sessionStorage.removeItem(SESSION_FLAG);
}
