import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import MaterialWrapper from "@/components/MaterialWrapper";
import { AdminAuthProvider } from "@/hooks/use-admin-auth";
import { TeamAuthProvider } from "@/hooks/use-team-auth";
import { useAuth } from "@/hooks/useAuth";
import FreeAssessment from "@/pages/free-assessment";
import GrowthExitAssessment from "@/pages/strategic-assessment";
import AnalyticsDashboard from "@/pages/analytics-dashboard";
import ValueCalculator from "@/pages/value-calculator";
import LeadsDashboard from "@/pages/leads-dashboard";
import TeamDashboard from "@/pages/team-dashboard";
import Dashboard from "@/pages/dashboard";
import SimpleDashboard from "@/pages/dashboard-simple";
import WorkingDashboard from "@/pages/dashboard-working";
import AssessmentResults from "@/pages/assessment-results";
import MaterialDashboardDemo from "@/pages/material-dashboard-demo";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white' }}>
      <Switch>
        {/* Core routes only */}
        <Route path="/" component={WorkingDashboard} />
        <Route path="/dashboard" component={WorkingDashboard} />
        <Route path="/dashboard/:tier" component={WorkingDashboard} />
        <Route path="/dashboard-old" component={Dashboard} />
        <Route path="/dashboard-simple" component={SimpleDashboard} />
        
        {/* Assessment pages */}
        <Route path="/assessment/free" component={FreeAssessment} />
        <Route path="/assessment/paid" component={GrowthExitAssessment} />
        <Route path="/results/:id" component={AssessmentResults} />
        <Route path="/value-calculator" component={ValueCalculator} />
        <Route path="/material-demo" component={MaterialDashboardDemo} />
        
        {/* Admin/Team pages */}
        <Route path="/admin" component={TeamDashboard} />
        <Route path="/admin/analytics" component={AnalyticsDashboard} />
        <Route path="/admin/leads" component={LeadsDashboard} />
        <Route path="/team" component={TeamDashboard} />
        
        {/* Fallback */}
        <Route component={Dashboard} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MaterialWrapper>
        <AdminAuthProvider>
          <TeamAuthProvider>
            <Router />
          </TeamAuthProvider>
        </AdminAuthProvider>
      </MaterialWrapper>
    </QueryClientProvider>
  );
}

export default App;
