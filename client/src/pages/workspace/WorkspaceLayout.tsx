import React from "react";
import { Switch, Route } from "wouter";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { useTeamAuth } from "@/hooks/use-team-auth";
import TeamTrackSidebar from "@/components/workspace/TeamTrackSidebar";
import { BuildFooter } from "@/components/Footer";
import CRMModule from "./CRMModule";
import VDRModule from "./VDRModule";
import TeamModule from "./TeamModule";
import AssessmentAdminModule from "./AssessmentAdminModule";
import AdminLoginPage from "@/pages/admin-login";

export default function WorkspaceLayout() {
  const { isAuthenticated: isAdminAuth, isLoading: adminLoading } = useAdminAuth();
  const { isAuthenticated: isTeamAuth, isLoading: teamLoading } = useTeamAuth();
  
  // Check if user has workspace access (admin or team member)
  const hasWorkspaceAccess = isAdminAuth || isTeamAuth;
  const isLoading = adminLoading || teamLoading;
  
  // Show loading state
  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0A1F44 0%, #1B2C4F 100%)',
        color: 'white'
      }}>
        Loading workspace...
      </div>
    );
  }
  
  // Redirect to admin login if not authenticated
  if (!hasWorkspaceAccess) {
    return <AdminLoginPage />;
  }
  return (
    <div className="flex min-h-screen">
      <TeamTrackSidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 bg-gray-50">
          <div className="mx-auto max-w-7xl">
            <Switch>
              <Route path="/workspace/crm" component={CRMModule} />
              <Route path="/workspace/vdr" component={VDRModule} />
              <Route path="/workspace/team" component={TeamModule} />
              <Route path="/workspace/assessments" component={AssessmentAdminModule} />
              <Route path="/workspace/leads" component={CRMModule} />
              <Route path="/workspace/kanban" component={CRMModule} />
              <Route path="/workspace/list" component={CRMModule} />
              <Route path="/workspace/calendar" component={CRMModule} />
              <Route path="/workspace/targets" component={CRMModule} />
              <Route path="/workspace/reports" component={CRMModule} />
              <Route path="/workspace/audit" component={CRMModule} />
              <Route path="/workspace/settings" component={CRMModule} />
              <Route>
                <CRMModule />
              </Route>
            </Switch>
          </div>
        </main>
        <BuildFooter />
      </div>
    </div>
  );
}