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

    // Sample suppliers - All major Kenyan gas brands
    const sampleSuppliers: Supplier[] = [
      {
        id: 1,
        name: 'Top Gas',
        color: '#dc2626',
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        name: 'K-Gas',
        color: '#000000',
        created_at: new Date().toISOString(),
      },
      {
        id: 3,
        name: 'Total Gas',
        color: '#ea580c',
        created_at: new Date().toISOString(),
      },
      {
        id: 4,
        name: 'Rubis Gas',
        color: '#16a34a',
        created_at: new Date().toISOString(),
      },
      {
        id: 5,
        name: 'OiLibya Gas',
        color: '#92400e',
        created_at: new Date().toISOString(),
      },
      {
        id: 6,
        name: 'Men Gas',
        color: '#881337',
        created_at: new Date().toISOString(),
      },
      {
        id: 7,
        name: 'Hashi Gas',
        color: '#eab308',
        created_at: new Date().toISOString(),
      },
      {
        id: 8,
        name: 'Hass Gas',
        color: '#9333ea',
        created_at: new Date().toISOString(),
      },
      {
        id: 9,
        name: 'Pro Gas',
        color: '#2563eb',
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

    // Sample sales - generate sales for the past 30 days
    const sampleSales: Sale[] = [];
    const now = new Date();
    for (let i = 0; i < 30; i++) {
      const saleDate = new Date(now);
      saleDate.setDate(saleDate.getDate() - i);
      
      // 2-4 sales per day
      const salesPerDay = Math.floor(Math.random() * 3) + 2;
      for (let j = 0; j < salesPerDay; j++) {
        const clientId = Math.floor(Math.random() * 2) + 1;
        const supplierId = Math.floor(Math.random() * 2) + 1;
        const paymentMethods: Array<'cash' | 'mpesa' | 'installment'> = ['cash', 'mpesa', 'installment'];
        const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
        const totalAmount = Math.floor(Math.random() * 5000) + 1000;
        
        sampleSales.push({
          id: sampleSales.length + 1,
          client_id: clientId,
          supplier_id: supplierId,
          payment_method: paymentMethod,
          mpesa_code: paymentMethod === 'mpesa' ? `MPE${Math.random().toString(36).substring(7).toUpperCase()}` : undefined,
          total_amount: totalAmount,
          amount_paid: paymentMethod === 'installment' ? Math.floor(totalAmount * 0.5) : totalAmount,
          notes: 'Sample sale',
          created_at: saleDate.toISOString(),
          sale_date: saleDate.toISOString(),
        });
      }
    }

    setStorageData(STORAGE_KEYS.CLIENTS, sampleClients);
    setStorageData(STORAGE_KEYS.SUPPLIERS, sampleSuppliers);
    setStorageData(STORAGE_KEYS.PRODUCTS, sampleProducts);
    setStorageData(STORAGE_KEYS.SALES, sampleSales);
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

  create: async (sale: any): Promise<Sale> => {
    await delay();
    const sales = getStorageData<Sale>(STORAGE_KEYS.SALES);
    const newSale: Sale = {
      id: generateId(sales),
      client_id: sale.client_id,
      supplier_id: sale.supplier_id,
      payment_method: sale.payment_method as 'cash' | 'mpesa' | 'installment',
      mpesa_code: sale.mpesa_code,
      total_amount: sale.total_amount || 0,
      amount_paid: sale.amount_paid || 0,
      notes: sale.notes,
      created_at: new Date().toISOString(),
      sale_date: sale.sale_date || new Date().toISOString(),
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
  getDailyReport: async (date?: string): Promise<any> => {
    await delay();
    const sales = getStorageData<Sale>(STORAGE_KEYS.SALES);
    const targetDate = date || new Date().toISOString().split('T')[0];
    const filteredSales = sales.filter(s => s.created_at.startsWith(targetDate));
    
    const totalSales = filteredSales.reduce((sum, s) => sum + (s.total_amount || 0), 0);
    return {
      total_sales: totalSales,
      total_transactions: filteredSales.length,
      sales: filteredSales,
      date: targetDate,
    };
  },

  getMonthlyReport: async (year?: number, month?: number): Promise<any> => {
    await delay();
    const sales = getStorageData<Sale>(STORAGE_KEYS.SALES);
    const now = new Date();
    const targetYear = year || now.getFullYear();
    const targetMonth = month || now.getMonth() + 1;
    
    const filteredSales = sales.filter(s => {
      const saleDate = new Date(s.created_at);
      return saleDate.getFullYear() === targetYear && saleDate.getMonth() + 1 === targetMonth;
    });
    
    const totalSales = filteredSales.reduce((sum, s) => sum + (s.total_amount || 0), 0);
    return {
      total_sales: totalSales,
      total_transactions: filteredSales.length,
      sales: filteredSales,
      period: { year: targetYear, month: targetMonth },
    };
  },

  getSalesReport: async (filters: any): Promise<any> => {
    await delay();
    const sales = getStorageData<Sale>(STORAGE_KEYS.SALES);
    const clients = getStorageData<Client>(STORAGE_KEYS.CLIENTS);
    const suppliers = getStorageData<Supplier>(STORAGE_KEYS.SUPPLIERS);
    
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
    if (filters.supplier_id) {
      filteredSales = filteredSales.filter(s => s.supplier_id === filters.supplier_id);
    }
    
    // Calculate totals
    const totalRevenue = filteredSales.reduce((sum, s) => sum + (s.total_amount || 0), 0);
    const totalSalesCount = filteredSales.length;
    const averageSale = totalSalesCount > 0 ? totalRevenue / totalSalesCount : 0;
    
    // Sales by payment method
    const salesByPaymentMethod: { [key: string]: number } = {
      cash: 0,
      mpesa: 0,
      installment: 0,
    };
    filteredSales.forEach(s => {
      const method = s.payment_method || 'cash';
      salesByPaymentMethod[method] = (salesByPaymentMethod[method] || 0) + (s.total_amount || 0);
    });
    
    // Sales by supplier
    const salesBySupplier: { [key: string]: number } = {};
    filteredSales.forEach(s => {
      if (s.supplier_id) {
        const supplier = suppliers.find(sup => sup.id === s.supplier_id);
        const supplierName = supplier?.name || `Supplier ${s.supplier_id}`;
        salesBySupplier[supplierName] = (salesBySupplier[supplierName] || 0) + (s.total_amount || 0);
      }
    });
    
    // Sales by product type (mock data for now since we don't have item details in localStorage)
    const salesByProductType: { [key: string]: number } = {};
    
    // Daily sales - group by date
    const dailySalesMap: { [date: string]: { amount: number; count: number } } = {};
    filteredSales.forEach(s => {
      const date = new Date(s.created_at).toISOString().split('T')[0];
      if (!dailySalesMap[date]) {
        dailySalesMap[date] = { amount: 0, count: 0 };
      }
      dailySalesMap[date].amount += s.total_amount || 0;
      dailySalesMap[date].count += 1;
    });
    
    const dailySales = Object.entries(dailySalesMap)
      .map(([date, data]) => ({ date, amount: data.amount, count: data.count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Top clients
    const clientTotals: { [clientId: number]: number } = {};
    filteredSales.forEach(s => {
      clientTotals[s.client_id] = (clientTotals[s.client_id] || 0) + (s.total_amount || 0);
    });
    
    const topClients = Object.entries(clientTotals)
      .map(([clientId, total]) => {
        const client = clients.find(c => c.id === parseInt(clientId));
        return {
          name: client?.name || `Client ${clientId}`,
          total,
        };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
    
    return {
      total_sales: totalSalesCount,
      total_revenue: totalRevenue,
      average_sale: averageSale,
      yoy_growth: undefined,
      sales_by_supplier: salesBySupplier,
      sales_by_payment_method: salesByPaymentMethod,
      sales_by_product_type: salesByProductType,
      daily_sales: dailySales,
      top_clients: topClients,
    };
  },

  getCustomReport: async (filters: any): Promise<any> => {
    // Same as getSalesReport for localStorage
    return localReportsApi.getSalesReport(filters);
  },
};

// Dashboard API
export const localDashboardApi = {
  getStats: async (): Promise<any> => {
    await delay();
    const sales = getStorageData<Sale>(STORAGE_KEYS.SALES);
    const clients = getStorageData<Client>(STORAGE_KEYS.CLIENTS);
    
    // Calculate stats
    const totalSales = sales.reduce((sum, s) => sum + (s.total_amount || 0), 0);
    const totalPaid = sales.reduce((sum, s) => sum + (s.amount_paid || 0), 0);
    const pendingBalance = totalSales - totalPaid;
    
    // Get recent sales (last 10)
    const recentSales = sales
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10)
      .map(sale => {
        const client = clients.find(c => c.id === sale.client_id);
        return {
          ...sale,
          client: client || { id: sale.client_id, name: `Client ${sale.client_id}`, phone: '', created_at: '' },
        };
      });
    
    return {
      stats: {
        total_sales: totalSales,
        total_clients: clients.length,
        total_paid: totalPaid,
        pending_balance: pendingBalance,
      },
      recent_sales: recentSales,
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
  dashboard: localDashboardApi,
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
