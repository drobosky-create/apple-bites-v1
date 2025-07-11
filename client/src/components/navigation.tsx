import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, Shield, Users, BarChart3, TrendingUp } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();

  return (
    <header className="bg-ghl-navy border-b border-ghl-secondary/20" style={{ backgroundColor: '#0b2147' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
          </div>
          
          <nav className="flex space-x-4">
            <Link href="/dashboard">
              <Button 
                variant="ghost"
                size="sm"
                className="ghl-secondary-button flex items-center space-x-2 h-9 px-4 hover:bg-ghl-secondary/10 transition-all duration-300"
              >
                <Home className="w-4 h-4" />
                <span className="text-white font-medium">Dashboard</span>
              </Button>
            </Link>
            
            <Link href="/team">
              <Button 
                variant="outline"
                size="sm"
                className="ghl-outline-button h-9 px-4 border-ghl-primary text-ghl-primary hover:bg-ghl-primary hover:text-white transition-all duration-300"
              >
                <Shield className="w-4 h-4" />
                <span className="font-medium">Admin Login</span>
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}