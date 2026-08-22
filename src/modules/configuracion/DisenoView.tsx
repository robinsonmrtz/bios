import { useEffect, useState } from 'react';
import { ToggleCard } from '../../shared/components/FormControls';
import { cargarTema, guardarTema, type ThemeSettings } from '../../core/theme/themeStore';

const DEFAULTS: ThemeSettings = {
  bgColor: '#ffffff',
  menuColor: '#21232f',
  sharpCorners: true,
};

export function DisenoView() {
  const [tema, setTema] = useState<ThemeSettings>(DEFAULTS);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarTema().then((t) => {
      setTema(t);
      setCargando(false);
    });
  }, []);

  function actualizar(cambios: Partial<ThemeSettings>) {
    const nuevo = { ...tema, ...cambios };
    setTema(nuevo);
    guardarTema(nuevo);
  }

  if (cargando) {
    return (
      <div className="mt-4 text-[12px]" style={{ color: 'var(--bios-text-dim)' }}>
        Cargando configuración...
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-5 max-w-[440px]">
      <div className="flex items-center justify-between border p-3.5" style={{ borderColor: 'var(--bios-border)' }}>
        <div className="flex flex-col gap-0.5">
          <span className="text-[13px] font-semibold" style={{ color: 'var(--bios-text)' }}>Color de fondo</span>
          <span className="text-[11px]" style={{ color: 'var(--bios-text-dim)' }}>Fondo general de la app.</span>
        </div>
        <input
          type="color"
          value={tema.bgColor}
          onChange={(e) => actualizar({ bgColor: e.target.value })}
          className="w-10 h-10 border cursor-pointer bg-transparent"
          style={{ borderColor: 'var(--bios-border)' }}
        />
      </div>

      <div className="flex items-center justify-between border p-3.5" style={{ borderColor: 'var(--bios-border)' }}>
        <div className="flex flex-col gap-0.5">
          <span className="text-[13px] font-semibold" style={{ color: 'var(--bios-text)' }}>Color del menú</span>
          <span className="text-[11px]" style={{ color: 'var(--bios-text-dim)' }}>Base del menú lateral (degradado metalizado).</span>
        </div>
        <input
          type="color"
          value={tema.menuColor}
          onChange={(e) => actualizar({ menuColor: e.target.value })}
          className="w-10 h-10 border cursor-pointer bg-transparent"
          style={{ borderColor: 'var(--bios-border)' }}
        />
      </div>

      <ToggleCard
        label="Esquinas afiladas"
        description="Desactívalo para volver a esquinas redondeadas en tarjetas, botones y modales."
        checked={tema.sharpCorners}
        onChange={(checked) => actualizar({ sharpCorners: checked })}
      />
    </div>
  );
}