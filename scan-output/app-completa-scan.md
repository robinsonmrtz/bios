# Escaneo: app-completa

_Generado: 2026-08-19T06:06:57.642Z_

## Carpetas "modules" encontradas en el proyecto
- src\modules

## Módulos detectados
- dashboard  (src\modules\dashboard)
- finanzas  (src\modules\finanzas)

## Carpetas "shared" globales incluidas
- src\shared

## Contrato de desarrollo

# Contrato de desarrollo del proyecto

> Este archivo se incluye automáticamente en cada escaneo para que cualquier
> LLM entienda las reglas del proyecto antes de tocar código. Complétalo con
> tus convenciones reales.

## Stack
- React + TypeScript + Tailwind CSS + IndexedDB

## Convenciones de módulos
- Cada módulo vive en `src/modules/<nombre>` y es independiente.
- El código compartido entre módulos vive en `src/shared`, `src/hooks`, `src/lib`, `src/types`.
- (Agrega aquí tus reglas de nombres, estructura interna de cada módulo, patrones de estado, etc.)

## Estilo de código
- (Ej: componentes funcionales, hooks personalizados con prefijo use..., etc.)

## Reglas de IndexedDB
- (Ej: cada módulo define su propio store, nomenclatura de las bases, migraciones, etc.)


## Árbol de archivos incluidos

- package.json
- src\modules\dashboard\AppLayout.tsx
- src\modules\dashboard\DashboardShell.tsx
- src\modules\dashboard\IslandsGrid.tsx
- src\modules\dashboard\TopBar.tsx
- src\modules\finanzas\FinanzasModule.tsx
- src\modules\finanzas\FinanzasNav.tsx
- src\shared\components\GridBackground.tsx
- src\shared\components\MobileDrawer.tsx
- src\shared\components\Modal.tsx
- src\shared\components\ModuleNav.tsx
- src\shared\components\Sidebar.tsx
- src\shared\icons.tsx
- src\shared\navConfig.tsx
- tsconfig.json
- vite.config.ts

## Contenido de archivos

### `package.json`

```
{
  "name": "bios",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "oxlint",
    "preview": "vite preview",
    "scan": "node scripts/scan.mjs"
  },
  "dependencies": {
    "@tabler/icons-react": "^3.46.0",
    "idb": "^8.0.3",
    "react": "^19.2.8",
    "react-dom": "^19.2.8"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.3.3",
    "@types/node": "^24.13.3",
    "@types/react": "^19.2.17",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.4",
    "autoprefixer": "^10.5.4",
    "oxlint": "^1.75.0",
    "postcss": "^8.5.26",
    "tailwindcss": "^4.3.3",
    "typescript": "~6.0.2",
    "vite": "^8.2.0"
  }
}

```

### `tsconfig.json`

```
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}

```

### `vite.config.ts`

```tsx
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})

```

### `src\modules\dashboard\AppLayout.tsx`

```tsx
import { useState, type ReactNode } from 'react';
import { Sidebar } from '../../shared/components/Sidebar';
import { MobileDrawer } from '../../shared/components/MobileDrawer';
import { TopBar } from './TopBar';

interface Props {
  children: ReactNode;
  activeModule: string;
  onSelectModule: (moduleId: string) => void;
}

export function AppLayout({ children, activeModule, onSelectModule }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="relative z-10 flex min-h-screen">
      <Sidebar activeId={activeModule} onSelect={onSelectModule} />
      <MobileDrawer
        open={drawerOpen}
        activeId={activeModule}
        onSelect={onSelectModule}
        onClose={() => setDrawerOpen(false)}
      />

      <div className="flex-1 min-w-0">
        <TopBar onMenuClick={() => setDrawerOpen(true)} />
        {children}
      </div>
    </div>
  );
}

```

### `src\modules\dashboard\DashboardShell.tsx`

