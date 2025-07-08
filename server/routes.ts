import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertValuationAssessmentSchema, type ValuationAssessment, loginSchema, insertTeamMemberSchema, type LoginCredentials, type InsertTeamMember, type TeamMember } from "@shared/schema";
import { generateValuationNarrative, type ValuationAnalysisInput } from "./openai";
import { generateFinancialCoachingTips, generateContextualInsights, type FinancialCoachingData } from "./services/aiCoaching";
import { generateValuationPDF } from "./pdf-generator";
import { generateEnhancedValuationPDF } from "./pdf-generator-enhanced";
import { getMultiplierByNAICS, calculateWeightedMultiplier } from "./config/naicsMultipliers";
import { resendEmailService } from "./resend-service";
import { emailService } from "./email-service";
import { goHighLevelService } from "./gohighlevel-service";
import { getMultiplierForGrade, getLabelForGrade, scoreToGrade } from "./config/multiplierScale";
import { naicsDatabase, getNAICSBySector, getNAICSByParentCode, getNAICSByLevel } from "./config/naics-database";
import { completeNAICSDatabase, getAllSectors, getChildrenByParentCode as getCompleteChildrenByParentCode, getNAICSByCode as getCompleteNAICSByCode, getSectorByCode, getChildrenWithEnhancedTitles } from "./config/complete-naics-database";
import { curatedNAICSDatabase, getCuratedNAICsBySector, getCuratedSectors, getCuratedNAICSByCode, calculateMultiplierFromGrade } from "./config/curated-naics-database";
import { comprehensiveNAICSMultipliers, getComprehensiveNAICSByCode, getComprehensiveNAICsBySector, getComprehensiveSectors, calculateComprehensiveMultiplierFromGrade } from "./config/comprehensive-naics-multipliers";
import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import { registerAssessmentAccessRoutes } from './routes/assessment-access';

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: TeamMember;
    }
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Admin authentication middleware - also allows team members
  const isAdminAuthenticated = async (req: any, res: any, next: any) => {
    // Check if admin is authenticated via admin login
    if ((req.session as any)?.adminAuthenticated) {
      return next();
    }

    // Check if team member is authenticated (team members have admin access)
    const sessionId = (req.session as any)?.teamSessionId;
    if (sessionId) {
      try {
        const session = await storage.getTeamSession(sessionId);
        if (session && session.expiresAt > new Date()) {
          const teamMember = await storage.getTeamMemberById(session.teamMemberId!);
          if (teamMember && teamMember.isActive) {
            req.user = teamMember;
            return next();
          }
        }
      } catch (error) {
        // Continue to admin auth check
      }
    }

    return res.status(401).json({ error: 'Admin authentication required' });
  };

  // Team authentication middleware
  const isTeamAuthenticated = async (req: any, res: any, next: any) => {
    const sessionId = (req.session as any)?.teamSessionId;
    if (!sessionId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    try {
      const session = await storage.getTeamSession(sessionId);
      if (!session || session.expiresAt < new Date()) {
        // Clean up expired session
        if (session) {
          await storage.deleteTeamSession(sessionId);
        }
        (req.session as any).teamSessionId = null;
        return res.status(401).json({ error: 'Session expired' });
      }

      const teamMember = await storage.getTeamMemberById(session.teamMemberId!);
      if (!teamMember || !teamMember.isActive) {
        return res.status(401).json({ error: 'Account inactive' });
      }

      // Extend session on each request
      const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      await storage.updateTeamSession(sessionId, newExpiresAt);

      req.user = teamMember;
      return next();
    } catch (error) {
      console.error('Authentication middleware error:', error);
      return res.status(401).json({ error: 'Authentication failed' });
    }
  };

  // Role-based access control middleware
  const requireRole = (roles: string[]) => {
    return (req: any, res: any, next: any) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      return next();
    };
  };
  
  // Calculate lead score based on assessment data and metrics
  function calculateLeadScore(assessment: any, metrics: any): number {
    let score = 0;
    
    // Base score from follow-up intent (0-40 points)
    switch (assessment.followUpIntent) {
      case 'yes': score += 40; break;
      case 'maybe': score += 20; break;
      case 'no': score += 5; break;
    }
    
    // Business size score based on adjusted EBITDA (0-30 points)
    const ebitda = metrics.adjustedEbitda;
    if (ebitda >= 10000000) score += 30; // $10M+
    else if (ebitda >= 5000000) score += 25; // $5M+
    else if (ebitda >= 1000000) score += 20; // $1M+
    else if (ebitda >= 500000) score += 15; // $500K+
    else if (ebitda >= 100000) score += 10; // $100K+
    else score += 5;
    
    // Overall grade score (0-20 points)
    const gradeScore = assessment.valueDrivers ? 
      Object.values(assessment.valueDrivers).reduce((sum: number, grade: any) => {
        const gradeValue = grade === 'A' ? 5 : grade === 'B' ? 4 : grade === 'C' ? 3 : grade === 'D' ? 2 : 1;
        return sum + gradeValue;
      }, 0) / Object.keys(assessment.valueDrivers).length : 3;
    
    score += Math.round((gradeScore / 5) * 20);
    
    // Contact completeness (0-10 points)
    if (assessment.phone) score += 5;
    if (assessment.jobTitle) score += 5;
    
    return Math.min(100, Math.max(0, score));
  }
  
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
      parseFloat(formData.adjustments.ownerSalary || "0") +
      parseFloat(formData.adjustments.personalExpenses || "0") +
      parseFloat(formData.adjustments.oneTimeExpenses || "0") +
      parseFloat(formData.adjustments.otherAdjustments || "0");

    // Convert grades to numeric scores for average calculation
    const gradeToScoreValue = (grade: string): number => {
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
    const scores = Object.values(formData.valueDrivers).map((grade: any) => gradeToScoreValue(grade));
    const averageScore = scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length;
    
    // Determine overall letter grade using centralized function
    const overallGrade = scoreToGrade(averageScore);

    // Use centralized multiplier scale
    const valuationMultiple = getMultiplierForGrade(overallGrade);

    // Calculate valuation estimates (±20% range)
    const midEstimate = adjustedEbitda * valuationMultiple;
    const lowEstimate = midEstimate * 0.8;
    const highEstimate = midEstimate * 1.2;

    // Add grade modifier for display (+ or -)
    const gradeModifier = averageScore > (gradeToScoreValue(overallGrade) + 0.3) ? '+' :
                         averageScore < (gradeToScoreValue(overallGrade) - 0.3) ? '-' : '';

    return {
      baseEbitda,
      adjustedEbitda,
      valuationMultiple: parseFloat(valuationMultiple.toFixed(1)),
      lowEstimate: Math.round(lowEstimate),
      midEstimate: Math.round(midEstimate),
      highEstimate: Math.round(highEstimate),
      overallScore: overallGrade + gradeModifier
    };
  }

  // POST /api/valuation - Submit valuation assessment
  app.post("/api/valuation", async (req, res) => {
    try {
      const formData = req.body;
      
      // Check for access token in headers
      const accessToken = req.headers['x-access-token'] as string;
      let tokenInfo = null;
      
      if (accessToken) {
        try {
          tokenInfo = await storage.getAccessTokenByToken(accessToken);
          
          // Mark token as used when assessment is submitted
          if (tokenInfo) {
            await storage.markTokenAsUsed(accessToken, req.ip, req.get('User-Agent'));
          }
        } catch (error) {
          console.error('Error processing access token:', error);
        }
      }
      
      // Validate the request structure
      if (!formData.contact || !formData.ebitda || !formData.valueDrivers || !formData.followUp) {
        return res.status(400).json({ message: "Missing required form data sections" });
      }

      // Helper function to validate and cap numeric values
      const validateNumeric = (value: string | number, max: number = 999999999): string => {
        const num = parseFloat(value.toString());
        if (isNaN(num)) return "0";
        return Math.min(Math.abs(num), max).toFixed(2);
      };

      // Prepare the data for database insertion
      const assessmentData = {
        // Contact info
        firstName: formData.contact.firstName,
        lastName: formData.contact.lastName,
        email: formData.contact.email,
        phone: formData.contact.phone,
        company: formData.contact.company,
        jobTitle: formData.contact.jobTitle || "",
        
        // EBITDA components - validate to prevent overflow
        netIncome: validateNumeric(formData.ebitda.netIncome),
        interest: validateNumeric(formData.ebitda.interest),
        taxes: validateNumeric(formData.ebitda.taxes),
        depreciation: validateNumeric(formData.ebitda.depreciation),
        amortization: validateNumeric(formData.ebitda.amortization),
        
        // Adjustments (now part of EBITDA form) - validate to prevent overflow
        ownerSalary: validateNumeric(formData.ebitda.ownerSalary || "0"),
        personalExpenses: validateNumeric(formData.ebitda.personalExpenses || "0"),
        oneTimeExpenses: validateNumeric(formData.ebitda.oneTimeExpenses || "0"),
        otherAdjustments: validateNumeric(formData.ebitda.otherAdjustments || "0"),
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
      
      let narrativeAnalysis = {
        narrativeSummary: `Based on the comprehensive analysis of ${assessment.company}, the business demonstrates ${metrics.overallScore} operational performance across key value drivers. With an adjusted EBITDA of $${metrics.adjustedEbitda.toLocaleString()} and an applied multiple of ${metrics.valuationMultiple}x, the estimated valuation range is $${metrics.lowEstimate.toLocaleString()} to $${metrics.highEstimate.toLocaleString()}.`,
        keyStrengths: ['Established business operations', 'Positive EBITDA performance', 'Market presence'],
        areasForImprovement: ['Operational efficiency optimization', 'Growth strategy enhancement', 'Risk mitigation'],
        recommendations: ['Focus on improving value driver scores', 'Consider strategic growth initiatives', 'Enhance operational systems']
      };

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

        const aiNarrative = await Promise.race([
          generateValuationNarrative(analysisInput),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('AI generation timeout')), 10000)
          )
        ]) as { narrativeSummary: string; keyStrengths: string[]; areasForImprovement: string[]; recommendations: string[]; };
        narrativeAnalysis = aiNarrative;
      } catch (aiError) {
        console.error('AI narrative generation failed, using fallback:', aiError);
        // Use fallback narrative - already set above
      }
        
      try {
        // Generate concise executive summary
        const gradeToScore = (grade: string): number => {
          switch (grade) {
            case 'A': return 10; case 'B': return 8; case 'C': return 6; 
            case 'D': return 4; case 'F': return 2; default: return 6;
          }
        };
        
        const driverScores = {
          financialPerformance: gradeToScore(assessment.financialPerformance),
          customerConcentration: gradeToScore(assessment.customerConcentration),
          managementTeam: gradeToScore(assessment.managementTeam),
          competitivePosition: gradeToScore(assessment.competitivePosition),
          growthProspects: gradeToScore(assessment.growthProspects),
          systemsProcesses: gradeToScore(assessment.systemsProcesses),
          assetQuality: gradeToScore(assessment.assetQuality),
          industryOutlook: gradeToScore(assessment.industryOutlook),
          riskFactors: gradeToScore(assessment.riskFactors),
          ownerDependency: gradeToScore(assessment.ownerDependency)
        };
        
        // Generate executive summary with timeout
        let executiveSummary = '';
        const gradeLabel = getLabelForGrade(metrics.overallScore);
        const fallbackSummary = `Executive Summary: ${assessment.company} shows an adjusted EBITDA of $${metrics.adjustedEbitda.toLocaleString()} with an estimated valuation of $${metrics.midEstimate.toLocaleString()}. Based on your Operational Grade of ${metrics.overallScore} ("${gradeLabel}"), a multiplier of ${metrics.valuationMultiple}x was applied to your Adjusted EBITDA to generate the valuation estimate. The analysis indicates ${metrics.overallScore} overall performance across key business drivers.`;
        
        // Use fallback summary for now to prevent timeouts
        executiveSummary = fallbackSummary;
        
        // Update assessment with calculated values, narrative, and summary - validate to prevent overflow
        assessment = await storage.updateValuationAssessment(assessment.id, {
          ...metrics,
          baseEbitda: validateNumeric(metrics.baseEbitda),
          adjustedEbitda: validateNumeric(metrics.adjustedEbitda),
          valuationMultiple: validateNumeric(metrics.valuationMultiple, 99.99),
          lowEstimate: validateNumeric(metrics.lowEstimate),
          midEstimate: validateNumeric(metrics.midEstimate),
          highEstimate: validateNumeric(metrics.highEstimate),
          overallScore: metrics.overallScore,
          narrativeSummary: narrativeAnalysis.narrativeSummary,
          executiveSummary: executiveSummary,
        });

        // Create or update lead record for CRM integration
        try {
          let lead = await storage.getLeadByEmail(assessment.email);
          
          if (lead) {
            // Update existing lead with latest assessment data
            lead = await storage.updateLead(lead.id, {
              firstName: assessment.firstName,
              lastName: assessment.lastName,
              phone: assessment.phone,
              company: assessment.company,
              jobTitle: assessment.jobTitle || undefined,
              valuationAssessmentId: assessment.id,
              estimatedValue: validateNumeric(metrics.midEstimate),
              overallGrade: metrics.overallScore,
              followUpIntent: assessment.followUpIntent,
              totalInteractions: (lead.totalInteractions || 0) + 1,
              leadScore: calculateLeadScore(assessment, metrics),
              lastContactDate: new Date(),
            });
          } else {
            // Create new lead record
            lead = await storage.createLead({
              firstName: assessment.firstName,
              lastName: assessment.lastName,
              email: assessment.email,
              phone: assessment.phone,
              company: assessment.company,
              jobTitle: assessment.jobTitle || undefined,
              leadSource: "valuation_form",
              leadStatus: "new",
              leadScore: calculateLeadScore(assessment, metrics),
              valuationAssessmentId: assessment.id,
              estimatedValue: validateNumeric(metrics.midEstimate),
              overallGrade: metrics.overallScore,
              followUpIntent: assessment.followUpIntent,
              totalInteractions: 1,
              lastContactDate: new Date(),
              tags: [],
            });
          }

          // Log assessment completion activity
          await storage.createLeadActivity({
            leadId: lead.id,
            activityType: "assessment_completed",
            description: `Completed business valuation assessment with ${metrics.overallScore} grade and $${metrics.midEstimate.toLocaleString()} valuation`,
            activityData: JSON.stringify({
              assessmentId: assessment.id,
              valuation: metrics.midEstimate,
              grade: metrics.overallScore,
              followUpIntent: assessment.followUpIntent,
            }),
          });

        } catch (leadError) {
          console.error('Error managing lead data:', leadError);
          // Continue with the rest of the flow even if lead creation fails
        }

        // Generate PDF report with timeout
        console.log('Starting PDF generation...');
        const pdfBuffer = await Promise.race([
          generateValuationPDF(assessment),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('PDF generation timeout')), 15000)
          )
        ]) as Buffer;
        console.log('PDF generated successfully');
        
        // Save PDF file (in a real app, you'd use cloud storage)
        const pdfDir = path.join(process.cwd(), 'pdfs');
        await fs.mkdir(pdfDir, { recursive: true });
        const pdfFileName = `valuation_${assessment.id}_${Date.now()}.pdf`;
        const pdfPath = path.join(pdfDir, pdfFileName);
        await fs.writeFile(pdfPath, pdfBuffer);
        console.log('PDF saved to:', pdfPath);
        
        // Update with PDF URL
        const pdfUrl = `/api/pdf/${pdfFileName}`;
        assessment = await storage.updateValuationAssessment(assessment.id, {
          pdfUrl,
          isProcessed: true,
        });
        console.log('Assessment updated with PDF URL');

        // Send email through GoHighLevel and create contact
        try {
          const ghlResult = await goHighLevelService.processValuationAssessment(assessment, pdfBuffer);
          console.log(`GoHighLevel processing completed:`, {
            contactCreated: ghlResult.contactCreated,
            emailSent: ghlResult.emailSent,
            webhookSent: ghlResult.webhookSent,
            email: assessment.email
          });
        } catch (ghlError) {
          console.error('GoHighLevel processing failed, but continuing:', ghlError);
          // Don't fail the entire request if GoHighLevel fails
        }

      } catch (pdfError) {
        console.error('PDF generation failed, but continuing with webhook:', pdfError);
        
        // Update assessment without PDF
        assessment = await storage.updateValuationAssessment(assessment.id, {
          isProcessed: true,
        });
      }

      // Send lead data to CRM webhook (moved outside PDF try-catch)
      try {
        const webhookData = {
          name: `${assessment.firstName} ${assessment.lastName}`,
          email: assessment.email,
          phone: assessment.phone,
          company: assessment.company,
          jobTitle: assessment.jobTitle || '',
          adjustedEBITDA: metrics.adjustedEbitda,
          valuationEstimate: metrics.midEstimate,
          valuationLow: metrics.lowEstimate,
          valuationHigh: metrics.highEstimate,
          overallScore: metrics.overallScore,
          financialPerformanceGrade: assessment.financialPerformance,
          customerConcentrationGrade: assessment.customerConcentration,
          managementTeamGrade: assessment.managementTeam,
          competitivePositionGrade: assessment.competitivePosition,
          growthProspectsGrade: assessment.growthProspects,
          systemsProcessesGrade: assessment.systemsProcesses,
          assetQualityGrade: assessment.assetQuality,
          industryOutlookGrade: assessment.industryOutlook,
          riskFactorsGrade: assessment.riskFactors,
          ownerDependencyGrade: assessment.ownerDependency,
          followUpIntent: assessment.followUpIntent,
          executiveSummary: assessment.executiveSummary || '',
          submissionDate: new Date().toISOString(),
          leadSource: 'Business Valuation Calculator',
          pdfLink: assessment.pdfUrl ? `${req.protocol}://${req.get('host')}${assessment.pdfUrl}` : null
        };

        console.log('Sending webhook data:', JSON.stringify(webhookData, null, 2));
        
        const webhookResponse = await fetch('https://services.leadconnectorhq.com/hooks/QNFFrENaRuI2JhIdFd0Z/webhook-trigger/016d7395-74cf-4bd0-9c13-263f55efe657', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(webhookData)
        });
        
        console.log('Webhook response status:', webhookResponse.status);
        console.log('Webhook response:', await webhookResponse.text());
        console.log(`Lead data sent to CRM for ${assessment.email}`);
      } catch (webhookError) {
        console.error('Failed to send lead data to CRM, but continuing:', webhookError);
        // Don't fail the entire request if webhook fails
      }

      // Send formatted data to GoHighLevel webhook callback
      try {
        // Try to get the access token info to determine GHL contact ID and type
        let ghlContactId = null;
        let assessmentType = 'direct'; // Default for direct submissions
        
        // Check if this assessment came from a token-based access
        if (req.headers['x-access-token']) {
          try {
            const accessToken = await storage.getAccessTokenByToken(req.headers['x-access-token'] as string);
            if (accessToken) {
              ghlContactId = accessToken.ghlContactId;
              assessmentType = accessToken.type;
            }
          } catch (tokenError) {
            console.log('Could not retrieve access token info:', tokenError);
          }
        }

        const ghlWebhookData = {
          ghlContactId: ghlContactId,
          score: parseFloat(((metrics.lowEstimate + metrics.highEstimate) / 2 / 1000000).toFixed(1)), // Convert to millions
          valuationRange: `$${metrics.lowEstimate.toLocaleString()} – $${metrics.highEstimate.toLocaleString()}`,
          driverGrades: {
            financialPerformance: assessment.financialPerformance,
            customerConcentration: assessment.customerConcentration,
            managementTeam: assessment.managementTeam,
            competitivePosition: assessment.competitivePosition,
            growthProspects: assessment.growthProspects,
            systemsProcesses: assessment.systemsProcesses,
            assetQuality: assessment.assetQuality,
            industryOutlook: assessment.industryOutlook,
            riskFactors: assessment.riskFactors,
            ownerDependency: assessment.ownerDependency
          },
          type: assessmentType,
          assessmentUrl: assessment.pdfUrl ? `${req.protocol}://${req.get('host')}${assessment.pdfUrl}` : null,
          completedAt: new Date().toISOString(),
          // Additional contact info for reference
          name: `${assessment.firstName} ${assessment.lastName}`,
          email: assessment.email,
          phone: assessment.phone,
          company: assessment.company,
          followUpIntent: assessment.followUpIntent === 'yes'
        };

        console.log('Sending GHL webhook callback data:', JSON.stringify(ghlWebhookData, null, 2));
        
        const ghlWebhookResponse = await fetch('https://services.leadconnectorhq.com/hooks/QNFFrENaRuI2JhIdFd0Z/webhook-trigger/0bdb4be6-432a-469b-9296-5b14d8fcfdc7', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ghlWebhookData)
        });
        
        console.log('GHL webhook callback response status:', ghlWebhookResponse.status);
        console.log('GHL webhook callback response:', await ghlWebhookResponse.text());
        console.log(`GHL webhook callback sent for ${assessment.email}`);
      } catch (ghlWebhookError) {
        console.error('Failed to send GHL webhook callback, but continuing:', ghlWebhookError);
        // Don't fail the entire request if webhook fails
      }

      res.json(assessment);
    } catch (error) {
      console.error("Error processing valuation:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Internal server error" 
      });
    }
  });

  // Admin authentication routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Simple admin credentials check (in production, use proper password hashing)
      const adminUsername = process.env.ADMIN_USERNAME || 'admin';
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
      
      if (username === adminUsername && password === adminPassword) {
        (req.session as any).adminAuthenticated = true;
        res.json({ success: true, message: 'Authentication successful' });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Authentication failed' });
    }
  });

  app.get("/api/admin/status", async (req, res) => {
    // Check if admin is authenticated via admin login
    if ((req.session as any)?.adminAuthenticated) {
      return res.json({ authenticated: true });
    }

    // Check if team member is authenticated (team members have admin access)
    const sessionId = (req.session as any)?.teamSessionId;
    if (sessionId) {
      try {
        const session = await storage.getTeamSession(sessionId);
        if (session && session.expiresAt > new Date()) {
          const teamMember = await storage.getTeamMemberById(session.teamMemberId!);
          if (teamMember && teamMember.isActive) {
            return res.json({ authenticated: true });
          }
        }
      } catch (error) {
        // Continue to return false
      }
    }

    res.json({ authenticated: false });
  });

  app.post("/api/admin/logout", (req, res) => {
    (req.session as any).adminAuthenticated = false;
    res.json({ success: true });
  });

  // Team authentication routes
  app.post("/api/team/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      const { email, password } = validatedData;

      const teamMember = await storage.getTeamMemberByEmail(email);
      if (!teamMember || !teamMember.isActive) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, teamMember.hashedPassword);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Create session
      const sessionId = nanoid();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      await storage.createTeamSession(teamMember.id, sessionId, expiresAt);

      // Update last login
      await storage.updateTeamMember(teamMember.id, { lastLoginAt: new Date() });

      (req.session as any).teamSessionId = sessionId;

      // Return user without password
      const { hashedPassword, ...userWithoutPassword } = teamMember;
      res.json({ 
        success: true, 
        user: userWithoutPassword,
        mustChangePassword: teamMember.mustChangePassword,
        message: 'Login successful' 
      });
    } catch (error) {
      res.status(400).json({ error: 'Invalid request data' });
    }
  });

  app.get("/api/team/me", isTeamAuthenticated, (req: any, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'User not found' });
    }
    const { hashedPassword, ...userWithoutPassword } = req.user;
    res.json({ user: userWithoutPassword });
  });

  app.post("/api/team/logout", isTeamAuthenticated, async (req, res) => {
    try {
      const sessionId = (req.session as any)?.teamSessionId;
      if (sessionId) {
        await storage.deleteTeamSession(sessionId);
      }
      (req.session as any).teamSessionId = null;
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Logout failed' });
    }
  });

  // Team management routes (admin only)
  app.get("/api/team/members", isTeamAuthenticated, requireRole(['admin']), async (req, res) => {
    try {
      const members = await storage.getAllTeamMembers();
      const membersWithoutPasswords = members.map(({ hashedPassword, ...member }) => member);
      res.json(membersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch team members' });
    }
  });

  app.post("/api/team/members", isTeamAuthenticated, requireRole(['admin']), async (req, res) => {
    try {
      const validatedData = insertTeamMemberSchema.parse(req.body);
      const { password, ...memberData } = validatedData;

      // Check if email already exists
      const existingMember = await storage.getTeamMemberByEmail(memberData.email);
      if (existingMember) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      const newMember = await storage.createTeamMember({
        ...memberData,
        hashedPassword,
      } as any);

      // Send welcome email via GoHighLevel
      try {
        const welcomeEmailData = {
          contactId: null, // Will create contact if needed
          email: memberData.email,
          firstName: memberData.firstName,
          lastName: memberData.lastName,
          phone: '', // Optional for team members
          subject: 'Welcome to Apple Bites Business Assessment - Team Account Created',
          emailContent: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1e40af;">Welcome to Apple Bites Business Assessment</h2>
              <p>Hello ${memberData.firstName} ${memberData.lastName},</p>
              <p>Your team account has been successfully created! You now have access to the Apple Bites Business Assessment admin dashboard.</p>
              
              <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #334155; margin-top: 0;">Account Details:</h3>
                <ul style="list-style: none; padding: 0;">
                  <li style="margin: 8px 0;"><strong>Email:</strong> ${memberData.email}</li>
                  <li style="margin: 8px 0;"><strong>Role:</strong> ${memberData.role}</li>
                  <li style="margin: 8px 0;"><strong>Temporary Password:</strong> ${password}</li>
                </ul>
              </div>
              
              <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <p style="margin: 0;"><strong>Important:</strong> Please log in at your earliest convenience and change your password for security. You'll be prompted to update your password on first login.</p>
              </div>
              
              <p style="margin-top: 20px;">You can access the admin dashboard at: <a href="https://applebites.ai/admin" style="color: #1e40af;">https://applebites.ai/admin</a></p>
              
              <p>Best regards,<br>
              <strong>Meritage Partners Team</strong><br>
              Apple Bites Business Assessment</p>
            </div>
          `,
          isTeamMember: true
        };

        const ghlResult = await goHighLevelService.sendTeamWelcomeEmail(welcomeEmailData);
        console.log(`Welcome email sent to team member ${memberData.email}:`, {
          emailSent: ghlResult.emailSent,
          contactCreated: ghlResult.contactCreated
        });
      } catch (emailError) {
        console.error('Failed to send welcome email via GHL:', emailError);
        // Don't fail the entire operation if email fails
      }

      const { hashedPassword: _, ...memberWithoutPassword } = newMember;
      res.status(201).json(memberWithoutPassword);
    } catch (error) {
      res.status(400).json({ error: 'Failed to create team member' });
    }
  });

  app.put("/api/team/members/:id", isTeamAuthenticated, requireRole(['admin']), async (req, res) => {
    try {
      const memberId = parseInt(req.params.id);
      const updates = req.body;

      // Don't allow updating password through this endpoint
      delete updates.hashedPassword;
      delete updates.password;

      const updatedMember = await storage.updateTeamMember(memberId, updates);
      const { hashedPassword, ...memberWithoutPassword } = updatedMember;
      res.json(memberWithoutPassword);
    } catch (error) {
      res.status(400).json({ error: 'Failed to update team member' });
    }
  });

  app.delete("/api/team/members/:id", isTeamAuthenticated, requireRole(['admin']), async (req: any, res) => {
    try {
      const memberId = parseInt(req.params.id);
      
      // Don't allow deleting yourself
      if (req.user && memberId === req.user.id) {
        return res.status(400).json({ error: 'Cannot delete your own account' });
      }

      await storage.deleteTeamMember(memberId);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: 'Failed to delete team member' });
    }
  });

  // Password change endpoint
  app.post("/api/team/change-password", isTeamAuthenticated, async (req: any, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!req.user) {
        return res.status(401).json({ error: 'User not found' });
      }
      const userId = req.user.id;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Current password and new password are required' });
      }

      // Get current user
      const user = await storage.getTeamMemberById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.hashedPassword);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Update password and clear mustChangePassword flag
      await storage.updateTeamMember(userId, { 
        hashedPassword: hashedNewPassword,
        mustChangePassword: false
      });

      res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ error: 'Failed to change password' });
    }
  });

  // Lead management routes (protected)
  app.get("/api/leads", isAdminAuthenticated, async (req, res) => {
    try {
      const { status, search } = req.query;
      
      let leads;
      if (search) {
        leads = await storage.searchLeads(search as string);
      } else if (status) {
        leads = await storage.getLeadsByStatus(status as string);
      } else {
        leads = await storage.getAllLeads();
      }
      
      res.json(leads);
    } catch (error) {
      console.error('Error fetching leads:', error);
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  app.get("/api/leads/:id", isAdminAuthenticated, async (req, res) => {
    try {
      const leadId = parseInt(req.params.id);
      const lead = await storage.getLeadById(leadId);
      
      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }
      
      res.json(lead);
    } catch (error) {
      console.error('Error fetching lead:', error);
      res.status(500).json({ error: "Failed to fetch lead" });
    }
  });

  app.put("/api/leads/:id", isAdminAuthenticated, async (req, res) => {
    try {
      const leadId = parseInt(req.params.id);
      const updates = req.body;
      
      const lead = await storage.updateLead(leadId, updates);
      res.json(lead);
    } catch (error) {
      console.error('Error updating lead:', error);
      res.status(500).json({ error: "Failed to update lead" });
    }
  });

  app.patch("/api/leads/:id", isAdminAuthenticated, async (req, res) => {
    try {
      const leadId = parseInt(req.params.id);
      const { status } = req.body;
      
      const lead = await storage.updateLead(leadId, { leadStatus: status });
      res.json(lead);
    } catch (error) {
      console.error('Error updating lead status:', error);
      res.status(500).json({ error: "Failed to update lead status" });
    }
  });

  app.delete("/api/leads/:id", isAdminAuthenticated, async (req, res) => {
    try {
      const leadId = parseInt(req.params.id);
      
      // Check if lead exists
      const lead = await storage.getLeadById(leadId);
      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }
      
      await storage.deleteLead(leadId);
      res.json({ success: true, message: "Lead deleted successfully" });
    } catch (error) {
      console.error('Error deleting lead:', error);
      res.status(500).json({ error: "Failed to delete lead" });
    }
  });

  app.get("/api/leads/:id/activities", isAdminAuthenticated, async (req, res) => {
    try {
      const leadId = parseInt(req.params.id);
      const activities = await storage.getLeadActivities(leadId);
      res.json(activities);
    } catch (error) {
      console.error('Error fetching lead activities:', error);
      res.status(500).json({ error: "Failed to fetch lead activities" });
    }
  });

  app.post("/api/leads/:id/activities", isAdminAuthenticated, async (req, res) => {
    try {
      const leadId = parseInt(req.params.id);
      const activityData = { ...req.body, leadId };
      
      const activity = await storage.createLeadActivity(activityData);
      res.json(activity);
    } catch (error) {
      console.error('Error creating lead activity:', error);
      res.status(500).json({ error: "Failed to create lead activity" });
    }
  });

  // GET /api/analytics/assessments - Get all assessments for analytics
  app.get("/api/analytics/assessments", async (req, res) => {
    try {
      const assessments = await storage.getAllValuationAssessments();
      res.json(assessments);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      res.status(500).json({ message: "Failed to fetch analytics data" });
    }
  });



  // GET /api/analytics/metrics - Get summary metrics
  app.get("/api/analytics/metrics", async (req, res) => {
    try {
      const assessments = await storage.getAllValuationAssessments();
      
      const metrics = {
        totalAssessments: assessments.length,
        completedAssessments: assessments.filter(a => a.isProcessed).length,
        averageValuation: assessments.length > 0 
          ? assessments.reduce((sum, a) => sum + parseFloat(a.midEstimate || "0"), 0) / assessments.length 
          : 0,
        totalEbitda: assessments.reduce((sum, a) => sum + parseFloat(a.adjustedEbitda || "0"), 0),
        followUpDistribution: assessments.reduce((acc, a) => {
          acc[a.followUpIntent] = (acc[a.followUpIntent] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        scoreDistribution: assessments.reduce((acc, a) => {
          const score = a.overallScore?.charAt(0) || 'C';
          acc[score] = (acc[score] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        monthlyTrends: assessments.reduce((acc, a) => {
          const month = new Date(a.createdAt || '').toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          acc[month] = (acc[month] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };
      
      res.json(metrics);
    } catch (error) {
      console.error("Error calculating metrics:", error);
      res.status(500).json({ message: "Failed to calculate metrics" });
    }
  });

  // GET /api/test-webhook-new - Test webhook with new field structure
  app.get("/api/test-webhook-new", async (req, res) => {
    try {
      const testData = {
        name: "Email Template Test",
        email: "email-template-test@example.com",
        phone: "555-0123",
        company: "Email Test Company",
        jobTitle: "CEO",
        adjustedEBITDA: 100000,
        valuationEstimate: 500000,
        valuationLow: 400000,
        valuationHigh: 600000,
        overallScore: "B+",
        financialPerformanceGrade: "A",
        customerConcentrationGrade: "B", 
        managementTeamGrade: "A",
        competitivePositionGrade: "B",
        growthProspectsGrade: "A",
        systemsProcessesGrade: "C",
        assetQualityGrade: "B",
        industryOutlookGrade: "B",
        riskFactorsGrade: "B",
        ownerDependencyGrade: "C",
        followUpIntent: "yes",
        executiveSummary: "Test summary with complete field mapping for GoHighLevel integration",
        submissionDate: new Date().toISOString(),
        leadSource: "Business Valuation Calculator",
        pdfLink: null
      };

      console.log('Testing NEW webhook with complete field data:', JSON.stringify(testData, null, 2));
      
      const webhookResponse = await fetch('https://services.leadconnectorhq.com/hooks/QNFFrENaRuI2JhldFd0Z/webhook-trigger/dc1a8a7f-47ee-4c9a-b474-e1aeb21af3e3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });
      
      const responseText = await webhookResponse.text();
      console.log('NEW webhook test response status:', webhookResponse.status);
      console.log('NEW webhook test response:', responseText);
      
      res.json({
        status: webhookResponse.status,
        response: responseText,
        success: webhookResponse.ok,
        sentData: testData
      });
    } catch (error) {
      console.error('NEW webhook test failed:', error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // GET /api/test-webhook - Test webhook connection with all fields
  app.get("/api/test-webhook", async (req, res) => {
    try {
      const testData = {
        name: "Test User",
        email: "test@example.com",
        phone: "555-0123",
        company: "Test Company",
        jobTitle: "CEO",
        adjustedEBITDA: 100000,
        valuationEstimate: 500000,
        valuationLow: 400000,
        valuationHigh: 600000,
        overallScore: "B+",
        driverGrades: {
          "Financial Performance": "A",
          "Customer Concentration": "B",
          "Management Team": "A"
        },
        followUpIntent: "yes",
        executiveSummary: "Test summary",
        pdfLink: null
      };

      console.log('Testing webhook with complete field data:', JSON.stringify(testData, null, 2));
      
      const webhookResponse = await fetch('https://services.leadconnectorhq.com/hooks/QNFFrENaRuI2JhldFd0Z/webhook-trigger/8b5475d9-3027-471a-8dcb-d6ab9dabedb8', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });
      
      const responseText = await webhookResponse.text();
      console.log('Webhook test response status:', webhookResponse.status);
      console.log('Webhook test response:', responseText);
      
      res.json({
        status: webhookResponse.status,
        response: responseText,
        success: webhookResponse.ok
      });
    } catch (error) {
      console.error('Webhook test failed:', error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
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

  // Webhook endpoint to receive valuation assessment data FROM GoHighLevel
  app.post("/api/webhook/gohighlevel", async (req, res) => {
    try {
      console.log('Received GoHighLevel webhook:', JSON.stringify(req.body, null, 2));
      
      const webhookData = req.body;
      
      // Only process valuation-related contacts (check for specific tags or event types)
      const hasValuationEvent = webhookData.event === 'valuation_completed';
      const hasValuationTag = (webhookData.contact?.tags && Array.isArray(webhookData.contact.tags) && webhookData.contact.tags.includes('Business Valuation Lead')) ||
                             (webhookData.tags && Array.isArray(webhookData.tags) && webhookData.tags.includes('Business Valuation Lead'));
      const hasValuationSource = webhookData.contact?.leadSource === 'valuation_form' ||
                                 webhookData.leadSource === 'valuation_form';
      
      const isValuationLead = hasValuationEvent || hasValuationTag || hasValuationSource;
      

      
      if (!isValuationLead) {
        console.log('Not a valuation lead, skipping webhook processing...');
        return res.status(200).json({ message: 'Not a valuation lead, skipped' });
      }
      
      // Extract contact information from webhook payload
      const contactData = {
        firstName: webhookData.contact?.first_name || webhookData.first_name || webhookData.firstName,
        lastName: webhookData.contact?.last_name || webhookData.last_name || webhookData.lastName,
        email: webhookData.contact?.email || webhookData.email,
        phone: webhookData.contact?.phone || webhookData.phone,
        company: webhookData.contact?.company_name || webhookData.company || webhookData.companyName,
        jobTitle: webhookData.contact?.job_title || webhookData.jobTitle || '',
        leadSource: 'valuation_form',
        leadStatus: 'new'
      };

      // Only process if we have valid contact data
      if (!contactData.email) {
        console.log('No email found in webhook data, skipping...');
        return res.status(200).json({ message: 'No email provided, skipped' });
      }

      // Check if lead already exists by email
      const existingLead = await storage.getLeadByEmail(contactData.email);

      if (existingLead) {
        console.log(`Lead already exists for ${contactData.email}, updating...`);
        // Update existing lead with any new information
        const updatedLead = await storage.updateLead(existingLead.id, {
          firstName: contactData.firstName,
          lastName: contactData.lastName,
          phone: contactData.phone,
          company: contactData.company,
          jobTitle: contactData.jobTitle,
          notes: `${existingLead.notes || ''}\n[${new Date().toISOString()}] Updated via GoHighLevel webhook`.trim()
        });
        
        return res.status(200).json({ 
          message: 'Lead updated successfully', 
          leadId: updatedLead.id,
          action: 'updated'
        });
      } else {
        console.log(`Creating new lead for ${contactData.email}...`);
        // Create new lead
        const newLead = await storage.createLead({
          firstName: contactData.firstName,
          lastName: contactData.lastName,
          email: contactData.email,
          phone: contactData.phone,
          company: contactData.company,
          jobTitle: contactData.jobTitle,
          leadSource: contactData.leadSource,
          leadStatus: contactData.leadStatus,
          notes: `[${new Date().toISOString()}] Created via GoHighLevel webhook`
        });
        
        return res.status(200).json({ 
          message: 'Lead created successfully', 
          leadId: newLead.id,
          action: 'created'
        });
      }
      
    } catch (error) {
      console.error('GoHighLevel webhook processing failed:', error);
      res.status(500).json({
        error: 'Webhook processing failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });



  // POST /api/report/generate-enhanced - Generate paid tier PDF with NAICS-specific multipliers
  app.post("/api/report/generate-enhanced", async (req, res) => {
    try {
      const { assessmentId, naicsCode, sicCode, industryDescription, foundingYear, sendEmail = false } = req.body;
      
      const assessment = await storage.getValuationAssessment(assessmentId);
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }

      // Update assessment with industry data for paid tier
      const updatedData: any = {
        reportTier: 'paid',
        naicsCode,
        sicCode,
        industryDescription,
        foundingYear
      };

      // For paid tier, recalculate with comprehensive NAICS-specific multipliers
      if (naicsCode) {
        const comprehensiveNAICS = getComprehensiveNAICSByCode(naicsCode);
        
        if (comprehensiveNAICS) {
          // Convert grade to numeric score for calculation
          const gradeToScore = { 'A': 95, 'B': 85, 'C': 75, 'D': 65, 'F': 50 };
          const overallGrade = assessment.overallScore || 'C';
          const gradeScore = gradeToScore[overallGrade as keyof typeof gradeToScore] || 75;
          
          // Calculate multiplier based on grade and comprehensive range
          const enhancedMultiple = calculateComprehensiveMultiplierFromGrade(comprehensiveNAICS, gradeScore);
          
          // Recalculate valuation with industry-specific multiplier
          const adjustedEbitda = parseFloat(assessment.adjustedEbitda || '0');
          const lowEstimate = adjustedEbitda * comprehensiveNAICS.minMultiplier;
          const midEstimate = adjustedEbitda * enhancedMultiple;
          const highEstimate = adjustedEbitda * comprehensiveNAICS.maxMultiplier;
          
          updatedData.valuationMultiple = enhancedMultiple.toFixed(2);
          updatedData.lowEstimate = lowEstimate.toFixed(2);
          updatedData.midEstimate = midEstimate.toFixed(2);
          updatedData.highEstimate = highEstimate.toFixed(2);
        } else {
          // Fallback to default multipliers if NAICS not found in comprehensive database
          const adjustedEbitda = parseFloat(assessment.adjustedEbitda || '0');
          const defaultMultiplier = 4.0;
          const midEstimate = adjustedEbitda * defaultMultiplier;
          const lowEstimate = midEstimate * 0.8;
          const highEstimate = midEstimate * 1.2;
          
          updatedData.valuationMultiple = defaultMultiplier.toFixed(2);
          updatedData.lowEstimate = lowEstimate.toFixed(2);
          updatedData.midEstimate = midEstimate.toFixed(2);
          updatedData.highEstimate = highEstimate.toFixed(2);
        }
      }
      
      // Update assessment with enhanced data
      await storage.updateValuationAssessment(assessmentId, updatedData);
      
      // Get refreshed assessment
      const enhancedAssessment = await storage.getValuationAssessment(assessmentId);
      if (!enhancedAssessment) {
        return res.status(404).json({ message: "Assessment not found after update" });
      }
      
      // Generate enhanced PDF
      const pdfBuffer = await generateEnhancedValuationPDF(enhancedAssessment, 'paid');
      
      // Save PDF to filesystem
      const pdfDir = path.join(process.cwd(), 'pdfs');
      await fs.mkdir(pdfDir, { recursive: true });
      const pdfFileName = `strategic_valuation_${enhancedAssessment.id}_${Date.now()}.pdf`;
      const pdfPath = path.join(pdfDir, pdfFileName);
      await fs.writeFile(pdfPath, pdfBuffer);
      
      // Update assessment with PDF URL
      await storage.updateValuationAssessment(assessmentId, {
        pdfUrl: `/api/pdf/${pdfFileName}`
      });
      
      // Send email if requested
      let emailResult = null;
      if (sendEmail) {
        emailResult = await resendEmailService.sendValuationReport({
          assessment: enhancedAssessment,
          pdfBuffer,
          tier: 'paid'
        });
      }
      
      res.json({
        success: true,
        pdfUrl: `/api/pdf/${pdfFileName}`,
        downloadUrl: `/api/pdf/${pdfFileName}`,
        message: "Strategic report generated successfully",
        emailSent: emailResult?.success || false,
        emailMessageId: emailResult?.messageId
      });
      
    } catch (error) {
      console.error("Error generating enhanced PDF:", error);
      res.status(500).json({ message: "Error generating strategic report" });
    }
  });

  // POST /api/report/generate-free - Generate free tier PDF (current system)
  app.post("/api/report/generate-free", async (req, res) => {
    try {
      const { assessmentId, sendEmail = false } = req.body;
      
      const assessment = await storage.getValuationAssessment(assessmentId);
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }

      // Mark as free tier
      await storage.updateValuationAssessment(assessmentId, {
        reportTier: 'free'
      });
      
      // Generate free tier PDF using enhanced generator
      const pdfBuffer = await generateEnhancedValuationPDF(assessment, 'free');
      
      // Send email if requested
      if (sendEmail) {
        const emailResult = await resendEmailService.sendValuationReport({
          assessment,
          pdfBuffer,
          tier: 'free'
        });
        
        return res.json({
          success: true,
          message: "Starter report generated and emailed successfully",
          emailSent: emailResult.success,
          emailMessageId: emailResult.messageId
        });
      }
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${assessment.company}_Starter_Valuation_Report.pdf"`);
      res.send(pdfBuffer);
      
    } catch (error) {
      console.error("Error generating free PDF:", error);
      res.status(500).json({ message: "Error generating starter report" });
    }
  });

  // POST /api/email/send-report - Send existing report via email
  app.post("/api/email/send-report", async (req, res) => {
    try {
      const { assessmentId, tier = 'free', recipientEmail } = req.body;
      
      const assessment = await storage.getValuationAssessment(assessmentId);
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }

      // Generate PDF for email
      const pdfBuffer = await generateEnhancedValuationPDF(assessment, tier);
      
      // Send email
      const emailResult = await resendEmailService.sendValuationReport({
        assessment,
        pdfBuffer,
        tier,
        recipientEmail
      });
      
      if (emailResult.success) {
        res.json({
          success: true,
          message: "Report sent successfully",
          messageId: emailResult.messageId
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to send email",
          error: emailResult.error
        });
      }
      
    } catch (error) {
      console.error("Error sending report email:", error);
      res.status(500).json({ message: "Error sending report email" });
    }
  });

  // POST /api/email/send-follow-up - Send follow-up email
  app.post("/api/email/send-follow-up", async (req, res) => {
    try {
      const { assessmentId, followUpType } = req.body;
      
      const assessment = await storage.getValuationAssessment(assessmentId);
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }

      const emailResult = await resendEmailService.sendFollowUpEmail(assessment, followUpType);
      
      if (emailResult.success) {
        res.json({
          success: true,
          message: "Follow-up email sent successfully",
          messageId: emailResult.messageId
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to send follow-up email",
          error: emailResult.error
        });
      }
      
    } catch (error) {
      console.error("Error sending follow-up email:", error);
      res.status(500).json({ message: "Error sending follow-up email" });
    }
  });

  // Test endpoint for GoHighLevel integration
  app.post("/api/test-gohighlevel", async (req, res) => {
    try {
      const testContact = {
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        phone: "555-123-4567",
        companyName: "Test Company"
      };

      // Test contact creation
      const contactResult = await goHighLevelService.createOrUpdateContact(testContact);
      
      // Test webhook
      const webhookResult = await goHighLevelService.sendWebhook({
        event: "test_integration",
        contact: testContact,
        timestamp: new Date().toISOString()
      });

      res.json({
        success: true,
        results: {
          contactCreated: !!contactResult,
          webhookSent: webhookResult
        }
      });
    } catch (error) {
      console.error("GoHighLevel test failed:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Test webhook payload endpoint
  app.post("/api/test-webhook-payload", async (req, res) => {
    try {
      const testPayload = {
        name: "Webhook Mapping Test",
        email: "test@example.com",
        phone: "1234567890",
        company: "Test Company",
        valuation_range: "$1M – $2M",
        valuation_score: 5.5,
        value_drivers: {
          Financials: "C",
          Growth: "B",
          Operations: "D",
          Team: "B",
          Market: "A"
        },
        summary: "Sample mapping test to enable reference.",
        opted_for_follow_up: false
      };

      console.log('Testing webhook payload:', JSON.stringify(testPayload, null, 2));
      
      const webhookResponse = await fetch('https://services.leadconnectorhq.com/hooks/QNFFrENaRuI2JhIdFd0Z/webhook-trigger/016d7395-74cf-4bd0-9c13-263f55efe657', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testPayload)
      });
      
      const responseText = await webhookResponse.text();
      console.log('Webhook test response status:', webhookResponse.status);
      console.log('Webhook test response:', responseText);
      
      res.json({
        success: webhookResponse.ok,
        status: webhookResponse.status,
        response: responseText,
        payload: testPayload
      });
    } catch (error) {
      console.error('Webhook payload test failed:', error);
      res.status(500).json({ 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  // Test webhook sender to GHL endpoint
  app.post("/api/test-send-webhook", async (req, res) => {
    try {
      const { webhookUrl, testType } = req.body;
      
      if (!webhookUrl) {
        return res.status(400).json({ error: "webhookUrl is required" });
      }
      
      // Generate test data based on type
      const isGrowth = testType === 'growth';
      const testData = {
        ghlContactId: `test_contact_${isGrowth ? 'growth' : 'basic'}_${Date.now()}`,
        score: isGrowth ? 5.2 : 2.3,
        valuationRange: isGrowth ? "$4,200,000 – $6,300,000" : "$1,800,000 – $2,700,000",
        driverGrades: {
          financialPerformance: isGrowth ? "A" : "B",
          customerConcentration: isGrowth ? "A" : "C",
          managementTeam: isGrowth ? "A" : "B",
          competitivePosition: isGrowth ? "B" : "B",
          growthProspects: isGrowth ? "A" : "B",
          systemsProcesses: isGrowth ? "A" : "C",
          assetQuality: isGrowth ? "B" : "B",
          industryOutlook: isGrowth ? "A" : "B",
          riskFactors: isGrowth ? "B" : "C",
          ownerDependency: isGrowth ? "C" : "C"
        },
        type: isGrowth ? "growth" : "basic",
        assessmentUrl: `https://applebites.ai/api/pdf/test-${isGrowth ? 'growth' : 'basic'}-report.pdf`,
        completedAt: new Date().toISOString(),
        name: `Test ${isGrowth ? 'Growth' : 'Basic'} Assessment`,
        email: `test-${isGrowth ? 'growth' : 'basic'}@example.com`,
        phone: isGrowth ? "555-GROWTH-001" : "555-BASIC-001",
        company: `Test ${isGrowth ? 'Growth' : 'Basic'} Company`,
        followUpIntent: true
      };
      
      console.log(`📤 Sending ${testType || 'basic'} test data to webhook:`, webhookUrl);
      console.log("Test payload:", JSON.stringify(testData, null, 2));
      
      // Send to webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });
      
      const responseText = await response.text();
      
      res.json({
        success: true,
        webhookResponse: {
          status: response.status,
          statusText: response.statusText,
          body: responseText
        },
        sentData: testData
      });
      
    } catch (error) {
      console.error('Webhook send test failed:', error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // Test basic webhook callback endpoint
  app.post("/api/test-basic-webhook", async (req, res) => {
    try {
      // Generate a test token first
      const testToken = await storage.generateAccessToken('basic', 'test_contact_basic');
      
      // Create test basic assessment data
      const testAssessment = {
        id: 888,
        firstName: "Basic",
        lastName: "Assessment Test",
        email: "basic@test.com",
        phone: "555-BASIC-001",
        company: "Test Basic Company",
        financialPerformance: "B",
        customerConcentration: "C",
        managementTeam: "B",
        competitivePosition: "B",
        growthProspects: "B",
        systemsProcesses: "C",
        assetQuality: "B",
        industryOutlook: "B",
        riskFactors: "C",
        ownerDependency: "C",
        followUpIntent: "yes",
        pdfUrl: "/api/pdf/test-basic-report.pdf"
      };
      
      const testMetrics = {
        lowEstimate: 1800000,
        highEstimate: 2700000,
        midEstimate: 2250000
      };
      
      // Simulate the basic webhook callback data
      const basicWebhookData = {
        ghlContactId: testToken.ghlContactId,
        score: parseFloat(((testMetrics.lowEstimate + testMetrics.highEstimate) / 2 / 1000000).toFixed(1)),
        valuationRange: `$${testMetrics.lowEstimate.toLocaleString()} – $${testMetrics.highEstimate.toLocaleString()}`,
        driverGrades: {
          financialPerformance: testAssessment.financialPerformance,
          customerConcentration: testAssessment.customerConcentration,
          managementTeam: testAssessment.managementTeam,
          competitivePosition: testAssessment.competitivePosition,
          growthProspects: testAssessment.growthProspects,
          systemsProcesses: testAssessment.systemsProcesses,
          assetQuality: testAssessment.assetQuality,
          industryOutlook: testAssessment.industryOutlook,
          riskFactors: testAssessment.riskFactors,
          ownerDependency: testAssessment.ownerDependency
        },
        type: testToken.type,
        assessmentUrl: `https://applebites.ai${testAssessment.pdfUrl}`,
        completedAt: new Date().toISOString(),
        name: `${testAssessment.firstName} ${testAssessment.lastName}`,
        email: testAssessment.email,
        phone: testAssessment.phone,
        company: testAssessment.company,
        followUpIntent: testAssessment.followUpIntent === 'yes'
      };
      
      console.log('Testing basic webhook callback:', basicWebhookData);
      
      // Send to a basic webhook endpoint (if it exists)
      // For now, we'll just return the payload structure
      res.json({
        success: true,
        payload: basicWebhookData,
        tokenUsed: testToken.token
      });
      
    } catch (error) {
      console.error('Basic webhook test failed:', error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // Test enhanced webhook callback endpoint
  app.post("/api/test-enhanced-webhook", async (req, res) => {
    try {
      // Generate a test token first
      const testToken = await storage.generateAccessToken('growth', 'test_contact_enhanced');
      
      // Create test assessment data
      const testAssessment = {
        id: 999,
        firstName: "Enhanced",
        lastName: "Webhook Test",
        email: "enhanced@test.com",
        phone: "555-TEST-001",
        company: "Test Enhanced Company",
        financialPerformance: "A",
        customerConcentration: "B",
        managementTeam: "A",
        competitivePosition: "B",
        growthProspects: "A",
        systemsProcesses: "C",
        assetQuality: "B",
        industryOutlook: "A",
        riskFactors: "B",
        ownerDependency: "C",
        followUpIntent: "yes",
        pdfUrl: "/api/pdf/test-enhanced-report.pdf"
      };
      
      const testMetrics = {
        lowEstimate: 2400000,
        highEstimate: 3600000,
        midEstimate: 3000000
      };

      // Simulate the enhanced webhook callback data
      const enhancedWebhookData = {
        ghlContactId: testToken.ghlContactId,
        score: parseFloat(((testMetrics.lowEstimate + testMetrics.highEstimate) / 2 / 1000000).toFixed(1)),
        valuationRange: `$${testMetrics.lowEstimate.toLocaleString()} – $${testMetrics.highEstimate.toLocaleString()}`,
        driverGrades: {
          financialPerformance: testAssessment.financialPerformance,
          customerConcentration: testAssessment.customerConcentration,
          managementTeam: testAssessment.managementTeam,
          competitivePosition: testAssessment.competitivePosition,
          growthProspects: testAssessment.growthProspects,
          systemsProcesses: testAssessment.systemsProcesses,
          assetQuality: testAssessment.assetQuality,
          industryOutlook: testAssessment.industryOutlook,
          riskFactors: testAssessment.riskFactors,
          ownerDependency: testAssessment.ownerDependency
        },
        type: testToken.type,
        assessmentUrl: `https://applebites.ai${testAssessment.pdfUrl}`,
        completedAt: new Date().toISOString(),
        name: `${testAssessment.firstName} ${testAssessment.lastName}`,
        email: testAssessment.email,
        phone: testAssessment.phone,
        company: testAssessment.company,
        followUpIntent: testAssessment.followUpIntent === 'yes'
      };

      console.log('Testing enhanced webhook callback:', JSON.stringify(enhancedWebhookData, null, 2));
      
      const webhookResponse = await fetch('https://services.leadconnectorhq.com/hooks/QNFFrENaRuI2JhIdFd0Z/webhook-trigger/0bdb4be6-432a-469b-9296-5b14d8fcfdc7', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enhancedWebhookData)
      });
      
      const responseText = await webhookResponse.text();
      console.log('Enhanced webhook test response status:', webhookResponse.status);
      console.log('Enhanced webhook test response:', responseText);
      
      res.json({
        success: webhookResponse.ok,
        status: webhookResponse.status,
        response: responseText,
        payload: enhancedWebhookData,
        tokenUsed: testToken.token
      });
    } catch (error) {
      console.error('Enhanced webhook test failed:', error);
      res.status(500).json({ 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  // AI Coaching API endpoints
  app.post("/api/ai-coaching/tips", async (req, res) => {
    try {
      const coachingData: FinancialCoachingData = req.body;
      
      // Validate required fields
      if (!coachingData.revenue || !coachingData.ebitda || !coachingData.naicsCode) {
        return res.status(400).json({ error: "Missing required financial data" });
      }
      
      const tips = await generateFinancialCoachingTips(coachingData);
      res.json({ tips });
    } catch (error) {
      console.error("Error generating coaching tips:", error);
      res.status(500).json({ error: "Failed to generate coaching tips" });
    }
  });

  app.post("/api/ai-coaching/insights", async (req, res) => {
    try {
      const coachingData: FinancialCoachingData = req.body;
      
      // Validate required fields
      if (!coachingData.revenue || !coachingData.ebitda || !coachingData.naicsCode) {
        return res.status(400).json({ error: "Missing required financial data" });
      }
      
      const insights = await generateContextualInsights(coachingData);
      res.json({ insights });
    } catch (error) {
      console.error("Error generating contextual insights:", error);
      res.status(500).json({ error: "Failed to generate contextual insights" });
    }
  });

  // NAICS Industry Data API endpoints
  app.get("/api/naics/sectors", async (req, res) => {
    try {
      // Use complete official NAICS database for sectors
      const sectors = getAllSectors();
      const sectorTitles = sectors.map(sector => sector.title);
      res.json(sectorTitles);
    } catch (error) {
      console.error('Error fetching NAICS sectors:', error);
      res.status(500).json({ error: "Failed to fetch NAICS sectors" });
    }
  });

  app.get("/api/naics/industries/:sector", async (req, res) => {
    try {
      const sectorTitle = req.params.sector;
      // Find sector by title in complete database
      const allSectors = getAllSectors();
      const sector = allSectors.find(s => s.title === sectorTitle);
      
      if (sector) {
        const subsectors = getChildrenWithEnhancedTitles(sector.code);
        res.json(subsectors);
      } else {
        res.json([]);
      }
    } catch (error) {
      console.error('Error fetching NAICS industries:', error);
      res.status(500).json({ error: "Failed to fetch NAICS industries" });
    }
  });

  app.get("/api/naics/all", async (req, res) => {
    try {
      res.json(naicsDatabase);
    } catch (error) {
      console.error('Error fetching NAICS database:', error);
      res.status(500).json({ error: "Failed to fetch NAICS database" });
    }
  });

  app.get("/api/naics/by-parent/:parentCode", async (req, res) => {
    try {
      const parentCode = req.params.parentCode;
      const childIndustries = getChildrenWithEnhancedTitles(parentCode);
      res.json(childIndustries);
    } catch (error) {
      console.error('Error fetching NAICS by parent code:', error);
      res.status(500).json({ error: "Failed to fetch NAICS industries by parent code" });
    }
  });

  // New endpoint for sectors with codes (using curated database)
  app.get("/api/naics/sectors-with-codes", async (req, res) => {
    try {
      const curatedSectors = getCuratedSectors();
      res.json(curatedSectors);
    } catch (error) {
      console.error('Error fetching NAICS sectors with codes:', error);
      res.status(500).json({ error: "Failed to fetch NAICS sectors with codes" });
    }
  });

  // New endpoint for 6-digit industries by 2-digit sector (using curated database)
  app.get("/api/naics/by-sector/:sectorCode", async (req, res) => {
    try {
      const sectorCode = req.params.sectorCode;
      
      // Get curated 6-digit industries for this sector
      const curatedIndustries = getCuratedNAICsBySector(sectorCode);
      
      const formattedIndustries = curatedIndustries.map(industry => ({
        code: industry.code,
        title: `${industry.code} – ${industry.label}`,
        label: industry.label,
        multiplier: industry.multiplier,
        level: 6,
        sectorCode: sectorCode
      }));
      
      res.json(formattedIndustries);
    } catch (error) {
      console.error('Error fetching NAICS industries by sector:', error);
      res.status(500).json({ error: "Failed to fetch NAICS industries by sector" });
    }
  });

  app.get("/api/naics/by-level/:level", async (req, res) => {
    try {
      const level = parseInt(req.params.level);
      const industries = getNAICSByLevel(level);
      res.json(industries);
    } catch (error) {
      console.error('Error fetching NAICS by level:', error);
      res.status(500).json({ error: "Failed to fetch NAICS industries by level" });
    }
  });

  // API endpoints for comprehensive NAICS database
  app.get("/api/naics/comprehensive/sectors", async (req, res) => {
    try {
      const sectors = getComprehensiveSectors();
      res.json(sectors);
    } catch (error) {
      console.error('Error fetching comprehensive NAICS sectors:', error);
      res.status(500).json({ error: "Failed to fetch comprehensive NAICS sectors" });
    }
  });

  app.get("/api/naics/comprehensive/by-sector/:sectorCode", async (req, res) => {
    try {
      const sectorCode = req.params.sectorCode;
      const industries = getComprehensiveNAICsBySector(sectorCode);
      
      const formattedIndustries = industries.map(industry => ({
        code: industry.code,
        title: `${industry.code} – ${industry.label}`,
        label: industry.label,
        multiplier: {
          min: industry.minMultiplier,
          avg: industry.avgMultiplier,
          max: industry.maxMultiplier
        },
        level: 6,
        sectorCode: industry.sectorCode
      }));
      
      res.json(formattedIndustries);
    } catch (error) {
      console.error('Error fetching comprehensive NAICS by sector:', error);
      res.status(500).json({ error: "Failed to fetch comprehensive NAICS by sector" });
    }
  });

  app.get("/api/naics/comprehensive/:code", async (req, res) => {
    try {
      const code = req.params.code;
      const industry = getComprehensiveNAICSByCode(code);
      
      if (!industry) {
        return res.status(404).json({ error: "NAICS code not found" });
      }
      
      res.json({
        code: industry.code,
        label: industry.label,
        sectorCode: industry.sectorCode,
        multiplier: {
          min: industry.minMultiplier,
          avg: industry.avgMultiplier,
          max: industry.maxMultiplier
        }
      });
    } catch (error) {
      console.error('Error fetching comprehensive NAICS by code:', error);
      res.status(500).json({ error: "Failed to fetch comprehensive NAICS by code" });
    }
  });

  // Test endpoint for multiplier ranges
  app.get("/api/test/multiplier-ranges", async (req, res) => {
    try {
      const testResults = [];
      
      // Test all curated NAICS codes with different grades
      const grades = ['A', 'B', 'C', 'D', 'F'];
      
      for (const [sectorCode, industries] of Object.entries(curatedNAICSDatabase)) {
        for (const industry of industries) {
          const gradeResults = grades.map(grade => {
            const multiplier = calculateMultiplierFromGrade(industry.multiplier, grade);
            return { grade, multiplier: parseFloat(multiplier.toFixed(3)) };
          });
          
          testResults.push({
            sector: sectorCode,
            code: industry.code,
            label: industry.label,
            range: industry.multiplier,
            gradeResults
          });
        }
      }
      
      res.json({
        success: true,
        testResults,
        summary: {
          totalIndustries: testResults.length,
          sectors: Object.keys(curatedNAICSDatabase).length
        }
      });
    } catch (error) {
      console.error('Error testing multiplier ranges:', error);
      res.status(500).json({ error: "Failed to test multiplier ranges" });
    }
  });

  // Test endpoint for comprehensive multiplier ranges
  app.get("/api/test/comprehensive-multipliers", async (req, res) => {
    try {
      const testResults = [];
      
      // Test comprehensive NAICS codes with different grades
      const grades = ['A', 'B', 'C', 'D', 'F'];
      
      for (const industry of comprehensiveNAICSMultipliers.slice(0, 10)) { // Limit for testing
        const gradeResults = grades.map(grade => {
          const multiplier = calculateComprehensiveMultiplierFromGrade(industry, grade);
          return { grade, multiplier: parseFloat(multiplier.toFixed(3)) };
        });
        
        testResults.push({
          sector: industry.sectorCode,
          code: industry.code,
          label: industry.label,
          range: {
            min: industry.minMultiplier,
            avg: industry.avgMultiplier,
            max: industry.maxMultiplier
          },
          gradeResults
        });
      }
      
      res.json({
        success: true,
        testResults,
        summary: {
          totalIndustries: comprehensiveNAICSMultipliers.length,
          sectors: getAllComprehensiveSectors().length,
          tested: testResults.length
        }
      });
    } catch (error) {
      console.error('Error testing comprehensive multiplier ranges:', error);
      res.status(500).json({ error: "Failed to test comprehensive multiplier ranges" });
    }
  });

  // Token generation endpoint for GHL - NEVER REJECTS REQUESTS
  app.post("/api/generate-token", async (req, res) => {
    try {
      console.log("🔍 GHL Token Generation Request:");
      console.log("Request body:", JSON.stringify(req.body, null, 2));
      console.log("Request headers:", JSON.stringify(req.headers, null, 2));
      
      // Handle multiple field name formats - ALWAYS ACCEPTS ANY VALUE
      // GHL sends assessment_tier with {{contact.assessment_tier}} template variable
      const tokenType = req.body?.assessment_tier || req.body?.token_type || req.body?.type || req.body?.assessment_type || 'anything';
      
      // Extract ghlContactId from multiple possible field names, including GHL's default fields
      // GHL sends ghlContactId with {{contact.id}} template variable
      let ghlContactId = req.body?.ghlContactId || req.body?.contact_id || req.body?.contactId || req.body?.id || req.body?.contact?.id;
      
      console.log(`📋 Extracted values - tokenType: "${tokenType}", ghlContactId: "${ghlContactId}"`);
      console.log(`📋 All request body keys: ${Object.keys(req.body || {}).join(', ')}`);
      console.log(`📋 Raw body values:`);
      console.log(`   - assessment_tier: "${req.body?.assessment_tier}"`);
      console.log(`   - token_type: "${req.body?.token_type}"`);
      console.log(`   - type: "${req.body?.type}"`);
      console.log(`   - ghlContactId: "${req.body?.ghlContactId}"`);
      console.log(`   - contact_id: "${req.body?.contact_id}"`);
      console.log(`   - id: "${req.body?.id}"`);
      
      // If no contact ID found, try to extract from any available field
      if (!ghlContactId) {
        // Check for any field that might contain contact ID
        const possibleContactFields = Object.keys(req.body || {}).filter(key => 
          key.toLowerCase().includes('contact') || 
          key.toLowerCase().includes('id') || 
          key === 'id'
        );
        
        console.log(`📋 Possible contact fields found: ${possibleContactFields.join(', ')}`);
        
        if (possibleContactFields.length > 0) {
          ghlContactId = req.body[possibleContactFields[0]];
          console.log(`📋 Using field "${possibleContactFields[0]}" with value: "${ghlContactId}"`);
        }
      }
      
      // ULTRA-SAFE TOKEN GENERATION - NEVER FAILS
      // Always use growth regardless of input - no validation whatsoever
      const normalizedTokenType = 'growth';
      
      console.log(`📋 Input ignored: "${tokenType}" → Always using: "growth"`);
      console.log(`📋 Token type: "${normalizedTokenType}" (no validation performed)`);
      
      // Ensure we always have a contact ID - generate one if needed
      if (!ghlContactId || typeof ghlContactId !== 'string' || ghlContactId.trim() === '') {
        ghlContactId = `auto_contact_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        console.log(`📋 Generated contact ID: "${ghlContactId}"`);
      } else {
        ghlContactId = ghlContactId.trim();
        console.log(`📋 Using provided contact ID: "${ghlContactId}"`);
      }
      
      // Final safety check - ensure ghlContactId is never empty
      ghlContactId = ghlContactId || `emergency_contact_${Date.now()}`;
      
      console.log(`✅ Generating token with type: ${normalizedTokenType}, contact: ${ghlContactId}`);
      
      // Generate the access token - this should never fail
      const accessToken = await storage.generateAccessToken(normalizedTokenType, ghlContactId);
      
      console.log(`🎯 Token generated: ${accessToken.token.substring(0, 20)}...`);
      
      // Build response - always successful
      const response = {
        token: accessToken.token,
        type: accessToken.type,
        expiresAt: accessToken.expiresAt,
        assessmentUrl: `${req.protocol}://${req.get('host')}/assessment/${normalizedTokenType}?token=${accessToken.token}`
      };
      
      console.log("📤 SUCCESS Response:", JSON.stringify(response, null, 2));
      
      res.json(response);
    } catch (error) {
      console.error("❌ Error generating access token:", error);
      
      // Even if there's an error, try to provide a fallback response
      // This ensures GHL webhook never fails completely
      try {
        const fallbackResponse = {
          token: `fallback_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
          type: 'growth',
          expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
          assessmentUrl: `${req.protocol}://${req.get('host')}/assessment/growth?token=fallback_${Date.now()}`
        };
        
        console.log("🔄 Sending fallback response:", JSON.stringify(fallbackResponse, null, 2));
        res.json(fallbackResponse);
      } catch (fallbackError) {
        console.error("❌ Fallback also failed:", fallbackError);
        res.status(500).json({ error: "Failed to generate access token" });
      }
    }
  });

  // Token validation endpoint
  app.post("/api/validate-token", async (req, res) => {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({ valid: false, error: "Token is required" });
      }
      
      const accessToken = await storage.validateAccessToken(token);
      
      if (!accessToken) {
        return res.status(401).json({ valid: false, error: "Invalid or expired token" });
      }
      
      res.json({
        valid: true,
        type: accessToken.type,
        expiresAt: accessToken.expiresAt,
        ghlContactId: accessToken.ghlContactId
      });
    } catch (error) {
      console.error("Error validating token:", error);
      res.status(500).json({ valid: false, error: "Failed to validate token" });
    }
  });

  // Register assessment access routes
  registerAssessmentAccessRoutes(app);

  const httpServer = createServer(app);
  return httpServer;
}
