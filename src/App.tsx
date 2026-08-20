import { useState } from 'react';
 import { LoginGate } from "./core/auth/LoginGate";
import { GridBackground } from './shared/components/GridBackground';
import { AppLayout } from './modules/dashboard/AppLayout';
import { DashboardShell } from './modules/dashboard/DashboardShell';
import { FinanzasModule } from './modules/finanzas/FinanzasModule';

function App() {
  const [activeModule, setActiveModule] = useState('dashboard');

  return (
    <div className="min-h-screen relative">
      <GridBackground />
      <LoginGate>
        <AppLayout activeModule={activeModule} onSelectModule={setActiveModule}>
          {activeModule === 'finanzas' ? <FinanzasModule /> : <DashboardShell />}
        </AppLayout>
      </LoginGate>
    </div>
  );
}

export default App;