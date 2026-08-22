import { useEffect, useState, useMemo } from 'react';
import { IconArrowLeft, IconCash, IconPlus, IconFolder, IconPencil, IconTrash, IconFileExport, IconSearch } from '@tabler/icons-react';
import { 
  getClientes, getProyectosByCliente, getVideosByProyecto, getPagosByProyecto, 
  actualizarEstadoVideo, eliminarVideo 
} from '../services/trabajoService';
import type { Cliente, ProyectoTrabajo, VideoTrabajo, PagoTrabajo, EstadoVideo, ColumnaOrdenVideo, DireccionOrden } from '../types/trabajo.types';
import { ModalVideo } from './modals/ModalVideo';
import { ModalPago } from './modals/ModalPago';
import { ModalHistorialPagos } from './modals/ModalHistorialPagos';
import { ModalProyecto } from './modals/ModalProyecto';
import { ConfirmModal } from '../../../shared/components/ConfirmModal';
import { MonthSelector } from '../../../shared/components/MonthSelector';

interface Props { clienteId: string; onBack: () => void; }

function getFlagEmoji(country: string) {
  if (!country) return '';
  const c = country.toLowerCase().trim();
  const flags: Record<string, string> = {
    'españa': '🇪🇸', 'colombia': '🇨🇴', 'mexico': '🇲🇽', 'méxico': '🇲🇽',
    'argentina': '🇦🇷', 'chile': '🇨🇱', 'peru': '🇵🇪', 'perú': '🇵🇪',
    'ecuador': '🇪🇨', 'venezuela': '🇻🇪', 'bolivia': '🇧🇴', 'uruguay': '🇺🇾',
    'paraguay': '🇵🇾', 'costa rica': '🇨🇷', 'panama': '🇵🇦', 'panamá': '🇵🇦',
    'republica dominicana': '🇩🇴', 'república dominicana': '🇩🇴',
    'honduras': '🇭🇳', 'el salvador': '🇸🇻', 'guatemala': '🇬🇹',
    'nicaragua': '🇳🇮', 'cuba': '🇨🇺', 'puerto rico': '🇵🇷',
    'estados unidos': '🇺🇸', 'usa': '🇺🇸', 'eeuu': '🇺🇸'
  };
  return flags[c] || c;
}

