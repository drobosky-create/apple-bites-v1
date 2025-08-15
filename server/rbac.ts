import type { RequestHandler } from "express";
import { teamMembers } from "@shared/schema";
import { storage } from "./storage";

// RBAC scopes as defined in the specification
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

// Role definitions with default scopes
export const ROLES = {
  CLIENT: {
    name: "Client",
    scopes: [SCOPES.ASSESSMENTS_VIEW_SELF, SCOPES.VDR_ROOM_READ]
  },
  CLIENT_ADMIN: {
    name: "Client Admin", 
    scopes: [SCOPES.ASSESSMENTS_VIEW_ORG, SCOPES.VDR_ROOM_READ, SCOPES.VDR_ROOM_UPLOAD]
  },
  ANALYST: {
    name: "Analyst",
    scopes: [SCOPES.CRM_DEAL_READ, SCOPES.CRM_DEAL_WRITE, SCOPES.VDR_ROOM_READ, SCOPES.VDR_ROOM_UPLOAD]
  },
  DEAL_LEAD: {
    name: "Deal Lead",
    scopes: [SCOPES.CRM_DEAL_ADMIN, SCOPES.VDR_ROOM_MANAGE, SCOPES.TEAM_READ]
  },
  VDR_MANAGER: {
    name: "VDR Manager",
    scopes: [SCOPES.VDR_ROOM_MANAGE, SCOPES.CRM_DEAL_READ]
  },
  OPS_MANAGER: {
    name: "Ops Manager", 
    scopes: [SCOPES.CRM_DEAL_ADMIN, SCOPES.VDR_ROOM_MANAGE, SCOPES.TEAM_MANAGE]
  },
  ADMIN: {
    name: "Admin",
    scopes: Object.values(SCOPES) // Full access
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
 * Middleware to require authentication and check portal vs workspace access
 */
export function requireAuth(space: "portal" | "workspace"): RequestHandler {
  return async (req, res, next) => {
    try {
      // Check if user is authenticated (using existing team auth)
      const userId = req.session?.teamMemberId || req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      // Get user details
      const user = await storage.getTeamMember?.(userId) || await storage.getUser?.(userId);
      if (!user || !user.isActive) {
        return res.status(401).json({ error: "User not found or inactive" });
      }

      // Attach user to request
      req.user = user;

      // Check space access
      if (space === "workspace") {
        // Only internal users can access workspace
        const isInternal = ["Analyst", "Deal Lead", "VDR Manager", "Ops Manager", "Admin"].includes(user.role);
        if (!isInternal) {
          return res.status(403).json({ error: "Access denied: Internal workspace only" });
        }
      }
      // Portal access is available to all authenticated users

      next();
    } catch (error) {
      console.error("Auth middleware error:", error);
      res.status(500).json({ error: "Authentication error" });
    }
  };
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