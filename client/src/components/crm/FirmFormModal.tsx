import React from 'react';
import { Modal, Box, IconButton } from '@mui/material';
import MDBox from '@/components/MD/MDBox';
import MDTypography from '@/components/MD/MDTypography';
import MDButton from '@/components/MD/MDButton';
import { X } from 'lucide-react';

interface FirmFormModalProps {
  open: boolean;
  onClose: () => void;
  mode: 'create' | 'view' | 'edit';
  firm?: any;
}

const FirmFormModal = ({ open, onClose, mode, firm }: FirmFormModalProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: 'white',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <MDTypography variant="h5" fontWeight="bold">
            {mode === 'create' ? 'New Firm' : mode === 'edit' ? 'Edit Firm' : 'Firm Details'}
          </MDTypography>
          <IconButton onClick={onClose}>
            <X size={20} />
          </IconButton>
        </MDBox>

        <MDBox textAlign="center" py={4}>
          <MDTypography variant="h6" mb={2}>
            Firm Management Modal
          </MDTypography>
          <MDTypography variant="body2" color="text" mb={3}>
            Firm management functionality will be implemented here
          </MDTypography>
          <MDButton variant="gradient" color="info" onClick={onClose}>
            Close
          </MDButton>
        </MDBox>
      </Box>
    </Modal>
  );
};

export default FirmFormModal;