import { DisenoView } from './DisenoView';

export function ConfiguracionModule() {
  return (
    <div className="pb-10">
      <div className="w-full px-5 sm:px-8 pt-4">
        <h1 className="font-display font-bold text-[15px] mb-1">Configuración</h1>
        <p className="text-[12px] mb-6" style={{ color: 'var(--bios-text-dim)' }}>
          Panel general de ajustes de la aplicación.
        </p>

        <h2 className="text-[13px] font-semibold" style={{ color: 'var(--bios-text)' }}>Diseño</h2>
        <DisenoView />
      </div>
    </div>
  );
}