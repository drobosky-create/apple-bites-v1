import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

export type Role = "Admin" | "Ops" | "Analyst" | "Sales" | "Viewer";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: Role[];
}

interface AuthResponse {
  user: User;
  roles: Role[];
  permissions: Record<string, boolean>;
}

export function useAuth() {
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});

  const { data: authData, isLoading: isChecking, error } = useQuery({
    queryKey: ['/api/me'],
    retry: false,
    staleTime: 30000,
    queryFn: async (): Promise<AuthResponse | null> => {
      const response = await fetch('/api/me', {
        credentials: 'include',
        cache: 'no-cache',
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          return null; // Not authenticated
        }
        throw new Error('Failed to fetch user data');
      }
      
      return response.json();
    },
  });

  useEffect(() => {
    if (authData?.permissions) {
      setPermissions(authData.permissions);
    }
  }, [authData]);

  const user = authData?.user ?? null;
  const roles = user?.roles ?? [];
  const isAuthenticated = !!user;

  return {
    isChecking,
    user,
    roles,
    can: (permission: string) => !!permissions[permission],
    isAuthenticated,
    isAdmin: roles.includes("Admin"),
    error,
  };
}

// Legacy compatibility hooks
export function useAdminAuth() {
  const { isChecking, isAuthenticated, isAdmin } = useAuth();
  return {
    isAuthenticated: isAdmin,
    isLoading: isChecking,
    login: () => {},
    logout: () => {},
  };
}

export function useTeamAuth() {
  const { isChecking, isAuthenticated } = useAuth();
  return {
    isAuthenticated,
    isLoading: isChecking,
    hasWorkspaceAccess: isAuthenticated,
  };
}