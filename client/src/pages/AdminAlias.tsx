import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export default function AdminAlias() {
  const { isChecking, isAuthenticated, isAdmin } = useAuth();
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    if (isChecking) return;
    
    if (!isAuthenticated) {
      setLocation("/login", { replace: true });
    } else if (isAdmin) {
      setLocation("/workspace/admin", { replace: true });
    } else {
      setLocation("/workspace", { replace: true });
    }
  }, [isChecking, isAuthenticated, isAdmin, setLocation]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Checking access...</div>
      </div>
    );
  }

  return null;
}