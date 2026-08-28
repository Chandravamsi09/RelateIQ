const http = require('http');
const fs = require('fs');
const path = require('path');

// In-Memory Database Store for Instant Local Run
const db = {
  tenants: [
    { id: 'tenant-acme-corp', name: 'Acme Global Enterprises', slug: 'acme-global', tier: 'ENTERPRISE', status: 'ACTIVE', currency: 'USD' }
  ],
  users: [
    { id: 'user-admin-01', tenantId: 'tenant-acme-corp', email: 'admin@acmecorp.com', firstName: 'Alexander', lastName: 'Pierce', title: 'CRO', roles: ['SUPER_ADMIN'] },
    { id: 'user-sales-01', tenantId: 'tenant-acme-corp', email: 'sarah.connor@acmecorp.com', firstName: 'Sarah', lastName: 'Connor', title: 'Senior Enterprise AE', roles: ['SALES_REP'] }
  ],
  accounts: [
    { id: 'acc-1', tenantId: 'tenant-acme-corp', name: 'TechFlow Solutions Inc.', industry: 'Technology', annualRevenue: 45000000, employeeCount: 420, rating: 'HOT', healthScore: 92, city: 'San Francisco', contactsCount: 4, openDealsValue: 180000 },
    { id: 'acc-2', tenantId: 'tenant-acme-corp', name: 'Apex Global Logistics', industry: 'Logistics', annualRevenue: 120000000, employeeCount: 1800, rating: 'WARM', healthScore: 78, city: 'Chicago', contactsCount: 8, openDealsValue: 340000 },
    { id: 'acc-3', tenantId: 'tenant-acme-corp', name: 'Quantum Dynamics AI', industry: 'Artificial Intelligence', annualRevenue: 85000000, employeeCount: 650, rating: 'HOT', healthScore: 95, city: 'Austin', contactsCount: 3, openDealsValue: 120000 },
    { id: 'acc-4', tenantId: 'tenant-acme-corp', name: 'Strata Cloud Infrastructure', industry: 'Cloud & DevOps', annualRevenue: 62000000, employeeCount: 510, rating: 'HOT', healthScore: 88, city: 'Seattle', contactsCount: 5, openDealsValue: 210000 }
  ],
  contacts: [
    { id: 'con-1', accountId: 'acc-1', accountName: 'TechFlow Solutions Inc.', firstName: 'Elena', lastName: 'Rostova', email: 'elena.rostova@techflow.io', phone: '+1-415-555-0188', title: 'VP of Technology', isPrimary: true },
    { id: 'con-2', accountId: 'acc-2', accountName: 'Apex Global Logistics', firstName: 'David', lastName: 'Chen', email: 'david.chen@apexlogistics.com', phone: '+1-312-555-0155', title: 'Chief Operating Officer', isPrimary: true },
    { id: 'con-3', accountId: 'acc-3', accountName: 'Quantum Dynamics AI', firstName: 'Sophia', lastName: 'Martinez', email: 'smartinez@quantumdynamics.ai', phone: '+1-650-555-0122', title: 'Director of AI Engineering', isPrimary: true }
  ],
  leads: [
    { id: 'lead-1', tenantId: 'tenant-acme-corp', firstName: 'Sophia', lastName: 'Martinez', company: 'Quantum Dynamics AI', email: 'smartinez@quantumdynamics.ai', source: 'Organic Search', score: 85, status: 'QUALIFIED', estimatedValue: 120000 },
    { id: 'lead-2', tenantId: 'tenant-acme-corp', firstName: 'Liam', lastName: 'O’Connor', company: 'Strata Cloud Infrastructure', email: 'liam.oconnor@stratacloud.io', source: 'Referral', score: 68, status: 'NEW', estimatedValue: 75000 },
    { id: 'lead-3', tenantId: 'tenant-acme-corp', firstName: 'Jonathan', lastName: 'Vance', company: 'Nexus BioHealth Systems', email: 'jvance@nexusbio.com', source: 'Conference', score: 92, status: 'PROPOSAL_SENT', estimatedValue: 180000 },
    { id: 'lead-4', tenantId: 'tenant-acme-corp', firstName: 'Emily', lastName: 'Watson', company: 'Vanguard Cyber Systems', email: 'emily.w@vanguardcyber.io', source: 'Website', score: 79, status: 'CONTACTED', estimatedValue: 95000 }
  ],
  deals: [
    { id: 'deal-1', tenantId: 'tenant-acme-corp', title: 'TechFlow Global Modernization', account: 'TechFlow Solutions Inc.', amount: 180000, stage: 'proposal-sent', prob: 75, rep: 'Sarah Connor', status: 'OPEN' },
    { id: 'deal-2', tenantId: 'tenant-acme-corp', title: 'Apex Logistics Support & Field Sync', account: 'Apex Global Logistics', amount: 340000, stage: 'negotiation', prob: 85, rep: 'Sarah Connor', status: 'OPEN' },
    { id: 'deal-3', tenantId: 'tenant-acme-corp', title: 'Quantum Dynamics Expansion', account: 'Quantum Dynamics AI', amount: 120000, stage: 'lead-in', prob: 50, rep: 'Alexander Pierce', status: 'OPEN' },
    { id: 'deal-4', tenantId: 'tenant-acme-corp', title: 'Cyberdyne Automated Data Pipeline', account: 'Cyberdyne Systems', amount: 450000, stage: 'won', prob: 100, rep: 'Sarah Connor', status: 'WON' },
    { id: 'deal-5', tenantId: 'tenant-acme-corp', title: 'Strata Cloud Multi-Region Deploy', account: 'Strata Cloud Infrastructure', amount: 210000, stage: 'contact-made', prob: 60, rep: 'Sarah Connor', status: 'OPEN' }
  ],
  activities: [
    { id: 'act-1', type: 'MEETING', subject: 'Executive Demo with VP of Tech (TechFlow)', assignedTo: 'Sarah Connor', status: 'COMPLETED', time: 'Today at 2:00 PM', priority: 'HIGH' },
    { id: 'act-2', type: 'TASK', subject: 'Submit Revised Master Services Agreement to Apex COO', assignedTo: 'Sarah Connor', status: 'PENDING', time: 'Due Tomorrow', priority: 'URGENT' },
    { id: 'act-3', type: 'CALL', subject: 'Inbound Discovery Call with Quantum Dynamics', assignedTo: 'Alexander Pierce', status: 'COMPLETED', time: 'Yesterday at 11:30 AM', priority: 'MEDIUM' }
  ],
  tickets: [
    { id: '1001', subject: 'Webhook Delivery Latency During Peak Traffic', customer: 'TechFlow Solutions Inc.', priority: 'HIGH', status: 'IN_PROGRESS', sla: '3h remaining', isBreached: false },
    { id: '1002', subject: 'SAML SSO Configuration Assertion Failure', customer: 'Apex Global Logistics', priority: 'CRITICAL', status: 'OPEN', sla: '45m remaining', isBreached: false },
    { id: '1003', subject: 'Custom Field Export CSV Formatting in Excel', customer: 'Quantum Dynamics AI', priority: 'MEDIUM', status: 'RESOLVED', sla: 'Met SLA', isBreached: false }
  ],
  workflows: [
    { id: 'wf-1', name: 'High-Value Lead Auto Assignment & Slack Alert', trigger: 'LEAD_CREATED (score >= 80)', action: 'Assign to Senior Enterprise AE + Post to #sales-alerts', status: 'ACTIVE', executions: 1420 },
    { id: 'wf-2', name: 'Deal Won Billing Handshake & Invoice Generation', trigger: 'DEAL_STAGE_CHANGED (Closed Won)', action: 'Generate Draft Invoice + Notify Finance', status: 'ACTIVE', executions: 384 },
    { id: 'wf-3', name: 'SLA Breach Emergency Escalation', trigger: 'TICKET_SLA_BREACHED', action: 'Set Priority to CRITICAL + Alert VP of Support', status: 'ACTIVE', executions: 12 }
  ]
};

