export type Role = 'admin' | 'manager' | 'analyst' | 'viewer';
export type NavKey = 'crm' | 'vdr' | 'team' | 'assessments' | 'settings';

export const NAV_PERMS: Record<NavKey, { label: string; need?: string }> = {
  crm: { label: 'CRM', need: 'lead.read' },
  vdr: { label: 'VDR', need: 'vdr.read' },
  team: { label: 'Team', need: 'team.read' },
  assessments: { label: 'Assessments', need: 'assess.read' },
  settings: { label: 'Settings', need: 'settings.read' },
};

const ROLE_PERMS: Record<Role, string[]> = {
  admin: ['lead.read','lead.create','lead.update','lead.delete','vdr.read','team.read','assess.read','settings.read'],
  manager: ['lead.read','lead.create','lead.update','vdr.read','team.read','assess.read'],
  analyst: ['lead.read','lead.create','lead.update','vdr.read','team.read','assess.read'],
  viewer: ['lead.read','vdr.read','team.read','assess.read'],
};

export const can = (role: Role, perm?: string) => !perm || ROLE_PERMS[role]?.includes(perm);