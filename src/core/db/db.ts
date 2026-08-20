import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

/**
 * Base de datos local de Bios.
 * Todo vive en el navegador/dispositivo del usuario — nunca sale a internet.
 *
 * Cada módulo nuevo que se cree (Finanzas, Salud, etc.) agrega su propio
 * "object store" aquí mismo, respetando este único archivo como fuente
 * de verdad del esquema de datos.
 */

interface BiosDBSchema extends DBSchema {
  settings: {
    key: string;
    value: unknown;
  };
}

const DB_NAME = 'bios-db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<BiosDBSchema>> | null = null;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<BiosDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings');
        }
      },
    });
  }
  return dbPromise;
}

export async function dbGet<T>(key: string): Promise<T | undefined> {
  const db = await getDB();
  return db.get('settings', key) as Promise<T | undefined>;
}

export async function dbSet<T>(key: string, value: T): Promise<void> {
  const db = await getDB();
  await db.put('settings', value, key);
}

export async function dbDelete(key: string): Promise<void> {
  const db = await getDB();
  await db.delete('settings', key);
}
