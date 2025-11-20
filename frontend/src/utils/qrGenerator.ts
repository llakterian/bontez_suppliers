/**
 * QR Code Generation Utilities for Supplier Inventory Management
 * Generates QR codes for supplier identification, inventory tracking, and contact sharing
 */

export interface SupplierQRData {
  id: number;
  name: string;
  type: 'supplier' | 'inventory' | 'contact';
  phone?: string;
  whatsapp?: string;
  creditLimit?: number;
}

/**
 * Generate QR code data string for supplier
 */
export function generateSupplierQRData(supplier: SupplierQRData): string {
  const data = {
    type: supplier.type,
    id: supplier.id,
    name: supplier.name,
    phone: supplier.phone,
    whatsapp: supplier.whatsapp,
    creditLimit: supplier.creditLimit,
    timestamp: Date.now(),
  };
  
  return JSON.stringify(data);
}

/**
 * Generate WhatsApp contact QR data
 */
export function generateWhatsAppQR(phone: string, message?: string): string {
  // Format: wa.me/254XXXXXXXXX?text=Hello
  const formattedPhone = phone.replace(/\D/g, '');
  const kenyanPhone = formattedPhone.startsWith('0') 
    ? `254${formattedPhone.substring(1)}` 
    : formattedPhone;
  
  const encodedMessage = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${kenyanPhone}${encodedMessage}`;
}

/**
 * Generate inventory tracking QR
 */
export function generateInventoryQR(supplierId: number, productType: string, batchNumber?: string): string {
  const data = {
    type: 'inventory',
    supplierId,
    productType,
    batchNumber: batchNumber || `BATCH-${Date.now()}`,
    scanDate: new Date().toISOString(),
  };
  
  return JSON.stringify(data);
}

/**
 * Parse scanned QR code data
 */
export function parseQRData(qrString: string): any {
  try {
    return JSON.parse(qrString);
  } catch {
    // If not JSON, return as-is (might be URL or plain text)
    return { raw: qrString };
  }
}

/**
 * Validate Kenyan phone number
 */
export function validateKenyanPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  
  // Kenyan numbers: 07XX, 01XX, or +254
  return /^(0[17]\d{8}|254[17]\d{8})$/.test(cleaned);
}

/**
 * Format phone for display
 */
export function formatKenyanPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('254')) {
    return `+254 ${cleaned.substring(3, 6)} ${cleaned.substring(6, 9)} ${cleaned.substring(9)}`;
  } else if (cleaned.startsWith('0')) {
    return `${cleaned.substring(0, 4)} ${cleaned.substring(4, 7)} ${cleaned.substring(7)}`;
  }
  
  return phone;
}
