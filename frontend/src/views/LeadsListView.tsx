import React from 'react';

export const LeadsListView: React.FC = () => {
  const leads = [
    { id: '1', name: 'Sophia Martinez', company: 'Quantum Dynamics AI', email: 'smartinez@quantumdynamics.ai', source: 'Organic Search', score: 85, status: 'QUALIFIED' },
    { id: '2', name: 'Liam O�Connor', company: 'Strata Cloud Infrastructure', email: 'liam.oconnor@stratacloud.io', source: 'Referral', score: 68, status: 'NEW' },
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
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${lead.score >= 80 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
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
