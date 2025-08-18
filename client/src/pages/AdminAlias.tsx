import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import AdminDashboard from "@/pages/admin-dashboard";

export default function AdminAlias() {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    if (isLoading) return;
    
    if (!isAuthenticated) {
      setLocation("/admin-login", { replace: true });
    }
  }, [isLoading, isAuthenticated, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Checking admin access...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // If authenticated as admin, show the admin dashboard directly
  return <AdminDashboard />;
}