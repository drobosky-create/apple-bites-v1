# replit.md

## Overview

This is a business valuation calculator application built as a full-stack web platform for Meritage Partners. The application allows users to complete comprehensive business valuations through a multi-step form interface, generates professional PDF reports, and includes admin/team dashboards for lead management. The system integrates with external services like GoHighLevel CRM and SendGrid for email automation.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: React Hook Form for form state, TanStack Query for server state
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Session Management**: Express sessions with PostgreSQL storage
- **Authentication**: Session-based auth for admin/team access

### Database Architecture
- **Primary Database**: PostgreSQL (Neon serverless)
- **ORM**: Drizzle ORM with PostgreSQL adapter
- **Schema Management**: Drizzle Kit for migrations and schema management

## Key Components

### Valuation Assessment System
- Multi-step form with progress tracking (Contact → EBITDA → Adjustments → Value Drivers → Follow-up)
- Real-time EBITDA calculations with owner adjustments
- Value driver scoring system (A-F grades) with multiplier calculations
- AI-powered narrative generation using OpenAI GPT-4

### Lead Management System
- Complete lead tracking from form submission through conversion
- Lead status management (new, contacted, qualified, etc.)
- Activity logging and follow-up tracking
- Search and filtering capabilities

### Team Management System
- Role-based access control (admin, member, viewer)
- Secure authentication with password requirements
- Forced password changes for new accounts
- Team member management with CRUD operations

### PDF Report Generation
- Professional valuation reports using Puppeteer
- Branded templates with company logos and styling
- Automated email delivery via SendGrid
- Embedded charts and financial summaries

### External Integrations
- **GoHighLevel CRM**: Contact synchronization and webhook notifications
- **SendGrid**: Email delivery and campaign management
- **OpenAI**: AI-powered business analysis and recommendations

## Data Flow

1. **User Journey**: Contact Info → Financial Data → Value Assessment → Report Generation
2. **Lead Processing**: Form submission → Database storage → CRM sync → Email automation
3. **Admin Workflow**: Login → Dashboard access → Lead management → Analytics review
4. **Report Generation**: Data validation → AI analysis → PDF creation → Email delivery

## External Dependencies

### Production Services
- **Neon PostgreSQL**: Primary database hosting
- **SendGrid**: Email delivery service
- **GoHighLevel**: CRM integration
- **OpenAI**: AI analysis services

### Development Tools
- **Puppeteer**: PDF generation with Chromium
- **Drizzle**: Database ORM and migrations
- **TanStack Query**: Server state management
- **React Hook Form**: Form validation and state

### UI/UX Libraries
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Pre-built React components
- **Radix UI**: Accessible component primitives
- **Recharts**: Data visualization charts

## Deployment Strategy

### Development Environment
- **Runtime**: Node.js 20 with Replit hosting
- **Database**: PostgreSQL 16 module
- **Hot Reload**: Vite development server with HMR
- **Port Configuration**: Port 5000 for development

### Production Build
- **Build Process**: Vite frontend build + esbuild backend bundle
- **Static Assets**: Served from dist/public directory
- **Session Storage**: PostgreSQL-backed sessions
- **Environment Variables**: DATABASE_URL, API keys for external services

