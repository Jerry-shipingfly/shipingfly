/**
 * Published Products Page
 * @description Manage products published to stores with Products tab
 */

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Search, RefreshCw, Edit, Unlink, Check, Package, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '@/utils/helpers';
import { formatPrice } from '@/utils/helpers';

// Tab types
type MainTabType = 'products' | 'collections';
type SubTabType = 'connected' | 'unconnected';

/**
 * Product type definitions
 */
interface BaseProduct {
  id: string;
  name: string;
  sku: string;
  image: string;
  price: number;
}

interface ConnectedProduct extends BaseProduct {
  store: { name: string; platform: string };
  status: 'active' | 'inactive';
}

interface UnconnectedProduct extends BaseProduct {}

/**
 * Mock connected products data
 */
const CONNECTED_PRODUCTS: ConnectedProduct[] = [
  {
    id: 'p1',
    name: 'Wireless Bluetooth Earbuds Pro',
    sku: 'WBE-PRO-BLK',
    image: 'https://picsum.photos/seed/earbuds/80/80',
    store: { name: 'TechGear Official Store', platform: 'Shopify' },
    status: 'active',
    price: 79.99,
  },
  {
    id: 'p2',
    name: 'Smart Fitness Watch',
    sku: 'SFW-X-BLK-46',
    image: 'https://picsum.photos/seed/watch/80/80',
    store: { name: 'Fashion Forward', platform: 'Shopify' },
    status: 'active',
    price: 199.99,
  },
  {
    id: 'p3',
    name: 'Portable Power Bank 20000mAh',
    sku: 'PPB-20K-WHT',
    image: 'https://picsum.photos/seed/powerbank/80/80',
    store: { name: 'TechGear Official Store', platform: 'Shopify' },
    status: 'inactive',
    price: 45.99,
  },
  {
    id: 'p4',
    name: 'USB-C Fast Charging Cable',
    sku: 'UCC-FC-1M',
    image: 'https://picsum.photos/seed/cable/80/80',
    store: { name: 'Home Essentials Plus', platform: 'WooCommerce' },
    status: 'active',
    price: 12.99,
  },
  {
    id: 'p5',
    name: 'Mechanical Gaming Keyboard',
    sku: 'MGK-RGB-BLK',
    image: 'https://picsum.photos/seed/keyboard/80/80',
    store: { name: 'TechGear Official Store', platform: 'Shopify' },
    status: 'active',
    price: 129.99,
  },
  {
    id: 'p6',
    name: 'LED Desk Lamp',
    sku: 'LDL-USB-WHT',
    image: 'https://picsum.photos/seed/lamp/80/80',
    store: { name: 'Fashion Forward', platform: 'Shopify' },
    status: 'inactive',
    price: 35.99,
  },
];

/**
 * Mock unconnected products data
 */
const UNCONNECTED_PRODUCTS: UnconnectedProduct[] = [
  {
    id: 'p7',
    name: 'Noise Cancelling Headphones',
    sku: 'NCH-PRO-BLK',
    image: 'https://picsum.photos/seed/headphones/80/80',
    price: 249.99,
  },
  {
    id: 'p8',
    name: 'Wireless Charging Pad',
    sku: 'WCP-15W-WHT',
    image: 'https://picsum.photos/seed/charger/80/80',
    price: 29.99,
  },
  {
    id: 'p9',
    name: 'Bluetooth Speaker Portable',
    sku: 'BSP-MINI-BLK',
    image: 'https://picsum.photos/seed/speaker/80/80',
    price: 59.99,
  },
  {
    id: 'p10',
    name: 'Yoga Mat Premium',
    sku: 'YMP-6MM-BLU',
    image: 'https://picsum.photos/seed/yogamat/80/80',
    price: 45.00,
  },
];

/**
 * Tab component
 */
interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'main' | 'sub';
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, children, variant = 'main' }) => (
  <button
    onClick={onClick}
    className={cn(
      'px-4 py-2 text-sm font-medium transition-all',
      variant === 'main'
        ? cn(
            'rounded-lg',
            active
              ? 'bg-primary-500 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          )
        : cn(
            'border-b-2 -mb-px',
            active
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          )
    )}
  >
    {children}
  </button>
);

/**
 * Published Products Page
 */
export default function PublishedProductsPage() {
  const [activeMainTab, setActiveMainTab] = useState<MainTabType>('products');
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>('connected');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Get current data based on tab
  const currentData = activeSubTab === 'connected' ? CONNECTED_PRODUCTS : UNCONNECTED_PRODUCTS;

  // Filter products
  const filteredProducts = currentData.filter((product) => {
    if (!searchTerm) return true;
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Handle select all
  const handleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map((p) => p.id));
    }
  };

  // Handle item selection
  const handleSelect = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((itemId) => itemId !== id);
      }
      return [...prev, id];
    });
  };

  // Handle actions
  const handleEdit = (productId: string) => {
    toast.success('Edit feature under development');
  };

  const handleDisconnect = (productId: string) => {
    toast.success('Product disconnected from store');
  };

  // Handle tab change
  const handleMainTabChange = (tab: MainTabType) => {
    setActiveMainTab(tab);
    setSelectedIds([]);
    setSearchTerm('');
  };

  const handleSubTabChange = (tab: SubTabType) => {
    setActiveSubTab(tab);
    setSelectedIds([]);
  };

  const connectionCount = CONNECTED_PRODUCTS.length;
  const unconnectionCount = UNCONNECTED_PRODUCTS.length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Published Products"
        subtitle="Manage products published to stores"
        breadcrumb={[
          { label: 'Store Products', href: '/store-products/list' },
          { label: 'Published' },
        ]}
        actions={
          <Button variant="ghost" leftIcon={<RefreshCw className="w-4 h-4" />}>
            Refresh
          </Button>
        }
      />

      {/* Main Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 p-2 inline-flex gap-1">
        <TabButton
          active={activeMainTab === 'products'}
          onClick={() => handleMainTabChange('products')}
        >
          <Package className="w-4 h-4 inline-block mr-2" />
          Products
        </TabButton>
        <TabButton
          active={activeMainTab === 'collections'}
          onClick={() => handleMainTabChange('collections')}
        >
          <Package className="w-4 h-4 inline-block mr-2" />
          Collections
        </TabButton>
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Sub Tabs */}
        <div className="border-b border-gray-200 px-6 pt-4">
          <div className="flex items-center gap-6">
            <TabButton
              variant="sub"
              active={activeSubTab === 'connected'}
              onClick={() => handleSubTabChange('connected')}
            >
              Connected ({connectionCount})
            </TabButton>
            <TabButton
              variant="sub"
              active={activeSubTab === 'unconnected'}
              onClick={() => handleSubTabChange('unconnected')}
            >
              Unconnected ({unconnectionCount})
            </TabButton>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search product name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {selectedIds.length > 0 && (
              <>
                <span className="text-sm text-gray-500">
                  {selectedIds.length} selected
                </span>
                <Button variant="ghost" size="sm" onClick={handleSelectAll}>
                  Deselect All
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-500">
          <div className="col-span-1 flex items-center">
            <div
              onClick={handleSelectAll}
              className={cn(
                'w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer',
                selectedIds.length === filteredProducts.length && filteredProducts.length > 0
                  ? 'bg-primary-500 border-primary-500'
                  : 'border-gray-300'
              )}
            >
              {selectedIds.length === filteredProducts.length && filteredProducts.length > 0 && (
                <Check className="w-3 h-3 text-white" />
              )}
            </div>
          </div>
          <div className="col-span-4">Product Name</div>
          <div className="col-span-3">Store Name</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-center">Actions</div>
        </div>

        {/* Product List */}
        <div className="divide-y divide-gray-100">
          {filteredProducts.map((product) => {
            const isSelected = selectedIds.includes(product.id);
            const isConnected = activeSubTab === 'connected';

            return (
              <div
                key={product.id}
                className={cn(
                  'grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors',
                  isSelected && 'bg-primary-50'
                )}
              >
                {/* Checkbox */}
                <div className="col-span-1 flex items-center">
                  <div
                    onClick={() => handleSelect(product.id)}
                    className={cn(
                      'w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer',
                      isSelected
                        ? 'bg-primary-500 border-primary-500'
                        : 'border-gray-300'
                    )}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                </div>

                {/* Product Info */}
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 truncate">{product.name}</div>
                    <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                  </div>
                </div>

                {/* Store Name */}
                <div className="col-span-3">
                  {isConnected && 'store' in product ? (
                    <div className="flex items-center gap-2">
                      <Badge variant="default" size="sm">
                        {(product as ConnectedProduct).store.platform}
                      </Badge>
                      <span className="text-sm text-gray-700 truncate">{(product as ConnectedProduct).store.name}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">—</span>
                  )}
                </div>

                {/* Status */}
                <div className="col-span-2">
                  {isConnected && 'status' in product ? (
                    <Badge
                      variant={(product as ConnectedProduct).status === 'active' ? 'success' : 'default'}
                      size="sm"
                    >
                      {(product as ConnectedProduct).status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  ) : (
                    <Badge variant="warning" size="sm">
                      Not Connected
                    </Badge>
                  )}
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(product.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  {isConnected && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDisconnect(product.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Unlink className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              {searchTerm
                ? 'No products found matching your search'
                : activeSubTab === 'connected'
                  ? 'No connected products yet'
                  : 'All products are connected'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
