/**
 * Packaging Products Panel
 * @description Content for the Packaging Products tab within Branding
 */

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Table, TableColumn } from '@/components/ui/Table';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Plus, Search, Edit, Trash2, ShoppingCart, Package } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '@/utils/helpers';
import { formatPrice } from '@/utils/helpers';
import { Packaging } from '@/types/packaging.types';
import { useTranslation } from '@/hooks/useTranslation';

// Tab types
type TabType = 'products' | 'my-packaging';

const ALL_PACKAGING_PRODUCTS: Packaging[] = [
  {
    id: 'pkg1',
    name: 'Standard Shipping Box (Small)',
    specifications: '20x15x10cm',
    inventory: 5000,
    costPrice: 2.5,
    suggestedRetailPrice: 5.0,
    type: 'box',
    image: 'https://picsum.photos/seed/box-small/80/80',
    status: 'active',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-03-28T10:00:00Z',
  },
  {
    id: 'pkg2',
    name: 'Standard Shipping Box (Medium)',
    specifications: '30x20x15cm',
    inventory: 3500,
    costPrice: 3.5,
    suggestedRetailPrice: 6.5,
    type: 'box',
    image: 'https://picsum.photos/seed/box-medium/80/80',
    status: 'active',
    createdAt: '2024-01-16T09:00:00Z',
    updatedAt: '2024-03-27T11:00:00Z',
  },
  {
    id: 'pkg3',
    name: 'Standard Shipping Box (Large)',
    specifications: '40x30x20cm',
    inventory: 2000,
    costPrice: 5.0,
    suggestedRetailPrice: 9.0,
    type: 'box',
    image: 'https://picsum.photos/seed/box-large/80/80',
    status: 'active',
    createdAt: '2024-01-17T10:00:00Z',
    updatedAt: '2024-03-26T14:00:00Z',
  },
  {
    id: 'pkg4',
    name: 'Bubble Wrap (Small)',
    specifications: '20x15cm',
    inventory: 8000,
    costPrice: 1.2,
    suggestedRetailPrice: 3.0,
    type: 'wrapper',
    image: 'https://picsum.photos/seed/bubble-wrap-s/80/80',
    status: 'active',
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-03-25T11:00:00Z',
  },
  {
    id: 'pkg5',
    name: 'Bubble Wrap (Medium)',
    specifications: '30x20cm',
    inventory: 6000,
    costPrice: 2.0,
    suggestedRetailPrice: 4.0,
    type: 'wrapper',
    image: 'https://picsum.photos/seed/bubble-wrap-m/80/80',
    status: 'active',
    createdAt: '2024-02-03T10:00:00Z',
    updatedAt: '2024-03-22T16:00:00Z',
  },
  {
    id: 'pkg6',
    name: 'Bubble Wrap (Large)',
    specifications: '40x30x40cm',
    inventory: 4000,
    costPrice: 3.5,
    suggestedRetailPrice: 5.5,
    type: 'wrapper',
    image: 'https://picsum.photos/seed/bubble-wrap-l/80/80',
    status: 'active',
    createdAt: '2024-02-05T11:00:00Z',
    updatedAt: '2024-03-23T14:00:00Z',
  },
  {
    id: 'pkg7',
    name: 'Shipping Bag (Small)',
    specifications: '25x20cm',
    inventory: 10000,
    costPrice: 1.0,
    suggestedRetailPrice: 2.5,
    type: 'bag',
    image: 'https://picsum.photos/seed/shipping-bag-s/80/80',
    status: 'active',
    createdAt: '2024-02-10T14:00:00Z',
    updatedAt: '2024-03-20T10:00:00Z',
  },
  {
    id: 'pkg8',
    name: 'Shipping Bag (Medium)',
    specifications: '35x25cm',
    inventory: 8000,
    costPrice: 1.5,
    suggestedRetailPrice: 3.0,
    type: 'bag',
    image: 'https://picsum.photos/seed/shipping-bag-m/80/80',
    status: 'active',
    createdAt: '2024-02-12T16:00:00Z',
    updatedAt: '2024-03-21T09:00:00Z',
  },
  {
    id: 'pkg9',
    name: 'Shipping Bag (Large)',
    specifications: '45x35cm',
    inventory: 5000,
    costPrice: 2.0,
    suggestedRetailPrice: 4.5,
    type: 'bag',
    image: 'https://picsum.photos/seed/shipping-bag-l/80/80',
    status: 'active',
    createdAt: '2024-02-15T18:00:00Z',
    updatedAt: '2024-03-22T11:00:00Z',
  },
  {
    id: 'pkg10',
    name: 'Thank You Card (Standard)',
    specifications: '10x8cm',
    inventory: 3000,
    costPrice: 0.8,
    suggestedRetailPrice: 2.0,
    type: 'card',
    image: 'https://picsum.photos/seed/thank-you-card/80/80',
    status: 'active',
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-28T16:00:00Z',
  },
  {
    id: 'pkg11',
    name: 'Filler (Foam Particles)',
    specifications: '5kg/bag',
    inventory: 200,
    costPrice: 15.0,
    suggestedRetailPrice: 35.0,
    type: 'filler',
    image: 'https://picsum.photos/seed/foam-particles/80/80',
    status: 'active',
    createdAt: '2024-03-05T11:00:00Z',
    updatedAt: '2024-03-28T17:00:00Z',
  },
  {
    id: 'pkg12',
    name: 'Filler (Paper Shreds)',
    specifications: '2kg/bag',
    inventory: 150,
    costPrice: 8.0,
    suggestedRetailPrice: 18.0,
    type: 'filler',
    image: 'https://picsum.photos/seed/paper-shreds/80/80',
    status: 'active',
    createdAt: '2024-03-10T09:00:00Z',
    updatedAt: '2024-03-28T09:00:00Z',
  },
];

