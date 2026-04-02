/**
 * Product related type definitions
 */

import { ID, Timestamp, PaginatedResponse } from './common.types';

// Re-export PaginatedResponse for convenience
export type { PaginatedResponse };

/**
 * Product basic information
 */
export interface Product {
  id: ID;
  spu: string; // SPU code (Standard Product Unit)
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  category: string;
  images: string[];
  inventory: number;
  salesCount: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Product detail (extended information)
 */
export interface ProductDetail extends Product {
  /** Main attribute (usually Color), with thumbnail images for each option */
  mainAttribute: ProductAttribute;
  /** Other attributes like Size, Specs, etc. */
  attributes: ProductAttribute[];
  /** All SKU variants */
  variants: ProductVariant[];
  /** Specifications (for display only) */
  specifications: ProductSpecification[];
  /** Rich text description with images */
  richDescription?: string;
  relatedProducts?: Product[];
}

/**
 * Product attribute definition (e.g., Color, Size, Specs)
 */
export interface ProductAttribute {
  /** Attribute name */
  name: string;
  /** Attribute display label */
  label: string;
  /** Whether this is the main attribute (uses thumbnails) */
  isMain?: boolean;
  /** Attribute values with optional images */
  values: AttributeValue[];
}

/**
 * Attribute value
 */
export interface AttributeValue {
  /** Value ID */
  id: string;
  /** Value name/display text */
  name: string;
  /** Thumbnail image (for main attribute like Color) */
  image?: string;
  /** Whether this value is in stock */
  inStock?: boolean;
}

/**
 * Product variant (SKU)
 */
export interface ProductVariant {
  id: ID;
  sku: string;
  name: string;
  price: number;
  inventory: number;
  /** Attribute selections: { color: 'Black', size: 'M' } */
  attributes: Record<string, string>;
  /** Main image for this variant */
  image?: string;
  /** All images for this variant */
  images?: string[];
}

/**
 * Product specification
 */
export interface ProductSpecification {
  name: string;
  value: string;
}

/**
 * Product query parameters
 */
export interface ProductQueryParams {
  page?: number;
  limit?: number;
  /** Search by SPU, product name, description or tags */
  search?: string;
  /** Filter by category */
  category?: string;
  /** Filter by minimum price */
  minPrice?: number;
  /** Filter by maximum price */
  maxPrice?: number;
  /** Filter by tags */
  tags?: string[];
  /** Sort by field */
  sortBy?: 'price' | 'salesCount' | 'rating' | 'createdAt';
  /** Sort order */
  sortOrder?: 'asc' | 'desc';
  /** Filter by ship from location */
  shipFrom?: string;
  /** Filter for recommended products only */
  isRecommended?: boolean;
}

/**
 * Product collection/favorite
 */
export interface ProductCollection {
  id: ID;
  productId: ID;
  product: Product;
  createdAt: Timestamp;
}

/**
 * Sourcing request
 */
export interface SourcingRequest {
  id: ID;
  productName: string;
  description: string;
  images: string[];
  targetPrice?: number;
  quantity?: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
