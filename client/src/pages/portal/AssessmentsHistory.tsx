import React from "react";
import { useQuery } from "@tanstack/react-query";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { format } from "date-fns";
import MDBox from "@/components/MD/MDBox";
import MDTypography from "@/components/MD/MDTypography";
import MDButton from "@/components/MD/MDButton";
import { Assessment } from "@shared/schema";

const columns: GridColDef[] = [
  {
    field: "createdAt",
    headerName: "Date",
    width: 120,
    valueFormatter: (value: string) => format(new Date(value), "MM/dd/yyyy"),
  },
  {
    field: "company",
    headerName: "Company",
    width: 200,
    valueGetter: (_, row) => row.firm?.name || "N/A",
  },
  {
    field: "tier",
    headerName: "Tier",
    width: 100,
    renderCell: (params) => (
      <Box
        sx={{
          px: 2,
          py: 0.5,
          borderRadius: 1,
          backgroundColor: 
            params.value === "capital" ? "#1976d2" :
            params.value === "growth" ? "#2e7d32" : "#757575",
          color: "white",
          textTransform: "capitalize",
          fontSize: "0.75rem",
          fontWeight: "bold",
        }}
      >
        {params.value}
      </Box>
    ),
  },
  {
    field: "ebitda",
    headerName: "EBITDA",
    width: 120,
    valueFormatter: (value: number) => 
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value),
  },
  {
    field: "valueLow",
    headerName: "Valuation Range",
    width: 180,
    renderCell: (params) => {
      const { valueLow, valueHigh } = params.row;
      if (!valueLow || !valueHigh) return "N/A";
      
      const formatCurrency = (value: number) =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
      
      return `${formatCurrency(valueLow)} - ${formatCurrency(valueHigh)}`;
    },
  },
  {
    field: "reportUrl",
    headerName: "Report",
    width: 120,
    renderCell: (params) => (
      params.value ? (
        <Button
          variant="outlined"
          size="small"
          href={params.value}
          target="_blank"
          sx={{ textTransform: "none" }}
        >
          View Report
        </Button>
      ) : (
        <span style={{ color: "#999" }}>N/A</span>
      )
    ),
  },
];

export default function AssessmentsHistory() {
  const { data: assessments, isLoading, error } = useQuery({
    queryKey: ["/api/portal/assessments"],
    retry: false,
  });

  if (error) {
    return (
      <MDBox textAlign="center" py={8}>
        <MDTypography variant="h6" color="error">
          Error loading assessments
        </MDTypography>
        <MDTypography variant="body2" color="text">
          {error.message || "Failed to load assessment history"}
        </MDTypography>
      </MDBox>
    );
  }

  return (
    <MDBox>
      {/* Header */}
      <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <MDBox>
          <MDTypography variant="h5" fontWeight="bold">
            Assessment History
          </MDTypography>
          <MDTypography variant="body2" color="text">
            View all your completed business valuations
          </MDTypography>
        </MDBox>
        <MDButton
          variant="gradient"
          color="info"
          onClick={() => window.location.href = "/assessment"}
        >
          Start New Assessment
        </MDButton>
      </MDBox>

      {/* Data Grid */}
      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={assessments || []}
          columns={columns}
          loading={isLoading}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
            sorting: { sortModel: [{ field: "createdAt", sort: "desc" }] },
          }}
          sx={{
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #f0f0f0",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f8f9fa",
              fontWeight: "bold",
            },
          }}
        />
      </Box>
    </MDBox>
  );
}