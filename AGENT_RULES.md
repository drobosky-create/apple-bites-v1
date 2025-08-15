# Apple Bites AI Agent Rules — Strict Enforcement

## Core Principles
1. **Only modify files that exist** - No phantom code
2. **Check allowed_paths.json before creating files**
3. **No new dependencies without package.json + WHY_DEP.md**
4. **Use existing Material Dashboard components only**
5. **Never mix /portal routing with workspace features**

## RBAC Enforcement (Server-First)
- **Default deny, allow-list only**
- Every route checks: `role ∈ route.allowedRoles + resource.orgId == user.orgId`
- Object-level ACL for VDR folders/files
- Audit log on every write: `{actorId, role, route, method, resource, before/after, ts}`

## Roles & Access Matrix

### Spaces
- `/portal` (client-facing): assessments, status, secure uploads, messages
- `/workspace` (internal): leads, CRM, VDR, team management

### Role Definitions
- **client**: portal only (own org data)
- **buyer**: portal for specific shared deals/VDR (read-only unless granted)
- **analyst**: workspace leads/assessments, CRM (no billing, no team admin)
- **manager**: CRM, VDR, assessments + invite users, approve sharing
- **admin**: full workspace + billing, role assignment, global reports

### Route Permissions
```
/portal/dashboard: [client, buyer, analyst, manager, admin]
/workspace/leads: [analyst, manager, admin]
/workspace/assessments: [analyst, manager, admin]
/workspace/crm: [analyst, manager, admin] (reports: manager+)
/workspace/vdr: [manager, admin] (grant); [analyst] (read/write if assigned)
/workspace/team: [admin]
```

## Lead Flow State Machine (GHL Tag-Driven)

### States (Forward-Only)
1. `lead:intake` → 2. `lead:nurture` → 3. `lead:qualified` → 
4. `assessment:scheduled` → 5. `assessment:completed` → 6. `crm:opportunity:created` →
7. `nda:signed` → 8. `vdr:opened` → 9. `deal:loi` → 10. `deal:dd` → 
11. `deal:won` | `deal:lost`

### Invariants
- State can only move forward (or to terminal)
- Server rejects illegal transitions
- Every state change writes audit + stamps changedBy
- GHL webhook updates trigger state validation

## Data Model Keys
```typescript
Org { id, name, tier }
User { id, orgId, role }
Lead { id, orgId, source, state, ownerId, ghlContactId? }
Assessment { id, orgId, leadId, status, score, reportUrl }
Opportunity { id, orgId, leadId, stage, amount?, expectedClose? }
Deal { id, orgId, opportunityId, stage, fees, closeDate? }
VDR.Room { id, orgId, dealId, ndaRequired, acl[] }
Audit { id, orgId, actorId, action, resource, before, after, ts }
```

## Anti-Phantom Code Checks
- Type check passes
- All import paths exist
- No Grid2 usage
- No `any` types without justification
- Protected routes mapped to roles
- UI tabs rendered only if `hasRole(...)`