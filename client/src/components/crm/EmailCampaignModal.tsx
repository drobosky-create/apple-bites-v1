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
  Typography,
  Box,
  Chip,
  Switch,
  FormControlLabel,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  Mail,
  Send,
  Schedule,
  Users,
  Building2,
  Target as TargetIcon,
  ExternalLink,
  Activity
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { Contact, Firm, Deal, Opportunity } from '@shared/schema';

const emailCampaignSchema = z.object({
  campaignName: z.string().min(1, 'Campaign name is required'),
  emailSubject: z.string().min(1, 'Email subject is required'),
  emailBody: z.string().min(1, 'Email body is required'),
  fromEmail: z.string().email('Invalid email'),
  replyToEmail: z.string().email('Invalid email').optional(),
  campaignType: z.string().min(1, 'Campaign type is required'),
  targetAudience: z.string().min(1, 'Target audience is required'),
  sendImmediately: z.boolean(),
  scheduledDateTime: z.string().optional(),
  trackOpens: z.boolean(),
  trackClicks: z.boolean(),
  ghlIntegration: z.boolean(),
  notes: z.string().optional()
});

type EmailCampaignFormData = z.infer<typeof emailCampaignSchema>;

interface EmailCampaignModalProps {
  open: boolean;
  onClose: () => void;
  dealId?: number;
  opportunityId?: number;
  selectedContacts?: Contact[];
  selectedFirms?: Firm[];
}

const CAMPAIGN_TYPES = [
  'Deal Update',
  'Follow-up Sequence',
  'Introductory Outreach',
  'Proposal Follow-up',
  'Due Diligence Request',
  'Closing Communication',
  'Quarterly Newsletter',
  'Event Invitation',
  'Market Update',
  'Custom Campaign'
];

const EMAIL_TEMPLATES = {
  'Deal Update': {
    subject: 'Important Update on [Deal Name]',
    body: `Dear [Contact Name],

I wanted to provide you with an important update regarding [Deal Name].

[Insert update details here]

Next steps:
- [Step 1]
- [Step 2]

Please let me know if you have any questions or would like to schedule a call to discuss further.

Best regards,
[Your Name]
Apple Bites M&A Advisory`
  },
  'Follow-up Sequence': {
    subject: 'Following up on our conversation - [Deal Name]',
    body: `Hi [Contact Name],

Thank you for taking the time to speak with me about [Deal Name]. As discussed, I'm following up with the next steps in our process.

[Insert follow-up details]

I've attached [relevant documents] for your review. Please let me know when you'd like to schedule our next meeting.

Best regards,
[Your Name]`
  },
  'Introductory Outreach': {
    subject: 'Introduction - Apple Bites M&A Advisory',
    body: `Dear [Contact Name],

I hope this email finds you well. My name is [Your Name] from Apple Bites M&A Advisory, and I'm reaching out regarding potential opportunities that may align with [Company Name]'s strategic objectives.

[Insert personalized introduction]

I'd welcome the opportunity to discuss how we might be able to assist with your M&A or strategic initiatives.

Best regards,
[Your Name]`
  }
};

const PREDEFINED_AUDIENCES = [
  { id: 'all_contacts', label: 'All Contacts', icon: Users },
  { id: 'deal_contacts', label: 'Deal-Related Contacts', icon: TargetIcon },
  { id: 'firm_contacts', label: 'Firm Contacts', icon: Building2 },
  { id: 'qualified_leads', label: 'Qualified Leads Only', icon: Activity },
  { id: 'active_clients', label: 'Active Clients', icon: Mail },
  { id: 'custom_selection', label: 'Custom Selection', icon: Users }
];

