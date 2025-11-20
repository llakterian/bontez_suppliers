import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  Phone,
  CreditCard,
  Palette,
  QrCode,
  Check,
  ChevronRight,
  ChevronLeft,
  MessageSquare,
} from 'lucide-react';
import QRCode from 'react-qr-code';
import toast from 'react-hot-toast';
import Button from '../common/Button';
import Input from '../common/Input';
import Card from '../common/Card';
import { suppliersApi } from '../../services/api';
import { generateSupplierQRData, generateWhatsAppQR, validateKenyanPhone, formatKenyanPhone } from '../../utils/qrGenerator';
import { t } from '../../i18n/swahili';

const supplierSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color code'),
  phone: z.string().refine(validateKenyanPhone, 'Invalid Kenyan phone number'),
  whatsapp: z.string().refine(validateKenyanPhone, 'Invalid WhatsApp number').optional(),
  email: z.string().email('Invalid email').optional(),
  creditLimit: z.number().min(0, 'Credit limit cannot be negative'),
  notes: z.string().optional(),
});

type SupplierFormData = z.infer<typeof supplierSchema>;

interface SupplierOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  editingSupplier?: any;
}

const KENYAN_GAS_BRANDS = [
  { name: 'Top Gas', color: '#dc2626' },
  { name: 'K-Gas', color: '#000000' },
  { name: 'Total Gas', color: '#ea580c' },
  { name: 'Rubis Gas', color: '#16a34a' },
  { name: 'OiLibya Gas', color: '#92400e' },
  { name: 'Men Gas', color: '#881337' },
  { name: 'Hashi Gas', color: '#eab308' },
  { name: 'Hass Gas', color: '#2563eb' },
  { name: 'Mixed Gas', color: '#9333ea' },
  { name: 'Custom', color: '#6b7280' },
];

const STEPS = [
  { id: 1, title: 'Basic Info', icon: User, description: 'Supplier details' },
  { id: 2, title: 'Contact', icon: Phone, description: 'Communication' },
  { id: 3, title: 'Credit & QR', icon: CreditCard, description: 'Limits & Codes' },
];

