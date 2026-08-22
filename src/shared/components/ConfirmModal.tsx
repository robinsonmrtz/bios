import type { ReactNode } from 'react';
import { Modal } from './Modal';

interface Props {
  open: boolean;
  title: string;
  description: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  isDanger?: boolean;
}

export function ConfirmModal({ open, title, description, onConfirm, onCancel, confirmText = 'Confirmar', isDanger = false }: Props) {
  const footer = (
    <>
      <button onClick={onCancel} className="px-4 py-2 rounded-[10px] text-[13px] font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50">
        Cancelar
      </button>
      <button onClick={onConfirm} className={`px-5 py-2 rounded-[10px] text-[13px] font-semibold text-white ${isDanger ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
        {confirmText}
      </button>
    </>
  );

  return (
    <Modal open={open} title={title} onClose={onCancel} maxWidth="sm" footer={footer}>
      <p className="text-[13px] text-gray-600 leading-relaxed">{description}</p>
    </Modal>
  );
}