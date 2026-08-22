import { useEffect, useState, useMemo } from 'react';
import { IconPlus, IconTrendingUp, IconVideo, IconClock, IconUsers, IconPencil, IconTrash, IconEye } from '@tabler/icons-react';
import { getClientes, getAllVideos, getAllPagos, eliminarCliente } from '../services/trabajoService';
import type { Cliente, VideoTrabajo, PagoTrabajo, StatClienteSummary } from '../types/trabajo.types';
import { ModalCliente } from './modals/ModalCliente';
import { ClientePanel } from './ClientePanel';
import { MonthSelector } from '../../../shared/components/MonthSelector';
import { ConfirmModal } from '../../../shared/components/ConfirmModal';

export function ClientesView() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [videos, setVideos] = useState<VideoTrabajo[]>([]);
  const [pagos, setPagos] = useState<PagoTrabajo[]>([]);
  const [cargando, setCargando] = useState(true);
  
  const [clienteActivoId, setClienteActivoId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clienteAEditar, setClienteAEditar] = useState<Cliente | null>(null);
  const [clienteAEliminar, setClienteAEliminar] = useState<Cliente | null>(null);

  const [mesActual, setMesActual] = useState(new Date());

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
      const [cli, vid, pag] = await Promise.all([getClientes(), getAllVideos(), getAllPagos()]);
      setClientes(cli); setVideos(vid); setPagos(pag);
    } catch (error) { console.error("Error", error); } finally { setCargando(false); }
  }

  useEffect(() => { cargarDatos(); }, []);

  const stats = useMemo(() => {
    const mesFiltro = mesActual.getMonth();
    const anoFiltro = mesActual.getFullYear();
    let globalIngresos = 0, globalEntregados = 0, globalPendientes = 0, clientesActivos = 0;

    const listaStats: StatClienteSummary[] = clientes.map(cliente => {
      const videosCli = videos.filter(v => v.cliente_id === cliente.id);
      const pagosCli = pagos.filter(p => p.cliente_id === cliente.id);

      let ingMesAct = 0, pendientes = 0, totalPagado = 0, totalConsumido = 0;
      pagosCli.forEach(p => { totalPagado += Number(p.monto); });

      videosCli.forEach(v => {
        const cobrado = Number(v.inversion || 0) + Number(v.bono || 0);
        if (v.estado === 'listo') {
          totalConsumido += cobrado;
          const fechaRef = v.fecha_entrega || v.fecha_subido || v.fecha_pago || v.ultima_edicion;
          if (fechaRef) {
            const partes = fechaRef.split('T')[0].split('-');
            if (partes.length >= 3 && parseInt(partes[1], 10) - 1 === mesFiltro && parseInt(partes[0], 10) === anoFiltro) {
              ingMesAct += cobrado; globalIngresos += cobrado; globalEntregados++;
            }
          }
        } else {
          pendientes++; globalPendientes++;
        }
      });

      const balance = totalPagado - totalConsumido;
      const inactivo = pendientes === 0 && ingMesAct === 0; 
      if (!inactivo) clientesActivos++;

      return {
        ...cliente, totalVideos: videosCli.length, pendientes, sinEmpezar: 0, enCurso: 0,
        ingMesAct, balance, inactivo, tendenciaClase: ingMesAct > 0 ? 'sube' : '',
        tendenciaTexto: 'Mes actual', textoComparativo: ''
      };
    });

    listaStats.sort((a, b) => b.ingMesAct - a.ingMesAct);
    return { lista: listaStats, globalIngresos, globalEntregados, globalPendientes, clientesActivos };
  }, [clientes, videos, pagos, mesActual]);

  if (clienteActivoId) return <ClientePanel clienteId={clienteActivoId} onBack={() => setClienteActivoId(null)} />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[18px] font-display font-bold text-gray-900">Portafolio de Clientes</h2>
          <p className="text-[12px] text-gray-500">Gestiona tus ingresos y entregas activas.</p>
        </div>
        <button
          onClick={() => { setClienteAEditar(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-[12px] text-[13px] font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
        >
          <IconPlus size={16} /> Nuevo Cliente
        </button>
      </div>

      <MonthSelector mes={mesActual} onAnterior={() => moverMes(-1)} onSiguiente={() => moverMes(1)} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard title="Ingresos del Mes" value={`$${stats.globalIngresos.toFixed(2)}`} icon={IconTrendingUp} color="#16a34a" />
        <KpiCard title="Videos Entregados" value={stats.globalEntregados} icon={IconVideo} color="#2563eb" />
        <KpiCard title="Trabajos Pendientes" value={stats.globalPendientes} icon={IconClock} color="#d97706" />
        <KpiCard title="Clientes Activos" value={stats.clientesActivos} icon={IconUsers} color="#9333ea" />
      </div>

      {cargando ? (
        <div className="text-center py-10 text-[12px] text-gray-400">Cargando clientes...</div>
      ) : stats.lista.length === 0 ? (
        <div className="rounded-[16px] border border-dashed border-gray-300 bg-white p-10 text-center flex flex-col items-center justify-center">
          <IconUsers size={32} className="text-gray-300 mb-2" />
          <span className="text-[13px] text-gray-500">No tienes clientes aún.</span>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {stats.lista.map(c => (
            <div
              key={c.id}
              className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-[16px] border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-all"
            >
              {/* Izquierda: Avatar, Nombre y Proyecto */}
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <div className="w-12 h-12 rounded-full flex-shrink-0 border border-gray-200 overflow-hidden flex items-center justify-center font-bold text-[14px] bg-gray-50 text-gray-700">
                  {c.foto ? <img src={c.foto} className="w-full h-full object-cover" alt={c.nombre} /> : c.nombre.substring(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-[14px] text-gray-900 truncate flex items-center gap-1.5">
                    {c.nombre} {c.pais && <span className="text-[12px] font-normal text-gray-400">({c.pais})</span>}
                  </div>
                  <div className="text-[12px] text-gray-500 truncate">
                    {c.proyecto || 'Edición de video y animación'}
                  </div>
                </div>
              </div>

              {/* Derecha: Columnas perfectamente alineadas con anchos fijos */}
              <div className="flex flex-wrap md:flex-nowrap items-center justify-between md:justify-end gap-6 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                
                {/* Columna 1: Ingresos / Balance (Ancho fijo) */}
                <div className="w-36 text-left md:text-right">
                  <div className="font-bold text-[15px] text-gray-900">${c.ingMesAct.toFixed(2)}</div>
                  {c.balance > 0 ? (
                    <div className="text-[11px] font-semibold text-red-500 truncate">Consignación: ${c.balance.toFixed(2)}</div>
                  ) : c.balance < 0 ? (
                    <div className="text-[11px] font-semibold text-green-600 truncate">A favor: ${Math.abs(c.balance).toFixed(2)}</div>
                  ) : (
                    <div className="text-[11px] text-gray-400 truncate">Balance al día</div>
                  )}
                </div>

                {/* Columna 2: Conteo de videos (Ancho fijo) */}
                <div className="w-24 text-center">
                  <div className="font-bold text-[15px] text-gray-900">{c.totalVideos}</div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wide">videos totales</div>
                </div>

                {/* Columna 3: Estado / Badge (Ancho fijo) */}
                <div className="w-32 flex justify-center">
                  {c.inactivo ? (
                    <Badge text="Inactivo" color="gray" />
                  ) : c.pendientes === 0 ? (
                    <Badge text="Al día" color="green" />
                  ) : (
                    <Badge text={`${c.pendientes} pendientes`} color={c.pendientes > 2 ? 'red' : 'orange'} />
                  )}
                </div>

                {/* Columna 4: Botones de Acción */}
                <div className="flex items-center gap-1.5 ml-auto md:ml-0">
                  <button 
                    onClick={() => setClienteActivoId(c.id)} 
                    title="Ver panel" 
                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <IconEye size={16} />
                  </button>
                  <button 
                    onClick={() => { setClienteAEditar(c); setIsModalOpen(true); }} 
                    title="Editar cliente" 
                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <IconPencil size={16} />
                  </button>
                  <button 
                    onClick={() => setClienteAEliminar(c)} 
                    title="Eliminar cliente" 
                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <IconTrash size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ModalCliente open={isModalOpen} clienteAEditar={clienteAEditar} onClose={() => setIsModalOpen(false)} onSaved={cargarDatos} />
      
      <ConfirmModal
        open={!!clienteAEliminar}
        title="Eliminar Cliente"
        description={`¿Estás seguro de que deseas eliminar a ${clienteAEliminar?.nombre}? Se borrarán permanentemente sus proyectos y su historial.`}
        onCancel={() => setClienteAEliminar(null)}
        onConfirm={async () => {
           if(clienteAEliminar) { await eliminarCliente(clienteAEliminar.id); setClienteAEliminar(null); cargarDatos(); }
        }}
        isDanger={true}
        confirmText="Sí, eliminar cliente"
      />
    </div>
  );
}

function KpiCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="rounded-[16px] border border-gray-200 bg-white p-4 flex flex-col relative overflow-hidden shadow-sm">
      <div className="absolute top-0 left-0 w-full h-[3px]" style={{ background: color }} />
      <div className="flex items-center gap-2 mb-2">
        <Icon size={16} style={{ color }} />
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">{title}</span>
      </div>
      <div className="font-display font-bold text-[24px] text-gray-900">{value}</div>
    </div>
  );
}

function Badge({ text, color }: { text: string; color: string }) {
  const colorStyles: Record<string, string> = {
    green: 'bg-green-50 text-green-700 border-green-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    orange: 'bg-amber-50 text-amber-700 border-amber-200',
    gray: 'bg-gray-100 text-gray-600 border-gray-200',
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide border whitespace-nowrap ${colorStyles[color] || colorStyles.gray}`}>
      {text.toUpperCase()}
    </span>
  );
}