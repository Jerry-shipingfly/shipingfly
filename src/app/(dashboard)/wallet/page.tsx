'use client';

import React, { useState } from 'react';
import { Plus, CreditCard, DollarSign, Send, Building2, Download, Filter, Calendar } from 'lucide-react';
import { Button, Select, Modal, Input, Badge, Card, CardBody, Empty } from '@/components/ui';
import { BalanceCard } from './components/BalanceCard';
import { TransactionList } from './components/TransactionList';
import { cn, formatDate, formatPrice } from '@/utils/helpers';
import { useTranslation } from '@/hooks/useTranslation';
import { PageHeader } from '@/components/common/PageHeader';

/**
 * Wallet Page with Tabs
 * @description Combined wallet page with Transaction History and Invoices tabs
 */

// Tab types
type TabType = 'transactions' | 'invoices';

// Mock transaction data
const mockTransactions = [
  {
    id: '1',
    type: 'recharge' as const,
    amount: 500,
    status: 'completed' as const,
    createdAt: '2024-01-15T10:30:00Z',
    note: 'Account recharge',
  },
  {
    id: '2',
    type: 'payment' as const,
    amount: -125.50,
    status: 'completed' as const,
    createdAt: '2024-01-16T14:20:00Z',
    note: 'Order payment #ORD-2024-001',
  },
  {
    id: '3',
    type: 'refund' as const,
    amount: 45.00,
    status: 'completed' as const,
    createdAt: '2024-01-18T09:15:00Z',
    note: 'Order refund #ORD-2024-001',
  },
  {
    id: '4',
    type: 'commission' as const,
    amount: 25.60,
    status: 'pending' as const,
    createdAt: '2024-01-20T16:45:00Z',
    note: 'Referral commission',
  },
  {
    id: '5',
    type: 'recharge' as const,
    amount: 1000,
    status: 'failed' as const,
    createdAt: '2024-01-22T11:00:00Z',
    note: 'Recharge failed - Payment timeout',
  },
];

// Mock invoice data
interface Invoice {
  id: string;
  period: string;
  amount: number;
  consumption: number;
  status: 'paid' | 'pending' | 'overdue';
  createdAt: string;
  dueDate: string;
}

const mockInvoices: Invoice[] = [
  {
    id: 'INV-2024-001',
    period: 'January 2024',
    amount: 1250.50,
    consumption: 1180.00,
    status: 'paid',
    createdAt: '2024-01-01T00:00:00Z',
    dueDate: '2024-01-31T23:59:59Z',
  },
  {
    id: 'INV-2024-002',
    period: 'February 2024',
    amount: 980.00,
    consumption: 920.00,
    status: 'paid',
    createdAt: '2024-02-01T00:00:00Z',
    dueDate: '2024-02-29T23:59:59Z',
  },
  {
    id: 'INV-2024-003',
    period: 'March 2024',
    amount: 1560.00,
    consumption: 1450.00,
    status: 'pending',
    createdAt: '2024-03-01T00:00:00Z',
    dueDate: '2024-03-31T23:59:59Z',
  },
  {
    id: 'INV-2024-004',
    period: 'April 2024',
    amount: 890.00,
    consumption: 820.00,
    status: 'pending',
    createdAt: '2024-04-01T00:00:00Z',
    dueDate: '2024-04-30T23:59:59Z',
  },
  {
    id: 'INV-2024-005',
    period: 'May 2024',
    amount: 2100.00,
    consumption: 1980.00,
    status: 'overdue',
    createdAt: '2024-05-01T00:00:00Z',
    dueDate: '2024-05-31T23:59:59Z',
  },
];

