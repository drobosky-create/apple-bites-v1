import React from 'react';
import MDBox from '@/components/MD/MDBox';
import MDTypography from '@/components/MD/MDTypography';

export default function LeadsDashboard() {
  return (
    <MDBox
      sx={{
        minHeight: '100vh',
        backgroundColor: '#F7FAFC',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <MDTypography variant="h4" color="primary">
        Leads Dashboard Page
      </MDTypography>
    </MDBox>
  );
}