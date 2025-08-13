import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  FormHelperText
} from '@mui/material';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { Contact, Firm, InsertContact } from '@shared/schema';

const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  goesByName: z.string().optional(),
  title: z.string().optional(),
  email: z.string().email('Invalid email').optional(),
  phoneMobile: z.string().optional(),
  phoneOffice: z.string().optional(),
  linkedinUrl: z.string().optional(),
  firmId: z.number().optional(),
  notes: z.string().optional(),
  tags: z.string().optional(),
  leadSource: z.string().optional(),
  contactStage: z.string().optional()
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormModalProps {
  open: boolean;
  onClose: () => void;
  contact?: Contact | null;
  mode: 'create' | 'edit' | 'view';
}

const CONTACT_STAGES = [
  'Cold Lead',
  'Warm Lead',
  'Hot Lead',
  'Qualified',
  'Active Client',
  'Past Client',
  'Referral Source'
];

const LEAD_SOURCES = [
  'Referral',
  'Website',
  'LinkedIn',
  'Cold Outreach',
  'Event/Conference',
  'Marketing Campaign',
  'Direct Inquiry',
  'Partner Introduction'
];

export default function ContactFormModal({ open, onClose, contact, mode }: ContactFormModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: firms = [] } = useQuery<Firm[]>({
    queryKey: ['/api/firms'],
    enabled: open
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      goesByName: '',
      title: '',
      email: '',
      phoneMobile: '',
      phoneOffice: '',
      linkedinUrl: '',
      notes: '',
      tags: '',
      leadSource: '',
      contactStage: 'Cold Lead'
    }
  });

  const createMutation = useMutation({
    mutationFn: (data: ContactFormData) => apiRequest('POST', '/api/contacts', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contacts'] });
      toast({
        title: "Success",
        description: "Contact created successfully",
      });
      onClose();
      reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create contact",
        variant: "destructive",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: ContactFormData) => 
      apiRequest('PATCH', `/api/contacts/${contact?.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contacts'] });
      toast({
        title: "Success",
        description: "Contact updated successfully",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update contact",
        variant: "destructive",
      });
    }
  });

  useEffect(() => {
    if (contact && (mode === 'edit' || mode === 'view')) {
      setValue('firstName', contact.firstName || '');
      setValue('lastName', contact.lastName || '');
      setValue('goesByName', contact.goesByName || '');
      setValue('title', contact.title || '');
      setValue('email', contact.email || '');
      setValue('phoneMobile', contact.phoneMobile || '');
      setValue('phoneOffice', contact.phoneOffice || '');
      setValue('linkedinUrl', contact.linkedinUrl || '');
      setValue('firmId', contact.firmId || undefined);
      setValue('notes', contact.notes || '');
      setValue('tags', contact.tags || '');
      setValue('leadSource', contact.leadSource || '');
      setValue('contactStage', contact.contactStage || 'Cold Lead');
    } else if (mode === 'create') {
      reset();
    }
  }, [contact, mode, setValue, reset]);

  const onSubmit = (data: ContactFormData) => {
    if (mode === 'create') {
      createMutation.mutate(data);
    } else if (mode === 'edit') {
      updateMutation.mutate(data);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === 'create' ? 'Create Contact' : mode === 'edit' ? 'Edit Contact' : 'View Contact'}
      </DialogTitle>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                {...register('firstName')}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                disabled={mode === 'view'}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                {...register('lastName')}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                disabled={mode === 'view'}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Goes By (Nickname)"
                {...register('goesByName')}
                disabled={mode === 'view'}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Title"
                {...register('title')}
                disabled={mode === 'view'}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                disabled={mode === 'view'}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Firm</InputLabel>
                <Select
                  label="Firm"
                  value={watch('firmId') || ''}
                  onChange={(e) => setValue('firmId', e.target.value ? Number(e.target.value) : undefined)}
                  disabled={mode === 'view'}
                >
                  <MenuItem value="">
                    <em>No firm selected</em>
                  </MenuItem>
                  {firms.map((firm) => (
                    <MenuItem key={firm.id} value={firm.id}>
                      {firm.firmName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mobile Phone"
                {...register('phoneMobile')}
                disabled={mode === 'view'}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Office Phone"
                {...register('phoneOffice')}
                disabled={mode === 'view'}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Contact Stage</InputLabel>
                <Select
                  label="Contact Stage"
                  value={watch('contactStage') || 'Cold Lead'}
                  onChange={(e) => setValue('contactStage', e.target.value)}
                  disabled={mode === 'view'}
                >
                  {CONTACT_STAGES.map((stage) => (
                    <MenuItem key={stage} value={stage}>
                      {stage}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Lead Source</InputLabel>
                <Select
                  label="Lead Source"
                  value={watch('leadSource') || ''}
                  onChange={(e) => setValue('leadSource', e.target.value)}
                  disabled={mode === 'view'}
                >
                  <MenuItem value="">
                    <em>Select source</em>
                  </MenuItem>
                  {LEAD_SOURCES.map((source) => (
                    <MenuItem key={source} value={source}>
                      {source}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="LinkedIn URL"
                {...register('linkedinUrl')}
                disabled={mode === 'view'}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tags (comma-separated)"
                {...register('tags')}
                disabled={mode === 'view'}
                helperText="e.g., CEO, Tech Industry, Referral Source"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                {...register('notes')}
                disabled={mode === 'view'}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>
            {mode === 'view' ? 'Close' : 'Cancel'}
          </Button>
          {mode !== 'view' && (
            <Button 
              type="submit" 
              variant="contained"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {mode === 'create' ? 'Create Contact' : 'Update Contact'}
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
}