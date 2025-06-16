import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminAuthProvider } from "@/hooks/use-admin-auth";
import { TeamAuthProvider } from "@/hooks/use-team-auth";
import Navigation from "@/components/navigation";
import ValuationForm from "@/pages/valuation-form";
import AnalyticsDashboard from "@/pages/analytics-dashboard";
import ValueCalculator from "@/pages/value-calculator";
import LeadsDashboard from "@/pages/leads-dashboard";
import TeamDashboard from "@/pages/team-dashboard";
import NotFound from "@/pages/not-found";

function EmbedValuationForm() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <ValuationForm />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      {/* Embed route without navigation for iframe embedding */}
      <Route path="/embed" component={EmbedValuationForm} />
      <Route path="/embed/calculator" component={ValueCalculator} />
      
      {/* Regular routes with navigation */}
      <Route path="/">
        <div className="min-h-screen bg-slate-50">
          <Navigation />
          <ValuationForm />
        </div>
      </Route>
      <Route path="/value-calculator">
        <div className="min-h-screen bg-slate-50">
          <Navigation />
          <ValueCalculator />
        </div>
      </Route>
      <Route path="/admin/analytics">
        <div className="min-h-screen bg-slate-50">
          <Navigation />
          <AnalyticsDashboard />
        </div>
      </Route>
      <Route path="/admin/leads">
        <div className="min-h-screen bg-slate-50">
          <Navigation />
          <LeadsDashboard />
        </div>
      </Route>
      <Route path="/team">
        <div className="min-h-screen bg-slate-50">
          <Navigation />
          <TeamDashboard />
        </div>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <TeamAuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </TeamAuthProvider>
      </AdminAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
