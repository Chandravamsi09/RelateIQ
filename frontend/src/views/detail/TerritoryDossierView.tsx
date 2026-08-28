import React, { useState } from 'react';

export interface TerritoryDetailProps {
  id: string;
  tenantId: string;
  name?: string;
  status: string;
  onBack?: () => void;
}

export const TerritoryDossierView: React.FC<TerritoryDetailProps> = ({ id, name, status, onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'audit' | 'settings'>('overview');

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition">
              ←
            </button>
          )}
          <div>
            <h2 className="text-xl font-bold text-slate-100">{name || 'Territory Details'}</h2>
            <p className="text-xs text-slate-500 font-mono">UUID: {id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {status}
          </span>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-800 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg transition ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-900'}`}
        >
          Overview & Telemetry
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-lg transition ${activeTab === 'audit' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-900'}`}
        >
          Audit Logs
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-lg transition ${activeTab === 'settings' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-900'}`}
        >
          Configuration
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-slate-200 mb-4">Territory Metadata & Attributes</h3>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500">Domain Category</span>
                <span className="font-semibold text-slate-200">SALES_OPS</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500">Lifecycle State</span>
                <span className="font-semibold text-emerald-400">{status}</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500">Data Encryption</span>
                <span className="font-mono text-blue-400">AES-256-GCM (Enforced)</span>
              </div>
            </div>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-slate-200 mb-4">Quick Actions</h3>
            <div className="space-y-2 text-xs">
              <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition">
                Trigger Automation ⚡
              </button>
              <button className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition">
                Export JSON Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
