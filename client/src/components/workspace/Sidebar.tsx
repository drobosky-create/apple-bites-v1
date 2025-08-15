import React from 'react';
import { useLocation } from 'wouter';
import { NAV_PERMS, can, type Role } from '@/lib/rbac';

const items = [
  { key: 'crm', icon: '📇', to: '/workspace/crm' },
  { key: 'vdr', icon: '📁', to: '/workspace/vdr' },
  { key: 'team', icon: '👥', to: '/workspace/team' },
  { key: 'assessments', icon: '📊', to: '/workspace/assessments' },
  { key: 'settings', icon: '⚙️', to: '/workspace/settings' },
] as const;

interface WorkspaceSidebarProps {
  role?: Role;
}

export default function WorkspaceSidebar({ role = 'admin' }: WorkspaceSidebarProps) {
  const [location, setLocation] = useLocation();
  
  return (
    <aside className="w-64 shrink-0 border-r bg-white">
      <div className="p-4 text-xl font-semibold">Internal Workspace</div>
      <nav className="px-2 space-y-1">
        {items
          .filter(({ key }) => {
            const navItem = NAV_PERMS[key as keyof typeof NAV_PERMS];
            return navItem ? can(role, navItem.need) : true;
          })
          .map(({ key, icon, to }) => {
            const active = location.startsWith(to);
            return (
              <button
                key={key}
                onClick={() => setLocation(to)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-gray-100 w-full text-left ${active ? 'bg-gray-100 font-medium' : ''}`}
              >
                <span className="text-lg">{icon}</span>
                <span>{NAV_PERMS[key as keyof typeof NAV_PERMS]?.label || key}</span>
              </button>
            );
          })}
      </nav>
    </aside>
  );
}