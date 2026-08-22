import { type ReactNode, useEffect } from 'react';
import { IconX } from '@tabler/icons-react';

interface ModalProps {
  open: boolean;
  title?: ReactNode;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const maxW = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
};

export function Modal({ open, title, onClose, children, footer, maxWidth = 'md' }: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-[#0f1626]/60 backdrop-blur-sm transition-opacity cursor-pointer" onClick={onClose} />
      
      <div className={`relative w-full ${maxW[maxWidth]} bg-white rounded-[20px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden transform transition-all`}>
        {title && (
          <div className="flex items-center justify-between px-6 py-5 shrink-0">
            <h2 className="text-[16px] font-bold text-gray-800">{title}</h2>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors">
              <IconX size={18} stroke={2.5} />
            </button>
          </div>
        )}
        
        <div className="px-6 shrink-0">
          <div className="w-full border-b border-dashed border-gray-200"></div>
        </div>

        <div className="p-6 overflow-y-auto flex-1 text-gray-700 custom-scrollbar">
          {children}
        </div>

        {footer && (
          <div className="px-6 py-4 bg-white border-t border-gray-100 shrink-0 flex items-center justify-end gap-3 rounded-b-[20px]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}