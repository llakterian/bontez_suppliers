import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { clientsApi } from '../services/api';

export default function ClientForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditing && id) {
      fetchClient(Number(id));
    }
  }, [id, isEditing]);

  const fetchClient = async (clientId: number) => {
    try {
      setLoading(true);
      const client = await clientsApi.getById(clientId);
      setFormData({
        name: client.name,
        phone: client.phone,
        email: client.email || '',
        address: client.address || '',
      });
    } catch (error) {
      toast.error('Failed to load client');
      console.error('Fetch client error:', error);
      navigate('/clients');
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
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
        await clientsApi.update(Number(id), formData);
        toast.success('Client updated successfully');
      } else {
        await clientsApi.create(formData);
        toast.success('Client created successfully');
      }
      navigate('/clients');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save client');
      console.error('Save client error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
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
          onClick={() => navigate('/clients')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Client' : 'Add New Client'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {isEditing ? 'Update client information' : 'Register a new customer'}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="John Doe"
            required
          />

          <Input
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            placeholder="+254 712 345 678"
            required
          />

          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="john@example.com"
          />

          <Input
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            error={errors.address}
            placeholder="Nairobi, Kenya"
          />

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/clients')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={submitting}
              icon={<Save className="h-5 w-5" />}
            >
              {isEditing ? 'Update Client' : 'Create Client'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
