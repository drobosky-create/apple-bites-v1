import { useState } from "react";
import { 
  Box, 
  Card, 
  CardContent, 
  Grid, 
  TextField, 
  MenuItem,
  ButtonGroup,
  Button
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts";
import MDBox from "@/components/MDBox";
import MDTypography from "@/components/MDTypography";
import { 
  TrendingUp, 
  AttachMoney, 
  BusinessCenter,
  CheckCircle,
  Schedule,
  Assignment
} from "@mui/icons-material";

interface Deal {
  id: number;
  title: string;
  value?: number;
  stage: string;
  expectedCloseDate?: string;
  firmName?: string;
  contactName?: string;
  probability?: number;
  createdAt: string;
  updatedAt: string;
}

const STAGE_COLORS = [
  "#2196f3", "#ff9800", "#9c27b0", "#f44336", "#4caf50", "#757575"
];

const STAGE_LABELS: Record<string, string> = {
  "prospecting": "Prospecting",
  "qualified": "Qualified",
  "proposal": "Proposal",
  "negotiation": "Negotiation",
  "closed-won": "Closed Won",
  "closed-lost": "Closed Lost"
};

function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = "info",
  trend
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: any;
  color?: string;
  trend?: { value: number; label: string };
}) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <MDBox display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <MDBox>
            <MDTypography variant="body2" color="text" mb={1}>
              {title}
            </MDTypography>
            <MDTypography variant="h4" fontWeight="bold" color={color}>
              {value}
            </MDTypography>
            {subtitle && (
              <MDTypography variant="caption" color="text">
                {subtitle}
              </MDTypography>
            )}
          </MDBox>
          <Icon sx={{ fontSize: 40, color: `${color}.main`, opacity: 0.7 }} />
        </MDBox>
        
        {trend && (
          <MDBox display="flex" alignItems="center" gap={1}>
            <TrendingUp 
              sx={{ 
                fontSize: 16, 
                color: trend.value >= 0 ? 'success.main' : 'error.main' 
              }} 
            />
            <MDTypography 
              variant="caption" 
              color={trend.value >= 0 ? 'success' : 'error'}
              fontWeight="medium"
            >
              {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
            </MDTypography>
          </MDBox>
        )}
      </CardContent>
    </Card>
  );
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function Reports() {
  const [dateRange, setDateRange] = useState('30');
  const [viewType, setViewType] = useState('overview');

  // Fetch deals
  const { data: deals = [], isLoading } = useQuery({
    queryKey: ['/api/crm/deals'],
    enabled: true,
  });

  if (isLoading) {
    return (
      <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <MDTypography>Loading reports...</MDTypography>
      </MDBox>
    );
  }

  // Calculate metrics
  const totalDeals = deals.length;
  const totalValue = deals.reduce((sum: number, deal: Deal) => sum + (deal.value || 0), 0);
  const avgDealValue = totalDeals > 0 ? totalValue / totalDeals : 0;
  const closedWonDeals = deals.filter((deal: Deal) => deal.stage === 'closed-won').length;
  const closureRate = totalDeals > 0 ? (closedWonDeals / totalDeals) * 100 : 0;

  // Pipeline data by stage
  const pipelineData = Object.entries(STAGE_LABELS).map(([stage, label]) => {
    const stageDeals = deals.filter((deal: Deal) => deal.stage === stage);
    const stageValue = stageDeals.reduce((sum: number, deal: Deal) => sum + (deal.value || 0), 0);
    return {
      stage: label,
      count: stageDeals.length,
      value: stageValue,
      percentage: totalDeals > 0 ? (stageDeals.length / totalDeals) * 100 : 0
    };
  });

  // Monthly trend data (simulated for demo)
  const monthlyData = [
    { month: 'Jan', deals: 12, value: 580000 },
    { month: 'Feb', deals: 15, value: 720000 },
    { month: 'Mar', deals: 18, value: 890000 },
    { month: 'Apr', deals: 22, value: 1100000 },
    { month: 'May', deals: 25, value: 1250000 },
    { month: 'Jun', deals: 28, value: 1400000 },
  ];

  return (
    <MDBox>
      {/* Header with Filters */}
      <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <MDBox>
          <MDTypography variant="h5" fontWeight="bold" mb={1}>
            CRM Reports & Analytics
          </MDTypography>
          <MDTypography variant="body2" color="text">
            Track your sales performance and pipeline metrics
          </MDTypography>
        </MDBox>
        
        <MDBox display="flex" gap={2} alignItems="center">
          <TextField
            select
            label="Date Range"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            size="small"
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="7">Last 7 days</MenuItem>
            <MenuItem value="30">Last 30 days</MenuItem>
            <MenuItem value="90">Last 90 days</MenuItem>
            <MenuItem value="365">Last year</MenuItem>
          </TextField>

          <ButtonGroup size="small">
            <Button 
              variant={viewType === 'overview' ? 'contained' : 'outlined'}
              onClick={() => setViewType('overview')}
            >
              Overview
            </Button>
            <Button 
              variant={viewType === 'pipeline' ? 'contained' : 'outlined'}
              onClick={() => setViewType('pipeline')}
            >
              Pipeline
            </Button>
            <Button 
              variant={viewType === 'trends' ? 'contained' : 'outlined'}
              onClick={() => setViewType('trends')}
            >
              Trends
            </Button>
          </ButtonGroup>
        </MDBox>
      </MDBox>

      {/* Key Metrics */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Deals"
            value={totalDeals}
            subtitle="Active in pipeline"
            icon={BusinessCenter}
            color="info"
            trend={{ value: 12, label: "vs last month" }}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Pipeline Value"
            value={formatCurrency(totalValue)}
            subtitle="Across all stages"
            icon={AttachMoney}
            color="success"
            trend={{ value: 8, label: "vs last month" }}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Average Deal Size"
            value={formatCurrency(avgDealValue)}
            subtitle="Per deal"
            icon={TrendingUp}
            color="warning"
            trend={{ value: -3, label: "vs last month" }}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Closure Rate"
            value={`${closureRate.toFixed(1)}%`}
            subtitle={`${closedWonDeals} deals closed`}
            icon={CheckCircle}
            color="success"
            trend={{ value: 15, label: "vs last month" }}
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      {viewType === 'overview' && (
        <Grid container spacing={3}>
          {/* Pipeline by Stage */}
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <MDTypography variant="h6" fontWeight="bold" mb={3}>
                  Pipeline by Stage
                </MDTypography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={pipelineData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="stage" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => [
                          name === 'count' ? `${value} deals` : formatCurrency(value as number),
                          name === 'count' ? 'Deals' : 'Value'
                        ]}
                      />
                      <Bar dataKey="count" fill="#2196f3" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Stage Distribution */}
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <MDTypography variant="h6" fontWeight="bold" mb={3}>
                  Stage Distribution
                </MDTypography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pipelineData}
                        dataKey="count"
                        nameKey="stage"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ stage, percentage }) => 
                          percentage > 0 ? `${stage}: ${percentage.toFixed(0)}%` : ''
                        }
                      >
                        {pipelineData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={STAGE_COLORS[index % STAGE_COLORS.length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {viewType === 'pipeline' && (
        <Grid container spacing={3}>
          {/* Pipeline Value by Stage */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <MDTypography variant="h6" fontWeight="bold" mb={3}>
                  Pipeline Value by Stage
                </MDTypography>
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={pipelineData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
                      <YAxis dataKey="stage" type="category" width={100} />
                      <Tooltip formatter={(value) => [formatCurrency(value as number), 'Value']} />
                      <Bar dataKey="value" fill="#4caf50" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {viewType === 'trends' && (
        <Grid container spacing={3}>
          {/* Monthly Trends */}
          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <MDTypography variant="h6" fontWeight="bold" mb={3}>
                  Monthly Deal Count
                </MDTypography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="deals" 
                        stroke="#2196f3" 
                        strokeWidth={3}
                        dot={{ fill: "#2196f3", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <MDTypography variant="h6" fontWeight="bold" mb={3}>
                  Monthly Pipeline Value
                </MDTypography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                      <Tooltip formatter={(value) => [formatCurrency(value as number), 'Value']} />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#4caf50" 
                        fill="#4caf50"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </MDBox>
  );
}