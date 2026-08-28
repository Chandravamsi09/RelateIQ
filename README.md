# RelateIQ - Enterprise Client Relationship Management (CRM) Platform

RelateIQ is an enterprise-grade, high-performance, modular Client Relationship Management (CRM) system designed for scaling businesses. Built with TypeScript, clean architecture, Domain-Driven Design (DDD), and rich full-stack capabilities.

---

## 🚀 Key Modules
- **Authentication & RBAC**: Multi-tenant security, JWT/Refresh tokens, session management, fine-grained access control.
- **Lead & Pipeline Management**: Automated lead scoring, round-robin assignment, Kanban deal stages, win/loss analytics.
- **Customer 360 & Contact Registry**: Hierarchical accounts, contact management, communication history.
- **Omnichannel Activities & Calendar**: Meeting schedulers, task planners, email logging, and activity timelines.
- **Support Desk & SLA Engine**: Ticketing system with automated priority escalation and SLA breach monitors.
- **Workflow & Automation Engine**: Event-driven trigger-condition-action workflow runner.
- **Analytics & Sales Velocity BI**: Real-time sales forecasting, revenue pacing, and churn prediction.
- **REST & WebSocket API**: Real-time updates, webhook integrations, and full API documentation.

---

## 📦 Dependencies

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **Package Manager**: npm v9+ or yarn / pnpm
- **Database**: PostgreSQL 14+ or SQLite for local zero-dependency embedded development
- **Containerization**: Docker & Docker Compose (Optional)

---

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/Chandravamsi09/RelateIQ.git
cd RelateIQ
```

2. Install dependencies across workspaces:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

---

## 🏗️ Build

Build the production bundles for both backend and frontend:

```bash
# Build monorepo packages
npm run build

# Or build individual workspace services
cd backend && npm run build
cd ../frontend && npm run build
```

---

## ▶️ Run & Execution

### 1. Instant Localhost Execution (Single Command):
```bash
node scripts/start-local.js
# Or using npm:
npm start
```
- **Frontend Client**: `http://localhost:3000`
- **Backend REST API**: `http://localhost:5000`
- **API Health Check**: `http://localhost:5000/health`

### 2. Development Mode with Hot Reloading:
```bash
# Start backend in development mode
npm run dev:backend

# Start frontend development server
npm run dev:frontend
```

---

## 🧪 Testing

Execute the automated test suites:

```bash
npm test
# Or run native test runner:
node backend/tests/runner.js
```

---

## 🐳 Docker Deployment

To build and run the entire stack using Docker Compose:

```bash
docker build -t relateiq-crm .
docker run -p 3000:3000 -p 5000:5000 relateiq-crm
```

---

## 📖 Usage Guide

1. **Sign In**: Select **Admin (Alexander Pierce)** or **User (Sarah Connor)** on the login screen.
2. **Executive Cockpit**: Monitor real-time total pipeline revenue, sales velocity per day, and quota pacing.
3. **Leads Intelligence**: Ingest leads, calculate automated AI quality scores, and use **1-Click Convert** to atomically spawn Accounts, Contacts, and Opportunities.
4. **Deals Kanban**: Progress deals across **Discovery**, **Proposal**, **Negotiation**, and **Closed Won** stages with live weighted forecasting.
5. **Support Desk**: Manage tickets with active SLA countdown clocks and automated escalation.
