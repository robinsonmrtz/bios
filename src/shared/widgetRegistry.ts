import { lazy } from 'react';

export type WidgetContext = 'dashboard-main' | 'finanzas-resumen' | 'finanzas-cuentas';

export interface WidgetDefinition {
  id: string; // El ID del "molde"
  moduleId: string;
  allowedContexts: WidgetContext[];
  defaultColSpan: 1 | 2;
  defaultRowSpan: 1 | 2;
  component: React.ComponentType<any>;
}

const CuentaWidget = lazy(() => import('../modules/finanzas/widgets/CuentaWidget'));

export const WIDGET_REGISTRY: WidgetDefinition[] = [
  {
    id: 'finanzas-cuenta', // Este es el molde para TODAS las cuentas
    moduleId: 'finanzas',
    allowedContexts: ['dashboard-main', 'finanzas-resumen', 'finanzas-cuentas'],
    defaultColSpan: 1,
    defaultRowSpan: 1,
    component: CuentaWidget,
  }
];