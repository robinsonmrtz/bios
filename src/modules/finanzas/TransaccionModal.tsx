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

export function TransaccionModal({ open, cuentas, categorias, transaccionExistente, onClose, onSaved }: Props) {
  const [tipo, setTipo] = useState<'gasto' | 'ingreso' | 'transferencia'>('gasto');
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [cuentaId, setCuentaId] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [pagado, setPagado] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (transaccionExistente) {
      setTipo(transaccionExistente.tipo);
      setMonto(String(transaccionExistente.monto));
      setDescripcion(transaccionExistente.descripcion);
      setFecha(transaccionExistente.fecha);
      setCuentaId(transaccionExistente.cuenta_id);
      setCategoriaId(transaccionExistente.categoria_id || '');
      setPagado(transaccionExistente.pagado);
    } else {
      setTipo('gasto'); setMonto(''); setDescripcion(''); setFecha(new Date().toISOString().split('T')[0]);
      setCuentaId(cuentas[0]?.id || ''); setCategoriaId(''); setPagado(true);
    }
  }, [open, transaccionExistente, cuentas]);

  async function handleGuardar() {
    if (!monto || parseFloat(monto) <= 0) return alert('Ingresa un monto.');
    setGuardando(true);
    try {
      const payload = { tipo, monto: parseFloat(monto), descripcion, fecha, cuenta_id: cuentaId, categoria_id: categoriaId || null, pagado };
      if (transaccionExistente) await actualizarTransaccion(transaccionExistente.id!, payload);
      else await crearTransaccion({ ...payload, cuenta_destino_id: null, comercio: null, gasto_fijo: false, observacion: null, archivada: false });
      onSaved(); onClose();
    } catch (e) { alert('Error guardando'); } finally { setGuardando(false); }
  }

  const footer = (
    <>
      <button onClick={onClose} className="px-4 py-2.5 rounded-[10px] text-[13px] font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50">Cancelar</button>
      <button onClick={handleGuardar} disabled={guardando} className="px-5 py-2.5 rounded-[10px] text-[13px] font-semibold text-white bg-[#2773d6] hover:bg-blue-700 disabled:opacity-50">
        {guardando ? 'Guardando...' : 'Confirmar movimiento'}
      </button>
    </>
  );

  const Title = <span>Registrar <span className={tipo === 'gasto' ? 'text-red-500' : 'text-green-500'}>{tipo}</span></span>;
  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-[10px] px-3 py-2.5 text-[13px] text-gray-800 outline-none focus:border-blue-500 focus:bg-white transition-colors";
  const labelClass = "block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1.5";

  return (
    <Modal open={open} title={Title} onClose={onClose} maxWidth="md" footer={footer}>
      <div className="flex flex-col gap-5 mt-2">
        
        {/* Selector de tipo sutil */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
          {(['gasto', 'ingreso'] as const).map(t => (
            <button key={t} onClick={() => setTipo(t)} className={`flex-1 py-1.5 text-[12px] font-semibold rounded-lg capitalize transition-colors ${tipo === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <span className={`text-[28px] font-bold ${tipo === 'gasto' ? 'text-red-500' : 'text-green-500'}`}>$</span>
          <input type="number" value={monto} onChange={(e) => setMonto(e.target.value)} placeholder="0.00" className="w-full text-[32px] font-bold text-gray-900 outline-none placeholder-gray-300 bg-transparent" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 border border-gray-200 rounded-[10px] p-3 flex justify-between items-center cursor-pointer" onClick={() => setPagado(!pagado)}>
            <div>
              <div className="text-[12px] font-bold text-gray-800">Estado del pago</div>
              <div className="text-[10px] text-gray-500">Marcado como pagado</div>
            </div>
            <input type="checkbox" checked={pagado} readOnly className="w-4 h-4 accent-blue-600" />
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-[10px] p-3 flex justify-between items-center opacity-60">
            <div>
              <div className="text-[12px] font-bold text-gray-800">Gasto fijo</div>
              <div className="text-[10px] text-gray-500">Se repite mensual</div>
            </div>
            <input type="checkbox" disabled className="w-4 h-4" />
          </div>
        </div>

        <div>
          <label className={labelClass}>Fecha de transacción</label>
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Descripción / Concepto básico</label>
          <input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Ej: Compra de insumos..." className={inputClass} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Cuenta origen</label>
            <select value={cuentaId} onChange={(e) => setCuentaId(e.target.value)} className={inputClass}>
              {cuentas.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Categoría</label>
            <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} className={inputClass}>
              <option value="">Selecciona...</option>
              {categorias.filter(c => c.tipo === tipo).map(c => <option key={c.id} value={c.id}>{c.emoji} {c.nombre}</option>)}
            </select>
          </div>
        </div>
      </div>
    </Modal>
  );
}