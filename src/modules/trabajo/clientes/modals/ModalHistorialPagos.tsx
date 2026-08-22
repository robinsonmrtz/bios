import { IconTrash } from '@tabler/icons-react';
import { Modal } from '../../../../shared/components/Modal';
import { deletePago } from '../../services/trabajoService';
import type { PagoTrabajo } from '../../types/trabajo.types';

interface Props { open: boolean; onClose: () => void; pagos: PagoTrabajo[]; onPagosChanged: () => void; }

export function ModalHistorialPagos({ open, onClose, pagos, onPagosChanged }: Props) {
  
  async function handleEliminar(id: string) {
    if (!confirm('¿Seguro que quieres eliminar este pago?')) return;
    await deletePago(id);
    onPagosChanged();
  }

  const footer = <button onClick={onClose} className="px-5 py-2.5 rounded-[10px] text-[13px] font-semibold text-gray-800 bg-gray-100 hover:bg-gray-200 w-full">Cerrar historial</button>;

  return (
    <Modal open={open} title="Historial de Pagos" onClose={onClose} maxWidth="sm" footer={footer}>
      <div className="flex flex-col gap-2 mt-2">
        {pagos.length === 0 ? (
          <p className="text-center text-[12px] text-gray-400 py-6">No hay pagos registrados.</p>
        ) : (
          pagos.map(p => (
            <div key={p.id} className="flex items-center justify-between p-3 rounded-[10px] border border-gray-100 bg-gray-50">
              <div>
                <div className="text-[14px] font-bold text-green-600">+ ${Number(p.monto).toFixed(2)}</div>
                <div className="text-[11px] text-gray-500">{p.fecha}</div>
              </div>
              <button onClick={() => handleEliminar(p.id)} className="p-2 rounded-md hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors">
                <IconTrash size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
}