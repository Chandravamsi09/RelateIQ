import React, { useState } from 'react';
import { AppShell } from './components/layout/AppShell';
import { DashboardView } from './views/DashboardView';
import { DealsKanbanView } from './views/DealsKanbanView';
import { LeadsListView } from './views/LeadsListView';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'deals':
        return <DealsKanbanView />;
      case 'leads':
        return <LeadsListView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <AppShell currentView={currentView} onViewChange={setCurrentView}>
      {renderView()}
    </AppShell>
  );
};

export default App;
