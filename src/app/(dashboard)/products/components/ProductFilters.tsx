/**
 * ProductFilters component
 * @description Product filter component
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Image, X } from 'lucide-react';
import { cn } from '@/utils/helpers';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/hooks/useTranslation';

/**
 * Filter options
 */
export interface FilterOptions {
  /** Search keyword */
  search?: string;
  /** Category */
  category?: string;
  /** Minimum price */
  minPrice?: number;
  /** Maximum price */
  maxPrice?: number;
  /** Sort field */
  sortBy?: 'price' | 'salesCount' | 'rating' | 'createdAt';
  /** Sort order */
  sortOrder?: 'asc' | 'desc';
  /** Tag filters */
  tags: string[];
  /** Ship from location (China | United States) */
  shipFrom?: string;
}

/**
 * ProductFilters Props
 */
export interface ProductFiltersProps {
  /** Initial filter values */
  initialValues?: FilterOptions;
  /** Filter change callback */
  onChange?: (filters: FilterOptions) => void;
  /** Category list */
  categories?: string[];
  /** Reset callback */
  onReset?: () => void;
  /** Additional CSS class names */
  className?: string;
  /** Image search callback */
  onImageSearch?: (file: File) => void;
}

const DEFAULT_FILTERS: FilterOptions = {
  search: '',
  category: '',
  minPrice: undefined,
  maxPrice: undefined,
  sortBy: undefined,
  sortOrder: 'desc',
  tags: [],
  shipFrom: undefined,
};

/**
 * Price Range Slider Component
 */
interface PriceRangeSliderProps {
  minPrice?: number;
  maxPrice?: number;
  onChange: (min: number | undefined, max: number | undefined) => void;
  min?: number;
  max?: number;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  minPrice,
  maxPrice,
  onChange,
  min = 0,
  max = 1000,
}) => {
  const [localMin, setLocalMin] = useState(minPrice ?? min);
  const [localMax, setLocalMax] = useState(maxPrice ?? max);

  useEffect(() => {
    setLocalMin(minPrice ?? min);
    setLocalMax(maxPrice ?? max);
  }, [minPrice, maxPrice, min, max]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value <= localMax) {
      setLocalMin(value);
      onChange(value === min ? undefined : value, maxPrice);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value >= localMin) {
      setLocalMax(value);
      onChange(minPrice, value === max ? undefined : value);
    }
  };

  const minPercent = ((localMin - min) / (max - min)) * 100;
  const maxPercent = ((localMax - min) / (max - min)) * 100;

  return (
    <div className="w-48">
      <div className="relative h-6 flex items-center">
        {/* Track background */}
        <div className="absolute w-full h-1.5 bg-gray-200 rounded-full" />
        {/* Active range */}
        <div
          className="absolute h-1.5 bg-primary-500 rounded-full"
          style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
        />
        {/* Min thumb */}
        <input
          type="range"
          min={min}
          max={max}
          value={localMin}
          onChange={handleMinChange}
          className="absolute w-full h-1.5 appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary-500 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow"
        />
        {/* Max thumb */}
        <input
          type="range"
          min={min}
          max={max}
          value={localMax}
          onChange={handleMaxChange}
          className="absolute w-full h-1.5 appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary-500 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow"
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>${localMin}</span>
        <span>${localMax}</span>
      </div>
    </div>
  );
};

/**
 * ProductFilters Component
 */
export const ProductFilters: React.FC<ProductFiltersProps> = ({
  initialValues,
  onChange,
  categories = [],
  onReset,
  className,
  onImageSearch,
}) => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<FilterOptions>(initialValues || DEFAULT_FILTERS);
  const [searchTerm, setSearchTerm] = useState(initialValues?.search || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync external initialValues changes
  useEffect(() => {
    if (initialValues) {
      setFilters(initialValues);
      setSearchTerm(initialValues.search || '');
    }
  }, [initialValues]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange?.({ ...filters, search: searchTerm.trim() });
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle filter change
  const handleFilterChange = (key: keyof FilterOptions, value: string | number | undefined) => {
    const newFilters = {
      ...filters,
      [key]: value,
    };
    setFilters(newFilters);
    onChange?.(newFilters);
  };

  // Handle price range change
  const handlePriceChange = (min: number | undefined, max: number | undefined) => {
    const newFilters = {
      ...filters,
      minPrice: min,
      maxPrice: max,
    };
    setFilters(newFilters);
    onChange?.(newFilters);
  };

  // Handle sort change
  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as FilterOptions['sortBy'];
    handleFilterChange('sortBy', value || undefined);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleFilterChange('category', e.target.value);
  };

  const handleShipFromChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleFilterChange('shipFrom', e.target.value || undefined);
  };

  // Handle reset
  const handleReset = () => {
    setSearchTerm('');
    setFilters(DEFAULT_FILTERS);
    onChange?.(DEFAULT_FILTERS);
    onReset?.();
  };

  // Handle image search click
  const handleImageSearchClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSearch?.(file);
    }
    e.target.value = '';
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm('');
    onChange?.({ ...filters, search: '' });
  };

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 p-4', className)}>
      <div className="flex items-center">
        {/* Left side - Category, Ship From, Price */}
        <div className="flex items-center gap-4">
          {/* Category filter */}
          <div className="w-36">
            <select
              value={filters.category}
              onChange={handleCategoryChange}
              className="w-full h-9 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            >
              <option value="">Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Ship From dropdown */}
          <select
            value={filters.shipFrom || ''}
            onChange={handleShipFromChange}
            className="h-9 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm w-36"
          >
            <option value="">Ship From</option>
            <option value="China">China</option>
            <option value="United States">United States</option>
          </select>

          {/* Price range slider */}
          <PriceRangeSlider
            minPrice={filters.minPrice}
            maxPrice={filters.maxPrice}
            onChange={handlePriceChange}
            min={0}
            max={1000}
          />
        </div>

        {/* Right side - Image search, Search box, Reset */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Image search button */}
          <Button
            variant="outline"
            size="md"
            onClick={handleImageSearchClick}
            title="Search by image"
            className="h-9 px-3"
          >
            <Image className="w-4 h-4 text-gray-600" />
          </Button>

          {/* Search box */}
          <div className="w-[240px]">
            <Input
              placeholder="Search by SPU, Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-gray-400" />}
              rightIcon={
                searchTerm ? (
                  <button
                    onClick={handleClearSearch}
                    className="p-0.5 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                ) : undefined
              }
            />
          </div>

          {/* Reset button - far right */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            leftIcon={<Filter className="w-4 h-4" />}
          >
            {t('products.resetFilters')}
          </Button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default ProductFilters;
