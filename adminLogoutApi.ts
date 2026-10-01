import type { Request, Response } from 'express';
import { revokeSession } from "./auth";

function getSessionId(req: Request): string | undefined {
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    const match = cookieHeader.match(/turath_admin_session=([^;]+)/);
    if (match) return match[1];
  }
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  return undefined;
}

export default function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sessionId = getSessionId(req);
  revokeSession(sessionId);

  res.setHeader('Set-Cookie', 'turath_admin_session=; Path=/; HttpOnly; Max-Age=0');

  return res.json({ success: true, message: 'Logged out' });
}
