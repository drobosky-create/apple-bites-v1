import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Button
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MDButton from '@/components/MD/MDButton';
import { apiRequest } from '@/lib/queryClient';

interface Lead {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  intakeSource: string;
  applebitestaken: boolean;
  qualifierScore: number | null;
  lowQualifierFlag: boolean;
  leadStatus: string;
  createdAt: string;
}

const LeadsManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [createLeadOpen, setCreateLeadOpen] = useState(false);
  const [overrideOpen, setOverrideOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    jobTitle: '',
    phone: '',
    qualifierScore: '',
    notes: ''
  });
  const [overrideData, setOverrideData] = useState({
    toState: '',
    reason: ''
  });

  // Fetch leads
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['/api/leads'],
    retry: false,
  });

  // Create lead mutation
  const createLeadMutation = useMutation({
    mutationFn: async (leadData: any) => {
      return apiRequest('POST', '/api/leads', leadData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      setCreateLeadOpen(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        jobTitle: '',
        phone: '',
        qualifierScore: '',
        notes: ''
      });
    },
  });

  // Override transition mutation
  const overrideMutation = useMutation({
    mutationFn: async ({ leadId, data }: { leadId: number; data: any }) => {
      return apiRequest('POST', `/api/leads/${leadId}/override-transition`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      setOverrideOpen(false);
      setOverrideData({ toState: '', reason: '' });
    },
  });

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.company) {
      alert('Please fill in all required fields');
      return;
    }
    
    createLeadMutation.mutate({
      ...formData,
      intakeSource: 'manual',
      qualifierScore: formData.qualifierScore ? parseFloat(formData.qualifierScore) : null,
    });
  };

  const handleOverride = () => {
    if (selectedLead) {
      overrideMutation.mutate({
        leadId: selectedLead.id,
        data: overrideData
      });
    }
  };

  const handleManualAdvance = (lead: Lead) => {
    setSelectedLead(lead);
    setOverrideOpen(true);
  };

  const columns: GridColDef[] = [
    { field: 'firstName', headerName: 'First Name', width: 130 },
    { field: 'lastName', headerName: 'Last Name', width: 130 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'company', headerName: 'Company', width: 150 },
    {
      field: 'intakeSource',
      headerName: 'Source',
      width: 100,
      renderCell: (params) => (
        <Chip 
          label={params.value === 'manual' ? 'Manual' : 'AppleBites'}
          color={params.value === 'manual' ? 'default' : 'primary'}
          size="small"
        />
      ),
    },
    {
      field: 'applebitestaken',
      headerName: 'AB Assessment',
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value ? 'Yes' : 'No'}
          color={params.value ? 'success' : 'error'}
          size="small"
        />
      ),
    },
    { field: 'qualifierScore', headerName: 'Score', width: 80 },
    { field: 'leadStatus', headerName: 'Status', width: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Box>
          {(params.row.lowQualifierFlag || (!params.row.applebitestaken && params.row.qualifierScore < 60)) && (
            <MDButton
              size="small"
              variant="outlined"
              onClick={() => handleManualAdvance(params.row)}
            >
              Advance
            </MDButton>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Lead Management
        </Typography>
        <MDButton 
          variant="contained" 
          color="primary"
          onClick={() => setCreateLeadOpen(true)}
        >
          Add Lead (No AppleBites)
        </MDButton>
      </Box>

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={leads}
          columns={columns}
          loading={isLoading}
          pageSizeOptions={[25, 50, 100]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Paper>

      {/* Create Lead Modal */}
      <Dialog open={createLeadOpen} onClose={() => setCreateLeadOpen(false)} maxWidth="md" fullWidth>
        <form onSubmit={handleCreateLead}>
          <DialogTitle>Add Manual Lead</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <TextField
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  label="Company"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Qualifier Score"
                  type="number"
                  value={formData.qualifierScore}
                  onChange={(e) => setFormData({...formData, qualifierScore: e.target.value})}
                  fullWidth
                  inputProps={{ min: 0, max: 100 }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button type="button" onClick={() => setCreateLeadOpen(false)}>Cancel</Button>
            <MDButton 
              type="submit"
              variant="contained" 
              disabled={createLeadMutation.isPending}
            >
              {createLeadMutation.isPending ? 'Creating...' : 'Create Lead'}
            </MDButton>
          </DialogActions>
        </form>
      </Dialog>

      {/* Manual Advance Modal */}
      <Dialog open={overrideOpen} onClose={() => setOverrideOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Manual Advance Lead</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Target Stage"
            value={overrideData.toState}
            onChange={(e) => setOverrideData({...overrideData, toState: e.target.value})}
            fullWidth
            sx={{ mt: 2, mb: 2 }}
          >
            <MenuItem value="qualified">Qualified</MenuItem>
            <MenuItem value="opportunity">Opportunity</MenuItem>
            <MenuItem value="converted">Converted</MenuItem>
          </TextField>
          <TextField
            label="Reason (minimum 15 characters)"
            multiline
            rows={4}
            value={overrideData.reason}
            onChange={(e) => setOverrideData({...overrideData, reason: e.target.value})}
            fullWidth
            required
            helperText={`${overrideData.reason.length}/15 characters minimum`}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOverrideOpen(false)}>Cancel</Button>
          <MDButton 
            variant="contained" 
            onClick={handleOverride}
            disabled={overrideMutation.isPending || overrideData.reason.length < 15}
          >
            Advance Lead
          </MDButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeadsManagement;