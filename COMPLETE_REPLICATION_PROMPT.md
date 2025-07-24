# Apple Bites Business Valuation Platform - Complete Replication Prompt

## 🎯 Project Overview

Build a professional business valuation platform that provides comprehensive company valuations through a multi-step assessment process. The platform generates AI-powered reports, integrates with CRM systems, and includes admin/team management capabilities.

## 📋 Core Business Requirements

### Primary Function
- **Multi-Tier Business Valuation Platform**: Complete assessment system with Free, Growth ($795), and Capital tiers
- **AI-Powered Analysis**: Advanced OpenAI GPT-4o integration for personalized business coaching and recommendations
- **Industry-Specific Valuation**: Authentic NAICS database with 2,000+ industry classifications and specific multipliers
- **Results Dashboards**: Comprehensive valuation results with industry analysis and recommendations
- **Value Improvement Calculator**: Interactive tool allowing users to see how improving specific business areas affects valuation
- **Tier-Based Access Control**: Purchase verification system ensuring users only access features they've paid for
- **CRM Integration**: GoHighLevel webhook system for automated lead processing and follow-up workflows

### Target Users
- **Business Owners**: Seeking company valuations for sale preparation, growth planning, or strategic decisions
- **Financial Advisors**: Providing comprehensive valuation services to clients with industry-specific analysis
- **M&A Professionals**: Conducting detailed business assessments with AI-powered insights
- **Investment Banks**: Preliminary valuations with executive-grade reporting capabilities

## 🏗️ System Architecture

### Technology Stack
```
Frontend: React 18 + TypeScript + Vite
UI Framework: Material-UI + Tailwind CSS
Backend: Node.js + Express + TypeScript
Database: PostgreSQL + Drizzle ORM
Authentication: Session-based with bcrypt
External APIs: OpenAI, SendGrid, GoHighLevel
PDF Generation: Puppeteer
```

### Project Structure
```
├── client/src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Route components
│   ├── hooks/              # Custom React hooks
│   └── lib/                # Utilities and configuration
├── server/
│   ├── core/               # Business logic modules
│   ├── services/           # External service integrations
│   ├── config/            # Configuration and data files
│   └── routes.ts          # API endpoints
├── shared/
│   └── schema.ts          # Database schema and types
└── assets/                # Static files and logos
```

## 📊 Database Schema

### Core Tables

