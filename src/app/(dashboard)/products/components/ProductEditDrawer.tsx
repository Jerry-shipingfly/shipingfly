/**
 * Product Edit Drawer Component
 * @description Right-side drawer for editing product information before adding to store
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { X, Package, DollarSign, Image as ImageIcon, FileText, ChevronDown, ChevronUp, Plus, Trash2, Upload, Video, Camera, Check, AlertCircle, ShoppingCart, Minus } from 'lucide-react';
import { cn } from '@/utils/helpers';
import { Button } from '@/components/ui/Button';
import { Product, ProductDetail, ProductVariant } from '@/types/product.types';

/**
 * Mock category data
 */
const CATEGORY_OPTIONS = [
  { value: '', label: 'Select a category' },
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Clothing', label: 'Clothing' },
  { value: 'Home & Garden', label: 'Home & Garden' },
  { value: 'Sports & Outdoors', label: 'Sports & Outdoors' },
  { value: 'Beauty & Personal Care', label: 'Beauty & Personal Care' },
  { value: 'Toys & Games', label: 'Toys & Games' },
  { value: 'Automotive', label: 'Automotive' },
  { value: 'Books', label: 'Books' },
  { value: 'Jewelry', label: 'Jewelry' },
  { value: 'Health & Wellness', label: 'Health & Wellness' },
];

/**
 * Tab definitions
 */
const TABS = [
  { id: 'products', label: 'Products', icon: Package },
  { id: 'pricing', label: 'Variant Pricing', icon: DollarSign },
  { id: 'media', label: 'Images & Videos', icon: ImageIcon },
  { id: 'description', label: 'Description', icon: FileText },
] as const;

type TabId = typeof TABS[number]['id'];

/**
 * Extended variant with additional pricing fields for editing
 */
interface EditableVariant extends ProductVariant {
  compareAtPrice?: number;
  cost?: number;
}

/**
 * Extended product with editable fields
 */
interface EditableProduct extends Product {
  variants?: EditableVariant[];
  specifications?: { name: string; value: string }[];
  weight?: number;
  dimensions?: { length: number; width: number; height: number };
  mainAttribute?: {
    name: string;
    label: string;
    isMain: boolean;
    values: {
      id: string;
      name: string;
      image?: string;
      inStock?: boolean;
    }[];
  };
  attributes?: {
    name: string;
    label: string;
    values: {
      id: string;
      name: string;
      inStock?: boolean;
    }[];
  }[];
}

/**
 * ProductEditDrawer Props
 */
export interface ProductEditDrawerProps {
  /** Whether the drawer is open */
  isOpen: boolean;
  /** Product to edit */
  product: Product | ProductDetail | null;
  /** Close callback */
  onClose: () => void;
  /** Save callback */
  onSave?: (product: Product | ProductDetail) => void;
}

/**
 * ProductEditDrawer Component
 */
