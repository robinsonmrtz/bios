import {
  IconLayoutDashboard,
  IconUsers,
  IconFolder,
  IconCalculator,
  IconCheckbox,
} from '@tabler/icons-react';
import { ModuleNav, type ModuleNavItem } from '../../shared/components/ModuleNav';

const TABS: ModuleNavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: IconLayoutDashboard },
  { id: 'clientes', label: 'Clientes', icon: IconUsers },
  { id: 'proyectos', label: 'Proyectos', icon: IconFolder },
  { id: 'contabilidad', label: 'Contabilidad', icon: IconCalculator },
  { id: 'tareas', label: 'Tareas', icon: IconCheckbox },
];

interface Props {
  active: string;
  onChange: (id: string) => void;
}

export function TrabajoNav({ active, onChange }: Props) {
  // No usamos "moreItems" por ahora, caben perfectamente en la barra principal
  return <ModuleNav items={TABS} activeId={active} onChange={onChange} />;
}