import type { Request, Response } from 'express';
import { getAllServerProjects } from "./serverProjectStorage";
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://rpyzvhetoviqpjvncqfy.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_xJpsJH--P7kPUwmrVNOwwQ_T12KVuWG';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. Try reading from Supabase cloud projects_catalog
    try {
      const client = createClient(SUPABASE_URL, SUPABASE_KEY);
      const { data, error } = await client
        .from('site_content')
        .select('content')
        .eq('id', 'projects_catalog')
        .maybeSingle();

      if (!error && data?.content && Array.isArray(data.content.projects)) {
        return res.json({ success: true, projects: data.content.projects, source: 'supabase' });
      }
    } catch {}

    // 2. Fallback to local server file storage
    const projects = getAllServerProjects();
    return res.json({ success: true, projects, source: 'local' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || 'Failed to get projects' });
  }
}
