import { useEffect, useState } from 'react';
import CuentaWidget, { type CuentaData } from './widgets/CuentaWidget';
import { IconPlus } from '../../shared/icons';
import { getCuentas, getTransacciones, calcularSaldoCuenta, archivarCuenta, type Cuenta, type Transaccion } from '../../core/db/db';
import { CuentaFormModal } from './CuentaFormModal';
import { ReajusteModal } from './ReajusteModal';

export function CuentasView() {
  const [cuentasRaw, setCuentasRaw] = useState<Cuenta[]>([]);
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [cargando, setCargando] = useState(true);

  const [formAbierto, setFormAbierto] = useState(false);
  const [cuentaEditando, setCuentaEditando] = useState<Cuenta | null>(null);

  const [reajusteAbierto, setReajusteAbierto] = useState(false);
  const [cuentaParaReajustar, setCuentaParaReajustar] = useState<Cuenta | null>(null);
  const [saldoParaReajustar, setSaldoParaReajustar] = useState(0);

  async function cargar() {
    setCargando(true);
    try {
      const [filas, trans] = await Promise.all([getCuentas(), getTransacciones()]);
      setCuentasRaw(filas);
      setTransacciones(trans);
    } catch (err) {
      console.error('Error cargando cuentas:', err);
      alert('No se pudieron cargar las cuentas. Revisa la consola.');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  const cuentas: CuentaData[] = cuentasRaw.map((fila) => {
    const saldo = calcularSaldoCuenta(fila.id!, fila.saldo_inicial, transacciones);
    return {
      id: fila.id!,
      nombre: fila.nombre,
      // TODO: saldoPrevisto pasa a incluir pendientes hasta fin de mes
      // navegado cuando conectemos el MonthSelector aquí también.
      saldoActual: saldo,
      saldoPrevisto: saldo,
      color: fila.color || '#3498db',
      logo: fila.logo || undefined,
    };
  });

  function abrirNueva() {
    setCuentaEditando(null);
    setFormAbierto(true);
  }

  function abrirEditar(id: string) {
    const raw = cuentasRaw.find((c) => c.id === id);
    if (raw) {
      setCuentaEditando(raw);
      setFormAbierto(true);
    }
  }

  function abrirReajuste(cuenta: Cuenta) {
    const saldo = calcularSaldoCuenta(cuenta.id!, cuenta.saldo_inicial, transacciones);
    setCuentaParaReajustar(cuenta);
    setSaldoParaReajustar(saldo);
    setReajusteAbierto(true);
  }

  async function handleArchivar(id: string) {
    if (!confirm('¿Archivar esta cuenta? Las transacciones pasadas se mantendrán seguras.')) return;
    const ok = await archivarCuenta(id);
    if (ok) await cargar();
    else alert('No se pudo archivar la cuenta.');
  }

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <button
          onClick={abrirNueva}
          className="rounded-[11px] border-2 border-dashed flex flex-col items-center justify-center gap-2 min-h-[160px] transition-colors hover:bg-white/5"
          style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text-dim)' }}
        >
          <div className="w-10 h-10 rounded-full border flex items-center justify-center" style={{ borderColor: 'var(--bios-border)' }}>
            <IconPlus size={20} />
          </div>
          <span className="text-[13px] font-medium">Nueva cuenta</span>
        </button>

        {cargando && (
          <div className="col-span-full text-[12px] text-center py-6" style={{ color: 'var(--bios-text-dim)' }}>
            Cargando cuentas...
          </div>
        )}

        {!cargando &&
          cuentas.map((cuenta) => (
            <div
              key={cuenta.id}
              className="rounded-[11px] border p-3 flex flex-col min-h-[160px]"
              style={{
                background: 'linear-gradient(160deg, var(--bios-card-a), var(--bios-card-b))',
                borderColor: 'var(--bios-border)',
              }}
            >
              <CuentaWidget
                cuenta={cuenta}
                onEditar={() => abrirEditar(cuenta.id)}
                onArchivar={() => handleArchivar(cuenta.id)}
              />
            </div>
          ))}
      </div>

      <CuentaFormModal
        open={formAbierto}
        cuentaExistente={cuentaEditando}
        onClose={() => setFormAbierto(false)}
        onSaved={cargar}
        onSolicitarReajuste={abrirReajuste}
      />

      <ReajusteModal
        open={reajusteAbierto}
        cuenta={cuentaParaReajustar}
        saldoActual={saldoParaReajustar}
        onClose={() => setReajusteAbierto(false)}
        onSaved={cargar}
      />
    </div>
  );
}