import type { Request, Response } from 'express';
import { validateAdminSession } from "./auth";
import { saveServerProject, deleteServerProject, saveServerProjectsOrder } from './serverProjectStorage';
import { createClient } from '@supabase/supabase-js';
import { ProjectItem } from './types';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://rpyzvhetoviqpjvncqfy.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_xJpsJH--P7kPUwmrVNOwwQ_T12KVuWG';

function getSessionId(req: Request): string | undefined {
  if (req.cookies && typeof req.cookies.turath_admin_session === 'string') {
    return req.cookies.turath_admin_session;
  }
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  return undefined;
}

export default async function handler(req: Request, res: Response) {
  const sessionId = getSessionId(req);
  if (!validateAdminSession(sessionId)) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Valid Admin session required' });
  }

  const client = createClient(SUPABASE_URL, SUPABASE_KEY);

  if (req.method === 'POST') {
    const project = req.body;
    if (!project || !project.id || !project.title) {
      return res.status(400).json({ success: false, error: 'Project data with id and title required' });
    }
    try {
      const updated = saveServerProject(project);

      // Also persist to Supabase cloud projects_catalog
      try {
        const { data: catData } = await client
          .from('site_content')
          .select('content')
          .eq('id', 'projects_catalog')
          .maybeSingle();

        const existing: ProjectItem[] = Array.isArray(catData?.content?.projects)
          ? [...catData.content.projects]
          : [];

        const idx = existing.findIndex((p) => p.id === project.id);
        if (idx >= 0) {
          existing[idx] = { ...existing[idx], ...project, updatedAt: new Date().toISOString() };
        } else {
          existing.push({ ...project, updatedAt: new Date().toISOString() });
        }

        await client.from('site_content').upsert({
          id: 'projects_catalog',
          content: { projects: existing, updatedAt: new Date().toISOString() },
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });
      } catch (supErr) {
        console.warn('Notice saving to Supabase from api route:', supErr);
      }

      return res.json({ success: true, project, projects: updated });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || 'Failed to save project' });
    }
  }

  if (req.method === 'DELETE') {
    const id = (req.query.id as string) || (req.body && req.body.id);
    if (!id) {
      return res.status(400).json({ success: false, error: 'Project ID required' });
    }
    try {
      const updated = deleteServerProject(id);

      // Also remove from Supabase cloud projects_catalog and record in deleted registry
      try {
        const { data: catData } = await client
          .from('site_content')
          .select('content')
          .eq('id', 'projects_catalog')
          .maybeSingle();

        if (catData?.content && Array.isArray(catData.content.projects)) {
          const filtered = catData.content.projects.filter((p: ProjectItem) => p.id !== id);
          await client.from('site_content').upsert({
            id: 'projects_catalog',
            content: { projects: filtered, updatedAt: new Date().toISOString() },
            updated_at: new Date().toISOString(),
          }, { onConflict: 'id' });
        }

        const { data: delData } = await client
          .from('site_content')
          .select('content')
          .eq('id', 'deleted_projects_registry')
          .maybeSingle();

        const currentDeleted: string[] = Array.isArray(delData?.content?.deletedIds)
          ? delData.content.deletedIds
          : [];

        if (!currentDeleted.includes(id)) {
          currentDeleted.push(id);
          await client.from('site_content').upsert({
            id: 'deleted_projects_registry',
            content: { deletedIds: currentDeleted, updatedAt: new Date().toISOString() },
            updated_at: new Date().toISOString(),
          }, { onConflict: 'id' });
        }
      } catch (supDelErr) {
        console.warn('Notice deleting from Supabase from api route:', supDelErr);
      }

      return res.json({ success: true, deletedId: id, projects: updated });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || 'Failed to delete project' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
