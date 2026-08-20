import { supabase } from '../db/supabase';

export async function iniciarSesion(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

// Mismo nombre que ya usa tu TopBar.tsx — no hace falta tocar ese archivo.
export async function clearSession() {
  await supabase.auth.signOut();
}

export async function haySesionActiva(): Promise<boolean> {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
}