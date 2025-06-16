import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Search, User, Mail, Phone, Building, Calendar, TrendingUp, LogOut, ArrowLeft, Eye, Edit, Trash2, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { Lead } from '@shared/schema';
import AdminLogin from '@/components/admin-login';
import { useAdminAuth } from '@/hooks/use-admin-auth';

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
      return apiRequest(`/api/leads/${id}`, 'PATCH', { status });
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
      return apiRequest(`/api/leads/${id}`, 'DELETE');
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
      'new': 'bg-blue-100 text-blue-800',
      'contacted': 'bg-emerald-100 text-emerald-800',
      'qualified': 'bg-green-100 text-green-800',
      'converted': 'bg-purple-100 text-purple-800',
      'closed': 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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
        <div className="mb-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Lead Management</h1>
              <p className="text-gray-600">Track and manage leads from valuation assessments</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/valuation-form'}
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Valuation Form
            </Button>
            <Button variant="outline" onClick={logout} className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
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
            <Card key={lead.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        {lead.firstName} {lead.lastName}
                      </h3>
                    </div>
                    <Badge className={getStatusColor(lead.leadStatus || 'new')}>
                      {lead.leadStatus}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      <span className={`font-medium ${getScoreColor(lead.leadScore || 0)}`}>
                        {lead.leadScore}/100
                      </span>
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
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Update Status
                  </Button>
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
    </div>
  );
}