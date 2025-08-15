import React from 'react';
import { useLocation } from "wouter";
import { TEAMTRACK_NAV } from "@/config/teamtrackNav";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { useTeamAuth } from "@/hooks/use-team-auth";

function allowed(itemRoles?: string[], userRole?: string) {
  if (!itemRoles || itemRoles.length === 0) return true;
  return !!userRole && itemRoles.includes(userRole);
}

export default function TeamTrackSidebar() {
  const [location, setLocation] = useLocation();
  const { isAuthenticated: isAdmin } = useAdminAuth();
  const { isAuthenticated: isTeam } = useTeamAuth();
  
  // Determine user role - admin takes precedence
  const userRole = isAdmin ? "admin" : isTeam ? "member" : undefined;

  return (
    <aside className="w-60 shrink-0 border-r bg-white/90 backdrop-blur p-3 overflow-y-auto">
      <div className="mb-4">
        <div className="text-lg font-bold text-slate-800">TeamTrack</div>
        <div className="text-xs text-slate-500">M&A Workspace</div>
      </div>
      
      <nav className="space-y-1">
        {TEAMTRACK_NAV.filter(item => allowed(item.roles, userRole)).map(item => {
          const active = location === item.to || (item.to !== "/workspace" && location.startsWith(item.to));
          return (
            <button
              key={item.to}
              onClick={() => setLocation(item.to)}
              className={`block w-full text-left rounded-lg px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
      
      {/* User info section */}
      <div className="mt-6 pt-4 border-t border-slate-200">
        <div className="text-xs text-slate-500">
          {userRole === "admin" ? "Administrator" : 
           userRole === "member" ? "Team Member" : 
           "Guest Access"}
        </div>
      </div>
    </aside>
  );
}