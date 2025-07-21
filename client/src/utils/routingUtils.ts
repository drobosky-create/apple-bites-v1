// Centralized routing utilities - clean up scattered redirect logic

export const ROUTES = {
  // Authentication routes
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  
  // Assessment routes - cleaned up
  ASSESSMENT_FREE: '/assessment/free',
  ASSESSMENT_GROWTH: '/assessment/growth',
  ASSESSMENT_CAPITAL: '/assessment/capital',
  
  // Results routes
  RESULTS: '/results',
  RESULTS_BY_ID: (id: string) => `/results/${id}`,
  
  // Admin routes
  ADMIN_DASHBOARD: '/admin',
  ADMIN_ANALYTICS: '/admin/analytics', 
  ADMIN_LEADS: '/admin/leads',
  TEAM_DASHBOARD: '/team',
  
  // External checkout (GHL integration)
  EXTERNAL_CHECKOUT: {
    GROWTH: 'https://products.applebites.ai/product-details/product/686c2e0f5f2f1191edb09737',
    CAPITAL: 'https://products.applebites.ai/capital-assessment-checkout'
  }
} as const;

// Clean redirect utilities
export function redirectToLogin(message?: string) {
  if (message) {
    // Store message in sessionStorage for display after redirect
    sessionStorage.setItem('loginMessage', message);
  }
  window.location.href = ROUTES.LOGIN;
}

export function redirectToDashboard() {
  window.location.href = ROUTES.DASHBOARD;
}

export function redirectToAssessment(tier: 'free' | 'growth' | 'capital') {
  const routes = {
    free: ROUTES.ASSESSMENT_FREE,
    growth: ROUTES.ASSESSMENT_GROWTH,
    capital: ROUTES.ASSESSMENT_CAPITAL
  };
  window.location.href = routes[tier];
}

// Clean up legacy assessment routing
export function getAssessmentRoute(tier: string): string {
  switch (tier?.toLowerCase()) {
    case 'free':
    case 'basic':
      return ROUTES.ASSESSMENT_FREE;
    case 'growth':
    case 'paid':
    case 'strategic':
      return ROUTES.ASSESSMENT_GROWTH;
    case 'capital':
    case 'premium':
      return ROUTES.ASSESSMENT_CAPITAL;
    default:
      return ROUTES.ASSESSMENT_FREE;
  }
}

// Check if current route requires authentication
export function requiresAuthentication(path: string): boolean {
  const protectedPaths = [
    '/dashboard',
    '/admin',
    '/team',
    '/results'
  ];
  
  return protectedPaths.some(protectedPath => 
    path.startsWith(protectedPath)
  );
}

// Get user role from current context
export function getUserRole(): 'admin' | 'member' | 'viewer' | 'user' | null {
  // This would be implemented based on your auth system
  // For now, return null as placeholder
  return null;
}

// Check if user has required permissions for route
export function hasRequiredPermissions(path: string, userRole?: string): boolean {
  const adminRoutes = ['/admin/analytics', '/admin/leads'];
  const memberRoutes = ['/admin', '/team'];
  
  if (adminRoutes.some(route => path.startsWith(route))) {
    return userRole === 'admin';
  }
  
  if (memberRoutes.some(route => path.startsWith(route))) {
    return ['admin', 'member'].includes(userRole || '');
  }
  
  return true;
}