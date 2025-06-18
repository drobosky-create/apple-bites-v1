import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Plus, Edit, Trash2, Shield, LogOut, UserPlus, Settings } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertTeamMemberSchema, type InsertTeamMember, type TeamMember } from '@shared/schema';
import TeamLogin from '@/components/team-login';
import { useTeamAuth } from '@/hooks/use-team-auth';
import { useToast } from '@/hooks/use-toast';
import PasswordChangeForm from '@/components/password-change-form';
import PasswordChangeModal from '@/components/password-change-modal';
import appleBitesLogoImage from '@assets/1_1750197353067.png';

import _2 from "@assets/2.png";

export default function TeamDashboard() {
  const { user, isAuthenticated, isLoading, hasRole, logout, login } = useTeamAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Check if user needs to change password on mount
  useEffect(() => {
    if (user && user.mustChangePassword) {
      setShowPasswordChangeModal(true);
    }
  }, [user]);

  const { data: teamMembers, isLoading: membersLoading } = useQuery<TeamMember[]>({
    queryKey: ['/api/team/members'],
    enabled: isAuthenticated && hasRole('admin'),
  });

  const form = useForm<InsertTeamMember>({
    resolver: zodResolver(insertTeamMemberSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      role: 'member',
      password: '',
    },
  });

  const createMemberMutation = useMutation({
    mutationFn: async (data: InsertTeamMember) => {
      const response = await fetch('/api/team/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create team member');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/team/members'] });
      setIsAddDialogOpen(false);
      form.reset();
      toast({
        title: 'Success',
        description: 'Team member created successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateMemberMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<TeamMember> }) => {
      const response = await fetch(`/api/team/members/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update team member');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/team/members'] });
      toast({
        title: 'Success',
        description: 'Team member updated successfully',
      });
    },
  });

  const deleteMemberMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/team/members/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to delete team member');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/team/members'] });
      toast({
        title: 'Success',
        description: 'Team member deleted successfully',
      });
    },
  });

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
    return <TeamLogin onLoginSuccess={(userData) => {
      // Update auth state properly
      login(userData);
      queryClient.invalidateQueries({ queryKey: ['/api/team/me'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/status'] });
    }} />;
  }

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      'admin': 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-sm',
      'manager': 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm',
      'member': 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm',
    };
    return colors[role] || 'bg-gradient-to-r from-slate-400 to-slate-500 text-white shadow-sm';
  };

  const onSubmit = (data: InsertTeamMember) => {
    createMemberMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Navigation */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <img 
              src={_2} 
              alt="Apple Bites Business Assessment" 
              className="h-10 sm:h-12 w-auto"
            />
            <div className="border-l border-slate-300 pl-4">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Team Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Link href="/admin/leads" className="flex-1 sm:flex-none">
              <Button 
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto text-sm"
              >
                Leads
              </Button>
            </Link>
            <Link href="/admin/analytics" className="flex-1 sm:flex-none">
              <Button 
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto text-sm"
              >
                Analytics
              </Button>
            </Link>
          </div>
        </div>

        {/* User Info and Actions */}
        <div className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-4 bg-slate-50 rounded-xl shadow-sm border border-slate-200 px-4 sm:px-6 lg:px-8 py-4 w-full lg:w-auto flex-1 lg:flex-initial">
            <div className="text-sm text-slate-700">
              <div className="font-semibold text-base sm:text-lg lg:text-xl">Welcome, {user?.firstName} {user?.lastName}</div>
              <div className="flex items-center gap-2 mt-1">
                <Shield className="w-3 h-3 text-slate-400" />
                <Badge className={`${getRoleBadgeColor(user?.role || '')} text-xs lg:text-sm`}>
                  {user?.role?.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 w-full sm:w-auto lg:w-auto flex-shrink-0">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 flex-1 sm:flex-none text-sm">
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Change Password</span>
                  <span className="sm:hidden">Password</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-white border-slate-300 shadow-lg">
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                  <DialogDescription>
                    Update your account password for security.
                  </DialogDescription>
                </DialogHeader>
                <PasswordChangeForm userId={user?.id} />
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={logout} className="flex items-center gap-2 hover:bg-red-50 hover:border-red-200 flex-1 sm:flex-none text-sm">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Role-specific content */}
        {hasRole('admin') ? (
          <>
            {/* Admin Dashboard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8">
              <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/50 hover:shadow-md transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-slate-600">Total Members</CardTitle>
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">{teamMembers?.length || 0}</div>
                  <p className="text-xs text-slate-500 mt-1">registered accounts</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100/50 hover:shadow-md transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-slate-600">Active Members</CardTitle>
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <Shield className="h-5 w-5 text-emerald-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-emerald-700">
                    {teamMembers?.filter(m => m.isActive).length || 0}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">currently active</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100/50 hover:shadow-md transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-slate-600">Admins</CardTitle>
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Settings className="h-5 w-5 text-purple-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-700">
                    {teamMembers?.filter(m => m.role === 'admin').length || 0}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">with admin access</p>
                </CardContent>
              </Card>
            </div>

            {/* Team Members Management */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-t-lg border-b border-slate-200">
                <div>
                  <CardTitle className="text-xl text-slate-900">Team Members</CardTitle>
                  <p className="text-sm text-slate-600 mt-1">Manage access and permissions</p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2 slate-gradient text-white shadow-sm hover:shadow-md transition-all duration-200">
                      <UserPlus className="w-4 h-4" />
                      Add Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md bg-white max-w-[95vw] mx-auto">
                    <DialogHeader>
                      <DialogTitle>Add Team Member</DialogTitle>
                      <DialogDescription>
                        Create a new team member account with appropriate role permissions.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                  <Input {...field} className="bg-slate-50 border-slate-300 focus:bg-slate-100 focus:border-blue-500 focus:ring-blue-500/20" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                  <Input {...field} className="bg-slate-50 border-slate-300 focus:bg-slate-100 focus:border-blue-500 focus:ring-blue-500/20" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input {...field} type="email" className="bg-slate-50 border-slate-300 focus:bg-slate-100 focus:border-blue-500 focus:ring-blue-500/20" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="role"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Role</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-white border-[#1a2332] shadow-lg">
                                  <SelectItem value="member" className="hover:bg-[#1a2332]/10 focus:bg-[#1a2332]/10">Member</SelectItem>
                                  <SelectItem value="manager" className="hover:bg-[#1a2332]/10 focus:bg-[#1a2332]/10">Manager</SelectItem>
                                  <SelectItem value="admin" className="hover:bg-[#1a2332]/10 focus:bg-[#1a2332]/10">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input {...field} type="password" className="bg-white border-slate-300 focus:bg-slate-100 focus:border-blue-500 focus:ring-blue-500/20" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex flex-col sm:flex-row justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsAddDialogOpen(false)}
                            className="w-full sm:w-auto"
                          >
                            Cancel
                          </Button>
                          <Button type="submit" disabled={createMemberMutation.isPending} className="w-full sm:w-auto">
                            {createMemberMutation.isPending ? 'Creating...' : 'Create Member'}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="p-0">
                {membersLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p>Loading team members...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50 hover:bg-slate-50">
                          <TableHead className="text-slate-900 bg-slate-50 font-semibold min-w-[120px] lg:w-auto">Name</TableHead>
                          <TableHead className="text-slate-900 bg-slate-50 font-semibold min-w-[200px] lg:w-auto">Email</TableHead>
                          <TableHead className="text-slate-900 bg-slate-50 font-semibold min-w-[100px] lg:w-auto">Role</TableHead>
                          <TableHead className="text-slate-900 bg-slate-50 font-semibold min-w-[100px] lg:w-auto">Status</TableHead>
                          <TableHead className="text-slate-900 bg-slate-50 font-semibold min-w-[120px] lg:w-auto">Last Login</TableHead>
                          <TableHead className="text-slate-900 bg-slate-50 font-semibold min-w-[140px] lg:w-auto">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {membersLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            Loading team members...
                          </TableCell>
                        </TableRow>
                      ) : !teamMembers || teamMembers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            {!isAuthenticated ? 'Please log in to view team members' : 
                             !hasRole('admin') ? 'Admin access required to view team members' :
                             'No team members found. Create your first team member to get started.'}
                          </TableCell>
                        </TableRow>
                      ) : (
                        teamMembers.map((member) => (
                          <TableRow key={member.id} className="hover:bg-slate-50/50 border-b border-blue-200">
                            <TableCell className="font-medium">
                              {member.firstName} {member.lastName}
                            </TableCell>
                            <TableCell>{member.email}</TableCell>
                            <TableCell>
                              <Badge className={getRoleBadgeColor(member.role)}>
                                {member.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={member.isActive ? 'default' : 'secondary'}>
                                {member.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {member.lastLoginAt
                                ? new Date(member.lastLoginAt).toLocaleDateString()
                                : 'Never'}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    updateMemberMutation.mutate({
                                      id: member.id,
                                      updates: { isActive: !member.isActive },
                                    })
                                  }
                                  className="text-xs lg:text-sm whitespace-nowrap"
                                >
                                  {member.isActive ? 'Deactivate' : 'Activate'}
                                </Button>
                                {member.id !== user?.id && (
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-red-600 hover:text-red-700 text-xs lg:text-sm"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                        <span className="hidden lg:inline ml-1">Delete</span>
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure you want to delete this user?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This action cannot be undone. This will permanently delete {member.firstName} {member.lastName}'s account and remove all of their data from our servers.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => deleteMemberMutation.mutate(member.id)}
                                          className="bg-red-600 hover:bg-red-700"
                                        >
                                          Delete User
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Manager/Member Dashboard */}
            <Card>
              <CardHeader>
                <CardTitle>Welcome to the Team Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  You are logged in as a {user?.role}. Your permissions allow you to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  {user?.role === 'manager' ? (
                    <>
                      <li>View team analytics and reports</li>
                      <li>Manage leads and customer interactions</li>
                      <li>Access valuation assessments</li>
                    </>
                  ) : (
                    <>
                      <li>View assigned leads and tasks</li>
                      <li>Access customer support tools</li>
                      <li>View valuation reports</li>
                    </>
                  )}
                </ul>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}