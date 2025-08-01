import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const queryClient = useQueryClient();

  // Check if admin is authenticated on app load
  const { data: authStatus, isLoading } = useQuery({
    queryKey: ['/api/admin/status'],
    retry: false,
    queryFn: async () => {
      const response = await fetch('/api/admin/status', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Not authenticated');
      return response.json();
    },
  });

  useEffect(() => {
    if (authStatus?.authenticated) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [authStatus]);

  const login = () => {
    setIsAuthenticated(true);
    // Invalidate and refetch the admin status
    queryClient.invalidateQueries({ queryKey: ['/api/admin/status'] });
  };

  const logout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    setIsAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}