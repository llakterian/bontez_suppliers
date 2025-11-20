import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import { useState, useEffect } from 'react';

export interface PendingSale {
  id: string;
  clientId: number;
  supplierId?: number;
  items: Array<{
    productId: number;
    quantity: number;
    unitPrice: number;
  }>;
  paymentMethod: string;
  mpesaCode?: string;
  notes?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  timestamp: number;
  synced: boolean;
}

interface BontezDB extends DBSchema {
  pendingSales: {
    key: string;
    value: PendingSale;
  };
}

const DB_NAME = 'BontezSuppliersDB';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<BontezDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<BontezDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<BontezDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create pending sales store
      if (!db.objectStoreNames.contains('pendingSales')) {
        db.createObjectStore('pendingSales', { keyPath: 'id' });
      }
    },
  });

  return dbInstance;
}

export async function savePendingSale(sale: Omit<PendingSale, 'id' | 'synced' | 'timestamp'>): Promise<string> {
  const db = await getDB();
  const id = `sale_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const pendingSale: PendingSale = {
    ...sale,
    id,
    synced: false,
    timestamp: Date.now(),
  };

  await db.add('pendingSales', pendingSale);
  return id;
}

export async function getPendingSales(): Promise<PendingSale[]> {
  const db = await getDB();
  return await db.getAll('pendingSales');
}

export async function getUnsyncedSales(): Promise<PendingSale[]> {
  const db = await getDB();
  const allSales = await db.getAll('pendingSales');
  return allSales.filter(sale => !sale.synced);
}

export async function markSaleAsSynced(id: string): Promise<void> {
  const db = await getDB();
  const sale = await db.get('pendingSales', id);
  
  if (sale) {
    sale.synced = true;
    await db.put('pendingSales', sale);
  }
}

export async function deleteSyncedSales(): Promise<void> {
  const db = await getDB();
  const allSales = await db.getAll('pendingSales');
  const syncedSales = allSales.filter(sale => sale.synced);
  
  const tx = db.transaction('pendingSales', 'readwrite');
  for (const sale of syncedSales) {
    await tx.store.delete(sale.id);
  }
  await tx.done;
}

export async function clearAllPendingSales(): Promise<void> {
  const db = await getDB();
  await db.clear('pendingSales');
}

export function isOnline(): boolean {
  return navigator.onLine;
}

// Hook for online status
export function useOnlineStatus(): boolean {
  if (typeof window === 'undefined') return true;
  
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return online;
}
