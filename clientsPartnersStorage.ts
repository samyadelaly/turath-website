import { ClientPartnerItem } from './types';

const CLIENTS_PARTNERS_STORAGE_KEY = 'turath_clients_partners_v1';
const DELETED_CLIENTS_PARTNERS_KEY = 'turath_deleted_clients_partners_v1';

// In-Memory cache for speed and consistency
let inMemoryClientsPartnersCache: ClientPartnerItem[] | null = null;

export function getDeletedClientsPartnersIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(DELETED_CLIENTS_PARTNERS_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

export function markClientPartnerDeleted(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const deleted = getDeletedClientsPartnersIds();
    deleted.add(id);
    localStorage.setItem(DELETED_CLIENTS_PARTNERS_KEY, JSON.stringify(Array.from(deleted)));
  } catch {}
}

export function normalizeClientPartner(data: Partial<ClientPartnerItem>): ClientPartnerItem {
  const id = data.id || `cp-${Date.now()}`;
  return {
    id,
    name: data.name || '',
    nameAR: data.nameAR || undefined,
    type: data.type === 'partner' ? 'partner' : 'client',
    logo: data.logo || '',
    industry: data.industry || undefined,
    websiteUrl: data.websiteUrl || undefined,
    location: data.location || undefined,
    description: data.description || undefined,
    descriptionAR: data.descriptionAR || undefined,
    projectId: data.projectId || undefined,
    published: data.published !== undefined ? Boolean(data.published) : true,
    sortOrder: Number(data.sortOrder) || 0,
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString(),
  };
}

export function getStoredClientsPartners(): ClientPartnerItem[] {
  const deleted = getDeletedClientsPartnersIds();

  if (inMemoryClientsPartnersCache !== null) {
    return inMemoryClientsPartnersCache.filter((item) => !deleted.has(item.id));
  }

  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(CLIENTS_PARTNERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const list = parsed
          .filter((item: any) => item && item.id && !deleted.has(item.id))
          .map((item: any) => normalizeClientPartner(item));
        inMemoryClientsPartnersCache = list;
        return list;
      }
    }
  } catch (err) {
    console.warn('[ClientsPartnersStorage] Error loading from localStorage:', err);
  }

  inMemoryClientsPartnersCache = [];
  return [];
}

export function saveStoredClientsPartners(items: ClientPartnerItem[]): void {
  if (typeof window === 'undefined') return;

  inMemoryClientsPartnersCache = [...items];

  try {
    localStorage.setItem(CLIENTS_PARTNERS_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('turath-clients-partners-updated', { detail: { items } }));
  } catch (err) {
    console.warn('[ClientsPartnersStorage] Error saving to localStorage:', err);
  }
}

export function saveClientPartner(item: ClientPartnerItem): ClientPartnerItem[] {
  const current = getStoredClientsPartners();
  const normalized = normalizeClientPartner(item);
  const exists = current.some((p) => p.id === normalized.id);
  const updated = exists
    ? current.map((p) => (p.id === normalized.id ? normalized : p))
    : [...current, normalized];

  saveStoredClientsPartners(updated);
  return updated;
}

export function deleteClientPartner(id: string): ClientPartnerItem[] {
  markClientPartnerDeleted(id);
  const current = getStoredClientsPartners();
  const filtered = current.filter((p) => p.id !== id);
  saveStoredClientsPartners(filtered);
  return filtered;
}

export function saveClientsPartnersOrder(ordered: ClientPartnerItem[]): ClientPartnerItem[] {
  const reindexed = ordered.map((item, idx) => ({
    ...item,
    sortOrder: idx + 1,
    updatedAt: new Date().toISOString(),
  }));
  saveStoredClientsPartners(reindexed);
  return reindexed;
}
