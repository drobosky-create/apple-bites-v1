import { pgTable, text, serial, integer, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const valuationAssessments = pgTable("valuation_assessments", {
  id: serial("id").primaryKey(),
  
  // Contact Information
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  company: text("company").notNull(),
  jobTitle: text("job_title"),
  
  // EBITDA Components
  netIncome: decimal("net_income", { precision: 12, scale: 2 }).notNull(),
  interest: decimal("interest", { precision: 12, scale: 2 }).notNull(),
  taxes: decimal("taxes", { precision: 12, scale: 2 }).notNull(),
  depreciation: decimal("depreciation", { precision: 12, scale: 2 }).notNull(),
  amortization: decimal("amortization", { precision: 12, scale: 2 }).notNull(),
  
  // Owner Adjustments
  ownerSalary: decimal("owner_salary", { precision: 12, scale: 2 }).default("0"),
  personalExpenses: decimal("personal_expenses", { precision: 12, scale: 2 }).default("0"),
  oneTimeExpenses: decimal("one_time_expenses", { precision: 12, scale: 2 }).default("0"),
  otherAdjustments: decimal("other_adjustments", { precision: 12, scale: 2 }).default("0"),
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
  baseEbitda: decimal("base_ebitda", { precision: 12, scale: 2 }),
  adjustedEbitda: decimal("adjusted_ebitda", { precision: 12, scale: 2 }),
  valuationMultiple: decimal("valuation_multiple", { precision: 5, scale: 2 }),
  lowEstimate: decimal("low_estimate", { precision: 12, scale: 2 }),
  midEstimate: decimal("mid_estimate", { precision: 12, scale: 2 }),
  highEstimate: decimal("high_estimate", { precision: 12, scale: 2 }),
  overallScore: text("overall_score"),
  
  // Generated Content
  narrativeSummary: text("narrative_summary"),
  pdfUrl: text("pdf_url"),
  
  // Processing Status
  isProcessed: boolean("is_processed").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
});

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
  pdfUrl: true,
  isProcessed: true,
  createdAt: true,
});

export type InsertValuationAssessment = z.infer<typeof insertValuationAssessmentSchema>;
export type ValuationAssessment = typeof valuationAssessments.$inferSelect;

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
  netIncome: z.string().min(1, "Net income is required"),
  interest: z.string().min(1, "Interest expense is required"),
  taxes: z.string().min(1, "Tax expense is required"),
  depreciation: z.string().min(1, "Depreciation is required"),
  amortization: z.string().min(1, "Amortization is required"),
  ownerSalary: z.string().optional(),
  personalExpenses: z.string().optional(),
  oneTimeExpenses: z.string().optional(),
  otherAdjustments: z.string().optional(),
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
