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

- **June 26, 2025 - Two-Tier Valuation Platform Implemented**: Built comprehensive free and paid tier system with NAICS-specific multipliers, enhanced PDF generation, and Resend email delivery. Free tier provides basic reports with general multipliers, while paid tier ($197) offers industry-specific analysis, AI insights, and professional presentations.

- **June 26, 2025 - Email Delivery System Added**: Integrated Resend service for professional email delivery of PDF reports with branded templates, automated follow-ups, and delivery tracking. Supports both tier types with appropriate messaging and upgrade prompts.

- **June 26, 2025 - GoHighLevel Integration Fixed**: Resolved webhook authentication issues by adding Location ID to API requests. Implemented selective lead filtering to only process valuation form submissions, not all GoHighLevel contacts. Removed manual sync functionality per user requirements.

- **June 26, 2025 - Interactive Valuation Slider Enhanced**: Updated slider with static grade labels, improved gradient scale design, and better visual contrast for user experience.

## Changelog

Changelog:
- June 26, 2025. Initial setup and GoHighLevel integration fixes