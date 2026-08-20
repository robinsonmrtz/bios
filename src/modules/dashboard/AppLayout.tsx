import { useState, type ReactNode } from 'react';
import { Sidebar } from '../../shared/components/Sidebar';
import { MobileDrawer } from '../../shared/components/MobileDrawer';
import { TopBar } from './TopBar';

interface Props {
  children: ReactNode;
  activeModule: string;
  onSelectModule: (moduleId: string) => void;
}

export function AppLayout({ children, activeModule, onSelectModule }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="relative z-10 flex min-h-screen">
      <Sidebar activeId={activeModule} onSelect={onSelectModule} />
      <MobileDrawer
        open={drawerOpen}
        activeId={activeModule}
        onSelect={onSelectModule}
        onClose={() => setDrawerOpen(false)}
      />

      <div className="flex-1 min-w-0">
        <TopBar onMenuClick={() => setDrawerOpen(true)} />
        {children}
      </div>
    </div>
  );
}
