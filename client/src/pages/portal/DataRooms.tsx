import React from "react";
import { useQuery } from "@tanstack/react-query";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { Box, Chip } from "@mui/material";
import { format } from "date-fns";
import { FolderOpen } from "lucide-react";
import MDBox from "@/components/MD/MDBox";
import MDTypography from "@/components/MD/MDTypography";
import MDButton from "@/components/MD/MDButton";
import { VdrRoom } from "@shared/schema";

const columns: GridColDef[] = [
  {
    field: "name",
    headerName: "Room Name",
    width: 250,
    renderCell: (params) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <FolderOpen size={16} color="#1976d2" />
        <span>{params.value}</span>
      </Box>
    ),
  },
  {
    field: "dealName",
    headerName: "Deal",
    width: 200,
    valueGetter: (_, row) => row.deal?.name || "N/A",
  },
  {
    field: "status",
    headerName: "Status",
    width: 120,
    renderCell: (params) => (
      <Chip
        label={params.value}
        size="small"
        color={params.value === "active" ? "success" : "default"}
        variant="outlined"
      />
    ),
  },
  {
    field: "createdAt",
    headerName: "Created",
    width: 120,
    valueFormatter: (value: string) => format(new Date(value), "MM/dd/yyyy"),
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 120,
    renderCell: (params) => (
      <MDButton
        variant="outlined"
        color="info"
        size="small"
        onClick={() => window.location.href = `/portal/data-rooms/${params.row.id}`}
      >
        Access
      </MDButton>
    ),
  },
];

export default function DataRooms() {
  const { data: rooms, isLoading, error } = useQuery({
    queryKey: ["/api/portal/vdr-rooms"],
    retry: false,
  });

  if (error) {
    return (
      <MDBox textAlign="center" py={8}>
        <MDTypography variant="h6" color="error">
          Error loading data rooms
        </MDTypography>
        <MDTypography variant="body2" color="text">
          {error.message || "Failed to load data rooms"}
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
            Data Rooms
          </MDTypography>
          <MDTypography variant="body2" color="text">
            Access data rooms you've been invited to
          </MDTypography>
        </MDBox>
      </MDBox>

      {/* Empty State */}
      {!isLoading && (!rooms || rooms.length === 0) && (
        <MDBox textAlign="center" py={8}>
          <FolderOpen size={64} color="#ccc" style={{ marginBottom: "16px" }} />
          <MDTypography variant="h6" color="text">
            No Data Rooms Available
          </MDTypography>
          <MDTypography variant="body2" color="text">
            You haven't been invited to any data rooms yet.
          </MDTypography>
        </MDBox>
      )}

      {/* Data Grid */}
      {(rooms && rooms.length > 0) && (
        <Box sx={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={rooms || []}
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
      )}
    </MDBox>
  );
}