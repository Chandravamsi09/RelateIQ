# RelateIQ REST API Reference

All requests must include an `Authorization: Bearer <token>` header for protected endpoints.

### Authentication
- `POST /api/v1/auth/register` - Register new organization & admin
- `POST /api/v1/auth/login` - Authenticate user & issue tokens
- `GET /api/v1/auth/me` - Get current authenticated user profile

### Accounts & Customer 360
- `GET /api/v1/accounts` - List accounts
- `POST /api/v1/accounts` - Create account
- `GET /api/v1/accounts/:id/360` - Retrieve complete 360 customer dossier

### Leads Intelligence
- `GET /api/v1/leads` - List inbound leads
- `POST /api/v1/leads` - Ingest lead with automated scoring
- `POST /api/v1/leads/:id/convert` - Convert lead to Account, Contact, and Opportunity

### Deals & Pipeline
- `GET /api/v1/deals` - List deals across pipelines
- `POST /api/v1/deals` - Create deal
- `PATCH /api/v1/deals/:id/stage` - Update deal stage and recalculate win probability

### Support & SLA Desk
- `GET /api/v1/tickets` - List support tickets
- `POST /api/v1/tickets` - Open new support case
- `POST /api/v1/tickets/:id/escalate` - Escalate priority upon SLA breach

### Analytics & BI
- `GET /api/v1/analytics/overview` - Executive dashboard KPIs
- `GET /api/v1/analytics/velocity` - Real-time sales velocity metrics
- `GET /api/v1/analytics/forecast` - Weighted revenue forecast
