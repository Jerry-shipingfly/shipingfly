/**
 * UnbindStoreModal - Unbind Store Modal Component
 * @description Used for unbinding connected stores
 */

'use client';

import React from 'react';
import { AlertTriangle, Store } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { cn } from '@/utils/helpers';
import { Store as StoreType } from '@/types/store';

/**
 * UnbindStoreModal Props
 */
export interface UnbindStoreModalProps {
  /** Whether to show */
  isOpen: boolean;
  /** Close callback */
  onClose: () => void;
  /** Store information */
  store: StoreType | null;
  /** Confirm unbind callback */
  onConfirm?: (storeId: string) => Promise<void>;
  /** Unbind success callback */
  onSuccess?: () => void;
}

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
  custom: 'Custom Platform',
};

/**
 * UnbindStoreModal - Unbind Store Modal
 * @description Displays warning information and confirms unbind operation
 *
 * @example
 * <UnbindStoreModal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   store={selectedStore}
 *   onConfirm={handleUnbind}
 * />
 */
export const UnbindStoreModal: React.FC<UnbindStoreModalProps> = ({
  isOpen,
  onClose,
  store,
  onConfirm,
  onSuccess,
}) => {
  // Submit state
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  /**
   * Confirm unbind
   */
  const handleConfirm = async () => {
    if (!store) return;

    setIsSubmitting(true);

    try {
      if (onConfirm) {
        await onConfirm(String(store.id));
      } else {
        // Default simulated unbind
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to unbind store:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!store) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Unbind Store"
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            loading={isSubmitting}
          >
            Confirm Unbind
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Warning alert */}
        <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-700">
            <p className="font-medium">The following data will be cleared after unbinding:</p>
            <ul className="mt-1 list-disc list-inside space-y-1">
              <li>Store product sync data</li>
              <li>Store order sync data</li>
              <li>API access credentials</li>
            </ul>
            <p className="mt-2 font-medium">This action cannot be undone!</p>
          </div>
        </div>

        {/* Store information */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            {/* Store icon */}
            <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
              <Store className="w-6 h-6 text-gray-400" />
            </div>

            {/* Store info */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{store.name}</p>
              <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                <span>{PLATFORM_LABELS[store.platform] || store.platform}</span>
                <span>·</span>
                <span className="truncate">{store.url}</span>
              </div>
            </div>

            {/* Status badge */}
            <StatusBadge
              status={store.status}
              size="sm"
            />
          </div>
        </div>

        {/* Confirmation prompt */}
        <p className="text-sm text-gray-600">
          Are you sure you want to unbind store <span className="font-medium text-gray-900">{store.name}</span>?
        </p>
      </div>
    </Modal>
  );
};

export default UnbindStoreModal;
