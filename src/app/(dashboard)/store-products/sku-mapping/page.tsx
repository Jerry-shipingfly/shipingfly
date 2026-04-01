/**
 * Store Products SKU Mapping Page
 * @description Manage SKU mapping between Shopify store products and platform local SKUs
 */

'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Link2,
  Unlink2,
  RefreshCw,
  Store,
  Package,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ArrowRight,
  MoreHorizontal,
  Download,
  Upload,
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/utils/helpers';
import { formatPrice, formatDate } from '@/utils/helpers';

/**
 * Store Product Item (from Shopify)
 */
interface StoreProduct {
  id: string;
  storeId: string;
  storeName: string;
  spu: string;
  sku: string;
  productName: string;
  variantName?: string;
  image?: string;
  price: number;
  currency: string;
  stock: number;
  status: 'active' | 'draft' | 'archived';
  mappedSku?: string;
  mappedProductName?: string;
  mappedProductImage?: string;
  mappedAt?: string;
}

/**
 * Platform SKU Item
 */
interface PlatformSku {
  id: string;
  sku: string;
  productName: string;
  image?: string;
  price: number;
  stock: number;
  status: 'available' | 'low_stock' | 'out_of_stock';
}

// Mock data for store products
const mockStoreProducts: StoreProduct[] = [
  {
    id: '1',
    storeId: 'store-1',
    storeName: 'My Shopify Store',
    spu: 'SPU-001',
    sku: 'SKU-SHOP-001',
    productName: 'Wireless Bluetooth Earbuds',
    variantName: 'Black',
    image: '/mocks/products/product-1.jpg',
    price: 29.99,
    currency: 'USD',
    stock: 150,
    status: 'active',
    mappedSku: 'SKU-HZ-001',
    mappedProductName: 'TWS Earbuds Pro',
    mappedProductImage: '/mocks/products/product-1.jpg',
    mappedAt: '2024-01-15',
  },
  {
    id: '2',
    storeId: 'store-1',
    storeName: 'My Shopify Store',
    spu: 'SPU-002',
    sku: 'SKU-SHOP-002',
    productName: 'Smart Watch Pro',
    variantName: 'Silver / 44mm',
    image: '/mocks/products/product-2.jpg',
    price: 199.99,
    currency: 'USD',
    stock: 45,
    status: 'active',
  },
  {
    id: '3',
    storeId: 'store-2',
    storeName: 'Second Store',
    spu: 'SPU-003',
    sku: 'SKU-SHOP-003',
    productName: 'Portable Power Bank',
    variantName: '20000mAh',
    image: '/mocks/products/product-3.jpg',
    price: 39.99,
    currency: 'USD',
    stock: 200,
    status: 'active',
    mappedSku: 'SKU-HZ-003',
    mappedProductName: 'Power Bank 20K',
    mappedProductImage: '/mocks/products/product-3.jpg',
    mappedAt: '2024-01-10',
  },
  {
    id: '4',
    storeId: 'store-1',
    storeName: 'My Shopify Store',
    spu: 'SPU-004',
    sku: 'SKU-SHOP-004',
    productName: 'Wireless Charging Pad',
    variantName: 'White',
    image: '/mocks/products/product-4.jpg',
    price: 24.99,
    currency: 'USD',
    stock: 0,
    status: 'draft',
  },
  {
    id: '5',
    storeId: 'store-2',
    storeName: 'Second Store',
    spu: 'SPU-005',
    sku: 'SKU-SHOP-005',
    productName: 'USB-C Hub Adapter',
    image: '/mocks/products/product-5.jpg',
    price: 49.99,
    currency: 'USD',
    stock: 88,
    status: 'active',
  },
];

