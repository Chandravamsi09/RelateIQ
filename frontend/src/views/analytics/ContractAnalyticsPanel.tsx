import React, { useState, useEffect } from 'react';

export interface ContractAnalyticsPanelProps {
  tenantId?: string;
  timeRange?: '7d' | '30d' | '90d' | '1y';
}

export const ContractAnalyticsPanel: React.FC<ContractAnalyticsPanelProps> = ({ tenantId = 'tenant-acme-corp', timeRange = '30d' }) => {
  const [metricValue, setMetricValue] = useState<number>(100);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setMetricValue(Math.floor(Math.random() * 500) + 100);
      setLoading(false);
    }, 150);
    return () => clearTimeout(timer);
  }, [timeRange]);

  return (
    <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
      <div className="flex justify-between items-center pb-3 border-b border-slate-800">
        <div>
          <h4 className="text-sm font-bold text-slate-200">Contract Telemetry & Metrics</h4>
          <p className="text-[11px] text-slate-500">Real-time aggregate reporting for {tenantId}</p>
        </div>
        <span className="px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 text-xs font-mono font-semibold">
          {timeRange.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-slate-500 block">Total Volume</span>
          <span className="text-lg font-bold text-slate-100 mt-1 block">
            {loading ? '...' : metricValue.toLocaleString()}
          </span>
        </div>
        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-slate-500 block">Health Index</span>
          <span className="text-lg font-bold text-emerald-400 mt-1 block">99.4%</span>
        </div>
      </div>
    </div>
  );
};