```sql
-- Users with multi-tier access and purchase tracking
CREATE TABLE users (
  id VARCHAR PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  first_name VARCHAR,
  last_name VARCHAR,
  password_hash VARCHAR,
  tier TEXT DEFAULT 'free',    -- 'free', 'growth', 'capital'
  auth_provider TEXT DEFAULT 'custom',  -- 'custom', 'google', 'replit'
  result_ready BOOLEAN DEFAULT false,
  awaiting_password_creation BOOLEAN DEFAULT false,
  ghl_contact_id TEXT,         -- GoHighLevel CRM integration
  purchase_date TIMESTAMP,     -- Tier purchase tracking
  is_active BOOLEAN DEFAULT true,
  metadata JSONB,              -- Additional user data
  created_at TIMESTAMP DEFAULT NOW()
);

-- Complete valuation assessments
CREATE TABLE valuation_assessments (
  id SERIAL PRIMARY KEY,
  
  -- Contact Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT NOT NULL,
  job_title TEXT,
  
  -- Financial Data (EBITDA Components)
  net_income DECIMAL(15,2) NOT NULL,
  interest DECIMAL(15,2) NOT NULL,
  taxes DECIMAL(15,2) NOT NULL,
  depreciation DECIMAL(15,2) NOT NULL,
  amortization DECIMAL(15,2) NOT NULL,
  
  -- Owner Adjustments
  owner_salary DECIMAL(15,2) DEFAULT 0,
  personal_expenses DECIMAL(15,2) DEFAULT 0,
  one_time_expenses DECIMAL(15,2) DEFAULT 0,
  other_adjustments DECIMAL(15,2) DEFAULT 0,
  
  -- Value Driver Scores (A-F grades)
  financial_performance TEXT NOT NULL,
  customer_concentration TEXT NOT NULL,
  management_team TEXT NOT NULL,
  competitive_position TEXT NOT NULL,
  growth_prospects TEXT NOT NULL,
  systems_processes TEXT NOT NULL,
  asset_quality TEXT NOT NULL,
  industry_outlook TEXT NOT NULL,
  risk_factors TEXT NOT NULL,
  owner_dependency TEXT NOT NULL,
  
  -- Calculated Results
  base_ebitda DECIMAL(15,2),
  adjusted_ebitda DECIMAL(15,2),
  valuation_multiple DECIMAL(8,2),
  low_estimate DECIMAL(15,2),
  mid_estimate DECIMAL(15,2),
  high_estimate DECIMAL(15,2),
  overall_score TEXT,
  
  -- Industry Classification (Enhanced for Paid Tier)
  naics_code TEXT,
  sic_code TEXT,               -- SIC code for additional classification
  industry_description TEXT,
  business_model TEXT,         -- Business model description
  competitive_advantage TEXT,  -- Competitive positioning
  founding_year INTEGER,       -- Company founding year
  
  -- Follow-up
  follow_up_intent TEXT NOT NULL,    -- 'yes', 'maybe', 'no'
  additional_comments TEXT,
  
  -- AI Generated Content (Tier-Specific)
  executive_summary TEXT,      -- Basic for free, comprehensive for paid
  improvement_recommendations TEXT,
  ai_coaching_insights TEXT,   -- Advanced AI coaching (paid tier only)
  strategic_analysis TEXT,     -- Strategic recommendations (paid tier only)
  industry_benchmarks JSONB,   -- Industry comparison data (paid tier only)
  
  -- Processing and Tier Management
  assessment_tier TEXT DEFAULT 'free',  -- 'free', 'growth', 'capital'
  is_processed BOOLEAN DEFAULT false,
  results_url TEXT,                    -- URL to results dashboard
  dashboard_tier TEXT DEFAULT 'basic', -- 'basic', 'professional', 'executive'
  purchase_verified BOOLEAN DEFAULT false, -- Verified tier purchase status
  access_expires_at TIMESTAMP,        -- Expiration for paid access (if applicable)
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Lead management and CRM integration
CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  company TEXT NOT NULL,
  
  lead_status TEXT DEFAULT 'new',     -- 'new', 'contacted', 'qualified', 'converted'
  lead_score INTEGER DEFAULT 0,      -- 0-100 scoring
  follow_up_intent TEXT,
  
  valuation_assessment_id INTEGER,
  estimated_value DECIMAL(12,2),
  
  -- CRM Integration
  crm_id TEXT,
  last_crm_sync TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🔄 Complete User Flow

### 1. Landing & Authentication
```
Landing Page (/) 
    ↓
Login/Register (/login, /signup)
    ↓
User Dashboard (/dashboard)
```

### 2. Assessment Process (Tier-Based Flow)

#### Free Tier Assessment (Basic)
```
Dashboard → Start Free Assessment
    ↓
Step 1: Contact Information
    - First/Last Name, Email, Phone
    - Company Name, Job Title
    ↓
Step 2: Financial Data (EBITDA Components)
    - Net Income, Interest, Taxes
    - Depreciation, Amortization
    ↓
Step 3: Owner Adjustments
    - Owner Salary, Personal Expenses
    - One-Time Expenses, Other Adjustments
    ↓
Step 4: Value Drivers Assessment (A-F Grades)
    - 10 key business factors
    ↓
Step 5: Follow-Up Preferences
    ↓
Results Page (Basic)
    - General valuation range
    - Basic business grade
    - Basic results dashboard
    - "Explore Value Improvements" button (leads to calculator)
    - Upgrade prompts
```

#### Growth & Exit Assessment ($795) - Premium Flow
```
Dashboard → Start Growth Assessment
    ↓
Step 1: Contact Information
    - Enhanced contact capture
    - Company details and role
    ↓
Step 2: Industry Classification
    - NAICS Code Selection (2,000+ options)
    - Industry Description
    - Business Model Analysis
    - Competitive Advantage Assessment
    - Company Founding Year
    ↓
Step 3: Financial Data (Enhanced)
    - Detailed EBITDA components
    - Revenue trends analysis
    - Margin analysis
    ↓
Step 4: Advanced Owner Adjustments
    - Market-rate salary comparisons
    - Normalized expense analysis
    - One-time event impacts
    ↓
Step 5: Comprehensive Value Drivers (A-F Grades)
    - Financial Performance
    - Customer Concentration Risk
    - Management Team Strength
    - Competitive Position
    - Growth Prospects
    - Systems & Processes
    - Asset Quality
    - Industry Outlook
    - Risk Factors
    - Owner Dependency
    ↓
