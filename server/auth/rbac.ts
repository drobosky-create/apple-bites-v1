// Role + permission definitions central source of truth
export type Role = 'admin' | 'manager' | 'analyst' | 'viewer';

export type Permission =
  | 'lead.read'
  | 'lead.create'
  | 'lead.update'
  | 'lead.delete'
  | 'vdr.read'
  | 'team.read'
  | 'assess.read'
  | 'settings.read';

export const ROLE_PERMS: Record<Role, Permission[]> = {
  admin: [
    'lead.read','lead.create','lead.update','lead.delete',
    'vdr.read','team.read','assess.read','settings.read'
  ],
  manager: [
    'lead.read','lead.create','lead.update',
    'vdr.read','team.read','assess.read'
  ],
  analyst: [
    'lead.read','lead.create','lead.update',
    'vdr.read','team.read','assess.read'
  ],
  viewer: ['lead.read','vdr.read','team.read','assess.read']
};

export const hasPerm = (role: Role, perm: Permission) =>
  ROLE_PERMS[role]?.includes(perm) ?? false;