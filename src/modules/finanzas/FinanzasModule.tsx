import { useState } from 'react';
import { FinanzasNav } from './FinanzasNav';
import { CuentasView } from './CuentasView';

export function FinanzasModule() {
  const [tab, setTab] = useState('cuentas'); // Puse 'cuentas' por defecto para que lo veas de una

  return (
    <div className="pb-10">
      <div className="max-w-[1180px] mx-auto px-5 pt-4">
        <h1 className="font-display font-bold text-[15px] mb-3">Finanzas</h1>
        <FinanzasNav active={tab} onChange={setTab} />
        
        {/* Enrutador interno del módulo */}
        {tab === 'cuentas' ? (
          <CuentasView />
        ) : (
          <div className="py-10 text-center font-mono text-[11px]" style={{ color: 'var(--bios-text-faint)' }}>
            — contenido de "{tab}" en construcción —
          </div>
        )}
      </div>
    </div>
  );
}