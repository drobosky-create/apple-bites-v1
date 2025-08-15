import React from "react";
import MDBox from "@/components/MD/MDBox";
import MDTypography from "@/components/MD/MDTypography";

export default function TeamModule() {
  return (
    <MDBox p={3}>
      <MDTypography variant="h5" fontWeight="bold" mb={2}>
        Team Management
      </MDTypography>
      <MDBox p={4} textAlign="center" color="text.secondary">
        <MDTypography variant="body1">Internal team directory and role management coming soon</MDTypography>
        <MDTypography variant="caption">
          Feature flag: FEATURE_TEAM - Implementation in progress
        </MDTypography>
      </MDBox>
    </MDBox>
  );
}