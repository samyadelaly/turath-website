import type { Request, Response } from 'express';
import { validateAdminSession } from "./auth";

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
  const sessionId = getSessionId(req);
  const isValid = validateAdminSession(sessionId);

  return res.json({
    authenticated: isValid,
    role: isValid ? 'admin' : null,
  });
}
