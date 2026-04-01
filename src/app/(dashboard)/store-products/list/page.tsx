/**
 * My Inventory Page
 * @description Manage store products
 */

'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Tabs, TabContent } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Loading } from '@/components/ui/Loading';
import { Empty } from '@/components/ui/Empty';
import { StoreProductCard } from '../components/StoreProductCard';
import { cn } from '@/utils/helpers';
import { useStoreProducts } from '@/hooks/api/useStoreProducts';
import { Package, Link, Plus, Filter, Search, CheckSquare, CheckSquareIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { StoreProduct, ID } from '@/types/store-product.types';

/**
 * Tab Configuration
 */
const TAB_ITEMS = [
  { key: 'linked', label: 'Linked' },
  { key: 'unlinked', label: 'Unlinked' },
];

/**
 * My Inventory Page
 */
export default function StoreProductsListPage() {
  const [activeTab, setActiveTab] = useState('linked');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    products,
    isLoading,
    isError,
    page,
    totalPages,
    total,
  } = useStoreProducts({
    page: currentPage,
    limit: 10,
    hasPackaging: activeTab === 'linked' ? true : undefined,
  });

  // Filter products
  const filteredProducts = products.filter((product: StoreProduct) => {
    const matchesSearch = searchTerm
      ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesSearch;
  });

  // Handle select all
  const handleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map((p: StoreProduct) => String(p.id)));
    }
  };

  // Handle single select
  const handleSelect = (productId: ID) => {
    const idStr = String(productId);
    setSelectedIds((prev) => {
      if (prev.includes(idStr)) {
        return prev.filter((id) => id !== idStr);
      }
      return [...prev, idStr];
    });
  };

  // Handle actions
  const handleAction = (action: string, productId: ID) => {
    switch (action) {
      case 'edit':
        toast.success('Edit feature under development');
        break;
      case 'sync':
        toast.success('Syncing inventory');
        break;
      case 'packaging':
        toast.success('Link packaging feature under development');
        break;
      case 'delete':
        toast.success('Deleted successfully');
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="My Inventory"
        subtitle="Manage products in your store"
        breadcrumb={[
          { label: 'Store Products' },
          { label: 'My Inventory' },
        ]}
        actions={
          <>
            <Button variant="primary" leftIcon={<Plus className="w-5 h-4" />}>
              Add Product
            </Button>
            <Button variant="ghost" leftIcon={<Link className="w-5 h-4" />}>
              Batch Link
            </Button>
          </>
        }
      />

      {/* Tab Switcher */}
      <Tabs
        items={TAB_ITEMS}
        activeKey={activeTab}
        onChange={setActiveTab}
      />

      {/* Toolbar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search product name or SKU"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-gray-400" />}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleSelectAll}>
              {selectedIds.length === filteredProducts.length ? (
                <CheckSquare className="w-4 h-4 text-primary-500 fill-current" />
              ) : (
                <CheckSquare className="w-4 h-4 text-gray-300" />
              )}
            </Button>
            <span className="text-sm">
              {selectedIds.length > 0 ? 'Deselect All' : 'Select All'}
            </span>
            {selectedIds.length > 0 && (
              <Button variant="primary" size="sm">
                Batch Link ({selectedIds.length})
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Product List */}
      <div className="bg-white rounded-lg border border-gray-200">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loading tip="Loading..." />
          </div>
        ) : filteredProducts.length === 0 ? (
          <Empty
            preset="folder"
            description="No product data available"
            action={
              <Button variant="primary" onClick={() => toast.success('Add product feature under development')}>
                Add Product
              </Button>
            }
          />
        ) : (
          <div className="divide-y">
            {filteredProducts.map((product: StoreProduct) => (
              <StoreProductCard
                key={String(product.id)}
                product={product}
                isSelected={selectedIds.includes(String(product.id))}
                onSelect={handleSelect}
                onAction={handleAction}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50 rounded-b-lg">
          <div className="text-sm text-gray-500">
            Total {total} items, {filteredProducts.length} currently displayed
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
