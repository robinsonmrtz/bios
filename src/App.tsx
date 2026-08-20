import { useState } from 'react';
import { LoginGate } from "./core/auth/LoginGate";
import { GridBackground } from './shared/components/GridBackground';
import { AppLayout } from './modules/dashboard/AppLayout';
import { DashboardShell } from './modules/dashboard/DashboardShell';
import { FinanzasModule } from './modules/finanzas/FinanzasModule';
import { TrabajoModule } from './modules/trabajo/TrabajoModule';

function App() {
  const [activeModule, setActiveModule] = useState('dashboard');

  return (
    <div className="min-h-screen relative">
      <GridBackground />
      <LoginGate>
        <AppLayout activeModule={activeModule} onSelectModule={setActiveModule}>
          
          {/* CADA MÓDULO CON SU CONDICIÓN EXCLUSIVA */}
          {activeModule === 'dashboard' && <DashboardShell />}
          {activeModule === 'finanzas' && <FinanzasModule />}
          {activeModule === 'trabajo' && <TrabajoModule />}

        </AppLayout>
      </LoginGate>
    </div>
  );
}

export default App;