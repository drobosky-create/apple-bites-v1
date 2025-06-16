import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { TrendingUp, Users, DollarSign, FileText, Download, Eye, LogOut } from "lucide-react";
import { ValuationAssessment } from "@shared/schema";
import AdminLogin from "@/components/admin-login";
import { useAdminAuth } from "@/hooks/use-admin-auth";

export default function AnalyticsDashboard() {
  const { isAuthenticated, isLoading: authLoading, login, logout } = useAdminAuth();

  const { data: assessments, isLoading } = useQuery<ValuationAssessment[]>({
    queryKey: ['/api/analytics/assessments'],
    enabled: isAuthenticated // Only fetch when authenticated
  });

  // Show authentication loading state
  if (authLoading) {
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

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const totalAssessments = assessments?.length || 0;
  const avgValuation = totalAssessments > 0 ? 
    (assessments?.reduce((sum, a) => sum + parseFloat(a.midEstimate || "0"), 0) || 0) / totalAssessments : 0;
  const totalEBITDA = assessments?.reduce((sum, a) => sum + parseFloat(a.adjustedEbitda || "0"), 0) || 0;
  const completedAssessments = assessments?.filter(a => a.isProcessed).length || 0;

  const followUpData = assessments?.reduce((acc, a) => {
    const intent = a.followUpIntent;
    acc[intent] = (acc[intent] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const scoreDistribution = assessments?.reduce((acc, a) => {
    const score = a.overallScore?.charAt(0) || 'C';
    acc[score] = (acc[score] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const valuationByMonth = assessments?.reduce((acc, a) => {
    const month = new Date(a.createdAt || '').toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const pieColors = ['#64748B', '#94A3B8', '#CBD5E1', '#E2E8F0', '#F1F5F9'];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Analytics Dashboard</h1>
          <p className="text-slate-600 mt-2">Comprehensive insights into business valuations and lead performance</p>
        </div>
        <Button variant="outline" onClick={logout} className="flex items-center gap-2">
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssessments}</div>
            <p className="text-xs text-muted-foreground">
              {completedAssessments} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Valuation</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${Math.round(avgValuation).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Mid-point estimate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total EBITDA</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${Math.round(totalEBITDA).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Combined adjusted EBITDA
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalAssessments > 0 ? Math.round((completedAssessments / totalAssessments) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully processed
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assessments">All Assessments</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Follow-up Intent</CardTitle>
                <CardDescription>Distribution of client interest levels</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={Object.entries(followUpData).map(([key, value]) => ({ name: key, value }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {Object.entries(followUpData).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Overall Score Distribution</CardTitle>
                <CardDescription>Business performance grades</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={Object.entries(scoreDistribution).map(([key, value]) => ({ grade: key, count: value }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="grade" stroke="#64748B" />
                    <YAxis stroke="#64748B" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#94A3B8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assessments">
          <Card>
            <CardHeader>
              <CardTitle>All Valuations</CardTitle>
              <CardDescription>Complete list of business assessments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Valuation</TableHead>
                    <TableHead>EBITDA</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Follow-up</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assessments?.map((assessment) => (
                    <TableRow key={assessment.id}>
                      <TableCell className="font-medium">{assessment.company}</TableCell>
                      <TableCell>
                        <div>
                          <div>{assessment.firstName} {assessment.lastName}</div>
                          <div className="text-sm text-slate-500">{assessment.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        ${Math.round(parseFloat(assessment.midEstimate || "0")).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        ${Math.round(parseFloat(assessment.adjustedEbitda || "0")).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={assessment.overallScore?.startsWith('A') ? 'default' : 'secondary'}>
                          {assessment.overallScore}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={assessment.followUpIntent === 'yes' ? 'default' : 'outline'}>
                          {assessment.followUpIntent}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(assessment.createdAt || '').toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {assessment.pdfUrl && (
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Trends</CardTitle>
              <CardDescription>Valuations over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={Object.entries(valuationByMonth).map(([month, count]) => ({ month, count }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" stroke="#64748B" />
                  <YAxis stroke="#64748B" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#64748B" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}