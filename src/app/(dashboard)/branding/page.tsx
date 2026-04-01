/**
 * Branding Page
 * @description Merged Packaging Products and Packaging Connection into tabs
 */

'use client';

import React, { useState } from 'react';
import { Tabs, TabContent } from '@/components/ui/Tabs';
import { Package, Link2 } from 'lucide-react';
import { PackagingProductsPanel } from './components/PackagingProductsPanel';
import { PackagingConnectionPanel } from './components/PackagingConnectionPanel';
import { useTranslation } from '@/hooks/useTranslation';

export default function BrandingPage() {
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState('packaging');

  const items = [
    {
      key: 'packaging',
      label: t('branding.packagingProducts'),
      icon: <Package className="w-4 h-4" />,
    },
    {
      key: 'connection',
      label: t('branding.packagingConnection'),
      icon: <Link2 className="w-4 h-4" />,
    },
  ];

  return (
    <div className="space-y-6">
      <Tabs
        items={items}
        activeKey={activeKey}
        onChange={setActiveKey}
        size="sm"
      >
        <TabContent tabKey="packaging">
          <PackagingProductsPanel />
        </TabContent>
        <TabContent tabKey="connection">
          <PackagingConnectionPanel />
        </TabContent>
      </Tabs>
    </div>
  );
}
