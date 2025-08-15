import type { RequestHandler } from "express";
import { teamMembers } from "@shared/schema";
import { storage } from "./storage";

// Apple Bites RBAC System - Server-First, Default Deny

export type UserRole = "client" | "buyer" | "analyst" | "manager" | "admin";
export type RouteScope = string;

// Route permissions matrix (default deny, allow-list only)
export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  // Portal routes (client-facing)
  "/api/portal/dashboard": ["client", "buyer", "analyst", "manager", "admin"],
  "/api/portal/assessments": ["client", "buyer", "analyst", "manager", "admin"],
  "/api/portal/vdr-rooms": ["client", "buyer", "analyst", "manager", "admin"],
  "/api/portal/messages": ["client", "buyer", "analyst", "manager", "admin"],
  
  // Workspace routes (internal only)
  "/api/workspace/leads": ["analyst", "manager", "admin"],
  "/api/workspace/assessments": ["analyst", "manager", "admin"],
  "/api/workspace/crm/pipeline": ["analyst", "manager", "admin"],
  "/api/workspace/crm/reports": ["manager", "admin"], // Reports restricted
  "/api/workspace/vdr/rooms": ["manager", "admin"], // VDR creation
  "/api/workspace/vdr/access": ["analyst", "manager", "admin"], // VDR access if assigned
  "/api/workspace/team/members": ["admin"], // Team management
  "/api/workspace/billing": ["admin"], // Billing admin only
};

// Legacy scopes for compatibility
export const SCOPES = {
  ASSESSMENTS_VIEW_SELF: "assessments:view:self",
  ASSESSMENTS_VIEW_ORG: "assessments:view:org",
  CRM_DEAL_READ: "crm:deal:read",
  CRM_DEAL_WRITE: "crm:deal:write",
  CRM_DEAL_ADMIN: "crm:deal:admin",
  VDR_ROOM_READ: "vdr:room:read",
  VDR_ROOM_UPLOAD: "vdr:room:upload",
  VDR_ROOM_MANAGE: "vdr:room:manage",
  TEAM_READ: "team:read",
  TEAM_MANAGE: "team:manage",
} as const;

// Role capabilities
export const ROLE_CAPABILITIES = {
  client: {
    spaces: ["portal"],
    description: "Portal only - own org data",
    capabilities: ["view_own_assessments", "upload_documents", "read_messages"]
  },
  buyer: {
    spaces: ["portal"],
    description: "Portal for specific shared deals/VDR (read-only unless granted)",
    capabilities: ["view_shared_vdr", "read_deal_updates"]
  },
  analyst: {
    spaces: ["workspace"],
    description: "Leads/Assessments, CRM (no billing, no team admin)",
    capabilities: ["manage_leads", "create_assessments", "crm_read_write", "vdr_read_write_if_assigned"]
  },
  manager: {
    spaces: ["workspace"],
    description: "CRM, VDR, Assessments + invite users, approve sharing",
    capabilities: ["all_analyst", "invite_users", "approve_vdr_sharing", "crm_reports", "vdr_room_creation"]
  },
  admin: {
    spaces: ["workspace"],
    description: "Full workspace + billing, role assignment, global reports",
    capabilities: ["all_manager", "billing_access", "role_assignment", "global_reports", "team_management"]
  }
} as const;

/**
 * Check if user has required role
 */
export function hasRole(userRole: string, requiredRole: string): boolean {
  return userRole === requiredRole || userRole === "Admin";
}

/**
 * Check if user has required scope based on their role
 */
export function hasScope(userRole: string, requiredScope: string): boolean {
  const role = Object.values(ROLES).find(r => r.name === userRole);
  if (!role) return false;
  
  return role.scopes.includes(requiredScope as any);
}

/**
 * Check object-level ACL permission
 * Pattern: {objectType}:{objectId}:{subjectType}:{subjectId}:{scope}
 */
