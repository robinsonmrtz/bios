import { useState } from 'react';
import { supabase } from '../../../core/db/supabase';

export function MigradorPagos() {
  const [jsonInput, setJsonInput] = useState('');
  const [cargando, setCargando] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  async function procesarMigracion() {
    if (!jsonInput.trim()) return alert('Pega la lista de pagos primero.');
    setCargando(true);
    setLog([]);

    try {
      const pagos = JSON.parse(jsonInput);
      const { data: clientesDb } = await supabase.from('trabajo_clientes').select('id, nombre');
      const { data: proyectosDb } = await supabase.from('trabajo_proyectos').select('id, cliente_id');

      for (const p of pagos) {
        const cliente = clientesDb?.find(c => c.nombre === p.nombre_cliente);
        if (!cliente) {
          setLog(prev => [...prev, `❌ Cliente ${p.nombre_cliente} no encontrado.`]);
          continue;
        }

        const proyecto = proyectosDb?.find(proj => proj.cliente_id === cliente.id);
        if (!proyecto) {
          setLog(prev => [...prev, `❌ Proyecto para ${p.nombre_cliente} no encontrado.`]);
          continue;
        }

        const { error } = await supabase.from('trabajo_pagos').insert([{
          cliente_id: cliente.id,
          proyecto_id: proyecto.id,
          monto: Number(p.monto),
          fecha: p.fecha,
          nota: p.nota || null
        }]);

        if (error) setLog(prev => [...prev, `❌ Error en pago: ${error.message}`]);
        else setLog(prev => [...prev, `✅ Migrado: $${p.monto} a ${p.nombre_cliente}`]);
      }
      setLog(prev => [...prev, '🚀 ¡PROCESO FINALIZADO!']);
    } catch (e: any) {
      setLog([`❌ Error de formato: ${e.message}`]);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="p-4 rounded-[12px] border bg-black/30 my-4" style={{ borderColor: 'var(--bios-border)' }}>
      <h3 className="text-[14px] font-bold mb-2">Importador Final de Pagos</h3>
      <textarea
        rows={4}
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder="Pega aquí la lista de pagos que generamos..."
        className="w-full bg-black/40 border rounded-lg p-3 text-[11px] font-mono outline-none"
        style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text)' }}
      />
      <button onClick={procesarMigracion} disabled={cargando} className="mt-3 px-4 py-2 rounded-lg text-[12px] font-bold" style={{ background: 'var(--bios-ok)', color: '#0a1120' }}>
        {cargando ? 'Migrando...' : 'Migrar Pagos'}
      </button>
      <div className="mt-4 font-mono text-[10px] max-h-[150px] overflow-y-auto" style={{ color: 'var(--bios-text-dim)' }}>
        {log.map((line, i) => <div key={i}>{line}</div>)}
      </div>
    </div>
  );
}