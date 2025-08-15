# Apple Bites AI Coding Agent — System Rules (Strict)

Always follow these when implementing, modifying, or planning code for applebites-v1.

## Project Context
- **Repo**: https://github.com/drobosky-create/applebites-v1
- **Branch**: ecosystem-modules (protecting main Apple Bites platform)
- **Mission**: Build comprehensive M&A ecosystem: Assessment Engine, CRM, VDR, Team Management

## Core Implementation Rules

### 1. Material Dashboard Components Only
- Use Material Dashboard components that already exist: MDBox, MDTypography, MDButton, etc.
- **NO Grid2**: Use standard MUI Grid instead of @mui/material/Unstable_Grid2
- **NO phantom imports**: Verify all import paths before using
- If missing: pick existing alternative or create local minimal stub

### 2. Architecture Patterns
- **Route split**: `/portal` (clients) vs `/workspace` (internal teams)
- **RBAC + Object ACL scopes**:
  - `assessments:view:self` | `assessments:view:org`
  - `crm:deal:{read|write|admin}`
  - `vdr:room:{read|upload|manage}`
  - `team:{read|manage}`

### 3. Lead Management
- **Tag-based ingestion** (GoHighLevel): `tier:*`, `status:*`, `source:*`
- **Idempotent upserts**: Firm/Contact/Opportunity tables
- **No duplicates**: Use email/name matching for deduplication

### 4. Dependencies
- **No new deps** unless found in package.json or added explicitly
- Use existing packages: React 18, TypeScript, Material-UI, Drizzle ORM
- Stripe, GoHighLevel, OpenAI integrations already configured

### 5. Implementation Order
1. **Data model** (shared/schema.ts) - define types first
2. **RBAC middleware** (server/rbac.ts) - security foundation
3. **API routes** (server/routes.ts) - backend functionality
4. **UI components** (client/src/pages) - frontend interfaces
5. **Integration testing** - verify end-to-end flows

### 6. Feature Flags
- Use feature flags for modules in development
- Mark incomplete features clearly: `FEATURE_CRM_KANBAN`, `FEATURE_VDR_MANAGEMENT`
- Graceful degradation for missing functionality

### 7. Code Quality Standards
- **TypeScript strict mode**: No `any` types without justification
- **Error handling**: Try/catch blocks with meaningful error messages
- **Authentication**: All protected routes use proper middleware
- **Validation**: Zod schemas for all API inputs

### 8. Anti-Phantom Code Protocol
- **Verify imports**: Check file existence before import statements
- **Use existing paths**: Reference actual Material Dashboard components
- **Create stubs**: If component missing, create minimal local version
- **No Grid2**: Use standard MUI Grid component only

## Commit/PR Checklist
- [ ] All imports verified and paths exist
- [ ] No Grid2 usage anywhere in codebase
- [ ] TypeScript compiles without errors
- [ ] RBAC middleware properly applied to protected routes
- [ ] API responses include proper error handling
- [ ] UI components use verified Material Dashboard patterns

## Runtime Requirements
- Agent must print system prompt excerpt on startup
- Hard fails on Grid2 detection
- TypeScript compilation validates all imports
- ESLint enforces no-restricted-imports rules