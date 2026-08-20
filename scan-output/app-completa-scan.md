# Escaneo: app-completa

_Generado: 2026-08-20T15:05:38.438Z_

## ⚠️ Posibles duplicados detectados

- ⚠️ Hay 2 carpetas compartidas/infraestructura (shared, core...) distintas: src\shared , src\core — revisa si deberían unificarse.

## Carpetas "modules" encontradas en el proyecto
- src\modules

## Módulos detectados
- dashboard  (src\modules\dashboard)
- finanzas  (src\modules\finanzas)

## Carpetas compartidas/infraestructura incluidas (shared, core...)
- src\shared
- src\core

## Contrato de desarrollo

# Contrato de desarrollo del proyecto

> Este archivo se incluye automáticamente en cada escaneo para que cualquier
> LLM entienda las reglas del proyecto antes de tocar código. Complétalo con
> tus convenciones reales.

## Stack
- React + TypeScript + Tailwind CSS + Superbase + Vercel

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
- src\core\auth\LoginGate.tsx
- src\core\auth\authService.ts
- src\core\db\db.ts
- src\core\db\supabase.ts
- src\modules\dashboard\AppLayout.tsx
- src\modules\dashboard\DashboardShell.tsx
- src\modules\dashboard\IslandsGrid.tsx
- src\modules\dashboard\TopBar.tsx
- src\modules\finanzas\CategoriasView.tsx
- src\modules\finanzas\CuentasView.tsx
- src\modules\finanzas\FinanzasModule.tsx
- src\modules\finanzas\FinanzasNav.tsx
- src\modules\finanzas\widgets\CuentaWidget.tsx
- src\shared\components\FormControls.tsx
- src\shared\components\GridBackground.tsx
- src\shared\components\MobileDrawer.tsx
- src\shared\components\Modal.tsx
- src\shared\components\ModuleNav.tsx
- src\shared\components\MonthSelector.tsx
- src\shared\components\Sidebar.tsx
- src\shared\icons.tsx
- src\shared\navConfig.tsx
- src\shared\widgetRegistry.ts
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
    "@supabase/supabase-js": "^2.112.3",
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
    "vite": "^8.2.0",
    "vite-plugin-pwa": "^1.3.0"
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
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'BIOS App',
        short_name: 'BIOS',
        description: 'Mi sistema personal de finanzas y gestión',
        theme_color: '#0f1626',
        background_color: '#0a1120',
        display: 'standalone', // Esto es la magia que quita la barra de Safari en el iPhone
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
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
  col: number;
  row: number;
}

// --- CONFIGURACIÓN INICIAL DE LA GRILLA ---
const REAL_WIDGETS: WidgetData[] = [
  { id: 'w-finanzas', type: 'finanzas', colSpan: 2, rowSpan: 1, col: 1, row: 1 },
  { id: 'w-tareas', type: 'tareas', colSpan: 1, rowSpan: 2, col: 3, row: 1 },
  { id: 'w-salud', type: 'salud', colSpan: 1, rowSpan: 1, col: 4, row: 1 },
  { id: 'w-escaner', type: 'escaner', colSpan: 1, rowSpan: 1, col: 4, row: 2 },
  { id: 'w-rendimiento', type: 'rendimiento', colSpan: 2, rowSpan: 2, col: 1, row: 2 },
];

function generateGrid(realWidgets: WidgetData[], minRows = 5, cols = 4): WidgetData[] {
  const maxRow = Math.max(minRows, ...realWidgets.map((w) => w.row + w.rowSpan - 1));
  const grid: WidgetData[] = [...realWidgets];

  for (let r = 1; r <= maxRow; r++) {
    for (let c = 1; c <= cols; c++) {
      const isCovered = realWidgets.some(
        (w) => c >= w.col && c < w.col + w.colSpan && r >= w.row && r < w.row + w.rowSpan
      );
      if (!isCovered) {
        grid.push({ id: `empty-${r}-${c}`, type: 'empty', colSpan: 1, rowSpan: 1, col: c, row: r });
      }
    }
  }
  return grid;
}

const INITIAL_WIDGETS = generateGrid(REAL_WIDGETS);

// --- ISLA (contenedor con el punto de agarre, SOLO escritorio) ---
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
        gridColumn: `${col} / span ${colSpan}`,
        gridRow: `${row} / span ${rowSpan}`,
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

