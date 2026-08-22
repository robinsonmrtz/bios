import { useState } from 'react';
import { TrabajoNav } from './TrabajoNav';
import { ClientesView } from './clientes/ClientesView'; // 1. IMPORTAR LA VISTA DE CLIENTES

export function TrabajoModule() {
  const [tab, setTab] = useState('clientes'); 

  return (
    <div className="pb-20 md:pb-10">
      <div className="w-full px-5 sm:px-8 pt-4">
        <h1 className="font-display font-bold text-[15px] mb-3">Trabajo</h1>
        
        <TrabajoNav active={tab} onChange={setTab} />

        <div className="mt-6">
          {tab === 'dashboard' && (
            <div className="py-10 text-center font-mono text-[11px]" style={{ color: 'var(--bios-text-faint)' }}>
              — Dashboard General en construcción —
            </div>
          )}
          
          {/* 2. RENDERIZAR <ClientesView /> AQUÍ */}
          {tab === 'clientes' && <ClientesView />}

          {tab === 'proyectos' && (
            <div className="py-10 text-center font-mono text-[11px]" style={{ color: 'var(--bios-text-faint)' }}>
              — Vista de Proyectos en construcción —
            </div>
          )}

          {tab === 'contabilidad' && (
            <div className="py-10 text-center font-mono text-[11px]" style={{ color: 'var(--bios-text-faint)' }}>
              — Vista de Contabilidad en construcción —
            </div>
          )}

          {tab === 'tareas' && (
            <div className="py-10 text-center font-mono text-[11px]" style={{ color: 'var(--bios-text-faint)' }}>
              — Vista de Tareas en construcción —
            </div>
          )}
        </div>
      </div>
    </div>
  );
}