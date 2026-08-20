import { useState } from 'react';
import { IconX } from '@tabler/icons-react';
import { createPago } from '../../services/trabajoService';

interface ModalPagoProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  clienteId: string;
  proyectoId: string;
}

export function ModalPago({ open, onClose, onSaved, clienteId, proyectoId }: ModalPagoProps) {
  const [cargando, setCargando] = useState(false);
  const [monto, setMonto] = useState<number | ''>('');
  
  // Por defecto, la fecha de hoy
  const [fechaInput, setFechaInput] = useState(new Date().toISOString().split('T')[0]); 

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!monto || Number(monto) <= 0) return alert('Ingresa un monto válido.');
    
    setCargando(true);
    try {
      await createPago({
        cliente_id: clienteId,
        proyecto_id: proyectoId,
        monto: Number(monto),
        fecha: fechaInput, // <-- CORREGIDO: Usamos 'fecha' en lugar de 'fecha_pago'
      });
      onSaved();
      onClose();
      setMonto(''); // Limpiamos para el próximo
    } catch (error) {
      console.error("Error guardando adelanto:", error);
      alert("Hubo un error al registrar el pago.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-[16px] border bg-[#0a1120] shadow-2xl" style={{ borderColor: 'var(--bios-border)' }}>
        
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--bios-border)' }}>
          <h2 className="text-[16px] font-bold">Registrar Adelanto</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-md transition-colors"><IconX size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
          <div>
            <label className="block text-[11px] font-bold mb-1" style={{ color: 'var(--bios-text-dim)' }}>Monto Recibido ($)</label>
            <input 
              type="number" 
              step="0.01" 
              required 
              autoFocus
              className="w-full bg-black/40 border rounded-lg px-3 py-2 text-[16px] font-bold outline-none" 
              style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-ok)' }}
              value={monto} 
              onChange={e => setMonto(e.target.value ? Number(e.target.value) : '')} 
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold mb-1" style={{ color: 'var(--bios-text-dim)' }}>Fecha del Pago</label>
            <input 
              type="date" 
              required
              className="w-full bg-black/40 border rounded-lg px-3 py-2 text-[12px] outline-none" 
              style={{ borderColor: 'var(--bios-border)' }}
              value={fechaInput} 
              onChange={e => setFechaInput(e.target.value)} 
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-[12px] font-semibold hover:bg-white/5 transition-colors">Cancelar</button>
            <button type="submit" disabled={cargando} className="px-4 py-2 rounded-lg text-[12px] font-semibold transition-opacity hover:opacity-90" style={{ background: 'var(--bios-ok)', color: '#0a1120' }}>
              {cargando ? 'Guardando...' : 'Confirmar Pago'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}