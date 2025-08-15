import React from "react";
import MDBox from "@/components/MD/MDBox";
import MDTypography from "@/components/MD/MDTypography";

export default function AssessmentAdminModule() {
  return (
    <MDBox p={3}>
      <MDTypography variant="h5" fontWeight="bold" mb={2}>
        Assessment Administration
      </MDTypography>
      <MDBox p={4} textAlign="center" color="text.secondary">
        <MDTypography variant="body1">Cross-org assessment search and deal promotion coming soon</MDTypography>
        <MDTypography variant="caption">
          Feature flag: FEATURE_ASSESSMENT_ADMIN - Implementation in progress
        </MDTypography>
      </MDBox>
    </MDBox>
  );
}