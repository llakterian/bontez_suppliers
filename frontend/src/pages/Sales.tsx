import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Search, Calendar, DollarSign, User } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Input from '../components/common/Input';
import { salesApi } from '../services/api';
import type { Sale } from '../types';

export default function Sales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const result = await salesApi.getAll();
      setSales(result.sales);
    } catch (error) {
      toast.error('Failed to load sales');
      console.error('Sales error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getPaymentMethodBadge = (method: string) => {
    const colors = {
      cash: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      mpesa: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      installment: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    };
    return colors[method as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredSales = sales.filter((sale) =>
    sale.client?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sale.supplier?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sale.id.toString().includes(searchQuery)
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sales</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Track and manage all transactions
          </p>
        </div>
        <Link to="/sales/new">
          <Button icon={<Plus className="h-5 w-5" />}>
            New Sale
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search by client, supplier, or sale ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Sales List */}
      {filteredSales.length === 0 ? (
        <Card>
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            {searchQuery ? 'No sales found matching your search' : 'No sales yet'}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredSales.map((sale, index) => (
            <motion.div
              key={sale.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card hover>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Sale Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
                            #{sale.id.toString().padStart(4, '0')}
                          </span>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getPaymentMethodBadge(sale.payment_method)}`}>
                            {sale.payment_method.toUpperCase()}
                          </span>
                          {sale.supplier && (
                            <span
                              className="px-2 py-1 text-xs rounded-full"
                              style={{
                                backgroundColor: sale.supplier.color + '20',
                                color: sale.supplier.color,
                              }}
                            >
                              {sale.supplier.name}
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="flex items-center text-sm">
                            <User className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-gray-900 dark:text-white font-medium">
                              {sale.client?.name}
                            </span>
                          </div>
                          <div className="flex items-center text-sm">
                            <DollarSign className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-gray-900 dark:text-white font-semibold">
                              {formatCurrency(sale.total_amount)}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>{new Date(sale.sale_date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Status */}
                    {sale.payment_method === 'installment' && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">Payment Progress</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {formatCurrency(sale.amount_paid)} / {formatCurrency(sale.total_amount)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-primary-500 h-2 rounded-full transition-all"
                            style={{ width: `${(sale.amount_paid / sale.total_amount) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <Link to={`/sales/${sale.id}`}>
                    <Button variant="outline" icon={<Eye className="h-4 w-4" />}>
                      View Details
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