### Replit Configuration
- **Modules**: nodejs-20, web, postgresql-16
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`
- **Auto-deployment**: Enabled with build step

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

- **July 19, 2025 - Executive Layout Perfection & Proportional Scaling**: Achieved complete visual balance with min-h-screen layout ensuring sidebar and form maintain equal heights. Implemented professional sidebar restructure with justify-between spacing, enlarged progress icons from 32px to 48px circles, enhanced text sizing from small to large for optimal readability, and added elegant Meritage Partners branding footer. Applied comprehensive proportional scaling throughout progress indicators with improved connecting lines, enhanced hover states, and executive-grade visual authority. Platform now delivers investor-facing sophistication with perfect height matching and professional visual hierarchy.

- **July 19, 2025 - Logo Asset Management & Final UI Polish**: Saved complete collection of 6 professional Apple Bites logo variations to permanent project storage (/public/assets/logos/) including red apple variants, metallic cyan-glow versions, and premium designs. Created comprehensive documentation cataloging each variant's best use cases and brand guidelines. Completed final sidebar enhancements with framed logo presentation using bg-white/10 background, shadow elevation, and optimized spacing. Updated main content area with custom padding (65px left/right) for executive-grade layout consistency.

- **July 19, 2025 - Professional SaaS Stepper Redesign & UI Polish**: Completely overhauled vertical progress indicator with professional SaaS visual authority and polish. Implemented enhanced visual hierarchy with white background for current step, proper contrast, and left border indicators that highlight on hover. Added gradient icon circles with proper color logic, interactive hover states with smooth animations, completion indicators with check marks, and subtle pulse animation for current step. Enhanced contact form with professional section groupings ("Contact Details" and "Business Information"), improved field layout, premium gradient Continue button with arrow icon, and form validation feedback with animated error messages. Removed generic UI elements and systematically cleaned interface for executive-grade appearance.

- **July 19, 2025 - Executive-Grade Valuation Platform Layout Redesign**: Completely redesigned free assessment page with professional vertical sidebar layout featuring Apple Bites branding. Implemented left-aligned sidebar stepper (280px) with brand navy gradient background (#0b2147 to #1a365d), Apple Bites logo, and sophisticated progress tracking. Created main content area with clean header section, organized form progression, and executive-style visual hierarchy. Enhanced progress indicator with vertical step flow, connecting lines, glass-morphism effects, and animated "Current" pills. Removed generic horizontal progress styling and replaced with premium guided experience matching executive valuation platform standards.

- **July 18, 2025 - Hybrid Authentication System Implementation**: Successfully implemented complete hybrid authentication system supporting both Replit OAuth and custom email/password registration. Enhanced security with separate firstName/lastName fields, comprehensive password requirements (8+ chars, uppercase, lowercase, number, special character), and bcrypt hashing. Removed ArgonBox header component from login page and eliminated purple focus outlines from all buttons. Fixed free-tier demo page styling with stable inline margin styles. Authentication system now provides three login options: Replit OAuth, custom registration, and custom login with shared email-based access permissions.

- **July 17, 2025 - Comprehensive AI Assistant Documentation**: Created detailed AI_ASSISTANT_BREAKDOWN.md providing complete technical and business context for AI assistant integration. Document covers all aspects of Apple Bites platform including business model, technical architecture, database schema, valuation engine, user experience, integrations, and operational capabilities. Enables AI assistant to provide informed support for business valuation platform functionality.

- **July 11, 2025 - Complete GHL Brand Unification Implementation**: Implemented comprehensive GoHighLevel brand theme system with complete CSS overhaul. Added GHL brand tokens (#81e5d8 primary teal, #4493de secondary blue, #0b2147 navy), updated typography to use Montserrat for headings and Manrope for body text, and created extensive component library. Implemented placeholder styling with brand gray (#cbd5e0), autofill styling with GHL colors, and comprehensive button/form/card components. Added dark theme support with GHL navy backgrounds and proper color contrast. Created complete utility class system for brand colors and comprehensive component demos. All UI elements now match GoHighLevel site styling with consistent padding, radius, and hover states.

- **July 11, 2025 - Navigation Update and Assessment Routing Fix**: Updated navigation component to use GHL branding with proper color scheme. Changed "Valuation Form" button to "Dashboard" button that redirects to user dashboard instead of homepage. Fixed routing issue where "Take Free Assessment" button was causing 404 errors by updating route from `/assessment` to `/assessment/free`. Applied GHL navy background and teal/blue color scheme to assessment pages for consistent branding throughout the application.

- **July 11, 2025 - Apple Bites Logo Replacement**: Replaced all instances of the old Apple Bites logo with the new professional Apple Bites logo (metallic apple with money design) across all frontend components. Updated imports in home.tsx, free-assessment.tsx, paid-assessment.tsx, valuation-form.tsx, and team-dashboard.tsx to use the new logo file. Removed unused logo imports and ensured consistent branding throughout the user interface while maintaining Meritage Partners branding in PDF reports.

- **July 10, 2025 - Complete User Management System Implementation**: Built comprehensive user authentication and management system with database schema, API endpoints, and tier-based access control. Created users table with fields for email, full name, password hash, tier (free/growth/capital), GoHighLevel contact ID, and account status tracking. Implemented user registration through webhook integration, password creation workflow, login/logout endpoints, and session management. Enhanced webhook processing to automatically create user accounts when tier purchases are received from GoHighLevel. Users can now authenticate, create passwords, and access tier-specific dashboards.

- **July 10, 2025 - Brand-Aligned Login Portal and Homepage Redirect**: Restructured application routing to redirect main homepage to https://products.applebites.ai/ for purchases while providing dedicated login portal at /login for existing customers. Updated brand colors throughout login system from generic blue to Meritage Partners navy (#1a2332) and slate color scheme for professional appearance. Removed header/navigation from standalone login and redirect pages for clean user experience. Created tier-specific user dashboards with assessment status tracking and result management.

- **July 10, 2025 - Tier-Based Webhook System Implementation**: Restructured GoHighLevel webhook integration to support tier-specific webhook URLs. Implemented environment variable-based webhook configuration with GHL_WEBHOOK_FREE_RESULTS, GHL_WEBHOOK_GROWTH_PURCHASE, GHL_WEBHOOK_GROWTH_RESULTS, and GHL_WEBHOOK_CAPITAL_PURCHASE. Added processPurchaseEvent method for handling tier purchases. Removed all references to deleted webhook (0214e352-5c51-4222-bb9a-1e0fd02d8290). Enhanced webhook system with automatic tier detection and appropriate webhook routing based on assessment type.

- **July 7, 2025 - Growth & Exit Assessment Rebranding**: Updated naming from "Strategic Assessment" to "Growth & Exit Assessment" to align with Tier 2 pricing structure. Updated pricing from $395 to $795 to match new tier pricing. Implemented external Apple Bites checkout integration with direct link redirection (https://products.applebites.ai/product-details/product/686c2e0f5f2f1191edb09737).

- **July 7, 2025 - AI-Powered Financial Coaching Implementation**: Integrated OpenAI GPT-4o powered financial coaching system into growth & exit assessment. Features personalized business recommendations based on financial data, industry benchmarks, and value driver performance. Provides contextual insights, actionable improvement strategies, priority-based tips, and potential impact analysis. Users can generate AI coaching on the final assessment step with one-click access to professional business advice.

- **July 7, 2025 - Industry Comparison Chart Implementation**: Added comprehensive industry comparison chart to final assessment page before paygate. Chart displays user's calculated EBITDA multiple against authentic industry benchmarks (low, average, high) for their specific NAICS code. Uses real market data to show competitive positioning within industry standards. Includes visual bar chart with color-coded comparison and professional styling.

- **July 7, 2025 - NAICS-Anchored Valuation Engine Enhancement**: Implemented authentic industry-specific valuation logic using comprehensive NAICS multiplier database. System now calculates business values starting with industry baseline multipliers, then adjusts based on Value Driver Score assessments. Provides realistic market-based valuations across all major U.S. industry sectors.

- **July 7, 2025 - UI/UX Improvements**: Removed category headers from value driver questions for cleaner consumer experience. Fixed progress bar overflow issues to ensure proper visual containment. Enhanced real-time valuation displays with accurate financial calculations.

- **July 3, 2025 - Complete NAICS Database Expansion**: Expanded comprehensive NAICS database from 4 sectors to all 20 major U.S. industry sectors with 250+ authentic 6-digit industry classifications. Added Manufacturing (31), Wholesale Trade (42), Retail Trade (44), Transportation (48), Information (51), Finance (52), Real Estate (53), Professional Services (54), Management (55), Administrative Services (56), Education (61), Healthcare (62), Arts/Entertainment (71), Accommodation/Food (72), Other Services (81), and Public Administration (92). Each sector includes realistic multiplier ranges based on industry-specific valuation data.

- **June 26, 2025 - Two-Tier Valuation Platform Implemented**: Built comprehensive free and paid tier system with NAICS-specific multipliers, enhanced PDF generation, and Resend email delivery. Free tier provides basic reports with general multipliers, while paid tier ($395) offers industry-specific analysis, AI insights, and professional presentations.

- **June 26, 2025 - Email Delivery System Added**: Integrated Resend service for professional email delivery of PDF reports with branded templates, automated follow-ups, and delivery tracking. Supports both tier types with appropriate messaging and upgrade prompts.

- **June 26, 2025 - GoHighLevel Integration Fixed**: Resolved webhook authentication issues by adding Location ID to API requests. Implemented selective lead filtering to only process valuation form submissions, not all GoHighLevel contacts. Removed manual sync functionality per user requirements.

- **June 26, 2025 - Interactive Valuation Slider Enhanced**: Updated slider with static grade labels, improved gradient scale design, and better visual contrast for user experience.

- **June 26, 2025 - Two-Tier Platform Architecture Implemented**: Created separate assessment paths with upfront tier selection. Free tier maintains original Apple Bites assessment (5 steps, general multipliers). Paid tier ($395) features completely new Strategic Assessment with industry-specific NAICS codes, 6-step process including industry classification, and enhanced value analysis. Both tiers generate appropriate PDF reports with tier-specific features.

## Changelog

Changelog:
- June 26, 2025. Initial setup and GoHighLevel integration fixes