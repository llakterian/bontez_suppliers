import axios from 'axios';
import type {
  Client,
  Supplier,
  Product,
  Sale,
  DashboardData,
  SalesReport,
  ReportFilters
} from '../types';
import { localStorageApi } from './localStorageApi';

// Detect if we should use localStorage (Netlify deployment) or real backend
const USE_LOCAL_STORAGE = import.meta.env.VITE_USE_LOCAL_STORAGE === 'true' || 
  import.meta.env.VITE_API_URL === 'mock';

// Configure axios instance (only used when NOT using localStorage)
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' ? '/api' : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_BASE_URL !== 'mock' ? API_BASE_URL : 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth if needed
api.interceptors.request.use((config) => {
  // Add auth token if available
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Log which API mode we're using
console.log(`API Mode: ${USE_LOCAL_STORAGE ? 'LocalStorage (Netlify)' : 'Backend API'}`);
console.log(`Environment: ${import.meta.env.MODE}`);

// Dashboard API
export const dashboardApi = USE_LOCAL_STORAGE ? localStorageApi.dashboard : {
  getStats: (): Promise<DashboardData> =>
    api.get('/dashboard').then(res => res.data),
};

// Clients API
export const clientsApi = USE_LOCAL_STORAGE ? localStorageApi.clients : {
  getAll: async (page = 1, limit = 20): Promise<{ clients: Client[]; total: number }> => {
    const res = await api.get(`/clients?page=${page}&limit=${limit}`);
    return res.data;
  },

  getById: (id: number): Promise<Client> =>
    api.get(`/clients/${id}`).then(res => res.data),

  create: (client: Omit<Client, 'id' | 'created_at'>): Promise<Client> =>
    api.post('/clients', client).then(res => res.data),

  update: (id: number, client: Partial<Client>): Promise<Client> =>
    api.put(`/clients/${id}`, client).then(res => res.data),

  delete: (id: number): Promise<void> =>
    api.delete(`/clients/${id}`),
};

// Suppliers API
export const suppliersApi = USE_LOCAL_STORAGE ? localStorageApi.suppliers : {
  getAll: (): Promise<Supplier[]> =>
    api.get('/suppliers').then(res => res.data),

  getById: (id: number): Promise<Supplier> =>
    api.get(`/suppliers/${id}`).then(res => res.data),

  create: (supplier: Omit<Supplier, 'id' | 'created_at'>): Promise<Supplier> =>
    api.post('/suppliers', supplier).then(res => res.data),

  update: (id: number, supplier: Partial<Supplier>): Promise<Supplier> =>
    api.put(`/suppliers/${id}`, supplier).then(res => res.data),

  delete: (id: number): Promise<void> =>
    api.delete(`/suppliers/${id}`),
};

// Products API
export const productsApi = USE_LOCAL_STORAGE ? localStorageApi.products : {
  getAll: (): Promise<Product[]> =>
    api.get('/products').then(res => res.data),

  getBySupplier: (supplierId: number): Promise<Product[]> =>
    api.get(`/products?supplier_id=${supplierId}`).then(res => res.data),

  getByCategory: (category: string): Promise<Product[]> =>
    api.get(`/products?category=${category}`).then(res => res.data),
};

// Sales API  
export const salesApi = USE_LOCAL_STORAGE ? localStorageApi.sales : {
  getAll: (page = 1, limit = 20): Promise<{ sales: Sale[]; total: number }> =>
    api.get(`/sales?page=${page}&limit=${limit}`).then(res => res.data),

  getById: (id: number): Promise<Sale> =>
    api.get(`/sales/${id}`).then(res => res.data),

  create: (sale: {
    client_id: number;
    supplier_id?: number;
    payment_method: string;
    mpesa_code?: string;
    items: { product_id: number; quantity: number }[];
    notes?: string;
    num_installments?: number;
  }): Promise<Sale> =>
    api.post('/sales', sale).then(res => res.data),

  update: (id: number, sale: Partial<Sale>): Promise<Sale> =>
    api.put(`/sales/${id}`, sale).then(res => res.data),

  delete: (id: number): Promise<void> =>
    api.delete(`/sales/${id}`),
};

// Reports API
export const reportsApi = USE_LOCAL_STORAGE ? localStorageApi.reports : {
  getDailyReport: (date?: string): Promise<SalesReport> =>
    api.get(`/reports/daily${date ? `?date=${date}` : ''}`).then(res => res.data),

  getMonthlyReport: (year?: number, month?: number): Promise<SalesReport> =>
    api.get(`/reports/monthly${year && month ? `?year=${year}&month=${month}` : ''}`).then(res => res.data),

  getSalesReport: (filters: ReportFilters): Promise<SalesReport> => {
    const params = new URLSearchParams();
    if (filters.date_from) params.append('date_from', filters.date_from);
    if (filters.date_to) params.append('date_to', filters.date_to);
    if (filters.supplier_id) params.append('supplier_id', filters.supplier_id.toString());
    if (filters.client_id) params.append('client_id', filters.client_id.toString());

    return api.get(`/reports/sales?${params.toString()}`).then(res => res.data);
  },

  getCustomReport: (filters: ReportFilters): Promise<SalesReport> => {
    const params = new URLSearchParams();
    if (filters.date_from) params.append('date_from', filters.date_from);
    if (filters.date_to) params.append('date_to', filters.date_to);
    if (filters.supplier_id) params.append('supplier_id', filters.supplier_id.toString());
    if (filters.client_id) params.append('client_id', filters.client_id.toString());

    return api.get(`/reports/custom?${params.toString()}`).then(res => res.data);
  },
};

export default api;