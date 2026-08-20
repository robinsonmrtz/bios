import {
  IconGrid,
  IconBank,
  IconSwap,
  IconCard,
  IconPieChart,
  IconReport,
  IconTarget,
  IconTags,
  IconBuildingStore,
  IconCalendar,
  IconStar,
} from '../../shared/icons';
import { ModuleNav, type ModuleNavItem } from '../../shared/components/ModuleNav';

// Pestañas siempre visibles
const TABS: ModuleNavItem[] = [
  { id: 'resumen', label: 'Resumen', icon: IconGrid },
  { id: 'cuentas', label: 'Cuentas', icon: IconBank },
  { id: 'transacciones', label: 'Transacciones', icon: IconSwap },
  { id: 'tarjetas', label: 'Tarjetas', icon: IconCard },
  { id: 'presupuestos', label: 'Presupuestos', icon: IconPieChart },
  { id: 'informes', label: 'Informes', icon: IconReport },
];

// Pestañas escondidas detrás de "Más"
const MORE_TABS: ModuleNavItem[] = [
  { id: 'objetivos', label: 'Objetivos', icon: IconTarget },
  { id: 'categorias', label: 'Categorías', icon: IconTags },
  { id: 'comercios', label: 'Comercios', icon: IconBuildingStore },
  { id: 'calendario', label: 'Calendario', icon: IconCalendar },
  { id: 'actuacion', label: 'Mi Actuación', icon: IconStar },
];

interface Props {
  active: string;
  onChange: (id: string) => void;
}

export function FinanzasNav({ active, onChange }: Props) {
  return <ModuleNav items={TABS} moreItems={MORE_TABS} activeId={active} onChange={onChange} />;
}