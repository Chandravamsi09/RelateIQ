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