```tsx
import { useState } from 'react';
import { IslandsGrid } from '../dashboard/IslandsGrid';
import { Modal } from '../../shared/components/Modal';

export function DashboardShell() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="pb-10">
      <div className="max-w-[1180px] mx-auto px-5 pt-4">
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

```

### `src\modules\dashboard\IslandsGrid.tsx`

```tsx
import { useState, type ReactNode, type DragEvent, type MouseEvent } from 'react';
import { IconGrip } from '../../shared/icons';

// --- TIPOS ---
type SpanSize = 1 | 2;
type WidgetType = 'finanzas' | 'tareas' | 'salud' | 'escaner' | 'rendimiento' | 'empty';

interface WidgetData {
  id: string;
  type: WidgetType;
  colSpan: SpanSize;
  rowSpan: SpanSize;
  col: number; // NUEVO: Posición fija en columna
  row: number; // NUEVO: Posición fija en fila
}

// --- CONFIGURACIÓN INICIAL DE LA GRILLA ---
// Solo definimos los widgets reales con sus posiciones iniciales en un grid de 4 columnas
const REAL_WIDGETS: WidgetData[] = [
  { id: 'w-finanzas', type: 'finanzas', colSpan: 2, rowSpan: 1, col: 1, row: 1 },
  { id: 'w-tareas', type: 'tareas', colSpan: 1, rowSpan: 2, col: 3, row: 1 },
  { id: 'w-salud', type: 'salud', colSpan: 1, rowSpan: 1, col: 4, row: 1 },
  { id: 'w-escaner', type: 'escaner', colSpan: 1, rowSpan: 1, col: 4, row: 2 },
  { id: 'w-rendimiento', type: 'rendimiento', colSpan: 2, rowSpan: 2, col: 1, row: 2 },
];

// Función para rellenar los huecos vacíos automáticamente basados en los widgets reales
function generateGrid(realWidgets: WidgetData[], minRows = 5, cols = 4): WidgetData[] {
  const maxRow = Math.max(minRows, ...realWidgets.map(w => w.row + w.rowSpan - 1));
  const grid: WidgetData[] = [...realWidgets];

  for (let r = 1; r <= maxRow; r++) {
    for (let c = 1; c <= cols; c++) {
      // Verificamos si esta celda ya está cubierta por un widget real
      const isCovered = realWidgets.some(w =>
        c >= w.col && c < w.col + w.colSpan &&
        r >= w.row && r < w.row + w.rowSpan
      );
      
      if (!isCovered) {
        grid.push({
          id: `empty-${r}-${c}`,
          type: 'empty',
          colSpan: 1,
          rowSpan: 1,
          col: c,
          row: r
        });
      }
    }
  }
  return grid;
}

const INITIAL_WIDGETS = generateGrid(REAL_WIDGETS);

// --- ISLA (contenedor con el punto de agarre) ---
function Island({
  children,
  colSpan = 1,
  rowSpan = 1,
  col,
  row,
  draggableEnabled,
  isDragging,
  showHandle,
  onHandleDown,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}: {
  children: ReactNode;
  colSpan?: SpanSize;
  rowSpan?: SpanSize;
  col: number;
  row: number;
  draggableEnabled: boolean;
  isDragging?: boolean;
  showHandle: boolean;
  onHandleDown: (e: MouseEvent) => void;
  onDragStart: (e: DragEvent) => void;
  onDragEnd: (e: DragEvent) => void;
  onDragOver: (e: DragEvent) => void;
  onDrop: (e: DragEvent) => void;
}) {
  return (
    <div
      draggable={draggableEnabled}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`relative rounded-[14px] p-1.5 h-full w-full transition-opacity duration-200 ${
        isDragging ? 'opacity-40 scale-[0.98]' : 'opacity-100'
      }`}
      style={{ 
        border: '1px dashed rgba(255,255,255,0.12)', 
        background: 'rgba(255,255,255,0.015)',
        // NUEVO: Posición Absoluta dentro del CSS Grid para evitar saltos y movimientos automáticos
        gridColumn: `${col} / span ${colSpan}`,
        gridRow: `${row} / span ${rowSpan}`
      }}
    >
      {showHandle && (
        <div
          onMouseDown={onHandleDown}
          className="absolute top-2.5 right-2.5 z-10 p-1 rounded-md cursor-grab active:cursor-grabbing hover:bg-white/5"
          style={{ color: 'var(--bios-text-faint)' }}
        >
          <IconGrip style={{ width: 14, height: 14 }} />
        </div>
      )}
      {children}
    </div>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <div
      className="rounded-[11px] border p-3 flex flex-col h-full w-full"
      style={{
        background: 'linear-gradient(160deg, var(--bios-card-a), var(--bios-card-b))',
        borderColor: 'var(--bios-border)',
      }}
    >
      {children}
    </div>
  );
}

function CardHeader({ dot, title }: { dot: string; title: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[12px] font-semibold mb-2 pr-6">
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: dot }} />
      {title}
    </div>
  );
}

function GhostSlot() {
  return <div className="rounded-[11px] h-full w-full" style={{ border: '1px dashed rgba(255,255,255,0.15)' }} />;
}

// --- RENDERIZADOR DE WIDGETS ---
function renderWidgetContent(type: WidgetType) {
  switch (type) {
    case 'finanzas':
      return (
        <Card>
          <CardHeader dot="var(--bios-ok)" title="Finanzas" />
          <div className="flex justify-between items-end flex-1">
            <div>
              <div className="font-display font-bold text-[22px]">$4,280</div>
              <div className="text-[10.5px] mt-0.5" style={{ color: 'var(--bios-text-dim)' }}>
                Balance disponible
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px]" style={{ color: 'var(--bios-text-dim)' }}>
                Gasto del mes
              </div>
              <b className="text-[14px] font-medium" style={{ color: 'var(--bios-text)' }}>
                $1,120
              </b>
            </div>
          </div>
        </Card>
      );
    case 'tareas':
      return (
        <Card>
          <CardHeader dot="var(--bios-warn)" title="Tareas" />
          <div className="flex-1 flex flex-col gap-2 mt-1">
            <div
              className="flex justify-between text-[11px] p-2 rounded-md bg-white/5"
              style={{ color: 'var(--bios-text-dim)' }}
            >
              <span>Subir a Prod</span>
              <b style={{ color: 'var(--bios-danger)' }}>12:00</b>
            </div>
            <div
              className="flex justify-between text-[11px] p-2 rounded-md bg-white/5"
              style={{ color: 'var(--bios-text-dim)' }}
            >
              <span>Revisión</span>
              <b style={{ color: 'var(--bios-text)' }}>15:30</b>
            </div>
          </div>
          <div
            className="flex justify-between text-[11px] pt-2 mt-auto border-t"
            style={{ color: 'var(--bios-text-dim)', borderColor: 'var(--bios-border)' }}
          >
            <span>Pendientes: 5</span>
            <b style={{ color: 'var(--bios-danger)' }}>2 Vencen</b>
          </div>
        </Card>
      );
    case 'salud':
      return (
        <Card>
          <CardHeader dot="#ff6ba1" title="Salud" />
          <div className="flex-1">
            <div className="font-display font-bold text-[22px]">
              72<span className="text-[12px] font-normal" style={{ color: 'var(--bios-text-dim)' }}> bpm</span>
            </div>
            <div className="text-[10.5px] mt-0.5" style={{ color: 'var(--bios-text-dim)' }}>
              Promedio hoy
            </div>
          </div>
        </Card>
      );
    case 'escaner':
      return (
        <Card>
          <CardHeader dot="var(--bios-accent-2)" title="Escáner IA" />
          <div className="flex-1">
            <div className="text-[10.5px]" style={{ color: 'var(--bios-text-dim)' }}>
              Último escaneo
            </div>
            <div className="flex justify-between text-[11px] pt-1 mt-1" style={{ color: 'var(--bios-text-dim)' }}>
              <span>Módulo</span>
              <b style={{ color: 'var(--bios-text)' }}>Finanzas</b>
            </div>
          </div>
        </Card>
      );
    case 'rendimiento':
      return (
        <Card>
          <CardHeader dot="var(--bios-accent)" title="Rendimiento del sistema" />
          <div
            className="flex-1 flex items-center justify-center border border-dashed rounded-[8px] mt-2 bg-white/5"
            style={{ borderColor: 'rgba(255,255,255,0.05)', color: 'var(--bios-text-dim)' }}
          >
            <span className="text-[12px]">[ Gráfico 2×2 ]</span>
          </div>
        </Card>
      );
    case 'empty':
    default:
      return <GhostSlot />;
  }
}

// --- COMPONENTE PRINCIPAL ---
export function IslandsGrid() {
  const [widgets, setWidgets] = useState<WidgetData[]>(INITIAL_WIDGETS);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [armedId, setArmedId] = useState<string | null>(null);

  const handleDragStart = (e: DragEvent, id: string) => {
    if (armedId !== id) {
      e.preventDefault();
      return;
    }
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setArmedId(null);
  };

  // Verifica si el movimiento es legal visualmente (muestra cursor "bloqueado" si no cabe)
  const handleDragOver = (e: DragEvent, targetWidget: WidgetData) => {
    e.preventDefault();
    
    if (targetWidget.type !== 'empty') {
      e.dataTransfer.dropEffect = 'none';
      return;
    }

    const draggedWidget = widgets.find(w => w.id === draggedId);
    if (!draggedWidget) return;

    // Calculamos si el widget que arrastramos cabe en el destino
    const targetCol = targetWidget.col;
    const targetRow = targetWidget.row;

    // 1. Validar que no se salga del grid por la derecha (4 columnas)
    if (targetCol + draggedWidget.colSpan - 1 > 4) {
      e.dataTransfer.dropEffect = 'none';
      return;
    }

    // 2. Validar colisión matemática con otros widgets reales
    const hasCollision = widgets.some(w => {
      if (w.id === draggedId || w.type === 'empty') return false;
      
      const wRight = w.col + w.colSpan - 1;
      const wBottom = w.row + w.rowSpan - 1;
      const dropRight = targetCol + draggedWidget.colSpan - 1;
      const dropBottom = targetRow + draggedWidget.rowSpan - 1;

      // Si intersectan en algún punto, hay colisión
      return !(w.col > dropRight || wRight < targetCol || w.row > dropBottom || wBottom < targetRow);
    });

    e.dataTransfer.dropEffect = hasCollision ? 'none' : 'move';
  };

  const handleDrop = (e: DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      return;
    }

    setWidgets((prev) => {
      const draggedWidget = prev.find((w) => w.id === draggedId);
      const targetWidget = prev.find((w) => w.id === targetId);

      if (!draggedWidget || !targetWidget || targetWidget.type !== 'empty') {
        return prev; // Destino inválido
      }

      const targetCol = targetWidget.col;
      const targetRow = targetWidget.row;

      // Doble validación de colisión (misma lógica del dragOver por seguridad)
      if (targetCol + draggedWidget.colSpan - 1 > 4) return prev;

      const hasCollision = prev.some(w => {
        if (w.id === draggedId || w.type === 'empty') return false;
        const wRight = w.col + w.colSpan - 1;
        const wBottom = w.row + w.rowSpan - 1;
        const dropRight = targetCol + draggedWidget.colSpan - 1;
        const dropBottom = targetRow + draggedWidget.rowSpan - 1;
        return !(w.col > dropRight || wRight < targetCol || w.row > dropBottom || wBottom < targetRow);
      });

      if (hasCollision) return prev; // El hueco no es lo suficientemente grande, abortamos

      // Actualizamos solo las coordenadas del widget movido
      const realWidgets = prev
        .filter(w => w.type !== 'empty')
        .map(w => w.id === draggedId ? { ...w, col: targetCol, row: targetRow } : w);

      // Regeneramos los espacios vacíos limpiamente
      return generateGrid(realWidgets);
    });
    
    setDraggedId(null);
  };

  return (
    // IMPORTANTE: Fijamos las columnas a 4 para que las coordenadas funcionen perfecto.
    <div className="grid grid-cols-4 gap-3 auto-rows-[130px] items-stretch min-w-[700px] overflow-x-auto">
      {widgets.map((widget) => (
        <Island
          key={widget.id}
          colSpan={widget.colSpan}
          rowSpan={widget.rowSpan}
          col={widget.col}
          row={widget.row}
          draggableEnabled={armedId === widget.id}
          isDragging={draggedId === widget.id}
          showHandle={widget.type !== 'empty'}
          onHandleDown={() => setArmedId(widget.id)}
          onDragStart={(e) => handleDragStart(e, widget.id)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => handleDragOver(e, widget)}
          onDrop={(e) => handleDrop(e, widget.id)}
        >
          {renderWidgetContent(widget.type)}
        </Island>
      ))}
    </div>
  );
}
```

