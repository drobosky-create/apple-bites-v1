import { db } from "../db";
import { auditEvents } from "@shared/schema";
import { nanoid } from "nanoid";

interface AuditContext {
  actor: string;
  actorRole: string;
  entityType: string;
  entityId: string;
  action: 'create' | 'update' | 'delete';
  before?: any;
  after?: any;
}

export async function writeAudit(context: AuditContext) {
  try {
    await db.insert(auditEvents).values({
      id: nanoid(),
      actor: context.actor,
      actorRole: context.actorRole,
      entityType: context.entityType,
      entityId: context.entityId,
      action: context.action,
      before: context.before || null,
      after: context.after || null,
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
}

export async function getAuditHistory(entityType?: string, entityId?: string, limit: number = 100) {
  try {
    let query = db.select().from(auditEvents);
    
    if (entityType && entityId) {
      query = query.where(
        eq(auditEvents.entityType, entityType) && eq(auditEvents.entityId, entityId)
      );
    }
    
    return await query.orderBy(desc(auditEvents.createdAt)).limit(limit);
  } catch (error) {
    console.error('Failed to get audit history:', error);
    return [];
  }
}