import fs from 'fs';
import path from 'path';
import os from 'os';
import { INITIAL_PROJECTS } from './initialProjects';
import { ProjectItem } from './types';

function resolveDataDir(): string {
  const primaryDir = path.join(process.cwd(), '.server_data');
  try {
    if (!fs.existsSync(primaryDir)) {
      fs.mkdirSync(primaryDir, { recursive: true });
    }
    // Test write permission
    const testFile = path.join(primaryDir, '.write_test');
    fs.writeFileSync(testFile, 'ok');
    fs.unlinkSync(testFile);
    return primaryDir;
  } catch {
    // Read-only filesystem (e.g. Vercel serverless lambda) -> use os.tmpdir()
    const tmpDir = path.join(os.tmpdir(), '.turath_server_data');
    try {
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
    } catch {}
    return tmpDir;
  }
}

const DATA_DIR = resolveDataDir();
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const DELETED_PROJECTS_FILE = path.join(DATA_DIR, 'deleted_projects.json');

// In-memory cache
let inMemoryProjects: ProjectItem[] | null = null;
let inMemoryDeleted = new Set<string>();

function ensureDataDir(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch {}
}

export function getServerDeletedProjectIds(): Set<string> {
  ensureDataDir();
  if (fs.existsSync(DELETED_PROJECTS_FILE)) {
    try {
      const raw = fs.readFileSync(DELETED_PROJECTS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        inMemoryDeleted = new Set(parsed);
        return inMemoryDeleted;
      }
    } catch {}
  }
  return inMemoryDeleted;
}

function saveServerDeletedProjectIds(deleted: Set<string>): void {
  inMemoryDeleted = new Set(deleted);
  ensureDataDir();
  try {
    fs.writeFileSync(DELETED_PROJECTS_FILE, JSON.stringify(Array.from(deleted), null, 2), 'utf-8');
  } catch (err) {
    console.warn('Notice writing server deleted projects file:', err);
  }
}

export function getAllServerProjects(): ProjectItem[] {
  ensureDataDir();
  const deleted = getServerDeletedProjectIds();
  const projectMap = new Map<string, ProjectItem>();

  // Add initial default projects that are not deleted
  INITIAL_PROJECTS.forEach((p) => {
    if (!deleted.has(p.id)) {
      projectMap.set(p.id, p);
    }
  });

  // Overlay saved projects from server file storage
  if (fs.existsSync(PROJECTS_FILE)) {
    try {
      const raw = fs.readFileSync(PROJECTS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        parsed.forEach((item: ProjectItem) => {
          if (item && item.id && !deleted.has(item.id)) {
            projectMap.set(item.id, item);
          }
        });
      }
    } catch {}
  }

  // Also overlay in-memory projects if present
  if (inMemoryProjects && inMemoryProjects.length > 0) {
    inMemoryProjects.forEach((item) => {
      if (item && item.id && !deleted.has(item.id)) {
        projectMap.set(item.id, item);
      }
    });
  }

  const result = Array.from(projectMap.values()).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  inMemoryProjects = result;
  return result;
}

export function saveServerProject(project: ProjectItem): ProjectItem[] {
  ensureDataDir();
  const deleted = getServerDeletedProjectIds();
  if (deleted.has(project.id)) {
    deleted.delete(project.id);
    saveServerDeletedProjectIds(deleted);
  }

  const current = getAllServerProjects();
  const idx = current.findIndex((p) => p.id === project.id);
  if (idx >= 0) {
    current[idx] = { ...current[idx], ...project, updatedAt: new Date().toISOString() };
  } else {
    current.unshift({ ...project, updatedAt: new Date().toISOString() });
  }

  inMemoryProjects = current;

  try {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(current, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Notice writing server projects file:', err);
  }

  return current;
}

export function deleteServerProject(id: string): ProjectItem[] {
  ensureDataDir();
  const deleted = getServerDeletedProjectIds();
  deleted.add(id);
  saveServerDeletedProjectIds(deleted);

  const current = getAllServerProjects();
  const filtered = current.filter((p) => p.id !== id);
  inMemoryProjects = filtered;

  try {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Notice writing server projects file after delete:', err);
  }

  return filtered;
}

export function saveServerProjectsOrder(ordered: ProjectItem[]): ProjectItem[] {
  ensureDataDir();
  const reindexed = ordered.map((p, idx) => ({
    ...p,
    sortOrder: idx + 1,
    updatedAt: new Date().toISOString(),
  }));

  inMemoryProjects = reindexed;

  try {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(reindexed, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Notice saving server projects order:', err);
  }

  return reindexed;
}
