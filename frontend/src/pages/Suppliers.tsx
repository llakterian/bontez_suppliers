import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { suppliersApi } from '../services/api';
import type { Supplier } from '../types';

// Supplier color mapping for Kenyan gas companies
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

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const result = await suppliersApi.getAll();
      setSuppliers(result);
    } catch (error) {
      toast.error('Failed to load suppliers');
      console.error('Suppliers error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this supplier?')) return;

    try {
      await suppliersApi.delete(id);
      toast.success('Supplier deleted successfully');
      fetchSuppliers();
    } catch (error) {
      toast.error('Failed to delete supplier');
      console.error('Delete error:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Suppliers</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage gas supplier companies
          </p>
        </div>
        <Link to="/suppliers/new">
          <Button icon={<Plus className="h-5 w-5" />}>
            Add Supplier
          </Button>
        </Link>
      </div>

      {/* Suppliers Grid */}
      {suppliers.length === 0 ? (
        <Card>
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No suppliers yet
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {suppliers.map((supplier, index) => (
            <motion.div
              key={supplier.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card hover className="relative overflow-hidden">
                {/* Color Accent Bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-2"
                  style={{ backgroundColor: supplier.color }}
                />

                <div className="pt-2 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="p-3 rounded-lg"
                        style={{
                          backgroundColor: supplier.color + '20',
                        }}
                      >
                        <Flame
                          className="h-6 w-6"
                          style={{ color: supplier.color }}
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {supplier.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Gas Supplier
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-6 h-6 rounded border-2 border-gray-300 dark:border-gray-600"
                        style={{ backgroundColor: supplier.color }}
                      />
                      <span className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                        {supplier.color}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Link to={`/suppliers/${supplier.id}`}>
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          aria-label="Edit supplier"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(supplier.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        aria-label="Delete supplier"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Color Legend */}
      <Card title="Supplier Color Guide">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(SUPPLIER_COLORS).map(([name, color]) => (
            <div key={name} className="flex items-center space-x-3">
              <div
                className="w-8 h-8 rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-sm"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{name}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
