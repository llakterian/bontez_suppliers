import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  AlertCircle,
  Package,
  CreditCard,
  TrendingUp,
  X,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../common/Card';
import Button from '../common/Button';
import { t, getUrgencyColor, formatKES } from '../../i18n/swahili';

export interface Alert {
  id: string;
  type: 'lowStock' | 'overduePayment' | 'newOrder' | 'deliveryPending' | 'general';
  urgency: 'critical' | 'warning' | 'normal';
  title: string;
  message: string;
  swahiliMessage?: string;
  timestamp: Date;
  read: boolean;
  actionable?: boolean;
  metadata?: {
    supplierId?: number;
    productId?: number;
    clientId?: number;
    amount?: number;
    daysOverdue?: number;
    stockLevel?: number;
  };
}

interface AlertsFeedProps {
  className?: string;
  maxAlerts?: number;
  showFilters?: boolean;
}

// Mock data generator - In production, this comes from API
function generateMockAlerts(): Alert[] {
  return [
    {
      id: '1',
      type: 'lowStock',
      urgency: 'critical',
      title: t('alerts', 'lowStock', 'Low Stock Alert'),
      message: '12Kg cylinders critically low (5 units remaining)',
      swahiliMessage: 'Silinda za Kilo 12 zimepungua sana (zimebaki 5)',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 min ago
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
      title: t('alerts', 'overduePayment', 'Overdue Payment'),
      message: 'Payment from John Kamau overdue by 45 days (KES 85,000)',
      swahiliMessage: 'Malipo ya John Kamau yamechelewa kwa siku 45 (KES 85,000)',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
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
      title: t('alerts', 'stockAlert', 'Stock Warning'),
      message: '6Kg cylinders running low (15 units remaining)',
      swahiliMessage: 'Silinda za Kilo 6 zinaisha (zimebaki 15)',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
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
      title: t('alerts', 'newOrder', 'New Order'),
      message: 'New order from Sarah Mwangi (20 units - KES 24,000)',
      swahiliMessage: 'Oda mpya kutoka Sarah Mwangi (vitu 20 - KES 24,000)',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
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
      title: t('alerts', 'deliveryPending', 'Delivery Pending'),
      message: '3 deliveries scheduled for Nairobi CBD today',
      swahiliMessage: 'Usafirishaji 3 unasubiri kwa Nairobi CBD leo',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      read: false,
      actionable: true,
      metadata: {},
    },
    {
      id: '6',
      type: 'overduePayment',
      urgency: 'warning',
      title: t('alerts', 'paymentDue', 'Payment Due Soon'),
      message: 'Installment payment due in 3 days (KES 15,000)',
      swahiliMessage: 'Malipo ya awamu yanakaribia katika siku 3 (KES 15,000)',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
      read: false,
      actionable: true,
      metadata: {
        amount: 15000,
        daysOverdue: -3, // Negative means upcoming
      },
    },
  ];
}

const ALERT_ICONS = {
  lowStock: Package,
  overduePayment: CreditCard,
  newOrder: TrendingUp,
  deliveryPending: Truck,
  general: AlertCircle,
};

