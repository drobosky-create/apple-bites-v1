# replit.md

## Overview
This full-stack web application for Meritage Partners functions as a business valuation calculator. It facilitates a multi-step valuation process, generates professional PDF reports, and offers administrative dashboards for lead and team management. The platform aims to provide comprehensive business valuation services, utilizing AI for narrative generation and integrating with external services for CRM and email automation. The project's vision is to deliver a streamlined, accurate, and professional valuation tool with broad market applicability.

## User Preferences
Preferred communication style: Simple, everyday language. Focus on actions and progress rather than repetitive phrases. Perform periodic audits for project cleanup rather than extensive organizational work.

Development Priority: Always check Argon Dashboard folder first for any files, templates, or assets. Use Argon components, styles, and logic as the primary source. Only look elsewhere if Argon folder doesn't contain a relevant match.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript.
- **Styling**: Material Dashboard design system, featuring a professional blue-based color scheme with subtle shadows and a clean, modern aesthetic. Prioritizes a two-column authentication layout and Material Dashboard components.
- **State Management**: React Hook Form for form state, TanStack Query for server state.
- **Routing**: Wouter for client-side routing.
- **Build Tool**: Vite.

### Backend
- **Runtime**: Node.js with Express.js server.
- **Language**: TypeScript with ES modules.
- **API Design**: RESTful API with JSON responses.
- **Session Management**: Express sessions with PostgreSQL storage.
- **Authentication**: Session-based authentication for admin/team access, supporting OAuth (Google, GitHub, Apple) and email/password options with bcrypt hashing.

### Database
- **Primary Database**: PostgreSQL (Neon serverless).
- **ORM**: Drizzle ORM with PostgreSQL adapter.
- **Schema Management**: Drizzle Kit for migrations.

### Key Features & Design Decisions
- **Valuation Assessment**: Multi-step form for EBITDA, adjustments, value drivers, follow-up, and results. Includes real-time EBITDA calculations, value driver scoring (A-F grades), and AI-powered narrative generation (OpenAI GPT-4) with industry-specific NAICS multipliers.
- **Enhanced CRM System - Phase 1 Implementation (August 2025)**: Comprehensive headless CRM with M&A-specific features including:
  * 14-stage deal pipeline (Contact→Firm→Opportunity→Deal hierarchy) with interactive Kanban board (drag-and-drop)
  * Enhanced activity tracking with granular relationship mapping (Contact/Firm/Opportunity/Deal associations)
  * Advanced task management with hierarchical structure and assignment tracking
  * Document management system with secure file handling and categorization
  * Email campaign management prepared for GoHighLevel integration (Option A approach)
  * Deal valuation tracking with multiple valuation methodologies and version control
  * Pipeline metrics and configuration management for performance analytics
- **Lead & Team Management**: Comprehensive lead tracking, status management, activity logging, and role-based access control (admin, member, viewer). Leads section includes a toggle for "Leads" and "Assessments" views.
- **PDF Report Generation**: Professional valuation reports using branded templates, automated email delivery via SendGrid, and embedded charts.
- **UI/UX**: Emphasizes a clean, professional interface with consistent branding, responsiveness, and intuitive user flows. Utilizes a blue color palette, glassmorphism effects, and animated loading indicators. Features an interactive value calculator, strategic valuation range analysis, and a comprehensive dashboard.
- **Payment & Tier System**: Two-tier system (Free, Growth & Exit) with dynamic Stripe integration for pricing and payment processing.
- **Legal Compliance**: Integrated cookie banner, privacy policy, and terms of use pages.

## External Dependencies

### Production Services
- **Neon PostgreSQL**: Primary database hosting.
- **SendGrid**: Email delivery for reports and communications.
- **GoHighLevel**: CRM integration for contact synchronization, lead management, and email campaign execution.
- **OpenAI**: AI analysis services for narrative generation and financial coaching.
- **Stripe**: Payment processing for tiered access.
- **n8n**: Automation workflows for advanced lead processing.

### Development Tools & Libraries
- **Puppeteer**: PDF generation.
- **Drizzle**: Database ORM and migrations.
- **TanStack Query**: Server state management.
- **React Hook Form**: Form validation and state.
- **Recharts**: Data visualization charts.
- **Vite**: Frontend build tool.
- **esbuild**: Backend bundling.

### UI/UX Libraries
- **Material-UI (MUI)**: Core UI component library.
- **Material Dashboard**: Theme and component system for consistent styling.