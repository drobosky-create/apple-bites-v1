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
import Home from "@/pages/home";
import ValuationForm from "@/pages/valuation-form";
import FreeAssessment from "@/pages/free-assessment";
import StrategicAssessment from "@/pages/strategic-assessment";
import AnalyticsDashboard from "@/pages/analytics-dashboard";
import ValueCalculator from "@/pages/value-calculator";
import LeadsDashboard from "@/pages/leads-dashboard";
import TeamDashboard from "@/pages/team-dashboard";
import ReportSelectionPage from "@/pages/report-selection";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col" style={{ backgroundColor: 'rgb(248 250 252)', margin: 0, padding: 0 }}>
      <Header />
      <Navigation />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/assessment/free" component={FreeAssessment} />
          <Route path="/assessment/paid" component={StrategicAssessment} />
          <Route path="/valuation" component={ValuationForm} />
          <Route path="/results" component={ValuationForm} />
          <Route path="/results/:id" component={ValuationForm} />
          <Route path="/report-selection/:id" component={ReportSelectionPage} />
          <Route path="/value-calculator" component={ValueCalculator} />
          <Route path="/admin" component={TeamDashboard} />
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
            <Router />
            <Toaster />
          </TooltipProvider>
        </TeamAuthProvider>
      </AdminAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
