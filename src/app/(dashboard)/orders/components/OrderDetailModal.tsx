/**
 * OrderDetailModal Component
 * @description Order detail modal, displaying complete order information, product list, and shipping information
 */

'use client';

import React, { useState, useMemo } from 'react';
import {
  Package,
  Truck,
  MapPin,
  User,
  Clock,
  Phone,
  Mail,
  ChevronDown,
  Check,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { OrderDetail, OrderStatus } from '@/types/order.types';
import { formatPrice, formatDate } from '@/utils/helpers';
import { OrderStatusBadge } from './OrderStatusBadge';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/utils/helpers';

/**
 * Shipping channel data structure
 */
interface ShippingChannel {
  id: string;
  name: string;
  carrier: string;
  firstPrice: number;
  additionalPrice: number;
  deliveryDays: string;
  enabled: boolean;
  destinations: string[];
}

// Mock shipping channels (should be fetched from API in production)
const shippingChannels: ShippingChannel[] = [
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
    enabled: true,
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

/**
 * Order Detail Modal Props
 */
export interface OrderDetailModalProps {
  /** Whether to show */
  isOpen: boolean;
  /** Close callback */
  onClose: () => void;
  /** Order detail data */
  order: OrderDetail | null;
  /** Loading state */
  loading?: boolean;
  /** Shipping channel change callback */
  onShippingChannelChange?: (orderId: string, channelId: string) => void;
}

/**
 * Info Item Component
 */
interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="text-gray-400 mt-0.5">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value}</p>
    </div>
  </div>
);

/**
 * Timeline Item Component
 */
