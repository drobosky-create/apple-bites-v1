import type { Request, Response, NextFunction } from 'express';
import { hasPerm, type Permission, type Role } from '../auth/rbac';

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      role: Role;
      name?: string;
    }
    interface Request {
      user?: Express.User;
    }
  }
}

// Minimal auth for now: read role from header or session cookie
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  // TODO: replace with real session/JWT. This unblocks dev now.
  const role = (req.header('x-role') as Role) || (req as any).session?.role || 'admin';
  const email = req.header('x-user') || (req as any).session?.email || 'admin@example.com';
  
  req.user = { id: email, email, role: role as Role, name: email.split('@')[0] };
  next();
}

export function requirePerm(perm: Permission) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (!hasPerm(req.user.role, perm))
      return res.status(403).json({ error: 'Forbidden', need: perm });
    next();
  };
}