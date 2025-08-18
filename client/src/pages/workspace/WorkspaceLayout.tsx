// client/src/pages/workspace/WorkspaceLayout.tsx

import React from "react";
import { Switch, Route } from "wouter";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { useTeamAuth } from "@/hooks/use-team-auth";
import AdminLoginPage from "@/pages/admin-login";

// Core modules
import CRMModule from "./CRMModule";
import VDRModule from "./VDRModule";
import TeamModule from "./TeamModule";
import AssessmentAdminModule from "./AssessmentAdminModule";

// Layout + footer
import MaterialDashboardLayout from "@/layouts/TeamTrack/MaterialDashboardLayout";
import { BuildFooter } from "@/components/Footer";

export default function WorkspaceLayout() {
  const { isAuthenticated: isAdminAuth, isLoading: adminLoading } = useAdminAuth();
  const { isAuthenticated: isTeamAuth,  isLoading: teamLoading }  = useTeamAuth();

  const isLoading = adminLoading || teamLoading;
  const hasWorkspaceAccess = isAdminAuth || isTeamAuth;

  console.log('WorkspaceLayout auth check:', {
    isAdminAuth,
    isTeamAuth,
    adminLoading,
    teamLoading,
    hasWorkspaceAccess
  });

  if (isLoading) {
    return (
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
        Loading workspace…
      </div>
    );
  }

  if (!hasWorkspaceAccess) {
    console.log('No workspace access, redirecting to admin login');
    // Redirect to admin login instead of rendering AdminLoginPage component
    window.location.href = '/admin';
    return (
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
        Redirecting to admin login...
      </div>
    );
  }

  return (
    <MaterialDashboardLayout>
      <Switch>
        {/* Core modules */}
        <Route path="/workspace/crm"         component={CRMModule} />
        <Route path="/workspace/vdr"         component={VDRModule} />
        <Route path="/workspace/team"        component={TeamModule} />
        <Route path="/workspace/assessments" component={AssessmentAdminModule} />

        {/* Top row navigation */}
        <Route path="/workspace/leads"       component={CRMModule} />
        <Route path="/workspace/kanban"      component={CRMModule} />
        <Route path="/workspace/list"        component={CRMModule} />
        <Route path="/workspace/calendar"    component={CRMModule} />
        <Route path="/workspace/targets"     component={CRMModule} />
        <Route path="/workspace/reports"     component={CRMModule} />

        {/* Admin only */}
        <Route path="/workspace/audit"       component={CRMModule} />
        <Route path="/workspace/settings"    component={CRMModule} />

        {/* Default fallback */}
        <Route><CRMModule /></Route>
      </Switch>
      <BuildFooter />
    </MaterialDashboardLayout>
  );
}