### `src\modules\dashboard\TopBar.tsx`

```tsx
import { useState } from 'react';
import { clearSession } from '../../core/auth/authService';
import { IconMenu } from '../../shared/icons';

const notifications = [
  { id: 1, color: 'var(--bios-danger)', text: 'Pago tarjeta vence hoy', meta: 'Finanzas · hace 2h' },
  { id: 2, color: 'var(--bios-warn)', text: 'Control médico en 3 días', meta: 'Salud · hace 5h' },
  { id: 3, color: 'var(--bios-accent)', text: 'Nueva tarea asignada', meta: 'Tareas · hace 1d' },
];

interface Props {
  onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: Props) {
  const [showNotif, setShowNotif] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  function handleLogout() {
    clearSession();
    window.location.reload();
  }

  return (
    <div
      className="sticky top-0 z-10 flex items-center justify-between px-5 py-2.5 backdrop-blur-md border-b"
      style={{ background: 'rgba(15,22,38,0.85)', borderColor: 'var(--bios-border)' }}
    >
      <div className="flex items-center gap-2.5">
        <button
          onClick={onMenuClick}
          className="flex md:hidden w-[30px] h-[30px] rounded-[9px] border items-center justify-center"
          style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text-dim)' }}
        >
          <IconMenu style={{ width: 16, height: 16 }} />
        </button>
        <div
          className="w-[26px] h-[26px] rounded-full"
          style={{
            background:
              'radial-gradient(circle at 35% 30%, #cdeeff, var(--bios-accent) 45%, var(--bios-accent-2) 90%)',
            boxShadow: '0 0 14px var(--bios-accent-glow)',
          }}
        />
        <span className="font-display font-bold tracking-[3px] text-[14px]">BIOS</span>
      </div>

      <div className="flex items-center gap-3.5 relative">
        <button
          onClick={() => setShowNotif((s) => !s)}
          className="relative w-[30px] h-[30px] rounded-[9px] border flex items-center justify-center text-[14px]"
          style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text-dim)' }}
        >
          🔔
          {notifications.length > 0 && (
            <span
              className="absolute -top-1 -right-1 text-white text-[9px] rounded-[10px] px-1 font-mono"
              style={{ background: 'var(--bios-danger)' }}
            >
              {notifications.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setShowMenu((s) => !s)}
          className="w-7 h-7 rounded-full border"
          style={{ background: 'linear-gradient(160deg,#3a4a72,#1c2740)', borderColor: 'var(--bios-border)' }}
        />

        {showNotif && (
          <div
            className="absolute top-11 right-0 w-[270px] rounded-[14px] p-2.5 border z-20"
            style={{
              background: 'linear-gradient(160deg, var(--bios-card-a), var(--bios-card-b))',
              borderColor: 'var(--bios-border)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
            }}
          >
            <h4
              className="text-[11px] font-semibold uppercase tracking-wide mx-1.5 mb-2"
              style={{ color: 'var(--bios-text-dim)' }}
            >
              Notificaciones
            </h4>
            {notifications.map((n) => (
              <div key={n.id} className="flex gap-2 px-1.5 py-2 rounded-lg hover:bg-white/5">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: n.color }} />
                <div>
                  <p className="text-[11.5px] m-0">{n.text}</p>
                  <span className="text-[10px]" style={{ color: 'var(--bios-text-faint)' }}>
                    {n.meta}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {showMenu && (
          <div
            className="absolute top-11 right-0 w-[160px] rounded-[12px] p-1.5 border z-20"
            style={{
              background: 'linear-gradient(160deg, var(--bios-card-a), var(--bios-card-b))',
              borderColor: 'var(--bios-border)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
            }}
          >
            <button
              onClick={handleLogout}
              className="w-full text-left text-[11.5px] px-2.5 py-2 rounded-lg hover:bg-white/5"
              style={{ color: 'var(--bios-text-dim)' }}
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

```

