import { valuationAssessments, type ValuationAssessment, type InsertValuationAssessment } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createValuationAssessment(assessment: InsertValuationAssessment): Promise<ValuationAssessment>;
  getValuationAssessment(id: number): Promise<ValuationAssessment | undefined>;
  updateValuationAssessment(id: number, updates: Partial<ValuationAssessment>): Promise<ValuationAssessment>;
  getAllValuationAssessments(): Promise<ValuationAssessment[]>;
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
}

export const storage = new DatabaseStorage();
