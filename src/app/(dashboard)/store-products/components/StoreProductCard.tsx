/**
 * Store Product Card Component
 * @description Used for store product list display
 */

'use client';

import React from 'react';
import Image from 'next/image';
import { Package, MoreHorizontal } from 'lucide-react';
import { cn } from '@/utils/helpers';
import { formatPrice } from '@/utils/helpers';
import { Badge } from '@/components/ui/Badge';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Dropdown } from '@/components/ui/Dropdown';
import { StoreProduct as GlobalStoreProduct, ID } from '@/types/store-product.types';

/**
 * Store Product Card Props
 */
export interface StoreProductCardProps {
  /** Product data */
  product: GlobalStoreProduct;
  /** Is selected */
  isSelected?: boolean;
  /** Selection callback */
  onSelect?: (productId: ID) => void;
  /** Action callback */
  onAction?: (action: string, productId: ID) => void;
  /** Extended class name */
  className?: string;
}

/**
 * Format profit rate
 */
const formatProfitRate = (rate: number): string => {
  return `${(rate * 100).toFixed(1)}%`;
};

/**
 * Store Product Card Component
 */
export const StoreProductCard: React.FC<StoreProductCardProps> = ({
  product,
  isSelected = false,
  onSelect,
  onAction,
  className,
}) => {
  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onSelect?.(product.id);
  };

  const handleAction = (action: string) => {
    onAction?.(action, product.id);
  };

  return (
    <div
      className={cn(
        'group relative flex items-center p-4 bg-white rounded-lg border border-gray-200',
        'hover:shadow-lg hover:border-gray-300 transition-all duration-200 cursor-pointer',
        isSelected && 'ring-2 ring-primary-500 border-primary-500',
        className
      )}
    >
      {/* Checkbox */}
      <div className="absolute top-2 left-2 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleSelect}
          className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
      </div>

      {/* Product image */}
      <div className="relative w-20 h-20 flex-shrink-0 ml-6">
        <Image
          src={product.images?.[0] || '/mock-placeholder.png'}
          alt={product.name}
          fill
          className="w-full h-full object-cover rounded"
        />
      </div>

      {/* Product information */}
      <div className="flex-1 min-w-0 ml-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {product.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1">SKU: {product.sku}</p>
          </div>
          <StatusBadge status={product.status} size="sm" />
        </div>

        <div className="mt-2 flex items-center gap-4 text-sm">
          <span className="text-gray-500">Inventory: {product.inventory}</span>
          <span className="text-gray-300">|</span>
          <span className="text-gray-500">
            {formatPrice(product.salePrice, 'USD')}
          </span>
        </div>

        <div className="mt-1 flex items-center gap-4 text-sm">
          <span className="text-gray-500">Cost: {formatPrice(product.costPrice, 'USD')}</span>
          <span className="text-gray-300">|</span>
          <span className="text-green-600">
            Profit Rate: {formatProfitRate(product.profitRate)}
          </span>
        </div>

        {/* Related information */}
        {product.packagingId && (
          <div className="mt-2">
            <Badge variant="success" size="sm">
              Packaging Linked
            </Badge>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="ml-2">
        <Dropdown
          trigger={
            <button type="button" className="p-1 hover:bg-gray-100 rounded">
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </button>
          }
          items={[
            { key: 'edit', label: 'Edit' },
            { key: 'sync', label: 'Sync Inventory' },
            { key: 'packaging', label: 'Link Packaging' },
            { key: 'delete', label: 'Delete', danger: true },
          ]}
          onItemClick={(key) => handleAction(key)}
        />
      </div>
    </div>
  );
};

export default StoreProductCard;
