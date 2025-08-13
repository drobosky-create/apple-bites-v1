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
import type { Firm, Contact, InsertFirm } from '@shared/schema';

const firmSchema = z.object({
  firmName: z.string().min(1, 'Firm name is required'),
  industry: z.string().optional(),
  address1: z.string().optional(),
  address2: z.string().optional(),
  city: z.string().optional(),
  stateRegion: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  fax: z.string().optional(),
  companyEmail: z.string().email('Invalid email').optional(),
  websiteUrl: z.string().optional(),
  annualRevenue: z.string().optional(),
  annualEbitda: z.string().optional(),
  firmStage: z.string().optional(),
  firmTags: z.string().optional(),
  firmAbout: z.string().optional(),
  primaryContactId: z.number().optional()
});

type FirmFormData = z.infer<typeof firmSchema>;

interface FirmFormModalProps {
  open: boolean;
  onClose: () => void;
  firm?: Firm | null;
  mode: 'create' | 'edit' | 'view';
}

const FIRM_STAGES = [
  'Startup',
  'Early Stage',
  'Growth Stage',
  'Mature',
  'Expansion',
  'Turnaround',
  'Exit Ready'
];

const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Manufacturing',
  'Financial Services',
  'Retail',
  'Real Estate',
  'Energy',
  'Agriculture',
  'Transportation',
  'Professional Services',
  'Education',
  'Construction',
  'Hospitality',
  'Media & Entertainment',
  'Non-Profit',
  'Other'
];

const COUNTRIES = [
  'United States',
  'Canada',
  'United Kingdom',
  'Germany',
  'France',
  'Australia',
  'Other'
];

export default function FirmFormModal({ open, onClose, firm, mode }: FirmFormModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: contacts = [] } = useQuery<Contact[]>({
    queryKey: ['/api/contacts'],
    enabled: open
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FirmFormData>({
    resolver: zodResolver(firmSchema),
    defaultValues: {
      firmName: '',
      industry: '',
      address1: '',
      address2: '',
      city: '',
      stateRegion: '',
      postalCode: '',
      country: 'United States',
      phone: '',
      fax: '',
      companyEmail: '',
      websiteUrl: '',
      annualRevenue: '',
      annualEbitda: '',
      firmStage: '',
      firmTags: '',
      firmAbout: ''
    }
  });

  const createMutation = useMutation({
    mutationFn: (data: FirmFormData) => apiRequest('POST', '/api/firms', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/firms'] });
      toast({
        title: "Success",
        description: "Firm created successfully",
      });
      onClose();
      reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create firm",
        variant: "destructive",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: FirmFormData) => 
      apiRequest('PATCH', `/api/firms/${firm?.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/firms'] });
      toast({
        title: "Success",
        description: "Firm updated successfully",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update firm",
        variant: "destructive",
      });
    }
  });

  useEffect(() => {
    if (firm && (mode === 'edit' || mode === 'view')) {
      setValue('firmName', firm.firmName || '');
      setValue('industry', firm.industry || '');
      setValue('address1', firm.address1 || '');
      setValue('address2', firm.address2 || '');
      setValue('city', firm.city || '');
      setValue('stateRegion', firm.stateRegion || '');
      setValue('postalCode', firm.postalCode || '');
      setValue('country', firm.country || 'United States');
      setValue('phone', firm.phone || '');
      setValue('fax', firm.fax || '');
      setValue('companyEmail', firm.companyEmail || '');
      setValue('websiteUrl', firm.websiteUrl || '');
      setValue('annualRevenue', firm.annualRevenue || '');
      setValue('annualEbitda', firm.annualEbitda || '');
      setValue('firmStage', firm.firmStage || '');
      setValue('firmTags', firm.firmTags || '');
      setValue('firmAbout', firm.firmAbout || '');
      setValue('primaryContactId', firm.primaryContactId || undefined);
    } else if (mode === 'create') {
      reset();
    }
  }, [firm, mode, setValue, reset]);

  const onSubmit = (data: FirmFormData) => {
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
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        {mode === 'create' ? 'Create Firm' : mode === 'edit' ? 'Edit Firm' : 'View Firm'}
      </DialogTitle>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Firm Name"
                {...register('firmName')}
                error={!!errors.firmName}
                helperText={errors.firmName?.message}
                disabled={mode === 'view'}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Industry</InputLabel>
                <Select
                  label="Industry"
                  value={watch('industry') || ''}
                  onChange={(e) => setValue('industry', e.target.value)}
                  disabled={mode === 'view'}
                >
                  <MenuItem value="">
                    <em>Select industry</em>
                  </MenuItem>
                  {INDUSTRIES.map((industry) => (
                    <MenuItem key={industry} value={industry}>
                      {industry}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address Line 1"
                {...register('address1')}
                disabled={mode === 'view'}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address Line 2"
                {...register('address2')}
                disabled={mode === 'view'}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="City"
                {...register('city')}
                disabled={mode === 'view'}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="State/Region"
                {...register('stateRegion')}
                disabled={mode === 'view'}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Postal Code"
                {...register('postalCode')}
                disabled={mode === 'view'}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Country</InputLabel>
                <Select
                  label="Country"
                  value={watch('country') || 'United States'}
                  onChange={(e) => setValue('country', e.target.value)}
                  disabled={mode === 'view'}
                >
                  {COUNTRIES.map((country) => (
                    <MenuItem key={country} value={country}>
                      {country}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Phone"
                {...register('phone')}
                disabled={mode === 'view'}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Fax"
                {...register('fax')}
                disabled={mode === 'view'}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Company Email"
                type="email"
                {...register('companyEmail')}
                error={!!errors.companyEmail}
                helperText={errors.companyEmail?.message}
                disabled={mode === 'view'}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Website URL"
                {...register('websiteUrl')}
                disabled={mode === 'view'}
                helperText="e.g., https://example.com"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Annual Revenue"
                {...register('annualRevenue')}
                disabled={mode === 'view'}
                helperText="e.g., 5000000 for $5M"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Annual EBITDA"
                {...register('annualEbitda')}
                disabled={mode === 'view'}
                helperText="e.g., 1000000 for $1M"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Firm Stage</InputLabel>
                <Select
                  label="Firm Stage"
                  value={watch('firmStage') || ''}
                  onChange={(e) => setValue('firmStage', e.target.value)}
                  disabled={mode === 'view'}
                >
                  <MenuItem value="">
                    <em>Select stage</em>
                  </MenuItem>
                  {FIRM_STAGES.map((stage) => (
                    <MenuItem key={stage} value={stage}>
                      {stage}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Primary Contact</InputLabel>
                <Select
                  label="Primary Contact"
                  value={watch('primaryContactId') || ''}
                  onChange={(e) => setValue('primaryContactId', e.target.value ? Number(e.target.value) : undefined)}
                  disabled={mode === 'view'}
                >
                  <MenuItem value="">
                    <em>No primary contact</em>
                  </MenuItem>
                  {contacts.map((contact) => (
                    <MenuItem key={contact.id} value={contact.id}>
                      {contact.firstName} {contact.lastName} {contact.title && `- ${contact.title}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tags (comma-separated)"
                {...register('firmTags')}
                disabled={mode === 'view'}
                helperText="e.g., Manufacturing, Family Business, Strategic Acquisition"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="About the Firm"
                multiline
                rows={4}
                {...register('firmAbout')}
                disabled={mode === 'view'}
                helperText="Brief description of the firm's business and operations"
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
              {mode === 'create' ? 'Create Firm' : 'Update Firm'}
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
}