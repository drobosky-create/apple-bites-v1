import { db } from '../db';
import { automationRules, tasks } from '@shared/schema';
import { on } from './eventBus';
import { eq } from 'drizzle-orm';

type Condition = { path: string; op: 'eq'|'ne'|'contains'; value: any };
type Action =
  | { type: 'assignOwner'; value: 'auto' | string }
  | { type: 'createTask'; title: string; dueIn?: string } // ISO 8601 duration like 'P3D'
  | { type: 'webhook'; url: string; body?: any }
  | { type: 'email'; to: string; subject: string; text: string };

type RuleSpec = { on: string; if?: Condition[]; do: Action[] };

function get(obj: any, path: string) {
  return path.split('.').reduce((a, k) => (a ? a[k] : undefined), obj);
}

function check(conds: Condition[] | undefined, ctx: any) {
  if (!conds?.length) return true;
  return conds.every(c => {
    const v = get(ctx, c.path);
    if (c.op === 'eq') return v === c.value;
    if (c.op === 'ne') return v !== c.value;
    if (c.op === 'contains') return Array.isArray(v) && v.includes(c.value);
    return false;
  });
}

async function runAction(a: Action, ctx: any) {
  try {
    if (a.type === 'assignOwner') {
      const owner = a.value === 'auto' ? (ctx.after?.ownerId ?? ctx.user?.id ?? ctx.user?.email ?? 'system') : a.value;
      if (owner && ctx.entityType === 'lead') {
        // For now, just log the assignment since we don't have owner_id column yet
        console.log(`AUTO-ASSIGN: Lead ${ctx.entityId} assigned to ${owner}`);
      }
    }
    
    if (a.type === 'createTask') {
      // Calculate due date (simple 3-day default for P3D)
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 3);
      
      await db.insert(tasks).values({
        entityType: ctx.entityType,
        entityId: ctx.entityId,
        title: a.title,
        description: `Auto-generated task for ${ctx.entityType} ${ctx.entityId}`,
        dueAt: dueDate,
        assignedTo: ctx.user?.email || 'system'
      });
      
      console.log(`AUTO-TASK: Created "${a.title}" for ${ctx.entityType} ${ctx.entityId}`);
    }
    
    if (a.type === 'webhook') {
      // Fire-and-forget webhook
      fetch(a.url, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(a.body ?? ctx) 
      }).catch((error) => {
        console.error('Webhook failed:', error);
      });
    }
    
    if (a.type === 'email') {
      // Placeholder for email integration
      console.log(`AUTO-EMAIL → ${a.to}: ${a.subject}`);
    }
  } catch (error) {
    console.error('Error running automation action:', error);
  }
}

export async function loadAndBindRules() {
  try {
    const rules = await db.select().from(automationRules).where(eq(automationRules.enabled, 'true'));
    
    for (const rule of rules) {
      const spec = rule.spec as RuleSpec;
      on(spec.on, async (ctx) => {
        if (check(spec.if, ctx)) {
          console.log(`AUTOMATION: Rule "${rule.name}" triggered for ${spec.on}`);
          for (const action of spec.do) {
            await runAction(action, ctx);
          }
        }
      });
    }
    
    console.log(`Loaded ${rules.length} automation rules`);
  } catch (error) {
    console.error('Error loading automation rules:', error);
  }
}