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

### Token-Based Access System
- Secure token generation for basic and growth tier assessments
- Time-based token expiration with 1-hour validity
- Single-use token validation with IP and user agent tracking
- Protected assessment routes with middleware authentication
- Direct URL access from GHL automations

### PDF Report Generation
- Professional valuation reports using Puppeteer
- Branded templates with company logos and styling
- Automated email delivery via SendGrid
- Embedded charts and financial summaries

### External Integrations
- **GoHighLevel CRM**: Token-based access control, contact synchronization, and webhook notifications
- **SendGrid**: Email delivery and campaign management
- **OpenAI**: AI-powered business analysis and recommendations

## Data Flow

1. **User Journey**: Contact Info → Financial Data → Value Assessment → Report Generation
2. **Lead Processing**: Form submission → Database storage → CRM sync → Email automation
3. **Admin Workflow**: Login → Dashboard access → Lead management → Analytics review
4. **Report Generation**: Data validation → AI analysis → PDF creation → Email delivery
5. **Token-Based Access**: GHL automation → Token generation → URL distribution → Assessment access → Results delivery

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

- **July 8, 2025 - Enhanced GHL Webhook Callback System**: Upgraded the GoHighLevel webhook callback system with comprehensive assessment data transmission. The enhanced webhook callback now includes detailed assessment results with `ghlContactId`, `score` (calculated valuation in millions), `valuationRange` (formatted currency range), `driverGrades` (all 10 value driver scores A-F), `type` (basic/growth), `assessmentUrl` (direct PDF link), `completedAt` (ISO timestamp), and complete contact information. Token information is properly captured during assessment submission and used to populate the GHL contact ID for accurate bi-directional integration. Updated webhook URL to: `https://services.leadconnectorhq.com/hooks/QNFFrENaRuI2JhIdFd0Z/webhook-trigger/0bdb4be6-432a-469b-9296-5b14d8fcfdc7` for Growth assessment results.

- **July 8, 2025 - GHL Token-Based Access System Implementation**: Replaced Apple Bites checkout with comprehensive GoHighLevel token-based access control system. Features secure token generation API endpoints, token validation middleware, protected assessment routes, and direct URL access from GHL automations. Users receive assessment URLs with embedded tokens, eliminating checkout/return friction. Token system supports both basic (free) and growth ($795) tier access with automatic expiration and usage tracking.

- **July 7, 2025 - Post-Purchase Access System Implementation**: Built comprehensive email-gated access system for Growth & Exit Assessment completion after external Apple Bites checkout. Features assessment data persistence, email verification for purchase validation, dedicated access and results pages, and localStorage/backend data bridging. Users complete assessment → redirect to checkout → return via email verification → access full results.

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