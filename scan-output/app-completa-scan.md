# Escaneo: app-completa

_Generado: 2026-08-21T23:18:13.459Z_

## ⚠️ Posibles duplicados detectados

- ⚠️ Hay 2 carpetas compartidas/infraestructura (shared, core...) distintas: src\shared , src\core — revisa si deberían unificarse.

## Carpetas "modules" encontradas en el proyecto
- src\modules

## Módulos detectados
- dashboard  (src\modules\dashboard)
- finanzas  (src\modules\finanzas)
- trabajo  (src\modules\trabajo)

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
- src/App.tsx
- src/main.tsx
- src\core\auth\LoginGate.tsx
- src\core\auth\authService.ts
- src\core\db\db.ts
- src\core\db\supabase.ts
- src\modules\dashboard\AppLayout.tsx
- src\modules\dashboard\DashboardShell.tsx
- src\modules\dashboard\IslandsGrid.tsx
- src\modules\dashboard\TopBar.tsx
- src\modules\finanzas\CategoriasView.tsx
- src\modules\finanzas\CuentaFormModal.tsx
- src\modules\finanzas\CuentasView.tsx
- src\modules\finanzas\FinanzasModule.tsx
- src\modules\finanzas\FinanzasNav.tsx
- src\modules\finanzas\ReajusteModal.tsx
- src\modules\finanzas\TransaccionModal.tsx
- src\modules\finanzas\TransaccionesView.tsx
- src\modules\finanzas\widgets\CuentaWidget.tsx
- src\modules\trabajo\TrabajoModule.tsx
- src\modules\trabajo\TrabajoNav.tsx
- src\modules\trabajo\clientes\ClientePanel.tsx
- src\modules\trabajo\clientes\ClientesView.tsx
- src\modules\trabajo\clientes\modals\ModalCliente.tsx
- src\modules\trabajo\clientes\modals\ModalHistorialPagos.tsx
- src\modules\trabajo\clientes\modals\ModalPago.tsx
- src\modules\trabajo\clientes\modals\ModalVideo.tsx
- src\modules\trabajo\services\trabajoService.ts
- src\modules\trabajo\types\trabajo.types.ts
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

### `src/App.tsx`

```tsx
import { useState } from 'react';
import { LoginGate } from "./core/auth/LoginGate";
import { GridBackground } from './shared/components/GridBackground';
import { AppLayout } from './modules/dashboard/AppLayout';
import { DashboardShell } from './modules/dashboard/DashboardShell';
import { FinanzasModule } from './modules/finanzas/FinanzasModule';
import { TrabajoModule } from './modules/trabajo/TrabajoModule';

function App() {
  const [activeModule, setActiveModule] = useState('dashboard');

  return (
    <div className="min-h-screen relative">
      <GridBackground />
      <LoginGate>
        <AppLayout activeModule={activeModule} onSelectModule={setActiveModule}>
          
          {/* CADA MÓDULO CON SU CONDICIÓN EXCLUSIVA */}
          {activeModule === 'dashboard' && <DashboardShell />}
          {activeModule === 'finanzas' && <FinanzasModule />}
          {activeModule === 'trabajo' && <TrabajoModule />}

        </AppLayout>
      </LoginGate>
    </div>
  );
}

export default App;
```

