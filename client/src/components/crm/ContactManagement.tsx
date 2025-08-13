import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  IconButton,
  Chip
} from '@mui/material';
import MDBox from '@/components/MD/MDBox';
import MDTypography from '@/components/MD/MDTypography';
import MDButton from '@/components/MD/MDButton';
import ContactFormModal from './ContactFormModal';
import { Plus, Eye, Edit, Trash2, Phone, Mail } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

const ContactManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'view' | 'edit'>('create');
  const [selectedContact, setSelectedContact] = useState(null);

  const queryClient = useQueryClient();
  const { data: contacts = [], isLoading } = useQuery({ queryKey: ['/api/contacts'] });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/contacts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contacts'] });
    }
  });

  const handleDelete = (contact: any) => {
    if (confirm(`Are you sure you want to delete ${contact.firstName} ${contact.lastName}?`)) {
      deleteMutation.mutate(contact.id);
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
            Contact Management
          </MDTypography>
          <MDTypography variant="body2" color="text">
            Manage your business contacts and relationships
          </MDTypography>
        </MDBox>
        <MDButton
          variant="gradient"
          color="info"
          onClick={() => {
            setModalType('create');
            setSelectedContact(null);
            setShowModal(true);
          }}
        >
          <Plus size={16} />
          &nbsp;New Contact
        </MDButton>
      </MDBox>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Stage</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts.map((contact: any) => (
                <TableRow key={contact.id}>
                  <TableCell>
                    <MDBox>
                      <MDTypography variant="body2" fontWeight="bold">
                        {contact.firstName} {contact.lastName}
                      </MDTypography>
                      <MDTypography variant="caption" color="text">
                        {contact.jobTitle || 'No title'}
                      </MDTypography>
                    </MDBox>
                  </TableCell>
                  <TableCell>
                    <MDBox display="flex" alignItems="center">
                      <Mail size={14} style={{ marginRight: '8px', color: '#666' }} />
                      {contact.email}
                    </MDBox>
                  </TableCell>
                  <TableCell>
                    <MDBox display="flex" alignItems="center">
                      <Phone size={14} style={{ marginRight: '8px', color: '#666' }} />
                      {contact.phoneNumber || 'N/A'}
                    </MDBox>
                  </TableCell>
                  <TableCell>{contact.company || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={contact.contactStage || 'New'} 
                      size="small" 
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <MDBox display="flex" gap={1}>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedContact(contact);
                          setModalType('view');
                          setShowModal(true);
                        }}
                      >
                        <Eye size={16} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedContact(contact);
                          setModalType('edit');
                          setShowModal(true);
                        }}
                      >
                        <Edit size={16} />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(contact)}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </MDBox>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {contacts.length === 0 && (
        <MDBox textAlign="center" py={6}>
          <MDTypography variant="h6" color="text">
            No contacts yet
          </MDTypography>
          <MDTypography variant="body2" color="text" mb={2}>
            Start building your network by adding your first contact
          </MDTypography>
        </MDBox>
      )}

      {showModal && (
        <ContactFormModal
          open={showModal}
          onClose={() => setShowModal(false)}
          mode={modalType}
          contact={selectedContact}
        />
      )}
    </MDBox>
  );
};

export default ContactManagement;