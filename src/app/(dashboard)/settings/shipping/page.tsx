'use client';

import React, { useState } from 'react';
import { Truck, Settings, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { cn } from '@/utils/helpers';
import { useTranslation } from '@/hooks/useTranslation';

/**
 * Shipping channel data structure
 */
interface ShippingChannel {
  /** Channel ID */
  id: string;
  /** Channel name */
  name: string;
  /** Carrier company */
  carrier: string;
  /** Shipping fee (first weight) */
  firstPrice: number;
  /** Additional weight price */
  additionalPrice: number;
  /** Estimated delivery time (days) */
  deliveryDays: string;
  /** Whether enabled */
  enabled: boolean;
  /** Destination countries */
  destinations: string[];
}

/**
 * Shipping template data structure
 */
interface ShippingTemplate {
  /** Template ID */
  id: string;
  /** Template name */
  name: string;
  /** Billing method */
  billingType: 'weight' | 'volume' | 'piece';
  /** Number of associated channels */
  channelCount: number;
  /** Whether default */
  isDefault: boolean;
}

// Mock shipping channel data
const mockChannels: ShippingChannel[] = [
  {
    id: '1',
    name: 'Standard Express',
    carrier: 'SF Express',
    firstPrice: 12,
    additionalPrice: 2,
    deliveryDays: '1-3',
    enabled: true,
    destinations: ['CN', 'HK', 'TW'],
  },
  {
    id: '2',
    name: 'Economy Express',
    carrier: 'ZTO Express',
    firstPrice: 8,
    additionalPrice: 1,
    deliveryDays: '3-5',
    enabled: true,
    destinations: ['CN'],
  },
  {
    id: '3',
    name: 'International Express',
    carrier: 'DHL',
    firstPrice: 50,
    additionalPrice: 15,
    deliveryDays: '5-7',
    enabled: false,
    destinations: ['US', 'UK', 'DE', 'FR'],
  },
  {
    id: '4',
    name: 'EMS International',
    carrier: 'China Post',
    firstPrice: 35,
    additionalPrice: 10,
    deliveryDays: '7-15',
    enabled: true,
    destinations: ['Worldwide'],
  },
];

// Mock shipping template data
const mockTemplates: ShippingTemplate[] = [
  {
    id: '1',
    name: 'Default Shipping Template',
    billingType: 'weight',
    channelCount: 3,
    isDefault: true,
  },
  {
    id: '2',
    name: 'Large Items Template',
    billingType: 'volume',
    channelCount: 2,
    isDefault: false,
  },
  {
    id: '3',
    name: 'Small Items Template',
    billingType: 'piece',
    channelCount: 1,
    isDefault: false,
  },
];

// Billing method labels
const billingTypeLabels: Record<ShippingTemplate['billingType'], string> = {
  weight: 'By Weight',
  volume: 'By Volume',
  piece: 'By Piece',
};

/**
 * Shipping options settings page
 * @description Shipping channel management and shipping template configuration
 */
export default function ShippingPage() {
  const { t } = useTranslation();
  const [channels, setChannels] = useState<ShippingChannel[]>(mockChannels);
  const [templates] = useState<ShippingTemplate[]>(mockTemplates);

  // Billing method labels
  const billingTypeLabels: Record<ShippingTemplate['billingType'], string> = {
    weight: t('settings.byWeight'),
    volume: t('settings.byVolume'),
    piece: t('settings.byPiece'),
  };

  // Toggle channel enabled status
  const handleToggleChannel = (id: string) => {
    setChannels((prev) =>
      prev.map((channel) =>
        channel.id === id
          ? { ...channel, enabled: !channel.enabled }
          : channel
      )
    );
  };

  return (
    <div className="space-y-8">
      {/* Shipping channel management */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">{t('settings.shippingChannels')}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {t('settings.shippingChannelsHint')}
            </p>
          </div>
          <Button
            variant="secondary"
            leftIcon={<Truck className="w-4 h-4" />}
          >
            {t('settings.addChannel')}
          </Button>
        </div>

        {/* Channel list */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  {t('settings.channelName')}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  {t('settings.carrier')}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  {t('settings.firstWeightFee')}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  {t('settings.estDelivery')}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  {t('settings.destinations')}
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                  {t('common.status')}
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                  {t('common.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {channels.map((channel) => (
                <tr key={channel.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-900">
                      {channel.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {channel.carrier}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    ${channel.firstPrice} + ${channel.additionalPrice}/kg
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {channel.deliveryDays} {t('settings.days')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {channel.destinations.slice(0, 3).map((dest) => (
                        <Badge
                          key={dest}
                          variant="default"
                          size="sm"
                        >
                          {dest}
                        </Badge>
                      ))}
                      {channel.destinations.length > 3 && (
                        <Badge variant="default" size="sm">
                          +{channel.destinations.length - 3}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggleChannel(channel.id)}
                      className="inline-flex items-center justify-center"
                      title={channel.enabled ? t('settings.clickToDisable') : t('settings.clickToEnable')}
                    >
                      {channel.enabled ? (
                        <ToggleRight className="w-8 h-8 text-primary-500" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-gray-400" />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shipping templates */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">{t('settings.shippingTemplates')}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {t('settings.shippingTemplatesHint')}
            </p>
          </div>
          <Button
            variant="secondary"
            leftIcon={<Settings className="w-4 h-4" />}
          >
            {t('settings.createTemplate')}
          </Button>
        </div>

        {/* Template list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className={cn(
                'border rounded-lg p-4 transition-colors cursor-pointer',
                template.isDefault
                  ? 'border-primary-500 bg-primary-50/50'
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {template.name}
                  </h3>
                  {template.isDefault && (
                    <Badge variant="primary" size="sm" className="mt-1">
                      {t('common.default')}
                    </Badge>
                  )}
                </div>
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between text-gray-600">
                  <span>{t('settings.billingMethod')}</span>
                  <span className="font-medium text-gray-900">
                    {billingTypeLabels[template.billingType]}
                  </span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span>{t('settings.associatedChannels')}</span>
                  <span className="font-medium text-gray-900">
                    {template.channelCount}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
