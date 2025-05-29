import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertValuationAssessmentSchema, type ValuationAssessment } from "@shared/schema";
import { generateValuationNarrative, type ValuationAnalysisInput } from "./openai";
import { generateValuationPDF } from "./pdf-generator";
import { emailService } from "./email-service";
import fs from 'fs/promises';
import path from 'path';

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Calculate valuation metrics
  function calculateValuationMetrics(formData: any) {
    // Calculate base EBITDA
    const baseEbitda = 
      parseFloat(formData.ebitda.netIncome || "0") +
      parseFloat(formData.ebitda.interest || "0") +
      parseFloat(formData.ebitda.taxes || "0") +
      parseFloat(formData.ebitda.depreciation || "0") +
      parseFloat(formData.ebitda.amortization || "0");

    // Calculate adjusted EBITDA
    const adjustedEbitda = baseEbitda +
      parseFloat(formData.ebitda.ownerSalary || "0") +
      parseFloat(formData.ebitda.personalExpenses || "0") +
      parseFloat(formData.ebitda.oneTimeExpenses || "0") +
      parseFloat(formData.ebitda.otherAdjustments || "0");

    // Convert grades to numeric scores for multiple calculation
    const gradeToScore = (grade: string): number => {
      switch (grade) {
        case 'A': return 5;
        case 'B': return 4;
        case 'C': return 3;
        case 'D': return 2;
        case 'F': return 1;
        default: return 3;
      }
    };

    // Calculate weighted average score
    const scores = Object.values(formData.valueDrivers).map((grade: any) => gradeToScore(grade));
    const averageScore = scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length;
    
    // Base multiple starts at 3.0x, adjusted by average score
    // Score of 5 (all A's) = 6.0x multiple
    // Score of 3 (all C's) = 3.0x multiple  
    // Score of 1 (all F's) = 1.5x multiple
    const baseMultiple = 3.0;
    const scoreAdjustment = (averageScore - 3) * 0.75;
    const valuationMultiple = Math.max(1.5, baseMultiple + scoreAdjustment);

    // Calculate valuation estimates (±20% range)
    const midEstimate = adjustedEbitda * valuationMultiple;
    const lowEstimate = midEstimate * 0.8;
    const highEstimate = midEstimate * 1.2;

    // Overall score letter grade
    const overallScore = averageScore >= 4.5 ? 'A' :
                        averageScore >= 3.5 ? 'B' :
                        averageScore >= 2.5 ? 'C' :
                        averageScore >= 1.5 ? 'D' : 'F';
    const plusMinus = averageScore % 1 >= 0.7 ? '+' : 
                     averageScore % 1 <= 0.3 ? '-' : '';

    return {
      baseEbitda,
      adjustedEbitda,
      valuationMultiple: parseFloat(valuationMultiple.toFixed(2)),
      lowEstimate,
      midEstimate,
      highEstimate,
      overallScore: overallScore + plusMinus
    };
  }

  // POST /api/valuation - Submit valuation assessment
  app.post("/api/valuation", async (req, res) => {
    try {
      const formData = req.body;
      
      // Validate the request structure
      if (!formData.contact || !formData.ebitda || !formData.valueDrivers || !formData.followUp) {
        return res.status(400).json({ message: "Missing required form data sections" });
      }

      // Prepare the data for database insertion
      const assessmentData = {
        // Contact info
        firstName: formData.contact.firstName,
        lastName: formData.contact.lastName,
        email: formData.contact.email,
        phone: formData.contact.phone,
        company: formData.contact.company,
        jobTitle: formData.contact.jobTitle || "",
        
        // EBITDA components
        netIncome: formData.ebitda.netIncome,
        interest: formData.ebitda.interest,
        taxes: formData.ebitda.taxes,
        depreciation: formData.ebitda.depreciation,
        amortization: formData.ebitda.amortization,
        
        // Adjustments (now part of EBITDA form)
        ownerSalary: formData.ebitda.ownerSalary || "0",
        personalExpenses: formData.ebitda.personalExpenses || "0",
        oneTimeExpenses: formData.ebitda.oneTimeExpenses || "0",
        otherAdjustments: formData.ebitda.otherAdjustments || "0",
        adjustmentNotes: formData.ebitda.adjustmentNotes || "",
        
        // Value drivers
        financialPerformance: formData.valueDrivers.financialPerformance,
        customerConcentration: formData.valueDrivers.customerConcentration,
        managementTeam: formData.valueDrivers.managementTeam,
        competitivePosition: formData.valueDrivers.competitivePosition,
        growthProspects: formData.valueDrivers.growthProspects,
        systemsProcesses: formData.valueDrivers.systemsProcesses,
        assetQuality: formData.valueDrivers.assetQuality,
        industryOutlook: formData.valueDrivers.industryOutlook,
        riskFactors: formData.valueDrivers.riskFactors,
        ownerDependency: formData.valueDrivers.ownerDependency,
        
        // Follow-up
        followUpIntent: formData.followUp.followUpIntent,
        additionalComments: formData.followUp.additionalComments || "",
      };

      // Validate with Zod schema
      const validatedData = insertValuationAssessmentSchema.parse(assessmentData);
      
      // Create initial assessment record
      let assessment = await storage.createValuationAssessment(validatedData);
      
      // Calculate valuation metrics
      const metrics = calculateValuationMetrics(formData);
      
      try {
        // Generate AI narrative
        const analysisInput: ValuationAnalysisInput = {
          companyName: assessment.company,
          adjustedEbitda: metrics.adjustedEbitda,
          valuationMultiple: metrics.valuationMultiple,
          overallScore: metrics.overallScore,
          valueDriverScores: {
            financialPerformance: assessment.financialPerformance,
            customerConcentration: assessment.customerConcentration,
            managementTeam: assessment.managementTeam,
            competitivePosition: assessment.competitivePosition,
            growthProspects: assessment.growthProspects,
            systemsProcesses: assessment.systemsProcesses,
            assetQuality: assessment.assetQuality,
            industryOutlook: assessment.industryOutlook,
            riskFactors: assessment.riskFactors,
            ownerDependency: assessment.ownerDependency,
          },
          adjustmentNotes: assessment.adjustmentNotes || undefined,
          additionalComments: assessment.additionalComments || undefined,
        };

        const narrativeAnalysis = await generateValuationNarrative(analysisInput);
        
        // Update assessment with calculated values and narrative
        assessment = await storage.updateValuationAssessment(assessment.id, {
          ...metrics,
          baseEbitda: metrics.baseEbitda.toString(),
          adjustedEbitda: metrics.adjustedEbitda.toString(),
          valuationMultiple: metrics.valuationMultiple.toString(),
          lowEstimate: metrics.lowEstimate.toString(),
          midEstimate: metrics.midEstimate.toString(),
          highEstimate: metrics.highEstimate.toString(),
          overallScore: metrics.overallScore,
          narrativeSummary: narrativeAnalysis.narrativeSummary,
        });

        // Generate PDF report
        const pdfBuffer = await generateValuationPDF(assessment);
        
        // Save PDF file (in a real app, you'd use cloud storage)
        const pdfDir = path.join(process.cwd(), 'pdfs');
        await fs.mkdir(pdfDir, { recursive: true });
        const pdfFileName = `valuation_${assessment.id}_${Date.now()}.pdf`;
        const pdfPath = path.join(pdfDir, pdfFileName);
        await fs.writeFile(pdfPath, pdfBuffer);
        
        // Update with PDF URL
        const pdfUrl = `/api/pdf/${pdfFileName}`;
        assessment = await storage.updateValuationAssessment(assessment.id, {
          pdfUrl,
          isProcessed: true,
        });

        // Send email with PDF attachment
        try {
          await emailService.sendValuationReport(assessment, pdfBuffer);
          console.log(`Valuation report emailed to ${assessment.email}`);
        } catch (emailError) {
          console.error('Failed to send email, but continuing:', emailError);
          // Don't fail the entire request if email fails
        }

        res.json(assessment);
      } catch (processingError) {
        console.error('Error during processing:', processingError);
        
        // Update with basic metrics even if AI/PDF generation fails
        assessment = await storage.updateValuationAssessment(assessment.id, {
          ...metrics,
          baseEbitda: metrics.baseEbitda.toString(),
          adjustedEbitda: metrics.adjustedEbitda.toString(),
          valuationMultiple: metrics.valuationMultiple.toString(),
          lowEstimate: metrics.lowEstimate.toString(),
          midEstimate: metrics.midEstimate.toString(),
          highEstimate: metrics.highEstimate.toString(),
          overallScore: metrics.overallScore,
          narrativeSummary: `Valuation completed for ${assessment.company}. The analysis shows an estimated business value range based on adjusted EBITDA of $${metrics.adjustedEbitda.toLocaleString()} and a valuation multiple of ${metrics.valuationMultiple}x.`,
          isProcessed: true,
        });

        res.json(assessment);
      }
    } catch (error) {
      console.error("Error processing valuation:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Internal server error" 
      });
    }
  });

  // GET /api/pdf/:filename - Serve PDF files
  app.get("/api/pdf/:filename", async (req, res) => {
    try {
      const { filename } = req.params;
      const pdfPath = path.join(process.cwd(), 'pdfs', filename);
      
      const fileExists = await fs.access(pdfPath).then(() => true).catch(() => false);
      if (!fileExists) {
        return res.status(404).json({ message: "PDF not found" });
      }

      const pdfBuffer = await fs.readFile(pdfPath);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error serving PDF:", error);
      res.status(500).json({ message: "Error retrieving PDF" });
    }
  });

  // GET /api/assessments - Get all assessments (for admin/debugging)
  app.get("/api/assessments", async (req, res) => {
    try {
      const assessments = await storage.getAllValuationAssessments();
      res.json(assessments);
    } catch (error) {
      console.error("Error fetching assessments:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // GET /api/assessment/:id - Get specific assessment
  app.get("/api/assessment/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const assessment = await storage.getValuationAssessment(id);
      
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }
      
      res.json(assessment);
    } catch (error) {
      console.error("Error fetching assessment:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