const MY_PACKAGINGS: Packaging[] = [
  {
    id: 'my-pkg1',
    name: 'Custom Branded Box (Small)',
    specifications: '18x12x8cm',
    inventory: 500,
    costPrice: 4.5,
    suggestedRetailPrice: 8.0,
    type: 'box',
    image: 'https://picsum.photos/seed/custom-box-s/80/80',
    status: 'active',
    createdAt: '2024-02-20T10:00:00Z',
    updatedAt: '2024-03-28T09:00:00Z',
  },
  {
    id: 'my-pkg2',
    name: 'Custom Branded Box (Large)',
    specifications: '35x25x18cm',
    inventory: 300,
    costPrice: 7.0,
    suggestedRetailPrice: 12.0,
    type: 'box',
    image: 'https://picsum.photos/seed/custom-box-l/80/80',
    status: 'active',
    createdAt: '2024-02-22T14:00:00Z',
    updatedAt: '2024-03-27T11:00:00Z',
  },
  {
    id: 'my-pkg3',
    name: 'Logo Thank You Card',
    specifications: '10x8cm',
    inventory: 2000,
    costPrice: 1.2,
    suggestedRetailPrice: 3.5,
    type: 'card',
    image: 'https://picsum.photos/seed/logo-card/80/80',
    status: 'active',
    createdAt: '2024-03-05T09:00:00Z',
    updatedAt: '2024-03-28T15:00:00Z',
  },
  {
    id: 'my-pkg4',
    name: 'Custom Tissue Paper',
    specifications: '50x70cm',
    inventory: 800,
    costPrice: 0.8,
    suggestedRetailPrice: 2.0,
    type: 'wrapper',
    image: 'https://picsum.photos/seed/tissue-paper/80/80',
    status: 'inactive',
    createdAt: '2024-03-10T11:00:00Z',
    updatedAt: '2024-03-28T10:00:00Z',
  },
];

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={cn(
      'px-5 py-2.5 text-sm font-medium rounded-lg transition-all',
      active
        ? 'bg-primary-500 text-white shadow-sm'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
    )}
  >
    {children}
  </button>
);

