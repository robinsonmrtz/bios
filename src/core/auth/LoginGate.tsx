import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { supabase } from '../db/supabase';

/**
 * Envuelve TODA la app. Mientras no haya una sesión de Supabase Auth activa,
 * muestra el formulario de login y no renderiza `children`.
 *
 * Uso en main.tsx:
 *   <LoginGate>
 *     <App />
 *   </LoginGate>
 */
export function LoginGate({ children }: { children: ReactNode }) {
  const [cargando, setCargando] = useState(true);
  const [autenticado, setAutenticado] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAutenticado(!!data.session);
      setCargando(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setAutenticado(!!session);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError('');
    setEnviando(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setEnviando(false);
    if (error) setError('Correo o contraseña incorrectos.');
  }

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ color: 'var(--bios-text-dim)' }}>
        Cargando...
      </div>
    );
  }

  if (!autenticado) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-[320px] rounded-[16px] border p-6 flex flex-col gap-3"
          style={{
            background: 'linear-gradient(160deg, var(--bios-card-a), var(--bios-card-b))',
            borderColor: 'var(--bios-border)',
          }}
        >
          <div
            className="w-9 h-9 rounded-full mx-auto mb-1"
            style={{
              background:
                'radial-gradient(circle at 35% 30%, #cdeeff, var(--bios-accent) 45%, var(--bios-accent-2) 90%)',
              boxShadow: '0 0 14px var(--bios-accent-glow)',
            }}
          />
          <h1 className="text-center font-display font-bold text-[15px] mb-1">BIOS</h1>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo"
            autoComplete="username"
            className="px-3 py-2.5 rounded-lg border text-[13px] bg-black/20 outline-none"
            style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text)' }}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            autoComplete="current-password"
            className="px-3 py-2.5 rounded-lg border text-[13px] bg-black/20 outline-none"
            style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text)' }}
          />

          {error && (
            <p className="text-[11.5px]" style={{ color: 'var(--bios-danger)' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="mt-1 py-2.5 rounded-lg text-[13px] font-semibold disabled:opacity-50"
            style={{ background: 'var(--bios-accent)', color: '#0a1120' }}
          >
            {enviando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}