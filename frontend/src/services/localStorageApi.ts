/**
 * Local Storage API Service
 * Provides full API functionality using localStorage for Netlify deployment
 * Data persists on user's phone for testing without backend
 * 
 * Built by Llakterian | llakterian@gmail.com
 */

import type { Client, Supplier, Sale, Product } from '../types';

// Storage keys
const STORAGE_KEYS = {
  CLIENTS: 'bontez_clients',
  SUPPLIERS: 'bontez_suppliers',
  SALES: 'bontez_sales',
  PRODUCTS: 'bontez_products',
  ACCESSORIES: 'bontez_accessories',
  INITIALIZED: 'bontez_initialized',
};

// Helper to get data from localStorage
function getStorageData<T>(key: string, defaultValue: T[] = []): T[] {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
}

// Helper to set data to localStorage
function setStorageData<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
  }
}

// Initialize with sample data on first use
function initializeSampleData(): void {
  const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  
  if (!initialized) {
    // Sample clients
    const sampleClients: Client[] = [
      {
        id: 1,
        name: 'John Kamau',
        phone: '0712345678',
        email: 'john@example.com',
        address: 'Nairobi CBD',
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        name: 'Sarah Mwangi',
        phone: '0723456789',
        email: 'sarah@example.com',
        address: 'Westlands, Nairobi',
        created_at: new Date().toISOString(),
      },
    ];

    // Sample suppliers
    const sampleSuppliers: Supplier[] = [
      {
        id: 1,
        name: 'Top Gas Kenya',
        color: '#dc2626',
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        name: 'K-Gas Distributors',
        color: '#000000',
        created_at: new Date().toISOString(),
      },
    ];

    // Sample products
    const sampleProducts: Product[] = [
      { id: 1, name: '6Kg Cylinder (New)', price: 3200, supplier_id: 1, category: 'cylinder', created_at: new Date().toISOString() },
      { id: 2, name: '6Kg Cylinder (Refill)', price: 1200, supplier_id: 1, category: 'cylinder', created_at: new Date().toISOString() },
      { id: 3, name: '13Kg Cylinder (New)', price: 5500, supplier_id: 1, category: 'cylinder', created_at: new Date().toISOString() },
      { id: 4, name: '13Kg Cylinder (Refill)', price: 2600, supplier_id: 1, category: 'cylinder', created_at: new Date().toISOString() },
      { id: 5, name: 'Gas Burner', price: 350, supplier_id: 2, category: 'accessory', created_at: new Date().toISOString() },
      { id: 6, name: 'Gas Regulator', price: 500, supplier_id: 2, category: 'accessory', created_at: new Date().toISOString() },
    ];

    setStorageData(STORAGE_KEYS.CLIENTS, sampleClients);
    setStorageData(STORAGE_KEYS.SUPPLIERS, sampleSuppliers);
    setStorageData(STORAGE_KEYS.PRODUCTS, sampleProducts);
    setStorageData(STORAGE_KEYS.SALES, []);
    setStorageData(STORAGE_KEYS.ACCESSORIES, []);
    
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    console.log('Sample data initialized in localStorage');
  }
}

// Initialize on module load
initializeSampleData();

// Simulate API delay for realistic testing
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Generate unique ID
const generateId = (items: any[]): number => {
  return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
};

