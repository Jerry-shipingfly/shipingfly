/**
 * ProductFilters component
 * @description Product filter component
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
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
}

const DEFAULT_FILTERS: FilterOptions = {
  search: '',
  category: '',
  minPrice: undefined,
  maxPrice: undefined,
  sortBy: undefined,
  sortOrder: 'desc',
  tags: [],
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
}) => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<FilterOptions>(initialValues || DEFAULT_FILTERS);
  const [searchTerm, setSearchTerm] = useState(initialValues?.search || '');

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

  // Handle sort change
  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as FilterOptions['sortBy'];
    handleFilterChange('sortBy', value || undefined);
  };

  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleFilterChange('sortOrder', e.target.value as 'asc' | 'desc');
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleFilterChange('category', e.target.value);
  };

  // Handle reset
  const handleReset = () => {
    setSearchTerm('');
    setFilters(DEFAULT_FILTERS);
    onChange?.(DEFAULT_FILTERS);
    onReset?.();
  };

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 p-4', className)}>
      <div className="flex flex-wrap items-end gap-4">
        {/* Search box */}
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder={t('products.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-gray-400" />}
          />
        </div>

        {/* Category filter */}
        <div className="w-40">
          <select
            value={filters.category}
            onChange={handleCategoryChange}
            className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          >
            <option value="">{t('products.allCategories')}</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Price range */}
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder={t('products.minPrice')}
            value={filters.minPrice ?? ''}
            onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
            className="w-28"
          />
          <span className="text-gray-400">-</span>
          <Input
            type="number"
            placeholder={t('products.maxPrice')}
            value={filters.maxPrice ?? ''}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
            className="w-28"
          />
        </div>

        {/* Sorting */}
        <div className="flex items-center gap-2">
          <select
            value={filters.sortBy || ''}
            onChange={handleSortByChange}
            className="h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          >
            <option value="">{t('products.defaultSort')}</option>
            <option value="price">{t('products.price')}</option>
            <option value="salesCount">{t('products.sales')}</option>
            <option value="rating">{t('products.rating')}</option>
            <option value="createdAt">{t('products.latest')}</option>
          </select>
          <select
            value={filters.sortOrder}
            onChange={handleSortOrderChange}
            className="h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          >
            <option value="desc">{t('products.highToLow')}</option>
            <option value="asc">{t('products.lowToHigh')}</option>
          </select>
        </div>

        {/* Reset button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          leftIcon={<Filter className="w-4 h-4" />}
        >
          {t('products.resetFilters')}
        </Button>
      </div>
    </div>
  );
};

export default ProductFilters;
