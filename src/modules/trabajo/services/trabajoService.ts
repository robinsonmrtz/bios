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