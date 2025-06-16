import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import ValuationForm from "@/pages/valuation-form";
import ValueCalculator from "@/pages/value-calculator";
import NotFound from "@/pages/not-found";

function Router() {
  // Check if this is an embed view
  const isEmbed = new URLSearchParams(window.location.search).get('embed') === 'true';
  
  if (isEmbed) {
    // Embedded version without header/footer
    return (
      <div className="min-h-screen bg-transparent">
        <Switch>
          <Route path="/" component={ValuationForm} />
          <Route path="/value-calculator" component={ValueCalculator} />
          <Route component={NotFound} />
        </Switch>
      </div>
    );
  }
  
  // Full standalone version with header/footer
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={ValuationForm} />
          <Route path="/value-calculator" component={ValueCalculator} />
          <Route path="/admin" component={() => <div className="min-h-96 flex items-center justify-center"><div className="text-center"><h2 className="text-2xl font-bold text-slate-800 mb-4">Admin Access</h2><p className="text-slate-600">Please contact Meritage Partners for admin access.</p></div></div>} />
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
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
