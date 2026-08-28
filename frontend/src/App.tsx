import React, { useState } from 'react';
import { AppShell } from './components/layout/AppShell';
import { DashboardView } from './views/DashboardView';
import { DealsKanbanView } from './views/DealsKanbanView';
import { LeadsListView } from './views/LeadsListView';
import { AccountsListView } from './views/AccountsListView';
import { ContactsListView } from './views/ContactsListView';
import { ActivitiesCalendarView } from './views/ActivitiesCalendarView';
import { SupportDeskView } from './views/SupportDeskView';
import { WorkflowAutomationBuilderView } from './views/WorkflowAutomationBuilderView';
import { AnalyticsBiDashboardView } from './views/AnalyticsBiDashboardView';
import { SettingsRbacView } from './views/SettingsRbacView';

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
      case 'accounts':
        return <AccountsListView />;
      case 'contacts':
        return <ContactsListView />;
      case 'activities':
        return <ActivitiesCalendarView />;
      case 'support':
        return <SupportDeskView />;
      case 'workflows':
        return <WorkflowAutomationBuilderView />;
      case 'analytics':
        return <AnalyticsBiDashboardView />;
      case 'settings':
        return <SettingsRbacView />;
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