Step 6: Strategic Assessment
    - Growth strategy evaluation
    - Exit readiness analysis
    - Market positioning
    ↓
Results Page (Premium)
    - Industry-specific valuation ranges
    - NAICS multiplier analysis
    - AI-powered business coaching
    - Executive summary with action plan
    - Industry benchmarking charts
    - Comprehensive results dashboard
    - Value Improvement Calculator (full access)
    - Strategic recommendations
    - Follow-up consultation booking
```

### 3. Tier Selection & Pricing Integration
```
Homepage → Tier Selection
    ↓
Free Tier (Apple Bites Assessment)
    - 5-step basic assessment (always accessible)
    - General multipliers (no industry-specific)
    - Basic results dashboard with upgrade prompts
    - Limited AI summary (basic insights only)
    - Basic Value Calculator access (view only, no scenario saving)
    - Lead capture and CRM integration
    - Clear upgrade paths to Growth tier
    
Growth Tier ($795) - "Growth & Exit Assessment" 
    - 6-step comprehensive assessment (purchase verified)
    - Industry-specific NAICS multipliers (authenticated access)
    - AI-powered business coaching (full GPT-4o integration)
    - Executive summary & action plan (professional grade)
    - Professional results dashboard (enhanced features)
    - Industry benchmarking charts (full data access)
    - Value Improvement Calculator with scenario planning and saving
    - Strategic recommendations (comprehensive analysis)
    - Priority CRM processing and follow-up automation
    - Access valid for 1 year from purchase date
    
Capital Tier ($2,495) - "Capital Readiness Assessment"
    - Complete investment readiness analysis
    - Institutional investor perspective
    - Due diligence preparation
    - Market comparables analysis
    - Investment memorandum template
    - Executive presentations
    - Direct advisor consultation
```

### 4. Admin/Team Management
```
Team Login (/team/login)
    ↓
Team Dashboard (/team/dashboard)
    - Lead management with tier tracking
    - Assessment analytics by tier
    - Revenue reporting
    - User tier management
    - A/B testing capabilities  
    - Report generation
    - CRM integration monitoring
