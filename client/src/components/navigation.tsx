import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { FileText, Shield } from "lucide-react";

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
                className={`flex items-center space-x-2 ${location === "/" ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-slate-700 hover:text-slate-900"}`}
              >
                <FileText className="w-4 h-4" />
                <span>Valuation Form</span>
              </Button>
            </Link>
            
            <Link href="/team">
              <Button 
                variant={location === "/team" ? "default" : "outline"}
                size="sm"
                className={`flex items-center space-x-2 ${location === "/team" ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-slate-700 hover:text-slate-900 border-slate-300"}`}
              >
                <Shield className="w-4 h-4" />
                <span>Admin Login</span>
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}