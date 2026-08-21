import { useEffect, useState } from 'react';
import { Modal } from '../../shared/components/Modal';
import { IconAdjustmentsHorizontal } from '../../shared/icons';
import { reajustarSaldoCuenta, type Cuenta } from '../../core/db/db';

interface Props {
  open: boolean;
  cuenta: Cuenta | null;
  saldoActual: number;
  onClose: () => void;
  onSaved: () => void;
}

const formatearDinero = (monto: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 2 }).format(monto);

export function ReajusteModal({ open, cuenta, saldoActual, onClose, onSaved }: Props) {
  const [nuevoSaldo, setNuevoSaldo] = useState('');
  const [metodo, setMetodo] = useState<'transaccion' | 'inicial'>('transaccion');
  const [descripcion, setDescripcion] = useState('Reajuste de saldo');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!open) return;
    setNuevoSaldo(saldoActual.toFixed(2));
    setMetodo('transaccion');
    setDescripcion('Reajuste de saldo');
  }, [open, saldoActual]);

  async function handleConfirmar() {
    if (!cuenta) return;
    const nuevoSaldoNum = parseFloat(nuevoSaldo);
    if (isNaN(nuevoSaldoNum)) return alert('Ingresa un valor numérico válido.');

    setGuardando(true);
    try {
      await reajustarSaldoCuenta(cuenta, saldoActual, nuevoSaldoNum, metodo, descripcion.trim());
      onSaved();
      onClose();
    } catch (err) {
      console.error('Error en el reajuste:', err);
      alert('No se pudo aplicar el reajuste. Revisa la consola.');
    } finally {
      setGuardando(false);
    }
  }

  if (!cuenta) return null;

  const anchoCh = Math.max((nuevoSaldo || '0.00').length + 1, 5);

  return (
    <Modal open={open} title="" onCancel={onClose} hideDefaultFooter>
      <div className="flex flex-col mt-1">
        <div className="flex items-center gap-2 mb-4">
          <IconAdjustmentsHorizontal size={17} style={{ color: 'var(--bios-accent)' }} />
          <h3 className="font-display text-[14px] font-bold" style={{ color: 'var(--bios-accent)' }}>
            Reajuste de Saldo
          </h3>
        </div>

        <div
          className="rounded-[10px] p-3 mb-5 flex flex-col gap-1"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--bios-border)' }}
        >
          <span className="text-[12px]" style={{ color: 'var(--bios-text-dim)' }}>
            Cuenta seleccionada: <strong style={{ color: 'var(--bios-text)' }}>{cuenta.nombre}</strong>
          </span>
          <span className="text-[12px]" style={{ color: 'var(--bios-text-dim)' }}>
            Saldo contable actual: <strong style={{ color: 'var(--bios-accent)' }}>{formatearDinero(saldoActual)}</strong>
          </span>
        </div>

        <div className="flex items-center justify-center gap-1 mb-5">
          <span className="text-[20px] font-display font-bold flex-shrink-0" style={{ color: 'var(--bios-text)' }}>$</span>
          <input
            type="number"
            value={nuevoSaldo}
            onChange={(e) => setNuevoSaldo(e.target.value)}
            className="bg-transparent text-[28px] sm:text-[34px] font-display font-bold outline-none text-left min-w-0"
            style={{ color: 'var(--bios-text)', width: `${anchoCh}ch` }}
          />
        </div>

        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-[11px]" style={{ color: 'var(--bios-text-dim)' }}>Método de Ajuste</label>
          <select
            value={metodo}
            onChange={(e) => setMetodo(e.target.value as 'transaccion' | 'inicial')}
            className="w-full bg-black/20 border rounded-[10px] px-3 py-2.5 text-[13px] outline-none"
            style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text)' }}
          >
            <option value="transaccion">📝 Crear una transacción de ajuste (deja registro)</option>
            <option value="inicial">🏦 Ajustar saldo inicial base (silencioso / sin registro)</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5 mb-6">
          <label className="text-[11px]" style={{ color: 'var(--bios-text-dim)' }}>Descripción o motivo del ajuste</label>
          <input
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Ej. Cuadre de caja, corrección de extracto..."
            className="w-full bg-black/20 border rounded-[10px] px-3 py-2.5 text-[13px] outline-none"
            style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text)' }}
          />
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t" style={{ borderColor: 'var(--bios-border)' }}>
          <button
            onClick={onClose}
            className="text-[11px] px-3 py-2 rounded-lg border"
            style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text-dim)' }}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmar}
            disabled={guardando}
            className="text-[12px] font-semibold px-4 py-2 rounded-lg disabled:opacity-50"
            style={{ background: 'var(--bios-accent)', color: '#0a1120' }}
          >
            {guardando ? 'Aplicando...' : 'Confirmar reajuste'}
          </button>
        </div>
      </div>
    </Modal>
  );
}