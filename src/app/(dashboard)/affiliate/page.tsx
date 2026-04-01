'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Tabs, TabContent } from '@/components/ui';
import { LinksTab, RecommendedTab } from './components';
import { useTranslation } from '@/hooks/useTranslation';

type TabKey = 'links' | 'recommended';

export default function AffiliatePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabQuery = searchParams.get('tab') as TabKey | null;

  const validTabs: TabKey[] = ['links', 'recommended'];
  const defaultTab: TabKey = 'links';
  const initialTab = validTabs.includes(tabQuery as TabKey) ? (tabQuery as TabKey) : defaultTab;

  const [activeKey, setActiveKey] = useState<TabKey>(initialTab);

  useEffect(() => {
    if (!tabQuery || !validTabs.includes(tabQuery)) {
      router.replace(`/affiliate?tab=${activeKey}`);
    }
  }, [tabQuery]);

  const handleChange = (key: string) => {
    const next = key as TabKey;
    setActiveKey(next);
    router.replace(`/affiliate?tab=${next}`);
  };

  const items = [
    { key: 'links', label: t('nav.referralLinks') },
    { key: 'recommended', label: t('nav.recommended') },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{t('nav.affiliate')}</h1>
        <p className="mt-1 text-sm text-gray-500">{t('affiliate.subtitle')}</p>
      </div>

      <Tabs items={items} activeKey={activeKey} onChange={handleChange}>
        <TabContent tabKey="links">
          <LinksTab />
        </TabContent>
        <TabContent tabKey="recommended">
          <RecommendedTab />
        </TabContent>
      </Tabs>
    </div>
  );
}
