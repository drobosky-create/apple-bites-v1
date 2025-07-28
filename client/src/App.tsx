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
import AdminDashboard from "@/pages/admin-dashboard";
import Dashboard from "@/pages/dashboard";
import AssessmentResults from "@/pages/assessment-results";
import Profile from "@/pages/profile";
import PastAssessments from "@/pages/past-assessments";
import SignupPage from "@/pages/signup";
import LoginPage from "@/pages/login";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white' }}>
      <Switch>
        {/* Authentication routes */}
        <Route path="/signup" component={SignupPage} />
        <Route path="/login" component={LoginPage} />
        
        {/* Core routes only */}
        <Route path="/" component={Dashboard} />
        <Route path="/dashboard" component={Dashboard} />
        
        {/* Assessment pages */}
        <Route path="/assessment/free" component={FreeAssessment} />
        <Route path="/assessment/paid" component={GrowthExitAssessment} />
        <Route path="/assessment-results/:id" component={AssessmentResults} />
        <Route path="/value-calculator" component={ValueCalculator} />
        <Route path="/profile" component={Profile} />
        <Route path="/past-assessments" component={PastAssessments} />
        
        {/* Admin/Team pages */}
        <Route path="/admin" component={AdminDashboard} />
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
