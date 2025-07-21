// Route audit utilities - clean up legacy patterns and verify authentication

export interface RouteAuditResult {
  hasLegacyPatterns: boolean;
  missingAuthCheck: boolean;
  incorrectRedirects: boolean;
  cleanupActions: string[];
}

// Audit current routing patterns for issues
export function auditCurrentRoute(path: string, isAuthenticated: boolean): RouteAuditResult {
  const result: RouteAuditResult = {
    hasLegacyPatterns: false,
    missingAuthCheck: false,
    incorrectRedirects: false,
    cleanupActions: []
  };

  // Check for legacy route patterns
  const legacyPatterns = [
    '/scoreapp',
    '/v1/',
    '/old-',
    '/legacy-',
    '/deprecated-',
    '/assessment/strategic', // Old name before "growth"
    '/paid-assessment',      // Old component name
    '/pricing'              // Should redirect to external GHL
  ];

  if (legacyPatterns.some(pattern => path.includes(pattern))) {
    result.hasLegacyPatterns = true;
    result.cleanupActions.push('Update route to use current naming conventions');
  }

  // Check authentication requirements
  const protectedRoutes = ['/dashboard', '/admin', '/team', '/results'];
  const requiresAuth = protectedRoutes.some(route => path.startsWith(route));
  
  if (requiresAuth && !isAuthenticated) {
    result.missingAuthCheck = true;
    result.cleanupActions.push('Add authentication check before rendering protected content');
  }

  // Check for incorrect redirect patterns
  const shouldRedirectToExternal = ['/pricing', '/checkout', '/purchase'];
  if (shouldRedirectToExternal.some(route => path.includes(route))) {
    result.incorrectRedirects = true;
    result.cleanupActions.push('Route should redirect to external GHL checkout');
  }

  return result;
}

// Clean up legacy route references in code
export function getLegacyRouteMapping(): Record<string, string> {
  return {
    // Old assessment routes → new consolidated routes
    '/assessment/strategic': '/assessment/growth',
    '/paid-assessment': '/assessment/growth',
    '/premium-assessment': '/assessment/capital',
    
    // Old pricing routes → external GHL
    '/pricing': 'https://products.applebites.ai/',
    '/checkout/growth': 'https://products.applebites.ai/product-details/product/686c2e0f5f2f1191edb09737',
    '/checkout/capital': 'https://products.applebites.ai/capital-assessment-checkout',
    
    // Old component routes → dashboard
    '/user-dashboard': '/dashboard',
    '/profile': '/dashboard',
    
    // Legacy auth routes
    '/login-old': '/login',
    '/register': '/login', // Registration handled in login flow
  };
}

// Verify GHL integration points are correct
export function auditGHLIntegration() {
  const ghlEndpoints = {
    freeResults: process.env.GHL_WEBHOOK_FREE_RESULTS,
    growthResults: process.env.GHL_WEBHOOK_GROWTH_RESULTS,
    capitalPurchase: process.env.GHL_WEBHOOK_CAPITAL_PURCHASE,
    checkoutGrowth: 'https://products.applebites.ai/product-details/product/686c2e0f5f2f1191edb09737',
    checkoutCapital: 'https://products.applebites.ai/capital-assessment-checkout'
  };

  const issues: string[] = [];
  
  // Check webhook URLs are configured
  Object.entries(ghlEndpoints).forEach(([key, url]) => {
    if (!url && !key.includes('checkout')) {
      issues.push(`Missing environment variable for ${key}`);
    }
  });

  return {
    endpoints: ghlEndpoints,
    issues,
    isConfigured: issues.length === 0
  };
}

// Generate cleanup report
export function generateRouteCleanupReport(): string {
  const legacyMapping = getLegacyRouteMapping();
  const ghlAudit = auditGHLIntegration();
  
  let report = '## Route Audit & Cleanup Report\n\n';
  
  report += '### Legacy Route Mappings Cleaned:\n';
  Object.entries(legacyMapping).forEach(([old, newRoute]) => {
    report += `- \`${old}\` → \`${newRoute}\`\n`;
  });
  
  report += '\n### GHL Integration Status:\n';
  if (ghlAudit.isConfigured) {
    report += '✅ All webhook endpoints properly configured\n';
  } else {
    report += '❌ Missing webhook configuration:\n';
    ghlAudit.issues.forEach(issue => {
      report += `  - ${issue}\n`;
    });
  }
  
  report += '\n### Recommended Actions:\n';
  report += '1. Remove deprecated route handlers\n';
  report += '2. Update client-side navigation to use new routes\n';
  report += '3. Add proper authentication guards\n';
  report += '4. Consolidate webhook handling in single service\n';
  
  return report;
}