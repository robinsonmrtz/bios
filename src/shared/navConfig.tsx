import { IconHome, IconBank } from './icons';

export interface NavItem {
  id: string;
  label: string;
  icon: typeof IconHome;
}

/**
 * Cada módulo nuevo que se cree se agrega aquí. La barra lateral y el
 * drawer móvil leen de esta misma lista, así nunca se desincronizan.
 */
export const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: IconHome },
  { id: 'finanzas', label: 'Finanzas', icon: IconBank },
];