// Mock data for platform SKUs
const mockPlatformSkus: PlatformSku[] = [
  { id: 'p1', sku: 'SKU-HZ-001', productName: 'TWS Earbuds Pro', image: '/mocks/products/product-1.jpg', price: 15.99, stock: 500, status: 'available' },
  { id: 'p2', sku: 'SKU-HZ-002', productName: 'Smart Watch X200', image: '/mocks/products/product-2.jpg', price: 89.99, stock: 120, status: 'available' },
  { id: 'p3', sku: 'SKU-HZ-003', productName: 'Power Bank 20K', image: '/mocks/products/product-3.jpg', price: 18.99, stock: 350, status: 'available' },
  { id: 'p4', sku: 'SKU-HZ-004', productName: 'Wireless Charger 15W', image: '/mocks/products/product-4.jpg', price: 12.99, stock: 5, status: 'low_stock' },
  { id: 'p5', sku: 'SKU-HZ-005', productName: 'USB-C Hub 7-in-1', image: '/mocks/products/product-5.jpg', price: 22.99, stock: 0, status: 'out_of_stock' },
  { id: 'p6', sku: 'SKU-HZ-006', productName: 'Bluetooth Speaker Mini', image: '/mocks/products/product-6.jpg', price: 19.99, stock: 200, status: 'available' },
];

/**
 * SKU Mapping Modal Component
 */
interface SkuMappingModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeProduct: StoreProduct | null;
  onConfirm: (storeProductId: string, platformSku: PlatformSku) => void;
}

