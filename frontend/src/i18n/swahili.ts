/**
 * Swahili Translations for Kenyan Users
 * Cultural localization for gas distribution management
 */

export const swahiliTranslations = {
  // Status messages
  status: {
    normal: 'Hali ya kawaida',
    warning: 'Tahadhari',
    critical: 'Hatari',
    success: 'Imefanikiwa',
    pending: 'Inasubiri',
    active: 'Inafanya kazi',
    inactive: 'Haifanyi kazi',
  },

  // Supplier management
  supplier: {
    add: 'Ongeza Muuzaji',
    edit: 'Hariri Muuzaji',
    delete: 'Futa Muuzaji',
    details: 'Maelezo ya Muuzaji',
    name: 'Jina la Muuzaji',
    contact: 'Mawasiliano',
    creditLimit: 'Kikomo cha Mkopo',
    balance: 'Salio',
    active: 'Muuzaji Hai',
    inactive: 'Muuzaji Haifanyi Kazi',
  },

  // Alerts and notifications
  alerts: {
    lowStock: 'Hisa ya bidhaa imeisha',
    overduePayment: 'Malipo yamechelewa',
    newOrder: 'Oda mpya',
    stockAlert: 'Tahadhari ya hisa',
    paymentDue: 'Malipo yanakaribia',
    criticalStock: 'Hisa hatari',
    deliveryPending: 'Usafirishaji unasubiri',
    viewAll: 'Ona zote',
    markRead: 'Weka alama kuwa imesomwa',
    dismiss: 'Ondoa',
  },

  // Inventory
  inventory: {
    cylinders: 'Silinda',
    '6kg': 'Silinda ya Kilo 6',
    '12kg': 'Silinda ya Kilo 12',
    '13kg': 'Silinda ya Kilo 13',
    accessories: 'Vifaa',
    regulator: 'Kipima Mafuta',
    hose: 'Mfereji',
    stock: 'Hisa',
    restock: 'Jaza tena',
    empty: 'Tupu',
    full: 'Imejaa',
  },

  // Payment
  payment: {
    cash: 'Taslimu',
    mpesa: 'M-Pesa',
    installment: 'Awamu',
    paid: 'Imelipwa',
    pending: 'Inasubiri malipo',
    overdue: 'Imechelewa',
    partial: 'Nusu',
    method: 'Njia ya malipo',
    amount: 'Kiasi',
    balance: 'Salio',
    receipt: 'Risiti',
  },

  // Dashboard
  dashboard: {
    overview: 'Muhtasari',
    sales: 'Mauzo',
    revenue: 'Mapato',
    clients: 'Wateja',
    suppliers: 'Wauzaji',
    reports: 'Ripoti',
    today: 'Leo',
    thisWeek: 'Wiki hii',
    thisMonth: 'Mwezi huu',
    total: 'Jumla',
  },

  // Actions
  actions: {
    add: 'Ongeza',
    edit: 'Hariri',
    delete: 'Futa',
    save: 'Hifadhi',
    cancel: 'Ghairi',
    confirm: 'Thibitisha',
    submit: 'Wasilisha',
    search: 'Tafuta',
    filter: 'Chuja',
    export: 'Hamisha',
    print: 'Chapisha',
    download: 'Pakua',
    upload: 'Pakia',
    next: 'Ifuatayo',
    previous: 'Iliyotangulia',
    close: 'Funga',
  },

  // Common phrases
  common: {
    welcome: 'Karibu',
    hello: 'Habari',
    goodbye: 'Kwaheri',
    thankyou: 'Asante',
    please: 'Tafadhali',
    yes: 'Ndiyo',
    no: 'Hapana',
    loading: 'Inapakia...',
    error: 'Kosa',
    success: 'Mafanikio',
    warning: 'Onyo',
    info: 'Taarifa',
  },

  // Time
  time: {
    now: 'Sasa hivi',
    today: 'Leo',
    yesterday: 'Jana',
    tomorrow: 'Kesho',
    thisWeek: 'Wiki hii',
    lastWeek: 'Wiki iliyopita',
    thisMonth: 'Mwezi huu',
    lastMonth: 'Mwezi uliopita',
    daysAgo: 'siku zilizopita',
    hoursAgo: 'masaa yaliyopita',
    minutesAgo: 'dakika zilizopita',
  },

  // Messages
  messages: {
    confirmDelete: 'Je, una uhakika unataka kufuta?',
    deleteSuccess: 'Imefutwa kwa mafanikio',
    saveSuccess: 'Imehifadhiwa kwa mafanikio',
    updateSuccess: 'Imesasishwa kwa mafanikio',
    error: 'Kosa limetokea',
    noData: 'Hakuna data',
    selectOption: 'Chagua chaguo',
    required: 'Inahitajika',
    invalid: 'Batili',
  },
};

export type SwahiliKey = keyof typeof swahiliTranslations;

/**
 * Get translated text with fallback to English
 */
export function t(
  category: SwahiliKey,
  key: string,
  fallback?: string
): string {
  const translations = swahiliTranslations[category] as any;
  return translations?.[key] || fallback || key;
}

/**
 * Format currency in KES with Swahili context
 */
export function formatKES(amount: number): string {
  return `KSh ${amount.toLocaleString('en-KE')}`;
}

/**
 * Get urgency color based on status
 */
export function getUrgencyColor(urgency: 'critical' | 'warning' | 'normal'): string {
  const colors = {
    critical: 'bg-red-100 text-red-800 border-red-500 dark:bg-red-900/20 dark:text-red-400',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-500 dark:bg-yellow-900/20 dark:text-yellow-400',
    normal: 'bg-green-100 text-green-800 border-green-500 dark:bg-green-900/20 dark:text-green-400',
  };
  
  return colors[urgency];
}
