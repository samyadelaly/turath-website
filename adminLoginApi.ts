import type { Request, Response } from 'express';
import {
  verifyAdminPassword,
  createAdminSession,
  checkRateLimit,
  recordFailedLogin,
  recordSuccessfulLogin,
} from "./auth";

export default function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const rateLimit = checkRateLimit(clientIp);

  if (!rateLimit.allowed) {
    return res.status(429).json({
      success: false,
      error: `Too many failed attempts. Try again in ${rateLimit.retryAfterSeconds}s.`,
    });
  }

  const { password } = req.body || {};
  if (!password || typeof password !== 'string') {
    recordFailedLogin(clientIp);
    return res.status(400).json({ success: false, error: 'Password is required' });
  }

  const isValid = verifyAdminPassword(password);
  if (!isValid) {
    recordFailedLogin(clientIp);
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }

  recordSuccessfulLogin(clientIp);
  const sessionId = createAdminSession(clientIp);

  res.setHeader('Set-Cookie', `turath_admin_session=${sessionId}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`);

  return res.json({
    success: true,
    token: sessionId,
  });
}
