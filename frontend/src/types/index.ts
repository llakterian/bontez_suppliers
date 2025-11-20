export interface Supplier {
  id: number;
  name: string;
  color: string;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  supplier_id?: number;
  category: string;
  price: number;
  description?: string;
  created_at: string;
}

export interface Client {
  id: number;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  created_at: string;
}

export interface SaleItem {
  id: number;
  sale_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
  product?: Product;
}

export interface Installment {
  id: number;
  sale_id: number;
  amount: number;
  due_date: string;
  paid: boolean;
}

export interface Sale {
  id: number;
  client_id: number;
  supplier_id?: number;
  payment_method: 'cash' | 'mpesa' | 'installment';
  mpesa_code?: string;
  total_amount: number;
  amount_paid: number;
  notes?: string;
  created_at: string;
  sale_date: string;
  client?: Client;
  supplier?: Supplier;
  items?: SaleItem[];
  installments?: Installment[];
}

export interface DashboardStats {
  total_sales: number;
  total_clients: number;
  total_paid: number;
  pending_balance: number;
}

export interface RecentSale extends Sale {
  client: Client;
  supplier?: Supplier;
}

export interface DashboardData {
  stats: DashboardStats;
  recent_sales: RecentSale[];
}

export interface ReportFilters {
  date_from?: string;
  date_to?: string;
  supplier_id?: number;
  client_id?: number;
}

export interface SalesReport {
  total_sales: number;
  total_revenue: number;
  average_sale: number;
  yoy_growth?: number;
  sales_by_supplier: { [key: string]: number };
  sales_by_payment_method: { [key: string]: number };
  sales_by_product_type: { [key: string]: number };
  daily_sales: { date: string; amount: number; count: number }[];
  top_clients?: { name: string; total: number }[];
  payment_trends?: { method: string; count: number; total: number }[];
}