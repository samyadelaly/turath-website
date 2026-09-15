const LOGO_STORAGE_KEY = 'turath_custom_logo_v1';
export const DEFAULT_LOGO_URL = '/turath_logo.jpg';

function isStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    const testKey = '__turath_logo_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export function getStoredLogo(): string {
  try {
    if (!isStorageAvailable()) {
      return DEFAULT_LOGO_URL;
    }
    const saved = window.localStorage.getItem(LOGO_STORAGE_KEY);
    if (saved && saved.trim().length > 0) {
      return saved;
    }
  } catch (err) {
    console.warn('Could not read logo from localStorage:', err);
  }
  return DEFAULT_LOGO_URL;
}

export function saveStoredLogo(logoDataUrl: string): void {
  try {
    if (isStorageAvailable()) {
      window.localStorage.setItem(LOGO_STORAGE_KEY, logoDataUrl);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('turath-logo-updated'));
    }
  } catch (err) {
    console.warn('Could not save logo to localStorage:', err);
  }
}

export function resetStoredLogo(): string {
  try {
    if (isStorageAvailable()) {
      window.localStorage.removeItem(LOGO_STORAGE_KEY);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('turath-logo-updated'));
    }
  } catch (err) {
    console.warn('Could not reset logo in localStorage:', err);
  }
  return DEFAULT_LOGO_URL;
}
