import { pgTable, text, varchar, serial, integer, decimal, timestamp, boolean, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// ========================================
// CORE BUSINESS TABLES
// ========================================

// Users table with modern authentication support
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique().notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  fullName: varchar("full_name"),
  profileImageUrl: varchar("profile_image_url"),
  passwordHash: varchar("password_hash"),
  authProvider: text("auth_provider").notNull().default("custom"), // "replit", "custom", "oauth"
  tier: text("tier").notNull().default("free"), // "free", "growth", "capital"
  isActive: boolean("is_active").default(true),
  emailVerified: boolean("email_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Enhanced valuation assessments table
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
  
  // Industry Classification
  naicsCode: text("naics_code"),
  industryDescription: text("industry_description"),
  
  // Tier Information
  tier: text("tier").default("free"),
  reportTier: text("report_tier").notNull().default("free"),
  paymentStatus: text("payment_status").default("pending"),
  
  // EBITDA Components (Enhanced precision)
  netIncome: decimal("net_income", { precision: 15, scale: 2 }).notNull(),
  interest: decimal("interest", { precision: 15, scale: 2 }).notNull(),
  taxes: decimal("taxes", { precision: 15, scale: 2 }).notNull(),
  depreciation: decimal("depreciation", { precision: 15, scale: 2 }).notNull(),
  amortization: decimal("amortization", { precision: 15, scale: 2 }).notNull(),
  
  // Owner Adjustments with better defaults
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
  
  // Follow-up Information
  followUpIntent: text("follow_up_intent").notNull(),
  additionalComments: text("additional_comments"),
  
  // Calculated Values
  baseEbitda: decimal("base_ebitda", { precision: 15, scale: 2 }),
  adjustedEbitda: decimal("adjusted_ebitda", { precision: 15, scale: 2 }),
  valuationMultiple: decimal("valuation_multiple", { precision: 8, scale: 2 }),
  lowEstimate: decimal("low_estimate", { precision: 15, scale: 2 }),
  midEstimate: decimal("mid_estimate", { precision: 15, scale: 2 }),
  highEstimate: decimal("high_estimate", { precision: 15, scale: 2 }),
  overallScore: text("overall_score"),
  
  // AI Generated Content
  narrativeSummary: text("narrative_summary"),
  executiveSummary: text("executive_summary"),
  improvementRecommendations: text("improvement_recommendations"),
  
  // Files and Processing
  pdfUrl: text("pdf_url"),
  isProcessed: boolean("is_processed").default(false),
  processingError: text("processing_error"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Enhanced leads table for CRM integration
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  
  // Contact Information
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  company: text("company").notNull(),
  jobTitle: text("job_title"),
  
  // Lead Classification
  leadSource: text("lead_source").default("valuation_form"),
  leadStatus: text("lead_status").default("new"),
  leadScore: integer("lead_score").default(0), // 0-100 scoring
  priority: text("priority").default("medium"), // "low", "medium", "high"
  
  // Business Information
  industry: text("industry"),
  companySize: text("company_size"),
  annualRevenue: decimal("annual_revenue", { precision: 12, scale: 2 }),
  
  // Assessment Connection
  valuationAssessmentId: integer("valuation_assessment_id"),
  estimatedValue: decimal("estimated_value", { precision: 12, scale: 2 }),
  overallGrade: text("overall_grade"),
  followUpIntent: text("follow_up_intent"),
  
  // CRM Integration
  crmId: text("crm_id"),
  lastCrmSync: timestamp("last_crm_sync"),
  crmSyncStatus: text("crm_sync_status").default("pending"),
  
  // Engagement Tracking
  lastContactDate: timestamp("last_contact_date"),
  nextFollowUpDate: timestamp("next_follow_up_date"),
  totalInteractions: integer("total_interactions").default(0),
  emailsSent: integer("emails_sent").default(0),
  
  // Additional Data
  notes: text("notes"),
  tags: text("tags").array(),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// NAICS Industry Database
export const naicsIndustries = pgTable("naics_industries", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  title: text("title").notNull(),
  level: integer("level").notNull(),
  parentCode: text("parent_code"),
  
  // Valuation multipliers
  minMultiplier: decimal("min_multiplier", { precision: 8, scale: 2 }),
  avgMultiplier: decimal("avg_multiplier", { precision: 8, scale: 2 }),
  maxMultiplier: decimal("max_multiplier", { precision: 8, scale: 2 }),
  
  // Enhanced data
  description: text("description"),
  riskLevel: text("risk_level"), // "low", "medium", "high"
  growthOutlook: text("growth_outlook"), // "poor", "stable", "good", "excellent"
  
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Session management
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// ========================================
// RELATIONS
// ========================================

export const leadsRelations = relations(leads, ({ one }) => ({
  valuationAssessment: one(valuationAssessments, {
    fields: [leads.valuationAssessmentId],
    references: [valuationAssessments.id],
  }),
}));

export const valuationAssessmentsRelations = relations(valuationAssessments, ({ many }) => ({
  leads: many(leads),
}));

export const naicsIndustriesRelations = relations(naicsIndustries, ({ many, one }) => ({
  children: many(naicsIndustries, { relationName: "naics_hierarchy" }),
  parent: one(naicsIndustries, {
    fields: [naicsIndustries.parentCode],
    references: [naicsIndustries.code],
    relationName: "naics_hierarchy",
  }),
}));

// ========================================
// ZOD SCHEMAS FOR VALIDATION
// ========================================

// Form validation schemas
export const contactInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(1, "Phone number is required"),
  company: z.string().min(1, "Company name is required"),
  jobTitle: z.string().optional(),
  foundingYear: z.number().min(1800).max(new Date().getFullYear()).optional(),
});

export const ebitdaSchema = z.object({
  netIncome: z.string().regex(/^-?\d+(\.\d{1,2})?$/, "Invalid number format"),
  interest: z.string().regex(/^-?\d+(\.\d{1,2})?$/, "Invalid number format"),
  taxes: z.string().regex(/^-?\d+(\.\d{1,2})?$/, "Invalid number format"),
  depreciation: z.string().regex(/^-?\d+(\.\d{1,2})?$/, "Invalid number format"),
  amortization: z.string().regex(/^-?\d+(\.\d{1,2})?$/, "Invalid number format"),
});

export const adjustmentsSchema = z.object({
  ownerSalary: z.string().regex(/^-?\d+(\.\d{1,2})?$/, "Invalid number format").optional(),
  personalExpenses: z.string().regex(/^-?\d+(\.\d{1,2})?$/, "Invalid number format").optional(),
  oneTimeExpenses: z.string().regex(/^-?\d+(\.\d{1,2})?$/, "Invalid number format").optional(),
  otherAdjustments: z.string().regex(/^-?\d+(\.\d{1,2})?$/, "Invalid number format").optional(),
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

// Database insert schemas
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
  improvementRecommendations: true,
  pdfUrl: true,
  isProcessed: true,
  processingError: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNaicsSchema = createInsertSchema(naicsIndustries).omit({
  id: true,
  updatedAt: true,
});

// ========================================
// TYPE EXPORTS
// ========================================

export type InsertValuationAssessment = z.infer<typeof insertValuationAssessmentSchema>;
export type ValuationAssessment = typeof valuationAssessments.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertNaics = z.infer<typeof insertNaicsSchema>;
export type NaicsIndustry = typeof naicsIndustries.$inferSelect;

// Form data types
export type ContactInfo = z.infer<typeof contactInfoSchema>;
export type EbitdaData = z.infer<typeof ebitdaSchema>;
export type AdjustmentsData = z.infer<typeof adjustmentsSchema>;
export type ValueDriversData = z.infer<typeof valueDriversSchema>;
export type FollowUpData = z.infer<typeof followUpSchema>;

// Business logic types
export interface ValuationResult {
  baseEbitda: number;
  adjustedEbitda: number;
  valuationMultiple: number;
  lowEstimate: number;
  midEstimate: number;
  highEstimate: number;
  overallScore: string;
  gradeBreakdown: Record<string, { grade: string; multiplier: number }>;
}

export interface ValueDriverScores {
  financialPerformance: string;
  customerConcentration: string;
  managementTeam: string;
  competitivePosition: string;
  growthProspects: string;
  systemsProcesses: string;
  assetQuality: string;
  industryOutlook: string;
  riskFactors: string;
  ownerDependency: string;
}