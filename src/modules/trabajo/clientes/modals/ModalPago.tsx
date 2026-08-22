import { useState } from 'react';
import { Modal } from '../../../../shared/components/Modal';
import { createPago } from '../../services/trabajoService';

interface Props { open: boolean; onClose: () => void; onSaved: () => void; clienteId: string; proyectoId: string; }

export function ModalPago({ open, onClose, onSaved, clienteId, proyectoId }: Props) {
  const [cargando, setCargando] = useState(false);
  const [monto, setMonto] = useState<number | ''>('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]); 

  async function handleSubmit() {
    setCargando(true);
    try {
      await createPago({ cliente_id: clienteId, proyecto_id: proyectoId, monto: Number(monto), fecha });
      onSaved(); onClose(); setMonto('');
    } finally { setCargando(false); }
  }

  const footer = (
    <>
      <button onClick={onClose} className="px-4 py-2.5 rounded-[10px] text-[13px] font-semibold text-gray-600 border hover:bg-gray-50">Cancelar</button>
      <button onClick={handleSubmit} disabled={cargando || !monto} className="px-5 py-2.5 rounded-[10px] text-[13px] font-semibold text-white bg-green-500 hover:bg-green-600 disabled:opacity-50">Confirmar Pago</button>
    </>
  );

  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-[10px] px-3 py-2.5 text-[13px] text-gray-800 outline-none focus:border-green-500 focus:bg-white";

  return (
    <Modal open={open} title={<span>Registrar <span className="text-green-500">Adelanto</span></span>} onClose={onClose} maxWidth="sm" footer={footer}>
      <div className="flex flex-col gap-4 mt-2">
        <div className="flex items-center gap-1">
          <span className="text-[28px] font-bold text-green-500">$</span>
          <input type="number" value={monto} onChange={e => setMonto(e.target.value ? Number(e.target.value) : '')} placeholder="0.00" className="w-full text-[32px] font-bold text-gray-900 outline-none bg-transparent" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Fecha del Pago</label>
          <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className={inputClass} />
        </div>
      </div>
    </Modal>
  );
}