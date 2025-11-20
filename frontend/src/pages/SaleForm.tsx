import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { salesApi, clientsApi, suppliersApi, productsApi } from '../services/api';
import type { Client, Supplier, Product } from '../types';

interface SaleItemInput {
  product_id: number;
  quantity: number;
  price: number;
}

export default function SaleForm() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [formData, setFormData] = useState({
    client_id: '',
    supplier_id: '',
    payment_method: 'cash',
    mpesa_code: '',
    num_installments: 2,
    notes: '',
  });

  const [items, setItems] = useState<SaleItemInput[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [clientsData, suppliersData, productsData] = await Promise.all([
        clientsApi.getAll(),
        suppliersApi.getAll(),
        productsApi.getAll(),
      ]);
      setClients(clientsData.clients);
      setSuppliers(suppliersData);
      setProducts(productsData);
    } catch (error) {
      toast.error('Failed to load form data');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    if (!selectedProduct) {
      toast.error('Please select a product');
      return;
    }

    const product = products.find((p) => p.id === Number(selectedProduct));
    if (!product) return;

    const existingItem = items.find((item) => item.product_id === product.id);
    if (existingItem) {
      setItems(
        items.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setItems([...items, { product_id: product.id, quantity, price: product.price }]);
    }

    setSelectedProduct('');
    setQuantity(1);
    toast.success('Item added');
  };

  const handleRemoveItem = (productId: number) => {
    setItems(items.filter((item) => item.product_id !== productId));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.client_id) {
      toast.error('Please select a client');
      return;
    }

    if (items.length === 0) {
      toast.error('Please add at least one item');
      return;
    }

    if (formData.payment_method === 'mpesa' && !formData.mpesa_code) {
      toast.error('Please enter M-Pesa code');
      return;
    }

    try {
      setSubmitting(true);
      const saleData = {
        client_id: Number(formData.client_id),
        supplier_id: formData.supplier_id ? Number(formData.supplier_id) : undefined,
        payment_method: formData.payment_method,
        mpesa_code: formData.payment_method === 'mpesa' ? formData.mpesa_code : undefined,
        num_installments: formData.payment_method === 'installment' ? formData.num_installments : undefined,
        items: items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
        notes: formData.notes,
      };

      await salesApi.create(saleData);
      toast.success('Sale created successfully');
      navigate('/sales');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create sale');
      console.error('Save sale error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const total = calculateTotal();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/sales')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create New Sale
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Record a new gas sales transaction
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer & Supplier Selection */}
        <Card title="Customer & Supplier">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Client <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.client_id}
                onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">Select a client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name} - {client.phone}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Supplier
              </label>
              <select
                value={formData.supplier_id}
                onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select a supplier (optional)</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Products */}
        <Card title="Products">
          <div className="space-y-4">
            {/* Add Item */}
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {formatCurrency(product.price)}
                  </option>
                ))}
              </select>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                placeholder="Qty"
                className="w-24"
              />
              <Button type="button" onClick={handleAddItem} icon={<Plus className="h-4 w-4" />}>
                Add
              </Button>
            </div>

            {/* Items List */}
            {items.length > 0 && (
              <div className="mt-4 space-y-2">
                {items.map((item) => {
                  const product = products.find((p) => p.id === item.product_id);
                  return (
                    <div
                      key={item.product_id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {product?.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {item.quantity} x {formatCurrency(item.price)} = {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.product_id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
                <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">Total:</span>
                  <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Payment Method */}
        <Card title="Payment Method">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {['cash', 'mpesa', 'installment'].map((method) => (
                <label
                  key={method}
                  className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.payment_method === method
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value={method}
                    checked={formData.payment_method === method}
                    onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                    className="mr-2"
                  />
                  <span className="font-medium capitalize">{method}</span>
                </label>
              ))}
            </div>

            {formData.payment_method === 'mpesa' && (
              <Input
                label="M-Pesa Transaction Code"
                value={formData.mpesa_code}
                onChange={(e) => setFormData({ ...formData, mpesa_code: e.target.value })}
                placeholder="ABC123XYZ"
                required
              />
            )}

            {formData.payment_method === 'installment' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Number of Installments
                </label>
                <select
                  value={formData.num_installments}
                  onChange={(e) => setFormData({ ...formData, num_installments: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                >
                  <option value={2}>2 payments</option>
                  <option value={3}>3 payments</option>
                  <option value={4}>4 payments</option>
                  <option value={6}>6 payments</option>
                </select>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Each payment: {formatCurrency(total / formData.num_installments)}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Notes */}
        <Card title="Additional Notes">
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
            placeholder="Any additional information..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          />
        </Card>

        {/* Submit */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="secondary" onClick={() => navigate('/sales')}>
            Cancel
          </Button>
          <Button type="submit" isLoading={submitting} icon={<Save className="h-5 w-5" />}>
            Create Sale
          </Button>
        </div>
      </form>
    </div>
  );
}
