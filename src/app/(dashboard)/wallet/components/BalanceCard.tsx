'use client';

import React from 'react';
import { Wallet, Lock, TrendingUp, Plus, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn, formatPrice } from '@/utils/helpers';

/**
 * BalanceCard Component Props Interface
 */
export interface BalanceCardProps {
  /** Available balance */
  availableBalance: number;
  /** Frozen amount */
  frozenBalance: number;
  /** Currency */
  currency?: string;
  /** Recharge button click callback */
  onRecharge?: () => void;
  /** Custom styles */
  className?: string;
}

/**
 * Balance Card Component
 * @description Display wallet balance with premium styling to encourage recharge
 */
export const BalanceCard: React.FC<BalanceCardProps> = ({
  availableBalance,
  frozenBalance,
  currency = 'USD',
  onRecharge,
  className,
}) => {
  return (
    <div className={cn('relative overflow-hidden rounded-2xl', className)}>
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: Balance Info */}
          <div className="lg:col-span-7 space-y-6">
            {/* Label */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Wallet className="w-4 h-4 text-white" />
              </div>
              <span className="text-blue-200 font-medium text-sm uppercase tracking-wider">
                Available Balance
              </span>
            </div>

            {/* Balance Amount */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-blue-300 text-2xl font-medium">$</span>
                <span className="text-5xl lg:text-6xl font-bold text-white tracking-tight">
                  {availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <p className="text-blue-300/80 text-sm">
                Ready to use for orders, products, and services
              </p>
            </div>

            {/* Frozen Amount */}
            <div className="flex items-center gap-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center">
                  <Lock className="w-3 h-3 text-blue-300" />
                </div>
                <span className="text-blue-200 text-sm">Frozen Amount</span>
              </div>
              <span className="text-white font-semibold">
                {formatPrice(frozenBalance, currency)}
              </span>
            </div>
          </div>

          {/* Right: CTA Section */}
          <div className="lg:col-span-5">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              {/* Promotional text */}
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span className="text-amber-300 font-medium text-sm">Recharge & Grow</span>
              </div>

              <h3 className="text-white text-lg font-semibold mb-2">
                Need more balance?
              </h3>
              <p className="text-blue-200/70 text-sm mb-6">
                Top up your account to unlock more products and fulfill orders faster.
              </p>

              {/* Recharge Button */}
              <Button
                variant="primary"
                size="lg"
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300 group"
                onClick={onRecharge}
                rightIcon={<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              >
                <Plus className="w-5 h-5 mr-1" />
                Recharge Now
              </Button>

              {/* Quick amounts hint */}
              <div className="flex items-center justify-center gap-2 mt-4 text-blue-300/60 text-xs">
                <span>Quick top-up:</span>
                <span className="text-amber-400/80 font-medium">$100</span>
                <span>•</span>
                <span className="text-amber-400/80 font-medium">$500</span>
                <span>•</span>
                <span className="text-amber-400/80 font-medium">$1000</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom decoration line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400" />
    </div>
  );
};

export default BalanceCard;
