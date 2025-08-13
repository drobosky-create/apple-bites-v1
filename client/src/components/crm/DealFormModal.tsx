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
  Slider,
  Typography,
  Box,
  Chip,
  Autocomplete
} from '@mui/material';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { Deal, Contact, Firm, Opportunity, InsertDeal } from '@shared/schema';

const dealSchema = z.object({
  dealName: z.string().min(1, 'Deal name is required'),
  transactionType: z.string().min(1, 'Transaction type is required'),
  dealStage: z.string().min(1, 'Deal stage is required'),
  clientStage: z.string().optional(),
  estimatedTransactionValue: z.string().optional(),
  probabilityOfClose: z.number().min(0).max(100),
  estimatedClosingDate: z.string().optional(),
  keyContacts: z.string().optional(),
  dealOwner: z.string().optional(),
  dealSummary: z.string().optional(),
  notes: z.string().optional(),
  tags: z.string().optional(),
  contactId: z.number().optional(),
  firmId: z.number().optional(),
  opportunityId: z.number().optional()
});

type DealFormData = z.infer<typeof dealSchema>;

interface DealFormModalProps {
  open: boolean;
  onClose: () => void;
  deal?: Deal | null;
  mode: 'create' | 'edit' | 'view';
  preSelectedStage?: string;
}

const DEAL_STAGES = [
  'prospect_identified',
  'initial_contact',
  'qualification', 
  'needs_analysis',
  'proposal_preparation',
  'proposal_presented',
  'negotiation',
  'contract_review',
  'due_diligence',
  'closing_preparation',
  'closed_won',
  'closed_lost',
  'on_hold',
  'follow_up'
];

const TRANSACTION_TYPES = [
  'M&A - Buy Side',
  'M&A - Sell Side',
  'Capital Raise',
  'Strategic Advisory',
  'Valuation',
  'Due Diligence',
  'Business Sale',
  'Asset Purchase',
  'Merger',
  'Joint Venture'
];

const CLIENT_STAGES = [
  'Early Stage',
  'Growth Stage', 
  'Mature',
  'Distressed',
  'Turnaround',
  'Exit Ready'
];

const DEAL_OWNERS = [
  'Daniel Robosky',
  'Franco Meritage',
  'Team Member 1',
  'Team Member 2'
];

