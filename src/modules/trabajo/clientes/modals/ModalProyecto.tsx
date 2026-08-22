import { useState, useEffect } from 'react';
import { Modal } from '../../../../shared/components/Modal';
import { crearProyecto, actualizarProyecto } from '../../services/trabajoService';
import type { ProyectoTrabajo } from '../../types/trabajo.types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  clienteId: string;
  proyectoAEditar?: ProyectoTrabajo | null;
}

export function ModalProyecto({ open, onClose, onSaved, clienteId, proyectoAEditar }: Props) {
  const [nombre, setNombre] = useState('');
  const [promedioPalabras, setPromedioPalabras] = useState(3000);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (proyectoAEditar) {
      setNombre(proyectoAEditar.nombre);
      setPromedioPalabras(proyectoAEditar.promedio_palabras || 3000);
    } else {
      setNombre('');
      setPromedioPalabras(3000);
    }
  }, [proyectoAEditar, open]);

  async function handleGuardar() {
    if (!nombre.trim()) return alert('El nombre del proyecto es obligatorio.');
    setGuardando(true);
    try {
      if (proyectoAEditar) {
        await actualizarProyecto(proyectoAEditar.id, nombre.trim(), promedioPalabras);
      } else {
        await crearProyecto({ cliente_id: clienteId, nombre: nombre.trim(), promedio_palabras: promedioPalabras });
      }
      onSaved();
      onClose();
    } catch (error) {
      console.error('Error guardando proyecto:', error);
      alert('Hubo un error al guardar el proyecto.');
    } finally {
      setGuardando(false);
    }
  }

  const footer = (
    <>
      <button onClick={onClose} className="px-4 py-2.5 rounded-[10px] text-[13px] font-semibold text-gray-600 border hover:bg-gray-50">Cancelar</button>
      <button onClick={handleGuardar} disabled={guardando} className="px-5 py-2.5 rounded-[10px] text-[13px] font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
        {guardando ? 'Guardando...' : 'Guardar Proyecto'}
      </button>
    </>
  );

  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-[10px] px-3 py-2 text-[13px] text-gray-800 outline-none focus:border-blue-500 focus:bg-white";
  const labelClass = "block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1.5";

  return (
    <Modal open={open} title={proyectoAEditar ? 'Editar Proyecto' : 'Nuevo Proyecto'} onClose={onClose} maxWidth="sm" footer={footer}>
      <div className="flex flex-col gap-4 mt-2">
        <div>
          <label className={labelClass}>Nombre del Proyecto / Canal</label>
          <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej: Canal Principal, Shorts, Podcast..." className={inputClass} autoFocus />
        </div>
        <div>
          <label className={labelClass}>Promedio de Palabras (para barra de progreso)</label>
          <input type="number" value={promedioPalabras} onChange={e => setPromedioPalabras(Number(e.target.value))} className={inputClass} />
        </div>
      </div>
    </Modal>
  );
}