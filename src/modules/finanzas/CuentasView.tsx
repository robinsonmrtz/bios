import { useEffect, useState } from 'react';
import CuentaWidget, { type CuentaData } from './widgets/CuentaWidget';
import { Modal } from '../../shared/components/Modal';
import { IconPlus, IconTrash } from '../../shared/icons';
import { ColorPicker, ImageLogoInput, ToggleCard } from '../../shared/components/FormControls';
import { getCuentas, crearCuenta, getTransacciones, calcularSaldoCuenta } from '../../core/db/db';

export function CuentasView() {
  const [cuentas, setCuentas] = useState<CuentaData[]>([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // Estados del Modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoSaldo, setNuevoSaldo] = useState('');
  const [nuevoLogo, setNuevoLogo] = useState('');
  const [nuevoColor, setNuevoColor] = useState('#3498db');
  const [incluirDashboard, setIncluirDashboard] = useState(true);

  async function cargarCuentas() {
    setCargando(true);
    try {
      // Traemos cuentas Y transacciones juntas: el saldo de cada cuenta
      // depende de sumar/restar todas las transacciones que la tocan.
      const [filas, transacciones] = await Promise.all([getCuentas(), getTransacciones()]);

      setCuentas(
        filas.map((fila) => {
          const saldo = calcularSaldoCuenta(fila.id!, fila.saldo_inicial, transacciones);
          return {
            id: fila.id!,
            nombre: fila.nombre,
            // TODO: cuando exista navegación de mes (pantalla Transacciones/Resumen),
            // saldoPrevisto pasa a incluir también las transacciones PENDIENTES
            // hasta el fin del mes navegado, igual que hacía el piloto. Por ahora
            // son iguales porque no hay mes que navegar todavía.
            saldoActual: saldo,
            saldoPrevisto: saldo,
            color: fila.color || '#3498db',
            logo: fila.logo || undefined,
          };
        })
      );
    } catch (err) {
      console.error('Error cargando cuentas:', err);
      alert('No se pudieron cargar las cuentas. Revisa la consola.');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarCuentas();
  }, []);

  async function handleGuardarCuenta() {
    if (!nuevoNombre.trim()) return alert('El nombre es obligatorio');

    setGuardando(true);
    try {
      await crearCuenta({
        nombre: nuevoNombre.trim(),
        saldo_inicial: parseFloat(nuevoSaldo) || 0,
        color: nuevoColor,
        logo: nuevoLogo || undefined,
        incluir_dashboard: incluirDashboard,
      });
      // Recargamos todo (cuentas + transacciones) en vez de solo empujar la
      // nueva al estado — así el saldo se calcula igual para todas.
      await cargarCuentas();
      limpiarYCerrar();
    } catch (err) {
      console.error('Error guardando cuenta:', err);
      alert('No se pudo guardar la cuenta. Revisa la consola.');
    } finally {
      setGuardando(false);
    }
  }

  function limpiarYCerrar() {
    setNuevoNombre('');
    setNuevoSaldo('');
    setNuevoLogo('');
    setNuevoColor('#3498db');
    setIncluirDashboard(true);
    setModalAbierto(false);
  }

  const anchoSaldoCh = Math.max((nuevoSaldo || '0.00').length + 1, 5);

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <button
          onClick={() => setModalAbierto(true)}
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
              <CuentaWidget cuenta={cuenta} />
            </div>
          ))}
      </div>

      <Modal open={modalAbierto} title="Añadir cuenta" onCancel={limpiarYCerrar} hideDefaultFooter>
        <div className="flex flex-col mt-2">
          <div className="flex flex-col items-center justify-center mb-6 mt-2">
            <div className="flex items-center justify-center gap-1">
              <span className="text-[24px] font-display font-bold flex-shrink-0" style={{ color: 'var(--bios-text-dim)' }}>$</span>
              <input
                type="number"
                value={nuevoSaldo}
                onChange={(e) => setNuevoSaldo(e.target.value)}
                placeholder="0.00"
                className="bg-transparent text-[38px] font-display font-bold outline-none text-left min-w-0"
                style={{ color: 'var(--bios-text)', width: `${anchoSaldoCh}ch` }}
              />
            </div>
            <div className="w-full max-w-[220px] h-px mt-1 border-b border-dashed mx-auto" style={{ borderColor: 'var(--bios-border)' }} />
          </div>

          <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-[11px]" style={{ color: 'var(--bios-text-dim)' }}>Nombre de la institución financiera</label>
            <input
              type="text"
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
              placeholder="Ej. Bancolombia, Efectivo..."
              className="w-full bg-black/20 border rounded-[10px] px-3 py-2.5 text-[13px] outline-none transition-colors"
              style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text)' }}
            />
          </div>

          <div className="flex flex-col gap-4 mb-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px]" style={{ color: 'var(--bios-text-dim)' }}>URL del Logo institucional</label>
              <ImageLogoInput url={nuevoLogo} onChange={setNuevoLogo} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px]" style={{ color: 'var(--bios-text-dim)' }}>Color distintivo</label>
              <ColorPicker value={nuevoColor} onChange={setNuevoColor} />
            </div>
          </div>

          <div className="mb-6">
            <ToggleCard
              label="Incluir en la suma del dashboard"
              description="El saldo acumulado se sumará al patrimonio total visible."
              checked={incluirDashboard}
              onChange={setIncluirDashboard}
            />
          </div>

          <div className="flex justify-between items-center pt-4 border-t" style={{ borderColor: 'var(--bios-border)' }}>
            <button
              onClick={() => { setNuevoNombre(''); setNuevoSaldo(''); setNuevoLogo(''); setNuevoColor('#3498db'); }}
              className="flex items-center gap-1.5 text-[11px] px-3 py-2 rounded-lg transition-colors hover:bg-white/5"
              style={{ color: 'var(--bios-text-dim)' }}
            >
              <IconTrash size={14} /> Limpiar campos
            </button>

            <button
              onClick={handleGuardarCuenta}
              disabled={guardando}
              className="text-[12px] font-semibold px-4 py-2 rounded-lg transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: 'var(--bios-accent)', color: '#0a1120' }}
            >
              {guardando ? 'Guardando...' : 'Guardar cuenta'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}