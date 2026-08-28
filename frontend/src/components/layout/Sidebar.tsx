import React from 'react';

export const Sidebar: React.FC<{
  currentView: string;
  onViewChange: (view: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}> = ({ currentView, onViewChange, collapsed, onToggleCollapse }) => {
  const navItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: '??' },
    { id: 'leads', label: 'Lead Engine', icon: '??' },
    { id: 'deals', label: 'Deal Pipeline Kanban', icon: '??' },
    { id: 'accounts', label: 'Accounts & 360', icon: '??' },
    { id: 'contacts', label: 'Contact Registry', icon: '??' },
    { id: 'activities', label: 'Tasks & Meetings', icon: '??' },
    { id: 'support', label: 'Support & SLA Desk', icon: '??' },
    { id: 'workflows', label: 'Workflow Automations', icon: '?' },
    { id: 'analytics', label: 'Analytics & BI', icon: '??' },
    { id: 'settings', label: 'RBAC & Settings', icon: '??' }
  ];

  return (
    <aside className={`${collapsed ? 'w-20' : 'w-64'} transition-all duration-300 bg-slate-950 border-r border-slate-800 flex flex-col flex-shrink-0`}>
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/30">
              R
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              RelateIQ
            </span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          {collapsed ? '??' : '??'}
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
        {!collapsed && <p>Enterprise Edition v1.0</p>}
      </div>
    </aside>
  );
};
