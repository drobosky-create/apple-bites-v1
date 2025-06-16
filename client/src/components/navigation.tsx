import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Calculator, ExternalLink } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();

  return (
    <header className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            {/* Empty space for clean layout */}
          </div>
          
          <nav className="flex space-x-4">
            <Link href="/">
              <Button 
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 text-white hover:text-blue-200 hover:bg-slate-700/50 transition-colors"
              >
                <Calculator className="w-4 h-4" />
                <span>Valuation Assessment</span>
              </Button>
            </Link>
            
            <Link href="/admin">
              <Button 
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 text-white border-slate-600 hover:bg-slate-700/50 hover:border-slate-500 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Admin Login</span>
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}