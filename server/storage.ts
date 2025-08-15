import { 
  valuationAssessments, 
  leads,
  leadActivities,
  leadStateOverrides,
  teamMembers,
  teamSessions,
  users,
  firms,
  contacts,
  opportunities,
  assessments,
  deals,
  milestones,
  type ValuationAssessment, 
  type InsertValuationAssessment,
  type Lead,
  type InsertLead,
  type LeadActivity,
  type InsertLeadActivity,
  type LeadStateOverride,
  type InsertLeadStateOverride,
  type TeamMember,
  type InsertTeamMember,
  type TeamSession,
  type User,
  type InsertUser,
  type UpsertUser,
  type Firm,
  type InsertFirm,
  type Contact,
  type InsertContact,
  type Opportunity,
  type InsertOpportunity,
  type Assessment,
  type InsertAssessment,
  type Deal,
  type InsertDeal,
  type Milestone,
  type InsertMilestone
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, inArray, ilike, or } from "drizzle-orm";
import { goHighLevelService } from "./gohighlevel-service";

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
  
  // Lead state override methods
  createLeadStateOverride(override: InsertLeadStateOverride): Promise<LeadStateOverride>;
  getLeadStateOverrides(leadId: number): Promise<LeadStateOverride[]>;

  // User management methods (for both Replit Auth and custom auth)
  getUser(id: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  createUser(userData: Partial<User>): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  updateUserTier(id: string, tier: string): Promise<User>;
  deleteUser(id: string): Promise<void>;
  deleteAllUsers(): Promise<void>;
  deleteMultipleUsers(userIds: string[]): Promise<void>;
  createCustomUser(userData: { firstName: string; lastName: string; email: string; passwordHash: string }): Promise<User>;
  validateUserCredentials(email: string, password: string): Promise<User | null>;

  // Team management methods
  createTeamMember(member: InsertTeamMember & { hashedPassword: string }): Promise<TeamMember>;
  getTeamMemberByEmail(email: string): Promise<TeamMember | undefined>;
  getTeamMemberById(id: number): Promise<TeamMember | undefined>;
  getAllTeamMembers(): Promise<TeamMember[]>;
  getAllUsers(): Promise<User[]>;
  updateTeamMember(id: number, updates: Partial<TeamMember>): Promise<TeamMember>;
  deleteTeamMember(id: number): Promise<void>;
  createTeamSession(teamMemberId: number, sessionId: string, expiresAt: Date): Promise<TeamSession>;
  getTeamSession(sessionId: string): Promise<TeamSession | undefined>;
  updateTeamSession(sessionId: string, expiresAt: Date): Promise<void>;
  deleteTeamSession(sessionId: string): Promise<void>;

  // CRM Firm methods
  createFirm(firm: InsertFirm): Promise<Firm>;
  getFirm(id: number): Promise<Firm | undefined>;
  updateFirm(id: number, updates: Partial<Firm>): Promise<Firm>;
  deleteFirm(id: number): Promise<void>;
  getAllFirms(): Promise<Firm[]>;
  searchFirms(query: string): Promise<Firm[]>;

  // CRM Contact methods
  createContact(contact: InsertContact): Promise<Contact>;
  getContact(id: number): Promise<Contact | undefined>;
  updateContact(id: number, updates: Partial<Contact>): Promise<Contact>;
  deleteContact(id: number): Promise<void>;
  getAllContacts(): Promise<Contact[]>;
  getContactsByFirm(firmId: number): Promise<Contact[]>;

  // CRM Opportunity methods
  createOpportunity(opportunity: InsertOpportunity): Promise<Opportunity>;
  getOpportunity(id: number): Promise<Opportunity | undefined>;
  updateOpportunity(id: number, updates: Partial<Opportunity>): Promise<Opportunity>;
  deleteOpportunity(id: number): Promise<void>;
  getAllOpportunities(): Promise<Opportunity[]>;
  getOpportunitiesByStage(stage: string): Promise<Opportunity[]>;

  // CRM Deal methods
  createDeal(deal: InsertDeal): Promise<Deal>;
  getDeal(id: number): Promise<Deal | undefined>;
  updateDeal(id: number, updates: Partial<Deal>): Promise<Deal>;
  deleteDeal(id: number): Promise<void>;
  getAllDeals(): Promise<Deal[]>;
  getDealsByStage(stage: string): Promise<Deal[]>;

  // CRM Target List methods
  createTargetList(targetList: InsertTargetList): Promise<TargetList>;
  getTargetList(id: number): Promise<TargetList | undefined>;
  updateTargetList(id: number, updates: Partial<TargetList>): Promise<TargetList>;
  deleteTargetList(id: number): Promise<void>;
  getAllTargetLists(): Promise<TargetList[]>;
  addFirmsToTargetList(listId: number, firmIds: number[]): Promise<void>;
  removeFirmFromTargetList(listId: number, firmId: number): Promise<void>;
  getTargetListItems(listId: number): Promise<TargetListItem[]>;

  // CRM Milestone methods
  createMilestone(milestone: InsertMilestone): Promise<Milestone>;
  getMilestone(id: number): Promise<Milestone | undefined>;
  updateMilestone(id: number, updates: Partial<Milestone>): Promise<Milestone>;
  deleteMilestone(id: number): Promise<void>;
  getMilestonesByDeal(dealId: number): Promise<Milestone[]>;
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
    // Return mock data for now since database schema needs updating
    return [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com', 
        company: 'Example Corp',
        intakeSource: 'manual',
        applebitestaken: false,
        qualifierScore: 75,
        lowQualifierFlag: false,
        leadStatus: 'new',
        leadScore: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@applebites.com',
        company: 'AppleBites Corp', 
        intakeSource: 'applebites',
        applebitestaken: true,
        qualifierScore: 45,
        lowQualifierFlag: true,
        leadStatus: 'qualified',
        leadScore: 85,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ] as Lead[];
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

  // Lead state override methods
  async createLeadStateOverride(override: InsertLeadStateOverride): Promise<LeadStateOverride> {
    const [result] = await db.insert(leadStateOverrides).values({
      ...override,
      id: crypto.randomUUID(),
    }).returning();
    return result;
  }

  async getLeadStateOverrides(leadId: number): Promise<LeadStateOverride[]> {
    return await db.select().from(leadStateOverrides).where(eq(leadStateOverrides.leadId, leadId)).orderBy(desc(leadStateOverrides.createdAt));
  }

  // User management methods (for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.getUser(id);
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const userId = userData.id || `user_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    const [user] = await db
      .insert(users)
      .values({
        id: userId,
        email: userData.email!,
        firstName: userData.firstName || null,
        lastName: userData.lastName || null,
        fullName: userData.fullName || null,
        profileImageUrl: userData.profileImageUrl || null,
        passwordHash: userData.passwordHash || null,
        authProvider: userData.authProvider || 'custom',
        replitUserId: userData.replitUserId || null,
        tier: userData.tier || 'free',
        ghlContactId: userData.ghlContactId || null,
        resultReady: userData.resultReady || false,
        isActive: userData.isActive !== false,
        emailVerified: userData.emailVerified || false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    
    // Trigger account creation webhook asynchronously
    (async () => {
      try {
        await goHighLevelService.processAccountCreation({
          id: user.id,
          email: user.email,
          firstName: user.firstName ?? undefined,
          lastName: user.lastName ?? undefined,
          tier: user.tier || 'free',
          authProvider: user.authProvider || 'custom',
          company: (userData as any).company,
          source: userData.authProvider === 'winthestorm-demo' ? 'Win The Storm Demo' : undefined
        });
      } catch (error) {
        console.error('Account creation webhook failed for user:', user.id, error);
      }
    })();
    
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    
    return user;
  }

  async updateUserTier(id: string, tier: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ tier, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  async deleteAllUsers(): Promise<void> {
    await db.delete(users);
  }

  async deleteMultipleUsers(userIds: string[]): Promise<void> {
    if (userIds.length === 0) return;
    await db.delete(users).where(inArray(users.id, userIds));
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

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
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

  // Custom user authentication methods
  async createCustomUser(userData: { firstName: string; lastName: string; email: string; passwordHash: string }): Promise<User> {
    const userId = `custom_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    const [user] = await db
      .insert(users)
      .values({
        id: userId,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        passwordHash: userData.passwordHash,
        authProvider: 'custom',
        emailVerified: false,
        tier: 'free',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    
    // Trigger account creation webhook asynchronously
    (async () => {
      try {
        await goHighLevelService.processAccountCreation({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          tier: user.tier || 'free',
          authProvider: 'email',
          source: 'Email Registration'
        });
      } catch (error) {
        console.error('Account creation webhook failed for custom user:', user.id, error);
      }
    })();
    
    return user;
  }

  async validateUserCredentials(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    
    if (!user || !user.passwordHash) {
      return null;
    }

    // Allow login for users with password-based auth providers
    if (!['email', 'custom'].includes(user.authProvider || '')) {
      return null;
    }

    const bcrypt = await import('bcryptjs');
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    
    if (!isValidPassword || !user.isActive) {
      return null;
    }

    return user;
  }

  // ===== CRM METHODS =====

  // Firm methods
  async createFirm(insertFirm: InsertFirm): Promise<Firm> {
    const [firm] = await db
      .insert(firms)
      .values(insertFirm)
      .returning();
    return firm;
  }

  async getFirm(id: number): Promise<Firm | undefined> {
    const [firm] = await db.select().from(firms).where(eq(firms.id, id));
    return firm;
  }

  async updateFirm(id: number, updates: Partial<Firm>): Promise<Firm> {
    const [firm] = await db
      .update(firms)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(firms.id, id))
      .returning();
    return firm;
  }

  async deleteFirm(id: number): Promise<void> {
    await db.delete(firms).where(eq(firms.id, id));
  }

  async getAllFirms(): Promise<Firm[]> {
    return await db.select().from(firms).orderBy(desc(firms.createdAt));
  }

  async searchFirms(query: string): Promise<Firm[]> {
    const searchTerm = `%${query}%`;
    return await db.select().from(firms)
      .where(
        or(
          ilike(firms.name, searchTerm),
          ilike(firms.type, searchTerm),
          ilike(firms.region, searchTerm)
        )
      )
      .orderBy(desc(firms.createdAt));
  }

  // Contact methods
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db
      .insert(contacts)
      .values(insertContact)
      .returning();
    return contact;
  }

  async getContact(id: number): Promise<Contact | undefined> {
    const [contact] = await db.select().from(contacts).where(eq(contacts.id, id));
    return contact;
  }

  async updateContact(id: number, updates: Partial<Contact>): Promise<Contact> {
    const [contact] = await db
      .update(contacts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(contacts.id, id))
      .returning();
    return contact;
  }

  async deleteContact(id: number): Promise<void> {
    await db.delete(contacts).where(eq(contacts.id, id));
  }

  async getAllContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  async getContactsByFirm(firmId: number): Promise<Contact[]> {
    return await db.select().from(contacts)
      .where(eq(contacts.firmId, firmId))
      .orderBy(desc(contacts.createdAt));
  }

  // Opportunity methods
  async createOpportunity(insertOpportunity: InsertOpportunity): Promise<Opportunity> {
    const [opportunity] = await db
      .insert(opportunities)
      .values(insertOpportunity)
      .returning();
    return opportunity;
  }

  async getOpportunity(id: number): Promise<Opportunity | undefined> {
    const [opportunity] = await db.select().from(opportunities).where(eq(opportunities.id, id));
    return opportunity;
  }

  async updateOpportunity(id: number, updates: Partial<Opportunity>): Promise<Opportunity> {
    const [opportunity] = await db
      .update(opportunities)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(opportunities.id, id))
      .returning();
    return opportunity;
  }

  async deleteOpportunity(id: number): Promise<void> {
    await db.delete(opportunities).where(eq(opportunities.id, id));
  }

  async getAllOpportunities(): Promise<Opportunity[]> {
    return await db.select().from(opportunities).orderBy(desc(opportunities.createdAt));
  }

  async getOpportunitiesByStage(stage: string): Promise<Opportunity[]> {
    return await db.select().from(opportunities)
      .where(eq(opportunities.stage, stage))
      .orderBy(desc(opportunities.createdAt));
  }

  // Deal methods
  async createDeal(insertDeal: InsertDeal): Promise<Deal> {
    const [deal] = await db
      .insert(deals)
      .values(insertDeal)
      .returning();
    return deal;
  }

  async getDeal(id: number): Promise<Deal | undefined> {
    const [deal] = await db.select().from(deals).where(eq(deals.id, id));
    return deal;
  }

  async updateDeal(id: number, updates: Partial<Deal>): Promise<Deal> {
    const [deal] = await db
      .update(deals)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(deals.id, id))
      .returning();
    return deal;
  }

  async deleteDeal(id: number): Promise<void> {
    await db.delete(deals).where(eq(deals.id, id));
  }

  async getAllDeals(): Promise<Deal[]> {
    return await db.select().from(deals).orderBy(desc(deals.createdAt));
  }

  async getDealsByStage(stage: string): Promise<Deal[]> {
    return await db.select().from(deals)
      .where(eq(deals.stage, stage))
      .orderBy(desc(deals.createdAt));
  }

  // Target List methods
  async createTargetList(insertTargetList: InsertTargetList): Promise<TargetList> {
    const [targetList] = await db
      .insert(targetLists)
      .values(insertTargetList)
      .returning();
    return targetList;
  }

  async getTargetList(id: number): Promise<TargetList | undefined> {
    const [targetList] = await db.select().from(targetLists).where(eq(targetLists.id, id));
    return targetList;
  }

  async updateTargetList(id: number, updates: Partial<TargetList>): Promise<TargetList> {
    const [targetList] = await db
      .update(targetLists)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(targetLists.id, id))
      .returning();
    return targetList;
  }

  async deleteTargetList(id: number): Promise<void> {
    // Delete associated items first
    await db.delete(targetListItems).where(eq(targetListItems.targetListId, id));
    await db.delete(targetLists).where(eq(targetLists.id, id));
  }

  async getAllTargetLists(): Promise<TargetList[]> {
    return await db.select().from(targetLists).orderBy(desc(targetLists.createdAt));
  }

  async addFirmsToTargetList(listId: number, firmIds: number[]): Promise<void> {
    if (firmIds.length === 0) return;
    
    const items = firmIds.map(firmId => ({
      targetListId: listId,
      firmId,
      status: 'Identified' as const,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await db.insert(targetListItems).values(items);
  }

  async removeFirmFromTargetList(listId: number, firmId: number): Promise<void> {
    await db.delete(targetListItems)
      .where(
        and(
          eq(targetListItems.targetListId, listId),
          eq(targetListItems.firmId, firmId)
        )
      );
  }

  async getTargetListItems(listId: number): Promise<TargetListItem[]> {
    return await db.select().from(targetListItems)
      .where(eq(targetListItems.targetListId, listId))
      .orderBy(desc(targetListItems.createdAt));
  }

  // Milestone methods
  async createMilestone(insertMilestone: InsertMilestone): Promise<Milestone> {
    const [milestone] = await db
      .insert(milestones)
      .values(insertMilestone)
      .returning();
    return milestone;
  }

  async getMilestone(id: number): Promise<Milestone | undefined> {
    const [milestone] = await db.select().from(milestones).where(eq(milestones.id, id));
    return milestone;
  }

  async updateMilestone(id: number, updates: Partial<Milestone>): Promise<Milestone> {
    const [milestone] = await db
      .update(milestones)
      .set(updates)
      .where(eq(milestones.id, id))
      .returning();
    return milestone;
  }

  async deleteMilestone(id: number): Promise<void> {
    await db.delete(milestones).where(eq(milestones.id, id));
  }

  async getMilestonesByDeal(dealId: number): Promise<Milestone[]> {
    return await db.select().from(milestones)
      .where(eq(milestones.dealId, dealId))
      .orderBy(milestones.date);
  }
}

export const storage = new DatabaseStorage();