// Clients API
export const localClientsApi = {
  getAll: async (page = 1, limit = 20): Promise<{ clients: Client[]; total: number }> => {
    await delay();
    const allClients = getStorageData<Client>(STORAGE_KEYS.CLIENTS);
    const start = (page - 1) * limit;
    const clients = allClients.slice(start, start + limit);
    return { clients, total: allClients.length };
  },

  getById: async (id: number): Promise<Client | null> => {
    await delay();
    const clients = getStorageData<Client>(STORAGE_KEYS.CLIENTS);
    return clients.find(c => c.id === id) || null;
  },

  create: async (client: Omit<Client, 'id' | 'created_at'>): Promise<Client> => {
    await delay();
    const clients = getStorageData<Client>(STORAGE_KEYS.CLIENTS);
    const newClient: Client = {
      ...client,
      id: generateId(clients),
      created_at: new Date().toISOString(),
    };
    clients.push(newClient);
    setStorageData(STORAGE_KEYS.CLIENTS, clients);
    return newClient;
  },

  update: async (id: number, updates: Partial<Client>): Promise<Client> => {
    await delay();
    const clients = getStorageData<Client>(STORAGE_KEYS.CLIENTS);
    const index = clients.findIndex(c => c.id === id);
    
    if (index === -1) throw new Error('Client not found');
    
    clients[index] = { ...clients[index], ...updates };
    setStorageData(STORAGE_KEYS.CLIENTS, clients);
    return clients[index];
  },

  delete: async (id: number): Promise<void> => {
    await delay();
    const clients = getStorageData<Client>(STORAGE_KEYS.CLIENTS);
    const filtered = clients.filter(c => c.id !== id);
    setStorageData(STORAGE_KEYS.CLIENTS, filtered);
  },
};

// Suppliers API
export const localSuppliersApi = {
  getAll: async (): Promise<Supplier[]> => {
    await delay();
    return getStorageData<Supplier>(STORAGE_KEYS.SUPPLIERS);
  },

  getById: async (id: number): Promise<Supplier | null> => {
    await delay();
    const suppliers = getStorageData<Supplier>(STORAGE_KEYS.SUPPLIERS);
    return suppliers.find(s => s.id === id) || null;
  },

  create: async (supplier: Omit<Supplier, 'id' | 'created_at'>): Promise<Supplier> => {
    await delay();
    const suppliers = getStorageData<Supplier>(STORAGE_KEYS.SUPPLIERS);
    const newSupplier: Supplier = {
      ...supplier,
      id: generateId(suppliers),
      created_at: new Date().toISOString(),
    };
    suppliers.push(newSupplier);
    setStorageData(STORAGE_KEYS.SUPPLIERS, suppliers);
    return newSupplier;
  },

  update: async (id: number, updates: Partial<Supplier>): Promise<Supplier> => {
    await delay();
    const suppliers = getStorageData<Supplier>(STORAGE_KEYS.SUPPLIERS);
    const index = suppliers.findIndex(s => s.id === id);
    
    if (index === -1) throw new Error('Supplier not found');
    
    suppliers[index] = { ...suppliers[index], ...updates };
    setStorageData(STORAGE_KEYS.SUPPLIERS, suppliers);
    return suppliers[index];
  },

  delete: async (id: number): Promise<void> => {
    await delay();
    const suppliers = getStorageData<Supplier>(STORAGE_KEYS.SUPPLIERS);
    const filtered = suppliers.filter(s => s.id !== id);
    setStorageData(STORAGE_KEYS.SUPPLIERS, filtered);
  },
};

// Sales API
export const localSalesApi = {
  getAll: async (page = 1, limit = 20): Promise<{ sales: Sale[]; total: number }> => {
    await delay();
    const allSales = getStorageData<Sale>(STORAGE_KEYS.SALES);
    const start = (page - 1) * limit;
    const sales = allSales.slice(start, start + limit);
    return { sales, total: allSales.length };
  },

  getById: async (id: number): Promise<Sale | null> => {
    await delay();
    const sales = getStorageData<Sale>(STORAGE_KEYS.SALES);
    return sales.find(s => s.id === id) || null;
  },

  create: async (sale: Omit<Sale, 'id' | 'created_at'>): Promise<Sale> => {
    await delay();
    const sales = getStorageData<Sale>(STORAGE_KEYS.SALES);
    const newSale: Sale = {
      ...sale,
      id: generateId(sales),
      created_at: new Date().toISOString(),
    };
    sales.push(newSale);
    setStorageData(STORAGE_KEYS.SALES, sales);
    return newSale;
  },

  update: async (id: number, updates: Partial<Sale>): Promise<Sale> => {
    await delay();
    const sales = getStorageData<Sale>(STORAGE_KEYS.SALES);
    const index = sales.findIndex(s => s.id === id);
    
    if (index === -1) throw new Error('Sale not found');
    
    sales[index] = { ...sales[index], ...updates };
    setStorageData(STORAGE_KEYS.SALES, sales);
    return sales[index];
  },

  delete: async (id: number): Promise<void> => {
    await delay();
    const sales = getStorageData<Sale>(STORAGE_KEYS.SALES);
    const filtered = sales.filter(s => s.id !== id);
    setStorageData(STORAGE_KEYS.SALES, filtered);
  },
};

