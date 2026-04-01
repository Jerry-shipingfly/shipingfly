/**
 * Recommended Products Page
 * @description Display a grid list of products recommended by the system for the user
 */

'use client';

import React, { useState, Suspense, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus } from 'lucide-react';
import { useRecommendedProducts, useCategories, useAddToCollection, useRemoveFromCollection, useCollectionStatuses } from '@/hooks/api/useProducts';
import { ProductCard } from '../components/ProductCard';
import { ProductFilters, FilterOptions } from '../components/ProductFilters';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { Empty } from '@/components/ui/Empty';
import { toast } from 'react-hot-toast';
import { ID } from '@/types/common.types';

/**
 * Recommended Products Content Component
 */
function RecommendedProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filter state
  const [filters, setFilters] = useState<FilterOptions>({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    tags: [],
  });

  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Collection operation state
  const [collectingId, setCollectingId] = useState<ID | null>(null);

  // Convert filter params to API params
  const queryParams = {
    page,
    limit: pageSize,
    search: filters.search,
    category: filters.category,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
  };

  const { products, isLoading, isError, total, totalPages, mutate } = useRecommendedProducts(queryParams);
  const { categories } = useCategories();
  const { addToCollection, isAdding } = useAddToCollection();
  const { removeFromCollection, isRemoving } = useRemoveFromCollection();

  // Get product IDs for batch collection status check
  const productIds = useMemo(() => products.map(p => String(p.id)), [products]);
  const { collectionStatuses, mutate: mutateStatuses } = useCollectionStatuses(productIds);

  // Handle collection
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
      // Refresh both product list and collection statuses
      mutate();
      mutateStatuses();
    } catch (error) {
      console.error('Failed to toggle collection:', error);
      toast.error('Operation failed');
    } finally {
      setCollectingId(null);
    }
  };

  // Reset filters
  const handleReset = () => {
    setFilters({
      search: '',
      category: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      tags: [],
    });
    setPage(1);
    router.push('/products/recommend');
  };

  // Handle filter change
  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setPage(1); // Reset page number
  };

  // Pagination
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <PageHeader
        title="Recommendations"
        subtitle="Products recommended for you based on your preferences and browsing history"
        breadcrumb={[
          { label: 'Find Products', href: '/products/all' },
          { label: 'Recommendations' },
        ]}
        actions={
          <Link href="/products/sourcing/new">
            <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
              New Sourcing Request
            </Button>
          </Link>
        }
      />

      {/* Filters */}
      <ProductFilters
        initialValues={filters}
        onChange={handleFiltersChange}
        categories={categories}
      />

      {/* Products grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loading tip="Loading..." />
        </div>
      ) : isError ? (
        <Empty
          preset="error"
          description="Failed to load. Please try again."
          action={
            <Button onClick={() => mutate()}>Retry</Button>
          }
        />
      ) : products.length === 0 ? (
        <Empty
          preset="search"
          description="No recommended products found"
          action={
            <Button onClick={handleReset}>Reset Filters</Button>
          }
        />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
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

      {/* Pagination info */}
      {total > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {total} products total
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={page <= 1}
              onClick={() => handlePageChange(page - 1)}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => handlePageChange(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Recommended Products Page
 */
export default function RecommendedProductsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-12">
        <Loading tip="Loading..." />
      </div>
    }>
      <RecommendedProductsContent />
    </Suspense>
  );
}
