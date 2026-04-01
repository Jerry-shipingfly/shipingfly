/**
 * Winning Products Page
 * @description Display best-selling winning products
 */

'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Flame, ArrowLeft } from 'lucide-react';
import { useProducts, useCollectionStatuses, useAddToCollection, useRemoveFromCollection } from '@/hooks/api/useProducts';
import { PageHeader } from '@/components/common/PageHeader';
import { ProductCard } from '../components/ProductCard';
import { Loading } from '@/components/ui/Loading';
import { Empty } from '@/components/ui/Empty';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { toast } from 'react-hot-toast';
import { ID } from '@/types/common.types';

/**
 * Winning Products Page
 */
export default function WinningProductsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [collectingId, setCollectingId] = useState<ID | null>(null);

  // Get winning products (sorted by sales count)
  const { products, isLoading, mutate } = useProducts({
    sortBy: 'salesCount',
    sortOrder: 'desc',
    limit: 20,
  });

  // Get collection statuses
  const productIds = useMemo(() => products.map(p => String(p.id)), [products]);
  const { collectionStatuses, mutate: mutateStatuses } = useCollectionStatuses(productIds);

  // Collection operations
  const { addToCollection } = useAddToCollection();
  const { removeFromCollection } = useRemoveFromCollection();

  // Category options
  const categories = ['all', 'Electronics', 'Clothing', 'Home & Garden', 'Sports & Outdoors', 'Beauty'];

  // Filter products by category
  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p => p.category === activeCategory);

  // Handle collection toggle
  const handleCollect = async (productId: ID) => {
    try {
      setCollectingId(productId);
      const idStr = String(productId);
      const isCollected = collectionStatuses[idStr] || false;

      if (isCollected) {
        await removeFromCollection(idStr);
        toast.success('Removed from collection');
      } else {
        await addToCollection(idStr);
        toast.success('Added to collection');
      }
      mutate();
      mutateStatuses();
    } catch (error) {
      console.error('Failed to toggle collection:', error);
      toast.error('Operation failed');
    } finally {
      setCollectingId(null);
    }
  };

  // Refresh products
  const handleRefresh = () => {
    mutate();
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <PageHeader
        title="Winning Products"
        subtitle="Discover best-selling products and seize sales opportunities quickly"
        breadcrumb={[
          { label: 'Source Products', href: '/products/all' },
          { label: 'Winning Products' },
        ]}
        actions={
          <Link href="/products/all">
            <Button variant="ghost" leftIcon={<ArrowLeft className="w-5 h-4" />}>
              View All Products
            </Button>
          </Link>
        }
      />

      {/* Category tabs */}
      <Tabs
        items={categories.map((cat) => ({
          key: cat,
          label: cat === 'all' ? 'All' : cat,
          icon: activeCategory === cat ? <Flame className="w-4 h-4" /> : undefined,
        }))}
        activeKey={activeCategory}
        onChange={setActiveCategory}
      />

      {/* Product grid */}
      <div className="mt-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loading size="lg" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <Empty
            preset="search"
            description="No winning products in this category"
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isCollected={collectionStatuses[String(product.id)] || false}
                onCollectClick={handleCollect}
                isCollectLoading={collectingId === String(product.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
