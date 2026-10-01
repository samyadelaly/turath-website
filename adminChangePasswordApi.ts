import type { Request, Response } from 'express';
import { changeAdminPassword } from "./auth";

export default function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, error: 'Current and new password required' });
  }

  const result = changeAdminPassword(currentPassword, newPassword);
  if (!result.success) {
    return res.status(401).json({ success: false, error: result.error });
  }

  res.setHeader('Set-Cookie', 'turath_admin_session=; Path=/; HttpOnly; Max-Age=0');
  return res.json({ success: true, message: 'Password updated successfully' });
}
