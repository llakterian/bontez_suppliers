import { useEffect, useState } from 'react';
import { TrendingUp, Users, DollarSign, AlertCircle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import StatCard from '../components/dashboard/StatCard';
import RecentSales from '../components/dashboard/RecentSales';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import { dashboardApi } from '../services/api';
import type { DashboardData } from '../types';

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const result = await dashboardApi.getStats();
      setData(result);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-500 to-accent-red rounded-xl sm:rounded-2xl p-6 sm:p-8 text-white shadow-xl"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
              Welcome to Bontez Suppliers
            </h1>
            <p className="text-primary-100 text-sm sm:text-base lg:text-lg">
              Managing gas sales across Kenya with excellence
            </p>
          </div>
          <Link to="/sales/new" className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="lg"
              icon={<Plus className="h-5 w-5" />}
              className="w-full sm:w-auto"
            >
              <span className="sm:inline">New Sale</span>
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sales"
          value={formatCurrency(data?.stats.total_sales || 0)}
          icon={<TrendingUp className="h-8 w-8 text-white" />}
          iconBgColor="bg-gradient-to-br from-primary-500 to-primary-600"
        />
        <StatCard
          title="Total Clients"
          value={data?.stats.total_clients || 0}
          icon={<Users className="h-8 w-8 text-white" />}
          iconBgColor="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          title="Paid Amount"
          value={formatCurrency(data?.stats.total_paid || 0)}
          icon={<DollarSign className="h-8 w-8 text-white" />}
          iconBgColor="bg-gradient-to-br from-green-500 to-green-600"
        />
        <StatCard
          title="Pending Balance"
          value={formatCurrency(data?.stats.pending_balance || 0)}
          icon={<AlertCircle className="h-8 w-8 text-white" />}
          iconBgColor="bg-gradient-to-br from-red-500 to-red-600"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/clients/new">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-500 transition-colors cursor-pointer group">
            <Users className="h-10 w-10 text-gray-400 group-hover:text-primary-500 mb-3 transition-colors" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Add Client
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Register a new customer
            </p>
          </div>
        </Link>

        <Link to="/sales/new">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-500 transition-colors cursor-pointer group">
            <DollarSign className="h-10 w-10 text-gray-400 group-hover:text-primary-500 mb-3 transition-colors" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Create Sale
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Record a new transaction
            </p>
          </div>
        </Link>

        <Link to="/reports">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-500 transition-colors cursor-pointer group">
            <TrendingUp className="h-10 w-10 text-gray-400 group-hover:text-primary-500 mb-3 transition-colors" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              View Reports
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Analyze sales data
            </p>
          </div>
        </Link>
      </div>

      {/* Recent Sales */}
      <RecentSales sales={data?.recent_sales || []} />
    </div>
  );
}