```

## 🧮 Core Business Logic

### Tier-Based Valuation Engine

#### Free Tier Calculation (Basic)
```typescript
// Basic valuation with general multipliers
function calculateFreeValuation(formData) {
  // 1. Calculate Base EBITDA
  const baseEbitda = netIncome + interest + taxes + depreciation + amortization;
  
  // 2. Calculate Adjusted EBITDA
  const adjustedEbitda = baseEbitda + ownerSalary + personalExpenses + oneTimeExpenses;
  
  // 3. Grade to Multiplier (Generic)
  const gradeMultipliers = {
    'A': 6.0,  'B': 5.0,  'C': 4.0,  'D': 3.0,  'F': 2.0
  };
  
  // 4. Simple average multiplier
  const avgGrade = calculateAverageGrade(valueDrivers);
  const multiplier = gradeMultipliers[avgGrade];
  
  // 5. Basic valuation range (±20%)
  const midEstimate = adjustedEbitda * multiplier;
  const lowEstimate = midEstimate * 0.8;
  const highEstimate = midEstimate * 1.2;
  
  return { baseEbitda, adjustedEbitda, multiplier, lowEstimate, midEstimate, highEstimate, overallGrade: avgGrade };
}
```

#### Growth Tier Calculation (Advanced)
```typescript
// Industry-specific valuation with NAICS multipliers
function calculateGrowthValuation(formData, naicsData) {
  // 1. Enhanced EBITDA calculation
  const baseEbitda = calculateEnhancedEbitda(formData);
  const adjustedEbitda = calculateNormalizedEbitda(baseEbitda, formData.adjustments);
  
  // 2. Industry-Specific Base Multipliers
  const industryMultipliers = getNAICSMultipliers(formData.naicsCode);
  // Returns: { min: 2.1, avg: 4.2, max: 6.8, riskLevel: 'medium', growthOutlook: 'good' }
  
  // 3. Value Driver Analysis with Weighted Scoring
  const valueDriverWeights = {
    financialPerformance: 0.20,    // 20% weight
    customerConcentration: 0.15,   // 15% weight
    managementTeam: 0.15,          // 15% weight
    competitivePosition: 0.12,     // 12% weight
    growthProspects: 0.12,         // 12% weight
    systemsProcesses: 0.10,        // 10% weight
    assetQuality: 0.08,            // 8% weight
    industryOutlook: 0.08          // 8% weight
  };
  
  // 4. Calculate Weighted Grade Score
  const weightedScore = calculateWeightedGradeScore(valueDrivers, valueDriverWeights);
  
  // 5. Grade Modifier Application
  const gradeModifier = getGradeModifier(weightedScore);
  // A=1.25, B=1.10, C=1.00, D=0.85, F=0.70
  
  // 6. Risk and Growth Adjustments
  const riskAdjustment = getRiskAdjustment(industryMultipliers.riskLevel, formData);
  const growthAdjustment = getGrowthAdjustment(industryMultipliers.growthOutlook, formData);
  
  // 7. Final Industry-Adjusted Multipliers
  const finalMultipliers = {
    low: industryMultipliers.min * gradeModifier * riskAdjustment,
    mid: industryMultipliers.avg * gradeModifier * (riskAdjustment + growthAdjustment) / 2,
    high: industryMultipliers.max * gradeModifier * growthAdjustment
  };
  
  // 8. Sophisticated Valuation Range
  const lowEstimate = adjustedEbitda * finalMultipliers.low;
  const midEstimate = adjustedEbitda * finalMultipliers.mid;
  const highEstimate = adjustedEbitda * finalMultipliers.high;
  
  return {
    baseEbitda,
    adjustedEbitda,
    industryMultipliers,
    finalMultipliers,
    lowEstimate,
    midEstimate,
    highEstimate,
    weightedScore,
    overallGrade: scoreToGrade(weightedScore),
    industryAnalysis: generateIndustryAnalysis(naicsData),
    riskFactors: identifyRiskFactors(formData, industryMultipliers)
  };
}
```

### Comprehensive NAICS Industry Database

#### Database Structure (2,075+ Classifications)
```typescript
interface NAICSEntry {
  code: string;              // 6-digit NAICS code
  title: string;             // Industry description
  minMultiplier: number;     // Conservative valuation multiple
  avgMultiplier: number;     // Market average multiple
  maxMultiplier: number;     // Premium valuation multiple
  riskLevel: 'low' | 'medium' | 'high';
  growthOutlook: 'declining' | 'stable' | 'good' | 'excellent';
  sector: string;            // Primary sector classification
  marketTrends: string[];    // Current market trends
  typicalMargins: {          // Industry financial benchmarks
    grossMargin: number;
    operatingMargin: number;
    netMargin: number;
  };
}

// Sample High-Value Industries
const naicsDatabase = {
  "541511": {  // Custom Computer Programming Services
    title: "Custom Computer Programming Services",
    minMultiplier: 4.2,
    avgMultiplier: 7.8,
    maxMultiplier: 15.2,
    riskLevel: "medium",
    growthOutlook: "excellent",
    sector: "Technology",
    marketTrends: ["AI Integration", "Cloud Migration", "Digital Transformation"],
    typicalMargins: { grossMargin: 0.75, operatingMargin: 0.15, netMargin: 0.12 }
  },
  "621111": {  // Offices of Physicians (except Mental Health)
    title: "Physicians' Offices",
    minMultiplier: 3.8,
    avgMultiplier: 5.2,
    maxMultiplier: 7.1,
    riskLevel: "low",
    growthOutlook: "good",
    sector: "Healthcare",
    marketTrends: ["Telehealth Growth", "Value-Based Care", "Consolidation"],
    typicalMargins: { grossMargin: 0.65, operatingMargin: 0.18, netMargin: 0.14 }
  },
  "722511": {  // Full-Service Restaurants
    title: "Full-Service Restaurants",
    minMultiplier: 1.5,
    avgMultiplier: 2.8,
    maxMultiplier: 4.2,
    riskLevel: "high",
    growthOutlook: "stable",
    sector: "Food Service",
    marketTrends: ["Delivery Integration", "Labor Shortages", "Technology Adoption"],
    typicalMargins: { grossMargin: 0.32, operatingMargin: 0.08, netMargin: 0.05 }
  },
  "531210": {  // Offices of Real Estate Agents and Brokers
    title: "Real Estate Brokerage",
    minMultiplier: 2.1,
    avgMultiplier: 3.5,
    maxMultiplier: 5.8,
    riskLevel: "medium",
    growthOutlook: "stable",
    sector: "Real Estate",
    marketTrends: ["Digital Platforms", "Market Volatility", "Commission Pressure"],
    typicalMargins: { grossMargin: 0.28, operatingMargin: 0.12, netMargin: 0.08 }
  }
  // ... 2,071+ more authentic industry classifications
};

