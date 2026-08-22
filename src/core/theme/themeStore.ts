import { supabase } from '../db/supabase';

export interface ThemeSettings {
  bgColor: string;
  menuColor: string;
  sharpCorners: boolean;
}

const DEFAULTS: ThemeSettings = {
  bgColor: '#ffffff',
  menuColor: '#21232f',
  sharpCorners: true,
};

/** Trae el tema guardado del usuario logueado. Si no hay sesión o no tiene
 * fila todavía, devuelve los valores por defecto (sin crear nada en la DB). */
export async function cargarTema(): Promise<ThemeSettings> {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return DEFAULTS;

  const { data, error } = await supabase
    .from('perfil_configuracion')
    .select('bg_color, menu_color, sharp_corners')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error || !data) return DEFAULTS;

  return {
    bgColor: data.bg_color,
    menuColor: data.menu_color,
    sharpCorners: data.sharp_corners,
  };
}

/** Aplica el tema a las variables CSS reales del documento. */
export function aplicarTema(tema: ThemeSettings) {
  const root = document.documentElement;
  root.style.setProperty('--bios-bg', tema.bgColor);
  root.style.setProperty('--bios-sidebar-base', tema.menuColor);
  root.classList.toggle('bios-sharp-corners', tema.sharpCorners);
}

/** Aplica de inmediato (sin esperar la red) Y guarda en Supabase. */
export async function guardarTema(tema: ThemeSettings): Promise<void> {
  aplicarTema(tema);

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return;

  await supabase.from('perfil_configuracion').upsert(
    {
      user_id: user.id,
      bg_color: tema.bgColor,
      menu_color: tema.menuColor,
      sharp_corners: tema.sharpCorners,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  );
}