interface TimelineItemProps {
  description: string;
  operator?: string;
  createdAt: string | Date;
  isLast?: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({
  description,
  operator,
  createdAt,
  isLast,
}) => (
  <div className="flex gap-3">
    <div className="flex flex-col items-center">
      <div className="w-2 h-2 bg-primary-500 rounded-full" />
      {!isLast && <div className="w-0.5 h-full bg-gray-200 mt-1" />}
    </div>
    <div className={`pb-4 ${isLast ? '' : 'flex-1'}`}>
      <p className="text-sm text-gray-900">{description}</p>
      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
        <span>{formatDate(createdAt, 'datetime')}</span>
        {operator && <span>- {operator}</span>}
      </div>
    </div>
  </div>
);

/**
 * OrderDetailModal Component
 * @description Modal component displaying complete order details
 *
 * @example
 * <OrderDetailModal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   order={orderDetail}
 * />
 */
export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  isOpen,
  onClose,
  order,
  loading = false,
  onShippingChannelChange,
}) => {
  const { t } = useTranslation();

  // Get enabled shipping channels
  const enabledChannels = useMemo(() =>
    shippingChannels.filter(channel => channel.enabled),
    []
  );

  // Selected shipping channel state
  const [selectedChannelId, setSelectedChannelId] = useState<string>('');
  const [isChannelDropdownOpen, setIsChannelDropdownOpen] = useState(false);

  // Initialize selected channel when order changes
  React.useEffect(() => {
    if (order) {
      // Try to match by carrier name, default to first enabled channel
      const matchedChannel = enabledChannels.find(
        channel => channel.carrier === order.carrier
      );
      setSelectedChannelId(matchedChannel?.id || enabledChannels[0]?.id || '');
    }
  }, [order, enabledChannels]);

  // Get selected channel
  const selectedChannel = useMemo(() =>
    enabledChannels.find(channel => channel.id === selectedChannelId),
    [enabledChannels, selectedChannelId]
  );

  // Handle channel selection
  const handleChannelSelect = (channelId: string) => {
    setSelectedChannelId(channelId);
    setIsChannelDropdownOpen(false);
    if (order && channelId !== selectedChannelId) {
      onShippingChannelChange?.(String(order.id), channelId);
    }
  };

  if (!order && !loading) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${t('orders.orderId')} - ${order?.orderNumber || ''}`}
      size="full"
    >
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
        </div>
      ) : order ? (
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoItem
              icon={<Package className="w-4 h-4" />}
              label={t('orders.orderId')}
              value={order.orderNumber}
            />
            <InfoItem
              icon={<Clock className="w-4 h-4" />}
              label={t('orders.orderDate')}
              value={formatDate(order.createdAt, 'datetime')}
            />
            <InfoItem
              icon={<Package className="w-4 h-4" />}
              label={t('common.status')}
              value={<OrderStatusBadge status={order.status} size="sm" />}
            />
          </div>

          {/* Customer Information */}
          {order.customer && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">{t('orders.customer')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{order.customer.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{order.customer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{order.customer.phone}</span>
                </div>
              </div>
            </div>
          )}

          {/* Product List */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">{t('orders.products')}</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">{t('orders.products')}</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">{t('common.quantity')}</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">{t('orders.unitPrice')}</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">{t('orders.subtotal')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.productName}
                              className="w-10 h-10 rounded object-cover bg-gray-100"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                              <Package className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {item.productName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.sku} {item.variantName && `- ${item.variantName}`}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-600">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-600">
                        {formatPrice(item.unitPrice, item.currency)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                        {formatPrice(item.totalPrice, item.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fee Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">{t('orders.feeDetails')}</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t('orders.productAmount')}</span>
                <span className="text-gray-900">{formatPrice(order.totalAmount, order.currency)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t('orders.shippingFee')}</span>
                <span className="text-gray-900">{formatPrice(order.shippingFee, order.currency)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t('orders.tax')}</span>
                <span className="text-gray-900">{formatPrice(order.taxAmount, order.currency)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t('orders.discount')}</span>
                  <span className="text-green-600">-{formatPrice(order.discountAmount, order.currency)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-medium pt-2 border-t border-gray-200">
                <span className="text-gray-900">{t('orders.totalAmount')}</span>
                <span className="text-gray-900">{formatPrice(order.finalAmount, order.currency)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address & Logistics Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shipping Address */}
            <div className="flex flex-col">
              <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {t('orders.shippingAddress')}
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 flex-1">
                <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
                <p className="mt-1">{order.shippingAddress.phone}</p>
                <p className="mt-2">
                  {order.shippingAddress.country}, {order.shippingAddress.province}, {order.shippingAddress.city}
                </p>
                <p>{order.shippingAddress.address}</p>
                <p>{t('orders.postalCode')}: {order.shippingAddress.postalCode}</p>
              </div>
            </div>

            {/* Logistics Information */}
            <div className="flex flex-col">
              <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Truck className="w-4 h-4" />
                {t('orders.logisticsInfo')}
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-4 flex-1">
                {/* Shipping Channel Selector */}
                <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsChannelDropdownOpen(!isChannelDropdownOpen)}
                      className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">
                          {selectedChannel ? `${selectedChannel.name} (${selectedChannel.carrier})` : t('orders.selectChannel')}
                        </span>
                      </div>
                      <ChevronDown className={cn(
                        "w-4 h-4 text-gray-400 transition-transform",
                        isChannelDropdownOpen && "transform rotate-180"
                      )} />
                    </button>

                    {/* Dropdown Menu */}
                    {isChannelDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                        {enabledChannels.map((channel) => (
                          <button
                            key={channel.id}
                            type="button"
                            onClick={() => handleChannelSelect(channel.id)}
                            className={cn(
                              "w-full flex items-center justify-between px-3 py-2.5 hover:bg-blue-50 transition-colors",
                              selectedChannelId === channel.id && "bg-blue-50"
                            )}
                          >
                            <div className="flex-1 text-left">
                              <p className="text-sm font-medium text-gray-900">{channel.name}</p>
                              <p className="text-xs text-gray-500">
                                {channel.carrier} · {channel.deliveryDays} {t('orders.days')} · ${channel.firstPrice}+
                              </p>
                            </div>
                            {selectedChannelId === channel.id && (
                              <Check className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                </div>

                {/* Tracking Information */}
                {order.trackingNumber ? (
                  <div className="pt-3 border-t border-gray-200 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t('orders.trackingNumber')}</span>
                      <span className="text-gray-900">{order.trackingNumber}</span>
                    </div>
                    {order.shippedAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">{t('orders.shippedDate')}</span>
                        <span className="text-gray-900">{formatDate(order.shippedAt, 'datetime')}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 pt-3 border-t border-gray-200">{t('orders.noLogisticsInfo')}</p>
                )}
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          {order.timeline && order.timeline.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">{t('orders.orderActivity')}</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                {order.timeline.map((item, index) => (
                  <TimelineItem
                    key={item.id}
                    description={item.description}
                    operator={item.operator}
                    createdAt={item.createdAt}
                    isLast={index === order.timeline.length - 1}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {order.notes && (
            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">{t('orders.orderNotes')}</h3>
              <p className="text-sm text-yellow-700">{order.notes}</p>
            </div>
          )}
        </div>
      ) : null}

      {/* Footer Buttons */}
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
        <Button variant="secondary" onClick={onClose}>
          {t('common.close')}
        </Button>
      </div>
    </Modal>
  );
};

export default OrderDetailModal;