// Industry Risk Assessment
function assessIndustryRisk(naicsCode: string, formData: any): number {
  const industry = naicsDatabase[naicsCode];
  let riskScore = 1.0;
  
  // Base risk by industry
  switch (industry.riskLevel) {
    case 'low': riskScore *= 1.05; break;
    case 'medium': riskScore *= 1.0; break;
    case 'high': riskScore *= 0.92; break;
  }
  
  // Growth outlook adjustment
  switch (industry.growthOutlook) {
    case 'declining': riskScore *= 0.85; break;
    case 'stable': riskScore *= 1.0; break;
    case 'good': riskScore *= 1.08; break;
    case 'excellent': riskScore *= 1.15; break;
  }
  
  return riskScore;
}
```

## 🎨 UI/UX Requirements

### Design System & Branding
- **Color Palette**: 
  - Primary Navy: #0b2147 (Apple Bites brand)
  - Secondary Teal: #81e5d8 (accent color)
  - Success Green: #10b981 (positive metrics)
  - Warning Orange: #f59e0b (upgrade prompts)
  - Professional Grays: #f8fafc, #e2e8f0, #64748b
- **Typography**: 
  - Headings: Montserrat (weights: 400, 600, 700)
  - Body: Manrope (weights: 400, 500, 600)
- **Components**: Material-UI v5 with extensive custom theming
- **Layout**: Executive-grade responsive design with mobile-first approach
- **Brand Assets**: Apple Bites logo variants (metallic apple with money design)

### Tier-Specific UI Elements
- **Free Tier**: Basic styling, upgrade prompts, limited features visible
- **Growth Tier**: Premium styling, expanded features, professional reports
- **Capital Tier**: Executive styling, white-glove experience, concierge features

### Key UI Components Needed

#### 1. Multi-Step Form with Progress Indicator
```tsx
// Vertical sidebar with:
- Brand logo at top
- Progress steps with icons
- Current step highlighting
- Completion indicators
- Professional styling
```

#### 2. Assessment Forms (5 separate components)
```tsx
ContactForm         // Contact information capture
EbitdaForm         // Financial data input with validation
AdjustmentsForm    // Owner adjustment entries
ValueDriversForm   // A-F grade selection interface
FollowUpForm       // Follow-up preferences
```

#### 3. Results Visualization
```tsx
ValuationResults   // Valuation range display
GradeGauge        // Overall grade visualization
IndustryChart     // Industry comparison charts
```

#### 4. Admin Dashboard Components
```tsx
LeadsTable        // Lead management with tier filtering
AnalyticsCharts   // Revenue analytics by tier
UserManagement    // Team member administration
TierMetrics       // Conversion tracking across tiers
RevenueReporting  // Financial performance dashboard
A/BTestingPanel   // Conversion optimization tools
```

#### 5. Tier-Specific Components
```tsx
TierSelection     // Homepage tier comparison and selection
UpgradePrompts    // Strategic upgrade messaging throughout free experience
PremiumFeatures   // Growth/Capital tier exclusive features
AICoachingPanel   // Interactive AI business coaching interface
IndustryCharts    // NAICS-specific benchmarking visualizations
```

## 🔌 External Integrations

### 1. Advanced OpenAI Integration (Tier-Specific AI Analysis)

#### Free Tier - Basic AI Analysis
```typescript
const generateBasicAnalysis = async (assessmentData) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{
      role: "system",
      content: "You are a business analyst providing basic valuation insights. Keep responses concise and general."
    }, {
      role: "user",
      content: `Basic business assessment: ${JSON.stringify(assessmentData)}`
    }]
  });
  return response.choices[0].message.content;
};
```

#### Growth Tier - Comprehensive AI Coaching
```typescript
const generateAdvancedCoaching = async (assessmentData, industryData) => {
  const systemPrompt = `You are a senior M&A advisor and business strategist with 20+ years of experience. 
  Provide comprehensive business coaching based on the assessment data and industry benchmarks.
  
  Focus on:
  1. Strategic value improvement opportunities
  2. Industry-specific growth strategies  
  3. Exit readiness analysis
  4. Competitive positioning advice
  5. Risk mitigation strategies
  6. Financial optimization recommendations
  7. Market timing considerations
  8. Actionable 90-day improvement plan
  
  Use industry data: ${JSON.stringify(industryData)}`;
  
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.7,
    max_tokens: 2500,
    messages: [{
      role: "system",
      content: systemPrompt
    }, {
      role: "user",
      content: `Comprehensive assessment data: ${JSON.stringify(assessmentData)}`
    }]
  });
  
  return {
    executiveSummary: extractExecutiveSummary(response.choices[0].message.content),
    strategicRecommendations: extractStrategicRecommendations(response.choices[0].message.content),
    actionPlan: extractActionPlan(response.choices[0].message.content),
    riskAnalysis: extractRiskAnalysis(response.choices[0].message.content),
    industryInsights: generateIndustryInsights(assessmentData, industryData)
  };
};

