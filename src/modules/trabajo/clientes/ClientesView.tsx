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