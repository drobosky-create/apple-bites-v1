import { useQuery } from "@tanstack/react-query";





import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { TrendingUp, Users, DollarSign, FileText, Download, Eye, LogOut, ArrowLeft } from "lucide-react";
import { ValuationAssessment } from "@shared/schema";
import AdminLogin from "@/components/admin-login";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { useLocation } from "wouter";

export default function AnalyticsDashboard() {
  const { isAuthenticated, isLoading: authLoading, login, logout } = useAdminAuth();
  const [, navigate] = useLocation();

  const { data: assessments, isLoading } = useQuery<ValuationAssessment[]>({
    queryKey: ['/api/analytics/assessments'],
    enabled: isAuthenticated // Only fetch when authenticated
  });

  // Show authentication loading state
  if (authLoading) {
    return (
      <div >
        <div >
          <div ></div>
          <p >Checking authentication...</p>
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
      <div >
        <div >
          <div ></div>
          <div >
            {[...Array(4)].map((_, i) => (
              <div key={i} ></div>
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

  const pieColors = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div >
      <div >
        <div >
          <Button 
            variant="outline" 
            onClick={() => navigate('/team')}
            
          >
            <ArrowLeft  />
            <span >Back to Dashboard</span>
            <span >Back</span>
          </Button>
          <div >
            <h1 >Analytics Dashboard</h1>
            <p >Comprehensive insights into business valuations and lead performance</p>
          </div>
        </div>
        <Button variant="outline" onClick={logout} >
          <LogOut  />
          Logout
        </Button>
      </div>

      <div >
        <Card>
          <CardHeader >
            <CardTitle >Total Assessments</CardTitle>
            <Users  />
          </CardHeader>
          <CardContent>
            <div >{totalAssessments}</div>
            <p >
              {completedAssessments} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader >
            <CardTitle >Avg Valuation</CardTitle>
            <TrendingUp  />
          </CardHeader>
          <CardContent>
            <div >
              ${Math.round(avgValuation).toLocaleString()}
            </div>
            <p >
              Mid-point estimate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader >
            <CardTitle >Total EBITDA</CardTitle>
            <DollarSign  />
          </CardHeader>
          <CardContent>
            <div >
              ${Math.round(totalEBITDA).toLocaleString()}
            </div>
            <p >
              Combined adjusted EBITDA
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader >
            <CardTitle >Completion Rate</CardTitle>
            <FileText  />
          </CardHeader>
          <CardContent>
            <div >
              {totalAssessments > 0 ? Math.round((completedAssessments / totalAssessments) * 100) : 0}%
            </div>
            <p >
              Successfully processed
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assessments">All Assessments</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" >
          <div >
            <Card >
              <CardHeader>
                <CardTitle >Follow-up Intent</CardTitle>
                <CardDescription >Distribution of client interest levels</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <defs>
                      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#A855F7" />
                      </linearGradient>
                      <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06B6D4" />
                        <stop offset="100%" stopColor="#0891B2" />
                      </linearGradient>
                      <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                      <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F59E0B" />
                        <stop offset="100%" stopColor="#D97706" />
                      </linearGradient>
                      <linearGradient id="gradient5" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#EF4444" />
                        <stop offset="100%" stopColor="#DC2626" />
                      </linearGradient>
                    </defs>
                    <Pie
                      data={Object.entries(followUpData).map(([key, value]) => ({ name: key, value }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={110}
                      innerRadius={45}
                      fill="#8884d8"
                      dataKey="value"
                      stroke="#ffffff"
                      strokeWidth={3}
                    >
                      {Object.entries(followUpData).map((_, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={`url(#gradient${index + 1})`}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                        padding: '12px 16px',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card >
              <CardHeader>
                <CardTitle >Overall Score Distribution</CardTitle>
                <CardDescription >Business performance grades</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={380}>
                  <BarChart 
                    data={Object.entries(scoreDistribution).map(([key, value]) => ({ grade: key, count: value }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366F1" />
                        <stop offset="50%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#A855F7" />
                      </linearGradient>
                      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="rgba(0,0,0,0.1)" />
                      </filter>
                    </defs>
                    <CartesianGrid 
                      strokeDasharray="2 2" 
                      stroke="#E5E7EB" 
                      opacity={0.6}
                      horizontal={true}
                      vertical={false}
                    />
                    <XAxis 
                      dataKey="grade" 
                      stroke="#6B7280" 
                      fontSize={13}
                      fontWeight="600"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#374151' }}
                    />
                    <YAxis 
                      stroke="#6B7280" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#6B7280' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.98)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        padding: '16px',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="url(#barGradient)"
                      radius={[8, 8, 0, 0]}
                      filter="url(#shadow)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assessments">
          <Card >
            <CardHeader>
              <CardTitle >All Valuations</CardTitle>
              <CardDescription >Complete list of business assessments</CardDescription>
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
                    <TableRow key={assessment.id} >
                      <TableCell >{assessment.company}</TableCell>
                      <TableCell>
                        <div>
                          <div>{assessment.firstName} {assessment.lastName}</div>
                          <div >{assessment.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        ${Math.round(parseFloat(assessment.midEstimate || "0")).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        ${Math.round(parseFloat(assessment.adjustedEbitda || "0")).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div >
                          {assessment.overallScore}
                        </div>
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
                        <div >
                          <Button size="sm" variant="outline">
                            <Eye  />
                          </Button>
                          {assessment.pdfUrl && (
                            <Button size="sm" variant="outline">
                              <Download  />
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
          <Card >
            <CardHeader>
              <CardTitle >Assessment Trends</CardTitle>
              <CardDescription >Valuations over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={420}>
                <LineChart 
                  data={Object.entries(valuationByMonth).map(([month, count]) => ({ month, count }))}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#06B6D4" />
                      <stop offset="30%" stopColor="#3B82F6" />
                      <stop offset="70%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#EC4899" />
                    </linearGradient>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
                      <stop offset="100%" stopColor="rgba(59, 130, 246, 0.05)" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge> 
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <CartesianGrid 
                    strokeDasharray="1 3" 
                    stroke="#E5E7EB" 
                    opacity={0.4}
                    horizontal={true}
                    vertical={false}
                  />
                  <XAxis 
                    dataKey="month" 
                    stroke="#6B7280" 
                    fontSize={12}
                    fontWeight="500"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#374151' }}
                  />
                  <YAxis 
                    stroke="#6B7280" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#6B7280' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.98)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                      padding: '16px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="url(#lineGradient)" 
                    strokeWidth={4}
                    dot={{ 
                      fill: '#3B82F6', 
                      strokeWidth: 3, 
                      r: 7,
                      stroke: '#ffffff'
                    }}
                    activeDot={{ 
                      r: 10, 
                      stroke: '#3B82F6', 
                      strokeWidth: 3, 
                      fill: '#ffffff',
                      filter: 'url(#glow)'
                    }}
                    filter="url(#glow)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}