### `src\modules\finanzas\FinanzasModule.tsx`

```tsx
import { useState } from 'react';
import { FinanzasNav } from './FinanzasNav';

export function FinanzasModule() {
  const [tab, setTab] = useState('resumen');

  return (
    <div className="pb-10">
      <div className="max-w-[1180px] mx-auto px-5 pt-4">
        <h1 className="font-display font-bold text-[15px] mb-3">Finanzas</h1>
        <FinanzasNav active={tab} onChange={setTab} />
        <div className="py-10 text-center font-mono text-[11px]" style={{ color: 'var(--bios-text-faint)' }}>
          — contenido de "{tab}" —
        </div>
      </div>
    </div>
  );
}

```

### `src\modules\finanzas\FinanzasNav.tsx`

```tsx
import {
  IconGrid,
  IconBank,
  IconSwap,
  IconCard,
  IconPieChart,
  IconReport,
  IconTarget,
  IconTags,
  IconBuildingStore,
  IconCalendar,
  IconStar,
} from '../../shared/icons';
import { ModuleNav, type ModuleNavItem } from '../../shared/components/ModuleNav';

// Pestañas siempre visibles
const TABS: ModuleNavItem[] = [
  { id: 'resumen', label: 'Resumen', icon: IconGrid },
  { id: 'cuentas', label: 'Cuentas', icon: IconBank },
  { id: 'transacciones', label: 'Transacciones', icon: IconSwap },
  { id: 'tarjetas', label: 'Tarjetas', icon: IconCard },
  { id: 'presupuestos', label: 'Presupuestos', icon: IconPieChart },
  { id: 'informes', label: 'Informes', icon: IconReport },
];

// Pestañas escondidas detrás de "Más"
const MORE_TABS: ModuleNavItem[] = [
  { id: 'objetivos', label: 'Objetivos', icon: IconTarget },
  { id: 'categorias', label: 'Categorías', icon: IconTags },
  { id: 'comercios', label: 'Comercios', icon: IconBuildingStore },
  { id: 'calendario', label: 'Calendario', icon: IconCalendar },
  { id: 'actuacion', label: 'Mi Actuación', icon: IconStar },
];

interface Props {
  active: string;
  onChange: (id: string) => void;
}

export function FinanzasNav({ active, onChange }: Props) {
  return <ModuleNav items={TABS} moreItems={MORE_TABS} activeId={active} onChange={onChange} />;
}
```

