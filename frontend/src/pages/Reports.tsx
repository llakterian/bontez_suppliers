import { useEffect, useState } from 'react';
import { Download, TrendingUp, DollarSign, PieChart as PieChartIcon } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import toast from 'react-hot-toast';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { reportsApi } from '../services/api';
import type { SalesReport } from '../types';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState<'daily' | 'monthly'>('monthly');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportData, setReportData] = useState<SalesReport | null>(null);

  useEffect(() => {
    fetchReport();
  }, [reportType, selectedDate]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      if (reportType === 'daily') {
        const data = await reportsApi.getDailyReport(selectedDate);
        setReportData(data);
      } else {
        const date = new Date(selectedDate);
        const data = await reportsApi.getMonthlyReport(date.getFullYear(), date.getMonth() + 1);
        setReportData(data);
      }
    } catch (error) {
      toast.error('Failed to load report');
      console.error('Report error:', error);
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

  const handleExport = () => {
    toast.success('Export feature coming soon!');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  // Prepare chart data
  const supplierLabels = Object.keys(reportData?.sales_by_supplier || {});
  const supplierData = Object.values(reportData?.sales_by_supplier || {});
  
  const paymentLabels = Object.keys(reportData?.sales_by_payment_method || {});
  const paymentData = Object.values(reportData?.sales_by_payment_method || {});

  const supplierColors = [
    '#dc2626', '#ea580c', '#eab308', '#16a34a', 
    '#2563eb', '#9333ea', '#000000', '#92400e', '#881337'
  ];

  const barChartData = {
    labels: supplierLabels,
    datasets: [
      {
        label: 'Revenue (KES)',
        data: supplierData,
        backgroundColor: supplierColors.slice(0, supplierLabels.length),
        borderRadius: 8,
      },
    ],
  };

  const pieChartData = {
    labels: paymentLabels.map((label) => label.toUpperCase()),
    datasets: [
      {
        data: paymentData,
        backgroundColor: ['#16a34a', '#2563eb', '#ea580c'],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.label}: ${formatCurrency(context.parsed.y || context.parsed)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => formatCurrency(value),
        },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.label}: ${formatCurrency(context.parsed)}`;
          },
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sales Reports</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Analyze your sales performance and trends
          </p>
        </div>
        <Button onClick={handleExport} icon={<Download className="h-5 w-5" />}>
          Export Report
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Report Type
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="daily"
                  checked={reportType === 'daily'}
                  onChange={(e) => setReportType(e.target.value as 'daily')}
                  className="mr-2"
                />
                <span>Daily</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="monthly"
                  checked={reportType === 'monthly'}
                  onChange={(e) => setReportType(e.target.value as 'monthly')}
                  className="mr-2"
                />
                <span>Monthly</span>
              </label>
            </div>
          </div>

          <Input
            label={reportType === 'daily' ? 'Select Date' : 'Select Month'}
            type={reportType === 'daily' ? 'date' : 'month'}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {reportData?.total_sales || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(reportData?.total_revenue || 0)}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <PieChartIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg Sale Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {reportData?.total_sales
                  ? formatCurrency(reportData.total_revenue / reportData.total_sales)
                  : formatCurrency(0)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Sales by Supplier">
          <div className="h-80">
            {supplierLabels.length > 0 ? (
              <Bar data={barChartData} options={chartOptions} />
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No supplier data available
              </p>
            )}
          </div>
        </Card>

        <Card title="Sales by Payment Method">
          <div className="h-80">
            {paymentLabels.length > 0 ? (
              <Pie data={pieChartData} options={pieChartOptions} />
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No payment data available
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      {reportData && (
        <Card title="Detailed Breakdown">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Revenue by Supplier
              </h4>
              <div className="space-y-2">
                {Object.entries(reportData.sales_by_supplier || {}).map(([supplier, amount], index) => (
                  <div key={supplier} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: supplierColors[index] }}
                      />
                      <span className="text-gray-900 dark:text-white">{supplier}</span>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(amount as number)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
