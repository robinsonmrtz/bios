import { useEffect, useState } from 'react';
import { LoginGate } from "./core/auth/LoginGate";
import { GridBackground } from './shared/components/GridBackground';
import { AppLayout } from './modules/dashboard/AppLayout';
import { DashboardShell } from './modules/dashboard/DashboardShell';
import { FinanzasModule } from './modules/finanzas/FinanzasModule';
import { TrabajoModule } from './modules/trabajo/TrabajoModule';
import { ConfiguracionModule } from './modules/configuracion/ConfiguracionModule';
import { cargarTema, aplicarTema } from './core/theme/themeStore';
import { supabase } from './core/db/supabase';

function App() {
  const [activeModule, setActiveModule] = useState('dashboard');

  useEffect(() => {
    // Carga inicial (antes de login esto devuelve los valores por defecto,
    // sin romper nada).
    cargarTema().then(aplicarTema);

    // Cuando el login termina (o se cierra sesión), vuelve a cargar el
    // tema real del usuario que acaba de entrar.
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      cargarTema().then(aplicarTema);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen relative">
      <GridBackground />
      <LoginGate>
        <AppLayout activeModule={activeModule} onSelectModule={setActiveModule}>

          {/* CADA MÓDULO CON SU CONDICIÓN EXCLUSIVA */}
          {activeModule === 'dashboard' && <DashboardShell />}
          {activeModule === 'finanzas' && <FinanzasModule />}
          {activeModule === 'trabajo' && <TrabajoModule />}
          {activeModule === 'configuracion' && <ConfiguracionModule />}

        </AppLayout>
      </LoginGate>
    </div>
  );
}

export default App;