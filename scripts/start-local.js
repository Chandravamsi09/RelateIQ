const http = require('http');
const fs = require('fs');
const path = require('path');
const { CryptoUtil } = require('../backend/src/core/security/crypto');
const { DateUtils } = require('../backend/src/core/utils/date-utils');
const { MathUtils } = require('../backend/src/core/utils/math-utils');

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
    { id: 'acc-1', tenantId: 'tenant-acme-corp', name: 'TechFlow Solutions Inc.', industry: 'Technology', annualRevenue: 45000000, employeeCount: 420, rating: 'HOT', healthScore: 92, city: 'San Francisco' },
    { id: 'acc-2', tenantId: 'tenant-acme-corp', name: 'Apex Global Logistics', industry: 'Logistics', annualRevenue: 120000000, employeeCount: 1800, rating: 'WARM', healthScore: 78, city: 'Chicago' },
    { id: 'acc-3', tenantId: 'tenant-acme-corp', name: 'Quantum Dynamics AI', industry: 'Artificial Intelligence', annualRevenue: 85000000, employeeCount: 650, rating: 'HOT', healthScore: 95, city: 'Austin' }
  ],
  leads: [
    { id: 'lead-1', tenantId: 'tenant-acme-corp', firstName: 'Sophia', lastName: 'Martinez', company: 'Quantum Dynamics AI', email: 'smartinez@quantumdynamics.ai', source: 'Organic Search', score: 85, status: 'QUALIFIED', estimatedValue: 120000 },
    { id: 'lead-2', tenantId: 'tenant-acme-corp', firstName: 'Liam', lastName: 'O’Connor', company: 'Strata Cloud Infrastructure', email: 'liam.oconnor@stratacloud.io', source: 'Referral', score: 68, status: 'NEW', estimatedValue: 75000 },
    { id: 'lead-3', tenantId: 'tenant-acme-corp', firstName: 'Jonathan', lastName: 'Vance', company: 'Nexus BioHealth Systems', email: 'jvance@nexusbio.com', source: 'Conference', score: 92, status: 'PROPOSAL_SENT', estimatedValue: 180000 }
  ],
  deals: [
    { id: 'deal-1', tenantId: 'tenant-acme-corp', title: 'TechFlow Global Modernization', account: 'TechFlow Solutions', amount: 180000, stage: 'proposal-sent', prob: 75, rep: 'Sarah Connor', status: 'OPEN' },
    { id: 'deal-2', tenantId: 'tenant-acme-corp', title: 'Apex Logistics Support & Field Sync', account: 'Apex Logistics', amount: 340000, stage: 'negotiation', prob: 85, rep: 'Sarah Connor', status: 'OPEN' },
    { id: 'deal-3', tenantId: 'tenant-acme-corp', title: 'Quantum Dynamics Expansion', account: 'Quantum Dynamics AI', amount: 120000, stage: 'lead-in', prob: 50, rep: 'Alexander Pierce', status: 'OPEN' },
    { id: 'deal-4', tenantId: 'tenant-acme-corp', title: 'Cyberdyne Automated Data Pipeline', account: 'Cyberdyne Systems', amount: 450000, stage: 'won', prob: 100, rep: 'Sarah Connor', status: 'WON' }
  ],
  activities: [
    { id: 'act-1', type: 'MEETING', subject: 'Executive Demo with VP of Tech (TechFlow)', assignedTo: 'Sarah Connor', status: 'COMPLETED', time: 'Today at 2:00 PM' },
    { id: 'act-2', type: 'TASK', subject: 'Submit Revised Master Services Agreement to Apex COO', assignedTo: 'Sarah Connor', status: 'PENDING', time: 'Due Tomorrow' }
  ],
  tickets: [
    { id: '1001', subject: 'Webhook Delivery Latency During Peak Traffic', customer: 'TechFlow Solutions', priority: 'HIGH', status: 'IN_PROGRESS', sla: '3h remaining', isBreached: false },
    { id: '1002', subject: 'SAML SSO Configuration Assertion Failure', customer: 'Apex Logistics', priority: 'CRITICAL', status: 'OPEN', sla: '45m remaining', isBreached: false }
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
    if (req.method === 'GET') {
      return res.end(JSON.stringify({ success: true, data: db.leads, total: db.leads.length }));
    }
  }

  if (pathname === '/api/v1/deals') {
    if (req.method === 'GET') {
      return res.end(JSON.stringify({ success: true, data: db.deals, total: db.deals.length }));
    }
  }

  if (pathname === '/api/v1/accounts') {
    if (req.method === 'GET') {
      return res.end(JSON.stringify({ success: true, data: db.accounts, total: db.accounts.length }));
    }
  }

  if (pathname === '/api/v1/tickets') {
    if (req.method === 'GET') {
      return res.end(JSON.stringify({ success: true, data: db.tickets, total: db.tickets.length }));
    }
  }

  if (pathname === '/api/v1/activities') {
    if (req.method === 'GET') {
      return res.end(JSON.stringify({ success: true, data: db.activities, total: db.activities.length }));
    }
  }

  // Fallback
  res.writeHead(404);
  res.end(JSON.stringify({ success: false, error: 'Endpoint not found' }));
});