// --- RENDERIZADOR DE CONTENIDO (compartido entre escritorio y móvil) ---
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
            <div className="flex justify-between text-[11px] p-2 rounded-md bg-white/5" style={{ color: 'var(--bios-text-dim)' }}>
              <span>Subir a Prod</span>
              <b style={{ color: 'var(--bios-danger)' }}>12:00</b>
            </div>
            <div className="flex justify-between text-[11px] p-2 rounded-md bg-white/5" style={{ color: 'var(--bios-text-dim)' }}>
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

  const handleDragOver = (e: DragEvent, targetWidget: WidgetData) => {
    e.preventDefault();

    if (targetWidget.type !== 'empty') {
      e.dataTransfer.dropEffect = 'none';
      return;
    }

    const draggedWidget = widgets.find((w) => w.id === draggedId);
    if (!draggedWidget) return;

    const targetCol = targetWidget.col;
    const targetRow = targetWidget.row;

    if (targetCol + draggedWidget.colSpan - 1 > 4) {
      e.dataTransfer.dropEffect = 'none';
      return;
    }

    const hasCollision = widgets.some((w) => {
      if (w.id === draggedId || w.type === 'empty') return false;
      const wRight = w.col + w.colSpan - 1;
      const wBottom = w.row + w.rowSpan - 1;
      const dropRight = targetCol + draggedWidget.colSpan - 1;
      const dropBottom = targetRow + draggedWidget.rowSpan - 1;
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
        return prev;
      }

      const targetCol = targetWidget.col;
      const targetRow = targetWidget.row;

      if (targetCol + draggedWidget.colSpan - 1 > 4) return prev;

      const hasCollision = prev.some((w) => {
        if (w.id === draggedId || w.type === 'empty') return false;
        const wRight = w.col + w.colSpan - 1;
        const wBottom = w.row + w.rowSpan - 1;
        const dropRight = targetCol + draggedWidget.colSpan - 1;
        const dropBottom = targetRow + draggedWidget.rowSpan - 1;
        return !(w.col > dropRight || wRight < targetCol || w.row > dropBottom || wBottom < targetRow);
      });

      if (hasCollision) return prev;

      const realWidgets = prev
        .filter((w) => w.type !== 'empty')
        .map((w) => (w.id === draggedId ? { ...w, col: targetCol, row: targetRow } : w));

      return generateGrid(realWidgets);
    });

    setDraggedId(null);
  };

  // Solo los widgets reales (sin los huecos fantasma), en el orden en que
  // quedaron dispuestos en escritorio: fila arriba->abajo, columna izq->der.
  const widgetsParaMovil = widgets
    .filter((w) => w.type !== 'empty')
    .sort((a, b) => a.row - b.row || a.col - b.col);

  return (
    <>
      {/* ============ ESCRITORIO / TABLET: grid arrastrable ============ */}
      <div className="hidden md:grid grid-cols-4 gap-3 auto-rows-[130px] items-stretch min-w-[700px] overflow-x-auto">
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

      {/* ============ MÓVIL: lista apilada de solo lectura ============ */}
      {/* Mismo estado `widgets`, sin drag, sin huecos fantasma, orden
          heredado de la posición que tenían en escritorio (fila, columna). */}
      <div className="flex md:hidden flex-col gap-3">
        {widgetsParaMovil.map((widget) => (
          <div key={widget.id} className="min-h-[130px]">
            {renderWidgetContent(widget.type)}
          </div>
        ))}
      </div>
    </>
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

### `src\modules\finanzas\CategoriasView.tsx`

```tsx
import { useEffect, useState } from 'react';
import { Modal } from '../../shared/components/Modal';
import { ColorPicker } from '../../shared/components/FormControls';
import { IconPlus, IconTags } from '../../shared/icons';
import { getCategorias, crearCategoria, actualizarCategoria, archivarCategoria, type Categoria } from '../../core/db/db';

export function CategoriasView() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [tipoActivo, setTipoActivo] = useState<'gasto' | 'ingreso'>('gasto');

  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [nombre, setNombre] = useState('');
  const [emoji, setEmoji] = useState('🏷️');
  const [color, setColor] = useState('#e74c3c');
  const [guardando, setGuardando] = useState(false);

  async function cargar() {
    setCargando(true);
    try {
      setCategorias(await getCategorias());
    } catch (err) {
      console.error('Error cargando categorías:', err);
      alert('No se pudieron cargar las categorías. Revisa la consola.');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  function abrirNueva() {
    setEditandoId(null);
    setNombre('');
    setEmoji('🏷️');
    setColor(tipoActivo === 'ingreso' ? '#2ecc71' : '#e74c3c');
    setModalAbierto(true);
  }

  function abrirEditar(cat: Categoria) {
    setEditandoId(cat.id!);
    setNombre(cat.nombre);
    setEmoji(cat.emoji || '🏷️');
    setColor(cat.color);
    setModalAbierto(true);
  }

  async function handleGuardar() {
    if (!nombre.trim()) return alert('El nombre es obligatorio');

    setGuardando(true);
    try {
      if (editandoId) {
        await actualizarCategoria(editandoId, { nombre: nombre.trim(), emoji, color });
      } else {
        await crearCategoria({ nombre: nombre.trim(), tipo: tipoActivo, emoji, color, archivada: false });
      }
      await cargar();
      setModalAbierto(false);
    } catch (err) {
      console.error('Error guardando categoría:', err);
      alert('No se pudo guardar la categoría. Revisa la consola.');
    } finally {
      setGuardando(false);
    }
  }

  async function handleArchivar(id: string) {
    if (!confirm('¿Archivar esta categoría?')) return;
    const ok = await archivarCategoria(id);
    if (ok) await cargar();
    else alert('No se pudo archivar la categoría.');
  }

  const categoriasFiltradas = categorias.filter((c) => c.tipo === tipoActivo);

  return (
    <div className="mt-6">
      {/* Toggle Gasto / Ingreso */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setTipoActivo('gasto')}
          className="px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-colors"
          style={{
            background: tipoActivo === 'gasto' ? 'var(--bios-danger)' : 'transparent',
            borderColor: tipoActivo === 'gasto' ? 'var(--bios-danger)' : 'var(--bios-border)',
            color: tipoActivo === 'gasto' ? '#fff' : 'var(--bios-text-dim)',
          }}
        >
          Categorías Gastos
        </button>
        <button
          onClick={() => setTipoActivo('ingreso')}
          className="px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-colors"
          style={{
            background: tipoActivo === 'ingreso' ? 'var(--bios-ok)' : 'transparent',
            borderColor: tipoActivo === 'ingreso' ? 'var(--bios-ok)' : 'var(--bios-border)',
            color: tipoActivo === 'ingreso' ? '#0a1120' : 'var(--bios-text-dim)',
          }}
        >
          Categorías Ingresos
        </button>

        <button
          onClick={abrirNueva}
          className="ml-auto w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: tipoActivo === 'ingreso' ? 'var(--bios-ok)' : 'var(--bios-danger)', color: '#fff' }}
          title="Nueva categoría"
        >
          <IconPlus size={16} />
        </button>
      </div>

      {cargando && (
        <div className="text-[12px] text-center py-6" style={{ color: 'var(--bios-text-dim)' }}>
          Cargando categorías...
        </div>
      )}

      {!cargando && categoriasFiltradas.length === 0 && (
        <div
          className="rounded-[11px] border border-dashed p-6 text-center text-[12px]"
          style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text-dim)' }}
        >
          <IconTags size={22} className="mx-auto mb-2" style={{ opacity: 0.5 }} />
          Sin categorías. Usa el botón + para crear una.
        </div>
      )}

      <div className="flex flex-col gap-2">
        {categoriasFiltradas.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between rounded-[11px] border px-3 py-2.5"
            style={{
              background: 'linear-gradient(160deg, var(--bios-card-a), var(--bios-card-b))',
              borderColor: 'var(--bios-border)',
            }}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-[17px]">{cat.emoji || '🏷️'}</span>
              <span className="text-[13px] font-medium" style={{ color: 'var(--bios-text)' }}>
                {cat.nombre}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ background: cat.color }} />
              <button
                onClick={() => abrirEditar(cat)}
                className="text-[11px] px-2 py-1 rounded-md hover:bg-white/5"
                style={{ color: 'var(--bios-text-dim)' }}
              >
                Editar
              </button>
              <button
                onClick={() => handleArchivar(cat.id!)}
                className="text-[11px] px-2 py-1 rounded-md hover:bg-white/5"
                style={{ color: 'var(--bios-danger)' }}
              >
                Archivar
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={modalAbierto}
        title={editandoId ? 'Editar categoría' : 'Nueva categoría'}
        onCancel={() => setModalAbierto(false)}
        hideDefaultFooter
      >
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex items-center gap-3">
            <input
              value={emoji}
              onChange={(e) => setEmoji(e.target.value.slice(0, 2))}
              className="w-12 h-12 text-center text-[22px] bg-black/20 border rounded-[10px] outline-none"
              style={{ borderColor: 'var(--bios-border)' }}
            />
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-[11px]" style={{ color: 'var(--bios-text-dim)' }}>Nombre</label>
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Restaurantes, Salario..."
                className="w-full bg-black/20 border rounded-[10px] px-3 py-2 text-[13px] outline-none"
                style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text)' }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px]" style={{ color: 'var(--bios-text-dim)' }}>Color</label>
            <ColorPicker value={color} onChange={setColor} />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t" style={{ borderColor: 'var(--bios-border)' }}>
            <button
              onClick={() => setModalAbierto(false)}
              className="text-[11px] px-3 py-2 rounded-lg border"
              style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text-dim)' }}
            >
              Cancelar
            </button>
            <button
              onClick={handleGuardar}
              disabled={guardando}
              className="text-[12px] font-semibold px-4 py-2 rounded-lg disabled:opacity-50"
              style={{ background: 'var(--bios-accent)', color: '#0a1120' }}
            >
              {guardando ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
```

### `src\modules\finanzas\CuentasView.tsx`

```tsx
import { useEffect, useState } from 'react';
import CuentaWidget, { type CuentaData } from './widgets/CuentaWidget';
import { Modal } from '../../shared/components/Modal';
import { IconPlus, IconTrash } from '../../shared/icons';
import { ColorPicker, ImageLogoInput, ToggleCard } from '../../shared/components/FormControls';
import { getCuentas, crearCuenta, getTransacciones, calcularSaldoCuenta } from '../../core/db/db';

export function CuentasView() {
  const [cuentas, setCuentas] = useState<CuentaData[]>([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // Estados del Modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoSaldo, setNuevoSaldo] = useState('');
  const [nuevoLogo, setNuevoLogo] = useState('');
  const [nuevoColor, setNuevoColor] = useState('#3498db');
  const [incluirDashboard, setIncluirDashboard] = useState(true);

  async function cargarCuentas() {
    setCargando(true);
    try {
      // Traemos cuentas Y transacciones juntas: el saldo de cada cuenta
      // depende de sumar/restar todas las transacciones que la tocan.
      const [filas, transacciones] = await Promise.all([getCuentas(), getTransacciones()]);

      setCuentas(
        filas.map((fila) => {
          const saldo = calcularSaldoCuenta(fila.id!, fila.saldo_inicial, transacciones);
          return {
            id: fila.id!,
            nombre: fila.nombre,
            // TODO: cuando exista navegación de mes (pantalla Transacciones/Resumen),
            // saldoPrevisto pasa a incluir también las transacciones PENDIENTES
            // hasta el fin del mes navegado, igual que hacía el piloto. Por ahora
            // son iguales porque no hay mes que navegar todavía.
            saldoActual: saldo,
            saldoPrevisto: saldo,
            color: fila.color || '#3498db',
            logo: fila.logo || undefined,
          };
        })
      );
    } catch (err) {
      console.error('Error cargando cuentas:', err);
      alert('No se pudieron cargar las cuentas. Revisa la consola.');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarCuentas();
  }, []);

  async function handleGuardarCuenta() {
    if (!nuevoNombre.trim()) return alert('El nombre es obligatorio');

    setGuardando(true);
    try {
      await crearCuenta({
        nombre: nuevoNombre.trim(),
        saldo_inicial: parseFloat(nuevoSaldo) || 0,
        color: nuevoColor,
        logo: nuevoLogo || undefined,
        incluir_dashboard: incluirDashboard,
      });
      // Recargamos todo (cuentas + transacciones) en vez de solo empujar la
      // nueva al estado — así el saldo se calcula igual para todas.
      await cargarCuentas();
      limpiarYCerrar();
    } catch (err) {
      console.error('Error guardando cuenta:', err);
      alert('No se pudo guardar la cuenta. Revisa la consola.');
    } finally {
      setGuardando(false);
    }
  }

  function limpiarYCerrar() {
    setNuevoNombre('');
    setNuevoSaldo('');
    setNuevoLogo('');
    setNuevoColor('#3498db');
    setIncluirDashboard(true);
    setModalAbierto(false);
  }

  const anchoSaldoCh = Math.max((nuevoSaldo || '0.00').length + 1, 5);

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <button
          onClick={() => setModalAbierto(true)}
          className="rounded-[11px] border-2 border-dashed flex flex-col items-center justify-center gap-2 min-h-[160px] transition-colors hover:bg-white/5"
          style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text-dim)' }}
        >
          <div className="w-10 h-10 rounded-full border flex items-center justify-center" style={{ borderColor: 'var(--bios-border)' }}>
            <IconPlus size={20} />
          </div>
          <span className="text-[13px] font-medium">Nueva cuenta</span>
        </button>

        {cargando && (
          <div className="col-span-full text-[12px] text-center py-6" style={{ color: 'var(--bios-text-dim)' }}>
            Cargando cuentas...
          </div>
        )}

        {!cargando &&
          cuentas.map((cuenta) => (
            <div
              key={cuenta.id}
              className="rounded-[11px] border p-3 flex flex-col min-h-[160px]"
              style={{
                background: 'linear-gradient(160deg, var(--bios-card-a), var(--bios-card-b))',
                borderColor: 'var(--bios-border)',
              }}
            >
              <CuentaWidget cuenta={cuenta} />
            </div>
          ))}
      </div>

      <Modal open={modalAbierto} title="Añadir cuenta" onCancel={limpiarYCerrar} hideDefaultFooter>
        <div className="flex flex-col mt-2">
          <div className="flex flex-col items-center justify-center mb-6 mt-2">
            <div className="flex items-center justify-center gap-1">
              <span className="text-[24px] font-display font-bold flex-shrink-0" style={{ color: 'var(--bios-text-dim)' }}>$</span>
              <input
                type="number"
                value={nuevoSaldo}
                onChange={(e) => setNuevoSaldo(e.target.value)}
                placeholder="0.00"
                className="bg-transparent text-[38px] font-display font-bold outline-none text-left min-w-0"
                style={{ color: 'var(--bios-text)', width: `${anchoSaldoCh}ch` }}
              />
            </div>
            <div className="w-full max-w-[220px] h-px mt-1 border-b border-dashed mx-auto" style={{ borderColor: 'var(--bios-border)' }} />
          </div>

          <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-[11px]" style={{ color: 'var(--bios-text-dim)' }}>Nombre de la institución financiera</label>
            <input
              type="text"
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
              placeholder="Ej. Bancolombia, Efectivo..."
              className="w-full bg-black/20 border rounded-[10px] px-3 py-2.5 text-[13px] outline-none transition-colors"
              style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text)' }}
            />
          </div>

          <div className="flex flex-col gap-4 mb-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px]" style={{ color: 'var(--bios-text-dim)' }}>URL del Logo institucional</label>
              <ImageLogoInput url={nuevoLogo} onChange={setNuevoLogo} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px]" style={{ color: 'var(--bios-text-dim)' }}>Color distintivo</label>
              <ColorPicker value={nuevoColor} onChange={setNuevoColor} />
            </div>
          </div>

          <div className="mb-6">
            <ToggleCard
              label="Incluir en la suma del dashboard"
              description="El saldo acumulado se sumará al patrimonio total visible."
              checked={incluirDashboard}
              onChange={setIncluirDashboard}
            />
          </div>

          <div className="flex justify-between items-center pt-4 border-t" style={{ borderColor: 'var(--bios-border)' }}>
            <button
              onClick={() => { setNuevoNombre(''); setNuevoSaldo(''); setNuevoLogo(''); setNuevoColor('#3498db'); }}
              className="flex items-center gap-1.5 text-[11px] px-3 py-2 rounded-lg transition-colors hover:bg-white/5"
              style={{ color: 'var(--bios-text-dim)' }}
            >
              <IconTrash size={14} /> Limpiar campos
            </button>

            <button
              onClick={handleGuardarCuenta}
              disabled={guardando}
              className="text-[12px] font-semibold px-4 py-2 rounded-lg transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: 'var(--bios-accent)', color: '#0a1120' }}
            >
              {guardando ? 'Guardando...' : 'Guardar cuenta'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
```

### `src\modules\finanzas\FinanzasModule.tsx`

```tsx
import { useState } from 'react';
import { FinanzasNav } from './FinanzasNav';
import { CuentasView } from './CuentasView';
import { CategoriasView } from './CategoriasView';
import { MonthSelector } from '../../shared/components/MonthSelector';

export function FinanzasModule() {
  const [tab, setTab] = useState('cuentas');
  const [mesActual, setMesActual] = useState(new Date());

  function moverMes(direccion: -1 | 1) {
    setMesActual((prev) => {
      const nuevo = new Date(prev);
      nuevo.setMonth(nuevo.getMonth() + direccion);
      return nuevo;
    });
  }

  return (
    <div className="pb-10">
      <div className="max-w-[1180px] mx-auto px-5 pt-4">
        <h1 className="font-display font-bold text-[15px] mb-3">Finanzas</h1>
        <FinanzasNav active={tab} onChange={setTab} />

        <MonthSelector mes={mesActual} onAnterior={() => moverMes(-1)} onSiguiente={() => moverMes(1)} />

        {/* Enrutador interno del módulo */}
        {tab === 'cuentas' ? (
          <CuentasView />
        ) : tab === 'categorias' ? (
          <CategoriasView />
        ) : (
          <div className="py-10 text-center font-mono text-[11px]" style={{ color: 'var(--bios-text-faint)' }}>
            — contenido de "{tab}" en construcción —
          </div>
        )}
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

### `src\modules\finanzas\widgets\CuentaWidget.tsx`

```tsx
import { IconDots, IconPlus, IconBank, IconPieChart } from '../../../shared/icons';

// Ahora el widget recibe la información completa de la cuenta
export interface CuentaData {
  id: string;   // antes era number — Supabase da UUIDs (texto), no números
  nombre: string;
  saldoActual: number;
  saldoPrevisto: number;
  color: string;
  logo?: string;
}

interface Props {
  cuenta: CuentaData;
}

const formatearDinero = (monto: number) => {
  return new Intl.NumberFormat('es-CO', { 
    style: 'currency', 
    currency: 'COP', 
    minimumFractionDigits: 0 
  }).format(monto);
};

export default function CuentaWidget({ cuenta }: Props) {
  const colorActual = cuenta.saldoActual >= 0 ? 'var(--bios-ok)' : 'var(--bios-danger)';
  const colorPrevisto = cuenta.saldoPrevisto >= 0 ? 'var(--bios-ok)' : 'var(--bios-danger)';

  return (
    <div className="flex flex-col h-full w-full justify-between">
      {/* Cabecera */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          {cuenta.logo ? (
            <img src={cuenta.logo} alt="logo" className="w-[30px] h-[30px] rounded-[8px] object-cover" />
          ) : (
            <div 
              className="w-[30px] h-[30px] rounded-[8px] flex items-center justify-center text-white"
              style={{ background: cuenta.color }}
            >
              <IconBank size={16} />
            </div>
          )}
          <span className="font-semibold text-[13px] text-[var(--bios-text)]">
            {cuenta.nombre}
          </span>
        </div>
        <button className="text-[var(--bios-text-faint)] hover:text-[var(--bios-text)] transition-colors">
          <IconDots size={16} />
        </button>
      </div>

      {/* Cuerpo: Saldos */}
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex justify-between items-end">
          <span className="text-[11px]" style={{ color: 'var(--bios-text-dim)' }}>Saldo actual</span>
          <span className="font-display font-bold text-[16px]" style={{ color: colorActual }}>
            {formatearDinero(cuenta.saldoActual)}
          </span>
        </div>
        <div className="flex justify-between items-end">
          <span className="text-[11px] flex items-center gap-1" style={{ color: 'var(--bios-text-dim)' }}>
            Saldo previsto <IconPieChart size={10} style={{ opacity: 0.6 }} />
          </span>
          <span className="font-display font-medium text-[13px]" style={{ color: colorPrevisto }}>
            {formatearDinero(cuenta.saldoPrevisto)}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--bios-border)' }}>
        <button 
          className="w-full py-1.5 flex items-center justify-center gap-1.5 rounded-lg text-[10.5px] font-semibold transition-colors hover:bg-white/5"
          style={{ 
            color: 'var(--bios-text-dim)',
            border: '1px solid var(--bios-border)'
          }}
        >
          <IconPlus size={12} />
          AÑADIR GASTO
        </button>
      </div>
    </div>
  );
}
```

### `src\shared\components\FormControls.tsx`

```tsx
import { IconBank, IconPlus } from '../icons';

// ==========================================
// 1. Selector de Imagen / Logo
// ==========================================
interface ImageLogoInputProps {
  url: string;
  onChange: (url: string) => void;
}

export function ImageLogoInput({ url, onChange }: ImageLogoInputProps) {
  return (
    <div className="flex gap-2">
      <div 
        className="w-[38px] h-[38px] rounded-[10px] border flex-shrink-0 flex items-center justify-center overflow-hidden bg-black/20"
        style={{ borderColor: 'var(--bios-border)' }}
      >
        {url ? (
          <img src={url} alt="preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
        ) : (
          <IconBank size={20} style={{ color: 'var(--bios-text-faint)' }} />
        )}
      </div>
      <input
        type="url"
        placeholder="URL de la imagen..."
        value={url}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-black/20 border rounded-[10px] px-3 py-2 text-[13px] outline-none transition-colors"
        style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text)' }}
      />
    </div>
  );
}

