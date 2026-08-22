import { useState } from 'react';
import { IslandsGrid } from '../dashboard/IslandsGrid';
import { Modal } from '../../shared/components/Modal';

export function DashboardShell() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="pb-10">
      <div className="w-full px-5 sm:px-8 pt-4">
        <IslandsGrid />

        <button
          onClick={() => setShowModal(true)}
          className="text-[11px] underline mt-4 inline-block"
          style={{ color: 'var(--bios-accent)' }}
        >
          Ver ejemplo de modal reutilizable (cancelar) →
        </button>
      </div>

      <Modal
        open={showModal}
        title="¿Cancelar esta acción?"
        description="Este es el mismo componente modal reutilizado en toda la app — se comparte entre módulos sin duplicar código."
        confirmLabel="Sí, cancelar"
        cancelLabel="Volver"
        danger
        onConfirm={() => setShowModal(false)}
        onCancel={() => setShowModal(false)}
      />
    </div>
  );
}
