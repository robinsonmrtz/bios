import { supabase } from './supabase';

export interface Cuenta {
  id?: string;
  nombre: string;
  saldo_inicial: number;
  tipo: string;
  color?: string;
  logo?: string;
  incluir_dashboard?: boolean;
}

/**
 * Obtener todas las cuentas desde Supabase
 */
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

/**
 * Guardar/Crear una nueva cuenta en Supabase
 */
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

/**
 * Eliminar una cuenta de Supabase
 */
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