export default function EmailCampaignModal({ 
  open, 
  onClose, 
  dealId, 
  opportunityId, 
  selectedContacts = [], 
  selectedFirms = [] 
}: EmailCampaignModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<EmailCampaignFormData>({
    resolver: zodResolver(emailCampaignSchema),
    defaultValues: {
      campaignName: '',
      emailSubject: '',
      emailBody: '',
      fromEmail: 'daniel@applebites.ai',
      replyToEmail: 'daniel@applebites.ai',
      campaignType: '',
      targetAudience: '',
      sendImmediately: true,
      scheduledDateTime: '',
      trackOpens: true,
      trackClicks: true,
      ghlIntegration: true,
      notes: ''
    }
  });

  const createCampaignMutation = useMutation({
    mutationFn: (data: EmailCampaignFormData & { dealId?: number; opportunityId?: number }) => 
      apiRequest('POST', '/api/campaigns', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/campaigns'] });
      toast({
        title: "Success",
        description: "Email campaign created and queued for GHL execution",
      });
      onClose();
      reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create email campaign",
        variant: "destructive",
      });
    }
  });

  useEffect(() => {
    if (dealId) {
      setValue('targetAudience', 'deal_contacts');
      setValue('campaignName', `Deal Communication - ${new Date().toLocaleDateString()}`);
    } else if (opportunityId) {
      setValue('targetAudience', 'opportunity_contacts');
      setValue('campaignName', `Opportunity Follow-up - ${new Date().toLocaleDateString()}`);
    } else if (selectedContacts.length > 0) {
      setValue('targetAudience', 'custom_selection');
      setValue('campaignName', `Custom Campaign - ${selectedContacts.length} contacts`);
    }
  }, [dealId, opportunityId, selectedContacts, setValue]);

  const handleTemplateSelect = (templateKey: string) => {
    setSelectedTemplate(templateKey);
    const template = EMAIL_TEMPLATES[templateKey as keyof typeof EMAIL_TEMPLATES];
    if (template) {
      setValue('emailSubject', template.subject);
      setValue('emailBody', template.body);
      setValue('campaignType', templateKey);
    }
  };

  const onSubmit = (data: EmailCampaignFormData) => {
    const campaignData = {
      ...data,
      dealId,
      opportunityId,
      selectedContacts: selectedContacts.map(c => c.id),
      selectedFirms: selectedFirms.map(f => f.id)
    };
    
    createCampaignMutation.mutate(campaignData);
  };

  const handleClose = () => {
    reset();
    setSelectedTemplate('');
    onClose();
  };

  const estimatedRecipients = () => {
    const audience = watch('targetAudience');
    if (audience === 'custom_selection') return selectedContacts.length;
    if (audience === 'deal_contacts' && dealId) return 'Deal contacts';
    if (audience === 'firm_contacts') return selectedFirms.length;
    return 'To be calculated';
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <Mail size={24} />
          Create Email Campaign
        </Box>
      </DialogTitle>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={3}>
            {/* Campaign Basic Info */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Campaign Name"
                {...register('campaignName')}
                error={!!errors.campaignName}
                helperText={errors.campaignName?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Campaign Type</InputLabel>
                <Select
                  label="Campaign Type"
                  value={watch('campaignType') || ''}
                  onChange={(e) => setValue('campaignType', e.target.value)}
                  error={!!errors.campaignType}
                >
                  {CAMPAIGN_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Email Templates */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Email Templates
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                {Object.keys(EMAIL_TEMPLATES).map((template) => (
                  <Chip
                    key={template}
                    label={template}
                    clickable
                    color={selectedTemplate === template ? 'primary' : 'default'}
                    onClick={() => handleTemplateSelect(template)}
                  />
                ))}
              </Box>
            </Grid>

            {/* Email Content */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Subject"
                {...register('emailSubject')}
                error={!!errors.emailSubject}
                helperText={errors.emailSubject?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Body"
                multiline
                rows={8}
                {...register('emailBody')}
                error={!!errors.emailBody}
                helperText={errors.emailBody?.message || "Use [Contact Name], [Company Name], [Deal Name] for personalization"}
              />
            </Grid>

            {/* Sender Information */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="From Email"
                type="email"
                {...register('fromEmail')}
                error={!!errors.fromEmail}
                helperText={errors.fromEmail?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Reply-To Email (Optional)"
                type="email"
                {...register('replyToEmail')}
                error={!!errors.replyToEmail}
                helperText={errors.replyToEmail?.message}
              />
            </Grid>

            {/* Target Audience */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Target Audience
              </Typography>
              <FormControl fullWidth>
                <InputLabel>Select Audience</InputLabel>
                <Select
                  label="Select Audience"
                  value={watch('targetAudience') || ''}
                  onChange={(e) => setValue('targetAudience', e.target.value)}
                  error={!!errors.targetAudience}
                >
                  {PREDEFINED_AUDIENCES.map((audience) => (
                    <MenuItem key={audience.id} value={audience.id}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <audience.icon size={16} />
                        {audience.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                Estimated recipients: {estimatedRecipients()}
              </Typography>
            </Grid>

            {/* Scheduling */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Scheduling & Tracking
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={watch('sendImmediately')}
                    onChange={(e) => setValue('sendImmediately', e.target.checked)}
                  />
                }
                label="Send Immediately"
              />
            </Grid>

            {!watch('sendImmediately') && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Scheduled Date & Time"
                  type="datetime-local"
                  {...register('scheduledDateTime')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <Box display="flex" gap={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={watch('trackOpens')}
                      onChange={(e) => setValue('trackOpens', e.target.checked)}
                    />
                  }
                  label="Track Email Opens"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={watch('trackClicks')}
                      onChange={(e) => setValue('trackClicks', e.target.checked)}
                    />
                  }
                  label="Track Link Clicks"
                />
              </Box>
            </Grid>

            {/* GHL Integration */}
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  GoHighLevel Integration
                </Typography>
                <Typography variant="body2">
                  This campaign will be pushed to GoHighLevel for execution. All tracking and analytics will be available in both systems.
                </Typography>
              </Alert>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={watch('ghlIntegration')}
                    onChange={(e) => setValue('ghlIntegration', e.target.checked)}
                  />
                }
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <ExternalLink size={16} />
                    Enable GHL Integration
                  </Box>
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Campaign Notes"
                multiline
                rows={2}
                {...register('notes')}
                helperText="Internal notes about this campaign"
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            disabled={createCampaignMutation.isPending}
            startIcon={<Send size={16} />}
          >
            {watch('sendImmediately') ? 'Create & Send Campaign' : 'Schedule Campaign'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}