export const PackagingProductsPanel: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const currentData = activeTab === 'products' ? ALL_PACKAGING_PRODUCTS : MY_PACKAGINGS;

  const filteredPackagings = currentData.filter((packaging) => {
    const matchesSearch = searchTerm
      ? packaging.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        packaging.specifications.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesType = filterType === 'all' || packaging.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleSelectAll = () => {
    if (selectedIds.length === filteredPackagings.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredPackagings.map((p) => p.id));
    }
  };

  const handleAction = (action: string, packaging: Packaging) => {
    switch (action) {
      case 'edit':
        toast.success(t('branding.editFeatureUnderDev'));
        break;
      case 'delete':
        toast.success(t('branding.deleted', { name: packaging.name }));
        break;
      case 'purchase':
        toast.success(t('branding.addedToCart', { name: packaging.name }));
        break;
      default:
        break;
    }
  };

  const productsColumns: TableColumn<Packaging>[] = [
    {
      title: t('branding.packagingInfo'),
      dataIndex: 'name',
      render: (value, record) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
            <Image
              src={record.image || '/mock-placeholder.png'}
              alt={record.name}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="font-medium text-gray-900 truncate">{record.name}</div>
            <Badge variant="default" size="sm" className="mt-1">
              {record.type}
            </Badge>
          </div>
        </div>
      ),
    },
    {
      title: t('branding.specifications'),
      dataIndex: 'specifications',
    },
    {
      title: t('branding.inventory'),
      dataIndex: 'inventory',
      align: 'center' as const,
    },
    {
      title: t('branding.price'),
      dataIndex: 'costPrice',
      align: 'right' as const,
      render: (value) => (
        <span className="text-gray-900 font-medium">
          {formatPrice(Number(value) || 0, 'USD')}
        </span>
      ),
    },
    {
      title: t('common.actions'),
      dataIndex: 'id',
      width: 100,
      render: (value, record) => (
        <Button
          variant="primary"
          size="sm"
          onClick={() => handleAction('purchase', record)}
          leftIcon={<ShoppingCart className="w-4 h-4" />}
        >
          {t('branding.purchase')}
        </Button>
      ),
    },
  ];

  const myPackagingColumns: TableColumn<Packaging>[] = [
    {
      title: t('branding.packagingInfo'),
      dataIndex: 'name',
      render: (value, record) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
            <Image
              src={record.image || '/mock-placeholder.png'}
              alt={record.name}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="font-medium text-gray-900 truncate">{record.name}</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="default" size="sm">
                {record.type}
              </Badge>
              <StatusBadge status={record.status} size="sm" />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: t('branding.specifications'),
      dataIndex: 'specifications',
    },
    {
      title: t('branding.inventory'),
      dataIndex: 'inventory',
      align: 'center' as const,
      render: (value) => (
        <span className={cn(
          'font-medium',
          Number(value) < 200 ? 'text-red-600' : 'text-gray-900'
        )}>
          {value}
        </span>
      ),
    },
    {
      title: t('branding.costPrice'),
      dataIndex: 'costPrice',
      align: 'right' as const,
      render: (value) => (
        <span className="text-gray-900">
          {formatPrice(Number(value) || 0, 'USD')}
        </span>
      ),
    },
    {
      title: t('common.actions'),
      dataIndex: 'id',
      width: 100,
      render: (value, record) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAction('edit', record)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAction('delete', record)}
            className="text-gray-400 hover:text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const currentColumns = activeTab === 'products' ? productsColumns : myPackagingColumns;

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('branding.packagingProducts')}
        subtitle={t('branding.packagingProductsSubtitle')}
        breadcrumb={[
          { label: t('nav.branding') },
          { label: t('branding.packagingProducts') },
        ]}
        actions={
          activeTab === 'my-packaging' ? (
            <Button variant="primary" leftIcon={<Plus className="w-5 h-4" />}>
              {t('branding.addPackaging')}
            </Button>
          ) : undefined
        }
      />

      <div className="bg-white rounded-xl border border-gray-200 p-2 inline-flex gap-1">
        <TabButton
          active={activeTab === 'products'}
          onClick={() => {
            setActiveTab('products');
            setSelectedIds([]);
            setFilterType('all');
            setSearchTerm('');
          }}
        >
          <Package className="w-4 h-4 inline-block mr-2" />
          {t('branding.packagingProductsTab')}
        </TabButton>
        <TabButton
          active={activeTab === 'my-packaging'}
          onClick={() => {
            setActiveTab('my-packaging');
            setSelectedIds([]);
            setFilterType('all');
            setSearchTerm('');
          }}
        >
          <Package className="w-4 h-4 inline-block mr-2" />
          {t('branding.myPackaging')}
        </TabButton>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-md">
          <Input
            placeholder={t('branding.searchPackagingPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-gray-400" />}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={filterType === 'all' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilterType('all')}
          >
            {t('common.all')}
          </Button>
          <Button
            variant={filterType === 'box' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilterType('box')}
          >
            {t('branding.boxes')}
          </Button>
          <Button
            variant={filterType === 'bag' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilterType('bag')}
          >
            {t('branding.bags')}
          </Button>
          <Button
            variant={filterType === 'wrapper' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilterType('wrapper')}
          >
            {t('branding.wrappers')}
          </Button>
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {t('branding.itemsSelected', { count: selectedIds.length })}
          </span>
          <Button variant="ghost" size="sm" onClick={handleSelectAll}>
            {selectedIds.length === filteredPackagings.length ? t('common.deselectAll') : t('common.selectAll')}
          </Button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <Table<Packaging>
          dataSource={filteredPackagings}
          columns={currentColumns}
          rowKey="id"
          emptyText={
            activeTab === 'products'
              ? t('branding.noPackagingProducts')
              : t('branding.noCustomPackaging')
          }
          onRowClick={(record) => {
            console.log('Row clicked:', record.id);
          }}
        />
      </div>
    </div>
  );
};
