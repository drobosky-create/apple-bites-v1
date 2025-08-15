// Single source of truth for TeamTrack navigation
import React from 'react';

export type NavItem = {
  label: string;
  to: string;              // react-router path
  icon?: React.ReactNode;  // optional
  roles?: string[];        // allowed roles (omit = all)
  featureFlag?: string;    // optional feature gate
};

export const TEAMTRACK_NAV: NavItem[] = [
  { label: "Dashboard",   to: "/workspace" },
  { label: "Leads",       to: "/workspace/leads" },
  { label: "Kanban",      to: "/workspace/kanban" },
  { label: "List",        to: "/workspace/list" },
  { label: "Calendar",    to: "/workspace/calendar" },
  { label: "Targets",     to: "/workspace/targets" },
  { label: "Reports",     to: "/workspace/reports" },
  // Core modules
  { label: "CRM",         to: "/workspace/crm" },
  { label: "VDR",         to: "/workspace/vdr" },
  { label: "Team",        to: "/workspace/team" },
  { label: "Assessments", to: "/workspace/assessments" },
  { label: "Audit Logs",  to: "/workspace/audit" },
  { label: "Settings",    to: "/workspace/settings", roles: ["admin"] },
];