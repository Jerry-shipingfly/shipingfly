/**
 * Packaging Connection Panel
 * @description Content for the Packaging Connection tab within Branding
 */

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Search, Link2, Check, Package, ShoppingCart, Store, Edit, Unlink } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '@/utils/helpers';
import { useTranslation } from '@/hooks/useTranslation';

// Tab types
type MainTabType = 'products' | 'orders' | 'stores';
type SubTabType = 'connected' | 'unconnected';

const MOCK_PRODUCTS = [
  { id: 'p1', name: 'Wireless Bluetooth Earbuds Pro', sku: 'WBE-001', image: 'https://picsum.photos/seed/earbuds/60/60', store: 'TechGear Official Store', platform: 'Shopify', status: 'active' },
  { id: 'p2', name: 'Smart Fitness Watch', sku: 'SFW-002', image: 'https://picsum.photos/seed/watch/60/60', store: 'Fashion Forward', platform: 'Shopify', status: 'active' },
  { id: 'p3', name: 'Portable Power Bank 20000mAh', sku: 'PPB-003', image: 'https://picsum.photos/seed/powerbank/60/60', store: 'TechGear Official Store', platform: 'Shopify', status: 'inactive' },
  { id: 'p4', name: 'USB-C Fast Charging Cable', sku: 'UCC-004', image: 'https://picsum.photos/seed/cable/60/60', store: 'Home Essentials Plus', platform: 'WooCommerce', status: 'active' },
  { id: 'p5', name: 'Wireless Mouse Ergonomic', sku: 'WM-005', image: 'https://picsum.photos/seed/mouse/60/60', store: 'TechGear Official Store', platform: 'Shopify', status: 'active' },
  { id: 'p6', name: 'Mechanical Gaming Keyboard RGB', sku: 'MGK-006', image: 'https://picsum.photos/seed/keyboard/60/60', store: 'Fashion Forward', platform: 'Shopify', status: 'inactive' },
  { id: 'p7', name: 'LED Desk Lamp with USB Charger', sku: 'LDL-007', image: 'https://picsum.photos/seed/lamp/60/60', store: null, platform: null, status: null },
  { id: 'p8', name: 'Noise Cancelling Headphones', sku: 'NCH-008', image: 'https://picsum.photos/seed/headphones/60/60', store: null, platform: null, status: null },
  { id: 'p9', name: 'Wireless Charging Pad', sku: 'WCP-009', image: 'https://picsum.photos/seed/charger/60/60', store: null, platform: null, status: null },
  { id: 'p10', name: 'Bluetooth Speaker Portable', sku: 'BSP-010', image: 'https://picsum.photos/seed/speaker/60/60', store: null, platform: null, status: null },
];

const MOCK_ORDERS = [
  { id: 'o1', orderNumber: 'ORD-2024-00001', customer: 'John Smith', items: 3, image: 'https://picsum.photos/seed/order1/60/60', store: 'TechGear Official Store', platform: 'Shopify', status: 'active' },
  { id: 'o2', orderNumber: 'ORD-2024-00002', customer: 'Emily Johnson', items: 2, image: 'https://picsum.photos/seed/order2/60/60', store: 'Fashion Forward', platform: 'Shopify', status: 'active' },
  { id: 'o3', orderNumber: 'ORD-2024-00003', customer: 'Michael Chen', items: 1, image: 'https://picsum.photos/seed/order3/60/60', store: 'TechGear Official Store', platform: 'Shopify', status: 'inactive' },
  { id: 'o4', orderNumber: 'ORD-2024-00004', customer: 'Sarah Williams', items: 5, image: 'https://picsum.photos/seed/order4/60/60', store: null, platform: null, status: null },
  { id: 'o5', orderNumber: 'ORD-2024-00005', customer: 'David Brown', items: 2, image: 'https://picsum.photos/seed/order5/60/60', store: null, platform: null, status: null },
  { id: 'o6', orderNumber: 'ORD-2024-00006', customer: 'Jennifer Lee', items: 4, image: 'https://picsum.photos/seed/order6/60/60', store: null, platform: null, status: null },
];

const MOCK_STORES = [
  { id: 's1', name: 'TechGear Official Store', platform: 'Shopify', products: 156, image: 'https://picsum.photos/seed/store1/60/60', status: 'active' },
  { id: 's2', name: 'Fashion Forward', platform: 'Shopify', products: 89, image: 'https://picsum.photos/seed/store2/60/60', status: 'active' },
  { id: 's3', name: 'Home Essentials Plus', platform: 'WooCommerce', products: 234, image: 'https://picsum.photos/seed/store3/60/60', status: 'inactive' },
];

