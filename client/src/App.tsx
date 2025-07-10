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
import RedirectHome from "@/pages/redirect-home";
import UserLogin from "@/pages/user-login";
import ValuationForm from "@/pages/valuation-form";
import FreeAssessment from "@/pages/free-assessment";
import GrowthExitAssessment from "@/pages/strategic-assessment";
import AnalyticsDashboard from "@/pages/analytics-dashboard";
import ValueCalculator from "@/pages/value-calculator";
import LeadsDashboard from "@/pages/leads-dashboard";
import TeamDashboard from "@/pages/team-dashboard";
import ReportSelectionPage from "@/pages/report-selection";
import UserDashboard from "@/pages/user-dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ backgroundColor: 'white', margin: 0, padding: 0 }}>
      <Switch>
        {/* Standalone pages without header/navigation */}
        <Route path="/" component={RedirectHome} />
        <Route path="/login" component={UserLogin} />
        <Route path="/dashboard/:tier" component={UserDashboard} />
        <Route path="/dashboard" component={UserDashboard} />
        
        {/* Pages with header/navigation */}
        <Route path="/assessment/free">
          <>
            <Header />
            <Navigation />
            <main className="flex-1">
              <FreeAssessment />
            </main>
            <Footer />
          </>
        </Route>
        <Route path="/assessment/paid">
          <>
            <Header />
            <Navigation />
            <main className="flex-1">
              <GrowthExitAssessment />
            </main>
            <Footer />
          </>
        </Route>
        <Route path="/valuation">
          <>
            <Header />
            <Navigation />
            <main className="flex-1">
              <ValuationForm />
            </main>
            <Footer />
          </>
        </Route>
        <Route path="/results">
          <>
            <Header />
            <Navigation />
            <main className="flex-1">
              <ValuationForm />
            </main>
            <Footer />
          </>
        </Route>
        <Route path="/results/:id">
          <>
            <Header />
            <Navigation />
            <main className="flex-1">
              <ValuationForm />
            </main>
            <Footer />
          </>
        </Route>
        <Route path="/report-selection/:id">
          <>
            <Header />
            <Navigation />
            <main className="flex-1">
              <ReportSelectionPage />
            </main>
            <Footer />
          </>
        </Route>
        <Route path="/value-calculator">
          <>
            <Header />
            <Navigation />
            <main className="flex-1">
              <ValueCalculator />
            </main>
            <Footer />
          </>
        </Route>
        <Route path="/admin">
          <>
            <Header />
            <Navigation />
            <main className="flex-1">
              <TeamDashboard />
            </main>
            <Footer />
          </>
        </Route>
        <Route path="/admin/analytics">
          <>
            <Header />
            <Navigation />
            <main className="flex-1">
              <AnalyticsDashboard />
            </main>
            <Footer />
          </>
        </Route>
        <Route path="/admin/leads">
          <>
            <Header />
            <Navigation />
            <main className="flex-1">
              <LeadsDashboard />
            </main>
            <Footer />
          </>
        </Route>
        <Route path="/team">
          <>
            <Header />
            <Navigation />
            <main className="flex-1">
              <TeamDashboard />
            </main>
            <Footer />
          </>
        </Route>
        <Route>
          <>
            <Header />
            <Navigation />
            <main className="flex-1">
              <NotFound />
            </main>
            <Footer />
          </>
        </Route>
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
