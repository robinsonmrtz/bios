# Contrato de desarrollo del proyecto

> Este archivo se incluye automáticamente en cada escaneo para que cualquier
> LLM entienda las reglas del proyecto antes de tocar código. Complétalo con
> tus convenciones reales.

## Stack
- React + TypeScript + Tailwind CSS + IndexedDB

## Convenciones de módulos
- Cada módulo vive en `src/modules/<nombre>` y es independiente.
- El código compartido entre módulos vive en `src/shared`, `src/hooks`, `src/lib`, `src/types`.
- (Agrega aquí tus reglas de nombres, estructura interna de cada módulo, patrones de estado, etc.)

## Estilo de código
- (Ej: componentes funcionales, hooks personalizados con prefijo use..., etc.)

## Reglas de IndexedDB
- (Ej: cada módulo define su propio store, nomenclatura de las bases, migraciones, etc.)
