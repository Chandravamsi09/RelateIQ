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