### `src\shared\components\GridBackground.tsx`

```tsx
export function GridBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        backgroundImage:
          'linear-gradient(rgba(120,160,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(120,160,255,0.06) 1px, transparent 1px)',
        backgroundSize: '36px 36px',
        WebkitMaskImage:
          'radial-gradient(ellipse 80% 60% at 50% 20%, black 20%, transparent 75%)',
        maskImage:
          'radial-gradient(ellipse 80% 60% at 50% 20%, black 20%, transparent 75%)',
      }}
    />
  );
}

```

### `src\shared\components\MobileDrawer.tsx`

```tsx
import { navItems } from '../navConfig';
import { IconPlus } from '../icons';

interface Props {
  open: boolean;
  activeId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}

export function MobileDrawer({ open, activeId, onSelect, onClose }: Props) {
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[39] bg-black/60 transition-opacity md:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />
      <div
        className="fixed top-0 left-0 bottom-0 z-40 flex flex-col md:hidden transition-transform duration-200"
        style={{
          width: 190,
          padding: '16px 12px',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          background: 'linear-gradient(160deg, var(--bios-card-a), var(--bios-card-b))',
          borderRight: '1px solid var(--bios-border)',
        }}
      >
        <div
          className="rounded-full flex-shrink-0"
          style={{
            width: 26,
            height: 26,
            marginBottom: 22,
            background: 'radial-gradient(circle at 35% 30%, #cdeeff, var(--bios-accent) 45%, var(--bios-accent-2) 90%)',
            boxShadow: '0 0 14px var(--bios-accent-glow)',
          }}
        />

        {navItems.map((item) => {
          const active = item.id === activeId;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelect(item.id);
                onClose();
              }}
              className="w-full flex items-center gap-3 rounded-[11px] mb-2 border text-[14px]"
              style={{
                height: 40,
                padding: '0 9px',
                background: active ? 'linear-gradient(160deg, var(--bios-card-a), var(--bios-card-b))' : 'transparent',
                borderColor: active ? 'var(--bios-border-hover)' : 'transparent',
                color: active ? 'var(--bios-text)' : 'var(--bios-text-dim)',
              }}
            >
              <item.icon style={{ width: 19, height: 19, flexShrink: 0 }} />
              <span>{item.label}</span>
            </button>
          );
        })}

        <button
          className="mt-auto w-full flex items-center gap-3 rounded-[9px] border border-dashed text-[13px]"
          style={{ height: 34, padding: '0 9px', borderColor: 'var(--bios-border-hover)', color: 'var(--bios-text-faint)' }}
        >
          <IconPlus style={{ width: 16, height: 16, flexShrink: 0 }} />
          <span>Nuevo módulo</span>
        </button>
      </div>
    </>
  );
}
```

