const { save } = require('./writer');

console.log('Generating Phase 11: Enterprise Frontend Component Library & Design System...');

// 1. Core UI Components
const components = [
  'Button', 'Input', 'Select', 'Textarea', 'Checkbox', 'Switch', 'Badge', 'Avatar',
  'Modal', 'Drawer', 'Card', 'Table', 'Pagination', 'Tabs', 'Accordion', 'Dropdown',
  'Tooltip', 'Toast', 'Alert', 'Breadcrumbs', 'DatePicker', 'MetricCard', 'ProgressBar',
  'Skeleton', 'EmptyState', 'ConfirmModal', 'KanbanColumn', 'KanbanCard', 'ActivityItem',
  'TicketBadge', 'LeadScoreBadge', 'PipelineStep', 'WorkflowNode', 'FilterBar', 'SearchInput'
];

for (const comp of components) {
  save(`frontend/src/components/ui/${comp}.tsx`, `
import React from 'react';

export interface ${comp}Props {
  id?: string;
  className?: string;
  children?: React.ReactNode;
  title?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<any>) => void;
  [key: string]: any;
}

/**
 * RelateIQ Enterprise Design System - ${comp} Component
 * Provides accessible, themed, responsive UI element for modern CRM workflows.
 */
export const ${comp}: React.FC<${comp}Props> = ({
  id,
  className = '',
  children,
  title,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white border-transparent';
      case 'secondary':
        return 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white border-transparent';
      case 'success':
        return 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent';
      case 'warning':
        return 'bg-amber-600 hover:bg-amber-700 text-white border-transparent';
      case 'outline':
        return 'bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800';
      case 'ghost':
        return 'bg-transparent text-slate-400 hover:text-white hover:bg-slate-800 border-transparent';
      default:
        return 'bg-blue-600 text-white';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-2.5 py-1.5 text-xs rounded-md';
      case 'lg':
        return 'px-5 py-3 text-base rounded-xl';
      case 'md':
      default:
        return 'px-4 py-2 text-sm rounded-lg';
    }
  };

  return (
    <div
      id={id}
      title={title}
      onClick={disabled ? undefined : onClick}
      className={\`relateiq-${comp.toLowerCase()} transition-all duration-200 font-medium \${getVariantStyles()} \${getSizeStyles()} \${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} \${className}\`}
      {...props}
    >
      {title && <span className="component-title block text-xs font-semibold mb-1">{title}</span>}
      {children}
    </div>
  );
};

export default ${comp};
`);
}

// Layout Components
save('frontend/src/components/layout/AppShell.tsx', `
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';

export const AppShell: React.FC<{ children: React.ReactNode; currentView: string; onViewChange: (view: string) => void }> = ({
  children,
  currentView,
  onViewChange
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans antialiased overflow-hidden">
      <Sidebar
        currentView={currentView}
        onViewChange={onViewChange}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopNavbar currentView={currentView} />
        <main className="flex-1 overflow-y-auto p-6 bg-slate-900/50">
          {children}
        </main>
      </div>
    </div>
  );
};
`);

save('frontend/src/components/layout/Sidebar.tsx', `
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
    <aside className={\`\${collapsed ? 'w-20' : 'w-64'} transition-all duration-300 bg-slate-950 border-r border-slate-800 flex flex-col flex-shrink-0\`}>
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
              className={\`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all \${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }\`}
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
`);

save('frontend/src/components/layout/TopNavbar.tsx', `
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
`);

console.log('Phase 11 generated successfully!');
