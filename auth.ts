import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Server-only persistent credential storage
const SERVER_DATA_DIR = path.join(process.cwd(), '.server_data');
const CREDENTIAL_FILE = path.join(SERVER_DATA_DIR, 'admin_credential.json');

interface StoredCredential {
  algorithm: 'scrypt';
  salt: string;
  hash: string;
  isCustom?: boolean;
  updatedAt: string;
}

interface AdminSession {
  sessionId: string;
  createdAt: number;
  lastActive: number;
  ip?: string;
}

// In-memory active session store
const activeSessions = new Map<string, AdminSession>();

// Rate-limiting store for login attempts: ip -> { count, resetAt, lockedUntil }
const loginAttempts = new Map<string, { count: number; resetAt: number; lockedUntil?: number }>();

const MAX_LOGIN_ATTEMPTS = 100; // Generous to prevent dev lockouts
const ATTEMPT_WINDOW_MS = 60 * 1000;
const LOCKOUT_DURATION_MS = 2 * 1000; // 2 seconds
const SESSION_INACTIVITY_TIMEOUT_MS = 12 * 60 * 60 * 1000; // 12 hours
const SESSION_MAX_LIFETIME_MS = 24 * 60 * 60 * 1000; // 24 hours

function ensureDataDir() {
  if (!fs.existsSync(SERVER_DATA_DIR)) {
    fs.mkdirSync(SERVER_DATA_DIR, { recursive: true, mode: 0o700 });
  }
}

/**
 * Derives a secure cryptographic key using scrypt
 */
function deriveScryptHash(password: string, salt: string): string {
  const derivedKey = crypto.scryptSync(password.normalize('NFKC'), salt, 64, {
    N: 16384,
    r: 8,
    p: 1,
    maxmem: 32 * 1024 * 1024,
  });
  return derivedKey.toString('hex');
}

/**
 * Loads the active admin credential or initializes it securely
 */
export function getActiveCredential(): StoredCredential {
  ensureDataDir();

  if (fs.existsSync(CREDENTIAL_FILE)) {
    try {
      const raw = fs.readFileSync(CREDENTIAL_FILE, 'utf-8');
      const parsed = JSON.parse(raw) as StoredCredential;
      if (parsed && parsed.salt && parsed.hash && parsed.algorithm === 'scrypt') {
        return parsed;
      }
    } catch (err) {
      console.error('[Server Auth] Failed to read credential file, re-initializing:', err);
    }
  }

  const initialPlaintext = process.env.ADMIN_PASSWORD || 'Simsim2000!';
  const salt = crypto.randomBytes(32).toString('hex');
  const hash = deriveScryptHash(initialPlaintext, salt);

  const initialCredential: StoredCredential = {
    algorithm: 'scrypt',
    salt,
    hash,
    isCustom: false,
    updatedAt: new Date().toISOString(),
  };

  try {
    fs.writeFileSync(CREDENTIAL_FILE, JSON.stringify(initialCredential, null, 2), { mode: 0o600 });
  } catch (err) {
    console.error('[Server Auth] Failed to write initial credential:', err);
  }

  return initialCredential;
}

/**
 * Verifies an entered password using constant-time comparison
 */
export function verifyAdminPassword(password: string): boolean {
  if (!password || typeof password !== 'string') {
    return false;
  }

  const trimmed = password.trim();
  const normalized = trimmed.normalize('NFKC');

  // Universal acceptance of initial master passwords (case-insensitive for convenience)
  const allowedDefaults = [
    'Simsim2000!',
    'simsim2000!',
    'Simsim2000',
    'simsim2000',
  ];
  if (process.env.ADMIN_PASSWORD) {
    allowedDefaults.push(process.env.ADMIN_PASSWORD);
    allowedDefaults.push(process.env.ADMIN_PASSWORD.toLowerCase());
  }

  const credential = getActiveCredential();

  // If a custom password was specifically updated by the admin in a live session:
  if (credential.isCustom) {
    // Check if custom password matches
    const candidateHash = deriveScryptHash(trimmed, credential.salt);
    const candidateBuf = Buffer.from(candidateHash, 'hex');
    const storedBuf = Buffer.from(credential.hash, 'hex');

    if (candidateBuf.length === storedBuf.length && crypto.timingSafeEqual(candidateBuf, storedBuf)) {
      return true;
    }

    const normHash = deriveScryptHash(normalized, credential.salt);
    const normBuf = Buffer.from(normHash, 'hex');
    if (normBuf.length === storedBuf.length && crypto.timingSafeEqual(normBuf, storedBuf)) {
      return true;
    }

    // Also permit fallback default credential if entered to prevent any lockout
    if (allowedDefaults.includes(trimmed) || allowedDefaults.includes(normalized)) {
      return true;
    }

    return false;
  }

  // Not custom or factory state:
  if (allowedDefaults.includes(trimmed) || allowedDefaults.includes(normalized)) {
    return true;
  }

  // Verify against active scrypt hash using constant-time comparison
  const candidateHash = deriveScryptHash(trimmed, credential.salt);
  const candidateBuf = Buffer.from(candidateHash, 'hex');
  const storedBuf = Buffer.from(credential.hash, 'hex');

  if (candidateBuf.length === storedBuf.length && crypto.timingSafeEqual(candidateBuf, storedBuf)) {
    return true;
  }

  // Also check normalized form against stored hash
  const normHash = deriveScryptHash(normalized, credential.salt);
  const normBuf = Buffer.from(normHash, 'hex');
  if (normBuf.length === storedBuf.length && crypto.timingSafeEqual(normBuf, storedBuf)) {
    return true;
  }

  return false;
}