// 1. Backend REST API Server (Port 5000)
const apiServer = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Tenant-ID');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    return res.end();
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;
  res.setHeader('Content-Type', 'application/json');

  if (pathname === '/health') {
    return res.end(JSON.stringify({ status: 'healthy', timestamp: new Date().toISOString(), service: 'RelateIQ Enterprise API' }));
  }

  if (pathname === '/api/v1/analytics/overview') {
    const totalPipeline = db.deals.reduce((sum, d) => sum + d.amount, 0);
    const weightedForecast = db.deals.reduce((sum, d) => sum + (d.amount * (d.prob / 100)), 0);
    return res.end(JSON.stringify({
      success: true,
      data: {
        totalPipeline,
        weightedForecast,
        salesVelocityPerDay: 31400,
        supportSlaUptime: 99.4,
        totalLeads: db.leads.length,
        totalAccounts: db.accounts.length,
        openDealsCount: db.deals.filter(d => d.status === 'OPEN').length
      }
    }));
  }

  if (pathname === '/api/v1/leads') {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        const payload = JSON.parse(body || '{}');
        const newLead = {
          id: 'lead-' + (db.leads.length + 1),
          tenantId: 'tenant-acme-corp',
          firstName: payload.firstName || 'Inbound',
          lastName: payload.lastName || 'Lead',
          company: payload.company || 'Enterprise Corp',
          email: payload.email || 'lead@enterprise.com',
          source: payload.source || 'Website',
          score: payload.score || 85,
          status: 'NEW',
          estimatedValue: payload.estimatedValue || 80000
        };
        db.leads.unshift(newLead);
        res.writeHead(201);
        res.end(JSON.stringify({ success: true, data: newLead }));
      });
      return;
    }
    return res.end(JSON.stringify({ success: true, data: db.leads, total: db.leads.length }));
  }

  if (pathname.match(/\/api\/v1\/leads\/([^/]+)\/convert/)) {
    const leadId = pathname.split('/')[4];
    const lead = db.leads.find(l => l.id === leadId);
    if (lead) {
      lead.status = 'CONVERTED';
      const newAcc = {
        id: 'acc-' + (db.accounts.length + 1),
        tenantId: 'tenant-acme-corp',
        name: lead.company,
        industry: 'Enterprise Technology',
        annualRevenue: 5000000,
        employeeCount: 100,
        rating: 'HOT',
        healthScore: 90,
        city: 'San Francisco',
        contactsCount: 1,
        openDealsValue: lead.estimatedValue || 100000
      };
      db.accounts.unshift(newAcc);
      const newDeal = {
        id: 'deal-' + (db.deals.length + 1),
        tenantId: 'tenant-acme-corp',
        title: lead.company + ' - Initial Opportunity',
        account: lead.company,
        amount: lead.estimatedValue || 100000,
        stage: 'proposal-sent',
        prob: 70,
        rep: 'Sarah Connor',
        status: 'OPEN'
      };
      db.deals.unshift(newDeal);
      return res.end(JSON.stringify({ success: true, data: { lead, account: newAcc, deal: newDeal } }));
    }
  }

  if (pathname === '/api/v1/deals') {
    return res.end(JSON.stringify({ success: true, data: db.deals, total: db.deals.length }));
  }
  if (pathname === '/api/v1/accounts') {
    return res.end(JSON.stringify({ success: true, data: db.accounts, total: db.accounts.length }));
  }
  if (pathname === '/api/v1/contacts') {
    return res.end(JSON.stringify({ success: true, data: db.contacts, total: db.contacts.length }));
  }
  if (pathname === '/api/v1/tickets') {
    return res.end(JSON.stringify({ success: true, data: db.tickets, total: db.tickets.length }));
  }
  if (pathname === '/api/v1/activities') {
    return res.end(JSON.stringify({ success: true, data: db.activities, total: db.activities.length }));
  }
  if (pathname === '/api/v1/workflows') {
    return res.end(JSON.stringify({ success: true, data: db.workflows, total: db.workflows.length }));
  }

  res.writeHead(404);
  res.end(JSON.stringify({ success: false, error: 'Endpoint not found' }));
});

// 2. Frontend Web Server (Port 3000)
const frontendServer = http.createServer((req, res) => {
  const htmlPath = path.join(__dirname, '../frontend/index.html');
  fs.readFile(htmlPath, 'utf8', (err, data) => {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading frontend template: ' + err.message);
    }
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(data);
  });
});

const API_PORT = 5000;
const WEB_PORT = 3000;

apiServer.listen(API_PORT, () => {
  console.log(`[Backend API Server] running at http://localhost:${API_PORT}`);
});

frontendServer.listen(WEB_PORT, () => {
  console.log(`[Frontend Web Client] running at http://localhost:${WEB_PORT}`);
  console.log(`\n========================================================================`);
  console.log(`  RelateIQ Enterprise CRM is live on http://localhost:${WEB_PORT}`);
  console.log(`========================================================================\n`);
});
