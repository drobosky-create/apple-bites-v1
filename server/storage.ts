import { 
  valuationAssessments, 
  leads,
  leadActivities,
  teamMembers,
  teamSessions,
  accessTokens,
  type ValuationAssessment, 
  type InsertValuationAssessment,
  type Lead,
  type InsertLead,
  type LeadActivity,
  type InsertLeadActivity,
  type TeamMember,
  type InsertTeamMember,
  type TeamSession,
  type AccessToken,
  type InsertAccessToken
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, lt } from "drizzle-orm";
import crypto from "crypto";

export interface IStorage {
  // Valuation Assessment methods
  createValuationAssessment(assessment: InsertValuationAssessment): Promise<ValuationAssessment>;
  getValuationAssessment(id: number): Promise<ValuationAssessment | undefined>;
  updateValuationAssessment(id: number, updates: Partial<ValuationAssessment>): Promise<ValuationAssessment>;
  getAllValuationAssessments(): Promise<ValuationAssessment[]>;

  // Lead management methods
  createLead(lead: InsertLead): Promise<Lead>;
  getLeadByEmail(email: string): Promise<Lead | undefined>;
  getLeadById(id: number): Promise<Lead | undefined>;
  updateLead(id: number, updates: Partial<Lead>): Promise<Lead>;
  deleteLead(id: number): Promise<void>;
  getAllLeads(): Promise<Lead[]>;
  getLeadsByStatus(status: string): Promise<Lead[]>;
  searchLeads(query: string): Promise<Lead[]>;

  // Lead activity methods
  createLeadActivity(activity: InsertLeadActivity): Promise<LeadActivity>;
  getLeadActivities(leadId: number): Promise<LeadActivity[]>;

  // Team management methods
  createTeamMember(member: InsertTeamMember & { hashedPassword: string }): Promise<TeamMember>;
  getTeamMemberByEmail(email: string): Promise<TeamMember | undefined>;
  getTeamMemberById(id: number): Promise<TeamMember | undefined>;
  getAllTeamMembers(): Promise<TeamMember[]>;
  updateTeamMember(id: number, updates: Partial<TeamMember>): Promise<TeamMember>;
  deleteTeamMember(id: number): Promise<void>;
  createTeamSession(teamMemberId: number, sessionId: string, expiresAt: Date): Promise<TeamSession>;
  getTeamSession(sessionId: string): Promise<TeamSession | undefined>;
  updateTeamSession(sessionId: string, expiresAt: Date): Promise<void>;
  deleteTeamSession(sessionId: string): Promise<void>;

  // Assessment data methods for post-purchase access
  saveAssessmentData(data: { email: string; assessmentData: string; paymentStatus: string; timestamp: string }): Promise<void>;
  getAssessmentDataByEmail(email: string): Promise<{ assessmentData: string; paymentStatus: string } | null>;
  updatePaymentStatus(email: string, paymentStatus: string, paymentId?: string): Promise<void>;
  
