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
  
  // Determine active tab from current route
  const getActiveTab = () => {
    if (location.includes("/workspace/crm")) return 0;
    if (location.includes("/workspace/vdr")) return 1;
    if (location.includes("/workspace/team")) return 2;
    if (location.includes("/workspace/assessments")) return 3;
    return 0; // Default to CRM
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    const routes = ["/workspace/crm", "/workspace/vdr", "/workspace/team", "/workspace/assessments"];
    setLocation(routes[newValue]);
  };

  return (
    <MDBox
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0A1F44 0%, #1B2C4F 100%)",
        p: 3,
      }}
    >
      {/* Header */}
      <MDBox mb={4}>
        <MDTypography variant="h4" color="white" fontWeight="bold">
          Internal Workspace
        </MDTypography>
        <MDTypography variant="body1" color="white" opacity={0.8}>
          Manage deals, data rooms, team, and assessments
        </MDTypography>
      </MDBox>

      {/* Navigation Tabs */}
      <MDBox
        bgColor="white"
        borderRadius="lg"
        shadow="lg"
        sx={{ mb: 3 }}
      >
        <Tabs
          value={getActiveTab()}
          onChange={handleTabChange}
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 500,
            },
          }}
        >
          <Tab label="CRM" />
          <Tab label="VDR" />
          <Tab label="Team" />
          <Tab label="Assessments" />
        </Tabs>
      </MDBox>

      {/* Content Area */}
      <MDBox
        bgColor="white"
        borderRadius="lg"
        shadow="lg"
        sx={{ minHeight: "70vh" }}
      >
        <Switch>
          <Route path="/workspace" component={CRMModule} />
          <Route path="/workspace/crm" component={CRMModule} />
          <Route path="/workspace/vdr" component={VDRModule} />
          <Route path="/workspace/team" component={TeamModule} />
          <Route path="/workspace/assessments" component={AssessmentAdminModule} />
        </Switch>
      </MDBox>
    </MDBox>
  );
}