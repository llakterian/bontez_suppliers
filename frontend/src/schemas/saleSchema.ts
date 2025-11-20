import { z } from 'zod';

export const saleWizardSchema = z.object({
  clientId: z.number().min(1, 'Please select a client'),
  supplierId: z.number().optional(),
  items: z.array(z.object({
    productId: z.number(),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    unitPrice: z.number().min(0),
  })).min(1, 'Add at least one item'),
  paymentMethod: z.enum(['cash', 'mpesa', 'installment']),
  mpesaCode: z.string().optional(),
  notes: z.string().optional(),
});

export type SaleFormData = z.infer<typeof saleWizardSchema>;
