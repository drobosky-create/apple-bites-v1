# Portal vs Workspace Navigation — Apple Bites Ecosystem

## Architecture Overview

Apple Bites uses a **strict dual-space architecture** to separate client-facing and internal functionality.

### Spaces

#### `/portal` (Client-Facing)
- **Purpose**: External client access to their own data and invited resources
- **Users**: clients, buyers (external parties in deals)
- **Design**: Customer-focused, simplified interface with Apple Bites branding
- **Security**: Org-isolated, own data only (unless specifically granted VDR access)

#### `/workspace` (Internal Only)
- **Purpose**: Internal team management of leads, deals, and operations
- **Users**: analysts, managers, admins
- **Design**: Professional dashboard with full feature access
- **Security**: Role-based access with audit logging

## Route Structure

### Portal Routes (`/portal`)
```
/portal/                    → Dashboard (assessment history overview)
/portal/assessments         → Assessment History (DataGrid)
/portal/data-rooms          → Invited VDR Access (list + access)
/portal/messages            → Secure messaging with Meritage team
/portal/documents           → Document upload/download center
```

### Workspace Routes (`/workspace`)
```
/workspace/                 → CRM Dashboard (deal pipeline overview)
/workspace/leads            → Lead Management (intake → qualified)
/workspace/assessments      → Assessment Administration (cross-org search)
/workspace/crm              → Deal Pipeline (opportunities → closed)
/workspace/vdr              → VDR Management (room creation/access control)
/workspace/team             → Team Directory & Role Management (admin only)
/workspace/billing          → Billing & Subscription Management (admin only)
```

## Role-Based UI Rendering

### Portal UI (All Authenticated Users)
```typescript
// Portal tabs visible to all roles
const portalTabs = [
  { label: "Dashboard", path: "/portal" },
  { label: "Assessments", path: "/portal/assessments" },
  { label: "Data Rooms", path: "/portal/data-rooms" },
  { label: "Messages", path: "/portal/messages" }
];
```

### Workspace UI (Role-Dependent)
```typescript
// Tabs visible based on user role
const workspaceTabs = [
  { label: "Leads", path: "/workspace/leads", roles: ["analyst", "manager", "admin"] },
  { label: "Assessments", path: "/workspace/assessments", roles: ["analyst", "manager", "admin"] },
  { label: "CRM", path: "/workspace/crm", roles: ["analyst", "manager", "admin"] },
  { label: "VDR", path: "/workspace/vdr", roles: ["manager", "admin"] },
  { label: "Team", path: "/workspace/team", roles: ["admin"] },
  { label: "Billing", path: "/workspace/billing", roles: ["admin"] }
];

// Render only tabs user has access to
const visibleTabs = workspaceTabs.filter(tab => 
  tab.roles.includes(currentUser.role)
);
```

## Navigation Guards

### Client-Side Guards (UI Layer)
```typescript
// Hide workspace navigation for portal-only users
const showWorkspaceNav = ["analyst", "manager", "admin"].includes(user.role);

// Hide specific tabs based on role
const hasAccess = (requiredRoles: string[]) => 
  requiredRoles.includes(user.role);
```

### Server-Side Guards (API Layer)
```typescript
// All routes protected by RBAC middleware
app.use('/api/portal/*', requireRouteAccess());
app.use('/api/workspace/*', requireRouteAccess());

// Specific route protections in ROUTE_PERMISSIONS matrix
```

## User Experience Flow

### Portal Users (clients, buyers)
1. Login → Redirect to `/portal`
2. See only portal tabs in navigation
3. Cannot access workspace URLs (403 Forbidden)
4. Focused on their assessments and invited data rooms

### Workspace Users (analysts, managers, admins)
1. Login → Redirect to `/workspace` (or portal if they choose)
2. See both portal and workspace navigation
3. Can switch between spaces using space selector
4. Full functionality based on role level

## Implementation Guidelines for AI Agent

### DO:
- Always check `ROUTE_PERMISSIONS` before creating new routes
- Use `hasAccess(user.role, requiredRoles)` for UI rendering
- Implement server-side validation for all route access
- Maintain strict separation between portal and workspace features

### DON'T:
- Mix portal functionality in workspace components
- Allow workspace routes in portal navigation
- Bypass RBAC checks for "convenience"
- Create routes not defined in `ROUTE_PERMISSIONS`

## Testing Checklist

- [ ] Portal users cannot access workspace routes
- [ ] Workspace users see appropriate tabs for their role
- [ ] Server returns 403 for unauthorized route access
- [ ] UI hides tabs for roles without access
- [ ] Audit logging captures unauthorized attempts