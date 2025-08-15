import { useState } from "react";
import { 
  Box, 
  Card, 
  CardContent,
  TextField, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Avatar
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MDBox from "@/components/MD/MDBox";
import MDTypography from "@/components/MD/MDTypography";
import MDButton from "@/components/MD/MDButton";
import { 
  Add, 
  MoreVert, 
  Edit, 
  Delete, 
  Business,
  Person,
  LocationOn,
  Phone,
  Email,
  TrendingUp
} from "@mui/icons-material";
import { apiRequest } from "@/lib/queryClient";

interface TargetList {
  id: number;
  name: string;
  description?: string;
  status: 'Active' | 'Inactive' | 'Completed';
  totalFirms: number;
  createdAt: string;
  updatedAt: string;
}

interface Firm {
  id: number;
  name: string;
  type?: string;
  region?: string;
  website?: string;
  employees?: number;
  revenue?: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

const STATUS_COLORS: Record<string, any> = {
  "Active": "success",
  "Inactive": "default", 
  "Completed": "info"
};

function formatNumber(value?: number): string {
  if (!value) return "-";
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toLocaleString()}`;
}

function TargetListCard({ 
  targetList, 
  onEdit, 
  onDelete 
}: { 
  targetList: TargetList; 
  onEdit: (targetList: TargetList) => void;
  onDelete: (targetList: TargetList) => void;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <MDBox display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <MDBox flexGrow={1}>
            <MDTypography variant="h6" fontWeight="bold" mb={1}>
              {targetList.name}
            </MDTypography>
            {targetList.description && (
              <MDTypography variant="body2" color="text" mb={2}>
                {targetList.description}
              </MDTypography>
            )}
          </MDBox>
          
          <IconButton size="small" onClick={handleMenuOpen}>
            <MoreVert />
          </IconButton>
        </MDBox>

        <MDBox display="flex" gap={1} mb={2}>
          <Chip 
            label={targetList.status}
            color={STATUS_COLORS[targetList.status]}
            size="small"
          />
        </MDBox>

        <MDBox display="flex" alignItems="center" gap={1} mb={1}>
          <Business sx={{ fontSize: 16, color: 'text.secondary' }} />
          <MDTypography variant="body2">
            {targetList.totalFirms} companies
          </MDTypography>
        </MDBox>

        <MDTypography variant="caption" color="text">
          Updated {new Date(targetList.updatedAt).toLocaleDateString()}
        </MDTypography>
      </CardContent>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          console.log('View target list:', targetList);
          handleMenuClose();
        }}>
          View Details
        </MenuItem>
        <MenuItem onClick={() => {
          onEdit(targetList);
          handleMenuClose();
        }}>
          <Edit sx={{ mr: 1 }} />
          Edit List
        </MenuItem>
        <MenuItem onClick={() => {
          onDelete(targetList);
          handleMenuClose();
        }}>
          <Delete sx={{ mr: 1 }} />
          Delete List
        </MenuItem>
      </Menu>
    </Card>
  );
}

function FirmCard({ firm }: { firm: Firm }) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <MDBox display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <MDBox>
            <MDTypography variant="h6" fontWeight="medium" mb={1}>
              {firm.name}
            </MDTypography>
            {firm.type && (
              <Chip label={firm.type} size="small" sx={{ mr: 1 }} />
            )}
            {firm.region && (
              <Chip label={firm.region} size="small" variant="outlined" />
            )}
          </MDBox>
          
          <IconButton size="small">
            <MoreVert />
          </IconButton>
        </MDBox>

        <MDBox display="flex" gap={3} mb={2}>
          {firm.employees && (
            <MDBox display="flex" alignItems="center" gap={1}>
              <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
              <MDTypography variant="body2">
                {firm.employees.toLocaleString()} employees
              </MDTypography>
            </MDBox>
          )}
          
          {firm.revenue && (
            <MDBox display="flex" alignItems="center" gap={1}>
              <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
              <MDTypography variant="body2" color="success">
                {formatNumber(firm.revenue)} revenue
              </MDTypography>
            </MDBox>
          )}
        </MDBox>

        {firm.description && (
          <MDTypography variant="body2" color="text">
            {firm.description}
          </MDTypography>
        )}
      </CardContent>
    </Card>
  );
}

export default function Targets() {
  const queryClient = useQueryClient();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingList, setEditingList] = useState<TargetList | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedList, setSelectedList] = useState<TargetList | null>(null);
  const [viewingList, setViewingList] = useState<TargetList | null>(null);
  
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    status: 'Active' | 'Inactive' | 'Completed';
  }>({
    name: '',
    description: '',
    status: 'Active'
  });

  // Fetch target lists
  const { data: targetLists = [], isLoading: listsLoading } = useQuery({
    queryKey: ['/api/crm/target-lists'],
    enabled: true,
  });

  // Fetch firms
  const { data: firms = [], isLoading: firmsLoading } = useQuery({
    queryKey: ['/api/crm/firms'],
    enabled: true,
  });

  // Create target list mutation
  const createListMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return apiRequest('POST', '/api/crm/target-lists', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/crm/target-lists'] });
      setCreateDialogOpen(false);
      resetForm();
    },
  });

  // Update target list mutation
  const updateListMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<TargetList> }) => {
      return apiRequest('PATCH', `/api/crm/target-lists/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/crm/target-lists'] });
      setEditingList(null);
      resetForm();
    },
  });

  // Delete target list mutation
  const deleteListMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/crm/target-lists/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/crm/target-lists'] });
      setDeleteDialogOpen(false);
      setSelectedList(null);
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      status: 'Active'
    });
  };

  const handleSubmit = () => {
    if (editingList) {
      updateListMutation.mutate({ id: editingList.id, data: formData });
    } else {
      createListMutation.mutate(formData);
    }
  };

  const handleEdit = (targetList: TargetList) => {
    setEditingList(targetList);
    setFormData({
      name: targetList.name,
      description: targetList.description || '',
      status: targetList.status
    });
    setCreateDialogOpen(true);
  };

  const handleDelete = (targetList: TargetList) => {
    setSelectedList(targetList);
    setDeleteDialogOpen(true);
  };

  if (listsLoading) {
    return (
      <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <MDTypography>Loading target lists...</MDTypography>
      </MDBox>
    );
  }

  if (viewingList) {
    return (
      <MDBox>
        <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <MDBox>
            <MDButton
              variant="text"
              color="info"
              onClick={() => setViewingList(null)}
              sx={{ mb: 1 }}
            >
              ← Back to Target Lists
            </MDButton>
            <MDTypography variant="h5" fontWeight="bold">
              {viewingList.name}
            </MDTypography>
            {viewingList.description && (
              <MDTypography variant="body2" color="text">
                {viewingList.description}
              </MDTypography>
            )}
          </MDBox>
          
          <MDButton
            variant="gradient" 
            color="info"
            startIcon={<Add />}
            onClick={() => console.log('Add firms to list')}
          >
            Add Companies
          </MDButton>
        </MDBox>

        {/* Sample firms display - in real implementation, fetch firms for this list */}
        <MDBox>
          {Array.isArray(firms) ? firms.slice(0, 5).map((firm: Firm) => (
            <FirmCard key={firm.id} firm={firm} />
          )) : []}
        </MDBox>
      </MDBox>
    );
  }

  return (
    <MDBox>
      {/* Header */}
      <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <MDBox>
          <MDTypography variant="h5" fontWeight="bold" mb={1}>
            Target Lists
          </MDTypography>
          <MDTypography variant="body2" color="text">
            Organize and track your target companies for outreach campaigns
          </MDTypography>
        </MDBox>
        
        <MDButton
          variant="gradient"
          color="info"
          startIcon={<Add />}
          onClick={() => setCreateDialogOpen(true)}
        >
          New Target List
        </MDButton>
      </MDBox>

      {/* Target Lists Grid */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
        gap={3}
      >
        {Array.isArray(targetLists) ? targetLists.map((targetList: TargetList) => (
          <div key={targetList.id} onClick={() => setViewingList(targetList)}>
            <TargetListCard
              targetList={targetList}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        )) : []}
      </Box>

      {/* Create/Edit Dialog */}
      <Dialog 
        open={createDialogOpen} 
        onClose={() => {
          setCreateDialogOpen(false);
          setEditingList(null);
          resetForm();
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingList ? 'Edit Target List' : 'Create New Target List'}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} pt={1}>
            <TextField
              label="List Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />
            
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />
            
            <TextField
              select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              fullWidth
              SelectProps={{ native: true }}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Completed">Completed</option>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setCreateDialogOpen(false);
            setEditingList(null);
            resetForm();
          }}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.name || createListMutation.isPending || updateListMutation.isPending}
          >
            {editingList ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Target List</DialogTitle>
        <DialogContent>
          <MDTypography>
            Are you sure you want to delete "{selectedList?.name}"? This action cannot be undone.
          </MDTypography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={() => selectedList && deleteListMutation.mutate(selectedList.id)}
            color="error"
            disabled={deleteListMutation.isPending}
          >
            {deleteListMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </MDBox>
  );
}