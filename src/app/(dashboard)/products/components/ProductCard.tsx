/**
 * ProductCard Component
 * @description Product card for displaying products in lists
 */

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { cn } from '@/utils/helpers';
import { formatPrice } from '@/utils/helpers';
import { Product } from '@/types/product.types';
import { ID } from '@/types/common.types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProductEditDrawer } from './ProductEditDrawer';
import { useTranslation } from '@/hooks/useTranslation';

/**
 * ProductCard Props
 */
export interface ProductCardProps {
  /** Product data */
  product: Product;
  /** Whether the product is collected */
  isCollected?: boolean;
  /** Collect button click callback */
  onCollectClick?: (productId: ID) => void;
  /** Add to store button click callback */
  onAddToStoreClick?: (productId: ID) => void;
  /** Whether collect action is loading */
  isCollectLoading?: boolean;
  /** Additional CSS class names */
  className?: string;
  /** Layout mode */
  layout?: 'grid' | 'list';
}

/**
 * ProductCard Component
 * @description Card component for displaying product information
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isCollected = false,
  onCollectClick,
  onAddToStoreClick,
  isCollectLoading = false,
  className,
  layout = 'grid',
}) => {
  const { t } = useTranslation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleCollectClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onCollectClick?.(product.id);
  };

  const handleAddToStoreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const handleDrawerSave = (updatedProduct: Product) => {
    onAddToStoreClick?.(updatedProduct.id);
  };

  // Calculate discount percentage
  const discountPercent = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  // Translated button text
  const addToStoreText = t('products.addToStore');

  if (layout === 'list') {
    return (
      <div
        className={cn(
          'flex gap-4 p-4 bg-white rounded-xl border border-gray-200',
          'hover:shadow-md hover:border-primary-200 transition-all duration-200',
          className
        )}
      >
        {/* Product image */}
        <Link href={`/products/all/${product.id}`} className="block">
          <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={product.images[0] || '/images/placeholder.png'}
              alt={product.name}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              sizes="128px"
            />
            {discountPercent > 0 && (
              <div className="absolute top-2 left-2">
                <Badge variant="danger" size="sm">
                  -{discountPercent}%
                </Badge>
              </div>
            )}
          </div>
        </Link>

        {/* Product info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <Link href={`/products/all/${product.id}`}>
              <h3 className="text-base font-medium text-gray-900 line-clamp-2 mb-1 hover:text-primary-600 transition-colors">
                {product.name}
              </h3>
            </Link>
            <p className="text-sm text-gray-500 line-clamp-2 mb-2">
              {product.description}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-medium text-gray-700">{product.rating.toFixed(1)}</span>
              </span>
              <span className="text-gray-300">|</span>
              <span>{product.salesCount.toLocaleString()} sold</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-primary-600">
                {formatPrice(product.price, product.currency)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.originalPrice, product.currency)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* Heart button */}
              <button
                type="button"
                onClick={handleCollectClick}
                disabled={isCollectLoading}
                aria-label={isCollected ? 'Remove from collection' : 'Add to collection'}
                className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center',
                  'transition-all duration-300 transform',
                  'hover:scale-110 active:scale-95',
                  isCollected
                    ? 'bg-red-50 text-red-500'
                    : 'bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-400',
                  isCollectLoading && 'opacity-50 cursor-not-allowed'
                )}
              >
                <Heart
                  className={cn(
                    'w-5 h-5 transition-all duration-300',
                    isCollected && 'fill-red-500',
                    isCollectLoading && 'animate-pulse'
                  )}
                />
              </button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleAddToStoreClick}
                leftIcon={<ShoppingCart className="w-4 h-4" />}
              >
                {addToStoreText}
              </Button>
            </div>
          </div>
        </div>

        {/* Product Edit Drawer */}
        <ProductEditDrawer
          isOpen={isDrawerOpen}
          product={product}
          onClose={handleDrawerClose}
          onSave={handleDrawerSave}
        />
      </div>
    );
  }

  // Grid layout
  return (
    <div
      className={cn(
        'group flex flex-col bg-white rounded-xl border border-gray-200',
        'hover:shadow-lg hover:border-primary-300 transition-all duration-300',
        'overflow-hidden',
        className
      )}
    >
      {/* Product image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Link href={`/products/all/${product.id}`} className="block w-full h-full">
          <Image
            src={product.images[0] || '/images/placeholder.png'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, 20vw"
          />
        </Link>
        {/* Collect button - Heart icon - 左上角 */}
        <button
          type="button"
          onClick={handleCollectClick}
          disabled={isCollectLoading}
          aria-label={isCollected ? 'Remove from collection' : 'Add to collection'}
          className={cn(
            'absolute top-3 left-3 z-10',
            'w-8 h-8 rounded-full flex items-center justify-center',
            'transition-all duration-300 transform',
            'hover:scale-110 active:scale-95',
            isCollected
              ? 'bg-red-50 shadow-md shadow-red-100'
              : 'bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white hover:shadow-md',
            isCollectLoading && 'opacity-50 cursor-not-allowed'
          )}
        >
          <Heart
            className={cn(
              'w-4 h-4 transition-all duration-300',
              isCollected
                ? 'text-red-500 fill-red-500'
                : 'text-gray-400 hover:text-red-400',
              isCollectLoading && 'animate-pulse'
            )}
          />
        </button>
        {/* Discount badge - 右上角 */}
        {discountPercent > 0 && (
          <div className="absolute top-3 right-3 z-10">
            <Badge variant="danger" size="sm" className="shadow-sm">
              -{discountPercent}%
            </Badge>
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Product info */}
      <div className="flex-1 p-3 flex flex-col">
        {/* Title */}
        <Link href={`/products/all/${product.id}`}>
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 min-h-[40px] hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Category badge */}
        <Badge variant="default" size="sm" className="self-start mb-2">
          {product.category}
        </Badge>

        {/* Rating and sales count */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-0.5">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-medium text-gray-700">{product.rating.toFixed(1)}</span>
          </span>
          <span className="text-gray-300">|</span>
          <span>{product.salesCount.toLocaleString()} sold</span>
        </div>

        {/* Price */}
        <div className="mt-auto flex items-baseline gap-2 mb-3">
          <span className="text-lg font-bold text-primary-600">
            {formatPrice(product.price, product.currency)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.originalPrice, product.currency)}
            </span>
          )}
        </div>

        {/* Action button */}
        <Button
          variant="primary"
          size="sm"
          className="w-full"
          onClick={handleAddToStoreClick}
          leftIcon={<ShoppingCart className="w-4 h-4" />}
        >
          Add to Store
        </Button>
      </div>

      {/* Product Edit Drawer */}
      <ProductEditDrawer
        isOpen={isDrawerOpen}
        product={product}
        onClose={handleDrawerClose}
        onSave={handleDrawerSave}
      />
    </div>
  );
};

export default ProductCard;
