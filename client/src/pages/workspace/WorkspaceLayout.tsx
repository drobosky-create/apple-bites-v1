// client/src/pages/workspace/WorkspaceLayout.tsx

import React, { useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { useTeamAuth } from "@/hooks/use-team-auth";

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
  const { isAuthenticated: isTeamAuth, isLoading: teamLoading } = useTeamAuth();

  // Wouter programmatic navigation
  const [, setLocation] = useLocation();

  const isChecking = adminLoading || teamLoading;
  const hasWorkspaceAccess = isAdminAuth || isTeamAuth;

  console.log('WorkspaceLayout auth check:', {
    isAdminAuth,
    isTeamAuth,
    adminLoading,
    teamLoading,
    isChecking,
    hasWorkspaceAccess
  });

  useEffect(() => {
    // Only decide once checks are complete
    if (!isChecking && !hasWorkspaceAccess) {
      console.log("No workspace access, redirecting to /admin");
      // replace history so user can't go 'Back' to a blocked page
      setLocation("/admin", { replace: true });
    }
  }, [isChecking, hasWorkspaceAccess, setLocation]);

  if (isChecking) {
    // Prevent premature redirects while auth is still resolving
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        Checking access…
      </div>
    );
  }

  if (!hasWorkspaceAccess) {
    // We already kicked off navigation above; render nothing to avoid flicker
    return null;
  }

  // At this point, user has access. Render workspace routes.
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
