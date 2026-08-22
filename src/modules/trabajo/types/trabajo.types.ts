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

export type ColumnaOrdenVideo = 'numero' | 'nombre' | 'entrega' | 'guion' | 'tiempo' | 'subido' | 'estado';
export type DireccionOrden = 'asc' | 'desc';