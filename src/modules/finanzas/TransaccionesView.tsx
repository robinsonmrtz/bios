import { useEffect, useState } from 'react';
import {
  getTransacciones,
  getCategorias,
  getCuentas,
  filtrarPorMes,
  archivarTransaccion,
  type Transaccion,
  type Categoria,
  type Cuenta,
} from '../../core/db/db';
import { IconSwap, IconPlus, IconTrash, IconFilter, IconPencil } from '../../shared/icons';
import { TransaccionModal } from './TransaccionModal';

interface Props {
  mesActual: Date;
}

type FiltroTipo = 'todos' | 'ingreso' | 'gasto' | 'transferencia';

const formatearDinero = (monto: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 2 }).format(monto);

function formatearFecha(fecha: string) {
  const d = new Date(fecha + 'T00:00:00');
  let texto = d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

const FILTROS: { id: FiltroTipo; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'ingreso', label: 'Ingresos' },
  { id: 'gasto', label: 'Gastos' },
  { id: 'transferencia', label: 'Transferencias' },
];

export function TransaccionesView({ mesActual }: Props) {
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [transaccionEditando, setTransaccionEditando] = useState<Transaccion | null>(null);
  const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>('todos');
  const [menuFiltroAbierto, setMenuFiltroAbierto] = useState(false);

  async function cargar() {
    setCargando(true);
    try {
      const [t, c, cu] = await Promise.all([getTransacciones(), getCategorias(), getCuentas()]);
      setTransacciones(t);
      setCategorias(c);
      setCuentas(cu);
    } catch (err) {
      console.error('Error cargando transacciones:', err);
      alert('No se pudieron cargar las transacciones. Revisa la consola.');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  function abrirNuevo() {
    setTransaccionEditando(null);
    setModalAbierto(true);
  }

  function abrirEditar(t: Transaccion) {
    setTransaccionEditando(t);
    setModalAbierto(true);
  }

  async function handleEliminar(id?: string) {
    if (!id) return;
    if (!confirm('¿Eliminar este movimiento? El saldo de la cuenta se ajustará de inmediato.')) return;
    const ok = await archivarTransaccion(id);
    if (ok) await cargar();
    else alert('No se pudo eliminar el movimiento.');
  }

  let delMes = filtrarPorMes(transacciones, mesActual).sort((a, b) => b.fecha.localeCompare(a.fecha));
  if (filtroTipo !== 'todos') {
    delMes = delMes.filter((t) => t.tipo === filtroTipo);
  }

  const grupos: Record<string, Transaccion[]> = {};
  delMes.forEach((t) => {
    if (!grupos[t.fecha]) grupos[t.fecha] = [];
    grupos[t.fecha].push(t);
  });

  function nombreCategoria(id?: string | null) {
    return categorias.find((c) => c.id === id)?.nombre || 'Sin categoría';
  }
  function emojiCategoria(id?: string | null) {
    return categorias.find((c) => c.id === id)?.emoji || '🏷️';
  }
  function colorCategoria(id?: string | null) {
    return categorias.find((c) => c.id === id)?.color || 'var(--bios-text-dim)';
  }
  function nombreCuenta(id?: string | null) {
    return cuentas.find((c) => c.id === id)?.nombre || 'Cuenta desconocida';
  }

  const labelFiltro = FILTROS.find((f) => f.id === filtroTipo)?.label ?? 'Todos';

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-3 gap-2">
        <div className="relative">
          <button
            onClick={() => setMenuFiltroAbierto((o) => !o)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] border"
            style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text-dim)' }}
          >
            <IconFilter size={14} />
            {labelFiltro}
          </button>

          {menuFiltroAbierto && (
            <div
              className="absolute top-full left-0 mt-1.5 w-44 rounded-xl border p-1.5 z-20"
              style={{
                background: 'linear-gradient(160deg, var(--bios-card-a), var(--bios-card-b))',
                borderColor: 'var(--bios-border)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
              }}
            >
              {FILTROS.map((f) => (
                <div
                  key={f.id}
                  onClick={() => {
                    setFiltroTipo(f.id);
                    setMenuFiltroAbierto(false);
                  }}
                  className="px-2.5 py-2 rounded-lg text-[12.5px] cursor-pointer hover:bg-white/5"
                  style={{ color: filtroTipo === f.id ? 'var(--bios-accent)' : 'var(--bios-text-dim)' }}
                >
                  {f.label}
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={abrirNuevo}
          disabled={cuentas.length === 0}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold disabled:opacity-50"
          style={{ background: 'var(--bios-accent)', color: '#0a1120' }}
          title={cuentas.length === 0 ? 'Crea una cuenta primero' : 'Nuevo movimiento'}
        >
          <IconPlus size={15} />
          Nuevo movimiento
        </button>
      </div>

      {cargando && (
        <div className="text-[12px] text-center py-6" style={{ color: 'var(--bios-text-dim)' }}>
          Cargando transacciones...
        </div>
      )}

      {!cargando && delMes.length === 0 && (
        <div
          className="rounded-[11px] border border-dashed p-8 text-center text-[12px]"
          style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text-dim)' }}
        >
          No hay movimientos {filtroTipo !== 'todos' ? `de tipo "${labelFiltro.toLowerCase()}" ` : ''}registrados este mes.
        </div>
      )}

      {!cargando && delMes.length > 0 && (
        <div className="flex flex-col gap-4">
          {Object.keys(grupos).map((fecha) => (
            <div key={fecha}>
              <div className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--bios-text-faint)' }}>
                {formatearFecha(fecha)}
              </div>

              <div className="flex flex-col gap-1.5">
                {grupos[fecha].map((t) => {
                  const esTransferencia = t.tipo === 'transferencia';
                  const esIngreso = t.tipo === 'ingreso';
                  const colorMonto = esTransferencia ? '#2773d6' : esIngreso ? 'var(--bios-ok)' : 'var(--bios-danger)';
                  const signo = esTransferencia ? '⇄ ' : esIngreso ? '+' : '-';

                  // Resumen: categoría · comercio (si tiene) · cuenta — para
                  // transferencias en cambio mostramos origen → destino.
                  const resumen = esTransferencia ? (
                    <>
                      {nombreCuenta(t.cuenta_id)} → {nombreCuenta(t.cuenta_destino_id)}
                    </>
                  ) : (
                    <>
                      {nombreCategoria(t.categoria_id)}
                      {t.comercio && ` · ${t.comercio}`}
                      {' · '}
                      {nombreCuenta(t.cuenta_id)}
                    </>
                  );

                  return (
                    <div
                      key={t.id}
                      className="flex items-center justify-between gap-3 rounded-[11px] border px-3 py-2.5"
                      style={{
                        background: 'linear-gradient(160deg, var(--bios-card-a), var(--bios-card-b))',
                        borderColor: 'var(--bios-border)',
                      }}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="w-8 h-8 rounded-[9px] flex-shrink-0 flex items-center justify-center text-[15px]"
                          style={{
                            background: 'rgba(255,255,255,0.04)',
                            color: esTransferencia ? '#2773d6' : colorCategoria(t.categoria_id),
                          }}
                        >
                          {esTransferencia ? <IconSwap size={16} /> : emojiCategoria(t.categoria_id)}
                        </div>
                        <div className="min-w-0 flex flex-col">
                          <span className="text-[13px] font-semibold truncate" style={{ color: 'var(--bios-text)' }}>
                            {t.descripcion}
                          </span>
                          <span className="text-[11px] truncate flex items-center gap-1" style={{ color: 'var(--bios-text-dim)' }}>
                            {resumen}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="text-[14px] font-bold mr-1" style={{ color: colorMonto }}>
                          {signo}
                          {formatearDinero(t.monto)}
                        </span>
                        <button
                          onClick={() => abrirEditar(t)}
                          className="p-1.5 rounded-md hover:bg-white/5"
                          style={{ color: 'var(--bios-text-faint)' }}
                          title="Editar movimiento"
                        >
                          <IconPencil size={15} />
                        </button>
                        <button
                          onClick={() => handleEliminar(t.id)}
                          className="p-1.5 rounded-md hover:bg-white/5"
                          style={{ color: 'var(--bios-danger)' }}
                          title="Eliminar movimiento"
                        >
                          <IconTrash size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <TransaccionModal
        open={modalAbierto}
        cuentas={cuentas}
        categorias={categorias}
        transaccionExistente={transaccionEditando}
        onClose={() => setModalAbierto(false)}
        onSaved={cargar}
      />
    </div>
  );
}