# RelateIQ - Enterprise Client Relationship Management (CRM) Platform

RelateIQ is an enterprise-grade, high-performance, modular Client Relationship Management (CRM) system designed for scaling businesses. Built with TypeScript, clean architecture, Domain-Driven Design (DDD), and rich full-stack capabilities.

## Key Modules
- **Authentication & RBAC**: Multi-tenant security, JWT/Refresh tokens, session management, fine-grained access control.
- **Lead & Pipeline Management**: Automated lead scoring, round-robin assignment, Kanban deal stages, win/loss analytics.
- **Customer 360 & Contact Registry**: Hierarchical accounts, contact management, communication history.
- **Omnichannel Activities & Calendar**: Meeting schedulers, task planners, email logging, and activity timelines.
- **Support Desk & SLA Engine**: Ticketing system with automated priority escalation and SLA breach monitors.
- **Workflow & Automation Engine**: Event-driven trigger-condition-action workflow runner.
- **Analytics & Sales Velocity BI**: Real-time sales forecasting, revenue pacing, and churn prediction.
- **REST & WebSocket API**: Real-time updates, webhook integrations, and full API documentation.

## Architecture
- **Backend**: Node.js / Express / TypeScript (Clean Architecture & Modular DDD)
- **Frontend**: React 18, TypeScript, Tailwind CSS, TanStack Query, Radix UI, Recharts
- **Database Layer**: Prisma ORM, PostgreSQL / SQLite compatibility, transaction isolation
- **Testing**: Jest / Vitest test suites with comprehensive enterprise scenarios
