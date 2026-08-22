import { useEffect, useState } from 'react';
import { Modal } from '../../shared/components/Modal';
import { crearCuenta, actualizarCuenta, type Cuenta } from '../../core/db/db';

interface Props { open: boolean; cuentaExistente: Cuenta | null; onClose: () => void; onSaved: () => void; onSolicitarReajuste: (cuenta: Cuenta) => void; }

export function CuentaFormModal({ open, cuentaExistente, onClose, onSaved, onSolicitarReajuste }: Props) {
  const [nombre, setNombre] = useState(''); const [saldo, setSaldo] = useState('');
  const [guardando, setGuardando] = useState(false);
  const editando = !!cuentaExistente?.id;

  useEffect(() => {
    if (cuentaExistente) { setNombre(cuentaExistente.nombre); setSaldo(String(cuentaExistente.saldo_inicial)); } 
    else { setNombre(''); setSaldo(''); }
  }, [open, cuentaExistente]);

  async function handleGuardar() {
    setGuardando(true);
    try {
      const payload = { nombre: nombre.trim(), saldo_inicial: parseFloat(saldo) || 0 };
      if (editando) await actualizarCuenta(cuentaExistente!.id!, payload);
      else await crearCuenta({ ...payload, incluir_dashboard: true, archivada: false });
      onSaved(); onClose();
    } finally { setGuardando(false); }
  }

  const footer = (
    <>
      <button onClick={() => editando ? onSolicitarReajuste(cuentaExistente!) : setNombre('')} className="mr-auto text-[12px] font-semibold text-blue-600 hover:underline">
        {editando ? 'Reajustar saldo en su lugar' : 'Limpiar'}
      </button>
      <button onClick={onClose} className="px-4 py-2.5 rounded-[10px] text-[13px] font-semibold text-gray-600 border hover:bg-gray-50">Cancelar</button>
      <button onClick={handleGuardar} disabled={guardando} className="px-5 py-2.5 rounded-[10px] text-[13px] font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">Guardar</button>
    </>
  );

  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-[10px] px-3 py-2.5 text-[13px] text-gray-800 outline-none focus:border-blue-500 focus:bg-white";
  const labelClass = "block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1.5";

  return (
    <Modal open={open} title={editando ? 'Editar Cuenta' : 'Nueva Cuenta'} onClose={onClose} maxWidth="sm" footer={footer}>
      <div className="flex flex-col gap-4 mt-2">
        <div className="flex items-center gap-1 justify-center mb-4">
          <span className="text-[28px] font-bold text-gray-400">$</span>
          <input type="number" value={saldo} onChange={(e) => setSaldo(e.target.value)} placeholder="0.00" className="w-2/3 text-[32px] text-center font-bold text-gray-900 outline-none bg-transparent" />
        </div>
        <div>
          <label className={labelClass}>Nombre de la institución</label>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Bancolombia..." className={inputClass} />
        </div>
      </div>
    </Modal>
  );
}