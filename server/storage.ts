import { 
  valuationAssessments, 
  leads,
  leadActivities,
  teamMembers,
  teamSessions,
  type ValuationAssessment, 
  type InsertValuationAssessment,
  type Lead,
  type InsertLead,
  type LeadActivity,
  type InsertLeadActivity,
  type TeamMember,
  type InsertTeamMember,
  type TeamSession
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

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
  deleteTeamSession(sessionId: string): Promise<void>;
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

  async deleteTeamSession(sessionId: string): Promise<void> {
    await db.delete(teamSessions).where(eq(teamSessions.id, sessionId));
  }
}

export const storage = new DatabaseStorage();
