import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Phone, Mail, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Input from '../components/common/Input';
import { clientsApi } from '../services/api';
import type { Client } from '../types';

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const result = await clientsApi.getAll();
      setClients(result.clients);
    } catch (error) {
      toast.error('Failed to load clients');
      console.error('Clients error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this client?')) return;

    try {
      await clientsApi.delete(id);
      toast.success('Client deleted successfully');
      fetchClients();
    } catch (error) {
      toast.error('Failed to delete client');
      console.error('Delete error:', error);
    }
  };

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.includes(searchQuery) ||
    client.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Clients</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            Manage your customer database
          </p>
        </div>
        <Link to="/clients/new" className="w-full sm:w-auto">
          <Button icon={<Plus className="h-5 w-5" />} className="w-full sm:w-auto">
            Add Client
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search by name, phone, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Clients Grid */}
      {filteredClients.length === 0 ? (
        <Card>
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            {searchQuery ? 'No clients found matching your search' : 'No clients yet'}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card hover className="h-full">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {client.name}
                      </h3>
                    </div>
                    <div className="flex space-x-2">
                      <Link to={`/clients/${client.id}`}>
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          aria-label="Edit client"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(client.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        aria-label="Delete client"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{client.phone}</span>
                    </div>
                    {client.email && (
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Mail className="h-4 w-4 mr-2" />
                        <span>{client.email}</span>
                      </div>
                    )}
                    {client.address && (
                      <div className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="h-4 w-4 mr-2 mt-0.5" />
                        <span>{client.address}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Registered {new Date(client.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