export const ProductEditDrawer: React.FC<ProductEditDrawerProps> = ({
  isOpen,
  product,
  onClose,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<TabId>('products');
  const [editedProduct, setEditedProduct] = useState<EditableProduct | null>(null);
  const [expandedVariants, setExpandedVariants] = useState<Set<string>>(new Set());
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<string[]>([]);
  const [descriptionImages, setDescriptionImages] = useState<string[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);

  // File input refs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const descriptionImageRef = useRef<HTMLInputElement>(null);

  // Initialize edited product when product changes
  useEffect(() => {
    if (product) {
      setEditedProduct({ ...product } as EditableProduct);
    }
  }, [product]);

  // Reset state when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setActiveTab('products');
      setExpandedVariants(new Set());
      setUploadedImages([]);
      setUploadedVideos([]);
      setDescriptionImages([]);
    }
  }, [isOpen]);

  // Handle variant expansion toggle
  const toggleVariant = (variantId: string | number) => {
    const id = String(variantId);
    const newExpanded = new Set(expandedVariants);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedVariants(newExpanded);
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // In a real app, you would upload to a server
    // For mock, we'll create object URLs
    const newImages: string[] = [];
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      newImages.push(url);
    });

    setUploadedImages((prev) => [...prev, ...newImages]);
    if (editedProduct) {
      setEditedProduct({
        ...editedProduct,
        images: [...editedProduct.images, ...newImages],
      });
    }
  };

  // Handle video upload
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newVideos: string[] = [];
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      newVideos.push(url);
    });

    setUploadedVideos((prev) => [...prev, ...newVideos]);
  };

  // Handle description image upload
  const handleDescriptionImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      newImages.push(url);
    });

    setDescriptionImages((prev) => [...prev, ...newImages]);

    // Append image markdown to description
    if (editedProduct) {
      const imageMarkdown = newImages.map((url) => `\n![image](${url})`).join('');
      setEditedProduct({
        ...editedProduct,
        description: editedProduct.description + imageMarkdown,
      });
    }
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    if (!editedProduct) return;
    const newImages = [...editedProduct.images];
    newImages.splice(index, 1);
    setEditedProduct({ ...editedProduct, images: newImages });
  };

  // Remove video
  const handleRemoveVideo = (index: number) => {
    const newVideos = [...uploadedVideos];
    newVideos.splice(index, 1);
    setUploadedVideos(newVideos);
  };

  // Remove description image
  const handleRemoveDescriptionImage = (index: number) => {
    const newImages = [...descriptionImages];
    newImages.splice(index, 1);
    setDescriptionImages(newImages);
  };

  // Handle attribute selection
  const handleAttributeSelect = (attrName: string, valueId: string) => {
    setSelectedAttributes(prev => ({
      ...prev,
      [attrName]: valueId,
    }));
  };

  // Get selected variant based on attributes
  const selectedVariant = React.useMemo(() => {
    if (!editedProduct?.variants) return null;
    return editedProduct.variants.find(variant => {
      return Object.entries(selectedAttributes).every(([key, value]) => {
        return (variant.attributes as any)?.[key] === value;
      });
    }) || null;
  }, [editedProduct, selectedAttributes]);

  // Set main image
  const handleSetMainImage = (index: number) => {
    if (!editedProduct) return;
    const newImages = [...editedProduct.images];
    const [mainImage] = newImages.splice(index, 1);
    newImages.unshift(mainImage);
    setEditedProduct({ ...editedProduct, images: newImages });
  };

  // Handle variant price change
  const handlePriceChange = (variantId: string | number, field: 'price' | 'compareAtPrice' | 'cost', value: string) => {
    if (!editedProduct?.variants) return;

    const numValue = parseFloat(value) || 0;
    setEditedProduct({
      ...editedProduct,
      variants: editedProduct.variants.map((v) =>
        String(v.id) === String(variantId) ? { ...v, [field]: numValue } : v
      ),
    });
  };

  // Handle inventory change
  const handleInventoryChange = (variantId: string | number, value: string) => {
    if (!editedProduct?.variants) return;

    const numValue = parseInt(value) || 0;
    setEditedProduct({
      ...editedProduct,
      variants: editedProduct.variants.map((v) =>
        String(v.id) === String(variantId) ? { ...v, inventory: numValue } : v
      ),
    });
  };

  // Handle product field change
  const handleProductChange = (field: keyof Product, value: string | string[]) => {
    if (!editedProduct) return;
    setEditedProduct({ ...editedProduct, [field]: value });
  };

  // Handle save
  const handleSave = () => {
    if (editedProduct && onSave) {
      onSave(editedProduct);
    }
    onClose();
  };

  // Get variant count
  const variantCount = editedProduct?.variants?.length || 0;

  if (!isOpen || !product || !editedProduct) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed right-0 top-0 h-full w-[600px]',
          'bg-white shadow-2xl',
          'flex flex-col',
          'z-50',
          'animate-in slide-in-from-right duration-300'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={editedProduct.images[0] || '/images/placeholder.png'}
                alt={editedProduct.name}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{editedProduct.name}</h2>
              <p className="text-sm text-gray-500">SPU: {editedProduct.spu}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-3',
                    'text-sm font-medium',
                    'border-b-2 transition-colors',
                    isActive
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Basic Information</h3>

                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Product Title</label>
                  <input
                    type="text"
                    value={editedProduct.name}
                    onChange={(e) => handleProductChange('name', e.target.value)}
                    className={cn(
                      'w-full px-3 py-2 rounded-lg',
                      'border border-gray-300',
                      'text-sm text-gray-900',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">Category</label>
                    <div className="relative">
                      <select
                        value={editedProduct.category}
                        onChange={(e) => handleProductChange('category', e.target.value)}
                        className={cn(
                          'w-full px-3 py-2 rounded-lg appearance-none',
                          'border border-gray-300',
                          'text-sm text-gray-900',
                          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                          'bg-white cursor-pointer'
                        )}
                      >
                        {CATEGORY_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">SPU</label>
                    <input
                      type="text"
                      value={editedProduct.spu}
                      onChange={(e) => handleProductChange('spu', e.target.value)}
                      className={cn(
                        'w-full px-3 py-2 rounded-lg',
                        'border border-gray-300',
                        'text-sm text-gray-900',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                      )}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {editedProduct.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    <button className="px-2 py-1 border border-dashed border-gray-300 text-gray-500 text-sm rounded hover:border-gray-400">
                      <Plus className="w-3 h-3 inline mr-1" />
                      Add Tag
                    </button>
                  </div>
                </div>

                {/* Variant Selector - Color (with thumbnails) */}
                {editedProduct.mainAttribute && (() => {
                  const mainAttr = editedProduct.mainAttribute!;
                  return (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">{mainAttr.label}</label>
                      {selectedAttributes[mainAttr.name] && (
                        <span className="text-sm text-gray-500">
                          {mainAttr.values.find(v => v.id === selectedAttributes[mainAttr.name])?.name}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-3 flex-wrap">
                      {mainAttr.values.map((value) => (
                        <button
                          key={value.id}
                          type="button"
                          onClick={() => handleAttributeSelect(mainAttr.name, value.id)}
                          disabled={value.inStock === false}
                          className={cn(
                            'relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200',
                            'hover:scale-105 active:scale-95',
                            selectedAttributes[mainAttr.name] === value.id
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
                          {selectedAttributes[mainAttr.name] === value.id && (
                            <div className="absolute inset-0 bg-primary-500/20 flex items-center justify-center">
                              <Check className="w-4 h-4 text-primary-600" />
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
                })()}

                {/* Other Attributes (Size, Specs, etc.) */}
                {editedProduct.attributes?.map((attr) => (
                  <div key={attr.name} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">{attr.label}</label>
                      {selectedAttributes[attr.name] && (
                        <span className="text-sm text-gray-500">
                          {attr.values.find(v => v.id === selectedAttributes[attr.name])?.name}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {attr.values.map((value) => (
                        <button
                          key={value.id}
                          type="button"
                          onClick={() => handleAttributeSelect(attr.name, value.id)}
                          disabled={value.inStock === false}
                          className={cn(
                            'px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-200',
                            'hover:border-gray-300',
                            selectedAttributes[attr.name] === value.id
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
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 h-10 text-center border-x border-gray-300 focus:outline-none text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-sm text-gray-500">
                      {((selectedVariant as any)?.inventory || editedProduct.inventory || 0).toLocaleString()} available
                    </span>
                  </div>
                </div>
                {/* Selected Variant Info */}
                {selectedVariant && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Selected variant</span>
                      <span className="text-lg font-bold text-primary-600">
                        ${((selectedVariant as any)?.price || editedProduct.price).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                      </span>
                    </div>
                    {(selectedVariant as any)?.sku && (
                      <p className="text-xs text-gray-500 mt-1">SKU: {(selectedVariant as any).sku}</p>
                    )}
                  </div>
                )}
                {/* Action Buttons */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    leftIcon={<Package className="w-4 h-4" />}
                    onClick={handleSave}
                  >
                    Publish to Store
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    leftIcon={<ShoppingCart className="w-4 h-4" />}
                    onClick={onClose}
                  >
                    Create Sample Order
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Variant Pricing Tab */}
          {activeTab === 'pricing' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Variant Pricing</h3>
                <p className="text-sm text-gray-500">{variantCount} variants</p>
              </div>

              {variantCount === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <DollarSign className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No variants to price</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {editedProduct.variants?.map((variant) => {
                    const variantId = String(variant.id);
                    const isExpanded = expandedVariants.has(variantId);
                    return (
                      <div
                        key={variantId}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
                        {/* Variant Header */}
                        <button
                          onClick={() => toggleVariant(variantId)}
                          className={cn(
                            'w-full flex items-center justify-between',
                            'px-4 py-3',
                            'bg-gray-50 hover:bg-gray-100 transition-colors'
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-900">{variant.name}</span>
                            <span className="text-xs text-gray-500">({variant.sku})</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-900">${variant.price.toFixed(2)}</span>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-gray-500" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-500" />
                            )}
                          </div>
                        </button>

                        {/* Variant Details */}
                        {isExpanded && (
                          <div className="p-4 space-y-4 bg-white">
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Price</label>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                  <input
                                    type="number"
                                    value={variant.price}
                                    onChange={(e) => handlePriceChange(variantId, 'price', e.target.value)}
                                    step="0.01"
                                    className={cn(
                                      'w-full pl-7 pr-3 py-2 rounded-lg',
                                      'border border-gray-300',
                                      'text-sm text-gray-900',
                                      'focus:outline-none focus:ring-2 focus:ring-primary-500'
                                    )}
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Compare at Price</label>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                  <input
                                    type="number"
                                    value={variant.compareAtPrice || ''}
                                    onChange={(e) => handlePriceChange(variantId, 'compareAtPrice', e.target.value)}
                                    step="0.01"
                                    placeholder="-"
                                    className={cn(
                                      'w-full pl-7 pr-3 py-2 rounded-lg',
                                      'border border-gray-300',
                                      'text-sm text-gray-900',
                                      'focus:outline-none focus:ring-2 focus:ring-primary-500'
                                    )}
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Cost per item</label>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                  <input
                                    type="number"
                                    value={variant.cost || ''}
                                    onChange={(e) => handlePriceChange(variantId, 'cost', e.target.value)}
                                    step="0.01"
                                    placeholder="-"
                                    className={cn(
                                      'w-full pl-7 pr-3 py-2 rounded-lg',
                                      'border border-gray-300',
                                      'text-sm text-gray-900',
                                      'focus:outline-none focus:ring-2 focus:ring-primary-500'
                                    )}
                                  />
                                </div>
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Inventory</label>
                              <input
                                type="number"
                                value={variant.inventory}
                                onChange={(e) => handleInventoryChange(variantId, e.target.value)}
                                className={cn(
                                  'w-full px-3 py-2 rounded-lg',
                                  'border border-gray-300',
                                  'text-sm text-gray-900',
                                  'focus:outline-none focus:ring-2 focus:ring-primary-500'
                                )}
                              />
                            </div>

                            {/* Variant Attributes */}
                            {variant.attributes && Object.keys(variant.attributes).length > 0 && (
                              <div>
                                <label className="block text-xs text-gray-500 mb-2">Attributes</label>
                                <div className="flex flex-wrap gap-2">
                                  {Object.entries(variant.attributes).map(([key, value]) => (
                                    <span
                                      key={key}
                                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                                    >
                                      {key}: {value}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Images & Videos Tab */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Images & Videos</h3>
              </div>

              {/* Upload Images Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">Product Images</label>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => imageInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors border border-primary-200"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Images
                  </button>
                </div>

                {/* All Images Grid */}
                <div className="grid grid-cols-4 gap-3">
                  {editedProduct.images.map((image, index) => (
                    <div
                      key={index}
                      className={cn(
                        'aspect-square rounded-lg overflow-hidden',
                        'bg-gray-100 border border-gray-200',
                        'relative group cursor-pointer',
                        index === 0 && 'ring-2 ring-primary-500'
                      )}
                      onClick={() => handleSetMainImage(index)}
                    >
                      <Image
                        src={image}
                        alt={`${editedProduct.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {index !== 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetMainImage(index);
                            }}
                            className="p-1.5 bg-white rounded-full text-primary-500 hover:bg-primary-50"
                            title="Set as main"
                          >
                            <Camera className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage(index);
                          }}
                          className="p-1.5 bg-white rounded-full text-red-500 hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {index === 0 && (
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-primary-500 text-white text-xs rounded">
                          Main
                        </span>
                      )}
                    </div>
                  ))}
                  {/* Add Image Button */}
                  <div
                    onClick={() => imageInputRef.current?.click()}
                    className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-primary-400 hover:bg-primary-50 cursor-pointer transition-colors"
                  >
                    <div className="text-center">
                      <Plus className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                      <span className="text-xs text-gray-500">Add</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Click image to set as main. Supported: JPG, PNG, GIF. Max 5MB each.
                </p>
              </div>

              {/* Upload Videos Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">Product Videos</label>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => videoInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors border border-primary-200"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Videos
                  </button>
                </div>

                {uploadedVideos.length === 0 ? (
                  <div
                    onClick={() => videoInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 hover:bg-primary-50 cursor-pointer transition-colors"
                  >
                    <Video className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Click or drag to upload videos</p>
                    <p className="text-xs text-gray-400 mt-1">Supported: MP4, MOV, AVI. Max 100MB.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {uploadedVideos.map((video, index) => (
                      <div
                        key={index}
                        className="aspect-video rounded-lg overflow-hidden bg-gray-900 border border-gray-200 relative group"
                      >
                        <video
                          src={video}
                          className="w-full h-full object-cover"
                          controls
                        />
                        <button
                          onClick={() => handleRemoveVideo(index)}
                          className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {/* Add More Videos Button */}
                    <div
                      onClick={() => videoInputRef.current?.click()}
                      className="aspect-video rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-primary-400 hover:bg-primary-50 cursor-pointer transition-colors"
                    >
                      <div className="text-center">
                        <Plus className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                        <span className="text-xs text-gray-500">Add Video</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description Tab */}
          {activeTab === 'description' && (
            <div className="space-y-6">
              <h3 className="text-sm font-medium text-gray-900">Product Description</h3>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm text-gray-600">Description</label>
                  <button
                    onClick={() => descriptionImageRef.current?.click()}
                    className="flex items-center gap-1.5 px-2 py-1 text-xs text-primary-600 hover:bg-primary-50 rounded transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    Insert Image
                  </button>
                </div>
                {/* Hidden file input */}
                <input
                  ref={descriptionImageRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleDescriptionImageUpload}
                  className="hidden"
                />
                <textarea
                  value={editedProduct.description}
                  onChange={(e) => handleProductChange('description', e.target.value)}
                  rows={10}
                  className={cn(
                    'w-full px-3 py-2 rounded-lg',
                    'border border-gray-300',
                    'text-sm text-gray-900',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                    'resize-none'
                  )}
                  placeholder="Enter product description...&#10;&#10;Click 'Insert Image' button above to add images to your description."
                />
                {/* Description Images Preview */}
                {descriptionImages.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-2">Images in description:</p>
                    <div className="flex flex-wrap gap-2">
                      {descriptionImages.map((img, index) => (
                        <div key={index} className="relative group">
                          <Image
                            src={img}
                            alt={`Description image ${index + 1}`}
                            width={60}
                            height={60}
                            className="object-cover rounded border border-gray-200"
                          />
                          <button
                            onClick={() => handleRemoveDescriptionImage(index)}
                            className="absolute -top-1 -right-1 p-1 bg-white rounded-full text-red-500 hover:bg-red-50 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Specifications */}
              {editedProduct.specifications && editedProduct.specifications.length > 0 && (
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Specifications</label>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    {editedProduct.specifications.map((spec, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">{spec.name}</span>
                        <span className="text-gray-900">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Shipping Info */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">Shipping Information</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Weight</p>
                    <p className="text-sm font-medium text-gray-900">
                      {editedProduct.weight ? `${editedProduct.weight} kg` : '-'}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Dimensions</p>
                    <p className="text-sm font-medium text-gray-900">
                      {editedProduct.dimensions
                        ? `${editedProduct.dimensions.length} × ${editedProduct.dimensions.width} × ${editedProduct.dimensions.height} cm`
                        : '-'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
            >
              Add to Store
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductEditDrawer;
