import { useState, type FormEvent, type ReactNode } from 'react';
import { authService } from './authService';

interface AuthGateProps {
  children: ReactNode;
}

interface LoginProps {
  onSuccess: () => void;
}

export function AuthGate({ children }: AuthGateProps) {
  const [authenticated, setAuthenticated] = useState(authService.isAuthenticated());

  if (!authenticated) {
    return <Login onSuccess={() => setAuthenticated(true)} />;
  }

  return <>{children}</>;
}

function Login({ onSuccess }: LoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (authService.verifyPassword(password)) {
      authService.setAuthenticated(true);
      onSuccess();
      return;
    }

    setError(true);
    setPassword('');
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#0f172a',
      color: '#fff',
      fontFamily: 'sans-serif',
    }}>
      <form onSubmit={handleSubmit} style={{
        background: '#1e293b',
        padding: '2.5rem',
        borderRadius: '1rem',
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}>
        <h2 style={{ textAlign: 'center', margin: '0 0 1rem 0' }}>Acceso Protegido</h2>

        <label style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
          Contraseña Maestra
          <input
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError(false);
            }}
            placeholder="Ingresa tu contraseña"
            autoFocus
            style={{
              display: 'block',
              width: '100%',
              boxSizing: 'border-box',
              marginTop: '0.5rem',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: error ? '1px solid #ef4444' : '1px solid #334155',
              background: '#0f172a',
              color: '#fff',
              fontSize: '1rem',
              outline: 'none',
            }}
          />
        </label>

        {error && (
          <span style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'center' }}>
            Contraseña incorrecta
          </span>
        )}

        <button type="submit" style={{
          padding: '0.75rem',
          borderRadius: '0.5rem',
          border: 'none',
          background: '#3b82f6',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '1rem',
          cursor: 'pointer',
          marginTop: '0.5rem',
        }}>
          Entrar
        </button>
      </form>
    </div>
  );
}
