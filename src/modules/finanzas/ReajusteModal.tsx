import { useEffect, useState } from 'react';
import { Modal } from '../../shared/components/Modal';
import { reajustarSaldoCuenta, type Cuenta } from '../../core/db/db';

interface Props { open: boolean; cuenta: Cuenta | null; saldoActual: number; onClose: () => void; onSaved: () => void; }

export function ReajusteModal({ open, cuenta, saldoActual, onClose, onSaved }: Props) {
  const [nuevoSaldo, setNuevoSaldo] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => { if (open) setNuevoSaldo(saldoActual.toFixed(2)); }, [open, saldoActual]);

  async function handleConfirmar() {
    setGuardando(true);
    try {
      await reajustarSaldoCuenta(cuenta!, saldoActual, parseFloat(nuevoSaldo), 'transaccion', 'Reajuste manual');
      onSaved(); onClose();
    } finally { setGuardando(false); }
  }

  const footer = (
    <>
      <button onClick={onClose} className="px-4 py-2.5 rounded-[10px] text-[13px] font-semibold text-gray-600 border hover:bg-gray-50">Cancelar</button>
      <button onClick={handleConfirmar} disabled={guardando} className="px-5 py-2.5 rounded-[10px] text-[13px] font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">Confirmar</button>
    </>
  );

  return (
    <Modal open={open} title={`Reajustar saldo: ${cuenta?.nombre}`} onClose={onClose} maxWidth="sm" footer={footer}>
      <div className="flex flex-col gap-4 text-center mt-2">
        <p className="text-[13px] text-gray-600">Saldo actual del sistema: <b className="text-gray-900">${saldoActual.toFixed(2)}</b></p>
        <div className="flex items-center gap-1 justify-center bg-gray-50 p-4 rounded-xl border border-gray-200">
          <span className="text-[28px] font-bold text-gray-400">$</span>
          <input type="number" value={nuevoSaldo} onChange={(e) => setNuevoSaldo(e.target.value)} className="w-2/3 text-[32px] text-center font-bold text-gray-900 outline-none bg-transparent" />
        </div>
      </div>
    </Modal>
  );
}