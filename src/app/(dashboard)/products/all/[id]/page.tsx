/**
 * Product Detail Page
 * @description Display product details with image gallery, attributes selection, and description
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { Star, Heart, Plus, Minus, Package, Truck, Shield, Check, ChevronDown, ChevronUp, AlertCircle, ShoppingCart, Warehouse } from 'lucide-react';
import { useProductDetail, useAddToCollection, useRemoveFromCollection } from '@/hooks/api/useProducts';
import { useShippingChannels, useCountries } from '@/hooks/api/useShipping';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Loading } from '@/components/ui/Loading';
import { ProductDetail, ProductVariant, ProductAttribute, AttributeValue } from '@/types/product.types';
import { ShippingChannel } from '@/types/shipping.types';
import { cn, formatPrice } from '@/utils/helpers';
import { toast } from 'react-hot-toast';

/**
 * Product Detail Page
 */
export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  // State
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [isCollected, setIsCollected] = useState(false);

  // Shipping state
  const [fromCountry, setFromCountry] = useState('CN');
  const [toCountry, setToCountry] = useState('US');
  const [selectedChannel, setSelectedChannel] = useState<ShippingChannel | null>(null);

  const { product, isLoading, isError } = useProductDetail(params.id);
  const { addToCollection, isAdding } = useAddToCollection();
  const { removeFromCollection, isRemoving } = useRemoveFromCollection();
  const { countries } = useCountries();
  const { channels, isLoading: isLoadingChannels } = useShippingChannels(
    fromCountry && toCountry ? { fromCountry, toCountry, productId: params.id } : null
  );

  // Auto-select first recommended channel or first channel
  useEffect(() => {
    if (channels.length > 0 && !selectedChannel) {
      const recommended = channels.find(c => c.isRecommended);
      setSelectedChannel(recommended || channels[0]);
    }
  }, [channels, selectedChannel]);

  // Initialize selected attributes when product loads
  useEffect(() => {
    if (product) {
      const initialAttrs: Record<string, string> = {};
      // Set main attribute (Color) first value as default
      if (product.mainAttribute?.values?.length > 0) {
        const availableValue = product.mainAttribute.values.find(v => v.inStock !== false) || product.mainAttribute.values[0];
        initialAttrs[product.mainAttribute.name] = availableValue.id;
      }
      // Set other attributes first value as default
      product.attributes?.forEach(attr => {
        if (attr.values?.length > 0) {
          const availableValue = attr.values.find(v => v.inStock !== false) || attr.values[0];
          initialAttrs[attr.name] = availableValue.id;
        }
      });
      setSelectedAttributes(initialAttrs);
    }
  }, [product]);

  // Find matching variant based on selected attributes
  const selectedVariant = useMemo(() => {
    if (!product?.variants) return null;

    return product.variants.find(variant => {
      return Object.entries(selectedAttributes).every(([key, value]) => {
        return variant.attributes[key] === value;
      });
    });
  }, [product, selectedAttributes]);

  // Get images for selected variant or product
  const displayImages = useMemo(() => {
    if (selectedVariant?.images?.length) {
      return selectedVariant.images;
    }
    return product?.images || [];
  }, [selectedVariant, product]);

  // Reset image index when variant changes
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [displayImages]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <Loading size="lg" tip="Loading product details..." />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load product</p>
        <Button variant="ghost" onClick={() => router.back()} className="mt-4">
          Back to List
        </Button>
      </div>
    );
  }

  const displayPrice = selectedVariant?.price || product.price;
  const displayOriginalPrice = product.originalPrice;
  const displayInventory = selectedVariant?.inventory || product.inventory;
  const discountPercent = displayOriginalPrice
    ? Math.round(((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100)
    : 0;

  // Handle attribute selection
  const handleAttributeSelect = (attrName: string, valueId: string) => {
    setSelectedAttributes(prev => ({
      ...prev,
      [attrName]: valueId,
    }));
  };

  // Handle collection/favorites
  const handleCollect = async () => {
    try {
      if (isCollected) {
        await removeFromCollection(params.id);
        setIsCollected(false);
        toast.success('Removed from collection');
      } else {
        await addToCollection(params.id);
        setIsCollected(true);
        toast.success('Added to collection');
      }
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  // Handle buy stock
  const handleBuyStock = () => {
    if (!selectedVariant && product.variants?.length > 0) {
      toast.error('Please select all options');
      return;
    }
    // TODO: Navigate to stock order page or open modal
    router.push(`/orders/stock/new?product=${params.id}&variant=${selectedVariant?.id || ''}&qty=${quantity}`);
  };

  // Handle buy sample
  const handleBuySample = () => {
    if (!selectedVariant && product.variants?.length > 0) {
      toast.error('Please select all options');
      return;
    }
    // TODO: Navigate to sample order page or open modal
    router.push(`/orders/sample/new?product=${params.id}&variant=${selectedVariant?.id || ''}`);
  };

  // Handle publish to store
  const handlePublishToStore = () => {
    if (!selectedVariant && product.variants?.length > 0) {
      toast.error('Please select all options');
      return;
    }
    // TODO: Navigate to publish page or open modal
    toast.success('Product published to store successfully');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <PageHeader
        title="Product Details"
        breadcrumb={[
          { label: 'Products', href: '/products/all' },
          { label: product.name },
        ]}
        backHref="/products/all"
      />

      {/* Main content */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex-1 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Left - Image Gallery */}
          <div className="p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-gray-200">
            <ImageGallery
              images={displayImages}
              productName={product.name}
              selectedIndex={selectedImageIndex}
              onSelect={setSelectedImageIndex}
            />
          </div>

          {/* Right - Product Info */}
          <div className="p-6 lg:p-8">
            <div className="space-y-5">
              {/* Title & SPU/SKU */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-sm text-gray-500">SPU: {product.spu}</span>
                  {selectedVariant && (
                    <>
                      <span className="text-gray-300">|</span>
                      <span className="text-sm text-gray-500">SKU: {selectedVariant.sku}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Price Section */}
              <div className="flex items-end gap-3">
                {discountPercent > 0 && (
                  <Badge variant="danger" size="sm">
                    -{discountPercent}% OFF
                  </Badge>
                )}
                <span className="text-3xl font-bold text-primary-600">
                  {formatPrice(displayPrice, product.currency)}
                </span>
                {displayOriginalPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    {formatPrice(displayOriginalPrice, product.currency)}
                  </span>
                )}
              </div>

              {/* Rating & Sales */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        'w-4 h-4',
                        star <= Math.round(product.rating)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-gray-200'
                      )}
                    />
                  ))}
                  <span className="font-medium text-gray-700 ml-1">{product.rating.toFixed(1)}</span>
                </div>
                <span className="text-gray-400">{product.reviewCount} reviews</span>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500">{product.salesCount.toLocaleString()} sold</span>
              </div>

              {/* Main Attribute Selector (Color with Thumbnails) */}
              {product.mainAttribute && (
                <ColorAttributeSelector
                  attribute={product.mainAttribute}
                  selectedValue={selectedAttributes[product.mainAttribute.name]}
                  onSelect={(valueId) => handleAttributeSelect(product.mainAttribute.name, valueId)}
                />
              )}

              {/* Other Attributes */}
              {product.attributes?.map((attr) => (
                <AttributeSelector
                  key={attr.name}
                  attribute={attr}
                  selectedValue={selectedAttributes[attr.name]}
                  onSelect={(valueId) => handleAttributeSelect(attr.name, valueId)}
                />
              ))}

              {/* Quantity Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Quantity</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(displayInventory, parseInt(e.target.value) || 1)))}
                      className="w-16 h-10 text-center border-x border-gray-300 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(displayInventory, quantity + 1))}
                      disabled={quantity >= displayInventory}
                      className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    {displayInventory.toLocaleString()} available
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                {/* Primary Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleBuyStock}
                    leftIcon={<Warehouse className="w-4 h-4" />}
                  >
                    Buy Stock
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleBuySample}
                    leftIcon={<ShoppingCart className="w-4 h-4" />}
                  >
                    Buy Sample
                  </Button>
                </div>

                {/* Secondary Actions */}
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={handleCollect}
                  loading={isAdding || isRemoving}
                  leftIcon={
                    <Heart
                      className={cn('w-5 h-5', isCollected && 'fill-red-500 text-red-500')}
                    />
                  }
                >
                  Collection
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={handlePublishToStore}
                  leftIcon={<Package className="w-5 h-5" />}
                >
                  Publish To Store
                </Button>
              </div>

              {/* Service Icons */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center mb-2">
                    <Package className="w-5 h-5 text-primary-600" />
                  </div>
                  <span className="text-xs text-gray-600">Quality Guaranteed</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center mb-2">
                    <Truck className="w-5 h-5 text-primary-600" />
                  </div>
                  <span className="text-xs text-gray-600">Fast Shipping</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center mb-2">
                    <Shield className="w-5 h-5 text-primary-600" />
                  </div>
                  <span className="text-xs text-gray-600">Secure Payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Description & Shipping Side by Side */}
        <div className="border-t border-gray-200 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-full">
            {/* Left - Product Description */}
            <div className="p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Product Description</h3>
              <div className="flex-1 min-h-0">
                <DescriptionBox
                  richDescription={product.richDescription}
                  description={product.description}
                  images={product.images}
                />
              </div>
            </div>

            {/* Right - Shipping Channel Selector */}
            <div className="p-6 lg:p-8">
              <ShippingSelector
                fromCountry={fromCountry}
                toCountry={toCountry}
                countries={countries}
                channels={channels}
                selectedChannel={selectedChannel}
                isLoading={isLoadingChannels}
                onFromChange={setFromCountry}
                onToChange={setToCountry}
                onChannelSelect={setSelectedChannel}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Image Gallery Component with Carousel
 */
interface ImageGalleryProps {
  images: string[];
  productName: string;
  selectedIndex: number;
  onSelect: (index: number) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  productName,
  selectedIndex,
  onSelect,
}) => {
  const displayImages = images.length > 0 ? images : ['/mock-placeholder.png'];
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  // Check scroll position to show/hide arrows
  const checkScrollPosition = React.useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  React.useEffect(() => {
    checkScrollPosition();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      return () => container.removeEventListener('scroll', checkScrollPosition);
    }
    return undefined;
  }, [checkScrollPosition, displayImages]);

  // Scroll carousel
  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340; // Approximately 4 thumbnails width
      const newScrollLeft = direction === 'left'
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
        <Image
          src={displayImages[selectedIndex] || '/mock-placeholder.png'}
          alt={`${productName} - Image ${selectedIndex + 1}`}
          fill
          className="w-full h-full object-cover"
          priority
        />
      </div>

      {/* Carousel Thumbnails */}
      {displayImages.length > 1 && (
        <div className="relative">
          {/* Left Arrow */}
          <button
            type="button"
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            className={cn(
              'absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 z-10',
              'w-8 h-8 rounded-full bg-white shadow-md border border-gray-200',
              'flex items-center justify-center',
              'transition-all duration-200',
              canScrollLeft
                ? 'hover:bg-gray-50 hover:shadow-lg'
                : 'opacity-30 cursor-not-allowed'
            )}
          >
            <ChevronDown className="w-5 h-5 text-gray-600 rotate-90" />
          </button>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            className={cn(
              'absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 z-10',
              'w-8 h-8 rounded-full bg-white shadow-md border border-gray-200',
              'flex items-center justify-center',
              'transition-all duration-200',
              canScrollRight
                ? 'hover:bg-gray-50 hover:shadow-lg'
                : 'opacity-30 cursor-not-allowed'
            )}
          >
            <ChevronDown className="w-5 h-5 text-gray-600 -rotate-90" />
          </button>

          {/* Scrollable Thumbnails Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-3 overflow-x-auto scroll-smooth px-6 pb-2 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {displayImages.map((image, index) => (
              <button
                key={index}
                type="button"
                onClick={() => onSelect(index)}
                className={cn(
                  'relative w-[75px] h-[75px] flex-shrink-0 rounded-lg overflow-hidden',
                  'border-2 transition-all duration-200',
                  selectedIndex === index
                    ? 'border-primary-500 ring-2 ring-primary-100'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <Image
                  src={image || '/mock-placeholder.png'}
                  alt={`${productName} - Thumbnail ${index + 1}`}
                  fill
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Image Counter */}
          <div className="text-center text-xs text-gray-400 mt-2">
            {selectedIndex + 1} / {displayImages.length}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Color Attribute Selector with Thumbnails
 */
interface ColorAttributeSelectorProps {
  attribute: ProductAttribute;
  selectedValue: string | undefined;
  onSelect: (valueId: string) => void;
}

const ColorAttributeSelector: React.FC<ColorAttributeSelectorProps> = ({
  attribute,
  selectedValue,
  onSelect,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{attribute.label}</label>
        {selectedValue && (
          <span className="text-sm text-gray-500">
            {attribute.values.find(v => v.id === selectedValue)?.name}
          </span>
        )}
      </div>
      <div className="flex gap-3 flex-wrap">
        {attribute.values.map((value) => (
          <button
            key={value.id}
            type="button"
            onClick={() => onSelect(value.id)}
            disabled={value.inStock === false}
            className={cn(
              'relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200',
              'hover:scale-105 active:scale-95',
              selectedValue === value.id
                ? 'border-primary-500 ring-2 ring-primary-100'
                : 'border-gray-200 hover:border-gray-300',
              value.inStock === false && 'opacity-50 cursor-not-allowed'
            )}
            title={value.name}
          >
            {value.image ? (
              <Image
                src={value.image}
                alt={value.name}
                fill
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                {value.name}
              </div>
            )}
            {selectedValue === value.id && (
              <div className="absolute inset-0 bg-primary-500/20 flex items-center justify-center">
                <Check className="w-5 h-5 text-primary-600" />
              </div>
            )}
            {value.inStock === false && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-gray-400" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * Generic Attribute Selector
 */
interface AttributeSelectorProps {
  attribute: ProductAttribute;
  selectedValue: string | undefined;
  onSelect: (valueId: string) => void;
}

const AttributeSelector: React.FC<AttributeSelectorProps> = ({
  attribute,
  selectedValue,
  onSelect,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{attribute.label}</label>
        {selectedValue && (
          <span className="text-sm text-gray-500">
            {attribute.values.find(v => v.id === selectedValue)?.name}
          </span>
        )}
      </div>
      <div className="flex gap-2 flex-wrap">
        {attribute.values.map((value) => (
          <button
            key={value.id}
            type="button"
            onClick={() => onSelect(value.id)}
            disabled={value.inStock === false}
            className={cn(
              'px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-200',
              'hover:border-gray-300',
              selectedValue === value.id
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-200 bg-white text-gray-700',
              value.inStock === false && 'opacity-50 cursor-not-allowed line-through'
            )}
          >
            {value.name}
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * Description Box Component - Fixed size rich text container
 */
interface DescriptionBoxProps {
  richDescription?: string;
  description?: string;
  images?: string[];
}

const DescriptionBox: React.FC<DescriptionBoxProps> = ({
  richDescription,
  description,
  images = [],
}) => {
  return (
    <div className="h-full overflow-y-auto border border-gray-200 rounded-lg bg-gray-50">
      {richDescription ? (
        <div
          className="prose prose-sm max-w-none p-4 text-gray-600"
          dangerouslySetInnerHTML={{ __html: richDescription }}
        />
      ) : (
        <div className="p-4 space-y-4">
          {/* Product Images Grid */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {images.slice(0, 4).map((image, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-white">
                  <Image
                    src={image}
                    alt={`Product image ${index + 1}`}
                    fill
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Text Description */}
          {description && (
            <p className="text-gray-600 leading-relaxed text-sm">
              {description}
            </p>
          )}

          {/* Placeholder if no content */}
          {!description && images.length === 0 && (
            <div className="flex items-center justify-center h-full min-h-[200px] text-gray-400">
              <p>No description available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Shipping Selector Component
 */
interface ShippingSelectorProps {
  fromCountry: string;
  toCountry: string;
  countries: { code: string; name: string; flag?: string }[];
  channels: ShippingChannel[];
  selectedChannel: ShippingChannel | null;
  isLoading: boolean;
  onFromChange: (code: string) => void;
  onToChange: (code: string) => void;
  onChannelSelect: (channel: ShippingChannel) => void;
}

const ShippingSelector: React.FC<ShippingSelectorProps> = ({
  fromCountry,
  toCountry,
  countries,
  channels,
  selectedChannel,
  isLoading,
  onFromChange,
  onToChange,
  onChannelSelect,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-gray-900">Shipping Options</h3>

      {/* Country Selectors */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">From</label>
          <select
            value={fromCountry}
            onChange={(e) => onFromChange(e.target.value)}
            className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          >
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.flag} {country.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">To</label>
          <select
            value={toCountry}
            onChange={(e) => onToChange(e.target.value)}
            className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          >
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.flag} {country.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Channel List */}
      <div className="space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loading size="sm" tip="Loading channels..." />
          </div>
        ) : channels.length === 0 ? (
          <div className="text-center py-6 text-gray-500 text-sm">
            No shipping channels available for this route
          </div>
        ) : (
          channels.map((channel) => (
            <button
              key={channel.id}
              type="button"
              onClick={() => onChannelSelect(channel)}
              className={cn(
                'w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-200',
                'hover:border-gray-300 hover:bg-gray-50',
                selectedChannel?.id === channel.id
                  ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-100'
                  : 'border-gray-200'
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                    selectedChannel?.id === channel.id
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-gray-300'
                  )}
                >
                  {selectedChannel?.id === channel.id && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>

                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{channel.name}</span>
                    {channel.isRecommended && (
                      <Badge variant="primary" size="sm">
                        Recommended
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 mt-0.5">
                    {channel.deliveryTime}
                  </div>
                </div>
              </div>

              <div className="text-right">
                {channel.originalPrice && (
                  <span className="text-sm text-gray-400 line-through mr-2">
                    ${channel.originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="font-bold text-gray-900">
                  ${channel.price.toFixed(2)}
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
