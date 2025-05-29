import { valuationAssessments, type ValuationAssessment, type InsertValuationAssessment } from "@shared/schema";

export interface IStorage {
  createValuationAssessment(assessment: InsertValuationAssessment): Promise<ValuationAssessment>;
  getValuationAssessment(id: number): Promise<ValuationAssessment | undefined>;
  updateValuationAssessment(id: number, updates: Partial<ValuationAssessment>): Promise<ValuationAssessment>;
  getAllValuationAssessments(): Promise<ValuationAssessment[]>;
}

export class MemStorage implements IStorage {
  private assessments: Map<number, ValuationAssessment>;
  private currentId: number;

  constructor() {
    this.assessments = new Map();
    this.currentId = 1;
  }

  async createValuationAssessment(insertAssessment: InsertValuationAssessment): Promise<ValuationAssessment> {
    const id = this.currentId++;
    const assessment: ValuationAssessment = {
      ...insertAssessment,
      id,
      baseEbitda: null,
      adjustedEbitda: null,
      valuationMultiple: null,
      lowEstimate: null,
      midEstimate: null,
      highEstimate: null,
      overallScore: null,
      narrativeSummary: null,
      pdfUrl: null,
      isProcessed: false,
      createdAt: new Date(),
    };
    this.assessments.set(id, assessment);
    return assessment;
  }

  async getValuationAssessment(id: number): Promise<ValuationAssessment | undefined> {
    return this.assessments.get(id);
  }

  async updateValuationAssessment(id: number, updates: Partial<ValuationAssessment>): Promise<ValuationAssessment> {
    const existing = this.assessments.get(id);
    if (!existing) {
      throw new Error(`Assessment with id ${id} not found`);
    }
    
    const updated = { ...existing, ...updates };
    this.assessments.set(id, updated);
    return updated;
  }

  async getAllValuationAssessments(): Promise<ValuationAssessment[]> {
    return Array.from(this.assessments.values());
  }
}

export const storage = new MemStorage();