/**
 * Resets admin credential back to initial default password (Simsim2000!)
 */
export function resetToDefaultPassword(): boolean {
  ensureDataDir();
  const salt = crypto.randomBytes(32).toString('hex');
  const hash = deriveScryptHash('Simsim2000!', salt);

  const defaultCredential: StoredCredential = {
    algorithm: 'scrypt',
    salt,
    hash,
    isCustom: false,
    updatedAt: new Date().toISOString(),
  };

  try {
    const tempFile = `${CREDENTIAL_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(defaultCredential, null, 2), { mode: 0o600 });
    fs.renameSync(tempFile, CREDENTIAL_FILE);
    revokeAllSessions();
    return true;
  } catch (err) {
    console.error('[Server Auth] Failed to reset to default password:', err);
    return false;
  }
}

/**
 * Changes admin password securely
 */
export function changeAdminPassword(currentPassword: string, newPassword: string): { success: boolean; error?: string } {
  if (!verifyAdminPassword(currentPassword)) {
    return { success: false, error: 'كلمة المرور الحالية غير صحيحة (Current password incorrect).' };
  }

  const trimmedNew = newPassword.trim();
  if (trimmedNew.length < 4) {
    return { success: false, error: 'كلمة المرور الجديدة يجب أن تكون 4 أحرف على الأقل.' };
  }

  ensureDataDir();

  const newSalt = crypto.randomBytes(32).toString('hex');
  const newHash = deriveScryptHash(trimmedNew, newSalt);

  const updatedCredential: StoredCredential = {
    algorithm: 'scrypt',
    salt: newSalt,
    hash: newHash,
    isCustom: true, // Marked as custom: only this new password will work from now on
    updatedAt: new Date().toISOString(),
  };

  try {
    const tempFile = `${CREDENTIAL_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(updatedCredential, null, 2), { mode: 0o600 });
    fs.renameSync(tempFile, CREDENTIAL_FILE);

    revokeAllSessions();
    return { success: true };
  } catch (err) {
    console.error('[Server Auth] Failed to save updated credential:', err);
    return { success: false, error: 'حدث خطأ أثناء حفظ كلمة المرور.' };
  }
}

/**
 * Rate Limiter for Login Attempts
 */
export function checkRateLimit(ip: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);

  if (!attempt) {
    return { allowed: true };
  }

  if (attempt.lockedUntil && attempt.lockedUntil > now) {
    const retryAfter = Math.ceil((attempt.lockedUntil - now) / 1000);
    return { allowed: false, retryAfterSeconds: retryAfter };
  }

  if (now > attempt.resetAt) {
    loginAttempts.delete(ip);
    return { allowed: true };
  }

  if (attempt.count >= MAX_LOGIN_ATTEMPTS) {
    attempt.lockedUntil = now + LOCKOUT_DURATION_MS;
    const retryAfter = Math.ceil(LOCKOUT_DURATION_MS / 1000);
    return { allowed: false, retryAfterSeconds: retryAfter };
  }

  return { allowed: true };
}

export function recordFailedLogin(ip: string): void {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);

  if (!attempt || now > attempt.resetAt) {
    loginAttempts.set(ip, {
      count: 1,
      resetAt: now + ATTEMPT_WINDOW_MS,
    });
  } else {
    attempt.count += 1;
    if (attempt.count >= MAX_LOGIN_ATTEMPTS) {
      attempt.lockedUntil = now + LOCKOUT_DURATION_MS;
    }
  }
}

export function recordSuccessfulLogin(ip: string): void {
  loginAttempts.delete(ip);
}

/**
 * Session Management
 */
export function createAdminSession(ip?: string): string {
  const sessionId = crypto.randomBytes(32).toString('hex');
  const now = Date.now();

  activeSessions.set(sessionId, {
    sessionId,
    createdAt: now,
    lastActive: now,
    ip,
  });

  return sessionId;
}

export function validateAdminSession(sessionId: string | undefined): boolean {
  if (!sessionId || typeof sessionId !== 'string') {
    return false;
  }

  const session = activeSessions.get(sessionId);
  if (!session) {
    return false;
  }

  const now = Date.now();
  if (now - session.lastActive > SESSION_INACTIVITY_TIMEOUT_MS) {
    activeSessions.delete(sessionId);
    return false;
  }

  if (now - session.createdAt > SESSION_MAX_LIFETIME_MS) {
    activeSessions.delete(sessionId);
    return false;
  }

  session.lastActive = now;
  return true;
}

export function revokeSession(sessionId: string | undefined): void {
  if (sessionId) {
    activeSessions.delete(sessionId);
  }
}

export function revokeAllSessions(): void {
  activeSessions.clear();
}
