import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';







import { Search, User, Mail, Phone, Building, Calendar, TrendingUp, LogOut, ArrowLeft, Eye, Edit, Trash2, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { Lead } from '@shared/schema';
import AdminLogin from '@/components/admin-login';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { useLocation } from 'wouter';

export default function LeadsDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const { isAuthenticated, isLoading, login, logout } = useAdminAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();

  const { data: leads, isLoading: leadsLoading } = useQuery<Lead[]>({
    queryKey: ['/api/leads', statusFilter === 'all' ? '' : statusFilter, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchQuery) params.append('search', searchQuery);
      
      const response = await fetch(`/api/leads?${params}`);
      if (!response.ok) throw new Error('Failed to fetch leads');
      return response.json();
    },
    enabled: isAuthenticated, // Only fetch when authenticated
  });

  // Mutation for updating lead status
  const updateLeadMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return apiRequest('PATCH', `/api/leads/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      toast({
        title: "Status Updated",
        description: "Lead status has been successfully updated.",
      });
      setShowStatusModal(false);
      setSelectedLead(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Mutation for deleting lead
  const deleteLeadMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/leads/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      toast({
        title: "Lead Deleted",
        description: "Lead has been successfully deleted.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });



  // Handler functions
  const handleViewDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setShowDetailsModal(true);
  };

  const handleUpdateStatus = (lead: Lead) => {
    setSelectedLead(lead);
    setNewStatus(lead.leadStatus || 'new');
    setShowStatusModal(true);
  };

  const handleStatusUpdate = () => {
    if (selectedLead && newStatus) {
      updateLeadMutation.mutate({ id: selectedLead.id, status: newStatus });
    }
  };

  const handleDeleteLead = (leadId: number) => {
    deleteLeadMutation.mutate(leadId);
  };

  // Show authentication loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={login} />;
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'new': 'bg-[#1a2332]/10 text-[#1a2332] border border-[#1a2332]/20',
      'contacted': 'bg-[#415A77]/20 text-[#1a2332] border border-[#415A77]/40',
      'qualified': 'bg-green-100 text-green-800 border border-green-200',
      'converted': 'bg-[#415A77]/30 text-[#1a2332] border border-[#415A77]/50',
      'closed': 'bg-gray-100 text-gray-800 border border-gray-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border border-gray-200';
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-blue-600';
    return 'text-red-600';
  };

  const formatCurrency = (value: string | null) => {
    if (!value) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(value));
  };

  const formatDate = (date: string | Date | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (leadsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Button 
              variant="outline" 
              onClick={() => navigate('/team')}
              className="flex items-center gap-2 text-[#1a2332] hover:text-white hover:bg-[#1a2332] border-[#1a2332]"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1a2332] mb-2">Lead Management</h1>
              <p className="text-[#1a2332]/70 text-sm sm:text-base">Track and manage leads from valuation assessments</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/valuation-form'}
              className="flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Valuation Form</span>
              <span className="sm:hidden">Form</span>
            </Button>
            <Button variant="outline" onClick={logout} className="flex items-center justify-center gap-2 w-full sm:w-auto">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-lg">
                <SelectItem value="all" className="text-gray-900 hover:bg-blue-50 focus:bg-blue-50 hover:text-blue-900 focus:text-blue-900">All Statuses</SelectItem>
                <SelectItem value="new" className="text-gray-900 hover:bg-blue-50 focus:bg-blue-50 hover:text-blue-900 focus:text-blue-900">New</SelectItem>
                <SelectItem value="contacted" className="text-gray-900 hover:bg-blue-50 focus:bg-blue-50 hover:text-blue-900 focus:text-blue-900">Contacted</SelectItem>
                <SelectItem value="qualified" className="text-gray-900 hover:bg-blue-50 focus:bg-blue-50 hover:text-blue-900 focus:text-blue-900">Qualified</SelectItem>
                <SelectItem value="converted" className="text-gray-900 hover:bg-blue-50 focus:bg-blue-50 hover:text-blue-900 focus:text-blue-900">Converted</SelectItem>
                <SelectItem value="closed" className="text-gray-900 hover:bg-blue-50 focus:bg-blue-50 hover:text-blue-900 focus:text-blue-900">Closed</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center text-sm text-gray-600">
              <span className="font-medium">{leads?.length || 0}</span>
              <span className="ml-1">leads found</span>
            </div>
          </div>
        </div>

        {/* Leads List */}
        <div className="space-y-4">
          {leads?.map((lead) => (
            <Card key={lead.id} className="p-4 sm:p-6 hover:shadow-md transition-shadow overflow-hidden">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-2 sm:gap-4 lg:gap-6 mb-3">
                    <div className="flex items-center gap-2 min-w-0 flex-1 sm:flex-initial">
                      <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {lead.firstName} {lead.lastName}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge className={`${getStatusColor(lead.leadStatus || 'new')} flex-shrink-0`}>
                        {lead.leadStatus}
                      </Badge>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <TrendingUp className="w-4 h-4 text-gray-400" />
                        <span className={`font-medium ${getScoreColor(lead.leadScore || 0)}`}>
                          {lead.leadScore}/100
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building className="w-4 h-4" />
                      <span>{lead.company}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{lead.email}</span>
                    </div>
                    {lead.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{lead.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Created {formatDate(lead.createdAt)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Estimated Value:</span>
                      <span className="ml-2 font-medium">
                        {formatCurrency(lead.estimatedValue)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Overall Grade:</span>
                      <span className="ml-2 font-medium">{lead.overallGrade || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Follow-up Intent:</span>
                      <span className="ml-2 font-medium capitalize">
                        {lead.followUpIntent || '-'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewDetails(lead)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleUpdateStatus(lead)}
                    className="flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Update Status
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Lead</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this lead? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteLead(lead.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </Card>
          ))}

          {leads?.length === 0 && (
            <Card className="p-12 text-center">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
              <p className="text-gray-500">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your search criteria or filters'
                  : 'Leads will appear here when users complete valuation assessments'}
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* View Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
            <DialogDescription>
              Complete information for {selectedLead?.firstName} {selectedLead?.lastName}
            </DialogDescription>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <p className="text-sm text-gray-900">{selectedLead.firstName} {selectedLead.lastName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Company</label>
                  <p className="text-sm text-gray-900">{selectedLead.company}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{selectedLead.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-sm text-gray-900">{selectedLead.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <Badge className={getStatusColor(selectedLead.leadStatus || 'new')}>
                    {selectedLead.leadStatus}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Lead Score</label>
                  <p className={`text-sm font-medium ${getScoreColor(selectedLead.leadScore || 0)}`}>
                    {selectedLead.leadScore}/100
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Estimated Value</label>
                  <p className="text-sm text-gray-900">{formatCurrency(selectedLead.estimatedValue)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Overall Grade</label>
                  <p className="text-sm text-gray-900">{selectedLead.overallGrade || 'Not assessed'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Follow-up Intent</label>
                  <p className="text-sm text-gray-900 capitalize">{selectedLead.followUpIntent || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Created</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedLead.createdAt)}</p>
                </div>
              </div>
              {selectedLead.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Notes</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedLead.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Status Modal */}
      <Dialog open={showStatusModal} onOpenChange={setShowStatusModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Lead Status</DialogTitle>
            <DialogDescription>
              Update the status for {selectedLead?.firstName} {selectedLead?.lastName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Current Status</label>
              <p className="text-sm text-gray-600">{selectedLead?.leadStatus || 'new'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">New Status</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowStatusModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleStatusUpdate}
                disabled={updateLeadMutation.isPending}
              >
                {updateLeadMutation.isPending ? 'Updating...' : 'Update Status'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}