// 2. Frontend Web Server (Port 3000)
const frontendServer = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RelateIQ - Enterprise CRM Platform</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; background-color: #020617; }
  </style>
</head>
<body class="text-slate-100 antialiased h-screen flex overflow-hidden">

  <!-- Sidebar -->
  <aside class="w-64 bg-slate-950 border-r border-slate-800 flex flex-col flex-shrink-0">
    <div class="h-16 flex items-center gap-3 px-6 border-b border-slate-800">
      <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/30">
        R
      </div>
      <div>
        <span class="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">RelateIQ</span>
        <span class="block text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Enterprise CRM</span>
      </div>
    </div>

    <nav class="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
      <button onclick="switchTab('dashboard')" id="nav-dashboard" class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition bg-blue-600 text-white shadow-lg shadow-blue-600/30">
        <span class="text-lg">??</span> Executive Cockpit
      </button>
      <button onclick="switchTab('deals')" id="nav-deals" class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition text-slate-400 hover:text-white hover:bg-slate-900">
        <span class="text-lg">??</span> Deals Pipeline Kanban
      </button>
      <button onclick="switchTab('leads')" id="nav-leads" class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition text-slate-400 hover:text-white hover:bg-slate-900">
        <span class="text-lg">??</span> Leads Intelligence
      </button>
      <button onclick="switchTab('accounts')" id="nav-accounts" class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition text-slate-400 hover:text-white hover:bg-slate-900">
        <span class="text-lg">??</span> Accounts & 360
      </button>
      <button onclick="switchTab('support')" id="nav-support" class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition text-slate-400 hover:text-white hover:bg-slate-900">
        <span class="text-lg">??</span> Help Desk & SLA Desk
      </button>
      <button onclick="switchTab('workflows')" id="nav-workflows" class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition text-slate-400 hover:text-white hover:bg-slate-900">
        <span class="text-lg">?</span> Workflow Automations
      </button>
    </nav>

    <div class="p-4 border-t border-slate-800/80 text-xs text-slate-500 flex items-center justify-between">
      <span class="inline-flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> API Connected (5000)</span>
      <span class="font-mono">v1.0.0</span>
    </div>
  </aside>

  <!-- Main Content Area -->
  <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
    <!-- Topbar -->
    <header class="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6 flex-shrink-0">
      <div class="flex items-center gap-3">
        <h2 id="view-title" class="text-lg font-bold text-slate-100">Executive Sales & Revenue Cockpit</h2>
        <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Acme Global Enterprises
        </span>
      </div>

      <div class="flex items-center gap-4">
        <div class="relative">
          <input type="text" placeholder="Search deals, accounts, leads..." class="w-72 bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500" />
        </div>
        <div class="flex items-center gap-3 border-l border-slate-800 pl-4">
          <div class="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">AP</div>
          <div class="text-xs hidden md:block">
            <p class="font-semibold text-slate-200">Alexander Pierce</p>
            <p class="text-slate-500">Chief Revenue Officer</p>
          </div>
        </div>
      </div>
    </header>

    <!-- Dynamic View Containers -->
    <main class="flex-1 overflow-y-auto p-6 bg-slate-900/40" id="main-content">
      
      <!-- DASHBOARD TAB -->
      <div id="tab-dashboard" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-slate-950 border border-slate-800 p-5 rounded-2xl">
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Pipeline</p>
            <h3 class="text-2xl font-bold text-slate-100 mt-2">$1,090,000</h3>
            <p class="text-xs text-emerald-400 mt-2 flex items-center gap-1">? +18.4% vs last quarter</p>
          </div>
          <div class="bg-slate-950 border border-slate-800 p-5 rounded-2xl">
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Weighted Forecast</p>
            <h3 class="text-2xl font-bold text-slate-100 mt-2">$934,000</h3>
            <p class="text-xs text-emerald-400 mt-2">78% win probability confidence</p>
          </div>
          <div class="bg-slate-950 border border-slate-800 p-5 rounded-2xl">
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sales Velocity</p>
            <h3 class="text-2xl font-bold text-slate-100 mt-2">$31,400 / day</h3>
            <p class="text-xs text-blue-400 mt-2">Avg 24 days cycle</p>
          </div>
          <div class="bg-slate-950 border border-slate-800 p-5 rounded-2xl">
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Support SLA Uptime</p>
            <h3 class="text-2xl font-bold text-slate-100 mt-2">99.4%</h3>
            <p class="text-xs text-emerald-400 mt-2">0 active critical breaches</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-6">
            <h3 class="text-base font-semibold text-slate-200 mb-4">Pipeline Revenue by Stage</h3>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-xs font-medium text-slate-400 mb-1">
                  <span>Discovery & Lead-In (4 deals)</span>
                  <span>$120,000</span>
                </div>
                <div class="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div class="bg-blue-500 h-full rounded-full" style="width: 25%"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-xs font-medium text-slate-400 mb-1">
                  <span>Proposal Sent (3 deals)</span>
                  <span>$180,000</span>
                </div>
                <div class="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div class="bg-indigo-500 h-full rounded-full" style="width: 45%"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-xs font-medium text-slate-400 mb-1">
                  <span>Contract Negotiation (2 deals)</span>
                  <span>$340,000</span>
                </div>
                <div class="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div class="bg-purple-500 h-full rounded-full" style="width: 65%"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-xs font-medium text-slate-400 mb-1">
                  <span>Closed Won (5 deals)</span>
                  <span>$450,000</span>
                </div>
                <div class="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div class="bg-emerald-500 h-full rounded-full" style="width: 85%"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6">
            <h3 class="text-base font-semibold text-slate-200 mb-4">Upcoming Schedule & Tasks</h3>
            <div class="space-y-3">
              <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span class="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">MEETING</span>
                <p class="text-xs font-semibold text-slate-200 mt-2">Executive Demo with TechFlow VP</p>
                <p class="text-[11px] text-slate-500 mt-1">Today at 2:00 PM • Sarah Connor</p>
              </div>
              <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span class="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">TASK</span>
                <p class="text-xs font-semibold text-slate-200 mt-2">Submit Master Services Agreement</p>
                <p class="text-[11px] text-slate-500 mt-1">Due Tomorrow • Apex Logistics</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- DEALS KANBAN TAB -->
      <div id="tab-deals" class="hidden space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-slate-100">Enterprise Opportunity Pipeline</h3>
            <p class="text-xs text-slate-400">Drag-and-drop progression and real-time weighted forecasting</p>
          </div>
          <button class="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold">+ New Deal</button>
        </div>
        <div class="flex gap-4 overflow-x-auto pb-4">
          <div class="w-80 flex-shrink-0 bg-slate-950 border border-slate-800 rounded-2xl p-4">
            <div class="flex justify-between items-center mb-3 pb-2 border-b border-slate-800 font-semibold text-xs text-slate-300 uppercase">
              <span>Qualification</span>
              <span class="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">1</span>
            </div>
            <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700">
              <h5 class="text-sm font-semibold text-slate-200">Quantum Dynamics Expansion</h5>
              <p class="text-xs text-slate-400 mt-1">Quantum Dynamics AI</p>
              <div class="flex justify-between items-center mt-3 pt-3 border-t border-slate-800/80">
                <span class="text-sm font-bold text-emerald-400">$120,000</span>
                <span class="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">50% prob</span>
              </div>
            </div>
          </div>
          <div class="w-80 flex-shrink-0 bg-slate-950 border border-slate-800 rounded-2xl p-4">
            <div class="flex justify-between items-center mb-3 pb-2 border-b border-slate-800 font-semibold text-xs text-slate-300 uppercase">
              <span>Proposal Sent</span>
              <span class="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">1</span>
            </div>
            <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700">
              <h5 class="text-sm font-semibold text-slate-200">TechFlow Global Modernization</h5>
              <p class="text-xs text-slate-400 mt-1">TechFlow Solutions Inc.</p>
              <div class="flex justify-between items-center mt-3 pt-3 border-t border-slate-800/80">
                <span class="text-sm font-bold text-emerald-400">$180,000</span>
                <span class="text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400">75% prob</span>
              </div>
            </div>
          </div>
          <div class="w-80 flex-shrink-0 bg-slate-950 border border-slate-800 rounded-2xl p-4">
            <div class="flex justify-between items-center mb-3 pb-2 border-b border-slate-800 font-semibold text-xs text-slate-300 uppercase">
              <span>Negotiation</span>
              <span class="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">1</span>
            </div>
            <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700">
              <h5 class="text-sm font-semibold text-slate-200">Apex Logistics Support & Field Sync</h5>
              <p class="text-xs text-slate-400 mt-1">Apex Global Logistics</p>
              <div class="flex justify-between items-center mt-3 pt-3 border-t border-slate-800/80">
                <span class="text-sm font-bold text-emerald-400">$340,000</span>
                <span class="text-xs px-2 py-0.5 rounded bg-purple-500/10 text-purple-400">85% prob</span>
              </div>
            </div>
          </div>
          <div class="w-80 flex-shrink-0 bg-slate-950 border border-slate-800 rounded-2xl p-4">
            <div class="flex justify-between items-center mb-3 pb-2 border-b border-slate-800 font-semibold text-xs text-slate-300 uppercase">
              <span>Closed Won</span>
              <span class="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">1</span>
            </div>
            <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700">
              <h5 class="text-sm font-semibold text-slate-200">Cyberdyne Data Pipeline</h5>
              <p class="text-xs text-slate-400 mt-1">Cyberdyne Systems</p>
              <div class="flex justify-between items-center mt-3 pt-3 border-t border-slate-800/80">
                <span class="text-sm font-bold text-emerald-400">$450,000</span>
                <span class="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">100% prob</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- LEADS TAB -->
      <div id="tab-leads" class="hidden space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-slate-100">Lead Intelligence Registry</h3>
            <p class="text-xs text-slate-400">Automated lead scoring, source attribution, and atomic conversions</p>
          </div>
          <button class="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold">+ Ingest Lead</button>
        </div>
        <div class="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
          <table class="w-full text-left text-sm text-slate-300">
            <thead class="bg-slate-900 text-xs uppercase text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th class="px-6 py-4">Lead & Company</th>
                <th class="px-6 py-4">Email</th>
                <th class="px-6 py-4">Source</th>
                <th class="px-6 py-4">AI Score</th>
                <th class="px-6 py-4">Status</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              <tr class="hover:bg-slate-900/40">
                <td class="px-6 py-4 font-semibold text-slate-200">Sophia Martinez <span class="block text-xs font-normal text-slate-500">Quantum Dynamics AI</span></td>
                <td class="px-6 py-4 text-slate-400">smartinez@quantumdynamics.ai</td>
                <td class="px-6 py-4"><span class="px-2 py-0.5 rounded bg-slate-800 text-xs text-slate-300">Organic Search</span></td>
                <td class="px-6 py-4"><span class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">? 85 / 100</span></td>
                <td class="px-6 py-4"><span class="px-2 py-0.5 rounded text-xs bg-indigo-500/10 text-indigo-400 font-semibold">QUALIFIED</span></td>
                <td class="px-6 py-4 text-right"><button class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-md">Convert ?</button></td>
              </tr>
              <tr class="hover:bg-slate-900/40">
                <td class="px-6 py-4 font-semibold text-slate-200">Liam O’Connor <span class="block text-xs font-normal text-slate-500">Strata Cloud Infrastructure</span></td>
                <td class="px-6 py-4 text-slate-400">liam.oconnor@stratacloud.io</td>
                <td class="px-6 py-4"><span class="px-2 py-0.5 rounded bg-slate-800 text-xs text-slate-300">Referral</span></td>
                <td class="px-6 py-4"><span class="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">? 68 / 100</span></td>
                <td class="px-6 py-4"><span class="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-400 font-semibold">NEW</span></td>
                <td class="px-6 py-4 text-right"><button class="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-md">Review</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ACCOUNTS TAB -->
      <div id="tab-accounts" class="hidden space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-slate-100">Enterprise Accounts & Customer 360</h3>
            <p class="text-xs text-slate-400">Parent-child account hierarchies and automated health scores</p>
          </div>
          <button class="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold">+ New Account</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-slate-950 border border-slate-800 p-5 rounded-2xl">
            <div class="flex justify-between items-center mb-2">
              <span class="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">Health: 92/100</span>
              <span class="text-xs text-slate-500">San Francisco, CA</span>
            </div>
            <h4 class="text-base font-bold text-slate-100">TechFlow Solutions Inc.</h4>
            <p class="text-xs text-slate-400 mt-1">Annual Revenue: $45,000,000 • 420 employees</p>
            <div class="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
              <span class="text-slate-400">1 Active Deal ($180k)</span>
              <button class="text-blue-400 hover:text-blue-300 font-semibold">View 360 ?</button>
            </div>
          </div>
          <div class="bg-slate-950 border border-slate-800 p-5 rounded-2xl">
            <div class="flex justify-between items-center mb-2">
              <span class="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400">Health: 78/100</span>
              <span class="text-xs text-slate-500">Chicago, IL</span>
            </div>
            <h4 class="text-base font-bold text-slate-100">Apex Global Logistics</h4>
            <p class="text-xs text-slate-400 mt-1">Annual Revenue: $120,000,000 • 1,800 employees</p>
            <div class="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
              <span class="text-slate-400">1 Active Deal ($340k)</span>
              <button class="text-blue-400 hover:text-blue-300 font-semibold">View 360 ?</button>
            </div>
          </div>
        </div>
      </div>

      <!-- SUPPORT TAB -->
      <div id="tab-support" class="hidden space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-slate-100">Help Desk & SLA Escalations</h3>
            <p class="text-xs text-slate-400">Automated SLA countdown and emergency breach routing</p>
          </div>
          <button class="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold">+ Open Ticket</button>
        </div>
        <div class="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
          <table class="w-full text-left text-sm text-slate-300">
            <thead class="bg-slate-900 text-xs uppercase text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th class="px-6 py-4">Ticket # & Issue</th>
                <th class="px-6 py-4">Client</th>
                <th class="px-6 py-4">Priority</th>
                <th class="px-6 py-4">Status</th>
                <th class="px-6 py-4">SLA Clock</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              <tr class="hover:bg-slate-900/40">
                <td class="px-6 py-4 font-semibold text-slate-200"><span class="font-mono text-xs text-blue-400 block">#1001</span> Webhook Delivery Latency During Peak Traffic</td>
                <td class="px-6 py-4 text-slate-400">TechFlow Solutions</td>
                <td class="px-6 py-4"><span class="px-2 py-0.5 rounded text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">HIGH</span></td>
                <td class="px-6 py-4"><span class="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-300">IN_PROGRESS</span></td>
                <td class="px-6 py-4 font-mono text-xs text-emerald-400">3h remaining</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- WORKFLOWS TAB -->
      <div id="tab-workflows" class="hidden space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-slate-100">Event-Driven Workflow Automation Engine</h3>
            <p class="text-xs text-slate-400">Trigger-Condition-Action automation matrix and execution logs</p>
          </div>
          <button class="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold">+ New Automation</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-slate-950 border border-slate-800 p-6 rounded-2xl">
            <span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">ACTIVE</span>
            <h4 class="text-base font-bold text-slate-100 mt-2">High-Value Lead Auto Assignment</h4>
            <p class="text-xs text-slate-400 mt-1">Routes leads with score >= 80 to Senior Enterprise AEs.</p>
            <div class="mt-4 space-y-2 text-xs">
              <div class="p-2.5 rounded-lg bg-slate-900 border border-slate-800"><span class="text-blue-400 font-bold">? TRIGGER:</span> LEAD_CREATED (Score >= 80)</div>
              <div class="p-2.5 rounded-lg bg-slate-900 border border-slate-800"><span class="text-indigo-400 font-bold">?? ACTION:</span> Assign Rep + Slack Alert</div>
            </div>
          </div>
        </div>
      </div>

    </main>
  </div>

  <script>
    function switchTab(tabId) {
      const tabs = ['dashboard', 'deals', 'leads', 'accounts', 'support', 'workflows'];
      tabs.forEach(t => {
        const el = document.getElementById('tab-' + t);
        const btn = document.getElementById('nav-' + t);
        if (t === tabId) {
          el.classList.remove('hidden');
          btn.className = "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition bg-blue-600 text-white shadow-lg shadow-blue-600/30";
          document.getElementById('view-title').innerText = t.charAt(0).toUpperCase() + t.slice(1) + ' Workspace';
        } else {
          el.classList.add('hidden');
          btn.className = "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition text-slate-400 hover:text-white hover:bg-slate-900";
        }
      });
    }
  </script>
