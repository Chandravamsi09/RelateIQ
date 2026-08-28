import React from 'react';

export const WorkflowAutomationBuilderView: React.FC = () => {
  const workflows = [
    { id: '1', name: 'High Value Lead Auto-Assignment', trigger: 'LEAD_CREATED (score >= 80)', action: 'Assign to Senior Enterprise AE + Slack Alert', status: 'ACTIVE', executions: 1420 },
    { id: '2', name: 'Deal Won Billing & Contract Handshake', trigger: 'DEAL_STAGE_CHANGED (Closed Won)', action: 'Generate Invoice + Create Onboarding Task', status: 'ACTIVE', executions: 384 },
    { id: '3', name: 'SLA Breach Auto Escalation', trigger: 'TICKET_SLA_BREACHED', action: 'Set Priority CRITICAL + Escalate to Support Director', status: 'ACTIVE', executions: 12 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Workflow Automation Engine</h2>
          <p className="text-sm text-slate-400">Visual trigger-condition-action rules and event-driven webhooks</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
          + Create Workflow
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {workflows.map(wf => (
          <div key={wf.id} className="bg-slate-950 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{wf.status}</span>
                <span className="text-xs text-slate-500 font-mono">{wf.executions} runs</span>
              </div>
              <h3 className="text-base font-semibold text-slate-200">{wf.name}</h3>
              <div className="mt-4 space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
                  <span className="text-blue-400 font-bold block mb-0.5">? WHEN TRIGGER</span>
                  <span className="text-slate-300">{wf.trigger}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
                  <span className="text-indigo-400 font-bold block mb-0.5">?? THEN ACTION</span>
                  <span className="text-slate-300">{wf.action}</span>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex justify-between">
              <button className="text-xs text-slate-400 hover:text-slate-200">Configure Graph</button>
              <button className="text-xs text-blue-400 font-medium hover:text-blue-300">View Execution Logs ?</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
