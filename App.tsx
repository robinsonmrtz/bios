import { useState } from 'react';
import { AuthGate } from './core/auth/AuthGate';
import { GridBackground } from './shared/components/GridBackground';
import { AppLayout } from './modules/dashboard/AppLayout';
import { DashboardShell } from './modules/dashboard/DashboardShell';
import { FinanzasModule } from './modules/finanzas/FinanzasModule';

function App() {
  const [activeModule, setActiveModule] = useState('dashboard');

  return (
    <div className="min-h-screen relative">
      <GridBackground />
      <AuthGate>
        <AppLayout activeModule={activeModule} onSelectModule={setActiveModule}>
          {activeModule === 'finanzas' ? <FinanzasModule /> : <DashboardShell />}
        </AppLayout>
      </AuthGate>
    </div>
  );
}

export default App;
