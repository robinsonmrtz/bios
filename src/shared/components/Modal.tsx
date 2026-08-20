import type { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  children?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm?: () => void;
  onCancel: () => void;
  hideDefaultFooter?: boolean; // <-- NUEVO: Para ocultar el pie por defecto y usar uno personalizado
}

/**
 * Modal único y reutilizable. Cualquier módulo que necesite confirmar,
 * cancelar o mostrar un formulario corto debe usar este mismo componente
 * en vez de crear uno nuevo.
 */
export function Modal({
  open,
  title,
  description,
  children,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  danger = false,
  onConfirm,
  onCancel,
  hideDefaultFooter = false, // <-- NUEVO: Por defecto es falso para no alterar los otros modales
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-[420px] rounded-[14px] p-[22px] border"
        style={{
          background: 'linear-gradient(160deg, var(--bios-card-a), var(--bios-card-b))',
          borderColor: 'var(--bios-border)',
          boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
        }}
      >
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="font-display text-[14px] font-bold">{title}</h3>
          <button 
            onClick={onCancel}
            className="text-[var(--bios-text-faint)] hover:text-[var(--bios-text)] text-sm px-1.5 py-0.5 rounded-md hover:bg-white/5"
          >
            ✕
          </button>
        </div>

        {description && (
          <p className="text-[11.5px] leading-relaxed mb-4" style={{ color: 'var(--bios-text-dim)' }}>
            {description}
          </p>
        )}

        {children}

        {/* Si hideDefaultFooter es true, no muestra estos botones estándar y deja que el children ponga los suyos */}
        {!hideDefaultFooter && (
          <div className="flex gap-2 justify-end mt-4">
            <button
              onClick={onCancel}
              className="text-[11px] px-3 py-1.5 rounded-lg border transition-colors"
              style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text-dim)' }}
            >
              {cancelLabel}
            </button>
            {onConfirm && (
              <button
                onClick={onConfirm}
                className="text-[11px] px-3 py-1.5 rounded-lg font-semibold"
                style={{
                  background: danger
                    ? 'linear-gradient(90deg, var(--bios-danger), #ff8f6b)'
                    : 'linear-gradient(90deg, var(--bios-accent), var(--bios-accent-2))',
                  color: '#0a1120',
                }}
              >
                {confirmLabel}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}