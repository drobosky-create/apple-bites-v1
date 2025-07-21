import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminAuthProvider } from "@/hooks/use-admin-auth";
import { TeamAuthProvider } from "@/hooks/use-team-auth";
import { useAuth } from "@/hooks/useAuth";
import { Footer } from "@/components/Footer";

// Import actual components
import AdminLogin from "@/components/admin-login";
import TeamLogin from "@/components/team-login";

// Main login component that provides multiple auth options
function ArgonLogin() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-blue-500 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Replit OAuth Login */}
        <div className="card-primary text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Welcome to Apple Bites</h1>
          <p className="text-slate-600 mb-6">Professional Business Valuation Platform</p>
          <a
            href="/api/login"
            className="btn-gradient w-full inline-block text-center no-underline"
          >
            Sign in with Replit
          </a>
        </div>

        {/* Team Login Option */}
        <div className="card-primary">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Team Member Login</h2>
          <TeamLogin />
        </div>

        {/* Admin Login Option */}
        <div className="card-primary">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Admin Login</h2>
          <AdminLogin />
        </div>
      </div>
    </div>
  );
}

// Placeholder components - TODO: Replace with actual implementations
const RedirectHome = () => <div>Redirect Home</div>;
const ValuationForm = () => <div>Valuation Form</div>;
const FreeAssessment = () => <div>Free Assessment</div>;
const GrowthExitAssessment = () => <div>Growth Exit Assessment</div>;
const AnalyticsDashboard = () => <div>Analytics Dashboard</div>;
const ValueCalculator = () => <div>Value Calculator</div>;
const LeadsDashboard = () => <div>Leads Dashboard</div>;
const TeamDashboard = () => <div>Team Dashboard</div>;
const ReportSelectionPage = () => <div>Report Selection</div>;
const UserDashboardArgon = () => <div>User Dashboard</div>;
const ArgonDemo = () => <div>Argon Demo</div>;
const FreeTierDemo = () => <div>Free Tier Demo</div>;
const AssessmentResults = () => <div>Assessment Results</div>;
const NotFound = () => <div>Not Found</div>;

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
        
        {/* Assessment pages - cleaned up routing */}
        <Route path="/assessment/free" component={FreeAssessment} />
        <Route path="/assessment/growth" component={GrowthExitAssessment} />
        <Route path="/assessment/capital" component={GrowthExitAssessment} />
        
        {/* Legacy route redirects - TODO: Remove after client updates */}
        <Route path="/assessment/paid" component={GrowthExitAssessment} />
        <Route path="/assessment/strategic" component={GrowthExitAssessment} />
        
        {/* Results and admin - require authentication */}
        <Route path="/results" component={AssessmentResults} />
        <Route path="/results/:id" component={AssessmentResults} />
        <Route path="/report-selection/:id" component={ReportSelectionPage} />
        <Route path="/admin" component={TeamDashboard} />
        <Route path="/admin/analytics" component={AnalyticsDashboard} />
        <Route path="/admin/leads" component={LeadsDashboard} />
        <Route path="/team" component={TeamDashboard} />
        
        {/* Utility routes */}
        <Route path="/valuation" component={ValuationForm} />
        <Route path="/value-calculator" component={ValueCalculator} />
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
