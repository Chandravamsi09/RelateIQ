import React from 'react';
import {
  IconDashboard,
  IconKanban,
  IconLeads,
  IconAccounts,
  IconContacts,
  IconActivities,
  IconSupport,
  IconWorkflows,
  IconAnalytics,
  IconSettings
} from '../ui/Icons';

export const Sidebar: React.FC<{
  currentView: string;
  onViewChange: (view: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}> = ({ currentView, onViewChange, collapsed, onToggleCollapse }) => {
  const navItems = [
    { id: 'dashboard', label: 'Executive Dashboard', Icon: IconDashboard },
    { id: 'deals', label: 'Deal Pipeline Kanban', Icon: IconKanban },
    { id: 'leads', label: 'Lead Intelligence', Icon: IconLeads },
    { id: 'accounts', label: 'Accounts & 360', Icon: IconAccounts },
    { id: 'contacts', label: 'Contact Registry', Icon: IconContacts },
    { id: 'activities', label: 'Tasks & Meetings', Icon: IconActivities },
    { id: 'support', label: 'Support & SLA Desk', Icon: IconSupport },
    { id: 'workflows', label: 'Workflow Automations', Icon: IconWorkflows },
    { id: 'analytics', label: 'Analytics & BI', Icon: IconAnalytics },
    { id: 'settings', label: 'RBAC & Settings', Icon: IconSettings }
  ];

  return (
    <aside className={`${collapsed ? 'w-20' : 'w-64'} transition-all duration-300 bg-slate-950 border-r border-slate-800 flex flex-col flex-shrink-0`}>
      
      {/* Header */}
      <div className={`h-16 flex items-center ${collapsed ? 'justify-center' : 'justify-between px-4'} border-b border-slate-800`}>
        {!collapsed ? (
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/25 flex-shrink-0">
              R
            </div>
            <div className="min-w-0">
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent truncate block">
                RelateIQ
              </span>
              <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-semibold truncate">Enterprise CRM</span>
            </div>
          </div>
        ) : (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/25">
            R
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          )}
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map(item => {
          const isActive = currentView === item.id;
          const IconComp = item.Icon;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center ${collapsed ? 'justify-center px-0' : 'gap-3 px-3.5'} py-2.5 rounded-xl font-medium text-sm transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <IconComp className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800/80 text-xs text-slate-500 flex items-center justify-between">
        {!collapsed ? (
          <>
            <span className="flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Enterprise Ready
            </span>
            <span className="font-mono text-[10px]">v1.0</span>
          </>
        ) : (
          <div className="w-full flex justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="Enterprise Ready"></span>
          </div>
        )}
      </div>
    </aside>
  );
};
