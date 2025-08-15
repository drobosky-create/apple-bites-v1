import { pgTable, text, varchar, serial, integer, decimal, timestamp, boolean, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for both Replit Auth and custom auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(), // Replit user ID or generated ID for custom users
  email: varchar("email").unique().notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  fullName: varchar("full_name"), // For custom registrations
  company: varchar("company"), // Company name for demo and business users
  profileImageUrl: varchar("profile_image_url"),
  passwordHash: varchar("password_hash"), // For custom auth users (null for Replit users)
  authProvider: text("auth_provider").notNull().default("custom"), // "replit" or "custom"
  replitUserId: varchar("replit_user_id"), // Original Replit ID if auth provider is replit
  tier: text("tier").notNull().default("free"), // "free", "growth", "capital"
  ghlContactId: text("ghl_contact_id"),
  resultReady: boolean("result_ready").default(false),
  awaitingPasswordCreation: boolean("awaiting_password_creation").default(false),
  isActive: boolean("is_active").default(true),
  emailVerified: boolean("email_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const valuationAssessments = pgTable("valuation_assessments", {
  id: serial("id").primaryKey(),
  
  // Contact Information
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  company: text("company").notNull(),
  jobTitle: text("job_title"),
  foundingYear: integer("founding_year"),
  
  // Industry Classification (for paid tier)
  naicsCode: text("naics_code"),
  sicCode: text("sic_code"),
  industryDescription: text("industry_description"),
  
  // Tier Information
  tier: text("tier").default("free"), // "free", "growth", "capital"
  reportTier: text("report_tier").notNull().default("free"), // "free" or "paid"
  paymentStatus: text("payment_status").default("pending"), // "pending", "completed", "failed"
  stripePaymentId: text("stripe_payment_id"),
  
  // EBITDA Components
  netIncome: decimal("net_income", { precision: 15, scale: 2 }).notNull(),
  interest: decimal("interest", { precision: 15, scale: 2 }).notNull(),
  taxes: decimal("taxes", { precision: 15, scale: 2 }).notNull(),
  depreciation: decimal("depreciation", { precision: 15, scale: 2 }).notNull(),
  amortization: decimal("amortization", { precision: 15, scale: 2 }).notNull(),
  
  // Owner Adjustments
  ownerSalary: decimal("owner_salary", { precision: 15, scale: 2 }).default("0"),
  personalExpenses: decimal("personal_expenses", { precision: 15, scale: 2 }).default("0"),
  oneTimeExpenses: decimal("one_time_expenses", { precision: 15, scale: 2 }).default("0"),
  otherAdjustments: decimal("other_adjustments", { precision: 15, scale: 2 }).default("0"),
  adjustmentNotes: text("adjustment_notes"),
  
  // Value Driver Scores (A-F grades)
  financialPerformance: text("financial_performance").notNull(),
  customerConcentration: text("customer_concentration").notNull(),
  managementTeam: text("management_team").notNull(),
  competitivePosition: text("competitive_position").notNull(),
  growthProspects: text("growth_prospects").notNull(),
  systemsProcesses: text("systems_processes").notNull(),
  assetQuality: text("asset_quality").notNull(),
  industryOutlook: text("industry_outlook").notNull(),
  riskFactors: text("risk_factors").notNull(),
  ownerDependency: text("owner_dependency").notNull(),
  
  // Follow-up and Results
  followUpIntent: text("follow_up_intent").notNull(), // "yes", "maybe", "no"
  additionalComments: text("additional_comments"),
  
  // Calculated Values
  baseEbitda: decimal("base_ebitda", { precision: 15, scale: 2 }),
  adjustedEbitda: decimal("adjusted_ebitda", { precision: 15, scale: 2 }),
  valuationMultiple: decimal("valuation_multiple", { precision: 8, scale: 2 }),
  lowEstimate: decimal("low_estimate", { precision: 15, scale: 2 }),
  midEstimate: decimal("mid_estimate", { precision: 15, scale: 2 }),
  highEstimate: decimal("high_estimate", { precision: 15, scale: 2 }),
  overallScore: text("overall_score"),
  
  // Generated Content
  narrativeSummary: text("narrative_summary"),
  executiveSummary: text("executive_summary"),
  pdfUrl: text("pdf_url"),
  
  // Processing Status
  isProcessed: boolean("is_processed").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Dedicated leads table for CRM integration and lead tracking
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  
  // Basic Contact Information
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  company: text("company").notNull(),
  jobTitle: text("job_title"),
  
  // Lead Source and Classification
  leadSource: text("lead_source").default("valuation_form"), // "valuation_form", "calculator", "direct", etc.
  leadStatus: text("lead_status").default("new"), // "new", "contacted", "qualified", "converted", "closed"
  leadScore: integer("lead_score").default(0), // 0-100 scoring system
  
  // Business Information
  industry: text("industry"),
  companySize: text("company_size"), // "1-10", "11-50", "51-200", "200+"
  annualRevenue: decimal("annual_revenue", { precision: 12, scale: 2 }),
  
  // Assessment Results
  valuationAssessmentId: integer("valuation_assessment_id"),
  estimatedValue: decimal("estimated_value", { precision: 12, scale: 2 }),
  overallGrade: text("overall_grade"),
  followUpIntent: text("follow_up_intent"), // "yes", "maybe", "no"
  
  // CRM Integration
  crmId: text("crm_id"), // External CRM system ID
  lastCrmSync: timestamp("last_crm_sync"),
  crmSyncStatus: text("crm_sync_status").default("pending"), // "pending", "synced", "failed"
  
  // Engagement Tracking
  lastContactDate: timestamp("last_contact_date"),
  nextFollowUpDate: timestamp("next_follow_up_date"),
  totalInteractions: integer("total_interactions").default(0),
  emailsSent: integer("emails_sent").default(0),
  
  // Manual lead creation and override features
  intakeSource: text("intake_source").notNull().default("applebites"), // "applebites" or "manual"
  applebitestaken: boolean("applebites_taken").notNull().default(true),
  qualifierScore: decimal("qualifier_score", { precision: 5, scale: 2 }),
  lowQualifierFlag: boolean("low_qualifier_flag").notNull().default(false),
  lastOverrideAt: timestamp("last_override_at"),
  overrideCount: integer("override_count").notNull().default(0),
  
  // Additional Data
  notes: text("notes"),
  tags: text("tags").array(), // For categorization and filtering
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Lead interactions/activities log
export const leadActivities = pgTable("lead_activities", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").notNull(),
  
  activityType: text("activity_type").notNull(), // "assessment_completed", "email_sent", "call_made", "meeting_scheduled", etc.
  activityData: text("activity_data"), // JSON string for additional data
  description: text("description"),
  metadata: jsonb("metadata"), // Additional structured data
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const leadsRelations = relations(leads, ({ one, many }) => ({
  valuationAssessment: one(valuationAssessments, {
    fields: [leads.valuationAssessmentId],
    references: [valuationAssessments.id],
  }),
  activities: many(leadActivities),
}));

export const leadActivitiesRelations = relations(leadActivities, ({ one }) => ({
  lead: one(leads, {
    fields: [leadActivities.leadId],
    references: [leads.id],
  }),
}));

export const valuationAssessmentsRelations = relations(valuationAssessments, ({ many }) => ({
  leads: many(leads),
}));

export const insertValuationAssessmentSchema = createInsertSchema(valuationAssessments).omit({
  id: true,
  baseEbitda: true,
  adjustedEbitda: true,
  valuationMultiple: true,
  lowEstimate: true,
  midEstimate: true,
  highEstimate: true,
  overallScore: true,
  narrativeSummary: true,
  executiveSummary: true,
  pdfUrl: true,
  isProcessed: true,
  createdAt: true,
});

export type InsertValuationAssessment = z.infer<typeof insertValuationAssessmentSchema>;
export type ValuationAssessment = typeof valuationAssessments.$inferSelect;

// Lead schemas
export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLeadActivitySchema = createInsertSchema(leadActivities).omit({
  id: true,
  createdAt: true,
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;
export type InsertLeadActivity = z.infer<typeof insertLeadActivitySchema>;
export type LeadActivity = typeof leadActivities.$inferSelect;

// Lead state overrides table for manual advancement
export const leadStateOverrides = pgTable("lead_state_overrides", {
  id: varchar("id").primaryKey().notNull(), // UUID
  leadId: integer("lead_id").notNull().references(() => leads.id),
  fromState: text("from_state").notNull(),
  toState: text("to_state").notNull(),
  requestedByUserId: text("requested_by_user_id").notNull(),
  approvedByUserId: text("approved_by_user_id").notNull(),
  reason: text("reason").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations for lead state overrides
export const leadStateOverridesRelations = relations(leadStateOverrides, ({ one }) => ({
  lead: one(leads, {
    fields: [leadStateOverrides.leadId],
    references: [leads.id],
  }),
}));

// Schema for lead state overrides
export const insertLeadStateOverrideSchema = createInsertSchema(leadStateOverrides).omit({
  id: true,
  createdAt: true,
});

export type InsertLeadStateOverride = z.infer<typeof insertLeadStateOverrideSchema>;
export type LeadStateOverride = typeof leadStateOverrides.$inferSelect;

// Team management tables
export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("member"), // admin, manager, member
  hashedPassword: varchar("hashed_password", { length: 255 }).notNull(),
  isActive: boolean("is_active").default(true),
  mustChangePassword: boolean("must_change_password").default(true),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const teamSessions = pgTable("team_sessions", {
  id: varchar("id", { length: 128 }).primaryKey(),
  teamMemberId: integer("team_member_id").references(() => teamMembers.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const teamMembersRelations = relations(teamMembers, ({ many }) => ({
  sessions: many(teamSessions),
}));

export const teamSessionsRelations = relations(teamSessions, ({ one }) => ({
  teamMember: one(teamMembers, {
    fields: [teamSessions.teamMemberId],
    references: [teamMembers.id],
  }),
}));

// Schema types
export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({
  id: true,
  hashedPassword: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const createPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = typeof users.$inferInsert;
export type TeamMember = typeof teamMembers.$inferSelect;
export type TeamSession = typeof teamSessions.$inferSelect;
export type User = typeof users.$inferSelect;

// Audit Events table for tracking all system changes
export const auditEvents = pgTable('audit_events', {
  id: varchar('id').primaryKey(),
  actor: text('actor').notNull(),              // email or user id
  actorRole: text('actor_role').notNull(),
  entityType: text('entity_type').notNull(),   // 'lead' | 'account' | ...
  entityId: text('entity_id').notNull(),
  action: text('action').notNull(),            // 'create' | 'update' | 'delete'
  before: jsonb('before'),
  after: jsonb('after'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Automation Rules table for workflow automation
export const automationRules = pgTable('automation_rules', {
  id: varchar('id').primaryKey(),
  name: text('name').notNull(),
  enabled: text('enabled').notNull().default('true'),
  // JSON: { on: 'lead.updated', if: [{path:'status', op:'eq', value:'qualified'}], do: [{type:'assignOwner', value:'auto'}, {type:'createTask', title:'Discovery Call', dueIn:'P3D'}] }
  spec: jsonb('spec').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Tasks table for automated task creation
export const tasks = pgTable('tasks', {
  id: varchar('id').primaryKey(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  status: text('status').notNull().default('pending'),
  assignedTo: text('assigned_to'),
  dueAt: timestamp('due_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type AuditEvent = typeof auditEvents.$inferSelect;
export type AutomationRule = typeof automationRules.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type LoginCredentials = z.infer<typeof loginSchema>;

// Custom user registration/login schemas
export const registerUserSchema = createInsertSchema(users).pick({
  firstName: true,
  lastName: true,
  email: true,
}).extend({
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

export const loginUserSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterUser = z.infer<typeof registerUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type CreatePasswordData = z.infer<typeof createPasswordSchema>;

// Form step schemas for validation
export const contactInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(1, "Phone number is required"),
  company: z.string().min(1, "Company name is required"),
  jobTitle: z.string().optional(),
});

export const ebitdaSchema = z.object({
  netIncome: z.string().optional().default("0"),
  interest: z.string().optional().default("0"),
  taxes: z.string().optional().default("0"),
  depreciation: z.string().optional().default("0"),
  amortization: z.string().optional().default("0"),
  adjustmentNotes: z.string().optional(),
});

export const adjustmentsSchema = z.object({
  ownerSalary: z.string().optional(),
  personalExpenses: z.string().optional(),
  oneTimeExpenses: z.string().optional(),
  otherAdjustments: z.string().optional(),
  adjustmentNotes: z.string().optional(),
});

export const valueDriversSchema = z.object({
  financialPerformance: z.enum(["A", "B", "C", "D", "F"]),
  customerConcentration: z.enum(["A", "B", "C", "D", "F"]),
  managementTeam: z.enum(["A", "B", "C", "D", "F"]),
  competitivePosition: z.enum(["A", "B", "C", "D", "F"]),
  growthProspects: z.enum(["A", "B", "C", "D", "F"]),
  systemsProcesses: z.enum(["A", "B", "C", "D", "F"]),
  assetQuality: z.enum(["A", "B", "C", "D", "F"]),
  industryOutlook: z.enum(["A", "B", "C", "D", "F"]),
  riskFactors: z.enum(["A", "B", "C", "D", "F"]),
  ownerDependency: z.enum(["A", "B", "C", "D", "F"]),
});

export const followUpSchema = z.object({
  followUpIntent: z.enum(["yes", "maybe", "no"]),
  additionalComments: z.string().optional(),
});

export type ContactInfo = z.infer<typeof contactInfoSchema>;
export type EbitdaData = z.infer<typeof ebitdaSchema>;
export type AdjustmentsData = z.infer<typeof adjustmentsSchema>;
export type ValueDriversData = z.infer<typeof valueDriversSchema>;
export type FollowUpData = z.infer<typeof followUpSchema>;

// ===== APPLE BITES ECOSYSTEM DATA MODEL =====

// Core CRM - Firms (businesses we're evaluating/working with)
export const firms = pgTable("firms", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  domain: varchar("domain", { length: 255 }), // For email domain matching
  size: varchar("size", { length: 50 }), // "1-10", "11-50", "51-200", "200+"
  naics: varchar("naics", { length: 10 }), // Primary NAICS code
  geography: varchar("geography", { length: 100 }), // Primary location
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Core CRM - Contacts at firms
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  firmId: integer("firm_id").notNull().references(() => firms.id),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  phone: varchar("phone", { length: 50 }),
  title: varchar("title", { length: 150 }),
  ownerId: integer("owner_id").references(() => teamMembers.id), // Assigned team member
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Core CRM - Opportunities (assessment → deal pipeline)
export const opportunities = pgTable("opportunities", {
  id: serial("id").primaryKey(),
  firmId: integer("firm_id").notNull().references(() => firms.id),
  primaryContactId: integer("primary_contact_id").notNull().references(() => contacts.id),
  tier: text("tier").notNull(), // "free", "growth", "capital" from GHL tags
  source: text("source").notNull(), // "fb", "li", "referral", "site", "event"
  status: text("status").notNull().default("new"), // "new", "qualified", "nurture", "won", "lost" 
  score: integer("score"), // Assessment overall score
  estValue: decimal("est_value", { precision: 15, scale: 2 }), // Estimated business value
  ownerId: integer("owner_id").references(() => teamMembers.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Assessment results linked to opportunities
export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  firmId: integer("firm_id").notNull().references(() => firms.id),
  contactId: integer("contact_id").notNull().references(() => contacts.id),
  opportunityId: integer("opportunity_id").references(() => opportunities.id),
  tier: text("tier").notNull(), // "free", "growth", "capital"
  ebitda: decimal("ebitda", { precision: 15, scale: 2 }).notNull(),
  adjustments: decimal("adjustments", { precision: 15, scale: 2 }).default("0"),
  valueLow: decimal("value_low", { precision: 15, scale: 2 }),
  valueHigh: decimal("value_high", { precision: 15, scale: 2 }),
  reportUrl: text("report_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Deals (promoted opportunities)
export const deals = pgTable("deals", {
  id: serial("id").primaryKey(),
  firmId: integer("firm_id").notNull().references(() => firms.id),
  name: varchar("name", { length: 255 }).notNull(),
  stage: text("stage").notNull().default("Pre-LOI"), // "Pre-LOI", "LOI", "DD", "Closing", "Closed"
  feeModel: text("fee_model"), // "Success", "Retainer", "Hybrid"
  expectedClose: timestamp("expected_close"),
  ownerId: integer("owner_id").notNull().references(() => teamMembers.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Deal milestones/tasks
export const milestones = pgTable("milestones", {
  id: serial("id").primaryKey(),
  dealId: integer("deal_id").notNull().references(() => deals.id),
  type: text("type").notNull(), // "document", "call", "meeting", "deadline"
  title: varchar("title", { length: 255 }).notNull(),
  dueAt: timestamp("due_at"),
  doneAt: timestamp("done_at"),
  assigneeId: integer("assignee_id").references(() => teamMembers.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// VDR - Rooms (one per deal)
export const vdrRooms = pgTable("vdr_rooms", {
  id: serial("id").primaryKey(),
  dealId: integer("deal_id").references(() => deals.id),
  name: varchar("name", { length: 255 }).notNull(),
  policyTemplateId: integer("policy_template_id"), // For future template system
  status: text("status").default("active"), // "active", "archived"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// VDR - Folders (hierarchical structure within rooms)
export const vdrFolders = pgTable("vdr_folders", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").notNull().references(() => vdrRooms.id),
  path: varchar("path", { length: 500 }).notNull(), // Full path like "/Financial/2024"
  visibilityRule: text("visibility_rule").default("room"), // "room", "restricted", "public"
  createdAt: timestamp("created_at").defaultNow(),
});

// VDR - Documents
export const vdrDocs = pgTable("vdr_docs", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").notNull().references(() => vdrRooms.id),
  folderId: integer("folder_id").references(() => vdrFolders.id),
  name: varchar("name", { length: 255 }).notNull(),
  version: integer("version").default(1),
  storageKey: text("storage_key").notNull(), // File storage key
  checksum: varchar("checksum", { length: 64 }), // For integrity
  uploadedBy: integer("uploaded_by").references(() => teamMembers.id),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

// RBAC - Access control (object-level permissions)
export const access = pgTable("access", {
  id: serial("id").primaryKey(),
  objectType: text("object_type").notNull(), // "deal", "room", "folder"
  objectId: integer("object_id").notNull(),
  subjectType: text("subject_type").notNull(), // "user", "role", "firm"
  subjectId: varchar("subject_id", { length: 255 }).notNull(), // ID or role name
  scope: text("scope").notNull(), // "read", "upload", "manage", etc.
  createdAt: timestamp("created_at").defaultNow(),
});

// Audit log
export const audit = pgTable("audit", {
  id: serial("id").primaryKey(),
  actorId: integer("actor_id").references(() => teamMembers.id),
  action: text("action").notNull(),
  objectType: text("object_type").notNull(),
  objectId: integer("object_id").notNull(),
  ip: varchar("ip", { length: 45 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Invites for external access
export const invites = pgTable("invites", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").references(() => vdrRooms.id),
  dealId: integer("deal_id").references(() => deals.id),
  email: varchar("email", { length: 255 }).notNull(),
  role: text("role").notNull(), // "Client", "Client Admin", etc.
  expiresAt: timestamp("expires_at").notNull(),
  acceptedAt: timestamp("accepted_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ===== RELATIONS =====

export const firmsRelations = relations(firms, ({ many }) => ({
  contacts: many(contacts),
  opportunities: many(opportunities),
  assessments: many(assessments),
  deals: many(deals),
}));

export const contactsRelations = relations(contacts, ({ one, many }) => ({
  firm: one(firms, {
    fields: [contacts.firmId],
    references: [firms.id],
  }),
  owner: one(teamMembers, {
    fields: [contacts.ownerId],
    references: [teamMembers.id],
  }),
}));

export const opportunitiesRelations = relations(opportunities, ({ one, many }) => ({
  firm: one(firms, {
    fields: [opportunities.firmId],
    references: [firms.id],
  }),
  primaryContact: one(contacts, {
    fields: [opportunities.primaryContactId],
    references: [contacts.id],
  }),
  owner: one(teamMembers, {
    fields: [opportunities.ownerId],
    references: [teamMembers.id],
  }),
  assessments: many(assessments),
}));

export const assessmentsRelations = relations(assessments, ({ one }) => ({
  firm: one(firms, {
    fields: [assessments.firmId],
    references: [firms.id],
  }),
  contact: one(contacts, {
    fields: [assessments.contactId],
    references: [contacts.id],
  }),
  opportunity: one(opportunities, {
    fields: [assessments.opportunityId],
    references: [opportunities.id],
  }),
}));

export const dealsRelations = relations(deals, ({ one, many }) => ({
  firm: one(firms, {
    fields: [deals.firmId],
    references: [firms.id],
  }),
  owner: one(teamMembers, {
    fields: [deals.ownerId],
    references: [teamMembers.id],
  }),
  milestones: many(milestones),
  vdrRooms: many(vdrRooms),
}));

export const milestonesRelations = relations(milestones, ({ one }) => ({
  deal: one(deals, {
    fields: [milestones.dealId],
    references: [deals.id],
  }),
  assignee: one(teamMembers, {
    fields: [milestones.assigneeId],
    references: [teamMembers.id],
  }),
}));

export const vdrRoomsRelations = relations(vdrRooms, ({ one, many }) => ({
  deal: one(deals, {
    fields: [vdrRooms.dealId],
    references: [deals.id],
  }),
  folders: many(vdrFolders),
  docs: many(vdrDocs),
}));

export const vdrFoldersRelations = relations(vdrFolders, ({ one, many }) => ({
  room: one(vdrRooms, {
    fields: [vdrFolders.roomId],
    references: [vdrRooms.id],
  }),
  docs: many(vdrDocs),
}));

export const vdrDocsRelations = relations(vdrDocs, ({ one }) => ({
  room: one(vdrRooms, {
    fields: [vdrDocs.roomId],
    references: [vdrRooms.id],
  }),
  folder: one(vdrFolders, {
    fields: [vdrDocs.folderId],
    references: [vdrFolders.id],
  }),
  uploadedByUser: one(teamMembers, {
    fields: [vdrDocs.uploadedBy],
    references: [teamMembers.id],
  }),
}));

// ===== SCHEMA TYPES =====

export const insertFirmSchema = createInsertSchema(firms).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOpportunitySchema = createInsertSchema(opportunities).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
  createdAt: true,
});

export const insertDealSchema = createInsertSchema(deals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVdrRoomSchema = createInsertSchema(vdrRooms).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVdrFolderSchema = createInsertSchema(vdrFolders).omit({
  id: true,
  createdAt: true,
});

export const insertVdrDocSchema = createInsertSchema(vdrDocs).omit({
  id: true,
  uploadedAt: true,
});

export const insertAccessSchema = createInsertSchema(access).omit({
  id: true,
  createdAt: true,
});

export const insertAuditSchema = createInsertSchema(audit).omit({
  id: true,
  createdAt: true,
});

export const insertInviteSchema = createInsertSchema(invites).omit({
  id: true,
  createdAt: true,
});

export const insertMilestoneSchema = createInsertSchema(milestones).omit({
  id: true,
  createdAt: true,
});

// ===== ECOSYSTEM TYPES =====

export type Firm = typeof firms.$inferSelect;
export type InsertFirm = z.infer<typeof insertFirmSchema>;

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;

export type Opportunity = typeof opportunities.$inferSelect;
export type InsertOpportunity = z.infer<typeof insertOpportunitySchema>;

export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;

export type Deal = typeof deals.$inferSelect;
export type InsertDeal = z.infer<typeof insertDealSchema>;

export type Milestone = typeof milestones.$inferSelect;
export type InsertMilestone = z.infer<typeof insertMilestoneSchema>;

export type VdrRoom = typeof vdrRooms.$inferSelect;
export type InsertVdrRoom = z.infer<typeof insertVdrRoomSchema>;

export type VdrFolder = typeof vdrFolders.$inferSelect;
export type InsertVdrFolder = z.infer<typeof insertVdrFolderSchema>;

export type VdrDoc = typeof vdrDocs.$inferSelect;
export type InsertVdrDoc = z.infer<typeof insertVdrDocSchema>;

export type Access = typeof access.$inferSelect;
export type InsertAccess = z.infer<typeof insertAccessSchema>;

export type Audit = typeof audit.$inferSelect;
export type InsertAudit = z.infer<typeof insertAuditSchema>;

export type Invite = typeof invites.$inferSelect;
export type InsertInvite = z.infer<typeof insertInviteSchema>;