const MOCK_PACKAGINGS = [
  { id: 'pkg1', name: 'Standard Shipping Box (Small)', type: 'box', image: 'https://picsum.photos/seed/box-s/60/60' },
  { id: 'pkg2', name: 'Standard Shipping Box (Medium)', type: 'box', image: 'https://picsum.photos/seed/box-m/60/60' },
  { id: 'pkg3', name: 'Standard Shipping Box (Large)', type: 'box', image: 'https://picsum.photos/seed/box-l/60/60' },
  { id: 'pkg4', name: 'Bubble Wrap (Small)', type: 'wrapper', image: 'https://picsum.photos/seed/bubble-s/60/60' },
  { id: 'pkg5', name: 'Bubble Wrap (Medium)', type: 'wrapper', image: 'https://picsum.photos/seed/bubble-m/60/60' },
  { id: 'pkg6', name: 'Shipping Bag (Small)', type: 'bag', image: 'https://picsum.photos/seed/bag-s/60/60' },
  { id: 'pkg7', name: 'Shipping Bag (Medium)', type: 'bag', image: 'https://picsum.photos/seed/bag-m/60/60' },
  { id: 'pkg8', name: 'Shipping Bag (Large)', type: 'bag', image: 'https://picsum.photos/seed/bag-l/60/60' },
];

const PRODUCT_CONNECTIONS: Record<string, string> = {
  p1: 'pkg1',
  p2: 'pkg5',
  p3: 'pkg2',
  p4: 'pkg6',
  p5: 'pkg3',
  p6: 'pkg7',
};

const ORDER_CONNECTIONS: Record<string, string> = {
  o1: 'pkg2',
  o2: 'pkg5',
  o3: 'pkg1',
};

const STORE_CONNECTIONS: Record<string, string> = {
  s1: 'pkg3',
  s2: 'pkg6',
};

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