// AI Coaching Feature (Growth Tier Exclusive)
const generatePersonalizedCoaching = async (assessmentData, specificFocus) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{
      role: "system",
      content: `You are a business coach specializing in ${specificFocus}. 
      Provide specific, actionable advice for this business owner.`
    }, {
      role: "user",
      content: `Business context: ${JSON.stringify(assessmentData)}. 
      Focus area: ${specificFocus}. 
      Provide 5 specific action items with expected impact and timeline.`
    }]
  });
  return response.choices[0].message.content;
};
```

### 2. Results Dashboard Generation
```typescript
// Generate comprehensive results dashboard
const generateResultsDashboard = async (assessment) => {
  const dashboardData = {
    valuation: calculateValuationMetrics(assessment),
    industryAnalysis: getIndustryAnalysis(assessment.naicsCode),
    recommendations: await generateAIRecommendations(assessment),
    benchmarks: getIndustryBenchmarks(assessment.naicsCode),
    improvements: identifyImprovementAreas(assessment)
  };
  
  return dashboardData;
};

// Save results to database for dashboard access
const saveResultsDashboard = async (assessmentId, dashboardData) => {
  await storage.updateAssessment(assessmentId, {
    resultsData: JSON.stringify(dashboardData),
    isProcessed: true,
    resultsUrl: `/results/${assessmentId}`
  });
};
```

### 3. Value Improvement Calculator
```typescript
// Interactive calculator for exploring valuation improvements
const ValueImprovementCalculator = {
  // Load user's assessment data
  loadAssessmentData: async (assessmentId: string) => {
    const assessment = await storage.getAssessment(assessmentId);
    return {
      currentScores: assessment.valueDriverScores,
      currentValuation: assessment.calculatedValuation,
      industryMultiplier: assessment.industryMultiplier
    };
  },

  // Calculate potential improvements
  calculatePotentialGain: (currentScores, improvedScores, industryData) => {
    const currentMultiplier = calculateValueDriverMultiplier(currentScores);
    const improvedMultiplier = calculateValueDriverMultiplier(improvedScores);
    
    const currentValuation = baseEbitda * industryData.baseMultiplier * currentMultiplier;
    const improvedValuation = baseEbitda * industryData.baseMultiplier * improvedMultiplier;
    
    return {
      potentialGain: improvedValuation - currentValuation,
      percentageIncrease: ((improvedValuation / currentValuation) - 1) * 100,
      newValuation: improvedValuation
    };
  },

  // Interactive grade adjustment interface
  renderGradeSelector: (valueDriver, currentGrade, onGradeChange) => (
    <InteractiveGradeSlider
      valueDriver={valueDriver}
      currentGrade={currentGrade}
      onChange={(newGrade) => {
        onGradeChange(valueDriver, newGrade);
        updatePotentialGain();
      }}
    />
  )
};
```

### 4. Tier-Based Access Control System
```typescript
// Purchase verification and access control
const AccessControlSystem = {
  // Verify user's tier access
  verifyTierAccess: async (userId: string, requiredTier: 'free' | 'growth' | 'capital') => {
    const user = await storage.getUser(userId);
    
    if (!user) return { hasAccess: false, reason: 'User not found' };
    
    // Free tier always has access to free features
    if (requiredTier === 'free') return { hasAccess: true };
    
    // Check if user has purchased required tier
    const tierHierarchy = { free: 0, growth: 1, capital: 2 };
    const userTierLevel = tierHierarchy[user.tier];
    const requiredTierLevel = tierHierarchy[requiredTier];
    
    if (userTierLevel >= requiredTierLevel) {
      // Verify purchase is still valid (not expired)
      const isValidPurchase = await verifyPurchaseStatus(user.ghlContactId, user.tier);
      return { 
        hasAccess: isValidPurchase,
        reason: isValidPurchase ? null : 'Purchase expired or invalid'
      };
    }
    
    return { 
      hasAccess: false, 
      reason: `Requires ${requiredTier} tier or higher. Current tier: ${user.tier}`,
      upgradeUrl: `https://products.applebites.ai/product-details/product/${getProductId(requiredTier)}`
    };
  },

  // Middleware for protecting routes
  requireTier: (tier: string) => {
    return async (req, res, next) => {
      const userId = req.session?.user?.id;
      if (!userId) return res.status(401).json({ error: 'Authentication required' });
      
      const access = await AccessControlSystem.verifyTierAccess(userId, tier);
      if (!access.hasAccess) {
        return res.status(403).json({ 
          error: 'Access denied',
          reason: access.reason,
          upgradeUrl: access.upgradeUrl,
          requiredTier: tier
        });
      }
      
      next();
    };
  },

  // Feature-specific access checks
  canAccessFeature: async (userId: string, feature: string) => {
    const featureRequirements = {
      'basic_assessment': 'free',
      'industry_analysis': 'growth',
      'ai_coaching': 'growth',
      'value_calculator': 'free',  // Basic access
      'value_calculator_advanced': 'growth',  // Scenario saving
      'executive_reports': 'capital',
      'team_management': 'capital'
    };
    
    const requiredTier = featureRequirements[feature];
    if (!requiredTier) return { hasAccess: false, reason: 'Unknown feature' };
    
    return await AccessControlSystem.verifyTierAccess(userId, requiredTier);
  }
};

