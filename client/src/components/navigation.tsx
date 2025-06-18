import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { FileText, Shield, Users, BarChart3, TrendingUp } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();

  return (
    <header className="bg-[#0b2147] border-b border-[#f5c842]" style={{ backgroundColor: '#0b2147' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
          </div>
          
          <nav className="flex space-x-4">
            <Link href="/">
              <Button 
                variant={location === "/" ? "default" : "ghost"}
                size="sm"
                className={`flex items-center space-x-2 ${location === "/" ? "bg-[#f5c842] hover:bg-[#e6b63a] text-[#1a2332]" : "text-[#f5c842] hover:text-white hover:bg-[#f5c842]/20"}`}
              >
                <FileText className="w-4 h-4" />
                <span className="text-[#f2f4f7] bg-[#d3ae4000]">Valuation Form</span>
              </Button>
            </Link>
            
            <Link href="/team">
              <Button 
                variant={location === "/team" ? "default" : "outline"}
                size="sm"
                className="justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border bg-background h-9 rounded-md px-3 flex items-center space-x-2 hover:text-white hover:bg-[#f5c842]/20 border-[#f5c842] text-[#fffcfc]"
              >
                <Shield className="w-4 h-4" />
                <span className="text-[#f5f6fa]">Admin Login</span>
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}