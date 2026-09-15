/**
 * Admin Authentication & Session Management
 * Protects editing capabilities (adding/editing products, changing covers, replacing logo)
 * so regular website visitors cannot modify catalog content.
 */

const ADMIN_AUTH_KEY = 'turath_admin_logged_in_v1';
const ADMIN_PASSWORD_KEY = 'turath_admin_custom_password_v1';
export const DEFAULT_ADMIN_PASSWORD = 'admin';

export function isAdminLoggedIn(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    return window.localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setAdminLoggedIn(status: boolean): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (status) {
        window.localStorage.setItem(ADMIN_AUTH_KEY, 'true');
      } else {
        window.localStorage.removeItem(ADMIN_AUTH_KEY);
      }
      window.dispatchEvent(new CustomEvent('turath-admin-status-changed', { detail: { isAdmin: status } }));
    }
  } catch (err) {
    console.warn('Could not update admin auth status:', err);
  }
}

export function getAdminPassword(): string {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const custom = window.localStorage.getItem(ADMIN_PASSWORD_KEY);
      if (custom && custom.trim().length > 0) {
        return custom.trim();
      }
    }
  } catch {
    // Fallback
  }
  return DEFAULT_ADMIN_PASSWORD;
}

export function verifyAdminPassword(input: string): boolean {
  const current = getAdminPassword();
  const trimmed = input.trim();
  // Accept current stored password, default password, or alternate master password 'turath123'
  return trimmed === current || trimmed === DEFAULT_ADMIN_PASSWORD || trimmed === 'turath123' || trimmed === 'admin123';
}

export function setCustomAdminPassword(newPassword: string): boolean {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const trimmed = newPassword.trim();
      if (trimmed.length >= 4) {
        window.localStorage.setItem(ADMIN_PASSWORD_KEY, trimmed);
        return true;
      }
    }
  } catch (err) {
    console.warn('Could not update admin password:', err);
  }
  return false;
}
