import { useEffect, useRef, useState } from 'react';
import { IconDots, IconPlus, IconBank, IconPieChart, IconPencil, IconTrash } from '../../../shared/icons';

export interface CuentaData {
  id: string;
  nombre: string;
  saldoActual: number;
  saldoPrevisto: number;
  color: string;
  logo?: string;
}

interface Props {
  cuenta: CuentaData;
  onEditar?: () => void;
  onArchivar?: () => void;
}

const formatearDinero = (monto: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(monto);
};

export default function CuentaWidget({ cuenta, onEditar, onArchivar }: Props) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickFuera(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuAbierto(false);
    }
    document.addEventListener('mousedown', onClickFuera);
    return () => document.removeEventListener('mousedown', onClickFuera);
  }, []);

  const colorActual = cuenta.saldoActual >= 0 ? 'var(--bios-ok)' : 'var(--bios-danger)';
  const colorPrevisto = cuenta.saldoPrevisto >= 0 ? 'var(--bios-ok)' : 'var(--bios-danger)';

  return (
    <div className="flex flex-col h-full w-full justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          {cuenta.logo ? (
            <img src={cuenta.logo} alt="logo" className="w-[30px] h-[30px] rounded-[8px] object-cover" />
          ) : (
            <div
              className="w-[30px] h-[30px] rounded-[8px] flex items-center justify-center text-white"
              style={{ background: cuenta.color }}
            >
              <IconBank size={16} />
            </div>
          )}
          <span className="font-semibold text-[13px] text-[var(--bios-text)]">{cuenta.nombre}</span>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuAbierto((o) => !o)}
            className="text-[var(--bios-text-faint)] hover:text-[var(--bios-text)] transition-colors"
          >
            <IconDots size={16} />
          </button>

          {menuAbierto && (
            <div
              className="absolute top-full right-0 mt-1.5 w-36 rounded-xl border p-1.5 z-20"
              style={{
                background: 'linear-gradient(160deg, var(--bios-card-a), var(--bios-card-b))',
                borderColor: 'var(--bios-border)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
              }}
            >
              <div
                onClick={() => {
                  setMenuAbierto(false);
                  onEditar?.();
                }}
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-[12px] cursor-pointer hover:bg-white/5"
                style={{ color: 'var(--bios-text-dim)' }}
              >
                <IconPencil size={14} /> Editar
              </div>
              <div
                onClick={() => {
                  setMenuAbierto(false);
                  onArchivar?.();
                }}
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-[12px] cursor-pointer hover:bg-white/5"
                style={{ color: 'var(--bios-danger)' }}
              >
                <IconTrash size={14} /> Archivar
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-2">
        <div className="flex justify-between items-end">
          <span className="text-[11px]" style={{ color: 'var(--bios-text-dim)' }}>Saldo actual</span>
          <span className="font-display font-bold text-[16px]" style={{ color: colorActual }}>
            {formatearDinero(cuenta.saldoActual)}
          </span>
        </div>
        <div className="flex justify-between items-end">
          <span className="text-[11px] flex items-center gap-1" style={{ color: 'var(--bios-text-dim)' }}>
            Saldo previsto <IconPieChart size={10} style={{ opacity: 0.6 }} />
          </span>
          <span className="font-display font-medium text-[13px]" style={{ color: colorPrevisto }}>
            {formatearDinero(cuenta.saldoPrevisto)}
          </span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--bios-border)' }}>
        <button
          className="w-full py-1.5 flex items-center justify-center gap-1.5 rounded-lg text-[10.5px] font-semibold transition-colors hover:bg-white/5"
          style={{ color: 'var(--bios-text-dim)', border: '1px solid var(--bios-border)' }}
        >
          <IconPlus size={12} />
          AÑADIR GASTO
        </button>
      </div>
    </div>
  );
}