const SkuMappingModal: React.FC<SkuMappingModalProps> = ({
  isOpen,
  onClose,
  storeProduct,
  onConfirm,
}) => {
  const { t } = useTranslation();
  const [searchSku, setSearchSku] = useState('');
  const [selectedSku, setSelectedSku] = useState<PlatformSku | null>(null);

  // Filter platform SKUs by search
  const filteredSkus = useMemo(() => {
    if (!searchSku) return mockPlatformSkus;
    const search = searchSku.toLowerCase();
    return mockPlatformSkus.filter(
      sku => sku.sku.toLowerCase().includes(search) || sku.productName.toLowerCase().includes(search)
    );
  }, [searchSku]);

  const handleConfirm = () => {
    if (storeProduct && selectedSku) {
      onConfirm(storeProduct.id, selectedSku);
      onClose();
      setSelectedSku(null);
      setSearchSku('');
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedSku(null);
    setSearchSku('');
  };

  if (!isOpen || !storeProduct) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{t('storeProducts.skuMapping')}</h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Store Product Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-2">{t('storeProducts.storeProductInfo')}</p>
            <div className="flex items-center gap-4">
              {storeProduct.image && (
                <img src={storeProduct.image} alt="" className="w-16 h-16 rounded-lg object-cover" />
              )}
              <div className="flex-1">
                <p className="font-medium text-gray-900">{storeProduct.productName}</p>
                <p className="text-sm text-gray-500">
                  {t('storeProducts.storeSku')}: {storeProduct.sku}
                </p>
                <p className="text-sm text-gray-500">
                  {t('storeProducts.price')}: {formatPrice(storeProduct.price, storeProduct.currency)}
                </p>
              </div>
            </div>
          </div>

          {/* Search Platform SKU */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('storeProducts.selectPlatformSku')}
            </label>
            <Input
              placeholder={t('storeProducts.searchSkuPlaceholder')}
              value={searchSku}
              onChange={(e) => setSearchSku(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          {/* Platform SKU List */}
          <div className="border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
            {filteredSkus.map((sku) => (
              <button
                key={sku.id}
                type="button"
                onClick={() => setSelectedSku(sku)}
                className={cn(
                  'w-full flex items-center gap-4 p-3 text-left hover:bg-gray-50 transition-colors',
                  selectedSku?.id === sku.id && 'bg-blue-50 border-l-2 border-blue-500'
                )}
              >
                {sku.image && (
                  <img src={sku.image} alt="" className="w-12 h-12 rounded object-cover" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{sku.productName}</p>
                  <p className="text-sm text-gray-500">{sku.sku}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{formatPrice(sku.price, 'USD')}</p>
                  <Badge
                  variant={sku.status === 'available' ? 'success' : sku.status === 'low_stock' ? 'warning' : 'danger'}
                    size="sm"
                  >
                    {t(`storeProducts.${sku.status}`)}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <Button variant="secondary" onClick={handleClose}>
            {t('common.cancel')}
          </Button>
          <Button variant="primary" onClick={handleConfirm} disabled={!selectedSku}>
            <Link2 className="w-4 h-4 mr-2" />
            {t('storeProducts.confirmMapping')}
          </Button>
        </div>
      </div>
    </div>
  );
};

/**
 * Store Products SKU Mapping Page Component
 */
export default function StoreProductsSkuMappingPage() {
  const { t } = useTranslation();

  // State
  const [storeProducts, setStoreProducts] = useState<StoreProduct[]>(mockStoreProducts);
  const [searchValue, setSearchValue] = useState('');
  const [storeFilter, setStoreFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [mappingProduct, setMappingProduct] = useState<StoreProduct | null>(null);
  const [isMappingModalOpen, setIsMappingModalOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Store options
  const storeOptions = useMemo(() => {
    const stores = [...new Set(storeProducts.map(p => ({ id: p.storeId, name: p.storeName })))];
    return [
      { value: '', label: t('common.all') },
      ...stores.map(s => ({ value: s.id, label: s.name }))
    ];
  }, [storeProducts, t]);

  // Status options
  const statusOptions = [
    { value: '', label: t('common.all') },
    { value: 'mapped', label: t('storeProducts.mapped') },
    { value: 'unmapped', label: t('storeProducts.unmapped') },
  ];

  // Filter products
  const filteredProducts = useMemo(() => {
    return storeProducts.filter(product => {
      // Search filter
      if (searchValue) {
        const search = searchValue.toLowerCase();
        const matchSearch =
          product.sku.toLowerCase().includes(search) ||
          product.productName.toLowerCase().includes(search) ||
          product.mappedSku?.toLowerCase().includes(search);
        if (!matchSearch) return false;
      }

      // Store filter
      if (storeFilter && product.storeId !== storeFilter) return false;

      // Status filter
      if (statusFilter === 'mapped' && !product.mappedSku) return false;
      if (statusFilter === 'unmapped' && product.mappedSku) return false;

      return true;
    });
  }, [storeProducts, searchValue, storeFilter, statusFilter]);

  // Statistics
  const stats = useMemo(() => ({
    total: storeProducts.length,
    mapped: storeProducts.filter(p => p.mappedSku).length,
    unmapped: storeProducts.filter(p => !p.mappedSku).length,
  }), [storeProducts]);

  // Handle mapping
  const handleOpenMapping = (product: StoreProduct) => {
    setMappingProduct(product);
    setIsMappingModalOpen(true);
  };

  const handleConfirmMapping = (storeProductId: string, platformSku: PlatformSku) => {
    setStoreProducts(prev => prev.map(p => {
      if (p.id === storeProductId) {
        return {
          ...p,
          mappedSku: platformSku.sku,
          mappedProductName: platformSku.productName,
          mappedProductImage: platformSku.image,
          mappedAt: new Date().toISOString().split('T')[0],
        };
      }
      return p;
    }));
  };

  // Handle unlink
  const handleUnlink = (storeProductId: string) => {
    setStoreProducts(prev => prev.map(p => {
      if (p.id === storeProductId) {
        return {
          ...p,
          mappedSku: undefined,
          mappedProductName: undefined,
          mappedProductImage: undefined,
          mappedAt: undefined,
        };
      }
      return p;
    }));
  };

  // Toggle row expansion
  const toggleRowExpand = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={t('storeProducts.title')}
        subtitle={t('storeProducts.subtitle')}
        breadcrumb={[
          { label: t('nav.dashboard'), href: '/dashboard' },
          { label: t('nav.storeProducts') },
          { label: t('nav.storeProductsSkuMapping') },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" leftIcon={<Upload className="w-4 h-4" />}>
              {t('storeProducts.importMappings')}
            </Button>
            <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />}>
              {t('storeProducts.exportMappings')}
            </Button>
            <Button variant="primary" leftIcon={<RefreshCw className="w-4 h-4" />}>
              {t('storeProducts.syncFromStore')}
            </Button>
          </div>
        }
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('storeProducts.totalProducts')}</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Link2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('storeProducts.mappedProducts')}</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.mapped}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('storeProducts.unmappedProducts')}</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.unmapped}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <Input
              placeholder={t('storeProducts.searchPlaceholder')}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          {/* Store Filter */}
          <div className="w-full sm:w-48">
            <Select
              options={storeOptions}
              value={storeFilter}
              onChange={setStoreFilter}
              placeholder={t('storeProducts.filterByStore')}
            />
          </div>

          {/* Status Filter */}
          <div className="w-full sm:w-40">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder={t('storeProducts.filterByStatus')}
            />
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 w-8"></th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">{t('storeProducts.storeProduct')}</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">{t('storeProducts.storeSku')}</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">{t('storeProducts.price')}</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">{t('storeProducts.mappingStatus')}</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">{t('storeProducts.platformSku')}</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredProducts.map((product) => (
              <React.Fragment key={product.id}>
                {/* Main Row */}
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleRowExpand(product.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {expandedRows.has(product.id) ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt=""
                          className="w-10 h-10 rounded object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                          <Package className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                          {product.productName}
                        </p>
                        {product.variantName && (
                          <p className="text-xs text-gray-500">{product.variantName}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600 font-mono">{product.sku}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-900">
                      {formatPrice(product.price, product.currency)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {product.mappedSku ? (
                      <Badge variant="success" size="sm">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {t('storeProducts.mapped')}
                      </Badge>
                    ) : (
                      <Badge variant="warning" size="sm">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {t('storeProducts.unmapped')}
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {product.mappedSku ? (
                      <span className="text-sm text-green-600 font-mono">{product.mappedSku}</span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      {product.mappedSku ? (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenMapping(product)}
                            className="text-gray-600"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUnlink(product.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Unlink2 className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleOpenMapping(product)}
                          className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xs font-medium"
                        >
                          <Link2 className="w-3.5 h-3.5 mr-1" />
                          {t('storeProducts.mapSku')}
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>

                {/* Expanded Detail Row */}
                {expandedRows.has(product.id) && product.mappedSku && (
                  <tr className="bg-gray-50">
                    <td colSpan={7} className="px-4 py-4">
                      <div className="flex items-center gap-8">
                        {/* Store Product */}
                        <div className="flex items-center gap-3">
                          {product.image && (
                            <img src={product.image} alt="" className="w-14 h-14 rounded-lg object-cover" />
                          )}
                          <div>
                            <p className="text-xs text-gray-500">{t('storeProducts.storeProduct')}</p>
                            <p className="text-sm font-medium text-gray-900">{product.productName}</p>
                            <p className="text-xs text-gray-500">{product.sku}</p>
                          </div>
                        </div>

                        {/* Arrow */}
                        <div className="flex flex-col items-center">
                          <ArrowRight className="w-6 h-6 text-green-500" />
                          <span className="text-xs text-green-600 mt-1">{t('storeProducts.linked')}</span>
                        </div>

                        {/* Platform Product */}
                        <div className="flex items-center gap-3">
                          {product.mappedProductImage && (
                            <img src={product.mappedProductImage} alt="" className="w-14 h-14 rounded-lg object-cover" />
                          )}
                          <div>
                            <p className="text-xs text-gray-500">{t('storeProducts.platformProduct')}</p>
                            <p className="text-sm font-medium text-gray-900">{product.mappedProductName}</p>
                            <p className="text-xs text-gray-500">{product.mappedSku}</p>
                          </div>
                        </div>

                        {/* Mapping Info */}
                        <div className="ml-auto text-right">
                          <p className="text-xs text-gray-500">{t('storeProducts.mappedAt')}</p>
                          <p className="text-sm text-gray-600">{product.mappedAt}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">{t('storeProducts.noProducts')}</p>
          </div>
        )}
      </div>

      {/* SKU Mapping Modal */}
      <SkuMappingModal
        isOpen={isMappingModalOpen}
        onClose={() => setIsMappingModalOpen(false)}
        storeProduct={mappingProduct}
        onConfirm={handleConfirmMapping}
      />
    </div>
  );
}