</body>
</html>
  `;
  res.end(html);
});

// Launch both servers
const API_PORT = 5000;
const WEB_PORT = 3000;

apiServer.listen(API_PORT, () => {
  console.log(`\x1b[32m? [Backend API Server]\x1b[0m running at http://localhost:${API_PORT}`);
  console.log(`   Endpoints: http://localhost:${API_PORT}/health`);
  console.log(`   Endpoints: http://localhost:${API_PORT}/api/v1/analytics/overview`);
  console.log(`   Endpoints: http://localhost:${API_PORT}/api/v1/deals`);
  console.log(`   Endpoints: http://localhost:${API_PORT}/api/v1/leads`);
  console.log(`   Endpoints: http://localhost:${API_PORT}/api/v1/accounts`);
});

frontendServer.listen(WEB_PORT, () => {
  console.log(`\x1b[32m? [Frontend Web Client]\x1b[0m running at http://localhost:${WEB_PORT}`);
  console.log(`\n\x1b[36m========================================================================\x1b[0m`);
  console.log(`  \x1b[1m\x1b[37mRelateIQ Enterprise CRM is live!\x1b[0m`);
  console.log(`  Open \x1b[34mhttp://localhost:${WEB_PORT}\x1b[0m in your web browser.`);
  console.log(`\x1b[36m========================================================================\x1b[0m\n`);
});
