import { useEffect, useRef, useState, type ComponentType } from 'react';
import { IconDots } from '../icons';

export interface ModuleNavItem {
  id: string;
  label: string;
  /** Cualquier ícono de @tabler/icons-react (o compatible con la misma firma) */
  icon: ComponentType<{ size?: number | string; style?: React.CSSProperties; className?: string }>;
}

interface ModuleNavProps {
  /** Pestañas que SIEMPRE se ven, tanto en escritorio como en el bottom-nav móvil */
  items: ModuleNavItem[];
  /** Opcional: items que quedan escondidos detrás del botón "Más" */
  moreItems?: ModuleNavItem[];
  activeId: string;
  onChange: (id: string) => void;
}

/**
 * Menú de navegación por pestañas de UN módulo (ej: Resumen / Cuentas / Transacciones...).
 * NO es el sidebar principal de la app — este vive DENTRO de cada módulo.
 *
 * - En escritorio/tablet (md+): barra de pestañas horizontal arriba del contenido.
 * - En móvil (<md): barra fija abajo, deslizable horizontalmente, con ícono + label
 *   apilados (estilo Instagram). El botón "Más" abre su panel HACIA ARRIBA porque
 *   está pegado al borde inferior de la pantalla.
 *
 * Uso:
 *   <ModuleNav items={TABS} moreItems={MORE_TABS} activeId={tab} onChange={setTab} />
 *
 * IMPORTANTE: si usas la versión móvil, el contenedor del contenido del módulo
 * necesita padding-bottom para que la barra fija no tape lo último del contenido:
 *   <div className="pb-20 md:pb-0"> ...contenido del módulo... </div>
 */
export function ModuleNav({ items, moreItems, activeId, onChange }: ModuleNavProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const desktopMoreRef = useRef<HTMLDivElement>(null);
  const mobileMoreRef = useRef<HTMLDivElement>(null);

  const hasMore = !!moreItems && moreItems.length > 0;
  const activeIsInMore = hasMore && moreItems!.some((m) => m.id === activeId);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      const insideDesktop = desktopMoreRef.current?.contains(target);
      const insideMobile = mobileMoreRef.current?.contains(target);
      if (!insideDesktop && !insideMobile) setMoreOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function handleSelect(id: string) {
    onChange(id);
    setMoreOpen(false);
  }

  return (
    <>
      {/* ============ ESCRITORIO / TABLET: pestañas arriba ============ */}
      {/* OJO: el scroll horizontal SOLO envuelve las pestañas, nunca el
          botón "Más" — si "Más" quedara dentro del contenedor con
          overflow-x-auto, su panel se recorta verticalmente (el navegador
          activa overflow-y:auto implícito en cuanto hay overflow-x). */}
      <nav
        className="hidden md:flex items-center border-b"
        style={{ borderColor: 'var(--bios-border)' }}
      >
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar min-w-0">
          {items.map((item) => {
            const active = activeId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className="flex items-center gap-2 px-3 py-2.5 text-[13px] whitespace-nowrap flex-shrink-0 transition-colors"
                style={{
                  color: active ? 'var(--bios-accent)' : 'var(--bios-text-faint)',
                  boxShadow: active ? 'inset 0 -2px 0 var(--bios-accent)' : 'none',
                }}
              >
                <item.icon size={17} />
                {item.label}
              </button>
            );
          })}
        </div>

        {hasMore && (
          <div className="relative ml-auto flex-shrink-0" ref={desktopMoreRef}>
            <button
              onClick={() => setMoreOpen((o) => !o)}
              className="flex items-center gap-2 px-3 py-2.5 text-[13px] whitespace-nowrap"
              style={{ color: moreOpen || activeIsInMore ? 'var(--bios-accent)' : 'var(--bios-text-faint)' }}
            >
              <IconDots size={17} />
              Más
            </button>

            {moreOpen && (
              <div
                className="absolute top-full right-0 mt-2 w-52 rounded-xl border p-1.5 z-30"
                style={{
                  background: 'linear-gradient(160deg, var(--bios-card-a), var(--bios-card-b))',
                  borderColor: 'var(--bios-border)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
                }}
              >
                {moreItems!.map((item) => (
                  <MoreRow key={item.id} item={item} active={activeId === item.id} onClick={() => handleSelect(item.id)} />
                ))}
              </div>
            )}
          </div>
        )}
      </nav>

      {/* ============ MÓVIL: barra inferior fija, deslizable ============ */}
      <nav
        className="flex md:hidden fixed bottom-0 left-0 right-0 z-30 border-t"
        style={{
          background: 'linear-gradient(160deg, var(--bios-card-a), var(--bios-card-b))',
          borderColor: 'var(--bios-border)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {/* De nuevo: el scroll horizontal SOLO envuelve las pestañas.
            "Más" queda como hermano fuera de este contenedor. */}
        <div className="flex flex-1 overflow-x-auto no-scrollbar snap-x snap-mandatory min-w-0">
          {items.map((item) => {
            const active = activeId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className="flex flex-col items-center justify-center gap-1 min-w-[68px] flex-shrink-0 snap-start py-2.5"
                style={{ color: active ? 'var(--bios-accent)' : 'var(--bios-text-faint)' }}
              >
                <item.icon size={21} />
                <span className="text-[10.5px] font-medium leading-none">{item.label}</span>
              </button>
            );
          })}
        </div>

        {hasMore && (
          <div className="relative flex-shrink-0" ref={mobileMoreRef}>
            <button
              onClick={() => setMoreOpen((o) => !o)}
              className="flex flex-col items-center justify-center gap-1 min-w-[68px] py-2.5"
              style={{ color: moreOpen || activeIsInMore ? 'var(--bios-accent)' : 'var(--bios-text-faint)' }}
            >
              <IconDots size={21} />
              <span className="text-[10.5px] font-medium leading-none">Más</span>
            </button>

            {moreOpen && (
              // bottom-full en vez de top-full: el trigger está pegado al
              // borde inferior de la pantalla, así que el panel SIEMPRE
              // abre hacia arriba. Esto es lo que estaba roto antes.
              <div
                className="absolute bottom-full right-0 mb-2 w-52 rounded-xl border p-1.5 z-30"
                style={{
                  background: 'linear-gradient(160deg, var(--bios-card-a), var(--bios-card-b))',
                  borderColor: 'var(--bios-border)',
                  boxShadow: '0 -12px 40px rgba(0,0,0,0.45)',
                }}
              >
                {moreItems!.map((item) => (
                  <MoreRow key={item.id} item={item} active={activeId === item.id} onClick={() => handleSelect(item.id)} />
                ))}
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  );
}

function MoreRow({ item, active, onClick }: { item: ModuleNavItem; active: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] cursor-pointer hover:bg-white/5"
      style={{ color: active ? 'var(--bios-accent)' : 'var(--bios-text-dim)' }}
    >
      <item.icon size={17} />
      {item.label}
    </div>
  );
}