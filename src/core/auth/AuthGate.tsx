import { useEffect, useState, type ReactNode } from 'react';
import { authService } from './authService';
import { Login } from './Login';

type Stage = 'loading' | 'login' | 'authenticated';

interface Props {
  children: ReactNode;
}

export function AuthGate({ children }: Props) {
  const [stage, setStage] = useState<Stage>('loading');

  useEffect(() => {
    // Verificamos directamente si la sesión ya está activa en el navegador
    if (authService.isAuthenticated()) {
      setStage('authenticated');
    } else {
      setStage('login');
    }
  }, []);

  if (stage === 'loading') {
    return null;
  }

  if (stage === 'login') {
    return <Login onSuccess={() => setStage('authenticated')} />;
  }

  return <>{children}</>;
}