/**
 * TopProducts component
 * @description Display top-selling products list
 */

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { cn } from '@/utils/helpers';
import { TopProduct } from '@/services/dashboard.service';

/**
 * TopProducts Props
 */
export interface TopProductsProps {
  /** Product data */
  products: TopProduct[];
  /** Loading state */
  loading?: boolean;
  /** Custom class name */
  className?: string;
  /** View all link href */
  viewAllHref?: string;
}

/**
 * TopProducts list
 * @description Display a card-style list of top-selling products
 *
 * @example
 * <TopProducts
 *   products={topProducts}
 *   onViewAll={() => router.push('/products')}
 * />
 */
export const TopProducts: React.FC<TopProductsProps> = ({
  products,
  loading = false,
  className,
  viewAllHref,
}) => {
  // Format price
  const formatPrice = (price: number, currency: string) => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
      }).format(price);
    } catch {
      return `${currency} ${price.toFixed(2)}`;
    }
  };

  // Format sales count
  const formatSalesCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <div className={cn('bg-white rounded-xl shadow-sm', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View All
          </Link>
        )}
      </div>

      {/* Product list */}
      <div className="divide-y divide-gray-100">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4 px-6 py-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg animate-pulse" />
              <div className="flex-1 min-w-0">
                <div className="h-4 w-40 bg-gray-100 rounded animate-pulse" />
                <div className="mt-2 h-3 w-20 bg-gray-100 rounded animate-pulse" />
              </div>
              <div className="text-right">
                <div className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
                <div className="mt-2 h-3 w-12 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
          ))
        ) : products.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            No product data
          </div>
        ) : (
          products.map((product, index) => (
            <div
              key={product.id}
              className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              {/* Rank */}
              <div
                className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
                  index < 3
                    ? 'bg-primary-100 text-primary-600'
                    : 'bg-gray-100 text-gray-500'
                )}
              >
                {index + 1}
              </div>

              {/* Product image */}
              <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Product info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {product.name}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  {product.rating !== undefined && (
                    <span className="flex items-center gap-0.5 text-xs text-yellow-500">
                      <Star className="w-3 h-3 fill-current" />
                      {product.rating.toFixed(1)}
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    {formatSalesCount(product.salesCount)} sales
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-gray-900">
                  {formatPrice(product.price, product.currency)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TopProducts;
