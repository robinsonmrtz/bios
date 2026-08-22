import { useEffect, useState, useMemo } from 'react';
import { IconArrowLeft, IconCash, IconPlus, IconFolder, IconPencil, IconTrash, IconExternalLink, IconChartBar } from '@tabler/icons-react';
import { getClientes, getProyectosByCliente, getVideosByProyecto, getPagosByProyecto, actualizarEstadoVideo, eliminarVideo } from '../services/trabajoService';
import type { Cliente, ProyectoTrabajo, VideoTrabajo, PagoTrabajo, EstadoVideo, ColumnaOrdenVideo, DireccionOrden } from '../types/trabajo.types';
import { ModalVideo } from './modals/ModalVideo';
import { ModalPago } from './modals/ModalPago';
import { ModalHistorialPagos } from './modals/ModalHistorialPagos';
import { ConfirmModal } from '../../../shared/components/ConfirmModal';

interface Props { clienteId: string; onBack: () => void; }

export function ClientePanel({ clienteId, onBack }: Props) {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [proyectos, setProyectos] = useState<ProyectoTrabajo[]>([]);
  const [proyectoActivoId, setProyectoActivoId] = useState<string | null>(null);
  const [videos, setVideos] = useState<VideoTrabajo[]>([]);
  const [pagos, setPagos] = useState<PagoTrabajo[]>([]);
  const [cargando, setCargando] = useState(true);

  const [modalVideoOpen, setModalVideoOpen] = useState(false);
  const [videoAEditar, setVideoAEditar] = useState<VideoTrabajo | null>(null);
  const [videoAEliminar, setVideoAEliminar] = useState<VideoTrabajo | null>(null);
  const [modalPagoOpen, setModalPagoOpen] = useState(false);
  const [modalHistorialOpen, setModalHistorialOpen] = useState(false);

  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'todos' | EstadoVideo>('todos');
  const [ordenColumna, setOrdenColumna] = useState<ColumnaOrdenVideo>('numero');
  const [ordenDireccion, setOrdenDireccion] = useState<DireccionOrden>('asc');

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

  async function cargarDatosProyecto() {
    if (!proyectoActivoId) return;
    setCargando(true);
    const [vids, pags] = await Promise.all([getVideosByProyecto(proyectoActivoId), getPagosByProyecto(proyectoActivoId)]);
    setVideos(vids); setPagos(pags);
    setCargando(false);
  }

  useEffect(() => { cargarDatosProyecto(); }, [proyectoActivoId]);

  const kpis = useMemo(() => {
    let ingMes = 0, totalPagado = 0, totalConsumido = 0, entregados = 0, pendientes = 0;
    const mesActual = new Date().getMonth(); const anoActual = new Date().getFullYear();

    pagos.forEach(p => { totalPagado += Number(p.monto); });
    videos.forEach(v => {
      const cobrado = Number(v.inversion || 0) + Number(v.bono || 0);
      if (v.estado === 'listo') {
        entregados++; totalConsumido += cobrado;
        const fechaRef = v.fecha_entrega || v.fecha_subido || v.fecha_pago || v.ultima_edicion;
        if (fechaRef) {
          const partes = fechaRef.split('T')[0].split('-');
          if (partes.length >= 3 && parseInt(partes[1], 10) - 1 === mesActual && parseInt(partes[0], 10) === anoActual) {
            ingMes += cobrado;
          }
        }
      } else { pendientes++; }
    });

    return { ingMes, entregados, pendientes, balance: totalPagado - totalConsumido };
  }, [videos, pagos]);

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

  const nextVideoNumber = videos.length > 0 ? Math.max(...videos.map(v => v.numero_video)) + 1 : 1;

  if (!cliente) return <div className="p-10 text-center">Cargando perfil...</div>;

  return (
    <div className="flex flex-col gap-5">
      <button onClick={onBack} className="flex items-center gap-2 text-[12px] w-fit hover:underline" style={{ color: 'var(--bios-text-faint)' }}>
        <IconArrowLeft size={14} /> Volver a clientes
      </button>

      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-[52px] h-[52px] rounded-full border flex items-center justify-center text-[18px] font-bold" style={{ borderColor: 'var(--bios-border)', background: 'rgba(255,255,255,0.05)' }}>
            {cliente.foto ? <img src={cliente.foto} className="w-full h-full rounded-full object-cover" /> : cliente.nombre.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="text-[20px] font-bold text-white leading-tight">{cliente.nombre}</h2>
            <p className="text-[12px]" style={{ color: 'var(--bios-text-dim)' }}>{proyectos.length} proyecto(s) · {cliente.pais || 'Sin país'}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <KpiMini label="Mes Actual" value={`$${kpis.ingMes.toFixed(2)}`} color="var(--bios-accent)" />
          <KpiMini label={kpis.balance < 0 ? "Consignación" : kpis.balance > 0 ? "A Favor" : "Balance"} value={`$${Math.abs(kpis.balance).toFixed(2)}`} color={kpis.balance < 0 ? "var(--bios-danger)" : kpis.balance > 0 ? "var(--bios-ok)" : "var(--bios-text)"} />
          <KpiMini label="Entregados" value={kpis.entregados} color="var(--bios-text)" />
          <KpiMini label="Pendientes" value={kpis.pendientes} color="var(--bios-text)" />
          <div className="flex gap-2 ml-2">
            <button onClick={() => setModalPagoOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-[11px] font-semibold transition-colors hover:bg-white/5" style={{ borderColor: 'var(--bios-ok)', color: 'var(--bios-ok)' }}>
              <IconCash size={14} /> Adelanto
            </button>
            <button onClick={() => setModalHistorialOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 border border-dashed rounded-lg text-[11px] font-semibold transition-colors hover:bg-white/5" style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text-dim)' }}>
              Historial
            </button>
            <button onClick={() => { setVideoAEditar(null); setModalVideoOpen(true); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-opacity hover:opacity-90" style={{ background: 'var(--bios-accent)', color: '#0a1120' }}>
              <IconPlus size={14} /> Video
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {proyectos.map(p => (
          <button key={p.id} onClick={() => setProyectoActivoId(p.id)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] border ${proyectoActivoId === p.id ? 'border-solid' : 'border-dashed'}`} style={{ borderColor: proyectoActivoId === p.id ? 'var(--bios-accent)' : 'var(--bios-border)', background: proyectoActivoId === p.id ? 'color-mix(in srgb, var(--bios-accent) 10%, transparent)' : 'transparent', color: proyectoActivoId === p.id ? 'var(--bios-accent)' : 'var(--bios-text-dim)' }}>
            <IconFolder size={14} /> {p.nombre} {proyectoActivoId === p.id && <IconPencil size={12} className="opacity-50 hover:opacity-100" />}
          </button>
        ))}
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] border border-dashed bg-transparent hover:bg-white/5" style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text-faint)' }}>
          <IconPlus size={14} /> Nuevo
        </button>
      </div>

      <div className="flex flex-wrap gap-3 items-center p-3 rounded-[10px] border" style={{ background: 'var(--bios-card-a)', borderColor: 'var(--bios-border)' }}>
        <input type="text" placeholder="Buscar video por título..." value={filtroTexto} onChange={(e) => setFiltroTexto(e.target.value)} className="flex-1 min-w-[200px] bg-black/20 border rounded-lg px-3 py-1.5 text-[12px] outline-none" style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text)' }} />
        <div className="flex gap-1.5">
          <PillFilter active={filtroEstado === 'todos'} onClick={() => setFiltroEstado('todos')} label="Todo" />
          <PillFilter active={filtroEstado === 'sin_empezar'} onClick={() => setFiltroEstado('sin_empezar')} label="Sin empezar" />
          <PillFilter active={filtroEstado === 'en_curso'} onClick={() => setFiltroEstado('en_curso')} label="En curso" />
          <PillFilter active={filtroEstado === 'listo'} onClick={() => setFiltroEstado('listo')} label="Listo" />
        </div>
      </div>

      <div className="overflow-x-auto rounded-[10px] border" style={{ borderColor: 'var(--bios-border)' }}>
        <table className="w-full text-left text-[12px] whitespace-nowrap border-collapse">
          <thead>
            <tr className="border-b bg-black/20" style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text-faint)' }}>
              <Th col="numero" current={ordenColumna} dir={ordenDireccion} onClick={alternarOrden}>#</Th>
              <Th col="nombre" current={ordenColumna} dir={ordenDireccion} onClick={alternarOrden}>Nombre del video</Th>
              <th className="p-2.5 font-semibold">Recibido</th>
              <Th col="entrega" current={ordenColumna} dir={ordenDireccion} onClick={alternarOrden}>Entrega</Th>
              <Th col="guion" current={ordenColumna} dir={ordenDireccion} onClick={alternarOrden}>Guion</Th>
              <Th col="estado" current={ordenColumna} dir={ordenDireccion} onClick={alternarOrden}>Estado</Th>
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
                    <td className="p-2.5 text-center font-bold" style={{ color: 'var(--bios-accent)' }}>{String(v.numero_video).padStart(2, '0')}</td>
                    <td className="p-2.5 font-semibold" style={{ color: 'var(--bios-text)' }}>{v.nombre}</td>
                    <td className="p-2.5" style={{ color: 'var(--bios-text-dim)' }}>{v.fecha_recibido || '—'}</td>
                    <td className="p-2.5 font-bold" style={{ color: v.estado === 'listo' ? 'var(--bios-text-faint)' : 'var(--bios-warn)' }}>{v.fecha_entrega || '—'}</td>
                    <td className="p-2.5 w-[100px]">
                      <div className="text-[10px] mb-1" style={{ color: 'var(--bios-text-dim)' }}>{v.palabras_guion.toLocaleString()} pal.</div>
                      <div className="w-full h-[4px] rounded-full overflow-hidden" style={{ background: 'var(--bios-border)' }}><div className="h-full rounded-full transition-all" style={{ width: `${pctGuion}%`, background: 'var(--bios-accent)' }} /></div>
                    </td>
                    <td className="p-2.5">
                      <select value={v.estado} onChange={(e) => handleCambiarEstado(v.id, e.target.value as EstadoVideo)} className="text-[10px] font-bold px-2.5 py-1 rounded-full outline-none appearance-none cursor-pointer text-center" style={{ background: v.estado === 'listo' ? 'color-mix(in srgb, var(--bios-ok) 15%, transparent)' : v.estado === 'en_curso' ? 'color-mix(in srgb, var(--bios-warn) 15%, transparent)' : 'color-mix(in srgb, var(--bios-danger) 15%, transparent)', color: v.estado === 'listo' ? 'var(--bios-ok)' : v.estado === 'en_curso' ? 'var(--bios-warn)' : 'var(--bios-danger)' }}>
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

      <ConfirmModal
        open={!!videoAEliminar}
        title="Eliminar Video"
        description={`¿Estás seguro de que deseas eliminar el video "${videoAEliminar?.nombre}"? Esta acción no se puede deshacer.`}
        onCancel={() => setVideoAEliminar(null)}
        onConfirm={async () => {
           if (videoAEliminar) { await eliminarVideo(videoAEliminar.id); setVideoAEliminar(null); cargarDatosProyecto(); }
        }}
        isDanger={true}
        confirmText="Sí, eliminar video"
      />
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
  return <button onClick={onClick} className="px-3 py-1 rounded-full text-[11px] font-semibold border transition-colors" style={{ background: active ? 'var(--bios-text)' : 'transparent', borderColor: active ? 'var(--bios-text)' : 'var(--bios-border)', color: active ? '#000' : 'var(--bios-text-dim)' }}>{label}</button>;
}
function Th({ children, col, current, dir, onClick }: any) {
  return <th onClick={() => onClick(col)} className="p-2.5 font-semibold cursor-pointer hover:bg-white/5 select-none">{children} {current === col && <span className="text-[10px]" style={{ color: 'var(--bios-accent)' }}>{dir === 'asc' ? '▲' : '▼'}</span>}</th>;
}
function BtnIcon({ icon: Icon, title, color = "var(--bios-text-dim)", onClick }: any) {
  return <button title={title} onClick={onClick} className="w-[26px] h-[26px] rounded-md border flex items-center justify-center hover:bg-white/10 transition-colors" style={{ borderColor: 'var(--bios-border)', color }}><Icon size={14} /></button>;
}