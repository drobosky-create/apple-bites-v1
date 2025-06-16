import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { FileText, Shield } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();

  return (
    <header className="bg-[#1a2332] border-b border-[#f5c842]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-[#0b2147] bg-[#0b2147]">
        <div className="flex justify-between items-center h-16 text-[#0b2147] bg-[#0b2147]">
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
                <span>Valuation Form</span>
              </Button>
            </Link>
            
            <Link href="/team">
              <Button 
                variant={location === "/team" ? "default" : "outline"}
                size="sm"
                className={`flex items-center space-x-2 ${location === "/team" ? "bg-[#f5c842] hover:bg-[#e6b63a] text-[#1a2332]" : "text-[#f5c842] hover:text-white hover:bg-[#f5c842]/20 border-[#f5c842]"}`}
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