  // Access token management
  generateAccessToken(type: "basic" | "growth", ghlContactId?: string): Promise<AccessToken>;
  validateAccessToken(token: string): Promise<AccessToken | undefined>;
  getAccessTokenByToken(token: string): Promise<AccessToken | undefined>;
  markTokenAsUsed(token: string, ipAddress?: string, userAgent?: string): Promise<void>;
  getAllAccessTokens(): Promise<AccessToken[]>;
  revokeAccessToken(token: string): Promise<void>;
  cleanupExpiredTokens(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async createValuationAssessment(insertAssessment: InsertValuationAssessment): Promise<ValuationAssessment> {
    const [assessment] = await db
      .insert(valuationAssessments)
      .values(insertAssessment)
      .returning();
    return assessment;
  }

  async getValuationAssessment(id: number): Promise<ValuationAssessment | undefined> {
    const [assessment] = await db.select().from(valuationAssessments).where(eq(valuationAssessments.id, id));
    return assessment || undefined;
  }

  async updateValuationAssessment(id: number, updates: Partial<ValuationAssessment>): Promise<ValuationAssessment> {
    const [assessment] = await db
      .update(valuationAssessments)
      .set(updates)
      .where(eq(valuationAssessments.id, id))
      .returning();
    
    if (!assessment) {
      throw new Error(`Assessment with id ${id} not found`);
    }
    
    return assessment;
  }

  async getAllValuationAssessments(): Promise<ValuationAssessment[]> {
    return await db.select().from(valuationAssessments);
  }

  // Lead management methods
  async createLead(insertLead: InsertLead): Promise<Lead> {
    const [lead] = await db
      .insert(leads)
      .values(insertLead)
      .returning();
    return lead;
  }

  async getLeadByEmail(email: string): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.email, email));
    return lead || undefined;
  }

  async getLeadById(id: number): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead || undefined;
  }

  async updateLead(id: number, updates: Partial<Lead>): Promise<Lead> {
    const [lead] = await db
      .update(leads)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(leads.id, id))
      .returning();
    
    if (!lead) {
      throw new Error(`Lead with id ${id} not found`);
    }
    
    return lead;
  }

  async getAllLeads(): Promise<Lead[]> {
    return await db.select().from(leads).orderBy(desc(leads.createdAt));
  }

  async getLeadsByStatus(status: string): Promise<Lead[]> {
    return await db.select().from(leads).where(eq(leads.leadStatus, status)).orderBy(desc(leads.createdAt));
  }

  async searchLeads(query: string): Promise<Lead[]> {
    // Note: This is a simple search implementation. In production, you might want to use full-text search
    const lowerQuery = query.toLowerCase();
    const allLeads = await db.select().from(leads);
    
    return allLeads.filter(lead => 
      lead.firstName?.toLowerCase().includes(lowerQuery) ||
      lead.lastName?.toLowerCase().includes(lowerQuery) ||
      lead.email?.toLowerCase().includes(lowerQuery) ||
      lead.company?.toLowerCase().includes(lowerQuery)
    );
  }

  async deleteLead(id: number): Promise<void> {
    await db.delete(leads).where(eq(leads.id, id));
  }

  // Lead activity methods
  async createLeadActivity(insertActivity: InsertLeadActivity): Promise<LeadActivity> {
    const [activity] = await db
      .insert(leadActivities)
      .values(insertActivity)
      .returning();
    return activity;
  }

  async getLeadActivities(leadId: number): Promise<LeadActivity[]> {
    return await db
      .select()
      .from(leadActivities)
      .where(eq(leadActivities.leadId, leadId))
      .orderBy(desc(leadActivities.createdAt));
  }

  // Team management methods
  async createTeamMember(member: InsertTeamMember & { hashedPassword: string }): Promise<TeamMember> {
    const [teamMember] = await db
      .insert(teamMembers)
      .values(member)
      .returning();
    return teamMember;
  }

  async getTeamMemberByEmail(email: string): Promise<TeamMember | undefined> {
    const [member] = await db.select().from(teamMembers).where(eq(teamMembers.email, email));
    return member;
  }

  async getTeamMemberById(id: number): Promise<TeamMember | undefined> {
    const [member] = await db.select().from(teamMembers).where(eq(teamMembers.id, id));
    return member;
  }

  async getAllTeamMembers(): Promise<TeamMember[]> {
    return await db.select().from(teamMembers).orderBy(desc(teamMembers.createdAt));
  }

  async updateTeamMember(id: number, updates: Partial<TeamMember>): Promise<TeamMember> {
    const [member] = await db
      .update(teamMembers)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(teamMembers.id, id))
      .returning();
    return member;
  }

  async deleteTeamMember(id: number): Promise<void> {
    await db.delete(teamMembers).where(eq(teamMembers.id, id));
  }

  async createTeamSession(teamMemberId: number, sessionId: string, expiresAt: Date): Promise<TeamSession> {
    const [session] = await db
      .insert(teamSessions)
      .values({ id: sessionId, teamMemberId, expiresAt })
      .returning();
    return session;
  }

  async getTeamSession(sessionId: string): Promise<TeamSession | undefined> {
    const [session] = await db.select().from(teamSessions).where(eq(teamSessions.id, sessionId));
    return session;
  }

  async updateTeamSession(sessionId: string, expiresAt: Date): Promise<void> {
    await db.update(teamSessions)
      .set({ expiresAt })
      .where(eq(teamSessions.id, sessionId));
  }

  async deleteTeamSession(sessionId: string): Promise<void> {
    await db.delete(teamSessions).where(eq(teamSessions.id, sessionId));
  }

  // Assessment data methods for post-purchase access
  async saveAssessmentData(data: { email: string; assessmentData: string; paymentStatus: string; timestamp: string }): Promise<void> {
    // Check if assessment data already exists for this email
    const existing = await db.select()
      .from(valuationAssessments)
      .where(eq(valuationAssessments.email, data.email))
      .limit(1);

    if (existing.length > 0) {
      // Update existing record
      await db.update(valuationAssessments)
        .set({
          assessmentData: data.assessmentData,
          paymentStatus: data.paymentStatus,
          updatedAt: new Date()
        })
        .where(eq(valuationAssessments.email, data.email));
    } else {
      // Create new record with minimal required data
      await db.insert(valuationAssessments).values({
        firstName: 'Pending',
        lastName: 'User',
        email: data.email,
        phone: '',
        company: '',
        reportTier: 'paid',
        paymentStatus: data.paymentStatus,
        assessmentData: data.assessmentData,
        netIncome: '0',
        interest: '0',
        taxes: '0',
        depreciation: '0',
        amortization: '0',
        financialPerformance: 'C',
        customerConcentration: 'C',
        managementTeam: 'C',
        competitivePosition: 'C',
        growthProspects: 'C',
        systemsProcesses: 'C',
        assetQuality: 'C',
        industryOutlook: 'C'
      });
    }
  }

  async getAssessmentDataByEmail(email: string): Promise<{ assessmentData: string; paymentStatus: string } | null> {
    const result = await db.select({
      assessmentData: valuationAssessments.assessmentData,
      paymentStatus: valuationAssessments.paymentStatus
    })
    .from(valuationAssessments)
    .where(eq(valuationAssessments.email, email))
    .limit(1);

    return result.length > 0 ? result[0] : null;
  }

  async updatePaymentStatus(email: string, paymentStatus: string, paymentId?: string): Promise<void> {
    const updateData: any = {
      paymentStatus,
      updatedAt: new Date()
    };
    
    if (paymentId) {
      updateData.stripePaymentId = paymentId;
    }

    await db.update(valuationAssessments)
      .set(updateData)
      .where(eq(valuationAssessments.email, email));
  }

  // Access token management methods
  async generateAccessToken(type: "basic" | "growth", ghlContactId?: string): Promise<AccessToken> {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    
    const [accessToken] = await db
      .insert(accessTokens)
      .values({
        token,
        type,
        ghlContactId,
        expiresAt
      })
      .returning();
    
    return accessToken;
  }

  async validateAccessToken(token: string): Promise<AccessToken | undefined> {
    const [accessToken] = await db
      .select()
      .from(accessTokens)
      .where(eq(accessTokens.token, token))
      .limit(1);
    
    // Only check expiration, not usage - tokens can be used multiple times
    if (!accessToken || accessToken.expiresAt < new Date()) {
      return undefined;
    }
    
    return accessToken;
  }

  async getAccessTokenByToken(token: string): Promise<AccessToken | undefined> {
    const [accessToken] = await db
      .select()
      .from(accessTokens)
      .where(eq(accessTokens.token, token))
      .limit(1);
    
    return accessToken || undefined;
  }

  async markTokenAsUsed(token: string, ipAddress?: string, userAgent?: string): Promise<void> {
    await db
      .update(accessTokens)
      .set({
        isUsed: true,
        usedAt: new Date(),
        ipAddress,
        userAgent
      })
      .where(eq(accessTokens.token, token));
  }

  async getAllAccessTokens(): Promise<AccessToken[]> {
    return await db
      .select()
      .from(accessTokens)
      .orderBy(desc(accessTokens.createdAt));
  }

  async revokeAccessToken(token: string): Promise<void> {
    await db
      .update(accessTokens)
      .set({ isUsed: true, usedAt: new Date() })
      .where(eq(accessTokens.token, token));
  }

  async cleanupExpiredTokens(): Promise<void> {
    await db
      .delete(accessTokens)
      .where(lt(accessTokens.expiresAt, new Date()));
  }
}

export const storage = new DatabaseStorage();
