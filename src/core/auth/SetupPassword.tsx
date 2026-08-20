import { useState, type FormEvent } from 'react';
import { setPassword } from './authService';

interface Props {
  onDone: () => void;
}

export function SetupPassword({ onDone }: Props) {
  const [password, setPasswordValue] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres.');
      return;
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    await setPassword(password);
    onDone();
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
        <h1 className="font-display font-bold text-[20px] tracking-[3px] mb-1">BIOS</h1>
        <p className="text-[11.5px] mb-5" style={{ color: 'var(--bios-text-dim)' }}>
          Primera vez aquí. Crea tu contraseña de acceso.
        </p>

        <label className="block text-[11px] mb-1" style={{ color: 'var(--bios-text-dim)' }}>
          Nueva contraseña
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPasswordValue(e.target.value)}
          className="w-full bg-white/5 border rounded-lg px-2.5 py-2 text-[12px] mb-3 outline-none focus:ring-2"
          style={{ borderColor: 'var(--bios-border)' }}
          autoFocus
        />

        <label className="block text-[11px] mb-1" style={{ color: 'var(--bios-text-dim)' }}>
          Confirmar contraseña
        </label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full bg-white/5 border rounded-lg px-2.5 py-2 text-[12px] mb-1 outline-none focus:ring-2"
          style={{ borderColor: 'var(--bios-border)' }}
        />

        {error && (
          <p className="text-[10.5px] mt-2" style={{ color: 'var(--bios-danger)' }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full mt-4 py-2 rounded-lg font-semibold text-[12px]"
          style={{
            background: 'linear-gradient(90deg, var(--bios-accent), var(--bios-accent-2))',
            color: '#0a1120',
          }}
        >
          Crear contraseña y entrar
        </button>
      </form>
    </div>
  );
}
