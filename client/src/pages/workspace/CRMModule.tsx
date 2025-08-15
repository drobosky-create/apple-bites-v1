import React, { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import { DragDropContext } from "react-beautiful-dnd";
import MDBox from "@/components/MD/MDBox";
import MDTypography from "@/components/MD/MDTypography";

// Stub components for CRM tabs - will be implemented with real functionality
import LeadsManagement from "./LeadsManagement";

const KanbanView = () => (
  <MDBox p={3}>
    <MDTypography variant="h6" mb={2}>Deal Pipeline (Kanban)</MDTypography>
    <MDBox p={4} textAlign="center" color="text.secondary">
      <MDTypography variant="body1">Kanban drag-and-drop deal pipeline coming soon</MDTypography>
      <MDTypography variant="caption">
        Feature flag: FEATURE_CRM_KANBAN - Implementation in progress
      </MDTypography>
    </MDBox>
  </MDBox>
);

const LeadsView = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Leads</h1>
      <LeadsManagement />
    </div>
  );
};

const ListView = () => (
  <MDBox p={3}>
    <MDTypography variant="h6" mb={2}>Deals List View</MDTypography>
    <MDBox p={4} textAlign="center" color="text.secondary">
      <MDTypography variant="body1">DataGrid list view with filters coming soon</MDTypography>
      <MDTypography variant="caption">
        Feature flag: FEATURE_CRM_LIST - Implementation in progress
      </MDTypography>
    </MDBox>
  </MDBox>
);

const CalendarView = () => (
  <MDBox p={3}>
    <MDTypography variant="h6" mb={2}>Deal Calendar</MDTypography>
    <MDBox p={4} textAlign="center" color="text.secondary">
      <MDTypography variant="body1">Expected close date calendar coming soon</MDTypography>
      <MDTypography variant="caption">
        Feature flag: FEATURE_CRM_CALENDAR - Implementation in progress
      </MDTypography>
    </MDBox>
  </MDBox>
);

const TargetsView = () => (
  <MDBox p={3}>
    <MDTypography variant="h6" mb={2}>Target Lists</MDTypography>
    <MDBox p={4} textAlign="center" color="text.secondary">
      <MDTypography variant="body1">Target firm lists and bulk assignment coming soon</MDTypography>
      <MDTypography variant="caption">
        Feature flag: FEATURE_CRM_TARGETS - Implementation in progress
      </MDTypography>
    </MDBox>
  </MDBox>
);

const ReportsView = () => (
  <MDBox p={3}>
    <MDTypography variant="h6" mb={2}>CRM Reports</MDTypography>
    <MDBox p={4} textAlign="center" color="text.secondary">
      <MDTypography variant="body1">Analytics cards and charts coming soon</MDTypography>
      <MDTypography variant="caption">
        Feature flag: FEATURE_CRM_REPORTS - Implementation in progress
      </MDTypography>
    </MDBox>
  </MDBox>
);

export default function CRMModule() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0: return <LeadsView />;
      case 1: return <KanbanView />;
      case 2: return <ListView />;
      case 3: return <CalendarView />;
      case 4: return <TargetsView />;
      case 5: return <ReportsView />;
      default: return <LeadsView />;
    }
  };

  return (
    <MDBox>
      {/* CRM Tab Navigation */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              minWidth: 100,
            },
          }}
        >
          <Tab label="Leads" />
          <Tab label="Kanban" />
          <Tab label="List" />
          <Tab label="Calendar" />
          <Tab label="Targets" />
          <Tab label="Reports" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {renderTabContent()}
    </MDBox>
  );
}