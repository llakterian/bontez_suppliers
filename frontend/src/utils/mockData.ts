/**
 * Mock Data Generator for Testing
 * Generates realistic Kenyan gas distribution data
 */

import type { Alert } from '../components/dashboard/AlertsFeed';

export function generateAlertMockData(): Alert[] {
  const alerts: Alert[] = [
    {
      id: '1',
      type: 'lowStock',
      urgency: 'critical',
      title: 'Critical Stock Alert',
      message: '12Kg cylinders critically low - Only 5 units remaining in Nairobi warehouse',
      swahiliMessage: 'Silinda za Kilo 12 zimepungua sana - Zimebaki 5 tu katika ghala ya Nairobi',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      read: false,
      actionable: true,
      metadata: {
        productId: 2,
        stockLevel: 5,
      },
    },
    {
      id: '2',
      type: 'overduePayment',
      urgency: 'critical',
      title: 'Overdue Payment Alert',
      message: 'John Kamau - Payment overdue by 45 days (KES 85,000)',
      swahiliMessage: 'John Kamau - Malipo yamechelewa siku 45 (KES 85,000)',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: false,
      actionable: true,
      metadata: {
        clientId: 12,
        amount: 85000,
        daysOverdue: 45,
      },
    },
    {
      id: '3',
      type: 'lowStock',
      urgency: 'warning',
      title: 'Low Stock Warning',
      message: '6Kg cylinders running low - 15 units remaining',
      swahiliMessage: 'Silinda za Kilo 6 zinaisha - Zimebaki 15',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      read: false,
      actionable: true,
      metadata: {
        productId: 1,
        stockLevel: 15,
      },
    },
    {
      id: '4',
      type: 'newOrder',
      urgency: 'normal',
      title: 'New Order Received',
      message: 'Sarah Mwangi placed an order for 20 units (KES 24,000)',
      swahiliMessage: 'Sarah Mwangi ameagiza vitu 20 (KES 24,000)',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      read: true,
      actionable: false,
      metadata: {
        clientId: 23,
        amount: 24000,
      },
    },
    {
      id: '5',
      type: 'deliveryPending',
      urgency: 'warning',
      title: 'Pending Deliveries',
      message: '3 deliveries scheduled for Nairobi CBD today',
      swahiliMessage: 'Usafirishaji 3 umeandaliwa kwa Nairobi CBD leo',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
      read: false,
      actionable: true,
    },
    {
      id: '6',
      type: 'overduePayment',
      urgency: 'warning',
      title: 'Installment Due Soon',
      message: 'Grace Wanjiru - Installment payment due in 3 days (KES 15,000)',
      swahiliMessage: 'Grace Wanjiru - Malipo ya awamu yanakaribia katika siku 3 (KES 15,000)',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
      read: false,
      actionable: true,
      metadata: {
        clientId: 34,
        amount: 15000,
        daysOverdue: -3,
      },
    },
    {
      id: '7',
      type: 'lowStock',
      urgency: 'warning',
      title: 'Gas Regulators Low',
      message: 'Gas regulators stock below minimum threshold (8 units)',
      swahiliMessage: 'Vipima mafuta vimepungua chini ya kiwango (vitu 8)',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10),
      read: false,
      actionable: true,
      metadata: {
        productId: 5,
        stockLevel: 8,
      },
    },
    {
      id: '8',
      type: 'newOrder',
      urgency: 'normal',
      title: 'Bulk Order from Kericho',
      message: 'Peter Kipchoge ordered 50 x 13Kg cylinders (KES 125,000)',
      swahiliMessage: 'Peter Kipchoge ameagiza silinda 50 za Kilo 13 (KES 125,000)',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
      read: true,
      actionable: false,
      metadata: {
        clientId: 45,
        amount: 125000,
      },
    },
  ];

  return alerts;
}

/**
 * Generate random alert for real-time simulation
 */
export function generateRandomAlert(): Alert {
  const types: Array<'lowStock' | 'overduePayment' | 'newOrder' | 'deliveryPending'> = ['lowStock', 'overduePayment', 'newOrder', 'deliveryPending'];
  const urgencies: Alert['urgency'][] = ['critical', 'warning', 'normal'];
  
  const type = types[Math.floor(Math.random() * types.length)];
  const urgency = urgencies[Math.floor(Math.random() * urgencies.length)];
  
  const messages: Record<typeof types[number], string[]> = {
    lowStock: [
      '13Kg cylinders running low',
      'Gas hoses stock critical',
      'Burners need restocking',
    ],
    overduePayment: [
      'Payment overdue from client',
      'Installment payment pending',
      'Invoice payment delayed',
    ],
    newOrder: [
      'New order received',
      'Bulk order placed',
      'Customer order pending',
    ],
    deliveryPending: [
      'Delivery scheduled today',
      'Urgent delivery request',
      'Multiple deliveries pending',
    ],
  };

  const swahiliMessages: Record<typeof types[number], string[]> = {
    lowStock: [
      'Silinda za Kilo 13 zinaisha',
      'Mifereji ya gesi imepungua',
      'Vichocheo vinahitaji kujazwa',
    ],
    overduePayment: [
      'Malipo yamechelewa kutoka kwa mteja',
      'Malipo ya awamu yanasubiri',
      'Malipo ya ankara yamechelewa',
    ],
    newOrder: [
      'Oda mpya imepokelewa',
      'Oda kubwa imewekwa',
      'Oda ya mteja inasubiri',
    ],
    deliveryPending: [
      'Usafirishaji umeandaliwa leo',
      'Ombi la haraka la usafirishaji',
      'Usafirishaji mbalimbali unasubiri',
    ],
  };

  const typeMessages = messages[type];
  const typeSwahiliMessages = swahiliMessages[type];
  
  return {
    id: `alert_${Date.now()}_${Math.random()}`,
    type,
    urgency,
    title: type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1'),
    message: typeMessages[Math.floor(Math.random() * typeMessages.length)] || 'New alert',
    swahiliMessage: typeSwahiliMessages[Math.floor(Math.random() * typeSwahiliMessages.length)],
    timestamp: new Date(),
    read: false,
    actionable: Math.random() > 0.5,
    metadata: {
      amount: Math.floor(Math.random() * 100000) + 5000,
      stockLevel: Math.floor(Math.random() * 20) + 1,
    },
  };
}

/**
 * Kenyan gas brands with proper branding
 */
export const KENYAN_GAS_BRANDS = [
  { name: 'Top Gas', color: '#dc2626', phone: '0712345678' },
  { name: 'K-Gas', color: '#000000', phone: '0723456789' },
  { name: 'Total Gas', color: '#ea580c', phone: '0734567890' },
  { name: 'Rubis Gas', color: '#16a34a', phone: '0745678901' },
  { name: 'OiLibya Gas', color: '#92400e', phone: '0756789012' },
  { name: 'Hashi Gas', color: '#eab308', phone: '0767890123' },
  { name: 'Pro Gas', color: '#2563eb', phone: '0778901234' },
  { name: 'Hass Gas', color: '#9333ea', phone: '0789012345' },
];
