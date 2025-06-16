import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Calculator, ExternalLink } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();

  return (
    <header className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <div>
                <h1 className="text-white font-bold text-xl tracking-tight">
                  Business Valuation Calculator
                </h1>
                <p className="text-slate-300 text-sm">
                  Powered by Meritage Partners
                </p>
              </div>
            </div>
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
            
            <Button 
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 text-white border-slate-600 hover:bg-slate-700/50 hover:border-slate-500 transition-colors"
              onClick={() => window.open('https://meritage.partners/contact', '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
              <span>Contact Us</span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}