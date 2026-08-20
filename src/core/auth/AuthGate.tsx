import { useEffect, useState, type ReactNode } from 'react';
import { hasPassword, isSessionAuthenticated } from './authService';
import { SetupPassword } from './SetupPassword';
import { Login } from './Login';

type Stage = 'loading' | 'setup' | 'login' | 'authenticated';

interface Props {
  children: ReactNode;
}

export function AuthGate({ children }: Props) {
  const [stage, setStage] = useState<Stage>('loading');

  useEffect(() => {
    (async () => {
      if (isSessionAuthenticated()) {
        setStage('authenticated');
        return;
      }
      const exists = await hasPassword();
      setStage(exists ? 'login' : 'setup');
    })();
  }, []);

  if (stage === 'loading') {
    return null;
  }

  if (stage === 'setup') {
    return <SetupPassword onDone={() => setStage('authenticated')} />;
  }

  if (stage === 'login') {
    return <Login onSuccess={() => setStage('authenticated')} />;
  }

  return <>{children}</>;
}
