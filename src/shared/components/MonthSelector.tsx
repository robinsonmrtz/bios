import { IconChevronLeft, IconChevronRight } from '../icons';

interface Props {
  mes: Date;
  onAnterior: () => void;
  onSiguiente: () => void;
}

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

/**
 * Selector de mes compartido por TODO el módulo de finanzas (no es solo de
 * una pantalla). Vive como estado en FinanzasModule.tsx y se le pasa a
 * cualquier pantalla que necesite filtrar por el mes navegado
 * (Transacciones, Resumen, Presupuestos, Informes...).
 */
export function MonthSelector({ mes, onAnterior, onSiguiente }: Props) {
  const etiqueta = `${MESES[mes.getMonth()]} ${mes.getFullYear()}`;

  return (
    <div
      className="flex items-center justify-between rounded-[12px] border px-2 py-2 mb-4"
      style={{
        background: 'linear-gradient(160deg, var(--bios-card-a), var(--bios-card-b))',
        borderColor: 'var(--bios-border)',
      }}
    >
      <button
        onClick={onAnterior}
        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5"
        style={{ color: 'var(--bios-text-dim)' }}
      >
        <IconChevronLeft size={18} />
      </button>
      <h3 className="font-display font-bold text-[14px]">{etiqueta}</h3>
      <button
        onClick={onSiguiente}
        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5"
        style={{ color: 'var(--bios-text-dim)' }}
      >
        <IconChevronRight size={18} />
      </button>
    </div>
  );
}