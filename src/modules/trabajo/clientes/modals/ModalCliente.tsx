import { useState, useEffect } from 'react';
import { Modal } from '../../../../shared/components/Modal';
import { crearCliente, actualizarCliente, crearProyecto } from '../../services/trabajoService';
import type { Cliente } from '../../types/trabajo.types';

interface Props { open: boolean; clienteAEditar?: Cliente | null; onClose: () => void; onSaved: () => void; }

export function ModalCliente({ open, clienteAEditar, onClose, onSaved }: Props) {
  const [nombre, setNombre] = useState(''); const [proyectoBase, setProyectoBase] = useState('');
  const [pais, setPais] = useState(''); const [promedioPalabras, setPromedioPalabras] = useState(3000);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (clienteAEditar) { setNombre(clienteAEditar.nombre); setProyectoBase(clienteAEditar.proyecto || ''); setPais(clienteAEditar.pais || ''); setPromedioPalabras(clienteAEditar.promedio_palabras || 3000); } 
    else { setNombre(''); setProyectoBase(''); setPais(''); setPromedioPalabras(3000); }
  }, [clienteAEditar, open]);

  async function handleGuardar() {
    setGuardando(true);
    try {
      if (clienteAEditar) await actualizarCliente(clienteAEditar.id, { nombre, proyecto: proyectoBase, pais, promedio_palabras: promedioPalabras });
      else {
        const nc = await crearCliente({ nombre, proyecto: proyectoBase, pais, promedio_palabras: promedioPalabras });
        if (nc) await crearProyecto({ cliente_id: nc.id, nombre: proyectoBase || 'Proyecto Principal' });
      }
      onSaved(); onClose();
    } finally { setGuardando(false); }
  }

  const footer = (
    <>
      <button onClick={onClose} className="px-4 py-2.5 rounded-[10px] text-[13px] font-semibold text-gray-600 border hover:bg-gray-50">Cancelar</button>
      <button onClick={handleGuardar} disabled={guardando} className="px-5 py-2.5 rounded-[10px] text-[13px] font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">Guardar cliente</button>
    </>
  );

  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-[10px] px-3 py-2 text-[13px] text-gray-800 outline-none focus:border-blue-500 focus:bg-white";
  const labelClass = "block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1.5";

  return (
    <Modal open={open} title={clienteAEditar ? 'Editar cliente' : 'Nuevo cliente'} onClose={onClose} maxWidth="md" footer={footer}>
      <div className="flex flex-col gap-4 mt-2">
        <div><label className={labelClass}>Nombre / Canal</label><input value={nombre} onChange={e => setNombre(e.target.value)} className={inputClass} /></div>
        <div><label className={labelClass}>Servicio base</label><input value={proyectoBase} onChange={e => setProyectoBase(e.target.value)} className={inputClass} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelClass}>País</label><input value={pais} onChange={e => setPais(e.target.value)} className={inputClass} /></div>
          <div><label className={labelClass}>Promedio Palabras</label><input type="number" value={promedioPalabras} onChange={e => setPromedioPalabras(Number(e.target.value))} className={inputClass} /></div>
        </div>
      </div>
    </Modal>
  );
}