// Payment methods
const PAYMENT_METHODS = [
  {
    id: 'paypal',
    name: 'PayPal',
    icon: 'paypal',
    color: '#003087',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  {
    id: 'credit_card',
    name: 'Credit Card',
    icon: 'credit_card',
    color: '#1A1F71',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    icon: 'bank_transfer',
    color: '#059669',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
  },
  {
    id: 'stripe',
    name: 'Stripe',
    icon: 'stripe',
    color: '#635BFF',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  {
    id: 'payoneer',
    name: 'Payoneer',
    icon: 'payoneer',
    color: '#FF4800',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  {
    id: 'western_union',
    name: 'Western Union',
    icon: 'western_union',
    color: '#FFDD00',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
  },
];

// Status mapping for invoices
const statusVariants: Record<Invoice['status'], 'success' | 'warning' | 'danger'> = {
  paid: 'success',
  pending: 'warning',
  overdue: 'danger',
};

const statusLabels: Record<Invoice['status'], string> = {
  paid: 'Paid',
  pending: 'Pending',
  overdue: 'Overdue',
};

/**
 * Payment Method Icon Component
 */
function PaymentMethodIcon({ method, size = 32 }: { method: string; size?: number }) {
  switch (method) {
    case 'paypal':
      return (
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#003087]">
          <span className="text-white font-bold text-sm">P</span>
        </div>
      );
    case 'credit_card':
      return (
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700">
          <CreditCard className="w-4 h-4 text-white" />
        </div>
      );
    case 'bank_transfer':
      return (
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-600">
          <Building2 className="w-4 h-4 text-white" />
        </div>
      );
    case 'stripe':
      return (
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#635BFF]">
          <span className="text-white font-bold text-xs">S</span>
        </div>
      );
    case 'payoneer':
      return (
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#FF4800]">
          <span className="text-white font-bold text-xs">P</span>
        </div>
      );
    case 'western_union':
      return (
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-yellow-500">
          <Send className="w-4 h-4 text-black" />
        </div>
      );
    default:
      return (
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-400">
          <DollarSign className="w-4 h-4 text-white" />
        </div>
      );
  }
}

export default function WalletPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('transactions');

  // Recharge modal state
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('100');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

  // Invoice filter state
  const [filterMonth, setFilterMonth] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Wallet data
  const walletData = {
    availableBalance: 3250.50,
    frozenBalance: 200.00,
  };

  // Filter invoices
  const filteredInvoices = mockInvoices.filter((invoice) => {
    const matchMonth = !filterMonth || invoice.period.includes(filterMonth);
    const matchStatus = !filterStatus || invoice.status === filterStatus;
    return matchMonth && matchStatus;
  });

  // Get month options (past 12 months)
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthStr = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    return { value: `${date.getFullYear()}-${date.getMonth() + 1}`, label: monthStr };
  });

  // Get recharge amount
  const getRechargeAmount = () => {
    const amount = parseInt(rechargeAmount, 10);
    return isNaN(amount) ? 0 : amount;
  };

  // Handle confirm recharge
  const handleConfirmRecharge = () => {
    const amount = getRechargeAmount();
    if (!amount || amount <= 0) {
      alert(t('wallet.pleaseEnterValidAmount'));
      return;
    }
    setIsRechargeModalOpen(false);
    setIsPaymentModalOpen(true);
  };

  // Handle payment confirm
  const handlePaymentConfirm = () => {
    if (!selectedPaymentMethod) {
      alert(t('wallet.pleaseSelectPaymentMethod'));
      return;
    }
    setIsPaymentModalOpen(false);
    setRechargeAmount('100');
    setSelectedPaymentMethod(null);
    alert(t('messages.operationSuccess'));
  };

  // Download invoice
  const handleDownloadInvoice = (invoice: Invoice) => {
    console.log('Download invoice:', invoice.id);
    alert(`Starting download of invoice ${invoice.id}`);
  };

  // Tabs configuration
  const tabs = [
    { id: 'transactions' as TabType, label: t('wallet.transactionHistory') || 'Transaction History' },
    { id: 'invoices' as TabType, label: t('wallet.invoices') || 'Invoices' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={t('wallet.title') || 'Wallet'}
        subtitle={t('wallet.manageBalance') || 'Manage your balance, transactions and invoices'}
        actions={
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsRechargeModalOpen(true)}
          >
            {t('wallet.recharge') || 'Recharge'}
          </Button>
        }
      />

      {/* Balance Card */}
      <BalanceCard
        availableBalance={walletData.availableBalance}
        frozenBalance={walletData.frozenBalance}
        onRecharge={() => setIsRechargeModalOpen(true)}
      />

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Tab Headers */}
        <div className="border-b border-gray-200">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200',
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'transactions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  {t('wallet.transactionHistory') || 'Transaction History'}
                </h2>
                <Select
                  options={[
                    { value: 'all', label: t('wallet.allTypes') || 'All Types' },
                    { value: 'recharge', label: t('wallet.recharge') || 'Recharge' },
                    { value: 'payment', label: t('wallet.payment') || 'Payment' },
                    { value: 'refund', label: t('wallet.refund') || 'Refund' },
                    { value: 'commission', label: t('wallet.commission') || 'Commission' },
                  ]}
                  value="all"
                  onChange={(value) => console.log('Filter:', value)}
                  size="sm"
                />
              </div>
              <TransactionList transactions={mockTransactions} />
            </div>
          )}

          {activeTab === 'invoices' && (
            <div className="space-y-6">
              {/* Invoice Filters */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="w-[200px]">
                  <Select
                    label={t('wallet.filterByMonth') || 'Filter by Month'}
                    options={[
                      { value: '', label: t('wallet.allMonths') || 'All Months' },
                      ...monthOptions,
                    ]}
                    value={filterMonth}
                    onChange={setFilterMonth}
                    placeholder={t('wallet.selectMonth') || 'Select month'}
                    size="sm"
                  />
                </div>
                <div className="w-[160px]">
                  <Select
                    label={t('wallet.filterByStatus') || 'Filter by Status'}
                    options={[
                      { value: '', label: t('wallet.allStatuses') || 'All Statuses' },
                      { value: 'paid', label: t('wallet.paid') || 'Paid' },
                      { value: 'pending', label: t('wallet.pending') || 'Pending' },
                      { value: 'overdue', label: t('wallet.overdue') || 'Overdue' },
                    ]}
                    value={filterStatus}
                    onChange={setFilterStatus}
                    placeholder={t('wallet.selectStatus') || 'Select status'}
                    size="sm"
                  />
                </div>
              </div>

              {/* Invoice Table */}
              <div className="overflow-hidden">
                {/* Table header */}
                <div className="bg-gray-50 border-b border-gray-200 rounded-t-lg">
                  <div className="grid grid-cols-6 gap-4 px-4 py-3">
                    <div className="text-sm font-medium text-gray-700">{t('wallet.billingPeriod') || 'Billing Period'}</div>
                    <div className="text-sm font-medium text-gray-700 text-right">{t('wallet.billAmount') || 'Bill Amount'}</div>
                    <div className="text-sm font-medium text-gray-700 text-right">{t('wallet.consumption') || 'Consumption'}</div>
                    <div className="text-sm font-medium text-gray-700 text-center">{t('wallet.status') || 'Status'}</div>
                    <div className="text-sm font-medium text-gray-700">{t('wallet.dueDate') || 'Due Date'}</div>
                    <div className="text-sm font-medium text-gray-700 text-center">{t('wallet.action') || 'Action'}</div>
                  </div>
                </div>

                {/* Table body */}
                {filteredInvoices.length === 0 ? (
                  <div className="py-12">
                    <Empty description={t('wallet.noInvoices') || 'No invoice records'} />
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredInvoices.map((invoice) => (
                      <div key={invoice.id} className="grid grid-cols-6 gap-4 px-4 py-4 hover:bg-gray-50">
                        <div>
                          <p className="font-medium text-gray-900">{invoice.period}</p>
                          <p className="text-xs text-gray-400 mt-1">{invoice.id}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-gray-900">
                            ${formatPrice(invoice.amount)}
                          </span>
                        </div>
                        <div className="text-right text-gray-600">
                          {formatPrice(invoice.consumption)}
                        </div>
                        <div className="text-center">
                          <Badge variant={statusVariants[invoice.status]}>
                            {statusLabels[invoice.status]}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(invoice.dueDate, 'short')}
                        </div>
                        <div className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={<Download className="w-4 h-4" />}
                            onClick={() => handleDownloadInvoice(invoice)}
                            disabled={invoice.status !== 'paid'}
                          >
                            {invoice.status === 'paid'
                              ? (t('wallet.download') || 'Download')
                              : (t('wallet.unavailable') || 'Unavailable')}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Invoice Statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <Card shadow="sm">
                  <CardBody className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">{t('wallet.totalBillAmount') || 'Total Bill Amount'}</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${formatPrice(mockInvoices.reduce((sum, i) => sum + i.amount, 0))}
                      </p>
                    </div>
                  </CardBody>
                </Card>

                <Card shadow="sm">
                  <CardBody className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">{t('wallet.paid') || 'Paid'}</p>
                      <p className="text-2xl font-bold text-green-600">
                        ${formatPrice(mockInvoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0))}
                      </p>
                    </div>
                  </CardBody>
                </Card>

                <Card shadow="sm">
                  <CardBody className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">{t('wallet.pending') || 'Pending'}</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        ${formatPrice(mockInvoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0))}
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recharge modal - Step 1: Amount Selection */}
      <Modal
        isOpen={isRechargeModalOpen}
        onClose={() => {
          setIsRechargeModalOpen(false);
          setRechargeAmount('100');
        }}
        title={t('wallet.accountRecharge') || 'Account Recharge'}
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsRechargeModalOpen(false)}>
              {t('common.cancel') || 'Cancel'}
            </Button>
            <Button
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40"
              onClick={handleConfirmRecharge}
            >
              {t('wallet.confirmRecharge') || 'Confirm Recharge'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500 mb-4">
            {t('wallet.enterRechargeAmount') || 'Enter the amount you want to recharge'}
          </p>

          <Input
            label={t('wallet.rechargeAmountUsd') || 'Recharge Amount (USD)'}
            placeholder={t('wallet.enterRechargeAmount') || 'Enter recharge amount'}
            value={rechargeAmount}
            onChange={(e) => setRechargeAmount(e.target.value.replace(/[^0-9]/g, ''))}
            type="text"
            hint={t('wallet.minimumRecharge') || 'Minimum recharge amount: $10'}
            leftIcon={<DollarSign className="w-4 h-4 text-gray-400" />}
          />

          <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
            <p>* {t('wallet.rechargeCreditedImmediately') || 'Recharge will be credited immediately after payment confirmation'}</p>
            <p>* {t('wallet.contactSupport') || 'Contact support for large amount recharge'}</p>
          </div>
        </div>
      </Modal>

      {/* Payment Methods Modal - Step 2: Payment Selection */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedPaymentMethod(null);
        }}
        title={t('wallet.paymentMethods') || 'Payment Methods'}
        size="md"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setIsPaymentModalOpen(false);
                setSelectedPaymentMethod(null);
              }}
            >
              {t('common.cancel') || 'Cancel'}
            </Button>
            <Button
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handlePaymentConfirm}
              disabled={!selectedPaymentMethod}
            >
              {t('wallet.confirmPayment') || 'Confirm Payment'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {/* Amount Display */}
          <div className="bg-primary-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t('wallet.rechargeAmount') || 'Recharge Amount'}</span>
              <span className="text-2xl font-bold text-primary-600">
                ${getRechargeAmount().toLocaleString()}
              </span>
            </div>
          </div>

          {/* Payment Methods Grid */}
          <div className="grid grid-cols-3 gap-3">
            {PAYMENT_METHODS.map((method) => {
              const isSelected = selectedPaymentMethod === method.id;
              return (
                <button
                  key={method.id}
                  onClick={() => setSelectedPaymentMethod(method.id)}
                  className={cn(
                    'relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                    'hover:shadow-md',
                    isSelected
                      ? `${method.bgColor} ${method.borderColor} ring-2 ring-offset-1`
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  )}
                >
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center transition-all',
                      isSelected && 'scale-110'
                    )}
                  >
                    <PaymentMethodIcon method={method.icon} size={48} />
                  </div>
                  <span
                    className={cn(
                      'text-sm font-medium text-center',
                      isSelected ? 'text-gray-900' : 'text-gray-600'
                    )}
                  >
                    {method.name}
                  </span>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Payment Notes */}
          <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
            <p>* {t('wallet.paymentProcessingTime') || 'Payment processing time may vary by method'}</p>
            <p>* {t('wallet.accountCreditedOnceConfirmed') || 'Account will be credited once payment is confirmed'}</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