// Purchase verification with GoHighLevel
const verifyPurchaseStatus = async (ghlContactId: string, tier: string) => {
  try {
    const response = await fetch(`${GHL_API_URL}/contacts/${ghlContactId}`, {
      headers: { 'Authorization': `Bearer ${GHL_API_KEY}` }
    });
    
    const contact = await response.json();
    
    // Check for purchase tags or custom fields
    const purchaseTags = {
      'growth': 'Apple Bites Growth Purchase',
      'capital': 'Apple Bites Capital Purchase'
    };
    
    const hasPurchaseTag = contact.tags?.includes(purchaseTags[tier]);
    const purchaseDate = contact.customFields?.['purchase_date'];
    
    // Verify purchase is recent and valid
    if (hasPurchaseTag && purchaseDate) {
      const daysSincePurchase = (Date.now() - new Date(purchaseDate).getTime()) / (1000 * 60 * 60 * 24);
      return daysSincePurchase <= 365; // Valid for 1 year
    }
    
    return false;
  } catch (error) {
    console.error('Purchase verification failed:', error);
    return false; // Fail secure - deny access if verification fails
  }
};
```

### 5. GoHighLevel CRM Integration
```typescript
// Process leads in CRM system
const processLead = async (assessmentData) => {
  const contactData = {
    firstName: assessmentData.firstName,
    lastName: assessmentData.lastName,
    email: assessmentData.email,
    phone: assessmentData.phone,
    customFields: {
      company: assessmentData.company,
      estimatedValue: assessmentData.midEstimate,
      followUpIntent: assessmentData.followUpIntent
    }
  };
  
  await goHighLevelAPI.createContact(contactData);
}
```

## 📋 API Endpoints

### Assessment Processing
```
POST /api/valuation              # Submit complete assessment
GET  /api/assessments/:id        # Retrieve assessment
GET  /api/results/:id           # Get results dashboard data
POST /api/assessments/:id/process # Process assessment and generate results
GET  /api/value-calculator/:id  # Access value improvement calculator
POST /api/value-calculator/:id/calculate # Calculate potential improvements

