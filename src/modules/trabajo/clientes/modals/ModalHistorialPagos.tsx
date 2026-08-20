import { IconX, IconTrash, IconCash } from '@tabler/icons-react';
import { deletePago } from '../../services/trabajoService';
import type { PagoTrabajo } from '../../types/trabajo.types';

interface ModalHistorialProps {
  open: boolean;
  onClose: () => void;
  pagos: PagoTrabajo[];
  onPagosChanged: () => void;
}

export function ModalHistorialPagos({ open, onClose, pagos, onPagosChanged }: ModalHistorialProps) {
  if (!open) return null;

  async function handleEliminar(id: string) {
    if (!confirm('¿Seguro que quieres eliminar este pago? El balance del cliente se actualizará.')) return;
    try {
      await deletePago(id);
      onPagosChanged();
    } catch (error) {
      alert("Error al eliminar el pago.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-[16px] border bg-[#0a1120] shadow-2xl flex flex-col max-h-[80vh]" style={{ borderColor: 'var(--bios-border)' }}>
        
        <div className="flex items-center justify-between p-4 border-b shrink-0" style={{ borderColor: 'var(--bios-border)' }}>
          <h2 className="text-[16px] font-bold flex items-center gap-2">
            <IconCash size={18} style={{ color: 'var(--bios-ok)' }} /> Historial de Pagos
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-md transition-colors"><IconX size={18} /></button>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          {pagos.length === 0 ? (
            <div className="text-center py-10 text-[12px]" style={{ color: 'var(--bios-text-faint)' }}>
              Aún no hay pagos registrados en este proyecto.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {pagos.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-[10px] border" style={{ background: 'var(--bios-card-a)', borderColor: 'var(--bios-border)' }}>
                  <div>
                    <div className="text-[13px] font-bold" style={{ color: 'var(--bios-ok)' }}>+ ${Number(p.monto).toFixed(2)}</div>
                    <div className="text-[10px]" style={{ color: 'var(--bios-text-dim)' }}>{p.fecha}</div>
                    {p.nota && (
                      <div className="text-[11px] mt-1 italic" style={{ color: 'var(--bios-text-faint)' }}>"{p.nota}"</div>
                    )}
                  </div>
                  <button 
                    onClick={() => handleEliminar(p.id)}
                    className="p-1.5 rounded-md hover:bg-red-500/20 transition-colors" 
                    style={{ color: 'var(--bios-danger)' }}
                    title="Eliminar pago"
                  >
                    <IconTrash size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}