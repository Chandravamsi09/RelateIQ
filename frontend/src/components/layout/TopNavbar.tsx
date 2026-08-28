import React from 'react';

export const TopNavbar: React.FC<{ currentView: string }> = ({ currentView }) => {
  return (
    <header className="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-slate-100 capitalize">
          {currentView.replace('-', ' ')}
        </h1>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Acme Global Enterprises
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search deals, leads, accounts..."
            className="w-64 bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">
            AP
          </div>
          <div className="text-left text-xs hidden md:block">
            <p className="font-semibold text-slate-200">Alexander Pierce</p>
            <p className="text-slate-500">Chief Revenue Officer</p>
          </div>
        </div>
      </div>
    </header>
  );
};