# Tier-Based Access Control
GET  /api/user/tier-status      # Check user's current tier and access
POST /api/user/verify-purchase  # Verify purchase status with CRM
GET  /api/features/access-check # Check access to specific features
```

### User Management  
```
POST /api/auth/register          # User registration
POST /api/auth/login            # User authentication
GET  /api/auth/user             # Get current user
POST /api/auth/logout           # User logout
```

### Admin/Analytics
```
GET  /api/analytics/assessments  # Assessment analytics
GET  /api/analytics/leads       # Lead management data
POST /api/webhooks/gohighlevel  # Webhook processing
```

## 🔒 Security & Validation

### Input Validation
- Zod schemas for all form inputs
- Sanitization of financial data
- Email format validation
- Phone number formatting
- SQL injection prevention

### Authentication
- bcrypt password hashing (12 rounds)
- Session-based authentication
- Role-based access control
- CSRF protection

### Business Logic Validation
- Financial data reasonableness checks
- Grade validation (A-F only)
- EBITDA calculation accuracy
- Industry multiplier bounds checking

## 🚀 Deployment Requirements

### Environment Variables
```
# Database
DATABASE_URL=postgresql://...

# External Services  
OPENAI_API_KEY=sk-...                    # GPT-4o for AI coaching
GHL_API_KEY=...                          # GoHighLevel CRM
GHL_LOCATION_ID=...                      # GHL location ID

# Tier-Specific Webhook URLs
GHL_WEBHOOK_FREE_RESULTS=https://...     # Free tier completions
GHL_WEBHOOK_GROWTH_PURCHASE=https://...  # Growth tier purchases  
GHL_WEBHOOK_GROWTH_RESULTS=https://...   # Growth tier completions
GHL_WEBHOOK_CAPITAL_PURCHASE=https://... # Capital tier purchases
GHL_WEBHOOK_CAPITAL_RESULTS=https://...  # Capital tier completions

# Session Security
SESSION_SECRET=...                       # Session encryption key
JWT_SECRET=...                          # JWT token signing

# Payment Integration (if applicable)
STRIPE_SECRET_KEY=sk_...                # Stripe payments
STRIPE_WEBHOOK_SECRET=whsec_...         # Stripe webhook verification

# Domain Configuration
REPLIT_DOMAINS=applebites.ai            # Production domain
```

### Performance Requirements
- Assessment completion: < 5 minutes
- PDF generation: < 30 seconds  
- Page load times: < 3 seconds
- Database queries: < 500ms average
- Concurrent users: 100+ supported

## 📈 Success Metrics

### User Experience
- Assessment completion rate > 80%
- User satisfaction score > 4.5/5
- Time to complete assessment < 10 minutes
- Mobile responsiveness across all devices

### Business Metrics
- Lead conversion rate tracking
- Follow-up intent correlation
- Industry-specific conversion analysis
- PDF download and email open rates

## 🔧 Development Guidelines

### Code Quality
- TypeScript strict mode
- ESLint + Prettier configuration
- Comprehensive error handling
- Unit tests for business logic
- API endpoint testing

### Performance Optimization
- Database indexing on frequently queried fields
- Caching for NAICS database lookups
- Image optimization for logos/assets
- Bundle size optimization

### Scalability Considerations
- Database connection pooling
- Rate limiting on API endpoints
- Horizontal scaling capability
- CDN for static assets

---

## 🎯 Implementation Priority

### Phase 1 (Foundation)
1. Database schema with tier support
2. User authentication and tier-based access control system
3. Purchase verification integration with GoHighLevel
4. Free tier assessment (5-step basic flow) with access restrictions
5. Basic valuation calculation engine
6. Simple results dashboard display with tier-appropriate features

### Phase 2 (Growth Tier Implementation) 
1. Industry classification system (NAICS database)
2. Advanced 6-step assessment flow with tier verification
3. AI-powered coaching integration (Growth tier only)
4. Industry-specific valuation calculations with purchase verification
5. Professional results dashboards with industry analysis
6. Value Improvement Calculator with interactive grade adjustment
7. Enhanced CRM integration and purchase status monitoring
8. Upgrade prompts and tier-based feature gates

### Phase 3 (Premium Features)
1. Comprehensive admin dashboard
2. GoHighLevel CRM integration 
3. Lead scoring and management system
4. Analytics and revenue reporting
5. A/B testing capabilities
6. Performance optimization

### Phase 4 (Capital Tier - Future)
1. Investment readiness assessment
2. Institutional investor analysis
3. Due diligence preparation tools
4. Market comparables database
5. Executive presentation templates
6. Direct advisor consultation booking

This comprehensive specification provides everything needed to replicate the Apple Bites Business Valuation Platform with clean architecture, no design issues, and clearly defined user flows.