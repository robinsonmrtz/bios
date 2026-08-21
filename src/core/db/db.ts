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