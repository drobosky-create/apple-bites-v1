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

  // Force clear admin session on mount
  useEffect(() => {
    const clearAdminSession = async () => {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          credentials: 'include',
        });
      } catch (error) {
        // Ignore errors during cleanup
      }
    };
    clearAdminSession();
  }, []);

  // Check if admin is authenticated on app load
  const { data: authStatus, isLoading, refetch } = useQuery({
    queryKey: ['/api/admin/status'],
    retry: false,
    staleTime: 0, // Always fetch fresh data
    cacheTime: 0, // Don't cache the result
    queryFn: async () => {
      const response = await fetch('/api/admin/status', {
        credentials: 'include',
        cache: 'no-cache', // Force fresh request
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
    refetch();
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
    // Invalidate and refetch the admin status
    queryClient.invalidateQueries({ queryKey: ['/api/admin/status'] });
    refetch();
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