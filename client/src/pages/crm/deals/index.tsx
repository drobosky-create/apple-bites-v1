import { useState } from "react";
import { Box, Tabs, Tab, Typography, Button } from "@mui/material";
import MDBox from "@/components/MD/MDBox";
import MDTypography from "@/components/MD/MDTypography";
import MDButton from "@/components/MD/MDButton";
import { Add, Dashboard, ViewList, CalendarMonth, FormatListBulleted, Analytics } from "@mui/icons-material";
import Kanban from "./Kanban";
import List from "./List";
import CalendarView from "./Calendar";
import Targets from "./Targets";
import Reports from "./Reports";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`crm-tabpanel-${index}`}
      aria-labelledby={`crm-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `crm-tab-${index}`,
    'aria-controls': `crm-tabpanel-${index}`,
  };
}

export default function CRMDeals() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <MDBox
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        paddingTop: 4,
      }}
    >
      {/* Header */}
      <MDBox px={3} pb={3}>
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <MDBox>
            <MDTypography variant="h4" fontWeight="bold" color="dark">
              CRM - Deal Management
            </MDTypography>
            <MDTypography variant="body2" color="text" mt={1}>
              Manage your deal pipeline, opportunities, and client relationships
            </MDTypography>
          </MDBox>
          
          <MDButton
            variant="gradient"
            color="info"
            startIcon={<Add />}
            onClick={() => {
              // Handle new deal creation
              console.log('Create new deal');
            }}
          >
            New Deal
          </MDButton>
        </MDBox>

        {/* Navigation Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.875rem',
                minHeight: 48,
                color: '#344767',
                '&.Mui-selected': {
                  color: '#1976d2',
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#1976d2',
                height: 3,
              }
            }}
          >
            <Tab 
              icon={<Dashboard sx={{ mr: 1 }} />} 
              iconPosition="start"
              label="Kanban Board" 
              {...a11yProps(0)} 
            />
            <Tab 
              icon={<ViewList sx={{ mr: 1 }} />} 
              iconPosition="start"
              label="List View" 
              {...a11yProps(1)} 
            />
            <Tab 
              icon={<CalendarMonth sx={{ mr: 1 }} />} 
              iconPosition="start"
              label="Calendar" 
              {...a11yProps(2)} 
            />
            <Tab 
              icon={<FormatListBulleted sx={{ mr: 1 }} />} 
              iconPosition="start"
              label="Target Lists" 
              {...a11yProps(3)} 
            />
            <Tab 
              icon={<Analytics sx={{ mr: 1 }} />} 
              iconPosition="start"
              label="Reports" 
              {...a11yProps(4)} 
            />
          </Tabs>
        </Box>
      </MDBox>

      {/* Tab Content */}
      <TabPanel value={activeTab} index={0}>
        <Kanban />
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <List />
      </TabPanel>
      <TabPanel value={activeTab} index={2}>
        <CalendarView />
      </TabPanel>
      <TabPanel value={activeTab} index={3}>
        <Targets />
      </TabPanel>
      <TabPanel value={activeTab} index={4}>
        <Reports />
      </TabPanel>
    </MDBox>
  );
}