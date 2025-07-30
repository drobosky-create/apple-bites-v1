import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import MaterialWrapper from "@/components/MaterialWrapper";
import { AdminAuthProvider } from "@/hooks/use-admin-auth";
import { TeamAuthProvider } from "@/hooks/use-team-auth";
import { useAuth } from "@/hooks/useAuth";
import FreeAssessment from "@/pages/free-assessment";
import GrowthExitAssessment from "@/pages/strategic-assessment-new-clean";
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
  
  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>Loading...</div>
      </div>
    );
  }
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white' }}>
      <Switch>
        {/* Authentication routes - always accessible */}
        <Route path="/signup" component={SignupPage} />
        <Route path="/login" component={LoginPage} />
        
        {/* Protected routes - redirect to login if not authenticated */}
        <Route path="/">
          {isAuthenticated ? <Dashboard /> : <LoginPage />}
        </Route>
        <Route path="/dashboard">
          {isAuthenticated ? <Dashboard /> : <LoginPage />}
        </Route>
        
        {/* Assessment pages - protected */}
        <Route path="/assessment/free">
          {isAuthenticated ? <FreeAssessment /> : <LoginPage />}
        </Route>
        <Route path="/assessment/paid">
          {isAuthenticated ? <GrowthExitAssessment /> : <LoginPage />}
        </Route>
        <Route path="/assessment-results/:id">
          {isAuthenticated ? <AssessmentResults /> : <LoginPage />}
        </Route>
        <Route path="/value-calculator">
          {isAuthenticated ? <ValueCalculator /> : <LoginPage />}
        </Route>
        <Route path="/profile">
          {isAuthenticated ? <Profile /> : <LoginPage />}
        </Route>
        <Route path="/past-assessments">
          {isAuthenticated ? <PastAssessments /> : <LoginPage />}
        </Route>
        
        {/* Admin/Team pages - protected */}
        <Route path="/admin">
          {isAuthenticated ? <AdminDashboard /> : <LoginPage />}
        </Route>
        <Route path="/admin/analytics">
          {isAuthenticated ? <AnalyticsDashboard /> : <LoginPage />}
        </Route>
        <Route path="/admin/leads">
          {isAuthenticated ? <LeadsDashboard /> : <LoginPage />}
        </Route>
        <Route path="/team">
          {isAuthenticated ? <TeamDashboard /> : <LoginPage />}
        </Route>
        
        {/* Fallback - redirect to login if not authenticated */}
        <Route>
          {isAuthenticated ? <Dashboard /> : <LoginPage />}
        </Route>
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
