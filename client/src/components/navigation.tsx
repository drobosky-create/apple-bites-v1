import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { BarChart3, FileText, Calculator } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-slate-900">Apple Bites Valuation</h1>
          </div>
          
          <nav className="flex space-x-4">
            <Link href="/">
              <Button 
                variant={location === "/" ? "default" : "ghost"}
                size="sm"
                className="flex items-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>Valuation Form</span>
              </Button>
            </Link>
            
            <Link href="/value-calculator">
              <Button 
                variant={location === "/value-calculator" ? "default" : "ghost"}
                size="sm"
                className="flex items-center space-x-2"
              >
                <Calculator className="w-4 h-4" />
                <span>Value Calculator</span>
              </Button>
            </Link>
            
            <Link href="/admin/analytics">
              <Button 
                variant={location === "/admin/analytics" ? "default" : "ghost"}
                size="sm"
                className="flex items-center space-x-2"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}