import { useEffect, useState } from 'react';
import { Modal } from '../../shared/components/Modal';
import { crearTransaccion, actualizarTransaccion, type Cuenta, type Categoria, type Transaccion } from '../../core/db/db';

interface Props {
  open: boolean;
  cuentas: Cuenta[];
  categorias: Categoria[];
  transaccionExistente?: Transaccion | null;
  onClose: () => void;
  onSaved: () => void;
}

type TipoMovimiento = 'gasto' | 'ingreso' | 'transferencia';

function hoyISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dia}`;
}

export function TransaccionModal({ open, cuentas, categorias, transaccionExistente, onClose, onSaved }: Props) {
  const [tipo, setTipo] = useState<TipoMovimiento>('gasto');
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState(hoyISO());
  const [cuentaId, setCuentaId] = useState('');
  const [cuentaDestinoId, setCuentaDestinoId] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [comercio, setComercio] = useState('');
  const [pagado, setPagado] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // Al abrir: si viene una transacción existente, precarga sus datos
  // (modo edición). Si no, resetea todo a los valores por defecto (modo creación).
  useEffect(() => {
    if (!open) return;

    if (transaccionExistente) {
      setTipo(transaccionExistente.tipo);
      setMonto(String(transaccionExistente.monto));
      setDescripcion(transaccionExistente.descripcion);
      setFecha(transaccionExistente.fecha);
      setCuentaId(transaccionExistente.cuenta_id);
      setCuentaDestinoId(transaccionExistente.cuenta_destino_id || cuentas[1]?.id || '');
      setCategoriaId(transaccionExistente.categoria_id || '');
      setComercio(transaccionExistente.comercio || '');
      setPagado(transaccionExistente.pagado);
    } else {
      setTipo('gasto');
      setMonto('');
      setDescripcion('');
      setFecha(hoyISO());
      setCuentaId(cuentas[0]?.id || '');
      setCuentaDestinoId(cuentas[1]?.id || '');
      setCategoriaId('');
      setComercio('');
      setPagado(true);
    }
  }, [open, cuentas, transaccionExistente]);

  const categoriasDelTipo = categorias.filter((c) => c.tipo === (tipo === 'ingreso' ? 'ingreso' : 'gasto'));
  const editando = !!transaccionExistente?.id;

  async function handleGuardar() {
    const montoNum = parseFloat(monto);
    if (!montoNum || montoNum <= 0) return alert('Ingresa un monto válido.');
    if (!descripcion.trim()) return alert('La descripción es obligatoria.');
    if (!fecha) return alert('Selecciona una fecha.');
    if (!cuentaId) return alert('Selecciona una cuenta.');
    if (tipo === 'transferencia' && (!cuentaDestinoId || cuentaDestinoId === cuentaId)) {
      return alert('Selecciona una cuenta de destino distinta a la de origen.');
    }
    if (tipo !== 'transferencia' && !categoriaId) return alert('Selecciona una categoría.');

    const payload = {
      tipo,
      monto: montoNum,
      descripcion: descripcion.trim(),
      fecha,
      cuenta_id: cuentaId,
      cuenta_destino_id: tipo === 'transferencia' ? cuentaDestinoId : null,
      categoria_id: tipo === 'transferencia' ? null : categoriaId,
      comercio: comercio.trim() || null,
      pagado: tipo === 'transferencia' ? true : pagado,
    };

    setGuardando(true);
    try {
      if (editando) {
        await actualizarTransaccion(transaccionExistente!.id!, payload);
      } else {
        await crearTransaccion({ ...payload, gasto_fijo: false, observacion: null, archivada: false });
      }
      onSaved();
      onClose();
    } catch (err) {
      console.error('Error guardando transacción:', err);
      alert('No se pudo guardar el movimiento. Revisa la consola.');
    } finally {
      setGuardando(false);
    }
  }

  const colorTipo = tipo === 'ingreso' ? 'var(--bios-ok)' : tipo === 'gasto' ? 'var(--bios-danger)' : '#2773d6';

  return (
    <Modal open={open} title={editando ? 'Editar movimiento' : 'Registrar movimiento'} onCancel={onClose} hideDefaultFooter>
      <div className="flex flex-col gap-4 mt-2">
        <div className="flex gap-2">
          {(['gasto', 'ingreso', 'transferencia'] as TipoMovimiento[]).map((op) => (
            <button
              key={op}
              onClick={() => setTipo(op)}
              className="flex-1 py-2 rounded-lg text-[12px] font-semibold border capitalize"
              style={{
                borderColor: tipo === op ? colorTipo : 'var(--bios-border)',
                background: tipo === op ? `${colorTipo}22` : 'transparent',
                color: tipo === op ? colorTipo : 'var(--bios-text-dim)',
              }}
            >
              {op}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-center gap-1 py-2">
          <span className="text-[16px] sm:text-[22px] font-display font-bold flex-shrink-0" style={{ color: colorTipo }}>$</span>
          <input
            type="number"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            placeholder="0.00"
            className="bg-transparent text-[22px] sm:text-[32px] font-display font-bold outline-none text-left min-w-0"
            style={{ color: 'var(--bios-text)', width: `${Math.max((monto || '0.00').length + 1, 5)}ch` }}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px]" style={{ color: 'var(--bios-text-dim)' }}>Descripción</label>
          <input
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Ej: Compra de insumos, Pago mensual..."
            className="w-full bg-black/20 border rounded-[10px] px-3 py-2 text-[13px] outline-none"
            style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text)' }}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px]" style={{ color: 'var(--bios-text-dim)' }}>Fecha</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full bg-black/20 border rounded-[10px] px-3 py-2 text-[13px] outline-none"
            style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text)' }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px]" style={{ color: 'var(--bios-text-dim)' }}>
              {tipo === 'transferencia' ? 'Cuenta origen' : 'Cuenta'}
            </label>
            <select
              value={cuentaId}
              onChange={(e) => setCuentaId(e.target.value)}
              className="w-full bg-black/20 border rounded-[10px] px-3 py-2 text-[13px] outline-none"
              style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text)' }}
            >
              {cuentas.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>

          {tipo === 'transferencia' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px]" style={{ color: 'var(--bios-text-dim)' }}>Cuenta destino</label>
              <select
                value={cuentaDestinoId}
                onChange={(e) => setCuentaDestinoId(e.target.value)}
                className="w-full bg-black/20 border rounded-[10px] px-3 py-2 text-[13px] outline-none"
                style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text)' }}
              >
                {cuentas.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {tipo !== 'transferencia' && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px]" style={{ color: 'var(--bios-text-dim)' }}>Categoría</label>
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className="w-full bg-black/20 border rounded-[10px] px-3 py-2 text-[13px] outline-none"
              style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text)' }}
            >
              <option value="">Selecciona una categoría...</option>
              {categoriasDelTipo.map((c) => (
                <option key={c.id} value={c.id}>{c.emoji} {c.nombre}</option>
              ))}
            </select>
          </div>
        )}

        {tipo !== 'transferencia' && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px]" style={{ color: 'var(--bios-text-dim)' }}>Comercio (opcional)</label>
            <input
              value={comercio}
              onChange={(e) => setComercio(e.target.value)}
              placeholder="Ej: Éxito, Amazon..."
              className="w-full bg-black/20 border rounded-[10px] px-3 py-2 text-[13px] outline-none"
              style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text)' }}
            />
          </div>
        )}

        {tipo !== 'transferencia' && (
          <label className="flex items-center justify-between">
            <span className="text-[12.5px]">Marcado como pagado</span>
            <input type="checkbox" checked={pagado} onChange={(e) => setPagado(e.target.checked)} />
          </label>
        )}

        <div className="flex justify-end gap-2 pt-3 border-t" style={{ borderColor: 'var(--bios-border)' }}>
          <button
            onClick={onClose}
            className="text-[11px] px-3 py-2 rounded-lg border"
            style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text-dim)' }}
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            disabled={guardando}
            className="text-[12px] font-semibold px-4 py-2 rounded-lg disabled:opacity-50"
            style={{ background: 'var(--bios-accent)', color: '#0a1120' }}
          >
            {guardando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Confirmar movimiento'}
          </button>
        </div>
      </div>
    </Modal>
  );
}