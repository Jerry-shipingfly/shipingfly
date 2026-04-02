/**
 * All Products Page
 * @description Display a grid list of all products
 */

'use client';

import React, { useState, Suspense, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus } from 'lucide-react';
import { useProducts, useCategories, useAddToCollection, useRemoveFromCollection, useCollectionStatuses, useSearchByImage } from '@/hooks/api/useProducts';
import { ProductCard } from '../components/ProductCard';
import { ProductFilters, FilterOptions } from '../components/ProductFilters';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { Empty } from '@/components/ui/Empty';
import { toast } from 'react-hot-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { ID } from '@/types/common.types';

/**
 * All Products Content Component
 */
function AllProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  // Filter state
  const [filters, setFilters] = useState<FilterOptions>({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    shipFrom: searchParams.get('shipFrom') || '',
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
    shipFrom: filters.shipFrom,
  };

  const { products, isLoading, isError, total, totalPages, mutate } = useProducts(queryParams);
  const { categories } = useCategories();
  const { addToCollection, isAdding } = useAddToCollection();
  const { removeFromCollection, isRemoving } = useRemoveFromCollection();
  const { searchByImage, isSearching } = useSearchByImage();

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
        toast.success(t('products.removedFromCollection'));
      } else {
        await addToCollection(idStr);
        toast.success(t('products.addedToCollection'));
      }
      // Refresh both product list and collection statuses
      mutate();
      mutateStatuses();
    } catch (error) {
      console.error('Failed to toggle collection:', error);
      toast.error(t('messages.operationFailed'));
    } finally {
      setCollectingId(null);
    }
  };

  // Reset filters
  const handleReset = () => {
    setFilters({
      search: '',
      category: '',
      shipFrom: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      tags: [],
    });
    setPage(1);
    router.push('/products/all');
  };

  // Handle filter change
  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setPage(1); // Reset page number
  };

  // Handle image search
  const handleImageSearch = async (file: File) => {
    try {
      await searchByImage(file);
      toast.success(t('products.imageSearchSuccess') || 'Image search completed!');
    } catch (error) {
      console.error('Image search failed:', error);
      toast.error(t('products.imageSearchFailed') || 'Image search failed');
    }
  };

  // Pagination
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <PageHeader
        title={t('products.allProducts')}
        subtitle={t('products.allProductsSubtitle')}
        breadcrumb={[
          { label: t('nav.findProducts'), href: '/products/all' },
          { label: t('products.allProducts') },
        ]}
        actions={
          <Link href="/products/sourcing/new">
            <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
              {t('products.newSourcingRequest')}
            </Button>
          </Link>
        }
      />

      {/* Filters */}
      <ProductFilters
        initialValues={filters}
        onChange={handleFiltersChange}
        categories={categories}
        onImageSearch={handleImageSearch}
      />

      {/* Products grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loading tip={t('common.loading')} />
        </div>
      ) : isError ? (
        <Empty
          preset="error"
          description={t('common.error')}
          action={
            <Button onClick={() => mutate()}>{t('common.retry')}</Button>
          }
        />
      ) : products.length === 0 ? (
        <Empty
          preset="search"
          description={t('products.noProductsDescription')}
          action={
            <Button onClick={handleReset}>{t('products.resetFilters')}</Button>
          }
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
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
            {t('products.totalProducts')}: {total}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={page <= 1}
              onClick={() => handlePageChange(page - 1)}
            >
              {t('common.previous')}
            </Button>
            <span className="text-sm">
              {t('common.page')} {page} {t('common.of')} {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => handlePageChange(page + 1)}
            >
              {t('common.next')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * All Products Page
 */
export default function AllProductsPage() {
  const { t } = useTranslation();

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-12">
        <Loading tip={t('common.loading')} />
      </div>
    }>
      <AllProductsContent />
    </Suspense>
  );
}
