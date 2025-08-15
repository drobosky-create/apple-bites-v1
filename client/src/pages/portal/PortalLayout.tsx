import React from "react";
import { Switch, Route, Link, useLocation } from "wouter";
import { Box, Tabs, Tab } from "@mui/material";
import MDBox from "@/components/MD/MDBox";
import MDTypography from "@/components/MD/MDTypography";
import AssessmentsHistory from "./AssessmentsHistory";
import DataRooms from "./DataRooms";

export default function PortalLayout() {
  const [location, setLocation] = useLocation();
  
  // Determine active tab from current route
  const getActiveTab = () => {
    if (location.includes("/portal/data-rooms")) return 1;
    return 0; // Default to assessments
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    if (newValue === 0) {
      setLocation("/portal/assessments");
    } else if (newValue === 1) {
      setLocation("/portal/data-rooms");
    }
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
          Client Portal
        </MDTypography>
        <MDTypography variant="body1" color="white" opacity={0.8}>
          Access your assessment history and invited data rooms
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
          <Tab label="Assessment History" />
          <Tab label="Data Rooms" />
        </Tabs>
      </MDBox>

      {/* Content Area */}
      <MDBox
        bgColor="white"
        borderRadius="lg"
        shadow="lg"
        sx={{ p: 3 }}
      >
        <Switch>
          <Route path="/portal" component={AssessmentsHistory} />
          <Route path="/portal/assessments" component={AssessmentsHistory} />
          <Route path="/portal/data-rooms" component={DataRooms} />
        </Switch>
      </MDBox>
    </MDBox>
  );
}