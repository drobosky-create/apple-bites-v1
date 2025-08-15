import React from "react";
import { Switch, Route, useLocation } from "wouter";
import { Box } from "@mui/material";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { useTeamAuth } from "@/hooks/use-team-auth";
import MDBox from "@/components/MD/MDBox";
import WorkspaceSidebar from "@/components/workspace/Sidebar";
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
    <div className="flex h-screen">
      <WorkspaceSidebar role="admin" />
      <main className="flex-1 overflow-auto bg-gray-50">
        <div className="mx-auto max-w-7xl p-6">
          <Switch>
            <Route path="/workspace/crm" component={CRMModule} />
            <Route path="/workspace/vdr" component={VDRModule} />
            <Route path="/workspace/team" component={TeamModule} />
            <Route path="/workspace/assessments" component={AssessmentAdminModule} />
            <Route>
              <CRMModule />
            </Route>
          </Switch>
        </div>
      </main>
    </div>
  );
}