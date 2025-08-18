// client/src/pages/workspace/WorkspaceLayout.tsx

import React, { useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

// Core modules
import CRMModule from "./CRMModule";
import VDRModule from "./VDRModule";
import TeamModule from "./TeamModule";
import AssessmentAdminModule from "./AssessmentAdminModule";
import AdminDashboard from "@/pages/admin-dashboard";

// Layout + footer
import MaterialDashboardLayout from "@/layouts/TeamTrack/MaterialDashboardLayout";
import { BuildFooter } from "@/components/Footer";

export default function WorkspaceLayout() {
  const { isChecking, isAuthenticated, isAdmin } = useAuth();
  const [, setLocation] = useLocation();

  console.log('WorkspaceLayout auth check:', {
    isChecking,
    isAuthenticated,
    isAdmin
  });

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      console.log("No authentication, redirecting to login");
      setLocation("/login", { replace: true });
    }
  }, [isChecking, isAuthenticated, setLocation]);

  if (isChecking) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        Checking access…
      </div>
    );
  }

  if (!isAuthenticated) {
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

        {/* Admin only routes */}
        {isAdmin && (
          <>
            {/* Use AdminDashboard for admin routes */}
            <Route path="/workspace/admin"          component={AdminDashboard} />
            <Route path="/workspace/admin/users"    component={AdminDashboard} />
            <Route path="/workspace/admin/teams"    component={AdminDashboard} />
            <Route path="/workspace/admin/products" component={AdminDashboard} />
            <Route path="/workspace/admin/naics"    component={AdminDashboard} />
            <Route path="/workspace/admin/content"  component={AdminDashboard} />
          </>
        )}
        
        {/* Legacy admin routes */}
        <Route path="/workspace/audit"       component={CRMModule} />
        <Route path="/workspace/settings"    component={CRMModule} />

        {/* Role-aware fallback routing:
           - Admin → AdminDashboard (AppleBites admin)
           - Team/Manager → CRMModule (Lead management)  
           - Consumer → AssessmentAdminModule (Assessment interface)
        */}
        <Route>
          {isAdmin ? (
            <AdminDashboard />
          ) : isAuthenticated ? (
            <CRMModule />
          ) : (
            <AssessmentAdminModule />
          )}
        </Route>
      </Switch>
      <BuildFooter />
    </MaterialDashboardLayout>
  );
}