export function ClientePanel({ clienteId, onBack }: Props) {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [proyectos, setProyectos] = useState<ProyectoTrabajo[]>([]);
  const [proyectoActivoId, setProyectoActivoId] = useState<string | null>(null);
  const [videos, setVideos] = useState<VideoTrabajo[]>([]);
  const [pagos, setPagos] = useState<PagoTrabajo[]>([]);
  const [cargando, setCargando] = useState(true);

  const [mesActual, setMesActual] = useState(new Date());

  const [modalVideoOpen, setModalVideoOpen] = useState(false);
  const [videoAEditar, setVideoAEditar] = useState<VideoTrabajo | null>(null);
  const [videoAEliminar, setVideoAEliminar] = useState<VideoTrabajo | null>(null);
  const [modalPagoOpen, setModalPagoOpen] = useState(false);
  const [modalHistorialOpen, setModalHistorialOpen] = useState(false);

  const [modalProyectoOpen, setModalProyectoOpen] = useState(false);
  const [proyectoAEditar, setProyectoAEditar] = useState<ProyectoTrabajo | null>(null);

  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'todos' | EstadoVideo>('todos');
  const [ordenColumna, setOrdenColumna] = useState<ColumnaOrdenVideo>('numero');
  const [ordenDireccion, setOrdenDireccion] = useState<DireccionOrden>('asc');

  function moverMes(direccion: -1 | 1) {
    setMesActual((prev) => {
      const nuevo = new Date(prev);
      nuevo.setMonth(nuevo.getMonth() + direccion);
      return nuevo;
    });
  }

  async function cargarProyectos() {
    const projs = await getProyectosByCliente(clienteId);
    setProyectos(projs);
    return projs;
  }

  useEffect(() => {
    async function init() {
      const cls = await getClientes();
      const cli = cls.find(c => c.id === clienteId);
      if (cli) setCliente(cli);
      
      const projs = await cargarProyectos();
      if (projs.length > 0) setProyectoActivoId(projs[0].id);
    }
    init();
  }, [clienteId]);

  async function cargarDatosProyecto() {
    if (!proyectoActivoId) return;
    setCargando(true);
    const [vids, pags] = await Promise.all([getVideosByProyecto(proyectoActivoId), getPagosByProyecto(proyectoActivoId)]);
    setVideos(vids); setPagos(pags);
    setCargando(false);
  }

  useEffect(() => { cargarDatosProyecto(); }, [proyectoActivoId]);

  const proyectoActivo = proyectos.find(p => p.id === proyectoActivoId);

  const kpis = useMemo(() => {
    let ingMes = 0, totalPagado = 0, totalConsumido = 0, entregados = 0, pendientes = 0;
    const mesFiltro = mesActual.getMonth(); 
    const anoFiltro = mesActual.getFullYear();

    pagos.forEach(p => { totalPagado += Number(p.monto); });
    videos.forEach(v => {
      const cobrado = Number(v.inversion || 0) + Number(v.bono || 0);
      if (v.estado === 'listo') {
        totalConsumido += cobrado;
        const fechaRef = v.fecha_entrega || v.fecha_subido || v.fecha_pago || v.ultima_edicion;
        if (fechaRef) {
          const partes = fechaRef.split('T')[0].split('-');
          if (partes.length >= 3 && parseInt(partes[1], 10) - 1 === mesFiltro && parseInt(partes[0], 10) === anoFiltro) {
            ingMes += cobrado;
            entregados++;
          }
        }
      } else { 
        pendientes++; 
      }
    });

    return { ingMes, entregados, pendientes, balance: totalPagado - totalConsumido };
  }, [videos, pagos, mesActual]);

  const videosFiltrados = useMemo(() => {
    let lista = videos.filter(v => v.nombre.toLowerCase().includes(filtroTexto.toLowerCase()) && (filtroEstado === 'todos' || v.estado === filtroEstado));
    lista.sort((a, b) => {
      let valA: any = a.numero_video;
      let valB: any = b.numero_video;

      if (ordenColumna === 'nombre') { valA = a.nombre.toLowerCase(); valB = b.nombre.toLowerCase(); }
      else if (ordenColumna === 'entrega') { valA = a.fecha_entrega || '9999'; valB = b.fecha_entrega || '9999'; }
      else if (ordenColumna === 'guion') { valA = a.palabras_guion; valB = b.palabras_guion; }
      else if (ordenColumna === 'subido') { valA = a.fecha_subido || '9999'; valB = b.fecha_subido || '9999'; }
      else if (ordenColumna === 'estado') {
        const pesos: Record<string, number> = { listo: 3, en_curso: 2, sin_empezar: 1 };
        valA = pesos[a.estado] || 0; valB = pesos[b.estado] || 0;
      }

      if (valA < valB) return ordenDireccion === 'asc' ? -1 : 1;
      if (valA > valB) return ordenDireccion === 'asc' ? 1 : -1;
      return 0;
    });

    return lista;
  }, [videos, filtroTexto, filtroEstado, ordenColumna, ordenDireccion]);

  function alternarOrden(col: ColumnaOrdenVideo) {
    if (ordenColumna === col) setOrdenDireccion(prev => prev === 'asc' ? 'desc' : 'asc');
    else { setOrdenColumna(col); setOrdenDireccion('asc'); }
  }

  async function handleCambiarEstado(id: string, nuevoEstado: EstadoVideo) {
    await actualizarEstadoVideo(id, nuevoEstado);
    cargarDatosProyecto();
  }

  function handleExportarPDF() {
    if (!cliente) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return alert('Por favor permite las ventanas emergentes en tu navegador.');
    
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Reporte - ${cliente.nombre}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; color: #1f2937; padding: 30px; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 25px; }
          .client-info h1 { margin: 0; font-size: 22px; font-weight: bold; }
          .client-info p { margin: 4px 0 0 0; color: #4b5563; font-size: 13px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px; }
          th, td { border: 1px solid #e5e7eb; padding: 8px 10px; text-align: left; }
          th { background-color: #f9fafb; font-weight: bold; }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="client-info">
            <h1>${cliente.nombre}</h1>
            <p><strong>Consignación Actual:</strong> $${Math.abs(kpis.balance).toFixed(2)}</p>
          </div>
        </div>
        <table>
          <thead><tr><th class="text-center">#</th><th>Título del Video</th><th>Entrega</th><th>Estado</th><th class="text-right">Cobrado</th></tr></thead>
          <tbody>
            ${videos.map(v => `
              <tr>
                <td class="text-center">${String(v.numero_video).padStart(2, '0')}</td>
                <td>${v.nombre}</td><td>${v.fecha_entrega || '—'}</td><td>${v.estado}</td>
                <td class="text-right">$${(Number(v.inversion) + Number(v.bono)).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <script>window.onload = function() { window.print(); }</script>
      </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }

  const nextVideoNumber = videos.length > 0 ? Math.max(...videos.map(v => v.numero_video)) + 1 : 1;

  if (!cliente) return <div className="p-10 text-center">Cargando perfil...</div>;

  return (
    <div className="flex flex-col gap-5">
      
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-[12px] w-fit hover:underline" style={{ color: 'var(--bios-text-faint)' }}>
          <IconArrowLeft size={14} /> Volver a clientes
        </button>
        <div className="w-[200px]">
          <MonthSelector mes={mesActual} onAnterior={() => moverMes(-1)} onSiguiente={() => moverMes(1)} />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-[52px] h-[52px] rounded-full border flex items-center justify-center text-[18px] font-bold overflow-hidden" style={{ borderColor: 'var(--bios-border)', background: 'rgba(255,255,255,0.05)' }}>
            {cliente.foto ? <img src={cliente.foto} className="w-full h-full object-cover" /> : cliente.nombre.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="text-[20px] font-bold leading-tight flex items-center gap-2" style={{ color: 'var(--bios-text)' }}>
              {cliente.nombre} <span className="text-[16px]">{getFlagEmoji(cliente.pais || '')}</span>
            </h2>
            <p className="text-[12px]" style={{ color: 'var(--bios-text-dim)' }}>{proyectos.length} proyecto(s) activos</p>
          </div>
        </div>

        {/* RESTAURADOS: Todos los KPIs (Mes Actual, Consignación, Entregados y Pendientes) */}
        <div className="flex flex-wrap gap-2 items-center">
          <KpiMini label="Mes Actual" value={`$${kpis.ingMes.toFixed(2)}`} color="var(--bios-accent)" />
          <KpiMini label="Consignación" value={`$${Math.abs(kpis.balance).toFixed(2)}`} color={kpis.balance < 0 ? "var(--bios-danger)" : "var(--bios-ok)"} />
          <KpiMini label="Entregados" value={kpis.entregados} color="var(--bios-text)" />
          <KpiMini label="Pendientes" value={kpis.pendientes} color="var(--bios-warn)" />
          
          <div className="flex flex-col md:flex-row gap-2 ml-2">
            <button onClick={() => setModalPagoOpen(true)} className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors hover:bg-white/5 border" style={{ borderColor: 'var(--bios-ok)', color: 'var(--bios-ok)' }}>
              <IconCash size={15} /> Adelanto
            </button>
            <button onClick={() => setModalHistorialOpen(true)} className="flex items-center justify-center gap-1.5 px-3 py-1.5 border border-dashed rounded-lg text-[11px] font-semibold transition-colors hover:bg-white/5" style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text-dim)' }}>
              Historial
            </button>
            <button onClick={() => { setVideoAEditar(null); setModalVideoOpen(true); }} className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-opacity hover:opacity-90 shadow-md" style={{ background: 'var(--bios-accent)', color: '#0a1120' }}>
              <IconPlus size={15} /> Video
            </button>
          </div>
        </div>
      </div>

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
            {proyectoActivoId === p.id && (
              <IconPencil size={12} className="opacity-50 hover:opacity-100 transition-opacity ml-1" onClick={(e) => { e.stopPropagation(); setProyectoAEditar(p); setModalProyectoOpen(true); }} />
            )}
          </button>
        ))}
        <button 
          onClick={() => { setProyectoAEditar(null); setModalProyectoOpen(true); }} 
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] border border-dashed hover:bg-white/5 transition-colors"
          style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text-faint)' }}
        >
          <IconPlus size={14} /> Nuevo
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-3 items-center p-2.5 rounded-[12px] shadow-md border" style={{ background: 'var(--bios-sidebar-base)', borderColor: 'var(--bios-border)' }}>
        <div className="flex-1 w-full relative flex items-center">
          <IconSearch size={16} className="absolute left-3 opacity-60 text-white" />
          <input type="text" placeholder="Buscar video por título..." value={filtroTexto} onChange={(e) => setFiltroTexto(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-[8px] pl-9 pr-3 py-2 text-[13px] text-white outline-none transition-colors focus:bg-black/40 placeholder-white/40" />
        </div>
        
        <div className="flex w-full md:w-auto gap-1 bg-black/20 p-1 rounded-[8px] border border-white/5 overflow-x-auto no-scrollbar">
          <PillFilter active={filtroEstado === 'todos'} onClick={() => setFiltroEstado('todos')} label="Todos" />
          <PillFilter active={filtroEstado === 'sin_empezar'} onClick={() => setFiltroEstado('sin_empezar')} label="Sin empezar" />
          <PillFilter active={filtroEstado === 'en_curso'} onClick={() => setFiltroEstado('en_curso')} label="En curso" />
          <PillFilter active={filtroEstado === 'listo'} onClick={() => setFiltroEstado('listo')} label="Listo" />
        </div>
        
        <button onClick={handleExportarPDF} className="w-full md:w-auto flex items-center justify-center gap-1.5 px-3 py-2 border rounded-[8px] text-[11.5px] font-bold transition-colors hover:bg-white/10" style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
          <IconFileExport size={15} /> Exportar PDF
        </button>
      </div>

      <div className="overflow-x-auto rounded-[12px] border shadow-sm" style={{ borderColor: 'var(--bios-border)' }}>
        <table className="w-full text-left text-[12px] whitespace-nowrap border-collapse">
          <thead>
            <tr className="border-b" style={{ background: 'var(--bios-sidebar-base)', borderColor: 'var(--bios-border)', color: 'white' }}>
              <Th col="numero" current={ordenColumna} dir={ordenDireccion} onClick={alternarOrden}>#</Th>
              <th className="p-3 font-semibold hidden md:table-cell cursor-pointer hover:bg-white/5 transition-colors" onClick={() => alternarOrden('nombre')}>Nombre del video</th>
              <th className="p-3 font-semibold hidden md:table-cell">Recibido</th>
              <Th col="entrega" current={ordenColumna} dir={ordenDireccion} onClick={alternarOrden}>Entrega</Th>
              <Th col="guion" current={ordenColumna} dir={ordenDireccion} onClick={alternarOrden}>Guion</Th>
              <Th col="estado" current={ordenColumna} dir={ordenDireccion} onClick={alternarOrden}>Estado</Th>
              <Th col="tiempo" current={ordenColumna} dir={ordenDireccion} onClick={alternarOrden}>Tiempo</Th>
              <th className="p-3 font-semibold">Cobrado</th>
              <Th col="subido" current={ordenColumna} dir={ordenDireccion} onClick={alternarOrden}>Subido</Th>
              <th className="p-3 font-semibold text-right">Acciones</th>
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
                const limitePalabras = proyectoActivo?.promedio_palabras || 3000;
                const pctGuion = Math.min(100, (v.palabras_guion / limitePalabras) * 100);

                return (
                  <tr key={v.id} className="border-b last:border-none transition-colors hover:bg-white/5" style={{ borderColor: 'var(--bios-border)' }}>
                    <td className="p-3 text-center font-bold" style={{ color: 'var(--bios-accent)' }}>
                      {String(v.numero_video).padStart(2, '0')}
                    </td>
                    <td className="p-3 font-semibold hidden md:table-cell" style={{ color: 'var(--bios-text)' }}>{v.nombre}</td>
                    <td className="p-3 hidden md:table-cell" style={{ color: 'var(--bios-text-dim)' }}>{v.fecha_recibido || '—'}</td>
                    <td className="p-3 font-bold" style={{ color: v.estado === 'listo' ? 'var(--bios-text-faint)' : 'var(--bios-warn)' }}>{v.fecha_entrega || '—'}</td>
                    <td className="p-3 w-[100px]">
                      <div className="text-[10px] mb-1" style={{ color: 'var(--bios-text-dim)' }}>{v.palabras_guion.toLocaleString()} pal.</div>
                      <div className="w-full h-[4px] rounded-full overflow-hidden" style={{ background: 'var(--bios-border)' }}><div className="h-full rounded-full transition-all" style={{ width: `${pctGuion}%`, background: 'var(--bios-accent)' }} /></div>
                    </td>
                    <td className="p-3">
                      <select value={v.estado} onChange={(e) => handleCambiarEstado(v.id, e.target.value as EstadoVideo)} className="text-[10px] font-bold px-2.5 py-1.5 rounded-full outline-none appearance-none cursor-pointer text-center" style={{ background: v.estado === 'listo' ? 'color-mix(in srgb, var(--bios-ok) 15%, transparent)' : v.estado === 'en_curso' ? 'color-mix(in srgb, var(--bios-warn) 15%, transparent)' : 'color-mix(in srgb, var(--bios-danger) 15%, transparent)', color: v.estado === 'listo' ? 'var(--bios-ok)' : v.estado === 'en_curso' ? 'var(--bios-warn)' : 'var(--bios-danger)' }}>
                        <option value="sin_empezar" className="bg-[#0f1626] text-white">Sin empezar</option>
                        <option value="en_curso" className="bg-[#0f1626] text-white">En curso</option>
                        <option value="listo" className="bg-[#0f1626] text-white">Listo</option>
                      </select>
                    </td>
                    <td className="p-3 font-medium" style={{ color: 'var(--bios-text-dim)' }}>{v.tiempo_trabajo || '—'}</td>
                    <td className="p-3 font-bold" style={{ color: 'var(--bios-text)' }}>${cobrado.toFixed(2)}</td>
                    <td className="p-3" style={{ color: 'var(--bios-text-dim)' }}>{v.fecha_subido || '—'}</td>
                    <td className="p-3 text-right">
                      <div className="flex gap-1 justify-end">
                        <BtnIcon icon={IconPencil} title="Editar" color="var(--bios-accent)" onClick={() => { setVideoAEditar(v); setModalVideoOpen(true); }} />
                        <BtnIcon icon={IconTrash} title="Eliminar" color="var(--bios-danger)" onClick={() => setVideoAEliminar(v)} />
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {proyectoActivoId && (
        <>
          <ModalVideo open={modalVideoOpen} onClose={() => setModalVideoOpen(false)} onSaved={cargarDatosProyecto} clienteId={clienteId} proyectoId={proyectoActivoId} videoAEditar={videoAEditar} nextVideoNumber={nextVideoNumber} />
          <ModalPago open={modalPagoOpen} onClose={() => setModalPagoOpen(false)} onSaved={cargarDatosProyecto} clienteId={clienteId} proyectoId={proyectoActivoId} />
          <ModalHistorialPagos open={modalHistorialOpen} onClose={() => setModalHistorialOpen(false)} pagos={pagos} onPagosChanged={cargarDatosProyecto} />
        </>
      )}

      <ModalProyecto 
        open={modalProyectoOpen} 
        onClose={() => setModalProyectoOpen(false)} 
        onSaved={async () => {
          const projs = await cargarProyectos();
          if (!proyectoActivoId && projs.length > 0) setProyectoActivoId(projs[0].id);
        }} 
        clienteId={clienteId} 
        proyectoAEditar={proyectoAEditar} 
      />

      <ConfirmModal open={!!videoAEliminar} title="Eliminar Video" description={`¿Estás seguro de que deseas eliminar este video?`} onCancel={() => setVideoAEliminar(null)} onConfirm={async () => { if (videoAEliminar) { await eliminarVideo(videoAEliminar.id); setVideoAEliminar(null); cargarDatosProyecto(); } }} isDanger={true} confirmText="Sí, eliminar" />
    </div>
  );
}

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
    <button onClick={onClick} className={`px-3 py-1.5 rounded-md text-[11.5px] font-semibold transition-all flex-shrink-0 ${active ? 'bg-white text-black shadow-sm' : 'text-white/60 hover:text-white hover:bg-white/10'}`}>
      {label}
    </button>
  );
}

function Th({ children, col, current, dir, onClick }: any) {
  return (
    <th onClick={() => onClick(col)} className="p-3 font-semibold cursor-pointer hover:bg-white/5 select-none transition-colors">
      {children} {current === col && <span className="text-[10px] text-white/70 ml-1">{dir === 'asc' ? '▲' : '▼'}</span>}
    </th>
  );
}

function BtnIcon({ icon: Icon, title, color = "var(--bios-text-dim)", onClick }: any) {
  return <button title={title} onClick={onClick} className="w-[26px] h-[26px] rounded-md border flex items-center justify-center hover:bg-white/10 transition-colors" style={{ borderColor: 'var(--bios-border)', color }}><Icon size={14} /></button>;
}