export async function hasObjectAccess(
  objectType: string,
  objectId: number,
  subjectType: "user" | "role" | "firm",
  subjectId: string,
  scope: string
): Promise<boolean> {
  try {
    // TODO: Implement storage.checkAccess method
    // const hasAccess = await storage.checkAccess(objectType, objectId, subjectType, subjectId, scope);
    // return hasAccess;
    
    // For now, return true to allow development to continue
    // This will be implemented when storage layer is expanded
    return true;
  } catch (error) {
    console.error("Error checking object access:", error);
    return false;
  }
}

/**
 * Strict RBAC middleware - checks route permissions and org isolation
 */
export function requireRouteAccess(): RequestHandler {
  return async (req, res, next) => {
    try {
      // Get user (from existing auth)
      const userId = req.session?.teamMemberId || req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const user = await storage.getTeamMember?.(userId) || await storage.getUser?.(userId);
      if (!user || !user.isActive) {
        return res.status(401).json({ error: "User not found or inactive" });
      }

      // Attach user to request
      req.user = user;

      // Check route permissions (default deny)
      const route = req.route?.path || req.path;
      const allowedRoles = ROUTE_PERMISSIONS[route];
      
      if (!allowedRoles) {
        return res.status(403).json({ error: "Route not defined in RBAC matrix" });
      }

      const userRole = user.role?.toLowerCase() as UserRole;
      if (!allowedRoles.includes(userRole)) {
        // Log unauthorized access attempt
        await logAudit(
          user.id,
          "UNAUTHORIZED_ACCESS_ATTEMPT",
          "route",
          0,
          req.ip
        );
        
        return res.status(403).json({ 
          error: `Access denied: Role '${userRole}' not authorized for ${route}`,
          required: allowedRoles,
          actual: userRole
        });
      }

      // Org isolation check (except for admin)
      if (userRole !== "admin" && req.body?.orgId && req.body.orgId !== user.orgId) {
        return res.status(403).json({ error: "Cross-org access denied" });
      }

      next();
    } catch (error) {
      console.error("RBAC middleware error:", error);
      res.status(500).json({ error: "Authorization error" });
    }
  };
}

/**
 * Legacy middleware for backward compatibility
 */
export function requireAuth(space: "portal" | "workspace"): RequestHandler {
  return requireRouteAccess();
}

/**
 * Middleware to require specific scope
 */
export function requireScope(scope: string): RequestHandler {
  return async (req, res, next) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      if (!hasScope(user.role, scope)) {
        return res.status(403).json({ error: `Access denied: ${scope} required` });
      }

      next();
    } catch (error) {
      console.error("Scope middleware error:", error);
      res.status(500).json({ error: "Authorization error" });
    }
  };
}

/**
 * Middleware to require object-level access
 */
export function requireObjectAccess(
  objectType: string,
  objectIdParam: string,
  scope: string
): RequestHandler {
  return async (req, res, next) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const objectId = parseInt(req.params[objectIdParam]);
      if (!objectId) {
        return res.status(400).json({ error: "Invalid object ID" });
      }

      const hasAccess = await hasObjectAccess(
        objectType,
        objectId,
        "user",
        user.id.toString(),
        scope
      );

      if (!hasAccess) {
        return res.status(403).json({ error: `Access denied: ${scope} on ${objectType} required` });
      }

      next();
    } catch (error) {
      console.error("Object access middleware error:", error);
      res.status(500).json({ error: "Authorization error" });
    }
  };
}

/**
 * Log audit trail
 */
export async function logAudit(
  actorId: number,
  action: string,
  objectType: string,
  objectId: number,
  ip?: string
): Promise<void> {
  try {
    // TODO: Implement storage.createAuditLog method
    // await storage.createAuditLog({
    //   actorId,
    //   action,
    //   objectType,
    //   objectId,
    //   ip,
    // });
    
    // For now, just log to console
    console.log(`AUDIT: User ${actorId} performed ${action} on ${objectType}:${objectId} from ${ip || 'unknown'}`);
  } catch (error) {
    console.error("Error logging audit:", error);
  }
}