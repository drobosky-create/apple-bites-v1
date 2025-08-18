import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAdminAuth } from "@/hooks/use-admin-auth";

export default function AdminAlias() {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    if (isLoading) return;
    
    if (!isAuthenticated) {
      setLocation("/admin-login", { replace: true });
    } else {
      // Redirect authenticated admin to workspace
      setLocation("/workspace", { replace: true });
    }
  }, [isLoading, isAuthenticated, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Checking admin access...</div>
      </div>
    );
  }

  return null;
}