### `src/main.tsx`

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(

  
  <StrictMode>
    <App />
  </StrictMode>,
)

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
      className={`relative p-1.5 h-full w-full transition-opacity duration-200 ${
        isDragging ? 'opacity-40 scale-[0.98]' : 'opacity-100'
      }`}
      style={{
        border: '1px dashed rgba(20,24,38,0.15)',
        background: 'rgba(20,24,38,0.02)',
        gridColumn: `${col} / span ${colSpan}`,
        gridRow: `${row} / span ${rowSpan}`,
      }}
    >
      {showHandle && (
        <div
          onMouseDown={onHandleDown}
          className="absolute top-2.5 right-2.5 z-10 p-1 cursor-grab active:cursor-grabbing hover:bg-black/5"
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
      className="border p-3 flex flex-col h-full w-full"
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
  return <div className="h-full w-full" style={{ border: '1px dashed rgba(20,24,38,0.10)' }} />;
}

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
            <div className="flex justify-between text-[11px] p-2 bg-black/5" style={{ color: 'var(--bios-text-dim)' }}>
              <span>Subir a Prod</span>
              <b style={{ color: 'var(--bios-danger)' }}>12:00</b>
            </div>
            <div className="flex justify-between text-[11px] p-2 bg-black/5" style={{ color: 'var(--bios-text-dim)' }}>
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
            className="flex-1 flex items-center justify-center border border-dashed mt-2 bg-black/5"
            style={{ borderColor: 'rgba(20,24,38,0.08)', color: 'var(--bios-text-dim)' }}
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

  const widgetsParaMovil = widgets
    .filter((w) => w.type !== 'empty')
    .sort((a, b) => a.row - b.row || a.col - b.col);

  return (
    <>
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
      style={{ background: 'rgba(255,255,255,0.85)', borderColor: 'var(--bios-border)' }}
    >
      <div className="flex items-center gap-2.5">
        <button
          onClick={onMenuClick}
          className="flex md:hidden w-[30px] h-[30px] border items-center justify-center"
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
          className="relative w-[30px] h-[30px] border flex items-center justify-center text-[14px]"
          style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text-dim)' }}
        >
          🔔
          {notifications.length > 0 && (
            <span
              className="absolute -top-1 -right-1 text-white text-[9px] px-1 font-mono"
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
            className="absolute top-11 right-0 w-[270px] p-2.5 border z-20"
            style={{
              background: 'linear-gradient(160deg, var(--bios-card-a), var(--bios-card-b))',
              borderColor: 'var(--bios-border)',
              boxShadow: '0 20px 50px rgba(20,24,38,0.15)',
            }}
          >
            <h4
              className="text-[11px] font-semibold uppercase tracking-wide mx-1.5 mb-2"
              style={{ color: 'var(--bios-text-dim)' }}
            >
              Notificaciones
            </h4>
            {notifications.map((n) => (
              <div key={n.id} className="flex gap-2 px-1.5 py-2 hover:bg-black/5">
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
            className="absolute top-11 right-0 w-[160px] p-1.5 border z-20"
            style={{
              background: 'linear-gradient(160deg, var(--bios-card-a), var(--bios-card-b))',
              borderColor: 'var(--bios-border)',
              boxShadow: '0 20px 50px rgba(20,24,38,0.15)',
            }}
          >
            <button
              onClick={handleLogout}
              className="w-full text-left text-[11.5px] px-2.5 py-2 hover:bg-black/5"
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

### `src\modules\finanzas\CuentaFormModal.tsx`

```tsx
import { useEffect, useState } from 'react';
import { Modal } from '../../shared/components/Modal';
import { ColorPicker, ImageLogoInput, ToggleCard } from '../../shared/components/FormControls';
import { IconTrash, IconAdjustmentsHorizontal } from '../../shared/icons';
import { crearCuenta, actualizarCuenta, type Cuenta } from '../../core/db/db';

interface Props {
  open: boolean;
  cuentaExistente: Cuenta | null;
  onClose: () => void;
  onSaved: () => void;
  onSolicitarReajuste: (cuenta: Cuenta) => void;
}

const TIPOS = [
  { value: 'efectivo', label: '💵 Efectivo / Cash' },
  { value: 'debito', label: '💳 Cuenta de Débito / Ahorros' },
  { value: 'corriente', label: '🏦 Cuenta Corriente' },
  { value: 'credito', label: '🎫 Tarjeta de Crédito' },
  { value: 'inversion', label: '📈 Inversión / Broker' },
];

export function CuentaFormModal({ open, cuentaExistente, onClose, onSaved, onSolicitarReajuste }: Props) {
  const [nombre, setNombre] = useState('');
  const [saldo, setSaldo] = useState('');
  const [tipo, setTipo] = useState('debito');
  const [logo, setLogo] = useState('');
  const [color, setColor] = useState('#3498db');
  const [incluirDashboard, setIncluirDashboard] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const editando = !!cuentaExistente?.id;

  useEffect(() => {
    if (!open) return;
    if (cuentaExistente) {
      setNombre(cuentaExistente.nombre);
      setSaldo(String(cuentaExistente.saldo_inicial));
      setTipo(cuentaExistente.tipo || 'debito');
      setLogo(cuentaExistente.logo || '');
      setColor(cuentaExistente.color || '#3498db');
      setIncluirDashboard(cuentaExistente.incluir_dashboard !== false);
    } else {
      limpiarCampos();
    }
  }, [open, cuentaExistente]);

  function limpiarCampos() {
    setNombre('');
    setSaldo('');
    setTipo('debito');
    setLogo('');
    setColor('#3498db');
    setIncluirDashboard(true);
  }

  async function handleGuardar() {
    if (!nombre.trim()) return alert('El nombre es obligatorio');

    setGuardando(true);
    try {
      const payload = {
        nombre: nombre.trim(),
        saldo_inicial: parseFloat(saldo) || 0,
        tipo,
        color,
        logo: logo || undefined,
        incluir_dashboard: incluirDashboard,
      };

      if (editando) {
        await actualizarCuenta(cuentaExistente!.id!, payload);
      } else {
        await crearCuenta({ ...payload, archivada: false });
      }
      onSaved();
      onClose();
    } catch (err) {
      console.error('Error guardando cuenta:', err);
      alert('No se pudo guardar la cuenta. Revisa la consola.');
    } finally {
      setGuardando(false);
    }
  }

  function handleBotonIzquierdo() {
    if (editando) {
      // En edición, este botón cierra el modal de cuenta y abre el de
      // Reajuste de Saldo — igual que hacía el piloto.
      onClose();
      onSolicitarReajuste(cuentaExistente!);
    } else {
      limpiarCampos();
    }
  }

  const anchoSaldoCh = Math.max((saldo || '0.00').length + 1, 5);

  return (
    <Modal open={open} title={editando ? 'Editar cuenta' : 'Añadir cuenta'} onCancel={onClose} hideDefaultFooter>
      <div className="flex flex-col mt-2">
        <div className="flex flex-col items-center justify-center mb-6 mt-2">
          <div className="flex items-center justify-center gap-1">
            <span className="text-[18px] sm:text-[24px] font-display font-bold flex-shrink-0" style={{ color: 'var(--bios-text-dim)' }}>$</span>
            <input
              type="number"
              value={saldo}
              onChange={(e) => setSaldo(e.target.value)}
              placeholder="0.00"
              className="bg-transparent text-[26px] sm:text-[38px] font-display font-bold outline-none text-left min-w-0"
              style={{ color: 'var(--bios-text)', width: `${anchoSaldoCh}ch` }}
            />
          </div>
          <div className="w-full max-w-[220px] h-px mt-1 border-b border-dashed mx-auto" style={{ borderColor: 'var(--bios-border)' }} />
        </div>

        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-[11px]" style={{ color: 'var(--bios-text-dim)' }}>Nombre de la institución financiera</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Bancolombia, Efectivo..."
            className="w-full bg-black/20 border rounded-[10px] px-3 py-2.5 text-[13px] outline-none"
            style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text)' }}
          />
        </div>

        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-[11px]" style={{ color: 'var(--bios-text-dim)' }}>Tipo de cuenta</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full bg-black/20 border rounded-[10px] px-3 py-2.5 text-[13px] outline-none"
            style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text)' }}
          >
            {TIPOS.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px]" style={{ color: 'var(--bios-text-dim)' }}>URL del Logo institucional</label>
            <ImageLogoInput url={logo} onChange={setLogo} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px]" style={{ color: 'var(--bios-text-dim)' }}>Color distintivo</label>
            <ColorPicker value={color} onChange={setColor} />
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
            onClick={handleBotonIzquierdo}
            className="flex items-center gap-1.5 text-[11px] px-3 py-2 rounded-lg transition-colors hover:bg-white/5"
            style={{ color: 'var(--bios-text-dim)' }}
          >
            {editando ? <IconAdjustmentsHorizontal size={14} /> : <IconTrash size={14} />}
            {editando ? 'Re-ajustar saldo' : 'Limpiar campos'}
          </button>

          <button
            onClick={handleGuardar}
            disabled={guardando}
            className="text-[12px] font-semibold px-4 py-2 rounded-lg transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: 'var(--bios-accent)', color: '#0a1120' }}
          >
            {guardando ? 'Guardando...' : 'Guardar cuenta'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
```

### `src\modules\finanzas\CuentasView.tsx`

```tsx
import { useEffect, useState } from 'react';
import CuentaWidget, { type CuentaData } from './widgets/CuentaWidget';
import { IconPlus } from '../../shared/icons';
import { getCuentas, getTransacciones, calcularSaldoCuenta, archivarCuenta, type Cuenta, type Transaccion } from '../../core/db/db';
import { CuentaFormModal } from './CuentaFormModal';
import { ReajusteModal } from './ReajusteModal';

export function CuentasView() {
  const [cuentasRaw, setCuentasRaw] = useState<Cuenta[]>([]);
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [cargando, setCargando] = useState(true);

  const [formAbierto, setFormAbierto] = useState(false);
  const [cuentaEditando, setCuentaEditando] = useState<Cuenta | null>(null);

  const [reajusteAbierto, setReajusteAbierto] = useState(false);
  const [cuentaParaReajustar, setCuentaParaReajustar] = useState<Cuenta | null>(null);
  const [saldoParaReajustar, setSaldoParaReajustar] = useState(0);

  async function cargar() {
    setCargando(true);
    try {
      const [filas, trans] = await Promise.all([getCuentas(), getTransacciones()]);
      setCuentasRaw(filas);
      setTransacciones(trans);
    } catch (err) {
      console.error('Error cargando cuentas:', err);
      alert('No se pudieron cargar las cuentas. Revisa la consola.');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  const cuentas: CuentaData[] = cuentasRaw.map((fila) => {
    const saldo = calcularSaldoCuenta(fila.id!, fila.saldo_inicial, transacciones);
    return {
      id: fila.id!,
      nombre: fila.nombre,
      // TODO: saldoPrevisto pasa a incluir pendientes hasta fin de mes
      // navegado cuando conectemos el MonthSelector aquí también.
      saldoActual: saldo,
      saldoPrevisto: saldo,
      color: fila.color || '#3498db',
      logo: fila.logo || undefined,
    };
  });

  function abrirNueva() {
    setCuentaEditando(null);
    setFormAbierto(true);
  }

  function abrirEditar(id: string) {
    const raw = cuentasRaw.find((c) => c.id === id);
    if (raw) {
      setCuentaEditando(raw);
      setFormAbierto(true);
    }
  }

  function abrirReajuste(cuenta: Cuenta) {
    const saldo = calcularSaldoCuenta(cuenta.id!, cuenta.saldo_inicial, transacciones);
    setCuentaParaReajustar(cuenta);
    setSaldoParaReajustar(saldo);
    setReajusteAbierto(true);
  }

  async function handleArchivar(id: string) {
    if (!confirm('¿Archivar esta cuenta? Las transacciones pasadas se mantendrán seguras.')) return;
    const ok = await archivarCuenta(id);
    if (ok) await cargar();
    else alert('No se pudo archivar la cuenta.');
  }

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <button
          onClick={abrirNueva}
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
              <CuentaWidget
                cuenta={cuenta}
                onEditar={() => abrirEditar(cuenta.id)}
                onArchivar={() => handleArchivar(cuenta.id)}
              />
            </div>
          ))}
      </div>

      <CuentaFormModal
        open={formAbierto}
        cuentaExistente={cuentaEditando}
        onClose={() => setFormAbierto(false)}
        onSaved={cargar}
        onSolicitarReajuste={abrirReajuste}
      />

      <ReajusteModal
        open={reajusteAbierto}
        cuenta={cuentaParaReajustar}
        saldoActual={saldoParaReajustar}
        onClose={() => setReajusteAbierto(false)}
        onSaved={cargar}
      />
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
import { TransaccionesView } from './TransaccionesView';
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
          ) : tab === 'transacciones' ? (
         <TransaccionesView mesActual={mesActual} />
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

### `src\modules\finanzas\ReajusteModal.tsx`

```tsx
import { useEffect, useState } from 'react';
import { Modal } from '../../shared/components/Modal';
import { IconAdjustmentsHorizontal } from '../../shared/icons';
import { reajustarSaldoCuenta, type Cuenta } from '../../core/db/db';

interface Props {
  open: boolean;
  cuenta: Cuenta | null;
  saldoActual: number;
  onClose: () => void;
  onSaved: () => void;
}

const formatearDinero = (monto: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(monto);

export function ReajusteModal({ open, cuenta, saldoActual, onClose, onSaved }: Props) {
  const [nuevoSaldo, setNuevoSaldo] = useState('');
  const [metodo, setMetodo] = useState<'transaccion' | 'inicial'>('transaccion');
  const [descripcion, setDescripcion] = useState('Reajuste de saldo');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!open) return;
    setNuevoSaldo(saldoActual.toFixed(2));
    setMetodo('transaccion');
    setDescripcion('Reajuste de saldo');
  }, [open, saldoActual]);

  async function handleConfirmar() {
    if (!cuenta) return;
    const nuevoSaldoNum = parseFloat(nuevoSaldo);
    if (isNaN(nuevoSaldoNum)) return alert('Ingresa un valor numérico válido.');

    setGuardando(true);
    try {
      await reajustarSaldoCuenta(cuenta, saldoActual, nuevoSaldoNum, metodo, descripcion.trim());
      onSaved();
      onClose();
    } catch (err) {
      console.error('Error en el reajuste:', err);
      alert('No se pudo aplicar el reajuste. Revisa la consola.');
    } finally {
      setGuardando(false);
    }
  }

  if (!cuenta) return null;

  const anchoCh = Math.max((nuevoSaldo || '0.00').length + 1, 5);

  return (
    <Modal open={open} title="" onCancel={onClose} hideDefaultFooter>
      <div className="flex flex-col mt-1">
        <div className="flex items-center gap-2 mb-4">
          <IconAdjustmentsHorizontal size={17} style={{ color: 'var(--bios-accent)' }} />
          <h3 className="font-display text-[14px] font-bold" style={{ color: 'var(--bios-accent)' }}>
            Reajuste de Saldo
          </h3>
        </div>

        <div
          className="rounded-[10px] p-3 mb-5 flex flex-col gap-1"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--bios-border)' }}
        >
          <span className="text-[12px]" style={{ color: 'var(--bios-text-dim)' }}>
            Cuenta seleccionada: <strong style={{ color: 'var(--bios-text)' }}>{cuenta.nombre}</strong>
          </span>
          <span className="text-[12px]" style={{ color: 'var(--bios-text-dim)' }}>
            Saldo contable actual: <strong style={{ color: 'var(--bios-accent)' }}>{formatearDinero(saldoActual)}</strong>
          </span>
        </div>

        <div className="flex items-center justify-center gap-1 mb-5">
          <span className="text-[20px] font-display font-bold flex-shrink-0" style={{ color: 'var(--bios-text)' }}>$</span>
          <input
            type="number"
            value={nuevoSaldo}
            onChange={(e) => setNuevoSaldo(e.target.value)}
            className="bg-transparent text-[28px] sm:text-[34px] font-display font-bold outline-none text-left min-w-0"
            style={{ color: 'var(--bios-text)', width: `${anchoCh}ch` }}
          />
        </div>

        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-[11px]" style={{ color: 'var(--bios-text-dim)' }}>Método de Ajuste</label>
          <select
            value={metodo}
            onChange={(e) => setMetodo(e.target.value as 'transaccion' | 'inicial')}
            className="w-full bg-black/20 border rounded-[10px] px-3 py-2.5 text-[13px] outline-none"
            style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text)' }}
          >
            <option value="transaccion">📝 Crear una transacción de ajuste (deja registro)</option>
            <option value="inicial">🏦 Ajustar saldo inicial base (silencioso / sin registro)</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5 mb-6">
          <label className="text-[11px]" style={{ color: 'var(--bios-text-dim)' }}>Descripción o motivo del ajuste</label>
          <input
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Ej. Cuadre de caja, corrección de extracto..."
            className="w-full bg-black/20 border rounded-[10px] px-3 py-2.5 text-[13px] outline-none"
            style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text)' }}
          />
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t" style={{ borderColor: 'var(--bios-border)' }}>
          <button
            onClick={onClose}
            className="text-[11px] px-3 py-2 rounded-lg border"
            style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text-dim)' }}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmar}
            disabled={guardando}
            className="text-[12px] font-semibold px-4 py-2 rounded-lg disabled:opacity-50"
            style={{ background: 'var(--bios-accent)', color: '#0a1120' }}
          >
            {guardando ? 'Aplicando...' : 'Confirmar reajuste'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
```

### `src\modules\finanzas\TransaccionesView.tsx`

```tsx
import { useEffect, useState } from 'react';
import {
  getTransacciones,
  getCategorias,
  getCuentas,
  filtrarPorMes,
  archivarTransaccion,
  type Transaccion,
  type Categoria,
  type Cuenta,
} from '../../core/db/db';
import { IconSwap, IconBuildingStore, IconPlus, IconTrash, IconFilter, IconPencil } from '../../shared/icons';
import { TransaccionModal } from './TransaccionModal';

interface Props {
  mesActual: Date;
}

type FiltroTipo = 'todos' | 'ingreso' | 'gasto' | 'transferencia';

const formatearDinero = (monto: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(monto);

function formatearFecha(fecha: string) {
  const d = new Date(fecha + 'T00:00:00');
  let texto = d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

const FILTROS: { id: FiltroTipo; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'ingreso', label: 'Ingresos' },
  { id: 'gasto', label: 'Gastos' },
  { id: 'transferencia', label: 'Transferencias' },
];

export function TransaccionesView({ mesActual }: Props) {
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [transaccionEditando, setTransaccionEditando] = useState<Transaccion | null>(null);
  const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>('todos');
  const [menuFiltroAbierto, setMenuFiltroAbierto] = useState(false);

  async function cargar() {
    setCargando(true);
    try {
      const [t, c, cu] = await Promise.all([getTransacciones(), getCategorias(), getCuentas()]);
      setTransacciones(t);
      setCategorias(c);
      setCuentas(cu);
    } catch (err) {
      console.error('Error cargando transacciones:', err);
      alert('No se pudieron cargar las transacciones. Revisa la consola.');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  function abrirNuevo() {
    setTransaccionEditando(null);
    setModalAbierto(true);
  }

  function abrirEditar(t: Transaccion) {
    setTransaccionEditando(t);
    setModalAbierto(true);
  }

  async function handleEliminar(id?: string) {
    if (!id) return;
    if (!confirm('¿Eliminar este movimiento? El saldo de la cuenta se ajustará de inmediato.')) return;
    const ok = await archivarTransaccion(id);
    if (ok) await cargar();
    else alert('No se pudo eliminar el movimiento.');
  }

  let delMes = filtrarPorMes(transacciones, mesActual).sort((a, b) => b.fecha.localeCompare(a.fecha));
  if (filtroTipo !== 'todos') {
    delMes = delMes.filter((t) => t.tipo === filtroTipo);
  }

  const grupos: Record<string, Transaccion[]> = {};
  delMes.forEach((t) => {
    if (!grupos[t.fecha]) grupos[t.fecha] = [];
    grupos[t.fecha].push(t);
  });

  function nombreCategoria(id?: string | null) {
    return categorias.find((c) => c.id === id)?.nombre || 'Sin categoría';
  }
  function emojiCategoria(id?: string | null) {
    return categorias.find((c) => c.id === id)?.emoji || '🏷️';
  }
  function colorCategoria(id?: string | null) {
    return categorias.find((c) => c.id === id)?.color || 'var(--bios-text-dim)';
  }
  function nombreCuenta(id?: string | null) {
    return cuentas.find((c) => c.id === id)?.nombre || 'Cuenta desconocida';
  }

  const labelFiltro = FILTROS.find((f) => f.id === filtroTipo)?.label ?? 'Todos';

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-3 gap-2">
        <div className="relative">
          <button
            onClick={() => setMenuFiltroAbierto((o) => !o)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] border"
            style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text-dim)' }}
          >
            <IconFilter size={14} />
            {labelFiltro}
          </button>

          {menuFiltroAbierto && (
            <div
              className="absolute top-full left-0 mt-1.5 w-44 rounded-xl border p-1.5 z-20"
              style={{
                background: 'linear-gradient(160deg, var(--bios-card-a), var(--bios-card-b))',
                borderColor: 'var(--bios-border)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
              }}
            >
              {FILTROS.map((f) => (
                <div
                  key={f.id}
                  onClick={() => {
                    setFiltroTipo(f.id);
                    setMenuFiltroAbierto(false);
                  }}
                  className="px-2.5 py-2 rounded-lg text-[12.5px] cursor-pointer hover:bg-white/5"
                  style={{ color: filtroTipo === f.id ? 'var(--bios-accent)' : 'var(--bios-text-dim)' }}
                >
                  {f.label}
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={abrirNuevo}
          disabled={cuentas.length === 0}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold disabled:opacity-50"
          style={{ background: 'var(--bios-accent)', color: '#0a1120' }}
          title={cuentas.length === 0 ? 'Crea una cuenta primero' : 'Nuevo movimiento'}
        >
          <IconPlus size={15} />
          Nuevo movimiento
        </button>
      </div>

      {cargando && (
        <div className="text-[12px] text-center py-6" style={{ color: 'var(--bios-text-dim)' }}>
          Cargando transacciones...
        </div>
      )}

      {!cargando && delMes.length === 0 && (
        <div
          className="rounded-[11px] border border-dashed p-8 text-center text-[12px]"
          style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text-dim)' }}
        >
          No hay movimientos {filtroTipo !== 'todos' ? `de tipo "${labelFiltro.toLowerCase()}" ` : ''}registrados este mes.
        </div>
      )}

      {!cargando && delMes.length > 0 && (
        <div className="flex flex-col gap-4">
          {Object.keys(grupos).map((fecha) => (
            <div key={fecha}>
              <div className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--bios-text-faint)' }}>
                {formatearFecha(fecha)}
              </div>

              <div className="flex flex-col gap-1.5">
                {grupos[fecha].map((t) => {
                  const esTransferencia = t.tipo === 'transferencia';
                  const esIngreso = t.tipo === 'ingreso';
                  const colorMonto = esTransferencia ? '#2773d6' : esIngreso ? 'var(--bios-ok)' : 'var(--bios-danger)';
                  const signo = esTransferencia ? '⇄ ' : esIngreso ? '+' : '-';

                  // Resumen: categoría · comercio (si tiene) · cuenta — para
                  // transferencias en cambio mostramos origen → destino.
                  const resumen = esTransferencia ? (
                    <>
                      {nombreCuenta(t.cuenta_id)} → {nombreCuenta(t.cuenta_destino_id)}
                    </>
                  ) : (
                    <>
                      {nombreCategoria(t.categoria_id)}
                      {t.comercio && ` · ${t.comercio}`}
                      {' · '}
                      {nombreCuenta(t.cuenta_id)}
                    </>
                  );

                  return (
                    <div
                      key={t.id}
                      className="flex items-center justify-between gap-3 rounded-[11px] border px-3 py-2.5"
                      style={{
                        background: 'linear-gradient(160deg, var(--bios-card-a), var(--bios-card-b))',
                        borderColor: 'var(--bios-border)',
                      }}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="w-8 h-8 rounded-[9px] flex-shrink-0 flex items-center justify-center text-[15px]"
                          style={{
                            background: 'rgba(255,255,255,0.04)',
                            color: esTransferencia ? '#2773d6' : colorCategoria(t.categoria_id),
                          }}
                        >
                          {esTransferencia ? <IconSwap size={16} /> : emojiCategoria(t.categoria_id)}
                        </div>
                        <div className="min-w-0 flex flex-col">
                          <span className="text-[13px] font-semibold truncate" style={{ color: 'var(--bios-text)' }}>
                            {t.descripcion}
                          </span>
                          <span className="text-[11px] truncate flex items-center gap-1" style={{ color: 'var(--bios-text-dim)' }}>
                            {resumen}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="text-[14px] font-bold mr-1" style={{ color: colorMonto }}>
                          {signo}
                          {formatearDinero(t.monto)}
                        </span>
                        <button
                          onClick={() => abrirEditar(t)}
                          className="p-1.5 rounded-md hover:bg-white/5"
                          style={{ color: 'var(--bios-text-faint)' }}
                          title="Editar movimiento"
                        >
                          <IconPencil size={15} />
                        </button>
                        <button
                          onClick={() => handleEliminar(t.id)}
                          className="p-1.5 rounded-md hover:bg-white/5"
                          style={{ color: 'var(--bios-danger)' }}
                          title="Eliminar movimiento"
                        >
                          <IconTrash size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <TransaccionModal
        open={modalAbierto}
        cuentas={cuentas}
        categorias={categorias}
        transaccionExistente={transaccionEditando}
        onClose={() => setModalAbierto(false)}
        onSaved={cargar}
      />
    </div>
  );
}
```

### `src\modules\finanzas\TransaccionModal.tsx`

```tsx
import { useEffect, useState } from 'react';
import { Modal } from '../../shared/components/Modal';
import { crearTransaccion, actualizarTransaccion, type Cuenta, type Categoria, type Transaccion } from '../../core/db/db';

interface Props {
  open: boolean;
  cuentas: Cuenta[];
  categorias: Categoria[];
  transaccionExistente?: Transaccion | null;
  onClose: () => void;
  onSaved: () => void;
}

type TipoMovimiento = 'gasto' | 'ingreso' | 'transferencia';

function hoyISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dia}`;
}

export function TransaccionModal({ open, cuentas, categorias, transaccionExistente, onClose, onSaved }: Props) {
  const [tipo, setTipo] = useState<TipoMovimiento>('gasto');
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState(hoyISO());
  const [cuentaId, setCuentaId] = useState('');
  const [cuentaDestinoId, setCuentaDestinoId] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [comercio, setComercio] = useState('');
  const [pagado, setPagado] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // Al abrir: si viene una transacción existente, precarga sus datos
  // (modo edición). Si no, resetea todo a los valores por defecto (modo creación).
  useEffect(() => {
    if (!open) return;

    if (transaccionExistente) {
      setTipo(transaccionExistente.tipo);
      setMonto(String(transaccionExistente.monto));
      setDescripcion(transaccionExistente.descripcion);
      setFecha(transaccionExistente.fecha);
      setCuentaId(transaccionExistente.cuenta_id);
      setCuentaDestinoId(transaccionExistente.cuenta_destino_id || cuentas[1]?.id || '');
      setCategoriaId(transaccionExistente.categoria_id || '');
      setComercio(transaccionExistente.comercio || '');
      setPagado(transaccionExistente.pagado);
    } else {
      setTipo('gasto');
      setMonto('');
      setDescripcion('');
      setFecha(hoyISO());
      setCuentaId(cuentas[0]?.id || '');
      setCuentaDestinoId(cuentas[1]?.id || '');
      setCategoriaId('');
      setComercio('');
      setPagado(true);
    }
  }, [open, cuentas, transaccionExistente]);

  const categoriasDelTipo = categorias.filter((c) => c.tipo === (tipo === 'ingreso' ? 'ingreso' : 'gasto'));
  const editando = !!transaccionExistente?.id;

  async function handleGuardar() {
    const montoNum = parseFloat(monto);
    if (!montoNum || montoNum <= 0) return alert('Ingresa un monto válido.');
    if (!descripcion.trim()) return alert('La descripción es obligatoria.');
    if (!fecha) return alert('Selecciona una fecha.');
    if (!cuentaId) return alert('Selecciona una cuenta.');
    if (tipo === 'transferencia' && (!cuentaDestinoId || cuentaDestinoId === cuentaId)) {
      return alert('Selecciona una cuenta de destino distinta a la de origen.');
    }
    if (tipo !== 'transferencia' && !categoriaId) return alert('Selecciona una categoría.');

    const payload = {
      tipo,
      monto: montoNum,
      descripcion: descripcion.trim(),
      fecha,
      cuenta_id: cuentaId,
      cuenta_destino_id: tipo === 'transferencia' ? cuentaDestinoId : null,
      categoria_id: tipo === 'transferencia' ? null : categoriaId,
      comercio: comercio.trim() || null,
      pagado: tipo === 'transferencia' ? true : pagado,
    };

    setGuardando(true);
    try {
      if (editando) {
        await actualizarTransaccion(transaccionExistente!.id!, payload);
      } else {
        await crearTransaccion({ ...payload, gasto_fijo: false, observacion: null, archivada: false });
      }
      onSaved();
      onClose();
    } catch (err) {
      console.error('Error guardando transacción:', err);
      alert('No se pudo guardar el movimiento. Revisa la consola.');
    } finally {
      setGuardando(false);
    }
  }

  const colorTipo = tipo === 'ingreso' ? 'var(--bios-ok)' : tipo === 'gasto' ? 'var(--bios-danger)' : '#2773d6';

  return (
    <Modal open={open} title={editando ? 'Editar movimiento' : 'Registrar movimiento'} onCancel={onClose} hideDefaultFooter>
      <div className="flex flex-col gap-4 mt-2">
        <div className="flex gap-2">
          {(['gasto', 'ingreso', 'transferencia'] as TipoMovimiento[]).map((op) => (
            <button
              key={op}
              onClick={() => setTipo(op)}
              className="flex-1 py-2 rounded-lg text-[12px] font-semibold border capitalize"
              style={{
                borderColor: tipo === op ? colorTipo : 'var(--bios-border)',
                background: tipo === op ? `${colorTipo}22` : 'transparent',
                color: tipo === op ? colorTipo : 'var(--bios-text-dim)',
              }}
            >
              {op}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-center gap-1 py-2">
          <span className="text-[16px] sm:text-[22px] font-display font-bold flex-shrink-0" style={{ color: colorTipo }}>$</span>
          <input
            type="number"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            placeholder="0.00"
            className="bg-transparent text-[22px] sm:text-[32px] font-display font-bold outline-none text-left min-w-0"
            style={{ color: 'var(--bios-text)', width: `${Math.max((monto || '0.00').length + 1, 5)}ch` }}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px]" style={{ color: 'var(--bios-text-dim)' }}>Descripción</label>
          <input
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Ej: Compra de insumos, Pago mensual..."
            className="w-full bg-black/20 border rounded-[10px] px-3 py-2 text-[13px] outline-none"
            style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text)' }}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px]" style={{ color: 'var(--bios-text-dim)' }}>Fecha</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full bg-black/20 border rounded-[10px] px-3 py-2 text-[13px] outline-none"
            style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text)' }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px]" style={{ color: 'var(--bios-text-dim)' }}>
              {tipo === 'transferencia' ? 'Cuenta origen' : 'Cuenta'}
            </label>
            <select
              value={cuentaId}
              onChange={(e) => setCuentaId(e.target.value)}
              className="w-full bg-black/20 border rounded-[10px] px-3 py-2 text-[13px] outline-none"
              style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text)' }}
            >
              {cuentas.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>

          {tipo === 'transferencia' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px]" style={{ color: 'var(--bios-text-dim)' }}>Cuenta destino</label>
              <select
                value={cuentaDestinoId}
                onChange={(e) => setCuentaDestinoId(e.target.value)}
                className="w-full bg-black/20 border rounded-[10px] px-3 py-2 text-[13px] outline-none"
                style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text)' }}
              >
                {cuentas.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {tipo !== 'transferencia' && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px]" style={{ color: 'var(--bios-text-dim)' }}>Categoría</label>
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className="w-full bg-black/20 border rounded-[10px] px-3 py-2 text-[13px] outline-none"
              style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text)' }}
            >
              <option value="">Selecciona una categoría...</option>
              {categoriasDelTipo.map((c) => (
                <option key={c.id} value={c.id}>{c.emoji} {c.nombre}</option>
              ))}
            </select>
          </div>
        )}

        {tipo !== 'transferencia' && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px]" style={{ color: 'var(--bios-text-dim)' }}>Comercio (opcional)</label>
            <input
              value={comercio}
              onChange={(e) => setComercio(e.target.value)}
              placeholder="Ej: Éxito, Amazon..."
              className="w-full bg-black/20 border rounded-[10px] px-3 py-2 text-[13px] outline-none"
              style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text)' }}
            />
          </div>
        )}

        {tipo !== 'transferencia' && (
          <label className="flex items-center justify-between">
            <span className="text-[12.5px]">Marcado como pagado</span>
            <input type="checkbox" checked={pagado} onChange={(e) => setPagado(e.target.checked)} />
          </label>
        )}

        <div className="flex justify-end gap-2 pt-3 border-t" style={{ borderColor: 'var(--bios-border)' }}>
          <button
            onClick={onClose}
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
            {guardando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Confirmar movimiento'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
```

### `src\modules\finanzas\widgets\CuentaWidget.tsx`

```tsx
import { useEffect, useRef, useState } from 'react';
import { IconDots, IconPlus, IconBank, IconPieChart, IconPencil, IconTrash } from '../../../shared/icons';

export interface CuentaData {
  id: string;
  nombre: string;
  saldoActual: number;
  saldoPrevisto: number;
  color: string;
  logo?: string;
}

interface Props {
  cuenta: CuentaData;
  onEditar?: () => void;
  onArchivar?: () => void;
}

const formatearDinero = (monto: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(monto);
};

export default function CuentaWidget({ cuenta, onEditar, onArchivar }: Props) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickFuera(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuAbierto(false);
    }
    document.addEventListener('mousedown', onClickFuera);
    return () => document.removeEventListener('mousedown', onClickFuera);
  }, []);

  const colorActual = cuenta.saldoActual >= 0 ? 'var(--bios-ok)' : 'var(--bios-danger)';
  const colorPrevisto = cuenta.saldoPrevisto >= 0 ? 'var(--bios-ok)' : 'var(--bios-danger)';

  return (
    <div className="flex flex-col h-full w-full justify-between">
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
          <span className="font-semibold text-[13px] text-[var(--bios-text)]">{cuenta.nombre}</span>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuAbierto((o) => !o)}
            className="text-[var(--bios-text-faint)] hover:text-[var(--bios-text)] transition-colors"
          >
            <IconDots size={16} />
          </button>

          {menuAbierto && (
            <div
              className="absolute top-full right-0 mt-1.5 w-36 rounded-xl border p-1.5 z-20"
              style={{
                background: 'linear-gradient(160deg, var(--bios-card-a), var(--bios-card-b))',
                borderColor: 'var(--bios-border)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
              }}
            >
              <div
                onClick={() => {
                  setMenuAbierto(false);
                  onEditar?.();
                }}
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-[12px] cursor-pointer hover:bg-white/5"
                style={{ color: 'var(--bios-text-dim)' }}
              >
                <IconPencil size={14} /> Editar
              </div>
              <div
                onClick={() => {
                  setMenuAbierto(false);
                  onArchivar?.();
                }}
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-[12px] cursor-pointer hover:bg-white/5"
                style={{ color: 'var(--bios-danger)' }}
              >
                <IconTrash size={14} /> Archivar
              </div>
            </div>
          )}
        </div>
      </div>

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

      <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--bios-border)' }}>
        <button
          className="w-full py-1.5 flex items-center justify-center gap-1.5 rounded-lg text-[10.5px] font-semibold transition-colors hover:bg-white/5"
          style={{ color: 'var(--bios-text-dim)', border: '1px solid var(--bios-border)' }}
        >
          <IconPlus size={12} />
          AÑADIR GASTO
        </button>
      </div>
    </div>
  );
}
```

### `src\modules\trabajo\clientes\ClientePanel.tsx`

```tsx
import { useEffect, useState, useMemo } from 'react';
import { 
  IconArrowLeft, 
  IconCash, 
  IconPlus, 
  IconFolder, 
  IconPencil, 
  IconTrash, 
  IconExternalLink,
  IconChartBar
} from '@tabler/icons-react';
import { 
  getClientes, 
  getProyectosByCliente, 
  getVideosByProyecto, 
  getPagosByProyecto,
  actualizarEstadoVideo,
  eliminarVideo
} from '../services/trabajoService';
import type { 
  Cliente, 
  ProyectoTrabajo, 
  VideoTrabajo, 
  PagoTrabajo, 
  EstadoVideo,
  ColumnaOrdenVideo,
  DireccionOrden
} from '../types/trabajo.types';
import { ModalVideo } from './modals/ModalVideo';
import { ModalPago } from './modals/ModalPago';
import { ModalHistorialPagos } from './modals/ModalHistorialPagos';

interface Props {
  clienteId: string;
  onBack: () => void;
}

export function ClientePanel({ clienteId, onBack }: Props) {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [proyectos, setProyectos] = useState<ProyectoTrabajo[]>([]);
  const [proyectoActivoId, setProyectoActivoId] = useState<string | null>(null);
  
  const [videos, setVideos] = useState<VideoTrabajo[]>([]);
  const [pagos, setPagos] = useState<PagoTrabajo[]>([]);
  const [cargando, setCargando] = useState(true);

  // Estados de Modales
  const [modalVideoOpen, setModalVideoOpen] = useState(false);
  const [videoAEditar, setVideoAEditar] = useState<VideoTrabajo | null>(null);
  const [modalPagoOpen, setModalPagoOpen] = useState(false);
  const [modalHistorialOpen, setModalHistorialOpen] = useState(false);

  // Filtros y Orden de la Tabla
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'todos' | EstadoVideo>('todos');
  const [ordenColumna, setOrdenColumna] = useState<ColumnaOrdenVideo>('numero');
  const [ordenDireccion, setOrdenDireccion] = useState<DireccionOrden>('asc');

  // 1. Cargar Cliente y Proyectos
  useEffect(() => {
    async function init() {
      const cls = await getClientes();
      const cli = cls.find(c => c.id === clienteId);
      if (cli) setCliente(cli);

      const projs = await getProyectosByCliente(clienteId);
      setProyectos(projs);
      if (projs.length > 0) setProyectoActivoId(projs[0].id);
    }
    init();
  }, [clienteId]);

  // 2. Cargar Videos y Pagos cuando cambia el proyecto activo
  async function cargarDatosProyecto() {
    if (!proyectoActivoId) return;
    setCargando(true);
    const [vids, pags] = await Promise.all([
      getVideosByProyecto(proyectoActivoId),
      getPagosByProyecto(proyectoActivoId)
    ]);
    setVideos(vids);
    setPagos(pags);
    setCargando(false);
  }

  useEffect(() => {
    cargarDatosProyecto();
  }, [proyectoActivoId]);

  // 3. Calcular KPIs del Panel (Basado en el proyecto activo - Corregido Zona Horaria)
  const kpis = useMemo(() => {
    let ingMes = 0;
    let totalPagado = 0;
    let totalConsumido = 0;
    let entregados = 0;
    let pendientes = 0;

    const mesActual = new Date().getMonth();
    const anoActual = new Date().getFullYear();

    pagos.forEach(p => { totalPagado += Number(p.monto); });

    videos.forEach(v => {
      const cobrado = Number(v.inversion || 0) + Number(v.bono || 0);
      if (v.estado === 'listo') {
        entregados++;
        totalConsumido += cobrado;
        
        // Prioridad: fecha_entrega y extraemos el mes con split para no desfasar días por el UTC
        const fechaRef = v.fecha_entrega || v.fecha_subido || v.fecha_pago || v.ultima_edicion;
        if (fechaRef) {
          const partes = fechaRef.split('T')[0].split('-');
          if (partes.length >= 3) {
            const anoVal = parseInt(partes[0], 10);
            const mesVal = parseInt(partes[1], 10) - 1; // 0-indexed para JS
            
            if (mesVal === mesActual && anoVal === anoActual) {
              ingMes += cobrado;
            }
          }
        }
      } else {
        pendientes++;
      }
    });

    return {
      ingMes,
      entregados,
      pendientes,
      balance: totalPagado - totalConsumido
    };
  }, [videos, pagos]);

  // 4. Lógica de filtrado y ordenamiento de la tabla
  const videosFiltrados = useMemo(() => {
    let lista = videos.filter(v => 
      v.nombre.toLowerCase().includes(filtroTexto.toLowerCase()) &&
      (filtroEstado === 'todos' || v.estado === filtroEstado)
    );

    lista.sort((a, b) => {
      let valA: any = a.numero_video;
      let valB: any = b.numero_video;

      if (ordenColumna === 'nombre') { valA = a.nombre.toLowerCase(); valB = b.nombre.toLowerCase(); }
      else if (ordenColumna === 'entrega') { valA = a.fecha_entrega || '9999'; valB = b.fecha_entrega || '9999'; }
      else if (ordenColumna === 'guion') { valA = a.palabras_guion; valB = b.palabras_guion; }
      else if (ordenColumna === 'subido') { valA = a.fecha_subido || '9999'; valB = b.fecha_subido || '9999'; }

      if (valA < valB) return ordenDireccion === 'asc' ? -1 : 1;
      if (valA > valB) return ordenDireccion === 'asc' ? 1 : -1;
      return 0;
    });

    return lista;
  }, [videos, filtroTexto, filtroEstado, ordenColumna, ordenDireccion]);

  function alternarOrden(col: ColumnaOrdenVideo) {
    if (ordenColumna === col) {
      setOrdenDireccion(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setOrdenColumna(col);
      setOrdenDireccion('asc');
    }
  }

  // Acciones Rápidas
  async function handleCambiarEstado(id: string, nuevoEstado: EstadoVideo) {
    await actualizarEstadoVideo(id, nuevoEstado);
    cargarDatosProyecto(); // Recargar para actualizar KPIs
  }

  async function handleEliminarVideo(id: string) {
    if (!confirm('¿Seguro que deseas eliminar este video?')) return;
    await eliminarVideo(id);
    cargarDatosProyecto();
  }

  if (!cliente) return <div className="p-10 text-center">Cargando perfil...</div>;

  return (
    <div className="flex flex-col gap-5">
      {/* BOTÓN VOLVER */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-[12px] w-fit hover:underline"
        style={{ color: 'var(--bios-text-faint)' }}
      >
        <IconArrowLeft size={14} /> Volver a clientes
      </button>

      {/* HEADER DEL CLIENTE Y KPIs */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <div 
            className="w-[52px] h-[52px] rounded-full border flex items-center justify-center text-[18px] font-bold"
            style={{ borderColor: 'var(--bios-border)', background: 'rgba(255,255,255,0.05)' }}
          >
            {cliente.foto ? <img src={cliente.foto} className="w-full h-full rounded-full object-cover" /> : cliente.nombre.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="text-[20px] font-bold text-white leading-tight">{cliente.nombre}</h2>
            <p className="text-[12px]" style={{ color: 'var(--bios-text-dim)' }}>
              {proyectos.length} proyecto(s) · {cliente.pais || 'Sin país'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <KpiMini label="Mes Actual" value={`$${kpis.ingMes.toFixed(2)}`} color="var(--bios-accent)" />
          
          <KpiMini 
            label={kpis.balance < 0 ? "Consignación" : kpis.balance > 0 ? "A Favor" : "Balance"} 
            value={`$${Math.abs(kpis.balance).toFixed(2)}`} 
            color={kpis.balance < 0 ? "var(--bios-danger)" : kpis.balance > 0 ? "var(--bios-ok)" : "var(--bios-text)"} 
          />
          
          <KpiMini label="Entregados" value={kpis.entregados} color="var(--bios-text)" />
          <KpiMini label="Pendientes" value={kpis.pendientes} color="var(--bios-text)" />
          
          <div className="flex gap-2 ml-2">
            <button 
              onClick={() => setModalPagoOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-[11px] font-semibold transition-colors hover:bg-white/5" 
              style={{ borderColor: 'var(--bios-ok)', color: 'var(--bios-ok)' }}
            >
              <IconCash size={14} /> Adelanto
            </button>
            <button 
              onClick={() => setModalHistorialOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-dashed rounded-lg text-[11px] font-semibold transition-colors hover:bg-white/5" 
              style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text-dim)' }}
            >
              Historial
            </button>
            <button 
              onClick={() => { setVideoAEditar(null); setModalVideoOpen(true); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-opacity hover:opacity-90" 
              style={{ background: 'var(--bios-accent)', color: '#0a1120' }}
            >
              <IconPlus size={14} /> Video
            </button>
          </div>
        </div>
      </div>

      {/* TABS DE PROYECTOS (ESTILO NOTION) */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {proyectos.map(p => (
          <button
            key={p.id}
            onClick={() => setProyectoActivoId(p.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] border ${proyectoActivoId === p.id ? 'border-solid' : 'border-dashed'}`}
            style={{
              borderColor: proyectoActivoId === p.id ? 'var(--bios-accent)' : 'var(--bios-border)',
              background: proyectoActivoId === p.id ? 'color-mix(in srgb, var(--bios-accent) 10%, transparent)' : 'transparent',
              color: proyectoActivoId === p.id ? 'var(--bios-accent)' : 'var(--bios-text-dim)'
            }}
          >
            <IconFolder size={14} /> {p.nombre}
            {proyectoActivoId === p.id && <IconPencil size={12} className="opacity-50 hover:opacity-100" />}
          </button>
        ))}
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] border border-dashed bg-transparent hover:bg-white/5" style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text-faint)' }}>
          <IconPlus size={14} /> Nuevo
        </button>
      </div>

      {/* BARRA DE FILTROS */}
      <div className="flex flex-wrap gap-3 items-center p-3 rounded-[10px] border" style={{ background: 'var(--bios-card-a)', borderColor: 'var(--bios-border)' }}>
        <input 
          type="text" 
          placeholder="Buscar video por título..." 
          value={filtroTexto}
          onChange={(e) => setFiltroTexto(e.target.value)}
          className="flex-1 min-w-[200px] bg-black/20 border rounded-lg px-3 py-1.5 text-[12px] outline-none"
          style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text)' }}
        />
        <div className="flex gap-1.5">
          <PillFilter active={filtroEstado === 'todos'} onClick={() => setFiltroEstado('todos')} label="Todo" />
          <PillFilter active={filtroEstado === 'sin_empezar'} onClick={() => setFiltroEstado('sin_empezar')} label="Sin empezar" />
          <PillFilter active={filtroEstado === 'en_curso'} onClick={() => setFiltroEstado('en_curso')} label="En curso" />
          <PillFilter active={filtroEstado === 'listo'} onClick={() => setFiltroEstado('listo')} label="Listo" />
        </div>
      </div>

      {/* TABLA DE VIDEOS */}
      <div className="overflow-x-auto rounded-[10px] border" style={{ borderColor: 'var(--bios-border)' }}>
        <table className="w-full text-left text-[12px] whitespace-nowrap border-collapse">
          <thead>
            <tr className="border-b bg-black/20" style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text-faint)' }}>
              <Th col="numero" current={ordenColumna} dir={ordenDireccion} onClick={alternarOrden}>#</Th>
              <Th col="nombre" current={ordenColumna} dir={ordenDireccion} onClick={alternarOrden}>Nombre del video</Th>
              <th className="p-2.5 font-semibold">Recibido</th>
              <Th col="entrega" current={ordenColumna} dir={ordenDireccion} onClick={alternarOrden}>Entrega</Th>
              <Th col="guion" current={ordenColumna} dir={ordenDireccion} onClick={alternarOrden}>Guion</Th>
              <th className="p-2.5 font-semibold text-center">Estado</th>
              <Th col="tiempo" current={ordenColumna} dir={ordenDireccion} onClick={alternarOrden}>Tiempo</Th>
              <th className="p-2.5 font-semibold">Cobrado</th>
              <Th col="subido" current={ordenColumna} dir={ordenDireccion} onClick={alternarOrden}>Subido</Th>
              <th className="p-2.5 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr><td colSpan={10} className="text-center p-6 text-[12px]" style={{ color: 'var(--bios-text-faint)' }}>Cargando videos...</td></tr>
            ) : videosFiltrados.length === 0 ? (
              <tr><td colSpan={10} className="text-center p-6 text-[12px]" style={{ color: 'var(--bios-text-faint)' }}>No hay videos en este proyecto.</td></tr>
            ) : (
              videosFiltrados.map(v => {
                const cobrado = Number(v.inversion) + Number(v.bono);
                const pctGuion = Math.min(100, (v.palabras_guion / (cliente.promedio_palabras || 3000)) * 100);

                return (
                  <tr key={v.id} className="border-b last:border-none transition-colors hover:bg-white/5" style={{ borderColor: 'var(--bios-border)' }}>
                    <td className="p-2.5 text-center font-bold" style={{ color: 'var(--bios-accent)' }}>{v.numero_video}</td>
                    <td className="p-2.5 font-semibold text-white">{v.nombre}</td>
                    <td className="p-2.5" style={{ color: 'var(--bios-text-dim)' }}>{v.fecha_recibido || '—'}</td>
                    <td className="p-2.5 font-bold" style={{ color: v.estado === 'listo' ? 'var(--bios-text-faint)' : 'var(--bios-warn)' }}>{v.fecha_entrega || '—'}</td>
                    <td className="p-2.5 w-[100px]">
                      <div className="text-[10px] mb-1" style={{ color: 'var(--bios-text-dim)' }}>{v.palabras_guion.toLocaleString()} pal.</div>
                      <div className="w-full h-[4px] rounded-full overflow-hidden" style={{ background: 'var(--bios-border)' }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${pctGuion}%`, background: 'var(--bios-accent)' }} />
                      </div>
                    </td>
                    <td className="p-2.5 text-center">
                      <select 
                        value={v.estado} 
                        onChange={(e) => handleCambiarEstado(v.id, e.target.value as EstadoVideo)}
                        className="text-[10px] font-bold px-2.5 py-1 rounded-full outline-none appearance-none cursor-pointer text-center"
                        style={{
                          background: v.estado === 'listo' ? 'color-mix(in srgb, var(--bios-ok) 15%, transparent)' : v.estado === 'en_curso' ? 'color-mix(in srgb, var(--bios-warn) 15%, transparent)' : 'color-mix(in srgb, var(--bios-danger) 15%, transparent)',
                          color: v.estado === 'listo' ? 'var(--bios-ok)' : v.estado === 'en_curso' ? 'var(--bios-warn)' : 'var(--bios-danger)'
                        }}
                      >
                        <option value="sin_empezar" className="bg-[#0f1626] text-white">Sin empezar</option>
                        <option value="en_curso" className="bg-[#0f1626] text-white">En curso</option>
                        <option value="listo" className="bg-[#0f1626] text-white">Listo</option>
                      </select>
                    </td>
                    <td className="p-2.5" style={{ color: 'var(--bios-text-dim)' }}>{v.tiempo_trabajo || '—'}</td>
                    <td className="p-2.5 font-bold text-white">${cobrado.toFixed(2)}</td>
                    <td className="p-2.5" style={{ color: 'var(--bios-text-dim)' }}>{v.fecha_subido || '—'}</td>
                    <td className="p-2.5 text-right">
                      <div className="flex gap-1 justify-end">
                        <BtnIcon icon={IconChartBar} title="Métricas" />
                        <BtnIcon icon={IconExternalLink} title="Abrir" />
                        <BtnIcon icon={IconPencil} title="Editar" color="var(--bios-accent)" onClick={() => { setVideoAEditar(v); setModalVideoOpen(true); }} />
                        <BtnIcon icon={IconTrash} title="Eliminar" color="var(--bios-danger)" onClick={() => handleEliminarVideo(v.id)} />
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* MODALES */}
      {proyectoActivoId && (
        <>
          <ModalVideo 
            open={modalVideoOpen} 
            onClose={() => setModalVideoOpen(false)}
            onSaved={cargarDatosProyecto}
            clienteId={clienteId}
            proyectoId={proyectoActivoId}
            videoAEditar={videoAEditar}
          />
          <ModalPago 
            open={modalPagoOpen}
            onClose={() => setModalPagoOpen(false)}
            onSaved={cargarDatosProyecto}
            clienteId={clienteId}
            proyectoId={proyectoActivoId}
          />
          <ModalHistorialPagos 
            open={modalHistorialOpen}
            onClose={() => setModalHistorialOpen(false)}
            pagos={pagos}
            onPagosChanged={cargarDatosProyecto}
          />
        </>
      )}
    </div>
  );
}

// ==========================================
// COMPONENTES AUXILIARES
// ==========================================
function KpiMini({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="border rounded-[8px] px-3 py-1.5 text-center min-w-[90px]" style={{ background: 'var(--bios-card-a)', borderColor: 'var(--bios-border)' }}>
      <div className="font-bold text-[16px] leading-tight" style={{ color }}>{value}</div>
      <div className="text-[9px] uppercase tracking-wider" style={{ color: 'var(--bios-text-dim)' }}>{label}</div>
    </div>
  );
}

function PillFilter({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1 rounded-full text-[11px] font-semibold border transition-colors"
      style={{
        background: active ? 'var(--bios-text)' : 'transparent',
        borderColor: active ? 'var(--bios-text)' : 'var(--bios-border)',
        color: active ? '#000' : 'var(--bios-text-dim)'
      }}
    >
      {label}
    </button>
  );
}

function Th({ children, col, current, dir, onClick }: any) {
  return (
    <th 
      onClick={() => onClick(col)} 
      className="p-2.5 font-semibold cursor-pointer hover:bg-white/5 select-none"
    >
      {children} {current === col && <span className="text-[10px]" style={{ color: 'var(--bios-accent)' }}>{dir === 'asc' ? '▲' : '▼'}</span>}
    </th>
  );
}

function BtnIcon({ icon: Icon, title, color = "var(--bios-text-dim)", onClick }: any) {
  return (
    <button 
      title={title} 
      onClick={onClick}
      className="w-[26px] h-[26px] rounded-md border flex items-center justify-center hover:bg-white/10 transition-colors"
      style={{ borderColor: 'var(--bios-border)', color }}
    >
      <Icon size={14} />
    </button>
  );
}
```

### `src\modules\trabajo\clientes\ClientesView.tsx`

```tsx
import { useEffect, useState, useMemo } from 'react';
import { 
  IconPlus, 
  IconTrendingUp, 
  IconVideo, 
  IconClock, 
  IconUsers 
} from '@tabler/icons-react';
import { 
  getClientes, 
  getAllVideos, 
  getAllPagos 
} from '../services/trabajoService';
import type { 
  Cliente, 
  VideoTrabajo, 
  PagoTrabajo, 
  StatClienteSummary 
} from '../types/trabajo.types';
import { ModalCliente } from './modals/ModalCliente';
import { ClientePanel } from './ClientePanel';
import { MonthSelector } from '../../../shared/components/MonthSelector'; // 1. IMPORTAR EL SELECTOR DE MESES

export function ClientesView() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [videos, setVideos] = useState<VideoTrabajo[]>([]);
  const [pagos, setPagos] = useState<PagoTrabajo[]>([]);
  const [cargando, setCargando] = useState(true);
  
  const [clienteActivoId, setClienteActivoId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clienteAEditar, setClienteAEditar] = useState<Cliente | null>(null);

  // 2. ESTADO PARA EL MES SELECCIONADO
  const [mesActual, setMesActual] = useState(new Date());

  // Función para mover el mes
  function moverMes(direccion: -1 | 1) {
    setMesActual((prev) => {
      const nuevo = new Date(prev);
      nuevo.setMonth(nuevo.getMonth() + direccion);
      return nuevo;
    });
  }

  async function cargarDatos() {
    setCargando(true);
    try {
      const [cli, vid, pag] = await Promise.all([
        getClientes(),
        getAllVideos(),
        getAllPagos()
      ]);
      setClientes(cli);
      setVideos(vid);
      setPagos(pag);
    } catch (error) {
      console.error("Error al cargar datos de clientes", error);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  // 3. ACTUALIZAR EL USEMEMO PARA QUE USE EL `mesActual` EN LUGAR DE `new Date()`
const stats = useMemo(() => {
    const mesFiltro = mesActual.getMonth();
    const anoFiltro = mesActual.getFullYear();

    let globalIngresos = 0;
    let globalEntregados = 0;
    let globalPendientes = 0;
    let clientesActivos = 0;

    const listaStats: StatClienteSummary[] = clientes.map(cliente => {
      const videosCli = videos.filter(v => v.cliente_id === cliente.id);
      const pagosCli = pagos.filter(p => p.cliente_id === cliente.id);

      let ingMesAct = 0;
      let pendientes = 0;
      let totalPagado = 0;
      let totalConsumido = 0;

      pagosCli.forEach(p => { totalPagado += Number(p.monto); });

      videosCli.forEach(v => {
        const cobrado = Number(v.inversion || 0) + Number(v.bono || 0);

        if (v.estado === 'listo') {
          totalConsumido += cobrado;
          
          // Mismo fix: Prioridad a fecha_entrega y cortamos el texto para evitar la zona horaria
          const fechaRef = v.fecha_entrega || v.fecha_subido || v.fecha_pago || v.ultima_edicion;
          if (fechaRef) {
            const partes = fechaRef.split('T')[0].split('-');
            if (partes.length >= 3) {
              const anoVal = parseInt(partes[0], 10);
              const mesVal = parseInt(partes[1], 10) - 1; // 0-indexed para JS
              
              if (mesVal === mesFiltro && anoVal === anoFiltro) {
                ingMesAct += cobrado;
                globalIngresos += cobrado;
                globalEntregados++;
              }
            }
          }
        } else {
          pendientes++; 
          globalPendientes++;
        }
      });

      const balance = totalPagado - totalConsumido;
      const inactivo = pendientes === 0 && ingMesAct === 0; 
      if (!inactivo) clientesActivos++;

      return {
        ...cliente,
        totalVideos: videosCli.length,
        pendientes,
        sinEmpezar: 0,
        enCurso: 0,
        ingMesAct,
        balance,
        inactivo,
        tendenciaClase: ingMesAct > 0 ? 'sube' : '',
        tendenciaTexto: 'Mes actual',
        textoComparativo: ''
      };
    });

    listaStats.sort((a, b) => b.ingMesAct - a.ingMesAct);

    return { lista: listaStats, globalIngresos, globalEntregados, globalPendientes, clientesActivos };
  }, [clientes, videos, pagos, mesActual]);

  if (clienteActivoId) {
    return <ClientePanel clienteId={clienteActivoId} onBack={() => setClienteActivoId(null)} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[18px] font-display font-bold">Portafolio de Clientes</h2>
          <p className="text-[12px]" style={{ color: 'var(--bios-text-dim)' }}>Gestiona tus ingresos y entregas activas.</p>
        </div>
        <button
          onClick={() => { setClienteAEditar(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-semibold transition-opacity hover:opacity-90"
          style={{ background: 'var(--bios-accent)', color: '#0a1120' }}
        >
          <IconPlus size={16} /> Nuevo Cliente
        </button>
      </div>

      {/* 4. RENDERIZAR EL SELECTOR DE MESES */}
      <MonthSelector 
        mes={mesActual} 
        onAnterior={() => moverMes(-1)} 
        onSiguiente={() => moverMes(1)} 
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard title="Ingresos del Mes" value={`$${stats.globalIngresos.toFixed(2)}`} icon={IconTrendingUp} color="var(--bios-ok)" />
        <KpiCard title="Videos Entregados" value={stats.globalEntregados} icon={IconVideo} color="var(--bios-accent)" />
        <KpiCard title="Trabajos Pendientes" value={stats.globalPendientes} icon={IconClock} color="var(--bios-warn)" />
        <KpiCard title="Clientes Activos" value={stats.clientesActivos} icon={IconUsers} color="var(--bios-accent-2)" />
      </div>

      {cargando ? (
        <div className="text-center py-10 text-[12px]" style={{ color: 'var(--bios-text-dim)' }}>Cargando clientes...</div>
      ) : stats.lista.length === 0 ? (
        <div className="rounded-[11px] border border-dashed p-10 text-center flex flex-col items-center justify-center" style={{ borderColor: 'var(--bios-border)' }}>
          <IconUsers size={32} style={{ color: 'var(--bios-text-faint)', marginBottom: 8 }} />
          <span className="text-[13px]" style={{ color: 'var(--bios-text-dim)' }}>No tienes clientes aún.</span>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {stats.lista.map(c => (
            <div
              key={c.id}
              onClick={() => setClienteActivoId(c.id)}
              className="flex items-center gap-4 rounded-[12px] border p-3.5 cursor-pointer transition-colors hover:bg-white/5"
              style={{
                background: 'linear-gradient(160deg, var(--bios-card-a), var(--bios-card-b))',
                borderColor: 'var(--bios-border)',
              }}
            >
              <div 
                className="w-11 h-11 rounded-full flex-shrink-0 border flex items-center justify-center font-bold text-[14px]"
                style={{ borderColor: 'var(--bios-border)', background: 'rgba(255,255,255,0.05)' }}
              >
                {c.foto ? (
                  <img src={c.foto} alt={c.nombre} className="w-full h-full rounded-full object-cover" />
                ) : (
                  c.nombre.substring(0, 2).toUpperCase()
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[13px] truncate">{c.nombre} {c.pais && <span className="text-[10px] opacity-60">({c.pais})</span>}</div>
                <div className="text-[11px] truncate" style={{ color: 'var(--bios-text-dim)' }}>
                  {c.proyecto || 'Edición de videos'}
                </div>
              </div>

              <div className="hidden sm:flex flex-col items-end w-[120px]">
                <div className="font-bold text-[14px]">${c.ingMesAct.toFixed(2)}</div>
                {c.balance > 0 ? (
                  <div className="text-[10px] font-semibold" style={{ color: 'var(--bios-danger)' }}>Debe: ${c.balance.toFixed(2)}</div>
                ) : c.balance < 0 ? (
                  <div className="text-[10px] font-semibold" style={{ color: 'var(--bios-ok)' }}>A favor: ${Math.abs(c.balance).toFixed(2)}</div>
                ) : (
                  <div className="text-[10px]" style={{ color: 'var(--bios-text-faint)' }}>Balance al día</div>
                )}
              </div>

              <div className="w-[100px] flex justify-end">
                {c.inactivo ? (
                  <Badge text="Inactivo" color="var(--bios-text-faint)" />
                ) : c.pendientes === 0 ? (
                  <Badge text="Al día" color="var(--bios-ok)" />
                ) : (
                  <Badge text={`${c.pendientes} Pendientes`} color={c.pendientes > 2 ? 'var(--bios-danger)' : 'var(--bios-warn)'} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ModalCliente 
        open={isModalOpen}
        clienteAEditar={clienteAEditar}
        onClose={() => setIsModalOpen(false)}
        onSaved={cargarDatos}
      />
    </div>
  );
}

function KpiCard({ title, value, icon: Icon, color }: any) {
  return (
    <div 
      className="rounded-[11px] border p-3 flex flex-col relative overflow-hidden"
      style={{ background: 'var(--bios-card-a)', borderColor: 'var(--bios-border)' }}
    >
      <div className="absolute top-0 left-0 w-full h-[2px]" style={{ background: color }} />
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} style={{ color }} />
        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--bios-text-dim)' }}>{title}</span>
      </div>
      <div className="font-display font-bold text-[22px]" style={{ color: 'var(--bios-text)' }}>{value}</div>
    </div>
  );
}

function Badge({ text, color }: { text: string; color: string }) {
  return (
    <span 
      className="px-2 py-1 rounded-[6px] text-[10px] font-bold tracking-wide whitespace-nowrap"
      style={{ background: `color-mix(in srgb, ${color} 15%, transparent)`, color }}
    >
      {text}
    </span>
  );
}
```

### `src\modules\trabajo\clientes\modals\ModalCliente.tsx`

```tsx
import { useState, useEffect } from 'react';
import { Modal } from '../../../../shared/components/Modal';
import { crearCliente, actualizarCliente, crearProyecto } from '../../services/trabajoService';
import type { Cliente } from '../../types/trabajo.types';

interface Props {
  open: boolean;
  clienteAEditar?: Cliente | null; // Si viene null es "Nuevo Cliente"
  onClose: () => void;
  onSaved: () => void; // Para recargar la lista al guardar
}

export function ModalCliente({ open, clienteAEditar, onClose, onSaved }: Props) {
  const [nombre, setNombre] = useState('');
  const [proyectoBase, setProyectoBase] = useState('');
  const [pais, setPais] = useState('');
  const [foto, setFoto] = useState('');
  const [promedioPalabras, setPromedioPalabras] = useState(3000);
  const [guardando, setGuardando] = useState(false);

  // Llenar campos si es edición
  useEffect(() => {
    if (clienteAEditar) {
      setNombre(clienteAEditar.nombre);
      setProyectoBase(clienteAEditar.proyecto || '');
      setPais(clienteAEditar.pais || '');
      setFoto(clienteAEditar.foto || '');
      setPromedioPalabras(clienteAEditar.promedio_palabras || 3000);
    } else {
      setNombre(''); setProyectoBase(''); setPais(''); setFoto(''); setPromedioPalabras(3000);
    }
  }, [clienteAEditar, open]);

  async function handleGuardar() {
    if (!nombre.trim()) return alert('El nombre del cliente es obligatorio.');
    
    setGuardando(true);
    try {
      if (clienteAEditar) {
        // ACTUALIZAR
        await actualizarCliente(clienteAEditar.id, {
          nombre, proyecto: proyectoBase, pais, foto, promedio_palabras: promedioPalabras
        });
      } else {
        // CREAR NUEVO
        const nuevoCliente = await crearCliente({
          nombre, proyecto: proyectoBase, pais, foto, promedio_palabras: promedioPalabras
        });
        
        // Al crear un cliente, le creamos automáticamente su primer proyecto/canal
        if (nuevoCliente) {
          await crearProyecto({
            cliente_id: nuevoCliente.id,
            nombre: proyectoBase || 'Proyecto Principal'
          });
        }
      }
      onSaved();
      onClose();
    } catch (error) {
      console.error(error);
      alert('Error al guardar el cliente.');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Modal
      open={open}
      title={clienteAEditar ? 'Editar cliente' : 'Nuevo cliente'}
      onCancel={onClose}
      onConfirm={handleGuardar}
      confirmLabel={guardando ? 'Guardando...' : 'Guardar cliente'}
    >
      <div className="flex flex-col gap-3 mt-2">
        {/* Vista previa Avatar */}
        <div className="flex justify-center mb-2">
          <div className="w-[72px] h-[72px] rounded-full border-[2px] overflow-hidden flex items-center justify-center text-[22px] font-bold" style={{ borderColor: 'var(--bios-accent)', background: 'rgba(255,255,255,0.05)' }}>
            {foto ? <img src={foto} className="w-full h-full object-cover" alt="Preview" /> : nombre.substring(0,2).toUpperCase()}
          </div>
        </div>

        <LabelInput label="Nombre del canal / cliente" value={nombre} onChange={setNombre} placeholder="Ej. MrBeast en Español" />
        <LabelInput label="Servicio prestado (Proyecto base)" value={proyectoBase} onChange={setProyectoBase} placeholder="Ej. Edición de YouTube" />
        <LabelInput label="País" value={pais} onChange={setPais} placeholder="Colombia, México, España..." />
        <LabelInput label="URL Foto de perfil (Opcional)" value={foto} onChange={setFoto} placeholder="https://..." />
        <LabelInput label="Promedio de palabras por video" type="number" value={promedioPalabras} onChange={(val: string) => setPromedioPalabras(Number(val))}/>
      </div>
    </Modal>
  );
}

// Subcomponente interno para no repetir estilos de inputs
function LabelInput({ label, value, onChange, placeholder = "", type = "text" }: any) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--bios-text-dim)' }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-black/20 border rounded-[8px] px-3 py-2 text-[12px] outline-none transition-colors focus:border-[var(--bios-accent)]"
        style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text)' }}
      />
    </div>
  );
}
```

### `src\modules\trabajo\clientes\modals\ModalHistorialPagos.tsx`

```tsx
import { IconX, IconTrash, IconCash } from '@tabler/icons-react';
import { deletePago } from '../../services/trabajoService';
import type { PagoTrabajo } from '../../types/trabajo.types';

interface ModalHistorialProps {
  open: boolean;
  onClose: () => void;
  pagos: PagoTrabajo[];
  onPagosChanged: () => void;
}

export function ModalHistorialPagos({ open, onClose, pagos, onPagosChanged }: ModalHistorialProps) {
  if (!open) return null;

  async function handleEliminar(id: string) {
    if (!confirm('¿Seguro que quieres eliminar este pago? El balance del cliente se actualizará.')) return;
    try {
      await deletePago(id);
      onPagosChanged();
    } catch (error) {
      alert("Error al eliminar el pago.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-[16px] border bg-[#0a1120] shadow-2xl flex flex-col max-h-[80vh]" style={{ borderColor: 'var(--bios-border)' }}>
        
        <div className="flex items-center justify-between p-4 border-b shrink-0" style={{ borderColor: 'var(--bios-border)' }}>
          <h2 className="text-[16px] font-bold flex items-center gap-2">
            <IconCash size={18} style={{ color: 'var(--bios-ok)' }} /> Historial de Pagos
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-md transition-colors"><IconX size={18} /></button>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          {pagos.length === 0 ? (
            <div className="text-center py-10 text-[12px]" style={{ color: 'var(--bios-text-faint)' }}>
              Aún no hay pagos registrados en este proyecto.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {pagos.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-[10px] border" style={{ background: 'var(--bios-card-a)', borderColor: 'var(--bios-border)' }}>
                  <div>
                    <div className="text-[13px] font-bold" style={{ color: 'var(--bios-ok)' }}>+ ${Number(p.monto).toFixed(2)}</div>
                    <div className="text-[10px]" style={{ color: 'var(--bios-text-dim)' }}>{p.fecha}</div>
                    {p.nota && (
                      <div className="text-[11px] mt-1 italic" style={{ color: 'var(--bios-text-faint)' }}>"{p.nota}"</div>
                    )}
                  </div>
                  <button 
                    onClick={() => handleEliminar(p.id)}
                    className="p-1.5 rounded-md hover:bg-red-500/20 transition-colors" 
                    style={{ color: 'var(--bios-danger)' }}
                    title="Eliminar pago"
                  >
                    <IconTrash size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

### `src\modules\trabajo\clientes\modals\ModalPago.tsx`

```tsx
import { useState } from 'react';
import { IconX } from '@tabler/icons-react';
import { createPago } from '../../services/trabajoService';

interface ModalPagoProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  clienteId: string;
  proyectoId: string;
}

export function ModalPago({ open, onClose, onSaved, clienteId, proyectoId }: ModalPagoProps) {
  const [cargando, setCargando] = useState(false);
  const [monto, setMonto] = useState<number | ''>('');
  
  // Por defecto, la fecha de hoy
  const [fechaInput, setFechaInput] = useState(new Date().toISOString().split('T')[0]); 

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!monto || Number(monto) <= 0) return alert('Ingresa un monto válido.');
    
    setCargando(true);
    try {
      await createPago({
        cliente_id: clienteId,
        proyecto_id: proyectoId,
        monto: Number(monto),
        fecha: fechaInput, // <-- CORREGIDO: Usamos 'fecha' en lugar de 'fecha_pago'
      });
      onSaved();
      onClose();
      setMonto(''); // Limpiamos para el próximo
    } catch (error) {
      console.error("Error guardando adelanto:", error);
      alert("Hubo un error al registrar el pago.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-[16px] border bg-[#0a1120] shadow-2xl" style={{ borderColor: 'var(--bios-border)' }}>
        
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--bios-border)' }}>
          <h2 className="text-[16px] font-bold">Registrar Adelanto</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-md transition-colors"><IconX size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
          <div>
            <label className="block text-[11px] font-bold mb-1" style={{ color: 'var(--bios-text-dim)' }}>Monto Recibido ($)</label>
            <input 
              type="number" 
              step="0.01" 
              required 
              autoFocus
              className="w-full bg-black/40 border rounded-lg px-3 py-2 text-[16px] font-bold outline-none" 
              style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-ok)' }}
              value={monto} 
              onChange={e => setMonto(e.target.value ? Number(e.target.value) : '')} 
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold mb-1" style={{ color: 'var(--bios-text-dim)' }}>Fecha del Pago</label>
            <input 
              type="date" 
              required
              className="w-full bg-black/40 border rounded-lg px-3 py-2 text-[12px] outline-none" 
              style={{ borderColor: 'var(--bios-border)' }}
              value={fechaInput} 
              onChange={e => setFechaInput(e.target.value)} 
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-[12px] font-semibold hover:bg-white/5 transition-colors">Cancelar</button>
            <button type="submit" disabled={cargando} className="px-4 py-2 rounded-lg text-[12px] font-semibold transition-opacity hover:opacity-90" style={{ background: 'var(--bios-ok)', color: '#0a1120' }}>
              {cargando ? 'Guardando...' : 'Confirmar Pago'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

### `src\modules\trabajo\clientes\modals\ModalVideo.tsx`

```tsx
import { useState, useEffect } from 'react';
import { IconX } from '@tabler/icons-react';
import { createVideo, updateVideo } from '../../services/trabajoService';
import type { VideoTrabajo, EstadoVideo } from '../../types/trabajo.types';

interface ModalVideoProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  clienteId: string;
  proyectoId: string;
  videoAEditar: VideoTrabajo | null;
}

export function ModalVideo({ open, onClose, onSaved, clienteId, proyectoId, videoAEditar }: ModalVideoProps) {
  const [cargando, setCargando] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: '',
    numero_video: 1,
    estado: 'sin_empezar' as EstadoVideo,
    fecha_recibido: '',
    fecha_entrega: '',
    palabras_guion: 0,
    tiempo_trabajo: '',
    inversion: 0,
    bono: 0,
  });

  useEffect(() => {
    if (videoAEditar) {
      setFormData({
        nombre: videoAEditar.nombre || '',
        numero_video: videoAEditar.numero_video || 1,
        estado: videoAEditar.estado || 'sin_empezar',
        fecha_recibido: videoAEditar.fecha_recibido || '',
        fecha_entrega: videoAEditar.fecha_entrega || '',
        palabras_guion: videoAEditar.palabras_guion || 0,
        tiempo_trabajo: videoAEditar.tiempo_trabajo || '',
        inversion: videoAEditar.inversion || 0,
        bono: videoAEditar.bono || 0,
      });
    } else {
      setFormData({
        nombre: '',
        numero_video: 1,
        estado: 'sin_empezar',
        fecha_recibido: new Date().toISOString().split('T')[0], // Hoy por defecto
        fecha_entrega: '',
        palabras_guion: 0,
        tiempo_trabajo: '',
        inversion: 0,
        bono: 0,
      });
    }
  }, [videoAEditar, open]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    try {
      if (videoAEditar) {
        await updateVideo(videoAEditar.id, formData);
      } else {
        await createVideo({ ...formData, cliente_id: clienteId, proyecto_id: proyectoId });
      }
      onSaved();
      onClose();
    } catch (error) {
      console.error("Error guardando video:", error);
      alert("Hubo un error al guardar el video.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-[16px] border bg-[#0a1120] shadow-2xl" style={{ borderColor: 'var(--bios-border)' }}>
        
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--bios-border)' }}>
          <h2 className="text-[16px] font-bold">{videoAEditar ? 'Editar Video' : 'Nuevo Video'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-md transition-colors"><IconX size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
          <div className="grid grid-cols-4 gap-3">
            <div className="col-span-1">
              <label className="block text-[11px] font-bold mb-1" style={{ color: 'var(--bios-text-dim)' }}>Número</label>
              <input type="number" required className="w-full bg-black/40 border rounded-lg px-3 py-2 text-[12px] outline-none" style={{ borderColor: 'var(--bios-border)' }}
                value={formData.numero_video} onChange={e => setFormData({...formData, numero_video: Number(e.target.value)})} />
            </div>
            <div className="col-span-3">
              <label className="block text-[11px] font-bold mb-1" style={{ color: 'var(--bios-text-dim)' }}>Título del Video</label>
              <input type="text" required autoFocus className="w-full bg-black/40 border rounded-lg px-3 py-2 text-[12px] outline-none" style={{ borderColor: 'var(--bios-border)' }}
                value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold mb-1" style={{ color: 'var(--bios-text-dim)' }}>Fecha Recibido</label>
              <input type="date" className="w-full bg-black/40 border rounded-lg px-3 py-2 text-[12px] outline-none" style={{ borderColor: 'var(--bios-border)' }}
                value={formData.fecha_recibido} onChange={e => setFormData({...formData, fecha_recibido: e.target.value})} />
            </div>
            <div>
              <label className="block text-[11px] font-bold mb-1" style={{ color: 'var(--bios-text-dim)' }}>Fecha Entrega</label>
              <input type="date" className="w-full bg-black/40 border rounded-lg px-3 py-2 text-[12px] outline-none" style={{ borderColor: 'var(--bios-border)' }}
                value={formData.fecha_entrega} onChange={e => setFormData({...formData, fecha_entrega: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold mb-1" style={{ color: 'var(--bios-text-dim)' }}>Palabras (Guion)</label>
              <input type="number" className="w-full bg-black/40 border rounded-lg px-3 py-2 text-[12px] outline-none" style={{ borderColor: 'var(--bios-border)' }}
                value={formData.palabras_guion} onChange={e => setFormData({...formData, palabras_guion: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-[11px] font-bold mb-1" style={{ color: 'var(--bios-text-dim)' }}>Inversión ($)</label>
              <input type="number" step="0.01" className="w-full bg-black/40 border rounded-lg px-3 py-2 text-[12px] outline-none" style={{ borderColor: 'var(--bios-border)' }}
                value={formData.inversion} onChange={e => setFormData({...formData, inversion: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-[11px] font-bold mb-1" style={{ color: 'var(--bios-text-dim)' }}>Bono ($)</label>
              <input type="number" step="0.01" className="w-full bg-black/40 border rounded-lg px-3 py-2 text-[12px] outline-none" style={{ borderColor: 'var(--bios-border)' }}
                value={formData.bono} onChange={e => setFormData({...formData, bono: Number(e.target.value)})} />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-[12px] font-semibold hover:bg-white/5 transition-colors">Cancelar</button>
            <button type="submit" disabled={cargando} className="px-4 py-2 rounded-lg text-[12px] font-semibold transition-opacity hover:opacity-90" style={{ background: 'var(--bios-accent)', color: '#0a1120' }}>
              {cargando ? 'Guardando...' : 'Guardar Video'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

### `src\modules\trabajo\services\trabajoService.ts`

```tsx
import { supabase } from '../../../core/db/supabase';
import type {
  Cliente,
  ProyectoTrabajo,
  VideoTrabajo,
  PagoTrabajo,
  EstadoVideo,
} from '../types/trabajo.types';

// ==========================================
// 1. CLIENTES (CRUD)
// ==========================================

export async function getClientes(): Promise<Cliente[]> {
  const { data, error } = await supabase
    .from('trabajo_clientes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error obteniendo clientes:', error.message);
    return [];
  }
  return data || [];
}

export async function crearCliente(cliente: Omit<Cliente, 'id' | 'created_at'>): Promise<Cliente | null> {
  const { data, error } = await supabase
    .from('trabajo_clientes')
    .insert([cliente])
    .select()
    .single();

  if (error) {
    console.error('Error creando cliente:', error.message);
    throw new Error(error.message);
  }
  return data;
}

export async function actualizarCliente(id: string, cambios: Partial<Cliente>): Promise<void> {
  const { error } = await supabase
    .from('trabajo_clientes')
    .update(cambios)
    .eq('id', id);

  if (error) {
    console.error('Error actualizando cliente:', error.message);
    throw new Error(error.message);
  }
}

export async function eliminarCliente(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('trabajo_clientes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error eliminando cliente:', error.message);
    return false;
  }
  return true;
}

// ==========================================
// 2. PROYECTOS / CANALES (CRUD)
// ==========================================

export async function getProyectosByCliente(clienteId: string): Promise<ProyectoTrabajo[]> {
  const { data, error } = await supabase
    .from('trabajo_proyectos')
    .select('*')
    .eq('cliente_id', clienteId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error obteniendo proyectos:', error.message);
    return [];
  }
  return data || [];
}

export async function crearProyecto(proyecto: Omit<ProyectoTrabajo, 'id' | 'created_at'>): Promise<ProyectoTrabajo | null> {
  const { data, error } = await supabase
    .from('trabajo_proyectos')
    .insert([proyecto])
    .select()
    .single();

  if (error) {
    console.error('Error creando proyecto:', error.message);
    throw new Error(error.message);
  }
  return data;
}

export async function actualizarProyecto(id: string, nombre: string): Promise<void> {
  const { error } = await supabase
    .from('trabajo_proyectos')
    .update({ nombre })
    .eq('id', id);

  if (error) {
    console.error('Error actualizando proyecto:', error.message);
    throw new Error(error.message);
  }
}

// ==========================================
// 3. VIDEOS (CRUD)
// ==========================================

export async function getVideosByProyecto(proyectoId: string): Promise<VideoTrabajo[]> {
  const { data, error } = await supabase
    .from('trabajo_videos')
    .select('*')
    .eq('proyecto_id', proyectoId)
    .order('numero_video', { ascending: true });

  if (error) {
    console.error('Error obteniendo videos:', error.message);
    return [];
  }
  return data || [];
}

export async function getAllVideos(): Promise<VideoTrabajo[]> {
  const { data, error } = await supabase
    .from('trabajo_videos')
    .select('*');

  if (error) {
    console.error('Error obteniendo todos los videos:', error.message);
    return [];
  }
  return data || [];
}

export async function guardarVideo(video: Omit<VideoTrabajo, 'id' | 'created_at'> & { id?: string }): Promise<VideoTrabajo | null> {
  const payload = {
    ...video,
    ultima_edicion: new Date().toISOString(),
  };

  if (video.id) {
    const { data, error } = await supabase
      .from('trabajo_videos')
      .update(payload)
      .eq('id', video.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  } else {
    const { data, error } = await supabase
      .from('trabajo_videos')
      .insert([payload])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
}

export async function actualizarEstadoVideo(id: string, estado: EstadoVideo): Promise<void> {
  const { error } = await supabase
    .from('trabajo_videos')
    .update({ estado, ultima_edicion: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('Error cambiando estado de video:', error.message);
  }
}

export async function eliminarVideo(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('trabajo_videos')
    .delete()
    .eq('id', id);

  return !error;
}

// ==========================================
// 4. PAGOS Y ADELANTOS (CRUD)
// ==========================================

export async function getPagosByProyecto(proyectoId: string): Promise<PagoTrabajo[]> {
  const { data, error } = await supabase
    .from('trabajo_pagos')
    .select('*')
    .eq('proyecto_id', proyectoId)
    .order('fecha', { ascending: false });

  if (error) {
    console.error('Error obteniendo pagos:', error.message);
    return [];
  }
  return data || [];
}

export async function getAllPagos(): Promise<PagoTrabajo[]> {
  const { data, error } = await supabase
    .from('trabajo_pagos')
    .select('*');

  if (error) {
    console.error('Error obteniendo todos los pagos:', error.message);
    return [];
  }
  return data || [];
}

export async function crearPago(pago: Omit<PagoTrabajo, 'id' | 'created_at'>): Promise<PagoTrabajo | null> {
  const { data, error } = await supabase
    .from('trabajo_pagos')
    .insert([pago])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function eliminarPago(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('trabajo_pagos')
    .delete()
    .eq('id', id);

  return !error;
}

export async function createVideo(video: Partial<VideoTrabajo>) {
  const { data, error } = await supabase
    .from('trabajo_videos')
    .insert([video])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateVideo(id: string, video: Partial<VideoTrabajo>) {
  const { data, error } = await supabase
    .from('trabajo_videos')
    .update(video)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function createPago(pago: Partial<PagoTrabajo>) {
  const { data, error } = await supabase
    .from('trabajo_pagos')
    .insert([pago])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletePago(id: string) {
  const { error } = await supabase
    .from('trabajo_pagos')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
}
```

### `src\modules\trabajo\TrabajoModule.tsx`

```tsx
import { useState } from 'react';
import { TrabajoNav } from './TrabajoNav';
import { ClientesView } from './clientes/ClientesView'; // 1. IMPORTAR LA VISTA DE CLIENTES

export function TrabajoModule() {
  const [tab, setTab] = useState('clientes'); 

  return (
    <div className="pb-20 md:pb-10">
      <div className="max-w-[1180px] mx-auto px-5 pt-4">
        <h1 className="font-display font-bold text-[15px] mb-3">Trabajo</h1>
        
        <TrabajoNav active={tab} onChange={setTab} />

        <div className="mt-6">
          {tab === 'dashboard' && (
            <div className="py-10 text-center font-mono text-[11px]" style={{ color: 'var(--bios-text-faint)' }}>
              — Dashboard General en construcción —
            </div>
          )}
          
          {/* 2. RENDERIZAR <ClientesView /> AQUÍ */}
          {tab === 'clientes' && <ClientesView />}

          {tab === 'proyectos' && (
            <div className="py-10 text-center font-mono text-[11px]" style={{ color: 'var(--bios-text-faint)' }}>
              — Vista de Proyectos en construcción —
            </div>
          )}

          {tab === 'contabilidad' && (
            <div className="py-10 text-center font-mono text-[11px]" style={{ color: 'var(--bios-text-faint)' }}>
              — Vista de Contabilidad en construcción —
            </div>
          )}

          {tab === 'tareas' && (
            <div className="py-10 text-center font-mono text-[11px]" style={{ color: 'var(--bios-text-faint)' }}>
              — Vista de Tareas en construcción —
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

### `src\modules\trabajo\TrabajoNav.tsx`

```tsx
import {
  IconLayoutDashboard,
  IconUsers,
  IconFolder,
  IconCalculator,
  IconCheckbox,
} from '@tabler/icons-react';
import { ModuleNav, type ModuleNavItem } from '../../shared/components/ModuleNav';

const TABS: ModuleNavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: IconLayoutDashboard },
  { id: 'clientes', label: 'Clientes', icon: IconUsers },
  { id: 'proyectos', label: 'Proyectos', icon: IconFolder },
  { id: 'contabilidad', label: 'Contabilidad', icon: IconCalculator },
  { id: 'tareas', label: 'Tareas', icon: IconCheckbox },
];

interface Props {
  active: string;
  onChange: (id: string) => void;
}

export function TrabajoNav({ active, onChange }: Props) {
  // No usamos "moreItems" por ahora, caben perfectamente en la barra principal
  return <ModuleNav items={TABS} activeId={active} onChange={onChange} />;
}
```

### `src\modules\trabajo\types\trabajo.types.ts`

```tsx
// ==========================================
// MÓDULO TRABAJO: TIPOS E INTERFACES
// ==========================================

export type EstadoVideo = 'sin_empezar' | 'en_curso' | 'listo';

export interface RedSocialStats {
  vistas: number;
  likes: number;
  url: string;
  nota: string;
}

export interface RedesSocialesMap {
  youtube: RedSocialStats;
  facebook: RedSocialStats;
  tiktok: RedSocialStats;
  instagram: RedSocialStats;
}

export interface Cliente {
  id: string;
  user_id?: string;
  nombre: string;
  proyecto?: string;
  pais?: string;
  foto?: string;
  promedio_palabras: number;
  created_at?: string;
}

export interface ProyectoTrabajo {
  id: string;
  cliente_id: string;
  user_id?: string;
  nombre: string;
  created_at?: string;
}

export interface VideoTrabajo {
  id: string;
  proyecto_id: string;
  cliente_id: string;
  user_id?: string;
  numero_video: number;
  nombre: string;
  estado: EstadoVideo;
  fecha_recibido?: string | null;
  fecha_entrega?: string | null;
  fecha_subido?: string | null;
  fecha_pago?: string | null;
  tiempo_trabajo?: string;
  palabras_guion: number;
  inversion: number;
  bono: number;
  redes: RedesSocialesMap;
  ultima_edicion?: string;
  created_at?: string;
}

export interface PagoTrabajo {
  id: string;
  cliente_id: string;
  proyecto_id: string;
  user_id?: string;
  monto: number;
  fecha: string;
  nota?: string;
  created_at?: string;
}

// Interfaz agregada para renderizar estadísticas en los Dashboards
export interface StatClienteSummary extends Cliente {
  totalVideos: number;
  pendientes: number;
  sinEmpezar: number;
  enCurso: number;
  ingMesAct: number;
  tendenciaClase: 'sube' | 'baja' | '';
  tendenciaTexto: string;
  textoComparativo: string;
  balance: number;
  inactivo: boolean;
}

export type ColumnaOrdenVideo = 'numero' | 'nombre' | 'entrega' | 'guion' | 'tiempo' | 'subido';
export type DireccionOrden = 'asc' | 'desc';
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
          'linear-gradient(rgba(31,143,209,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(31,143,209,0.06) 1px, transparent 1px)',
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
        className="fixed top-0 left-0 bottom-0 z-40 flex flex-col md:hidden transition-transform duration-200 bios-menu-metal"
        style={{
          width: 190,
          padding: '16px 12px',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
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
              className="w-full flex items-center gap-3 mb-2 border text-[14px]"
              style={{
                height: 40,
                padding: '0 9px',
                background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
                borderColor: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                color: active ? '#f4f7fc' : 'rgba(244,247,252,0.55)',
              }}
            >
              <item.icon style={{ width: 19, height: 19, flexShrink: 0 }} />
              <span>{item.label}</span>
            </button>
          );
        })}

        <button
          className="mt-auto w-full flex items-center gap-3 border border-dashed text-[13px]"
          style={{ height: 34, padding: '0 9px', borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(244,247,252,0.4)' }}
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
      className="hidden md:flex flex-col items-start flex-shrink-0 border-r transition-all duration-200 bios-menu-metal"
      style={{
        width: expanded ? 170 : 64,
        padding: '16px 12px',
        borderColor: 'rgba(255,255,255,0.06)',
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
            className="w-full flex items-center gap-3 mb-2 border text-[14px] whitespace-nowrap overflow-hidden"
            style={{
              height: 40,
              padding: '0 9px',
              background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
              borderColor: active ? 'rgba(255,255,255,0.15)' : 'transparent',
              color: active ? '#f4f7fc' : 'rgba(244,247,252,0.55)',
            }}
          >
            <item.icon style={{ width: 19, height: 19, flexShrink: 0 }} />
            <span style={{ opacity: expanded ? 1 : 0, width: expanded ? 'auto' : 0 }}>{item.label}</span>
          </button>
        );
      })}

      <button
        className="mt-auto mb-2 w-full flex items-center gap-3 border border-dashed text-[13px]"
        style={{ height: 34, padding: '0 9px', borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(244,247,252,0.4)' }}
      >
        <IconPlus style={{ width: 16, height: 16, flexShrink: 0 }} />
        <span style={{ opacity: expanded ? 1 : 0, width: expanded ? 'auto' : 0 }}>Nuevo módulo</span>
      </button>

      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-10 h-10 border flex items-center justify-center"
        style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(244,247,252,0.5)' }}
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
  IconBriefcase,
  IconFilter,
  IconPencil,
  IconAdjustmentsHorizontal,
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
  IconBriefcase as IconBriefcase,
  IconFilter,
  IconPencil,
  IconAdjustmentsHorizontal,
};
```

### `src\shared\navConfig.tsx`

```tsx
import { IconHome, IconBank, IconBriefcase } from './icons';

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
  { id: 'trabajo', label: 'Trabajo', icon: IconBriefcase },
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
  tipo?: string;
  color?: string;
  logo?: string;
  incluir_dashboard?: boolean;
  archivada?: boolean;
}

export interface Transaccion {
  id?: string;
  tipo: 'ingreso' | 'gasto' | 'transferencia';
  monto: number;
  descripcion: string;
  fecha: string;
  cuenta_id: string;
  cuenta_destino_id?: string | null;
  categoria_id?: string | null;
  comercio?: string | null;
  pagado: boolean;
  gasto_fijo?: boolean;
  observacion?: string | null;
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
    .eq('archivada', false)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error al obtener cuentas:', error.message);
    return [];
  }
  return data || [];
}

export async function crearCuenta(cuenta: Omit<Cuenta, 'id'>): Promise<Cuenta | null> {
  const { data, error } = await supabase.from('cuentas').insert([cuenta]).select().single();
  if (error) {
    console.error('Error al crear cuenta:', error.message);
    throw new Error(error.message);
  }
  return data;
}

export async function actualizarCuenta(id: string, cambios: Partial<Cuenta>): Promise<void> {
  const { error } = await supabase.from('cuentas').update(cambios).eq('id', id);
  if (error) {
    console.error('Error al actualizar cuenta:', error.message);
    throw new Error(error.message);
  }
}

export async function archivarCuenta(id: string): Promise<boolean> {
  const { error } = await supabase.from('cuentas').update({ archivada: true }).eq('id', id);
  if (error) {
    console.error('Error al archivar cuenta:', error.message);
    return false;
  }
  return true;
}

export async function eliminarCuenta(id: string): Promise<boolean> {
  const { error } = await supabase.from('cuentas').delete().eq('id', id);
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

export async function crearTransaccion(t: Omit<Transaccion, 'id'>): Promise<Transaccion | null> {
  const { data, error } = await supabase.from('transacciones').insert([t]).select().single();
  if (error) {
    console.error('Error al crear transacción:', error.message);
    throw new Error(error.message);
  }
  return data;
}

export async function actualizarTransaccion(id: string, cambios: Partial<Transaccion>): Promise<void> {
  const { error } = await supabase.from('transacciones').update(cambios).eq('id', id);
  if (error) {
    console.error('Error al actualizar transacción:', error.message);
    throw new Error(error.message);
  }
}

export async function archivarTransaccion(id: string): Promise<boolean> {
  const { error } = await supabase.from('transacciones').update({ archivada: true }).eq('id', id);
  if (error) {
    console.error('Error al archivar transacción:', error.message);
    return false;
  }
  return true;
}

export function filtrarPorMes(transacciones: Transaccion[], mes: Date): Transaccion[] {
  const year = mes.getFullYear();
  const month = String(mes.getMonth() + 1).padStart(2, '0');
  const prefijo = `${year}-${month}`;
  return transacciones.filter((t) => t.fecha.startsWith(prefijo));
}

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
// REAJUSTE DE SALDO
// ==========================================

/** Busca la categoría oculta "Reajuste*" del tipo dado, o la crea si no existe. */
async function obtenerOCrearCategoriaAjuste(tipo: 'gasto' | 'ingreso'): Promise<string> {
  const { data: existente } = await supabase
    .from('categorias')
    .select('id')
    .eq('nombre', 'Reajuste*')
    .eq('tipo', tipo)
    .maybeSingle();

  if (existente) return existente.id;

  const { data: nueva, error } = await supabase
    .from('categorias')
    .insert([{ nombre: 'Reajuste*', tipo, color: tipo === 'ingreso' ? '#2ecc71' : '#e74c3c', emoji: '🔧', archivada: false }])
    .select()
    .single();

  if (error || !nueva) throw new Error(error?.message || 'No se pudo crear la categoría de ajuste');
  return nueva.id;
}

/**
 * Reajusta el saldo de una cuenta a `nuevoSaldo`.
 * - metodo 'transaccion': crea un movimiento visible (ingreso o gasto según
 *   la diferencia) en la categoría oculta "Reajuste*". Deja registro.
 * - metodo 'inicial': modifica directamente `saldo_inicial` de la cuenta,
 *   sin crear ningún movimiento. Silencioso.
 */
export async function reajustarSaldoCuenta(
  cuenta: Cuenta,
  saldoActual: number,
  nuevoSaldo: number,
  metodo: 'transaccion' | 'inicial',
  descripcion: string
): Promise<void> {
  const diferencia = nuevoSaldo - saldoActual;
  if (Math.abs(diferencia) < 0.01) return;

  if (metodo === 'inicial') {
    await actualizarCuenta(cuenta.id!, { saldo_inicial: (cuenta.saldo_inicial || 0) + diferencia });
    return;
  }

  const tipo: 'ingreso' | 'gasto' = diferencia > 0 ? 'ingreso' : 'gasto';
  const categoriaAjusteId = await obtenerOCrearCategoriaAjuste(tipo);
  const hoy = new Date().toISOString().split('T')[0];

  await crearTransaccion({
    tipo,
    monto: Math.abs(diferencia),
    descripcion: descripcion || 'Reajuste de saldo',
    fecha: hoy,
    cuenta_id: cuenta.id!,
    cuenta_destino_id: null,
    categoria_id: categoriaAjusteId,
    comercio: null,
    pagado: true,
    gasto_fijo: false,
    observacion: 'Ajuste de saldo generado automáticamente por el sistema.',
    archivada: false,
  });
}

// ==========================================
// CATEGORÍAS
// ==========================================

export async function getCategorias(): Promise<Categoria[]> {
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .eq('archivada', false)
    // "Reajuste*" es una categoría oculta de sistema — nunca debe aparecer
    // en listas ni selectores normales.
    .neq('nombre', 'Reajuste*')
    .order('nombre', { ascending: true });

  if (error) {
    console.error('Error al obtener categorías:', error.message);
    return [];
  }
  return data || [];
}

export async function crearCategoria(categoria: Omit<Categoria, 'id'>): Promise<Categoria | null> {
  const { data, error } = await supabase.from('categorias').insert([categoria]).select().single();
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