export default function DealFormModal({ open, onClose, deal, mode, preSelectedStage }: DealFormModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: contacts = [] } = useQuery<Contact[]>({
    queryKey: ['/api/contacts'],
    enabled: open
  });

  const { data: firms = [] } = useQuery<Firm[]>({
    queryKey: ['/api/firms'],
    enabled: open
  });

  const { data: opportunities = [] } = useQuery<Opportunity[]>({
    queryKey: ['/api/opportunities'],
    enabled: open
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<DealFormData>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      dealName: '',
      transactionType: '',
      dealStage: preSelectedStage || 'prospect_identified',
      clientStage: '',
      estimatedTransactionValue: '',
      probabilityOfClose: 25,
      estimatedClosingDate: '',
      keyContacts: '',
      dealOwner: 'Daniel Robosky',
      dealSummary: '',
      notes: '',
      tags: ''
    }
  });

  const createMutation = useMutation({
    mutationFn: (data: DealFormData) => apiRequest('POST', '/api/deals', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/deals'] });
      toast({
        title: "Success",
        description: "Deal created successfully",
      });
      onClose();
      reset();
    },
    onError: () => {
      toast({
        title: "Error", 
        description: "Failed to create deal",
        variant: "destructive",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: DealFormData) => 
      apiRequest('PATCH', `/api/deals/${deal?.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/deals'] });
      toast({
        title: "Success",
        description: "Deal updated successfully",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update deal",
        variant: "destructive",
      });
    }
  });

  useEffect(() => {
    if (deal && (mode === 'edit' || mode === 'view')) {
      setValue('dealName', deal.dealName || '');
      setValue('transactionType', deal.transactionType || '');
      setValue('dealStage', deal.dealStage || 'prospect_identified');
      setValue('clientStage', deal.clientStage || '');
      setValue('estimatedTransactionValue', deal.estimatedTransactionValue || '');
      setValue('probabilityOfClose', deal.probabilityOfClose || 25);
      setValue('estimatedClosingDate', deal.estimatedClosingDate || '');
      setValue('keyContacts', deal.keyContacts || '');
      setValue('dealOwner', deal.dealOwner || 'Daniel Robosky');
      setValue('dealSummary', deal.dealSummary || '');
      setValue('notes', deal.notes || '');
      setValue('tags', deal.tags || '');
      setValue('contactId', deal.contactId || undefined);
      setValue('firmId', deal.firmId || undefined);
      setValue('opportunityId', deal.opportunityId || undefined);
    } else if (mode === 'create') {
      reset();
      if (preSelectedStage) {
        setValue('dealStage', preSelectedStage);
      }
    }
  }, [deal, mode, setValue, reset, preSelectedStage]);

  const onSubmit = (data: DealFormData) => {
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

  const formatStageName = (stage: string) => {
    return stage.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        {mode === 'create' ? 'Create Deal' : mode === 'edit' ? 'Edit Deal' : 'View Deal'}
      </DialogTitle>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Deal Name"
                {...register('dealName')}
                error={!!errors.dealName}
                helperText={errors.dealName?.message}
                disabled={mode === 'view'}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Transaction Type</InputLabel>
                <Select
                  label="Transaction Type"
                  value={watch('transactionType') || ''}
                  onChange={(e) => setValue('transactionType', e.target.value)}
                  disabled={mode === 'view'}
                  error={!!errors.transactionType}
                >
                  {TRANSACTION_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Deal Stage</InputLabel>
                <Select
                  label="Deal Stage"
                  value={watch('dealStage') || 'prospect_identified'}
                  onChange={(e) => setValue('dealStage', e.target.value)}
                  disabled={mode === 'view'}
                >
                  {DEAL_STAGES.map((stage) => (
                    <MenuItem key={stage} value={stage}>
                      {formatStageName(stage)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Client Stage</InputLabel>
                <Select
                  label="Client Stage"
                  value={watch('clientStage') || ''}
                  onChange={(e) => setValue('clientStage', e.target.value)}
                  disabled={mode === 'view'}
                >
                  <MenuItem value="">
                    <em>Select stage</em>
                  </MenuItem>
                  {CLIENT_STAGES.map((stage) => (
                    <MenuItem key={stage} value={stage}>
                      {stage}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Estimated Transaction Value"
                {...register('estimatedTransactionValue')}
                disabled={mode === 'view'}
                helperText="e.g., 2500000 for $2.5M"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Estimated Closing Date"
                type="date"
                {...register('estimatedClosingDate')}
                disabled={mode === 'view'}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box px={2}>
                <Typography gutterBottom>
                  Probability of Close: {watch('probabilityOfClose')}%
                </Typography>
                <Slider
                  value={watch('probabilityOfClose') || 25}
                  onChange={(_, value) => setValue('probabilityOfClose', value as number)}
                  step={5}
                  min={0}
                  max={100}
                  valueLabelDisplay="auto"
                  disabled={mode === 'view'}
                  marks={[
                    { value: 0, label: '0%' },
                    { value: 25, label: '25%' },
                    { value: 50, label: '50%' },
                    { value: 75, label: '75%' },
                    { value: 100, label: '100%' }
                  ]}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Primary Contact</InputLabel>
                <Select
                  label="Primary Contact"
                  value={watch('contactId') || ''}
                  onChange={(e) => setValue('contactId', e.target.value ? Number(e.target.value) : undefined)}
                  disabled={mode === 'view'}
                >
                  <MenuItem value="">
                    <em>No contact selected</em>
                  </MenuItem>
                  {contacts.map((contact) => (
                    <MenuItem key={contact.id} value={contact.id}>
                      {contact.firstName} {contact.lastName} {contact.title && `- ${contact.title}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
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

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Deal Owner</InputLabel>
                <Select
                  label="Deal Owner"
                  value={watch('dealOwner') || 'Daniel Robosky'}
                  onChange={(e) => setValue('dealOwner', e.target.value)}
                  disabled={mode === 'view'}
                >
                  {DEAL_OWNERS.map((owner) => (
                    <MenuItem key={owner} value={owner}>
                      {owner}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Key Contacts"
                {...register('keyContacts')}
                disabled={mode === 'view'}
                helperText="Other important contacts for this deal"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Deal Summary"
                multiline
                rows={3}
                {...register('dealSummary')}
                disabled={mode === 'view'}
                helperText="Brief overview of the deal opportunity"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tags (comma-separated)"
                {...register('tags')}
                disabled={mode === 'view'}
                helperText="e.g., Manufacturing, Tech, Strategic"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={4}
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
              {mode === 'create' ? 'Create Deal' : 'Update Deal'}
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
}