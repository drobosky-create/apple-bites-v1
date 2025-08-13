import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, Grid, IconButton } from '@mui/material';
import MDBox from '@/components/MD/MDBox';
import MDTypography from '@/components/MD/MDTypography';
import MDButton from '@/components/MD/MDButton';
import FirmFormModal from './FirmFormModal';
import { Plus, Eye, Edit, Trash2, Globe, MapPin } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

const FirmManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'view' | 'edit'>('create');
  const [selectedFirm, setSelectedFirm] = useState(null);

  const queryClient = useQueryClient();
  const { data: firms = [], isLoading } = useQuery({ queryKey: ['/api/firms'] });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/firms/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/firms'] });
    }
  });

  const handleDelete = (firm: any) => {
    if (confirm(`Are you sure you want to delete ${firm.firmName}?`)) {
      deleteMutation.mutate(firm.id);
    }
  };

  if (isLoading) {
    return (
      <MDBox p={3} display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </MDBox>
    );
  }

  return (
    <MDBox p={3}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <MDBox>
          <MDTypography variant="h4" fontWeight="bold" color="dark">
            Firm Management
          </MDTypography>
          <MDTypography variant="body2" color="text">
            Manage companies and organizational relationships
          </MDTypography>
        </MDBox>
        <MDButton
          variant="gradient"
          color="info"
          onClick={() => {
            setModalType('create');
            setSelectedFirm(null);
            setShowModal(true);
          }}
        >
          <Plus size={16} />
          &nbsp;New Firm
        </MDButton>
      </MDBox>

      <Grid container spacing={3}>
        {firms.map((firm: any) => (
          <Grid key={firm.id} xs={12} md={6} lg={4}>
            <Card>
              <CardContent>
                <MDBox display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                  <MDBox>
                    <MDTypography variant="h6" fontWeight="bold">
                      {firm.firmName}
                    </MDTypography>
                    <MDTypography variant="caption" color="text">
                      {firm.industry || 'Industry not specified'}
                    </MDTypography>
                  </MDBox>
                  <MDBox display="flex" gap={0.5}>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedFirm(firm);
                        setModalType('view');
                        setShowModal(true);
                      }}
                    >
                      <Eye size={16} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedFirm(firm);
                        setModalType('edit');
                        setShowModal(true);
                      }}
                    >
                      <Edit size={16} />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(firm)}
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </MDBox>
                </MDBox>

                <MDBox mb={2}>
                  <MDBox display="flex" alignItems="center" mb={1}>
                    <MapPin size={14} style={{ marginRight: '8px', color: '#666' }} />
                    <MDTypography variant="body2">
                      {firm.city}, {firm.stateRegion}
                    </MDTypography>
                  </MDBox>
                  {firm.websiteUrl && (
                    <MDBox display="flex" alignItems="center">
                      <Globe size={14} style={{ marginRight: '8px', color: '#666' }} />
                      <MDTypography variant="body2">
                        <a href={firm.websiteUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2' }}>
                          {firm.websiteUrl}
                        </a>
                      </MDTypography>
                    </MDBox>
                  )}
                </MDBox>

                {firm.description && (
                  <MDBox>
                    <MDTypography variant="body2" color="text">
                      {firm.description.length > 100 
                        ? `${firm.description.substring(0, 100)}...` 
                        : firm.description
                      }
                    </MDTypography>
                  </MDBox>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {firms.length === 0 && (
        <MDBox textAlign="center" py={6}>
          <MDTypography variant="h6" color="text">
            No firms added yet
          </MDTypography>
          <MDTypography variant="body2" color="text" mb={2}>
            Start building your business network by adding companies
          </MDTypography>
        </MDBox>
      )}

      {showModal && (
        <FirmFormModal
          open={showModal}
          onClose={() => setShowModal(false)}
          mode={modalType}
          firm={selectedFirm}
        />
      )}
    </MDBox>
  );
};

export default FirmManagement;