export default function AlertsFeed({ className = '', maxAlerts = 10, showFilters = true }: AlertsFeedProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all');
  const [showSwahili, setShowSwahili] = useState(false);

  useEffect(() => {
    // Load mock alerts
    setAlerts(generateMockAlerts());

    // Simulate real-time alerts
    const interval = setInterval(() => {
      // Randomly add a new alert (10% chance every 30 seconds)
      if (Math.random() < 0.1) {
        const newAlert: Alert = {
          id: `${Date.now()}`,
          type: 'newOrder',
          urgency: 'normal',
          title: 'New Order',
          message: `New order received (KES ${Math.floor(Math.random() * 50000)})`,
          timestamp: new Date(),
          read: false,
        };
        
        setAlerts(prev => [newAlert, ...prev].slice(0, maxAlerts));
        toast.success('New alert received!');
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [maxAlerts]);

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'unread') return !alert.read;
    if (filter === 'critical') return alert.urgency === 'critical';
    return true;
  }).slice(0, maxAlerts);

  const unreadCount = alerts.filter(a => !a.read).length;
  const criticalCount = alerts.filter(a => a.urgency === 'critical').length;

  const markAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, read: true } : alert
    ));
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    toast.success(t('alerts', 'dismiss', 'Alert dismissed'));
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, read: true })));
    toast.success(t('alerts', 'markRead', 'All marked as read'));
  };

  const getTimeAgo = (date: Date): string => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const getSwahiliTimeAgo = (date: Date): string => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    
    if (seconds < 60) return t('time', 'now', 'Sasa hivi');
    if (seconds < 3600) return `${Math.floor(seconds / 60)} ${t('time', 'minutesAgo', 'dakika zilizopita')}`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} ${t('time', 'hoursAgo', 'masaa yaliyopita')}`;
    return `${Math.floor(seconds / 86400)} ${t('time', 'daysAgo', 'siku zilizopita')}`;
  };

  return (
    <Card className={`${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {t('alerts', 'viewAll', 'Alerts')}
          </h3>
          
          {/* Badge Counters */}
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold bg-primary-500 text-white rounded-full">
                {unreadCount}
              </span>
            )}
            {criticalCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {criticalCount}
              </span>
            )}
          </div>
        </div>

        {/* Language Toggle */}
        <button
          onClick={() => setShowSwahili(!showSwahili)}
          className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          {showSwahili ? 'EN' : 'SW'}
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <Filter className="h-4 w-4 text-gray-500" />
          {(['all', 'unread', 'critical'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                filter === f
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="ml-auto text-xs text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
            >
              <CheckCircle2 className="h-3 w-3" />
              {t('alerts', 'markRead', 'Mark all read')}
            </button>
          )}
        </div>
      )}

      {/* Alerts List */}
      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {filteredAlerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-3" />
              <p className="text-gray-600 dark:text-gray-400">
                {showSwahili ? 'Hakuna taarifa' : 'No alerts'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {showSwahili ? t('status', 'normal', 'Hali ya kawaida') : t('status', 'normal', 'All clear!')}
              </p>
            </motion.div>
          ) : (
            filteredAlerts.map(alert => {
              const Icon = ALERT_ICONS[alert.type];
              
              return (
                <motion.div
                  key={alert.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`p-4 rounded-lg border-l-4 transition-all cursor-pointer ${
                    getUrgencyColor(alert.urgency)
                  } ${
                    !alert.read ? 'bg-opacity-50' : 'opacity-75'
                  } hover:shadow-md`}
                  onClick={() => !alert.read && markAsRead(alert.id)}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={`p-2 rounded-full ${
                      alert.urgency === 'critical' ? 'bg-red-100 dark:bg-red-900/30' :
                      alert.urgency === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                      'bg-green-100 dark:bg-green-900/30'
                    }`}>
                      <Icon className={`h-5 w-5 ${
                        alert.urgency === 'critical' ? 'text-red-600' :
                        alert.urgency === 'warning' ? 'text-yellow-600' :
                        'text-green-600'
                      }`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                          {alert.title}
                        </h4>
                        
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {/* Unread indicator */}
                          {!alert.read && (
                            <div className="w-2 h-2 rounded-full bg-primary-500" />
                          )}
                          
                          {/* Dismiss button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              dismissAlert(alert.id);
                            }}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                          >
                            <X className="h-4 w-4 text-gray-500" />
                          </button>
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                        {showSwahili && alert.swahiliMessage ? alert.swahiliMessage : alert.message}
                      </p>

                      {/* Metadata */}
                      {alert.metadata && (
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-600 dark:text-gray-400">
                          {alert.metadata.amount && (
                            <span className="font-semibold text-primary-600 dark:text-primary-400">
                              {formatKES(alert.metadata.amount)}
                            </span>
                          )}
                          {alert.metadata.daysOverdue !== undefined && alert.metadata.daysOverdue > 0 && (
                            <span className="text-red-600 dark:text-red-400">
                              {alert.metadata.daysOverdue} {showSwahili ? 'siku zilizopita' : 'days overdue'}
                            </span>
                          )}
                          {alert.metadata.stockLevel !== undefined && (
                            <span>
                              {alert.metadata.stockLevel} {showSwahili ? 'zimebaki' : 'units left'}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Timestamp */}
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>
                          {showSwahili ? getSwahiliTimeAgo(alert.timestamp) : getTimeAgo(alert.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  {alert.actionable && !alert.read && (
                    <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(alert.id);
                          toast.success(showSwahili ? 'Imeangaliwa' : 'Reviewed');
                        }}
                      >
                        {showSwahili ? 'Angalia' : 'Review'}
                      </Button>
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      {filteredAlerts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
          <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
            {showSwahili ? 'Ona zote' : t('alerts', 'viewAll', 'View all alerts')} →
          </button>
        </div>
      )}
    </Card>
  );
}
