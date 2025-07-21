import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminAuthProvider } from "@/hooks/use-admin-auth";
import { TeamAuthProvider } from "@/hooks/use-team-auth";
import { useAuth } from "@/hooks/useAuth";
import { Footer } from "@/components/Footer";


import RedirectHome from "@/pages/redirect-home";
import ArgonLogin from "@/pages/argon-login";
import ValuationForm from "@/pages/valuation-form";
import FreeAssessment from "@/pages/free-assessment";
import GrowthExitAssessment from "@/pages/strategic-assessment";
import AnalyticsDashboard from "@/pages/analytics-dashboard";
import ValueCalculator from "@/pages/value-calculator";
import LeadsDashboard from "@/pages/leads-dashboard";
import TeamDashboard from "@/pages/team-dashboard";
import ReportSelectionPage from "@/pages/report-selection";
import UserDashboardArgon from "@/pages/user-dashboard-argon";
import ArgonDemo from "@/pages/argon-demo";
import FreeTierDemo from "@/pages/free-tier-demo";
import AssessmentResults from "@/pages/assessment-results";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  
  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ backgroundColor: 'white', margin: 0, padding: 0 }}>
      <Switch>
        {/* Standalone pages without header/navigation */}
        {isLoading || !isAuthenticated ? (
          <>
            <Route path="/" component={ArgonLogin} />
            <Route path="/dashboard" component={ArgonLogin} />
            <Route path="/dashboard/:tier" component={ArgonLogin} />
          </>
        ) : (
          <>
            <Route path="/" component={UserDashboardArgon} />
            <Route path="/dashboard/:tier" component={UserDashboardArgon} />
            <Route path="/dashboard" component={UserDashboardArgon} />
          </>
        )}
        <Route path="/login" component={ArgonLogin} />
        <Route path="/redirect" component={RedirectHome} />

        <Route path="/argon-demo" component={ArgonDemo} />
        <Route path="/free-tier-demo" component={FreeTierDemo} />
        <Route path="/assessment-results" component={AssessmentResults} />
        
        {/* Assessment pages - standalone with built-in headers */}
        <Route path="/assessment/free" component={FreeAssessment} />
        <Route path="/assessment/paid" component={GrowthExitAssessment} />
        <Route path="/valuation" component={ValuationForm} />
        <Route path="/results" component={AssessmentResults} />
        <Route path="/results/:id" component={AssessmentResults} />
        <Route path="/report-selection/:id" component={ReportSelectionPage} />
        <Route path="/value-calculator" component={ValueCalculator} />
        <Route path="/admin" component={TeamDashboard} />
        <Route path="/admin/analytics" component={AnalyticsDashboard} />
        <Route path="/admin/leads" component={LeadsDashboard} />
        <Route path="/team" component={TeamDashboard} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <TeamAuthProvider>
          <TooltipProvider>
            <Router />
            <Toaster />
          </TooltipProvider>
        </TeamAuthProvider>
      </AdminAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
