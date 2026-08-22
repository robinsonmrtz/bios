import { useState } from 'react';
import { FinanzasNav } from './FinanzasNav';
import { CuentasView } from './CuentasView';
import { CategoriasView } from './CategoriasView';
import { TransaccionesView } from './TransaccionesView';
import { MonthSelector } from '../../shared/components/MonthSelector';

export function FinanzasModule() {
  const [tab, setTab] = useState('cuentas');
  const [mesActual, setMesActual] = useState(new Date());

  function moverMes(direccion: -1 | 1) {
    setMesActual((prev) => {
      const nuevo = new Date(prev);
      nuevo.setMonth(nuevo.getMonth() + direccion);
      return nuevo;
    });
  }

  return (
    <div className="pb-10">
      <div className="w-full px-5 sm:px-8 pt-4">
        <h1 className="font-display font-bold text-[15px] mb-3">Finanzas</h1>
        <FinanzasNav active={tab} onChange={setTab} />

        <MonthSelector mes={mesActual} onAnterior={() => moverMes(-1)} onSiguiente={() => moverMes(1)} />

        {/* Enrutador interno del módulo */}
        {tab === 'cuentas' ? (
          <CuentasView />
        ) : tab === 'categorias' ? (
          <CategoriasView />
          ) : tab === 'transacciones' ? (
         <TransaccionesView mesActual={mesActual} />
          ) : (
          <div className="py-10 text-center font-mono text-[11px]" style={{ color: 'var(--bios-text-faint)' }}>
            — contenido de "{tab}" en construcción —
          </div>
        )}
      </div>
    </div>
  );
}