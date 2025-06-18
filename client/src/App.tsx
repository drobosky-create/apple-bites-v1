import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminAuthProvider } from "@/hooks/use-admin-auth";
import { TeamAuthProvider } from "@/hooks/use-team-auth";
import Navigation from "@/components/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import ValuationForm from "@/pages/valuation-form";
import AnalyticsDashboard from "@/pages/analytics-dashboard";
import ValueCalculator from "@/pages/value-calculator";
import LeadsDashboard from "@/pages/leads-dashboard";
import TeamDashboard from "@/pages/team-dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col" style={{ backgroundColor: 'rgb(248 250 252)' }}>
      <Header />
      <Navigation />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={ValuationForm} />
          <Route path="/value-calculator" component={ValueCalculator} />
          <Route path="/admin/analytics" component={AnalyticsDashboard} />
          <Route path="/admin/leads" component={LeadsDashboard} />
          <Route path="/team" component={TeamDashboard} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
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
