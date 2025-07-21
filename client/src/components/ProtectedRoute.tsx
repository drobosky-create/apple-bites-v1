// Clean authentication wrapper for protected routes
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { ROUTES, redirectToLogin } from "@/utils/routingUtils";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'member' | 'user';
  fallbackMessage?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredRole = 'user',
  fallbackMessage = "Please log in to access this page." 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      redirectToLogin(fallbackMessage);
    }
  }, [isAuthenticated, isLoading, fallbackMessage]);

  // Loading state
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-text">
          <div className="loading-spinner h-8 w-8 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="loading-container">
        <div className="loading-text">
          <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
          <p>{fallbackMessage}</p>
          <p className="mt-4 text-sm opacity-75">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Role-based access control (if needed in future)
  if (requiredRole === 'admin' && user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-400 to-red-600">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p>You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}