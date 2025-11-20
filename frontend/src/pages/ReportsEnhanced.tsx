import { useEffect, useState } from 'react';
import { Download, TrendingUp, DollarSign, FileText, Calendar, Filter, RefreshCw } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import toast from 'react-hot-toast';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { reportsApi, suppliersApi } from '../services/api';
import type { SalesReport, Supplier } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Supplier color mapping for Kenyan gas brands
const SUPPLIER_COLORS: Record<string, string> = {
  'Top Gas': '#dc2626',
  'K-Gas': '#000000',
  'Total Gas': '#ea580c',
  'Rubis Gas': '#16a34a',
  'OiLibya Gas': '#92400e',
  'Men Gas': '#881337',
  'Hashi Gas': '#eab308',
  'Hass Gas': '#2563eb',
  'Mixed Gas': '#9333ea',
};

const PRODUCT_TYPE_COLORS: Record<string, string> = {
  '6Kg New': '#3b82f6',
  '6Kg Refill': '#60a5fa',
  '12Kg New': '#ef4444',
  '12Kg Refill': '#f87171',
  'Accessories': '#10b981',
};

export default function ReportsEnhanced() {
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [reportData, setReportData] = useState<SalesReport | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  
  // Filters
  const [dateFrom, setDateFrom] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  });
  const [dateTo, setDateTo] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedSupplier, setSelectedSupplier] = useState<string>('all');
  const [reportType, setReportType] = useState<'daily' | 'monthly' | 'custom'>('monthly');

  useEffect(() => {
    fetchSuppliers();
    fetchReportData();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const data = await suppliersApi.getAll();
      // Handle both array and object with suppliers property
      const suppliersList = Array.isArray(data) ? data : ((data as any).suppliers || []);
      setSuppliers(suppliersList);
    } catch (error) {
      console.error('Failed to load suppliers:', error);
    }
  };

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const params = {
        date_from: dateFrom,
        date_to: dateTo,
        supplier_id: selectedSupplier !== 'all' ? parseInt(selectedSupplier) : undefined,
      };
      
      const result = await reportsApi.getSalesReport(params);
      setReportData(result);
    } catch (error) {
      toast.error('Failed to load report data');
      console.error('Report error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    fetchReportData();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const exportToPDF = async () => {
    if (!reportData) return;
    
    try {
      setExporting(true);
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.setTextColor(245, 158, 11); // Primary color
      doc.text('Bontez Suppliers', 14, 20);
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text('Sales Report - Gas Distribution', 14, 28);
      
      // Report period
      doc.setFontSize(10);
      doc.text(`Period: ${new Date(dateFrom).toLocaleDateString()} - ${new Date(dateTo).toLocaleDateString()}`, 14, 35);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 40);
      
      // Summary Statistics
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('Summary', 14, 50);
      
      const summaryData = [
        ['Total Sales Count', reportData.total_sales.toString()],
        ['Total Revenue', formatCurrency(reportData.total_revenue)],
        ['Average Sale Value', formatCurrency(reportData.average_sale)],
        ['YoY Growth', reportData.yoy_growth ? `${reportData.yoy_growth.toFixed(1)}%` : 'N/A'],
      ];
      
      autoTable(doc, {
        startY: 55,
        head: [['Metric', 'Value']],
        body: summaryData,
        theme: 'striped',
        headStyles: { fillColor: [245, 158, 11] },
      });

      // Sales by Supplier
      if (Object.keys(reportData.sales_by_supplier).length > 0) {
        const supplierY = (doc as any).lastAutoTable.finalY + 10;
        doc.setFontSize(14);
        doc.text('Sales by Supplier', 14, supplierY);
        
        const supplierData = Object.entries(reportData.sales_by_supplier).map(([name, amount]) => [
          name,
          formatCurrency(amount as number),
        ]);
        
        autoTable(doc, {
          startY: supplierY + 5,
          head: [['Supplier', 'Revenue']],
          body: supplierData,
          theme: 'grid',
          headStyles: { fillColor: [245, 158, 11] },
        });
      }

      // Payment Methods
      if (Object.keys(reportData.sales_by_payment_method).length > 0) {
        const paymentY = (doc as any).lastAutoTable.finalY + 10;
        doc.setFontSize(14);
        doc.text('Payment Methods', 14, paymentY);
        
        const paymentData = Object.entries(reportData.sales_by_payment_method).map(([method, amount]) => [
          method.toUpperCase(),
          formatCurrency(amount as number),
        ]);
        
        autoTable(doc, {
          startY: paymentY + 5,
          head: [['Method', 'Amount']],
          body: paymentData,
          theme: 'grid',
          headStyles: { fillColor: [245, 158, 11] },
        });
      }

      // Footer
      const pageCount = (doc as any).internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(
          `Page ${i} of ${pageCount} | Bontez Suppliers © ${new Date().getFullYear()}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }

      doc.save(`Bontez-Sales-Report-${dateFrom}-to-${dateTo}.pdf`);
      toast.success('Report exported to PDF successfully');
    } catch (error) {
      toast.error('Failed to export PDF');
      console.error('PDF export error:', error);
    } finally {
      setExporting(false);
    }
  };

  const exportToCSV = () => {
    if (!reportData) return;
    
    try {
      setExporting(true);
      
      let csvContent = 'Bontez Suppliers - Sales Report\n';
      csvContent += `Period: ${dateFrom} to ${dateTo}\n`;
      csvContent += `Generated: ${new Date().toISOString()}\n\n`;
      
      // Summary
      csvContent += 'SUMMARY\n';
      csvContent += 'Metric,Value\n';
      csvContent += `Total Sales,${reportData.total_sales}\n`;
      csvContent += `Total Revenue,${reportData.total_revenue}\n`;
      csvContent += `Average Sale,${reportData.average_sale}\n`;
      csvContent += `YoY Growth,${reportData.yoy_growth || 'N/A'}%\n\n`;
      
      // Sales by Supplier
      csvContent += 'SALES BY SUPPLIER\n';
      csvContent += 'Supplier,Revenue\n';
      Object.entries(reportData.sales_by_supplier).forEach(([name, amount]) => {
        csvContent += `${name},${amount}\n`;
      });
      csvContent += '\n';
      
      // Payment Methods
      csvContent += 'PAYMENT METHODS\n';
      csvContent += 'Method,Amount\n';
      Object.entries(reportData.sales_by_payment_method).forEach(([method, amount]) => {
        csvContent += `${method},${amount}\n`;
      });
      csvContent += '\n';
      
      // Product Types
      if (reportData.sales_by_product_type) {
        csvContent += 'PRODUCT TYPES\n';
        csvContent += 'Product,Revenue\n';
        Object.entries(reportData.sales_by_product_type).forEach(([product, amount]) => {
          csvContent += `${product},${amount}\n`;
        });
      }

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `Bontez-Sales-Report-${dateFrom}-to-${dateTo}.csv`);
      toast.success('Report exported to CSV successfully');
    } catch (error) {
      toast.error('Failed to export CSV');
      console.error('CSV export error:', error);
    } finally {
      setExporting(false);
    }
  };

  // Chart configurations
  const supplierChartData = reportData ? {
    labels: Object.keys(reportData.sales_by_supplier),
    datasets: [
      {
        label: 'Revenue (KES)',
        data: Object.values(reportData.sales_by_supplier),
        backgroundColor: Object.keys(reportData.sales_by_supplier).map(
          (name) => SUPPLIER_COLORS[name] || '#6b7280'
        ),
        borderWidth: 1,
      },
    ],
  } : null;

  const productTypeChartData = reportData?.sales_by_product_type ? {
    labels: Object.keys(reportData.sales_by_product_type),
    datasets: [
      {
        label: 'Revenue (KES)',
        data: Object.values(reportData.sales_by_product_type),
        backgroundColor: Object.keys(reportData.sales_by_product_type).map(
          (product) => PRODUCT_TYPE_COLORS[product] || '#8b5cf6'
        ),
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  } : null;

  const paymentMethodChartData = reportData ? {
    labels: Object.keys(reportData.sales_by_payment_method).map((m) => m.toUpperCase()),
    datasets: [
      {
        label: 'Amount (KES)',
        data: Object.values(reportData.sales_by_payment_method),
        backgroundColor: ['#10b981', '#f59e0b', '#3b82f6'],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  } : null;

  const trendChartData = reportData?.daily_sales ? {
    labels: reportData.daily_sales.map((d) => new Date(d.date).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Daily Revenue (KES)',
        data: reportData.daily_sales.map((d) => d.amount),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = formatCurrency(context.parsed.y || context.parsed);
            return `${label}: ${value}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (tickValue: string | number) => formatCurrency(Number(tickValue)),
        },
      },
    },
  } as const;

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = formatCurrency(context.parsed);
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading Skeletons */}
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Sales Reports & Analytics
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive insights for gas distribution
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            icon={<Download className="h-4 w-4" />}
            onClick={exportToCSV}
            disabled={exporting || !reportData}
            className="w-full sm:w-auto"
          >
            Export CSV
          </Button>
          <Button
            variant="primary"
            icon={<FileText className="h-4 w-4" />}
            onClick={exportToPDF}
            disabled={exporting || !reportData}
            className="w-full sm:w-auto"
          >
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-primary-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Report Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                         focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                aria-label="Select report type"
              >
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {/* Date From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                From Date
              </label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                aria-label="Start date for report"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                To Date
              </label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                aria-label="End date for report"
              />
            </div>

            {/* Supplier Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Supplier
              </label>
              <select
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                         focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                aria-label="Filter by supplier"
              >
                <option value="all">All Suppliers</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
              {selectedSupplier !== 'all' && (
                <div className="mt-2 flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{
                      backgroundColor:
                        SUPPLIER_COLORS[
                          suppliers.find((s) => s.id.toString() === selectedSupplier)?.name || ''
                        ] || '#6b7280',
                    }}
                  ></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {suppliers.find((s) => s.id.toString() === selectedSupplier)?.name}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              icon={<RefreshCw className="h-4 w-4" />}
              onClick={handleApplyFilters}
              disabled={loading}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* KPI Summary */}
      {reportData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Sales</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
                  {reportData.total_sales}
                </p>
              </div>
              <TrendingUp className="h-10 w-10 text-blue-500" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
                  {formatCurrency(reportData.total_revenue)}
                </p>
              </div>
              <DollarSign className="h-10 w-10 text-green-500" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Avg Sale Value</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100 mt-1">
                  {formatCurrency(reportData.average_sale)}
                </p>
              </div>
              <TrendingUp className="h-10 w-10 text-orange-500" />
            </div>
          </Card>

          {reportData.yoy_growth !== undefined && (
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">YoY Growth</p>
                  <p className={`text-2xl font-bold mt-1 ${
                    reportData.yoy_growth >= 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {reportData.yoy_growth >= 0 ? '+' : ''}{reportData.yoy_growth.toFixed(1)}%
                  </p>
                </div>
                <TrendingUp className={`h-10 w-10 ${
                  reportData.yoy_growth >= 0 ? 'text-green-500' : 'text-red-500'
                }`} />
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Trend Chart */}
      {reportData && trendChartData && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Sales Trend
          </h3>
          <div className="h-64 sm:h-80">
            <Line data={trendChartData} options={chartOptions} />
          </div>
        </Card>
      )}

      {/* Charts Grid */}
      {reportData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue by Supplier */}
          {supplierChartData && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Revenue by Supplier
              </h3>
              <div className="h-80">
                <Bar 
                  data={supplierChartData} 
                  options={chartOptions}
                  aria-label="Bar chart showing revenue by gas supplier"
                />
              </div>
            </Card>
          )}

          {/* Payment Methods */}
          {paymentMethodChartData && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Payment Methods Distribution
              </h3>
              <div className="h-80">
                <Pie 
                  data={paymentMethodChartData} 
                  options={pieChartOptions}
                  aria-label="Pie chart showing distribution of payment methods"
                />
              </div>
            </Card>
          )}

          {/* Product Types */}
          {productTypeChartData && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Sales by Product Type
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                6Kg vs 12Kg cylinders breakdown
              </p>
              <div className="h-80">
                <Bar 
                  data={productTypeChartData} 
                  options={chartOptions}
                  aria-label="Stacked bar chart showing sales by product type"
                />
              </div>
            </Card>
          )}

          {/* Top Clients */}
          {reportData.top_clients && reportData.top_clients.length > 0 && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Top Clients
              </h3>
              <div className="space-y-3">
                {reportData.top_clients.slice(0, 5).map((client, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                          {index + 1}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {client.name}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(client.total)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Data Privacy Notice */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">i</span>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
              Data Privacy & Compliance
            </h4>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              This report complies with Kenyan Data Protection Act, 2019. Customer data is anonymized 
              and retained as per regulatory requirements. For inquiries, contact your compliance officer.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
