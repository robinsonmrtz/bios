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