// ==========================================
// 2. Selector de Color Distintivo
// ==========================================
interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

const PRESET_COLORS = ['#e74c3c', '#2ecc71', '#f1c40f', '#3498db', '#9b59b6'];

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex items-center gap-2 h-[38px]">
      {PRESET_COLORS.map(c => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          className="w-[26px] h-[26px] rounded-full transition-transform hover:scale-110 flex items-center justify-center"
          style={{ 
            backgroundColor: c,
            boxShadow: value === c ? '0 0 0 2px var(--bios-card-a), 0 0 0 4px ' + c : 'none'
          }}
        />
      ))}
      {/* Selector Personalizado */}
      <label 
        className="relative w-[26px] h-[26px] rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
        style={{ 
          background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
          boxShadow: !PRESET_COLORS.includes(value) && value ? '0 0 0 2px var(--bios-card-a), 0 0 0 4px ' + value : 'none'
        }}
      >
        <IconPlus size={14} color="white" style={{ mixBlendMode: 'difference' }} />
        <input 
          type="color" 
          value={value || '#ffffff'}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
      </label>
    </div>
  );
}

// ==========================================
// 3. Tarjeta tipo Toggle (Switch)
// ==========================================
interface ToggleCardProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ToggleCard({ label, description, checked, onChange }: ToggleCardProps) {
  return (
    <label 
      className="flex items-center justify-between p-3.5 rounded-[12px] border cursor-pointer transition-colors hover:bg-white/5"
      style={{ borderColor: 'var(--bios-border)', background: 'rgba(0,0,0,0.1)' }}
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-[12.5px] font-semibold" style={{ color: 'var(--bios-text)' }}>{label}</span>
        <span className="text-[11px]" style={{ color: 'var(--bios-text-dim)' }}>{description}</span>
      </div>
      
      {/* Switch visual CSS puro */}
      <div className="relative">
        <input type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <div 
          className="w-10 h-5 bg-black/40 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"
          style={{ backgroundColor: checked ? 'var(--bios-accent)' : 'rgba(255,255,255,0.1)' }}
        ></div>
      </div>
    </label>
  );
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

### `src\shared\components\MonthSelector.tsx`

```tsx
import { IconChevronLeft, IconChevronRight } from '../icons';

interface Props {
  mes: Date;
  onAnterior: () => void;
  onSiguiente: () => void;
}

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

/**
 * Selector de mes compartido por TODO el módulo de finanzas (no es solo de
 * una pantalla). Vive como estado en FinanzasModule.tsx y se le pasa a
 * cualquier pantalla que necesite filtrar por el mes navegado
 * (Transacciones, Resumen, Presupuestos, Informes...).
 */
export function MonthSelector({ mes, onAnterior, onSiguiente }: Props) {
  const etiqueta = `${MESES[mes.getMonth()]} ${mes.getFullYear()}`;

  return (
    <div
      className="flex items-center justify-between rounded-[12px] border px-2 py-2 mb-4"
      style={{
        background: 'linear-gradient(160deg, var(--bios-card-a), var(--bios-card-b))',
        borderColor: 'var(--bios-border)',
      }}
    >
      <button
        onClick={onAnterior}
        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5"
        style={{ color: 'var(--bios-text-dim)' }}
      >
        <IconChevronLeft size={18} />
      </button>
      <h3 className="font-display font-bold text-[14px]">{etiqueta}</h3>
      <button
        onClick={onSiguiente}
        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5"
        style={{ color: 'var(--bios-text-dim)' }}
      >
        <IconChevronRight size={18} />
      </button>
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
  IconTrash,
  IconChevronLeft,
  IconChevronRight,
} from '@tabler/icons-react';

// Re-exportamos con los mismos nombres que usa la app
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
  IconTarget,
  IconTags,
  IconBuildingStore,
  IconCalendar,
  IconStar,
  IconTrash,
  IconChevronLeft,
  IconChevronRight,
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

### `src\shared\widgetRegistry.ts`

```tsx
import { lazy } from 'react';

export type WidgetContext = 'dashboard-main' | 'finanzas-resumen' | 'finanzas-cuentas';

export interface WidgetDefinition {
  id: string; // El ID del "molde"
  moduleId: string;
  allowedContexts: WidgetContext[];
  defaultColSpan: 1 | 2;
  defaultRowSpan: 1 | 2;
  component: React.ComponentType<any>;
}

const CuentaWidget = lazy(() => import('../modules/finanzas/widgets/CuentaWidget'));

export const WIDGET_REGISTRY: WidgetDefinition[] = [
  {
    id: 'finanzas-cuenta', // Este es el molde para TODAS las cuentas
    moduleId: 'finanzas',
    allowedContexts: ['dashboard-main', 'finanzas-resumen', 'finanzas-cuentas'],
    defaultColSpan: 1,
    defaultRowSpan: 1,
    component: CuentaWidget,
  }
];
```

### `src\core\auth\authService.ts`

```tsx
import { supabase } from '../db/supabase';

export async function iniciarSesion(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

// Mismo nombre que ya usa tu TopBar.tsx — no hace falta tocar ese archivo.
export async function clearSession() {
  await supabase.auth.signOut();
}

export async function haySesionActiva(): Promise<boolean> {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
}
```

### `src\core\auth\LoginGate.tsx`

```tsx
import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { supabase } from '../db/supabase';

/**
 * Envuelve TODA la app. Mientras no haya una sesión de Supabase Auth activa,
 * muestra el formulario de login y no renderiza `children`.
 *
 * Uso en main.tsx:
 *   <LoginGate>
 *     <App />
 *   </LoginGate>
 */
export function LoginGate({ children }: { children: ReactNode }) {
  const [cargando, setCargando] = useState(true);
  const [autenticado, setAutenticado] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAutenticado(!!data.session);
      setCargando(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setAutenticado(!!session);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError('');
    setEnviando(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setEnviando(false);
    if (error) setError('Correo o contraseña incorrectos.');
  }

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ color: 'var(--bios-text-dim)' }}>
        Cargando...
      </div>
    );
  }

  if (!autenticado) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-[320px] rounded-[16px] border p-6 flex flex-col gap-3"
          style={{
            background: 'linear-gradient(160deg, var(--bios-card-a), var(--bios-card-b))',
            borderColor: 'var(--bios-border)',
          }}
        >
          <div
            className="w-9 h-9 rounded-full mx-auto mb-1"
            style={{
              background:
                'radial-gradient(circle at 35% 30%, #cdeeff, var(--bios-accent) 45%, var(--bios-accent-2) 90%)',
              boxShadow: '0 0 14px var(--bios-accent-glow)',
            }}
          />
          <h1 className="text-center font-display font-bold text-[15px] mb-1">BIOS</h1>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo"
            autoComplete="username"
            className="px-3 py-2.5 rounded-lg border text-[13px] bg-black/20 outline-none"
            style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text)' }}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            autoComplete="current-password"
            className="px-3 py-2.5 rounded-lg border text-[13px] bg-black/20 outline-none"
            style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text)' }}
          />

          {error && (
            <p className="text-[11.5px]" style={{ color: 'var(--bios-danger)' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="mt-1 py-2.5 rounded-lg text-[13px] font-semibold disabled:opacity-50"
            style={{ background: 'var(--bios-accent)', color: '#0a1120' }}
          >
            {enviando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}
```

### `src\core\db\db.ts`

```tsx
import { supabase } from './supabase';

export interface Cuenta {
  id?: string;
  nombre: string;
  saldo_inicial: number;
  color?: string;
  logo?: string;
  incluir_dashboard?: boolean;
}

export interface Transaccion {
  id?: string;
  tipo: 'ingreso' | 'gasto' | 'transferencia';
  monto: number;
  descripcion: string;
  fecha: string; // 'YYYY-MM-DD'
  cuenta_id: string;
  cuenta_destino_id?: string | null;
  categoria_id?: string | null;
  pagado: boolean;
  archivada?: boolean;
}

export interface Categoria {
  id?: string;
  nombre: string;
  tipo: 'gasto' | 'ingreso';
  color: string;
  emoji?: string;
  archivada?: boolean;
}

// ==========================================
// CUENTAS
// ==========================================

export async function getCuentas(): Promise<Cuenta[]> {
  const { data, error } = await supabase
    .from('cuentas')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error al obtener cuentas:', error.message);
    return [];
  }

  return data || [];
}

export async function crearCuenta(cuenta: Omit<Cuenta, 'id'>): Promise<Cuenta | null> {
  const { data, error } = await supabase
    .from('cuentas')
    .insert([cuenta])
    .select()
    .single();

  if (error) {
    console.error('Error al crear cuenta:', error.message);
    throw new Error(error.message);
  }

  return data;
}

export async function eliminarCuenta(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('cuentas')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error al eliminar cuenta:', error.message);
    return false;
  }

  return true;
}

// ==========================================
// TRANSACCIONES
// ==========================================

export async function getTransacciones(): Promise<Transaccion[]> {
  const { data, error } = await supabase
    .from('transacciones')
    .select('*')
    .eq('archivada', false);

  if (error) {
    console.error('Error al obtener transacciones:', error.message);
    return [];
  }

  return data || [];
}

/**
 * Saldo real de una cuenta = saldo inicial + transacciones PAGADAS hasta hoy.
 */
export function calcularSaldoCuenta(
  cuentaId: string,
  saldoInicial: number,
  transacciones: Transaccion[]
): number {
  const hoy = new Date().toISOString().split('T')[0];
  let saldo = saldoInicial;

  transacciones
    .filter((t) => t.fecha <= hoy && t.pagado)
    .forEach((t) => {
      if (t.tipo === 'ingreso' && t.cuenta_id === cuentaId) saldo += t.monto;
      if (t.tipo === 'gasto' && t.cuenta_id === cuentaId) saldo -= t.monto;
      if (t.tipo === 'transferencia') {
        if (t.cuenta_id === cuentaId) saldo -= t.monto;
        if (t.cuenta_destino_id === cuentaId) saldo += t.monto;
      }
    });

  return saldo;
}

// ==========================================
// CATEGORÍAS
// ==========================================

export async function getCategorias(): Promise<Categoria[]> {
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .eq('archivada', false)
    .order('nombre', { ascending: true });

  if (error) {
    console.error('Error al obtener categorías:', error.message);
    return [];
  }

  return data || [];
}

export async function crearCategoria(categoria: Omit<Categoria, 'id'>): Promise<Categoria | null> {
  const { data, error } = await supabase
    .from('categorias')
    .insert([categoria])
    .select()
    .single();

  if (error) {
    console.error('Error al crear categoría:', error.message);
    throw new Error(error.message);
  }

  return data;
}

export async function actualizarCategoria(id: string, cambios: Partial<Categoria>): Promise<void> {
  const { error } = await supabase.from('categorias').update(cambios).eq('id', id);
  if (error) {
    console.error('Error al actualizar categoría:', error.message);
    throw new Error(error.message);
  }
}

export async function archivarCategoria(id: string): Promise<boolean> {
  const { error } = await supabase.from('categorias').update({ archivada: true }).eq('id', id);

  if (error) {
    console.error('Error al archivar categoría:', error.message);
    return false;
  }

  return true;
}
```

### `src\core\db\supabase.ts`

```tsx
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan las variables de entorno de Supabase. Revisa tu archivo .env.local')
}

// Este es el cliente oficial que usaremos en toda la app para guardar y leer datos
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

