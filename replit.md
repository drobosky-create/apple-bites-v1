# replit.md

## Overview
This full-stack web application for Meritage Partners is the foundational component of the Apple Bites M&A ecosystem. It currently functions as a business valuation calculator, serving as the first of four planned modules. The complete platform will include an Assessment Engine, a CRM Module for Opportunity & Deal Flow, a Virtual Data Room for secure document storage, and a Team Management system for internal operations. The overarching goal is to replace existing tools like Made Market and Suralink, providing a comprehensive M&A workflow from lead generation to transaction close. The project emphasizes the use of Material Dashboard (MD) components and pre-built pages from the TeamTrack repository to ensure consistency and development efficiency.

## User Preferences
Preferred communication style: Simple, everyday language. Focus on actions and progress rather than repetitive phrases. Perform periodic audits for project cleanup rather than extensive organizational work.

Development Priority: Always prioritize Material Dashboard (MD) components and pre-built pages from the TeamTrack repository (https://github.com/drobosky-create/TeamTrack) for consistency and efficiency. Use TeamTrack components, styles, and logic as the primary source for M&A platform development. This ensures architectural alignment with the broader ecosystem vision.

Available TeamTrack MD Components:
- MDAlert, MDAvatar, MDBadge, MDBox, MDButton, MDInput, MDPagination, MDProgress, MDSnackbar, MDTypography

Available TeamTrack Pages:
- dashboard, billing, branding, goals, notifications, profile, settings, team-directory, templates, setup-wizard

Current Development Branch: ecosystem-modules (protecting main Apple Bites platform)

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Material Dashboard design system, professional blue-based color scheme with subtle shadows, and a clean, modern aesthetic. Prioritizes a two-column authentication layout and Material Dashboard components (MDBox, MDTypography, MDButton, etc.).
- **State Management**: React Hook Form for form state, TanStack Query for server state.
- **Routing**: Wouter for client-side routing.
- **Build Tool**: Vite.

### Backend
- **Runtime**: Node.js with Express.js server.
- **Language**: TypeScript with ES modules.
- **API Design**: RESTful API with JSON responses.
- **Session Management**: Express sessions with PostgreSQL storage.
- **Authentication**: Session-based authentication for admin/team access, includes OAuth (Google, GitHub, Apple) and email/password options with bcrypt hashing.

### Database
- **Primary Database**: PostgreSQL (Neon serverless).
- **ORM**: Drizzle ORM with PostgreSQL adapter.
- **Schema Management**: Drizzle Kit for migrations.

### Key Features & Design Decisions
- **Valuation Assessment**: Multi-step form with real-time EBITDA calculations, value driver scoring (A-F grades), and AI-powered narrative generation (OpenAI GPT-4). Industry-specific NAICS multipliers are applied.
- **Lead & Team Management**: Comprehensive lead tracking, status management, activity logging, and role-based access control (admin, member, viewer).
- **PDF Report Generation**: Professional valuation reports using Puppeteer, branded templates, and automated email delivery.
- **UI/UX**: Clean, professional interface with consistent branding (Apple Bites/Meritage Partners), responsiveness, and intuitive user flows. Utilizes a blue color palette, glassmorphism effects, and animated loading indicators. Features include an interactive value calculator with gauge, strategic valuation range analysis, and a comprehensive dashboard.
- **Payment & Tier System**: Two-tier system (Free, Growth & Exit) with dynamic Stripe integration for pricing and payment processing, including automatic tier activation and user management.
- **Legal Compliance**: Integrated cookie banner, privacy policy, and terms of use pages.

## External Dependencies

### Production Services
- **Neon PostgreSQL**: Primary database hosting.
- **SendGrid**: Email delivery.
- **GoHighLevel**: CRM integration for contact synchronization and lead management.
- **OpenAI**: AI analysis services.
- **Stripe**: Payment processing.
- **n8n**: Automation workflows.

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
- **Material Dashboard**: Theme and component system.