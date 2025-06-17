import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertValuationAssessmentSchema, type ValuationAssessment, loginSchema, insertTeamMemberSchema, type LoginCredentials, type InsertTeamMember, type TeamMember } from "@shared/schema";
import { generateValuationNarrative, type ValuationAnalysisInput } from "./openai";
import { generateValuationPDF } from "./pdf-generator";
import { emailService } from "./email-service";
import { goHighLevelService } from "./gohighlevel-service";
import { getMultiplierForGrade, getLabelForGrade, scoreToGrade } from "./config/multiplierScale";
import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';

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
        return res.status(401).json({ error: 'Session expired' });
      }

      const teamMember = await storage.getTeamMemberById(session.teamMemberId!);
      if (!teamMember || !teamMember.isActive) {
        return res.status(401).json({ error: 'Account inactive' });
      }

      req.user = teamMember;
      return next();
    } catch (error) {
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
      parseFloat(formData.ebitda.ownerSalary || "0") +
      parseFloat(formData.ebitda.personalExpenses || "0") +
      parseFloat(formData.ebitda.oneTimeExpenses || "0") +
      parseFloat(formData.ebitda.otherAdjustments || "0");

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
        ]);
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
        
        // Call the summary API internally
        const summaryResponse = await fetch('http://localhost:5000/api/generate-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            companyName: assessment.company,
            adjustedEBITDA: metrics.adjustedEbitda,
            valuationEstimate: metrics.midEstimate,
            driverScores: driverScores,
            followUpIntent: assessment.followUpIntent
          })
        });
        
        let executiveSummary = '';
        if (summaryResponse.ok) {
          const summaryData = await summaryResponse.json();
          executiveSummary = summaryData.summary;
        } else {
          const gradeLabel = getLabelForGrade(metrics.overallScore);
          executiveSummary = `Executive Summary: ${assessment.company} shows an adjusted EBITDA of $${metrics.adjustedEbitda.toLocaleString()} with an estimated valuation of $${metrics.midEstimate.toLocaleString()}. Based on your Operational Grade of ${metrics.overallScore} ("${gradeLabel}"), a multiplier of ${metrics.valuationMultiple}x was applied to your Adjusted EBITDA to generate the valuation estimate. The analysis indicates ${metrics.overallScore} overall performance across key business drivers.`;
        }
        
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
        
        const webhookResponse = await fetch('https://services.leadconnectorhq.com/hooks/QNFFrENaRuI2JhldFd0Z/webhook-trigger/dc1a8a7f-47ee-4c9a-b474-e1aeb21af3e3', {
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

      // Update password
      await storage.updateTeamMember(userId, { hashedPassword: hashedNewPassword });

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

  // PDF download endpoint
  app.get("/api/valuation/:id/download-pdf", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const assessment = await storage.getValuationAssessment(id);
      
      if (!assessment) {
        return res.status(404).json({ error: "Assessment not found" });
      }

      // Generate PDF on demand
      const { generateValuationPDF } = await import("./pdf-generator");
      const pdfBuffer = await generateValuationPDF(assessment);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${assessment.company || 'Business'}_Valuation_Report.pdf"`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ error: "Failed to generate PDF" });
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

  const httpServer = createServer(app);
  return httpServer;
}
