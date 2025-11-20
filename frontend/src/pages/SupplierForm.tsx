import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Palette } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { suppliersApi } from '../services/api';

const PRESET_COLORS = [
  { name: 'Red', value: '#dc2626' },
  { name: 'Orange', value: '#ea580c' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Green', value: '#16a34a' },
  { name: 'Blue', value: '#2563eb' },
  { name: 'Purple', value: '#9333ea' },
  { name: 'Black', value: '#000000' },
  { name: 'Brown', value: '#92400e' },
  { name: 'Maroon', value: '#881337' },
];

export default function SupplierForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    color: '#dc2626',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditing && id) {
      fetchSupplier(Number(id));
    }
  }, [id, isEditing]);

  const fetchSupplier = async (supplierId: number) => {
    try {
      setLoading(true);
      const supplier = await suppliersApi.getById(supplierId);
      setFormData({
        name: supplier.name,
        color: supplier.color,
      });
    } catch (error) {
      toast.error('Failed to load supplier');
      console.error('Fetch supplier error:', error);
      navigate('/suppliers');
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Supplier name is required';
    }

    if (!formData.color) {
      newErrors.color = 'Color is required';
    } else if (!/^#[0-9A-F]{6}$/i.test(formData.color)) {
      newErrors.color = 'Invalid color format (use hex format like #FF0000)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      setSubmitting(true);
      if (isEditing && id) {
        await suppliersApi.update(Number(id), formData);
        toast.success('Supplier updated successfully');
      } else {
        await suppliersApi.create(formData);
        toast.success('Supplier created successfully');
      }
      navigate('/suppliers');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save supplier');
      console.error('Save supplier error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/suppliers')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Supplier' : 'Add New Supplier'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {isEditing ? 'Update supplier information' : 'Register a new gas supplier'}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Supplier Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Top Gas, K-Gas, etc."
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Brand Color
              <span className="text-red-500 ml-1">*</span>
            </label>

            {/* Preset Colors */}
            <div className="grid grid-cols-5 gap-3 mb-4">
              {PRESET_COLORS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, color: preset.value }))}
                  className={`relative h-12 rounded-lg border-2 transition-all ${
                    formData.color === preset.value
                      ? 'border-primary-500 ring-2 ring-primary-500 ring-offset-2'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: preset.value }}
                  title={preset.name}
                >
                  {formData.color === preset.value && (
                    <Palette className="h-5 w-5 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  )}
                </button>
              ))}
            </div>

            {/* Custom Color Input */}
            <div className="flex items-center space-x-3">
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="h-12 w-20 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
              />
              <Input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                error={errors.color}
                placeholder="#FF0000"
                className="flex-1 font-mono uppercase"
              />
              <div
                className="h-12 w-20 rounded-lg border-2 border-gray-300 dark:border-gray-600"
                style={{ backgroundColor: formData.color }}
              />
            </div>
          </div>

          {/* Preview */}
          <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Preview:
            </p>
            <div className="flex items-center space-x-4">
              <div
                className="px-6 py-3 rounded-lg text-white font-semibold shadow-lg"
                style={{ backgroundColor: formData.color }}
              >
                {formData.name || 'Supplier Name'}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/suppliers')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={submitting}
              icon={<Save className="h-5 w-5" />}
            >
              {isEditing ? 'Update Supplier' : 'Create Supplier'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