### `src\shared\components\Modal.tsx`

```tsx
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
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className="w-[280px] rounded-[14px] p-[18px] border"
        style={{
          background: 'linear-gradient(160deg, var(--bios-card-a), var(--bios-card-b))',
          borderColor: 'var(--bios-border)',
          boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
        }}
      >
        <h3 className="font-display text-[13px] mb-1.5">{title}</h3>
        {description && (
          <p className="text-[11.5px] leading-relaxed mb-4" style={{ color: 'var(--bios-text-dim)' }}>
            {description}
          </p>
        )}
        {children}
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
      </div>
    </div>
  );
}

```

### `src\shared\components\ModuleNav.tsx`

```tsx
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
```

### `src\shared\components\Sidebar.tsx`

```tsx
import { useState } from 'react';
import { navItems } from '../navConfig';
import { IconPlus, IconMenu } from '../icons';

interface Props {
  activeId: string;
  onSelect: (id: string) => void;
}

export function Sidebar({ activeId, onSelect }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="hidden md:flex flex-col items-start flex-shrink-0 border-r transition-all duration-200"
      style={{
        width: expanded ? 170 : 64,
        padding: '16px 12px',
        borderColor: 'var(--bios-border)',
        background: 'rgba(15,22,38,0.5)',
      }}
    >
      <div
        className="rounded-full flex-shrink-0"
        style={{
          width: 26,
          height: 26,
          margin: '0 0 22px 2px',
          background: 'radial-gradient(circle at 35% 30%, #cdeeff, var(--bios-accent) 45%, var(--bios-accent-2) 90%)',
          boxShadow: '0 0 14px var(--bios-accent-glow)',
        }}
      />

      {navItems.map((item) => {
        const active = item.id === activeId;
        return (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className="w-full flex items-center gap-3 rounded-[11px] mb-2 border text-[14px] whitespace-nowrap overflow-hidden"
            style={{
              height: 40,
              padding: '0 9px',
              background: active ? 'linear-gradient(160deg, var(--bios-card-a), var(--bios-card-b))' : 'transparent',
              borderColor: active ? 'var(--bios-border-hover)' : 'transparent',
              color: active ? 'var(--bios-text)' : 'var(--bios-text-dim)',
            }}
          >
            <item.icon style={{ width: 19, height: 19, flexShrink: 0 }} />
            <span style={{ opacity: expanded ? 1 : 0, width: expanded ? 'auto' : 0 }}>{item.label}</span>
          </button>
        );
      })}

      <button
        className="mt-auto mb-2 w-full flex items-center gap-3 rounded-[9px] border border-dashed text-[13px]"
        style={{ height: 34, padding: '0 9px', borderColor: 'var(--bios-border-hover)', color: 'var(--bios-text-faint)' }}
      >
        <IconPlus style={{ width: 16, height: 16, flexShrink: 0 }} />
        <span style={{ opacity: expanded ? 1 : 0, width: expanded ? 'auto' : 0 }}>Nuevo módulo</span>
      </button>

      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-10 h-10 rounded-[11px] border flex items-center justify-center"
        style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text-faint)' }}
      >
        <IconMenu style={{ width: 18, height: 18 }} />
      </button>
    </div>
  );
}
```

