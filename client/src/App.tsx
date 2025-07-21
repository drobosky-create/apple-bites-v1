import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminAuthProvider } from "@/hooks/use-admin-auth";
import { TeamAuthProvider } from "@/hooks/use-team-auth";
import { useAuth } from "@/hooks/useAuth";
import { Footer } from "@/components/Footer";

import RedirectHome from "@/argon/redirect-home";
import ArgonLogin from "@/argon/argon-login";
import ValuationForm from "@/argon/valuation-form";
import FreeAssessment from "@/argon/free-assessment";
import GrowthExitAssessment from "@/argon/strategic-assessment";
import AnalyticsDashboard from "@/argon/analytics-dashboard";
import ValueCalculator from "@/argon/value-calculator";
import LeadsDashboard from "@/argon/leads-dashboard";
import TeamDashboard from "@/argon/team-dashboard";
import ReportSelectionPage from "@/argon/report-selection";
import UserDashboardArgon from "@/argon/user-dashboard-argon";
import ArgonDemo from "@/argon/argon-demo";
import FreeTierDemo from "@/argon/free-tier-demo";
import AssessmentResults from "@/argon/assessment-results";
import NotFound from "@/argon/not-found";

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