// Products API
export const localProductsApi = {
  getAll: async (): Promise<Product[]> => {
    await delay();
    return getStorageData<Product>(STORAGE_KEYS.PRODUCTS);
  },

  getBySupplier: async (supplierId: number): Promise<Product[]> => {
    await delay();
    const products = getStorageData<Product>(STORAGE_KEYS.PRODUCTS);
    return products.filter(p => p.supplier_id === supplierId);
  },
};

// Reports API
export const localReportsApi = {
  getSalesReport: async (filters: any): Promise<any> => {
    await delay();
    const sales = getStorageData<Sale>(STORAGE_KEYS.SALES);
    
    // Filter sales by date range if provided
    let filteredSales = sales;
    if (filters.date_from) {
      filteredSales = filteredSales.filter(s => 
        new Date(s.created_at) >= new Date(filters.date_from)
      );
    }
    if (filters.date_to) {
      filteredSales = filteredSales.filter(s => 
        new Date(s.created_at) <= new Date(filters.date_to)
      );
    }
    
    // Calculate totals
    const totalSales = filteredSales.reduce((sum, s) => sum + (s.total_amount || 0), 0);
    const totalCash = filteredSales
      .filter(s => s.payment_method === 'cash')
      .reduce((sum, s) => sum + (s.total_amount || 0), 0);
    const totalMpesa = filteredSales
      .filter(s => s.payment_method === 'mpesa')
      .reduce((sum, s) => sum + (s.total_amount || 0), 0);
    const totalInstallments = filteredSales
      .filter(s => s.payment_method === 'installment')
      .reduce((sum, s) => sum + (s.total_amount || 0), 0);
    
    return {
      total_sales: totalSales,
      total_transactions: filteredSales.length,
      payment_methods: {
        cash: totalCash,
        mpesa: totalMpesa,
        installment: totalInstallments,
      },
      sales: filteredSales,
      period: {
        from: filters.date_from || 'All time',
        to: filters.date_to || 'Now',
      },
    };
  },
};

// Export all APIs
export const localStorageApi = {
  clients: localClientsApi,
  suppliers: localSuppliersApi,
  sales: localSalesApi,
  products: localProductsApi,
  reports: localReportsApi,
};

// Clear all data (for testing/reset)
export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  initializeSampleData();
};

// Export data (for backup)
export const exportData = () => {
  const data = {
    clients: getStorageData(STORAGE_KEYS.CLIENTS),
    suppliers: getStorageData(STORAGE_KEYS.SUPPLIERS),
    sales: getStorageData(STORAGE_KEYS.SALES),
    products: getStorageData(STORAGE_KEYS.PRODUCTS),
    exportedAt: new Date().toISOString(),
  };
  return JSON.stringify(data, null, 2);
};

// Import data (for restore)
export const importData = (jsonData: string) => {
  try {
    const data = JSON.parse(jsonData);
    if (data.clients) setStorageData(STORAGE_KEYS.CLIENTS, data.clients);
    if (data.suppliers) setStorageData(STORAGE_KEYS.SUPPLIERS, data.suppliers);
    if (data.sales) setStorageData(STORAGE_KEYS.SALES, data.sales);
    if (data.products) setStorageData(STORAGE_KEYS.PRODUCTS, data.products);
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};
