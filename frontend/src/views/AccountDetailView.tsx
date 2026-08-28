import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table } from '../components/ui/Table';

/**
 * RelateIQ Enterprise CRM - AccountDetailView Page View
 * Implements high-density enterprise workspace, filtering controls, action toolbars, and responsive state.
 */
export const AccountDetailView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  return (
    <div className="relateiq-view space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Account Detail View</h2>
          <p className="text-sm text-slate-400">Enterprise management console for accountdetail domain records</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            Export CSV
          </Button>
          <Button variant="primary" size="sm">
            + Create Record
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-slate-950 border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Entities</span>
          <div className="text-2xl font-bold text-slate-100 mt-2">1,248</div>
          <span className="text-xs text-emerald-400 mt-1 block">? 12% MoM growth</span>
        </Card>
        <Card className="p-4 bg-slate-950 border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Throughput Rate</span>
          <div className="text-2xl font-bold text-slate-100 mt-2">99.8%</div>
          <span className="text-xs text-blue-400 mt-1 block">Zero SLA degradation</span>
        </Card>
        <Card className="p-4 bg-slate-950 border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Action</span>
          <div className="text-2xl font-bold text-slate-100 mt-2">14</div>
          <span className="text-xs text-amber-400 mt-1 block">Requires review</span>
        </Card>
        <Card className="p-4 bg-slate-950 border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Data Health Index</span>
          <div className="text-2xl font-bold text-slate-100 mt-2">96 / 100</div>
          <span className="text-xs text-emerald-400 mt-1 block">High data integrity</span>
        </Card>
      </div>

      <Card className="p-6 bg-slate-950 border-slate-800">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
          <input
            type="text"
            placeholder="Search records by name, email, or identifier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-80 bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <div className="flex gap-2">
            {['ALL', 'ACTIVE', 'FLAGGED', 'ARCHIVED'].map(tab => (
              <button
                key={tab}
                onClick={() => setSelectedFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedFilter === tab ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs uppercase text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Identifier</th>
                <th className="px-4 py-3">Primary Label</th>
                <th className="px-4 py-3">Assigned Owner</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Updated At</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {[1, 2, 3, 4, 5].map(idx => (
                <tr key={idx} className="hover:bg-slate-900/40 transition">
                  <td className="px-4 py-3 font-mono text-xs text-blue-400">#RLQ-{idx * 100 + 42}</td>
                  <td className="px-4 py-3 font-semibold text-slate-200">Enterprise Asset Cluster {idx}</td>
                  <td className="px-4 py-3 text-slate-400">Sarah Connor</td>
                  <td className="px-4 py-3">
                    <Badge variant="success">ACTIVE</Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">2 hours ago</td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-xs text-blue-400 hover:text-blue-300 font-medium">Manage ?</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AccountDetailView;
