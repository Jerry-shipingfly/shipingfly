'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle } from 'lucide-react';
import { cn, formatDate } from '@/utils/helpers';
import { Badge } from '@/components/ui';

/**
 * Transaction record data structure
 */
export interface Transaction {
  /** Transaction ID */
  id: string;
  /** Transaction type */
  type: 'recharge' | 'withdraw' | 'payment' | 'refund' | 'commission';
  /** Amount */
  amount: number;
  /** Status */
  status: 'pending' | 'completed' | 'failed';
  /** Time */
  createdAt: string;
  /** Note */
  note?: string;
}

/**
 * TransactionList Component Props Interface
 */
export interface TransactionListProps {
  /** Transaction record list */
  transactions: Transaction[];
  /** Currency */
  currency?: string;
  /** Custom styles */
  className?: string;
}

/**
 * Transaction type mapping
 */
const typeLabels: Record<Transaction['type'], { label: string; icon: React.ReactNode; color: string }> = {
  recharge: { label: 'Recharge', icon: <ArrowDownLeft className="w-4 h-4" />, color: 'text-green-500' },
  withdraw: { label: 'Withdraw', icon: <ArrowUpRight className="w-4 h-4" />, color: 'text-red-500' },
  payment: { label: 'Payment', icon: <ArrowUpRight className="w-4 h-4" />, color: 'text-red-500' },
  refund: { label: 'Refund', icon: <ArrowDownLeft className="w-4 h-4" />, color: 'text-green-500' },
  commission: { label: 'Commission', icon: <ArrowDownLeft className="w-4 h-4" />, color: 'text-blue-500' },
};

/**
 * Transaction status mapping
 */
const statusVariants: Record<Transaction['status'], 'warning' | 'success' | 'danger'> = {
  pending: 'warning',
  completed: 'success',
  failed: 'danger',
};

/**
 * Transaction List Component
 * @description Display wallet transaction records
 */
export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  currency = 'USD',
  className,
}) => {
  // Format amount
  const formatAmount = (amount: number) => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
      }).format(Math.abs(amount));
    } catch {
      return `${currency} ${Math.abs(amount).toFixed(2)}`;
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {transactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No transaction records
        </div>
      ) : (
        transactions.map((transaction) => {
          const typeInfo = typeLabels[transaction.type];
          const isIncoming = ['recharge', 'refund', 'commission'].includes(transaction.type);

          return (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {/* Left side: type and note */}
              <div className="flex items-center gap-3">
                <div className={cn('p-2 rounded-lg', isIncoming ? 'bg-green-100' : 'bg-red-100')}>
                  <div className={typeInfo.color}>{typeInfo.icon}</div>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{typeInfo.label}</p>
                  {transaction.note && (
                    <p className="text-sm text-gray-500">{transaction.note}</p>
                  )}
                </div>
              </div>

              {/* Right side: amount and status */}
              <div className="text-right">
                <p className={cn(
                  'font-semibold',
                  isIncoming ? 'text-green-600' : 'text-red-600'
                )}>
                  {isIncoming ? '+' : '-'}{formatAmount(transaction.amount)}
                </p>
                <div className="flex items-center justify-end gap-2 mt-1">
                  <span className="text-xs text-gray-400">
                    {formatDate(transaction.createdAt, 'datetime')}
                  </span>
                  <Badge variant={statusVariants[transaction.status]} size="sm">
                    {transaction.status === 'pending' && 'Processing'}
                    {transaction.status === 'completed' && 'Completed'}
                    {transaction.status === 'failed' && 'Failed'}
                  </Badge>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default TransactionList;
