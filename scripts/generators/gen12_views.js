const { save } = require('./writer');

console.log('Generating Phase 12: Frontend Application Page Views & Main Application...');

// 1. Dashboard View
save('frontend/src/views/DashboardView.tsx', `
import React from 'react';
import { MetricCard } from '../components/ui/MetricCard';

export const DashboardView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Executive Sales & Revenue Cockpit</h2>
          <p className="text-sm text-slate-400">Real-time telemetry, sales velocity, and pipeline forecasting</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition shadow-lg shadow-blue-500/20">
            + Quick Action
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Pipeline</p>
          <h3 className="text-2xl font-bold text-slate-100 mt-2">$1,480,000</h3>
          <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">? +18.4% vs last quarter</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Weighted Forecast</p>
          <h3 className="text-2xl font-bold text-slate-100 mt-2">$942,500</h3>
          <p className="text-xs text-emerald-400 mt-2">78% win probability confidence</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sales Velocity</p>
          <h3 className="text-2xl font-bold text-slate-100 mt-2">$31,400 / day</h3>
          <p className="text-xs text-blue-400 mt-2">Avg 24 days cycle</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Support SLA Uptime</p>
          <h3 className="text-2xl font-bold text-slate-100 mt-2">99.4%</h3>
          <p className="text-xs text-emerald-400 mt-2">0 active critical breaches</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-base font-semibold text-slate-200 mb-4">Pipeline Revenue by Stage</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-400 mb-1">
                <span>Discovery & Qualification (12 deals)</span>
                <span>$320,000</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '35%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-400 mb-1">
                <span>Proposal & Architecture Review (8 deals)</span>
                <span>$540,000</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: '55%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-400 mb-1">
                <span>Contract Negotiation (4 deals)</span>
                <span>$620,000</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '75%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-base font-semibold text-slate-200 mb-4">Recent High-Priority Activities</h3>
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">MEETING</span>
              <p className="text-xs font-medium text-slate-200 mt-1.5">TechFlow VP Architecture Sync</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Today at 2:00 PM • Sarah Connor</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">TASK</span>
              <p className="text-xs font-medium text-slate-200 mt-1.5">Submit Revised MSA & SLA Terms</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Due Tomorrow • Apex Global</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
`);

// 2. Deals Kanban View
save('frontend/src/views/DealsKanbanView.tsx', `
import React, { useState } from 'react';

export const DealsKanbanView: React.FC = () => {
  const [stages] = useState([
    { id: 'lead-in', name: 'Lead In / Qualification', count: 4, value: '$140k' },
    { id: 'contact-made', name: 'Contact Made', count: 6, value: '$320k' },
    { id: 'proposal-sent', name: 'Proposal Sent', count: 3, value: '$480k' },
    { id: 'negotiation', name: 'Negotiation', count: 2, value: '$520k' },
    { id: 'won', name: 'Closed Won', count: 5, value: '$890k' }
  ]);

  const deals = [
    { id: '1', title: 'TechFlow Global Modernization', account: 'TechFlow Solutions', amount: '$180,000', stage: 'proposal-sent', prob: 75, rep: 'Sarah C.' },
    { id: '2', title: 'Apex Logistics Field Sync', account: 'Apex Logistics', amount: '$340,000', stage: 'negotiation', prob: 85, rep: 'Sarah C.' },
    { id: '3', title: 'Quantum Dynamics Expansion', account: 'Quantum Dynamics', amount: '$120,000', stage: 'lead-in', prob: 50, rep: 'Alex P.' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Enterprise Deal Pipeline</h2>
          <p className="text-sm text-slate-400">Interactive Kanban stage progression and weighted revenue metrics</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
          + New Opportunity
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map(stage => {
          const stageDeals = deals.filter(d => d.stage === stage.id);
          return (
            <div key={stage.id} className="w-80 flex-shrink-0 bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">{stage.name}</h4>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">{stageDeals.length}</span>
              </div>
              <div className="space-y-3 flex-1">
                {stageDeals.map(deal => (
                  <div key={deal.id} className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-xl shadow-sm transition">
                    <h5 className="text-sm font-semibold text-slate-200">{deal.title}</h5>
                    <p className="text-xs text-slate-400 mt-1">{deal.account}</p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800/60">
                      <span className="text-sm font-bold text-emerald-400">{deal.amount}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">{deal.prob}% prob</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
`);

// 3. Leads View
save('frontend/src/views/LeadsListView.tsx', `
import React from 'react';

export const LeadsListView: React.FC = () => {
  const leads = [
    { id: '1', name: 'Sophia Martinez', company: 'Quantum Dynamics AI', email: 'smartinez@quantumdynamics.ai', source: 'Organic Search', score: 85, status: 'QUALIFIED' },
    { id: '2', name: 'Liam O’Connor', company: 'Strata Cloud Infrastructure', email: 'liam.oconnor@stratacloud.io', source: 'Referral', score: 68, status: 'NEW' },
    { id: '3', name: 'Jonathan Vance', company: 'Nexus BioHealth Systems', email: 'jvance@nexusbio.com', source: 'Conference', score: 92, status: 'PROPOSAL_SENT' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Lead Intelligence Engine</h2>
          <p className="text-sm text-slate-400">Automated lead scoring, source attribution, and atomic conversions</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
          + Ingest Lead
        </button>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/80 text-xs uppercase text-slate-400 font-semibold border-b border-slate-800">
            <tr>
              <th className="px-6 py-4">Lead Name & Company</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Source</th>
              <th className="px-6 py-4">AI Score</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {leads.map(lead => (
              <tr key={lead.id} className="hover:bg-slate-900/40 transition">
                <td className="px-6 py-4 font-medium text-slate-200">
                  <div>{lead.name}</div>
                  <div className="text-xs text-slate-500 font-normal">{lead.company}</div>
                </td>
                <td className="px-6 py-4 text-slate-400">{lead.email}</td>
                <td className="px-6 py-4"><span className="px-2 py-0.5 text-xs rounded bg-slate-800 text-slate-300">{lead.source}</span></td>
                <td className="px-6 py-4">
                  <span className={\`px-2.5 py-1 rounded-full text-xs font-bold \${lead.score >= 80 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}\`}>
                    ? {lead.score} / 100
                  </span>
                </td>
                <td className="px-6 py-4"><span className="px-2 py-0.5 text-xs font-semibold rounded bg-indigo-500/10 text-indigo-400">{lead.status}</span></td>
                <td className="px-6 py-4 text-right">
                  <button className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-md transition shadow">
                    Convert ?
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
`);

// 4. Main App
save('frontend/src/App.tsx', `
import React, { useState } from 'react';
import { AppShell } from './components/layout/AppShell';
import { DashboardView } from './views/DashboardView';
import { DealsKanbanView } from './views/DealsKanbanView';
import { LeadsListView } from './views/LeadsListView';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'deals':
        return <DealsKanbanView />;
      case 'leads':
        return <LeadsListView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <AppShell currentView={currentView} onViewChange={setCurrentView}>
      {renderView()}
    </AppShell>
  );
};

export default App;
`);

save('frontend/src/main.tsx', `
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`);

save('frontend/src/index.css', `
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  background-color: #020617;
  color: #f8fafc;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}
`);

save('frontend/index.html', `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>RelateIQ - Enterprise Client Relationship Management</title>
  </head>
  <body class="bg-slate-950 text-slate-100">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`);

console.log('Phase 12 generated successfully!');