export const PackagingConnectionPanel: React.FC = () => {
  const { t } = useTranslation();
  const [activeMainTab, setActiveMainTab] = useState<MainTabType>('stores');
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>('connected');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedPackaging, setSelectedPackaging] = useState<string | null>(null);
  const [productConnections, setProductConnections] = useState(PRODUCT_CONNECTIONS);
  const [orderConnections, setOrderConnections] = useState(ORDER_CONNECTIONS);
  const [storeConnections, setStoreConnections] = useState(STORE_CONNECTIONS);

  const getCurrentConnections = () => {
    switch (activeMainTab) {
      case 'products':
        return productConnections;
      case 'orders':
        return orderConnections;
      case 'stores':
        return storeConnections;
      default:
        return {};
    }
  };

  const getItems = () => {
    switch (activeMainTab) {
      case 'products':
        return MOCK_PRODUCTS;
      case 'orders':
        return MOCK_ORDERS;
      case 'stores':
        return MOCK_STORES;
      default:
        return [];
    }
  };

  const getFilteredItems = () => {
    const items = getItems();
    const connections = getCurrentConnections();
    const connectedIds = Object.keys(connections);

    let filtered = items.filter((item: Record<string, unknown>) => {
      const isConnected = connectedIds.includes(item.id as string);
      return activeSubTab === 'connected' ? isConnected : !isConnected;
    });

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((item: Record<string, unknown>) => {
        if (activeMainTab === 'products') {
          const p = item as { name: string; sku: string };
          return p.name.toLowerCase().includes(term) || p.sku.toLowerCase().includes(term);
        } else if (activeMainTab === 'orders') {
          const o = item as { orderNumber: string; customer: string };
          return o.orderNumber.toLowerCase().includes(term) || o.customer.toLowerCase().includes(term);
        } else {
          const s = item as { name: string; platform: string };
          return s.name.toLowerCase().includes(term) || s.platform.toLowerCase().includes(term);
        }
      });
    }

    return filtered;
  };

  const handleItemSelect = (itemId: string) => {
    setSelectedItems((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      }
      return [...prev, itemId];
    });
  };

  const handleSelectAll = () => {
    const filtered = getFilteredItems();
    if (selectedItems.length === filtered.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filtered.map((i: Record<string, unknown>) => i.id as string));
    }
  };

  const handleSaveConnection = () => {
    if (selectedItems.length === 0) {
      toast.error(t('branding.selectItemsFirst'));
      return;
    }
    if (!selectedPackaging) {
      toast.error(t('branding.selectPackagingFirst'));
      return;
    }

    const packaging = MOCK_PACKAGINGS.find((p) => p.id === selectedPackaging);

    switch (activeMainTab) {
      case 'products':
        setProductConnections((prev) => {
          const updated = { ...prev };
          selectedItems.forEach((id) => {
            updated[id] = selectedPackaging;
          });
          return updated;
        });
        break;
      case 'orders':
        setOrderConnections((prev) => {
          const updated = { ...prev };
          selectedItems.forEach((id) => {
            updated[id] = selectedPackaging;
          });
          return updated;
        });
        break;
      case 'stores':
        setStoreConnections((prev) => {
          const updated = { ...prev };
          selectedItems.forEach((id) => {
            updated[id] = selectedPackaging;
          });
          return updated;
        });
        break;
    }

    toast.success(t('branding.connectedItems', { count: selectedItems.length, name: packaging?.name || '' }));
    setSelectedItems([]);
    setSelectedPackaging(null);
  };

  const handleDisconnect = (itemId: string) => {
    switch (activeMainTab) {
      case 'products':
        setProductConnections((prev) => {
          const updated = { ...prev };
          delete updated[itemId];
          return updated;
        });
        break;
      case 'orders':
        setOrderConnections((prev) => {
          const updated = { ...prev };
          delete updated[itemId];
          return updated;
        });
        break;
      case 'stores':
        setStoreConnections((prev) => {
          const updated = { ...prev };
          delete updated[itemId];
          return updated;
        });
        break;
    }
    toast.success(t('branding.disconnected'));
  };

  const handleEdit = (itemId: string) => {
    toast.success(t('branding.editFeatureUnderDev'));
  };

  const handleMainTabChange = (tab: MainTabType) => {
    setActiveMainTab(tab);
    setActiveSubTab('connected');
    setSelectedItems([]);
    setSelectedPackaging(null);
    setSearchTerm('');
  };

  const filteredItems = getFilteredItems();
  const connectionCount = Object.keys(getCurrentConnections()).length;
  const totalItems = getItems().length;

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('branding.packagingConnection')}
        subtitle={t('branding.packagingConnectionSubtitle')}
        breadcrumb={[
          { label: t('nav.branding') },
          { label: t('branding.packagingConnection') },
        ]}
        actions={
          activeSubTab === 'unconnected' ? (
            <Button
              variant="primary"
              leftIcon={<Link2 className="w-4 h-4" />}
              onClick={handleSaveConnection}
              disabled={selectedItems.length === 0 || !selectedPackaging}
            >
              {t('branding.saveConnection')}
            </Button>
          ) : undefined
        }
      />

      <div className="space-y-2">
        <div className="bg-white rounded-xl border border-gray-200 p-2 inline-flex gap-1">
          <TabButton
            active={activeMainTab === 'stores'}
            onClick={() => handleMainTabChange('stores')}
          >
            <Store className="w-4 h-4 inline-block mr-2" />
            Store
          </TabButton>
          <TabButton
            active={activeMainTab === 'orders'}
            onClick={() => handleMainTabChange('orders')}
          >
            <ShoppingCart className="w-4 h-4 inline-block mr-2" />
            Orders
          </TabButton>
          <TabButton
            active={activeMainTab === 'products'}
            onClick={() => handleMainTabChange('products')}
          >
            <Package className="w-4 h-4 inline-block mr-2" />
            Products
          </TabButton>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 max-w-2xl">
          <p className="text-sm text-blue-700 font-medium">
            {activeMainTab === 'products' && '📦 The package will be used for each connected product, with quantities based on the number of SKUs.'}
            {activeMainTab === 'orders' && '🛒 The package will be used for the order. All orders includes this SKU will be packaged with this specific package (one piece per order only).'}
            {activeMainTab === 'stores' && '🏪 The package will be used for the store. All orders from this store will be packaged in this specific package (one piece per order).'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {(activeMainTab === 'products' || activeMainTab === 'orders') && (
          <div className="border-b border-gray-200 px-6 pt-4">
            <div className="flex items-center gap-6">
              <TabButton
                variant="sub"
                active={activeSubTab === 'connected'}
                onClick={() => {
                  setActiveSubTab('connected');
                  setSelectedItems([]);
                  setSelectedPackaging(null);
                }}
              >
                {t('branding.connected')} ({connectionCount})
              </TabButton>
              <TabButton
                variant="sub"
                active={activeSubTab === 'unconnected'}
                onClick={() => {
                  setActiveSubTab('unconnected');
                  setSelectedItems([]);
                  setSelectedPackaging(null);
                }}
              >
                {t('branding.unconnected')} ({totalItems - connectionCount})
              </TabButton>
            </div>
          </div>
        )}

        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('branding.searchConnectionPlaceholder', { type: activeMainTab })}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {activeSubTab === 'unconnected' && (
            <div className="flex items-center gap-3">
              {selectedItems.length > 0 && (
                <>
                  <span className="text-sm text-gray-500">
                    {t('branding.itemsSelected', { count: selectedItems.length })}
                  </span>
                  <Button variant="ghost" size="sm" onClick={handleSelectAll}>
                    {selectedItems.length === filteredItems.length ? t('common.deselectAll') : t('common.selectAll')}
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-500">
          <div className="col-span-1 flex items-center">
            <div
              onClick={handleSelectAll}
              className={cn(
                'w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer',
                selectedItems.length === filteredItems.length && filteredItems.length > 0
                  ? 'bg-primary-500 border-primary-500'
                  : 'border-gray-300'
              )}
            >
              {selectedItems.length === filteredItems.length && filteredItems.length > 0 && (
                <Check className="w-3 h-3 text-white" />
              )}
            </div>
          </div>
          <div className="col-span-4">{t('branding.productName')}</div>
          <div className="col-span-3">{t('branding.storeName')}</div>
          <div className="col-span-2">{t('common.status')}</div>
          <div className="col-span-2 text-center">{t('common.actions')}</div>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredItems.map((item: Record<string, unknown>) => {
            const itemId = item.id as string;
            const connections = getCurrentConnections();
            const isConnected = !!connections[itemId];
            const isSelected = selectedItems.includes(itemId);
            const packagingId = connections[itemId];
            const packaging = packagingId ? MOCK_PACKAGINGS.find((p) => p.id === packagingId) : null;

            let displayName = '';
            let subInfo = '';
            let image = '';
            let storeName = '';
            let platform = '';
            let status = '';

            if (activeMainTab === 'products') {
              const p = item as { name: string; sku: string; image: string; store: string | null; platform: string | null; status: string | null };
              displayName = p.name;
              subInfo = `SKU: ${p.sku}`;
              image = p.image;
              storeName = p.store || '';
              platform = p.platform || '';
              status = p.status || '';
            } else if (activeMainTab === 'orders') {
              const o = item as { orderNumber: string; customer: string; items: number; image: string; store: string | null; platform: string | null; status: string | null };
              displayName = o.orderNumber;
              subInfo = `${o.customer} • ${o.items} items`;
              image = o.image;
              storeName = o.store || '';
              platform = o.platform || '';
              status = o.status || '';
            } else {
              const s = item as { name: string; platform: string; products: number; image: string; status: string };
              displayName = s.name;
              subInfo = `${s.platform} • ${s.products} products`;
              image = s.image;
              storeName = s.name;
              platform = s.platform;
              status = s.status;
            }

            return (
              <div
                key={itemId}
                className={cn(
                  'grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors',
                  isSelected && 'bg-primary-50'
                )}
              >
                <div className="col-span-1 flex items-center">
                  <div
                    onClick={() => handleItemSelect(itemId)}
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

                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      src={image}
                      alt={displayName}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 truncate">{displayName}</div>
                    <div className="text-sm text-gray-500">{subInfo}</div>
                  </div>
                </div>

                <div className="col-span-3">
                  {activeSubTab === 'connected' || activeMainTab === 'stores' ? (
                    <div className="flex items-center gap-2">
                      <Badge variant="default" size="sm">
                        {platform}
                      </Badge>
                      <span className="text-sm text-gray-700 truncate">{storeName}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">—</span>
                  )}
                </div>

                <div className="col-span-2">
                  {activeSubTab === 'connected' || activeMainTab === 'stores' ? (
                    <Badge
                      variant={status === 'active' ? 'success' : 'default'}
                      size="sm"
                    >
                      {status === 'active' ? t('common.active') : t('common.inactive')}
                    </Badge>
                  ) : (
                    <Badge variant="warning" size="sm">
                      {t('branding.notConnected')}
                    </Badge>
                  )}
                </div>

                <div className="col-span-2 flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(itemId)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  {(activeSubTab === 'connected' || activeMainTab === 'stores') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDisconnect(itemId)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Unlink className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}

          {filteredItems.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              {activeSubTab === 'connected'
                ? t('branding.noConnectedItems', { type: activeMainTab })
                : t('branding.allItemsConnected', { type: activeMainTab })}
            </div>
          )}
        </div>
      </div>

      {activeSubTab === 'unconnected' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900">{t('branding.selectPackaging')}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {t('branding.selectPackagingHint')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {MOCK_PACKAGINGS.map((packaging) => {
              const isSelected = selectedPackaging === packaging.id;
              return (
                <div
                  key={packaging.id}
                  onClick={() => setSelectedPackaging(packaging.id)}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all',
                    isSelected
                      ? 'bg-primary-50 border-primary-300 ring-2 ring-primary-200'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      src={packaging.image}
                      alt={packaging.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{packaging.name}</div>
                    <Badge variant="default" size="sm" className="mt-1">
                      {packaging.type}
                    </Badge>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
