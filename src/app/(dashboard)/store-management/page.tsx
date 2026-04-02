/**
 * Store Management Page
 * @description Manage connected e-commerce platform stores with platform binding entry points
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Plus,
  RefreshCw,
  Store,
  Building2,
  ExternalLink,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Table, TableColumn } from '@/components/ui/Table';
import { BindShopifyModal, BindOfflineStoreModal, UnbindStoreModal } from './components';
import { storeService } from '@/services/store.service';
import { formatDate, cn } from '@/utils/helpers';
import { useTranslation } from '@/hooks/useTranslation';

// Inline type definitions
type ID = string | number;
type Timestamp = string | Date;
type StorePlatform = 'shopify' | 'offline' | 'amazon' | 'ebay' | 'woocommerce' | 'magento' | 'custom';
type StoreStatus = 'connected' | 'disconnected' | 'pending' | 'error';

interface Store {
  id: ID;
  name: string;
  platform: StorePlatform;
  status: StoreStatus;
  url: string;
  logo?: string;
  description?: string;
  isConnected: boolean;
  lastSyncAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface StoreQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  platform?: StorePlatform;
  status?: StoreStatus;
  sortBy?: 'name' | 'createdAt' | 'lastSyncAt';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Platform card configuration
 */
interface PlatformConfig {
  id: StorePlatform;
  name: string;
  description: string;
  icon: React.ReactNode;
  logo?: string;
  color: string;
  bgColor: string;
  borderColor: string;
  features: string[];
  helpUrl?: string;
}

const PLATFORM_CARDS: PlatformConfig[] = [
  {
    id: 'shopify',
    name: 'Shopify Store',
    description: 'Connect your Shopify store to sync products and orders automatically',
    icon: null,
    logo: '/assets/platforms/shopify.svg',
    color: 'text-[#96BF48]',
    bgColor: 'bg-[#96BF48]/10',
    borderColor: 'border-[#96BF48]/30 hover:border-[#96BF48]',
    features: [
      'Auto-sync products',
      'Real-time order sync',
      'Inventory management',
      'Automated Fulfillment',
    ],
    helpUrl: 'https://help.shopify.com',
  },
  {
    id: 'offline',
    name: 'Offline Store',
    description: 'Register your offline/physical store for manual order processing',
    icon: <Building2 className="w-8 h-8" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200 hover:border-blue-400',
    features: [
      'Manual order entry',
      'Inventory tracking',
      'Real-time Tracking',
      'Global Warehouse Network',
    ],
  },
];

/**
 * Platform options for filter
 */
const PLATFORM_OPTIONS = [
  { value: '', label: 'Platforms' },
  { value: 'shopify', label: 'Shopify' },
  { value: 'offline', label: 'Offline Store' },
];

/**
 * Status options for filter
 */
const STATUS_OPTIONS = [
  { value: '', label: 'Statuses' },
  { value: 'connected', label: 'Connected' },
  { value: 'error', label: 'Error' },
];

/**
 * Platform name mapping
 */
const PLATFORM_LABELS: Record<string, string> = {
  shopify: 'Shopify',
  offline: 'Offline Store',
  amazon: 'Amazon',
  ebay: 'eBay',
  woocommerce: 'WooCommerce',
  magento: 'Magento',
  custom: 'Custom',
};

/**
 * Store Management Page Component
 */
