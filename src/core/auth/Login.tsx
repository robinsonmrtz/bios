import { useState, type FormEvent } from 'react';
import { verifyPassword, markSessionAuthenticated } from './authService';

interface Props {
  onSuccess: () => void;
}

export function Login({ onSuccess }: Props) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setChecking(true);

    const ok = await verifyPassword(password);
    setChecking(false);

    if (!ok) {
      setError('Contraseña incorrecta.');
      setPassword('');
      return;
    }

    markSessionAuthenticated();
    onSuccess();
  }

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center px-5">
      <form
        onSubmit={handleSubmit}
        className="w-[280px] rounded-[14px] p-5 border text-left"
        style={{
          background: 'linear-gradient(160deg, var(--bios-card-a), var(--bios-card-b))',
          borderColor: 'var(--bios-border)',
        }}
      >
        <h1 className="font-display font-bold text-[20px] tracking-[3px] mb-1 text-center">
          BIOS
        </h1>
        <p className="text-[11.5px] mb-5 text-center" style={{ color: 'var(--bios-text-dim)' }}>
          Acceso protegido
        </p>

        <label className="block text-[11px] mb-1" style={{ color: 'var(--bios-text-dim)' }}>
          Contraseña
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-white/5 border rounded-lg px-2.5 py-2 text-[12px] mb-1 outline-none focus:ring-2"
          style={{ borderColor: 'var(--bios-border)' }}
          autoFocus
        />

        {error && (
          <p className="text-[10.5px] mt-2" style={{ color: 'var(--bios-danger)' }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={checking}
          className="w-full mt-4 py-2 rounded-lg font-semibold text-[12px] disabled:opacity-60"
          style={{
            background: 'linear-gradient(90deg, var(--bios-accent), var(--bios-accent-2))',
            color: '#0a1120',
          }}
        >
          {checking ? 'Verificando…' : 'Desbloquear'}
        </button>
      </form>
    </div>
  );
}
