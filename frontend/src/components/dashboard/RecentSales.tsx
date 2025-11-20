import { formatDistanceToNow } from 'date-fns';
import { DollarSign, User, Calendar } from 'lucide-react';
import type { RecentSale } from '../../types';
import Card from '../common/Card';

interface RecentSalesProps {
  sales: RecentSale[];
}

export default function RecentSales({ sales }: RecentSalesProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'cash':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'mpesa':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'installment':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  return (
    <Card title="Recent Sales" subtitle="Latest transactions">
      {sales.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No recent sales found
        </p>
      ) : (
        <div className="space-y-4">
          {sales.map((sale) => (
            <div
              key={sale.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <User className="h-4 w-4 text-gray-500" />
                  <p className="font-medium text-gray-900 dark:text-white">
                    {sale.client?.name}
                  </p>
                  {sale.supplier && (
                    <span
                      className="px-2 py-0.5 text-xs rounded-full"
                      style={{
                        backgroundColor: sale.supplier.color + '20',
                        color: sale.supplier.color,
                      }}
                    >
                      {sale.supplier.name}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center space-x-1">
                    <DollarSign className="h-3 w-3" />
                    <span>{formatCurrency(sale.total_amount)}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDistanceToNow(new Date(sale.created_at), { addSuffix: true })}</span>
                  </span>
                </div>
              </div>
              <div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getPaymentMethodColor(sale.payment_method)}`}>
                  {sale.payment_method.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
