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
              <p className="text-[11px] text-slate-500 mt-0.5">Today at 2:00 PM � Sarah Connor</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">TASK</span>
              <p className="text-xs font-medium text-slate-200 mt-1.5">Submit Revised MSA & SLA Terms</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Due Tomorrow � Apex Global</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
