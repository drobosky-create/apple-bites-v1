import { Switch, Route } from "wouter";
import { lazy } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import MaterialWrapper from "@/components/MaterialWrapper";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminAuthProvider } from "@/hooks/use-admin-auth";
import { TeamAuthProvider } from "@/hooks/use-team-auth";
import { useAuth } from "@/hooks/useAuth";
import { Footer } from "@/components/Footer";
import StickyContactWidget from "@/components/sticky-contact-widget";
import { GHLThemeDemo } from "@/components/ghl-theme-demo";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import RedirectHome from "@/pages/redirect-home";
import Login from "@/pages/login";
import MaterialLogin from "@/pages/material-login";
import AuthenticMaterialLogin from "@/pages/authentic-material-login";
import MaterialDashboardLogin from "@/pages/material-dashboard-login";
import SignUp from "@/pages/signup";
import ValuationForm from "@/pages/valuation-form";
import FreeAssessment from "@/pages/free-assessment";
import GrowthExitAssessment from "@/pages/strategic-assessment";
import AnalyticsDashboard from "@/pages/analytics-dashboard";
import ValueCalculator from "@/pages/value-calculator";
import LeadsDashboard from "@/pages/leads-dashboard";
import TeamDashboard from "@/pages/team-dashboard";
import ReportSelectionPage from "@/pages/report-selection";
import Dashboard from "@/pages/dashboard";
import Demo from "@/pages/demo";
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
            <Route path="/" component={AuthenticMaterialLogin} />
            <Route path="/dashboard" component={AuthenticMaterialLogin} />
            <Route path="/dashboard/:tier" component={AuthenticMaterialLogin} />
          </>
        ) : (
          <>
            <Route path="/" component={Dashboard} />
            <Route path="/dashboard/:tier" component={Dashboard} />
            <Route path="/dashboard" component={Dashboard} />
          </>
        )}
        <Route path="/login" component={MaterialDashboardLogin} />
        <Route path="/signup" component={SignUp} />
        <Route path="/login-auth" component={AuthenticMaterialLogin} />
        <Route path="/login-material" component={MaterialLogin} />
        <Route path="/login-old" component={Login} />
        <Route path="/redirect" component={RedirectHome} />
        <Route path="/ghl-demo" component={GHLThemeDemo} />
        <Route path="/demo" component={Demo} />
      <Route path="/design-system" component={lazy(() => import('./components/examples/ComponentShowcase'))} />
        <Route path="/free-tier-demo" component={FreeTierDemo} />
        <Route path="/assessment-results/:id" component={AssessmentResults} />
        
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
      
      {/* Global Sticky Contact Widget */}
      <StickyContactWidget />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MaterialWrapper>
        <AdminAuthProvider>
          <TeamAuthProvider>
            <TooltipProvider>
              <Router />
              <Toaster />
            </TooltipProvider>
          </TeamAuthProvider>
        </AdminAuthProvider>
      </MaterialWrapper>
    </QueryClientProvider>
  );
}

export default App;
