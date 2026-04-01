/**
 * BindShopifyModal - Connect Shopify Store Modal
 * @description Simple modal for connecting Shopify store with just URL
 */

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Link, CheckCircle2, Loader2, ExternalLink } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/utils/helpers';
import { storeService } from '@/services/store.service';

/**
 * BindShopifyModal Props
 */
export interface BindShopifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

/**
 * BindShopifyModal - Simple Shopify connection modal
 */
export const BindShopifyModal: React.FC<BindShopifyModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Validate Shopify URL
   */
  const validateUrl = (value: string): boolean => {
    if (!value.trim()) {
      setError('Please enter store URL');
      return false;
    }

    // Accept various formats
    let urlToCheck = value.trim();

    // Add https if not present
    if (!urlToCheck.startsWith('http://') && !urlToCheck.startsWith('https://')) {
      urlToCheck = 'https://' + urlToCheck;
    }

    try {
      const parsed = new URL(urlToCheck);
      // Check if it's a valid Shopify domain
      if (!parsed.hostname.includes('myshopify.com') && !parsed.hostname.includes('shopify.com')) {
        // Allow custom domains too
      }
      return true;
    } catch {
      setError('Please enter a valid URL');
      return false;
    }
  };

  /**
   * Format URL to standard format
   */
  const formatUrl = (value: string): string => {
    let formatted = value.trim();
    if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
      formatted = 'https://' + formatted;
    }
    // Remove trailing slash
    if (formatted.endsWith('/')) {
      formatted = formatted.slice(0, -1);
    }
    return formatted;
  };

  /**
   * Handle URL change
   */
  const handleUrlChange = (value: string) => {
    setUrl(value);
    setError('');
  };

  /**
   * Handle submit
   */
  const handleSubmit = async () => {
    if (!validateUrl(url)) return;

    setIsLoading(true);
    setError('');

    try {
      const formattedUrl = formatUrl(url);

      // Call API to bind store
      await storeService.bindStore({
        name: new URL(formattedUrl).hostname.replace('.myshopify.com', ''),
        platform: 'shopify',
        url: formattedUrl,
      });

      // Reset and close
      setUrl('');
      onSuccess?.();
      onClose();
    } catch (err) {
      setError('Failed to connect store. Please check the URL and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle close
   */
  const handleClose = () => {
    setUrl('');
    setError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Connect Shopify Store"
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={isLoading}
            disabled={!url.trim()}
          >
            Connect Store
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Header with Shopify logo */}
        <div className="flex items-center gap-3 p-4 bg-[#96BF48]/10 rounded-lg">
          <Image
            src="/assets/platforms/shopify.svg"
            alt="Shopify"
            width={32}
            height={32}
            className="w-8 h-8 object-contain"
          />
          <div className="flex-1">
            <p className="font-medium text-gray-900">Connect your Shopify store</p>
            <p className="text-sm text-gray-600">Enter your store URL to get started</p>
          </div>
        </div>

        {/* URL Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Store URL
          </label>
          <Input
            placeholder="your-store.myshopify.com"
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            error={error}
            leftIcon={<Link className="w-4 h-4" />}
            size="lg"
          />
          <p className="mt-2 text-xs text-gray-500">
            Example: mystore.myshopify.com or https://mystore.myshopify.com
          </p>
        </div>

        {/* Help link */}
        <div className="flex items-center gap-2 pt-2">
          <ExternalLink className="w-4 h-4 text-gray-400" />
          <a
            href="https://help.shopify.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary-600 hover:underline"
          >
            Need help finding your store URL?
          </a>
        </div>
      </div>
    </Modal>
  );
};

export default BindShopifyModal;