export default function SupplierOnboarding({ isOpen, onClose, editingSupplier }: SupplierOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const queryClient = useQueryClient();

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: editingSupplier || {
      name: '',
      color: '#6b7280',
      phone: '',
      whatsapp: '',
      email: '',
      creditLimit: 50000,
      notes: '',
    },
  });

  const watchedValues = watch();

  const createSupplierMutation = useMutation({
    mutationFn: (data: SupplierFormData) => suppliersApi.create(data as any),
    onMutate: async (newSupplier) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['suppliers'] });
      const previousSuppliers = queryClient.getQueryData(['suppliers']);
      
      queryClient.setQueryData(['suppliers'], (old: any) => {
        if (Array.isArray(old)) {
          return [...old, { ...newSupplier, id: Date.now() }];
        }
        return old;
      });

      return { previousSuppliers };
    },
    onError: (_err, _newSupplier, context) => {
      // Rollback on error
      if (context?.previousSuppliers) {
        queryClient.setQueryData(['suppliers'], context.previousSuppliers);
      }
      toast.error('Failed to add supplier');
    },
    onSuccess: () => {
      toast.success(`${t('supplier', 'add', 'Supplier added')} - ${t('status', 'success', 'Success')}!`);
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      onClose();
    },
  });

  const updateSupplierMutation = useMutation({
    mutationFn: (data: SupplierFormData & { id: number }) => 
      suppliersApi.update(data.id, data as any),
    onSuccess: () => {
      toast.success('Supplier updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      onClose();
    },
    onError: () => {
      toast.error('Failed to update supplier');
    },
  });

  const onSubmit = (data: SupplierFormData) => {
    if (editingSupplier) {
      updateSupplierMutation.mutate({ ...data, id: editingSupplier.id });
    } else {
      createSupplierMutation.mutate(data);
    }
  };

  const handleBrandSelect = (brand: typeof KENYAN_GAS_BRANDS[0]) => {
    setValue('name', brand.name);
    setValue('color', brand.color);
  };

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const qrData = generateSupplierQRData({
    id: editingSupplier?.id || 0,
    name: watchedValues.name || 'New Supplier',
    type: 'supplier',
    phone: watchedValues.phone,
    whatsapp: watchedValues.whatsapp,
    creditLimit: watchedValues.creditLimit,
  });

  const whatsappQR = watchedValues.whatsapp 
    ? generateWhatsAppQR(watchedValues.whatsapp, `Habari, ${watchedValues.name}`)
    : '';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingSupplier ? t('supplier', 'edit', 'Edit Supplier') : t('supplier', 'add', 'Add Supplier')}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {STEPS[currentStep - 1].description}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      currentStep >= step.id
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                    }`}>
                      {currentStep > step.id ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <step.icon className="h-5 w-5" />
                      )}
                    </div>
                    <p className={`mt-2 text-xs font-medium ${
                      currentStep >= step.id
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`h-1 flex-1 mx-2 ${
                      currentStep > step.id
                        ? 'bg-primary-500'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <AnimatePresence mode="wait">
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Gas Brand (Swahili: <span className="text-primary-600">Chagua Chapa ya Gesi</span>)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {KENYAN_GAS_BRANDS.map((brand) => (
                        <button
                          key={brand.name}
                          type="button"
                          onClick={() => handleBrandSelect(brand)}
                          className={`p-3 border-2 rounded-lg transition-all hover:scale-105 ${
                            watchedValues.name === brand.name
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}
                        >
                          <div
                            className="w-8 h-8 rounded-full mx-auto mb-2"
                            style={{ backgroundColor: brand.color }}
                          />
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {brand.name}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label={`${t('supplier', 'name', 'Supplier Name')} *`}
                        placeholder="e.g., Top Gas Distribution"
                        error={errors.name?.message}
                      />
                    )}
                  />

                  <Controller
                    name="color"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          <Palette className="inline h-4 w-4 mr-1" />
                          Brand Color *
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            {...field}
                            type="color"
                            className="h-12 w-20 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
                          />
                          <Input
                            {...field}
                            placeholder="#000000"
                            className="flex-1"
                          />
                        </div>
                        {errors.color && (
                          <p className="mt-1 text-sm text-red-600">{errors.color.message}</p>
                        )}
                      </div>
                    )}
                  />
                </motion.div>
              )}

              {/* Step 2: Contact */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="space-y-4"
                >
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <div className="relative">
                          <Input
                            {...field}
                            label={`${t('supplier', 'contact', 'Phone Number')} *`}
                            placeholder="0712 345 678 or 254712345678"
                            error={errors.phone?.message}
                          />
                          <Phone className="absolute right-3 top-10 h-5 w-5 text-gray-400" />
                        </div>
                        {field.value && validateKenyanPhone(field.value) && (
                          <p className="mt-1 text-sm text-green-600">
                            ✓ {formatKenyanPhone(field.value)}
                          </p>
                        )}
                      </div>
                    )}
                  />

                  <Controller
                    name="whatsapp"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <div className="relative">
                          <Input
                            {...field}
                            label="WhatsApp Number (Optional)"
                            placeholder="0712 345 678"
                            error={errors.whatsapp?.message}
                          />
                          <MessageSquare className="absolute right-3 top-10 h-5 w-5 text-green-600" />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Swahili: <span className="font-medium">Nambari ya WhatsApp</span>
                        </p>
                      </div>
                    )}
                  />

                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="email"
                        label="Email (Optional)"
                        placeholder="supplier@example.com"
                        error={errors.email?.message}
                      />
                    )}
                  />

                  <Controller
                    name="notes"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Notes (Optional)
                        </label>
                        <textarea
                          {...field}
                          rows={3}
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Additional information about the supplier..."
                        />
                      </div>
                    )}
                  />
                </motion.div>
              )}

              {/* Step 3: Credit & QR */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="space-y-6"
                >
                  <Controller
                    name="creditLimit"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <div className="relative">
                          <Input
                            {...field}
                            type="number"
                            label={`${t('supplier', 'creditLimit', 'Credit Limit')} (KES) *`}
                            placeholder="50000"
                            error={errors.creditLimit?.message}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                          <CreditCard className="absolute right-3 top-10 h-5 w-5 text-gray-400" />
                        </div>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          Swahili: <span className="font-medium">{t('supplier', 'creditLimit', 'Kikomo cha Mkopo')}</span>
                        </p>
                      </div>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Supplier QR Code */}
                    <Card className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <QrCode className="h-5 w-5 text-primary-600" />
                        <h4 className="font-semibold text-gray-900 dark:text-white">Supplier QR</h4>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <QRCode value={qrData} size={150} className="mx-auto" />
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
                        Scan for supplier details
                      </p>
                    </Card>

                    {/* WhatsApp QR Code */}
                    {whatsappQR && (
                      <Card className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <MessageSquare className="h-5 w-5 text-green-600" />
                          <h4 className="font-semibold text-gray-900 dark:text-white">WhatsApp QR</h4>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                          <QRCode value={whatsappQR} size={150} className="mx-auto" />
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
                          Scan to chat on WhatsApp
                        </p>
                      </Card>
                    )}
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      🔍 QR Code Uses:
                    </h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                      <li>• Inventory tracking and stock management</li>
                      <li>• Quick supplier contact via WhatsApp</li>
                      <li>• Mobile app integration for deliveries</li>
                      <li>• Print on delivery notes and invoices</li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer Actions */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Step {currentStep} of {STEPS.length}
              </div>
              
              <div className="flex items-center gap-3">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    icon={<ChevronLeft className="h-5 w-5" />}
                  >
                    {t('actions', 'previous', 'Previous')}
                  </Button>
                )}

                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2"
                  >
                    {t('actions', 'next', 'Next')}
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    isLoading={createSupplierMutation.isPending || updateSupplierMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    <Check className="h-5 w-5" />
                    {editingSupplier ? t('actions', 'save', 'Save') : t('actions', 'submit', 'Submit')}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