### `src\shared\icons.tsx`

```tsx
import {
  IconHome,
  IconPlus,
  IconMenu2,
  IconBell,
  IconGripVertical,
  IconLayoutDashboard,
  IconBuildingBank,
  IconArrowsRightLeft,
  IconCreditCard,
  IconChartPie,
  IconReportAnalytics,
  IconDots,
  IconTarget,
  IconTags,
  IconBuildingStore,
  IconCalendar,
  IconStar,
} from '@tabler/icons-react';

// Re-exportamos con los MISMOS nombres que ya usa el resto de la app
// (Sidebar.tsx, MobileDrawer.tsx, TopBar.tsx, FinanzasNav.tsx, etc.)
// para no tener que tocar ningún otro archivo. Solo cambia la
// implementación interna: ahora son iconos de Tabler en vez de SVGs
// dibujados a mano.
export {
  IconHome,
  IconPlus,
  IconMenu2 as IconMenu,
  IconBell,
  IconGripVertical as IconGrip,
  IconLayoutDashboard as IconGrid,
  IconBuildingBank as IconBank,
  IconArrowsRightLeft as IconSwap,
  IconCreditCard as IconCard,
  IconChartPie as IconPieChart,
  IconReportAnalytics as IconReport,
  IconDots,
  // Nuevos, usados en el menú "Más" de Finanzas (y reutilizables en otros módulos)
  IconTarget,
  IconTags,
  IconBuildingStore,
  IconCalendar,
  IconStar,
};
```

### `src\shared\navConfig.tsx`

```tsx
import { IconHome, IconBank } from './icons';

export interface NavItem {
  id: string;
  label: string;
  icon: typeof IconHome;
}

/**
 * Cada módulo nuevo que se cree se agrega aquí. La barra lateral y el
 * drawer móvil leen de esta misma lista, así nunca se desincronizan.
 */
export const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: IconHome },
  { id: 'finanzas', label: 'Finanzas', icon: IconBank },
];
```

