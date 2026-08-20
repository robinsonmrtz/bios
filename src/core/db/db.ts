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