export default function StoreManagementPage() {
  const router = useRouter();
  const { t } = useTranslation();

  // Store list state
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // Filter state
  const [searchText, setSearchText] = useState('');
  const [platformFilter, setPlatformFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal state
  const [shopifyModalOpen, setShopifyModalOpen] = useState(false);
  const [offlineStoreModalOpen, setOfflineStoreModalOpen] = useState(false);
  const [unbindModalOpen, setUnbindModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  // Platform stats
  const [platformStats, setPlatformStats] = useState<Record<string, number>>({
    shopify: 0,
    offline: 0,
  });

  /**
   * Load store list
   */
  const loadStores = useCallback(async () => {
    setLoading(true);
    try {
      const params: StoreQueryParams = {
        page,
        limit: pageSize,
      };

      if (searchText) {
        params.search = searchText;
      }
      if (platformFilter) {
        params.platform = platformFilter as StoreQueryParams['platform'];
      }
      if (statusFilter) {
        params.status = statusFilter as StoreQueryParams['status'];
      }

      const result = await storeService.getStores(params);
      setStores(result.data);
      setTotal(result.total);

      // Calculate platform stats
      const stats: Record<string, number> = { shopify: 0, offline: 0 };
      result.data.forEach((store: Store) => {
        if (store.platform === 'shopify') stats.shopify++;
        if (store.platform === 'offline') stats.offline++;
      });
      setPlatformStats(stats);
    } catch (error) {
      console.error('Failed to load stores:', error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchText, platformFilter, statusFilter]);

  useEffect(() => {
    loadStores();
  }, [loadStores]);

  /**
   * Handle platform card click
   */
  const handlePlatformClick = (platform: StorePlatform) => {
    if (platform === 'shopify') {
      setShopifyModalOpen(true);
    } else if (platform === 'offline') {
      setOfflineStoreModalOpen(true);
    }
  };

  /**
   * Handle search
   */
  const handleSearch = (value: string) => {
    setSearchText(value);
    setPage(1);
  };

  /**
   * Handle filter change
   */
  const handleFilterChange = (type: 'platform' | 'status', value: string) => {
    if (type === 'platform') {
      setPlatformFilter(value);
    } else {
      setStatusFilter(value);
    }
    setPage(1);
  };

  /**
   * Open unbind modal
   */
  const handleOpenUnbindModal = (store: Store) => {
    setSelectedStore(store);
    setUnbindModalOpen(true);
  };

  /**
   * Unbind store
   */
  const handleUnbindStore = async (storeId: string) => {
    await storeService.unbindStore(storeId);
    loadStores();
  };

  /**
   * Bind success callback
   */
  const handleBindSuccess = () => {
    loadStores();
  };

  /**
   * Get platform icon
   */
  const getPlatformIcon = (platform: string) => {
    const config = PLATFORM_CARDS.find((p) => p.id === platform);
    if (config?.logo) {
      return (
        <Image
          src={config.logo}
          alt={config.name}
          width={32}
          height={32}
          className="w-8 h-8 object-contain"
        />
      );
    }
    if (config?.icon) {
      return <div className={config.color}>{config.icon}</div>;
    }
    return <Store className="w-5 h-5 text-gray-400" />;
  };

  /**
   * Table column configuration
   */
  const columns: TableColumn<Store>[] = [
    {
      title: 'Store Name',
      dataIndex: 'name',
      width: 240,
      render: (value, record) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
            {getPlatformIcon(record.platform)}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-gray-900 truncate">{record.name}</p>
            <p className="text-sm text-gray-500 truncate">{record.url}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Platform',
      dataIndex: 'platform',
      width: 130,
      render: (value) => (
        <span className="text-gray-600">
          {PLATFORM_LABELS[String(value)] || String(value)}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 110,
      render: (value) => <StatusBadge status={String(value as string)} />,
    },
    {
      title: 'Last Sync',
      dataIndex: 'lastSyncAt',
      width: 190,
      render: (value) => (
        <span className="text-gray-500">
          {value ? formatDate(String(value), 'datetime') : '-'}
        </span>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      width: 140,
      render: (value) => (
        <span className="text-gray-500">
          {formatDate(String(value), 'short')}
        </span>
      ),
    },
    {
      title: 'Actions',
      width: 72,
      align: 'center',
      render: (_, record) => (
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenUnbindModal(record);
            }}
            className={cn(
              'p-2 rounded-lg transition-colors',
              'text-gray-400 hover:text-red-600 hover:bg-red-50'
            )}
            title="Rebind Store"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <PageHeader
        title={t('storeManagement.title')}
        subtitle={t('storeManagement.subtitle')}
      />

      {/* Platform Binding Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PLATFORM_CARDS.map((platform) => {
          const connectedCount = platformStats[platform.id] || 0;

          return (
            <div
              key={platform.id}
              className={cn(
                'relative bg-white rounded-xl border-2 transition-all duration-300',
                'hover:shadow-lg cursor-pointer group',
                platform.borderColor
              )}
              onClick={() => handlePlatformClick(platform.id)}
            >
              {/* Card content */}
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    {/* Platform icon */}
                    <div
                      className={cn(
                        'w-14 h-14 rounded-xl flex items-center justify-center',
                        platform.bgColor
                      )}
                    >
                      {platform.logo ? (
                        <Image
                          src={platform.logo}
                          alt={platform.name}
                          width={32}
                          height={32}
                          className="w-8 h-8 object-contain"
                        />
                      ) : (
                        <div className={platform.color}>{platform.icon}</div>
                      )}
                    </div>

                    {/* Platform name and status */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {platform.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {connectedCount > 0 ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-green-600">
                              {connectedCount} store{connectedCount > 1 ? 's' : ''} connected
                            </span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              Not connected
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Arrow icon */}
                  <ArrowRight
                    className={cn(
                      'w-5 h-5 text-gray-400 transition-transform',
                      'group-hover:translate-x-1 group-hover:text-primary-500'
                    )}
                  />
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4">
                  {platform.description}
                </p>

                {/* Features */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {platform.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Action button */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Plus className="w-4 h-4" />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlatformClick(platform.id);
                    }}
                  >
                    {connectedCount > 0 ? 'Add Another' : 'Connect Store'}
                  </Button>

                  {platform.helpUrl && (
                    <a
                      href={platform.helpUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 transition-colors"
                    >
                      <span>Help</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Connected Stores Section */}
      <div className="bg-white rounded-xl shadow-sm">
        {/* Section header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('storeManagement.connectedStores')}
            </h3>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Platform filter */}
              <div className="w-full sm:w-36">
                <Select
                  options={PLATFORM_OPTIONS}
                  value={platformFilter}
                  onChange={(value) => handleFilterChange('platform', value)}
                  placeholder="Platform"
                />
              </div>

              {/* Status filter */}
              <div className="w-full sm:w-36">
                <Select
                  options={STATUS_OPTIONS}
                  value={statusFilter}
                  onChange={(value) => handleFilterChange('status', value)}
                  placeholder="Status"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Store list table */}
        <div className="p-6">
          <Table
            dataSource={stores}
            columns={columns}
            rowKey="id"
            loading={loading}
            pagination={
              total >= 5
                ? {
                    current: page,
                    pageSize,
                    total,
                    onChange: (newPage) => setPage(newPage),
                  }
                : false
            }
            emptyText="No store data available"
            rowClassName={(record) => {
              if (record.status === 'connected' && record.url && String(record.url).startsWith('http')) {
                return 'hover:bg-primary-50/50';
              }
              if (record.status === 'error') {
                return 'hover:bg-red-50/50';
              }
              return '';
            }}
            onRowClick={(record) => {
              if (record.status === 'connected' && record.url && String(record.url).startsWith('http')) {
                window.open(String(record.url), '_blank');
              } else if (record.status === 'error') {
                handlePlatformClick(record.platform);
              } else {
                router.push(`/store-management/${record.id}`);
              }
            }}
            hoverable
          />
        </div>
      </div>

      {/* Bind Shopify store modal */}
      <BindShopifyModal
        isOpen={shopifyModalOpen}
        onClose={() => setShopifyModalOpen(false)}
        onSuccess={handleBindSuccess}
      />

      {/* Bind Offline store modal */}
      <BindOfflineStoreModal
        isOpen={offlineStoreModalOpen}
        onClose={() => setOfflineStoreModalOpen(false)}
        onSuccess={handleBindSuccess}
      />

      {/* Unbind store modal */}
      <UnbindStoreModal
        isOpen={unbindModalOpen}
        onClose={() => {
          setUnbindModalOpen(false);
          setSelectedStore(null);
        }}
        store={selectedStore}
        onConfirm={handleUnbindStore}
        onSuccess={handleBindSuccess}
      />
    </div>
  );
}
