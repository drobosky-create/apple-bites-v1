import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { BarChart3, FileText, Calculator, Users } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
          </div>
          
          <nav className="flex space-x-4">
            <Link href="/">
              <Button 
                variant={location === "/" ? "default" : "ghost"}
                size="sm"
                className={`flex items-center space-x-2 ${location === "/" ? "heritage-gradient text-white" : "text-slate-700 hover:text-slate-900"}`}
              >
                <FileText className="w-4 h-4" />
                <span>Valuation Form</span>
              </Button>
            </Link>
            

            
            <Link href="/admin/leads">
              <Button 
                variant={location === "/admin/leads" ? "default" : "ghost"}
                size="sm"
                className={`flex items-center space-x-2 ${location === "/admin/leads" ? "heritage-gradient text-white" : "text-slate-700 hover:text-slate-900"}`}
              >
                <Users className="w-4 h-4" />
                <span>Leads</span>
              </Button>
            </Link>
            
            <Link href="/admin/analytics">
              <Button 
                variant={location === "/admin/analytics" ? "default" : "ghost"}
                size="sm"
                className={`flex items-center space-x-2 ${location === "/admin/analytics" ? "heritage-gradient text-white" : "text-slate-700 hover:text-slate-900"}`}
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