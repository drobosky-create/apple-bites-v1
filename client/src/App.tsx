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
import TeamLogin from "@/components/team-login";
import AdminLogin from "@/components/admin-login";

// Simple demo component
const FreeTierDemo = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="container mx-auto px-4 py-8">
      <div className="card-primary">
        <h1 className="section-header">Free Tier Demo</h1>
        <p className="text-slate-600">Demo features coming soon.</p>
      </div>
    </div>
  </div>
);

// Simple redirect component
const RedirectHome = () => {
  window.location.href = '/';
  return <div className="loading-container"><div className="loading-text">Redirecting...</div></div>;
};

// Simple user dashboard placeholder
const UserDashboard = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="container mx-auto px-4 py-8">
      <div className="card-primary">
        <h1 className="section-header">User Dashboard</h1>
        <p className="text-slate-600">Welcome to your dashboard. Assessment features coming soon.</p>
      </div>
    </div>
  </div>
);
import { useState } from "react";

// Login Selection Component
function ArgonLogin() {
  const [loginType, setLoginType] = useState<'user' | 'team' | 'admin' | null>(null);

  if (loginType === 'team') {
    return <TeamLogin onLoginSuccess={() => window.location.reload()} />;
  }

  if (loginType === 'admin') {
    return <AdminLogin onLoginSuccess={() => window.location.reload()} />;
  }

  return (
    <div className="loading-container">
      <div className="card-primary max-w-md mx-4">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#0b2147] to-[#1a365d] flex items-center justify-center shadow-xl mx-auto">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h1 className="section-header text-center">Welcome</h1>
            <p className="text-slate-600 mb-8">Choose your login type to continue</p>
          </div>
          <div className="space-y-4">
            <button
              onClick={() => window.location.href = '/api/login'}
              className="btn-primary w-full"
            >
              Customer Login
            </button>
            <button
              onClick={() => setLoginType('team')}
              className="btn-secondary w-full"
            >
              Team Login
            </button>
            <button
              onClick={() => setLoginType('admin')}
              className="btn-outline w-full"
            >
              Admin Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Placeholder components for routes not yet implemented
const ValuationForm = () => <div>Valuation Form</div>;
const FreeAssessment = () => <div>Free Assessment</div>;
const GrowthExitAssessment = () => <div>Growth Exit Assessment</div>;
const AnalyticsDashboard = () => <div>Analytics Dashboard</div>;
const ValueCalculator = () => <div>Value Calculator</div>;
const LeadsDashboard = () => <div>Leads Dashboard</div>;
const TeamDashboard = () => <div>Team Dashboard</div>;
const ReportSelectionPage = () => <div>Report Selection</div>;
const ArgonDemo = () => <div>Argon Demo</div>;
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
            <Route path="/" component={UserDashboard} />
            <Route path="/dashboard/:tier" component={UserDashboard} />
            <Route path="/dashboard" component={UserDashboard} />
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
