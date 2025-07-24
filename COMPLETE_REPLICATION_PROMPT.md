# Apple Bites Business Valuation Platform - Complete Replication Prompt

## 🎯 Project Overview

Build a professional business valuation platform that provides comprehensive company valuations through a multi-step assessment process. The platform generates AI-powered reports, integrates with CRM systems, and includes admin/team management capabilities.

## 📋 Core Business Requirements

### Primary Function
- **Business Valuation Calculator**: Multi-step assessment that calculates company values using EBITDA analysis, value driver scoring, and industry-specific multipliers
- **AI-Powered Analysis**: Generate executive summaries and business improvement recommendations
- **Professional PDF Reports**: Branded valuation reports with charts and detailed analysis
- **CRM Integration**: Automatic lead processing and follow-up workflows

### Target Users
- **Business Owners**: Seeking company valuations for sale preparation or strategic planning
- **Financial Advisors**: Providing valuation services to clients
- **M&A Professionals**: Conducting preliminary business assessments

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
-- Users with multi-tier access
CREATE TABLE users (
  id VARCHAR PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  first_name VARCHAR,
  last_name VARCHAR,
  password_hash VARCHAR,
  tier TEXT DEFAULT 'free',    -- 'free', 'growth', 'capital'
  is_active BOOLEAN DEFAULT true,
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
  
  -- Industry Classification
  naics_code TEXT,
  industry_description TEXT,
  
  -- Follow-up
  follow_up_intent TEXT NOT NULL,    -- 'yes', 'maybe', 'no'
  additional_comments TEXT,
  
  -- AI Generated Content
  executive_summary TEXT,
  improvement_recommendations TEXT,
  
  -- Processing
  is_processed BOOLEAN DEFAULT false,
  pdf_url TEXT,
  
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

### 2. Assessment Process (Core Flow)
```
Dashboard → Start Assessment
    ↓
Step 1: Contact Information
    - First/Last Name
    - Email, Phone
    - Company Name, Job Title
    ↓
Step 2: Financial Data (EBITDA Components)
    - Net Income
    - Interest Expense
    - Tax Expense  
    - Depreciation
    - Amortization
    ↓
Step 3: Owner Adjustments
    - Owner Salary Above Market Rate
    - Personal Expenses Through Business
    - One-Time Expenses
    - Other Adjustments
    ↓
Step 4: Value Drivers Assessment (A-F Grades)
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
Step 5: Follow-Up Preferences
    - Interest in consultation (yes/maybe/no)
    - Additional comments
    ↓
Results Page
    - Valuation range (low/mid/high estimates)
    - Overall business grade
    - AI-generated executive summary
    - Industry analysis
    - PDF report download
    - CRM lead processing
```

### 3. Admin/Team Management
```
Team Login (/team/login)
    ↓
Team Dashboard (/team/dashboard)
    - Lead management
    - Assessment analytics
    - User management
    - Report generation
```

## 🧮 Core Business Logic

### Valuation Calculation Engine

```typescript
// 1. Calculate Base EBITDA
baseEbitda = netIncome + interest + taxes + depreciation + amortization

// 2. Calculate Adjusted EBITDA  
adjustedEbitda = baseEbitda + ownerSalary + personalExpenses + oneTimeExpenses + otherAdjustments

// 3. Grade to Multiplier Conversion
const gradeMultipliers = {
  'A': 1.25,  // 25% premium
  'B': 1.10,  // 10% premium
  'C': 1.00,  // Baseline
  'D': 0.85,  // 15% discount
  'F': 0.70   // 30% discount
}

// 4. Calculate Weighted Average from Value Drivers
weightedMultiplier = average(all_value_driver_multipliers)

// 5. Industry-Specific Adjustment
industryMultipliers = getNAICSMultiplier(naicsCode) // {min, avg, max}
finalMultipliers = industryMultipliers * weightedMultiplier

// 6. Final Valuation Range
lowEstimate = adjustedEbitda * finalMultipliers.min
midEstimate = adjustedEbitda * finalMultipliers.avg  
highEstimate = adjustedEbitda * finalMultipliers.max

// 7. Overall Grade Determination
overallGrade = convertScoreToGrade(weightedMultiplier)
```

### NAICS Industry Database
Include 2,000+ industry classifications with specific multiplier ranges:
```typescript
const naicsDatabase = {
  "541511": {  // Custom Computer Programming
    title: "Custom Computer Programming Services",
    minMultiplier: 3.5,
    avgMultiplier: 6.8, 
    maxMultiplier: 12.0,
    riskLevel: "medium",
    growthOutlook: "excellent"
  },
  "722511": {  // Full-Service Restaurants
    title: "Full-Service Restaurants",
    minMultiplier: 1.2,
    avgMultiplier: 2.4,
    maxMultiplier: 3.8,
    riskLevel: "high", 
    growthOutlook: "stable"
  }
  // ... 2000+ more industries
}
```

## 🎨 UI/UX Requirements

### Design System
- **Color Palette**: Professional navy (#0b2147), teal accents (#81e5d8), clean whites/grays
- **Typography**: Montserrat for headings, Manrope for body text
- **Components**: Material-UI with custom branded styling
- **Layout**: Clean, professional, mobile-responsive

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
LeadsTable        // Lead management interface
AnalyticsCharts   // Assessment metrics and trends
UserManagement    // Team member administration
```

## 🔌 External Integrations

### 1. OpenAI Integration (AI Analysis)
```typescript
// Generate executive summaries and recommendations
const generateValuationAnalysis = async (assessmentData) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{
      role: "system",
      content: "You are a business valuation expert..."
    }, {
      role: "user", 
      content: JSON.stringify(assessmentData)
    }]
  });
  return response.choices[0].message.content;
}
```

### 2. PDF Report Generation
```typescript
// Use Puppeteer to generate professional PDF reports
const generateValuationPDF = async (assessment) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  const html = generateReportHTML(assessment);
  await page.setContent(html);
  
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' }
  });
  
  await browser.close();
  return pdf;
}
```

### 3. Email Delivery (SendGrid)
```typescript
// Send PDF reports via email
const sendValuationReport = async (email, pdfBuffer) => {
  const msg = {
    to: email,
    from: 'reports@applebites.ai',
    subject: 'Your Business Valuation Report',
    html: emailTemplate,
    attachments: [{
      content: pdfBuffer.toString('base64'),
      filename: 'valuation-report.pdf',
      type: 'application/pdf',
      disposition: 'attachment'
    }]
  };
  
  await sgMail.send(msg);
}
```

### 4. GoHighLevel CRM Integration
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
POST /api/assessments/:id/pdf    # Generate PDF report
POST /api/assessments/:id/email  # Email report
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
OPENAI_API_KEY=sk-...
SENDGRID_API_KEY=SG....
GHL_API_KEY=...
GHL_LOCATION_ID=...

# Webhook URLs  
GHL_WEBHOOK_FREE_RESULTS=https://...
GHL_WEBHOOK_GROWTH_RESULTS=https://...

# Session Security
SESSION_SECRET=...
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

### Phase 1 (Core MVP)
1. Database schema and basic authentication
2. Multi-step assessment form
3. Valuation calculation engine
4. Basic results display

### Phase 2 (Professional Features)
1. PDF report generation
2. Email delivery system
3. AI-powered analysis
4. Professional UI/UX polish

### Phase 3 (Advanced Features)
1. Admin dashboard and analytics
2. CRM integration
3. Advanced lead management
4. Performance optimization

This comprehensive specification provides everything needed to replicate the Apple Bites Business Valuation Platform with clean architecture, no design issues, and clearly defined user flows.