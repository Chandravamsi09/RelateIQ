import React from 'react';

export const SupportDeskView: React.FC = () => {
  const tickets = [
    { id: '1001', subject: 'Webhook Delivery Latency During Peak Traffic', customer: 'TechFlow Solutions', priority: 'HIGH', status: 'IN_PROGRESS', sla: '3h remaining', breached: false },
    { id: '1002', subject: 'SAML SSO Configuration Assertion Failure', customer: 'Apex Logistics', priority: 'CRITICAL', status: 'OPEN', sla: '45m remaining', breached: false },
    { id: '1003', subject: 'Exporting 50k Contacts Timeout in CSV', customer: 'Quantum Dynamics', priority: 'MEDIUM', status: 'RESOLVED', sla: 'Met SLA', breached: false }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Help Desk & SLA Escalation</h2>
          <p className="text-sm text-slate-400">Omnichannel ticket triage, automated SLA timers, and incident management</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
          + New Ticket
        </button>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/80 text-xs uppercase text-slate-400 font-semibold border-b border-slate-800">
            <tr>
              <th className="px-6 py-4">Ticket # & Subject</th>
              <th className="px-6 py-4">Account</th>
              <th className="px-6 py-4">Priority</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">SLA Clock</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {tickets.map(t => (
              <tr key={t.id} className="hover:bg-slate-900/40 transition">
                <td className="px-6 py-4 font-medium text-slate-200">
                  <div className="text-xs text-blue-400 font-mono">#{t.id}</div>
                  <div className="font-semibold mt-0.5">{t.subject}</div>
                </td>
                <td className="px-6 py-4 text-slate-400">{t.customer}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 text-xs font-bold rounded ${t.priority === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                    {t.priority}
                  </span>
                </td>
                <td className="px-6 py-4"><span className="px-2 py-0.5 text-xs rounded bg-slate-800 text-slate-300">{t.status}</span></td>
                <td className="px-6 py-4 font-mono text-xs text-slate-300">{t.sla}</td>
                <td className="px-6 py-4 text-right">
                  <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-md transition">
                    Respond
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
