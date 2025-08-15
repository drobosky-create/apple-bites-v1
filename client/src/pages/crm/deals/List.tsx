import { useState } from "react";
import { 
  Box, 
  TextField, 
  InputAdornment, 
  Chip, 
  IconButton, 
  Menu, 
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MDBox from "@/components/MDBox";
import MDTypography from "@/components/MDTypography";
import MDButton from "@/components/MDButton";
import { 
  Search, 
  MoreVert, 
  Edit, 
  Delete, 
  Visibility,
  FilterList 
} from "@mui/icons-material";
import { apiRequest } from "@/lib/queryClient";

interface Deal {
  id: number;
  title: string;
  value?: number;
  stage: string;
  expectedCloseDate?: string;
  firmName?: string;
  contactName?: string;
  probability?: number;
  createdAt: string;
  updatedAt: string;
}

const STAGE_COLORS: Record<string, string> = {
  "prospecting": "default",
  "qualified": "warning", 
  "proposal": "info",
  "negotiation": "error",
  "closed-won": "success",
  "closed-lost": "default"
};

const STAGE_LABELS: Record<string, string> = {
  "prospecting": "Prospecting",
  "qualified": "Qualified",
  "proposal": "Proposal", 
  "negotiation": "Negotiation",
  "closed-won": "Closed Won",
  "closed-lost": "Closed Lost"
};

function formatCurrency(value?: number): string {
  if (!value) return "-";
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function List() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStage, setSelectedStage] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Fetch deals
  const { data: deals = [], isLoading } = useQuery({
    queryKey: ['/api/crm/deals'],
    enabled: true,
  });

  // Delete deal mutation
  const deleteDealMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/crm/deals/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/crm/deals'] });
      setDeleteDialogOpen(false);
      setSelectedDeal(null);
    },
  });

  const handleDeleteDeal = () => {
    if (selectedDeal) {
      deleteDealMutation.mutate(selectedDeal.id);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, deal: Deal) => {
    setAnchorEl(event.currentTarget);
    setSelectedDeal(deal);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDeal(null);
  };

  // Filter deals based on search and stage
  const filteredDeals = deals.filter((deal: Deal) => {
    const matchesSearch = !searchTerm || 
      deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.firmName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.contactName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStage = !selectedStage || deal.stage === selectedStage;
    
    return matchesSearch && matchesStage;
  });

  const columns: GridColDef[] = [
    {
      field: 'title',
      headerName: 'Deal Name',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <MDBox>
          <MDTypography variant="body2" fontWeight="medium">
            {params.value}
          </MDTypography>
          {params.row.firmName && (
            <MDTypography variant="caption" color="text">
              {params.row.firmName}
            </MDTypography>
          )}
        </MDBox>
      ),
    },
    {
      field: 'stage',
      headerName: 'Stage',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={STAGE_LABELS[params.value] || params.value}
          color={STAGE_COLORS[params.value] as any || 'default'}
          size="small"
          variant="filled"
        />
      ),
    },
    {
      field: 'value',
      headerName: 'Deal Value',
      width: 120,
      renderCell: (params) => (
        <MDTypography variant="body2" fontWeight="medium" color={params.value ? 'success' : 'text'}>
          {formatCurrency(params.value)}
        </MDTypography>
      ),
    },
    {
      field: 'probability',
      headerName: 'Probability',
      width: 100,
      renderCell: (params) => params.value ? `${params.value}%` : '-',
    },
    {
      field: 'contactName',
      headerName: 'Contact',
      width: 150,
      renderCell: (params) => params.value || '-',
    },
    {
      field: 'expectedCloseDate',
      headerName: 'Expected Close',
      width: 130,
      renderCell: (params) => {
        if (!params.value) return '-';
        return new Date(params.value).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      },
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Visibility />}
          label="View"
          onClick={() => console.log('View deal:', params.row)}
        />,
        <GridActionsCellItem
          icon={<Edit />}
          label="Edit"
          onClick={() => console.log('Edit deal:', params.row)}
        />,
        <GridActionsCellItem
          icon={<MoreVert />}
          label="More"
          onClick={(event) => handleMenuOpen(event, params.row)}
        />,
      ],
    },
  ];

  return (
    <MDBox>
      {/* Filters */}
      <MDBox display="flex" gap={2} mb={3} alignItems="center">
        <TextField
          placeholder="Search deals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ minWidth: 250 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        
        <TextField
          select
          label="Filter by Stage"
          value={selectedStage}
          onChange={(e) => setSelectedStage(e.target.value)}
          size="small"
          sx={{ minWidth: 150 }}
          SelectProps={{
            displayEmpty: true,
          }}
        >
          <MenuItem value="">All Stages</MenuItem>
          {Object.entries(STAGE_LABELS).map(([key, label]) => (
            <MenuItem key={key} value={key}>
              {label}
            </MenuItem>
          ))}
        </TextField>

        <Button
          startIcon={<FilterList />}
          variant="outlined"
          size="small"
          onClick={() => {
            setSearchTerm("");
            setSelectedStage("");
          }}
        >
          Clear Filters
        </Button>
      </MDBox>

      {/* Data Grid */}
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={filteredDeals}
          columns={columns}
          loading={isLoading}
          pageSizeOptions={[25, 50, 100]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 25 },
            },
          }}
          checkboxSelection
          disableRowSelectionOnClick
          sx={{
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #f0f0f0',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f8f9fa',
              borderBottom: '2px solid #e9ecef',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#f8f9fa',
            },
          }}
        />
      </Box>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          console.log('View deal details:', selectedDeal);
          handleMenuClose();
        }}>
          <Visibility sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={() => {
          console.log('Edit deal:', selectedDeal);
          handleMenuClose();
        }}>
          <Edit sx={{ mr: 1 }} />
          Edit Deal
        </MenuItem>
        <MenuItem onClick={() => {
          setDeleteDialogOpen(true);
          handleMenuClose();
        }}>
          <Delete sx={{ mr: 1 }} />
          Delete Deal
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Deal</DialogTitle>
        <DialogContent>
          <MDTypography>
            Are you sure you want to delete "{selectedDeal?.title}"? This action cannot be undone.
          </MDTypography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteDeal}
            color="error"
            disabled={deleteDealMutation.isPending}
          >
            {deleteDealMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </MDBox>
  );
}