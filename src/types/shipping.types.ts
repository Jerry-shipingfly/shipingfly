/**
 * Shipping Channel Types
 */

import { ID } from './common.types';

/**
 * Shipping channel
 */
export interface ShippingChannel {
  id: ID;
  name: string;
  code: string;
  /** Estimated delivery days (e.g., "7-15 days") */
  deliveryTime: string;
  /** Minimum delivery days */
  minDays: number;
  /** Maximum delivery days */
  maxDays: number;
  /** Shipping price in USD */
  price: number;
  /** Original price before discount */
  originalPrice?: number;
  /** Channel logo URL */
  logo?: string;
  /** Whether it's recommended */
  isRecommended?: boolean;
  /** Rating score (for sorting) */
  rating?: number;
}

/**
 * Shipping query parameters
 */
export interface ShippingQueryParams {
  /** Origin country code */
  fromCountry: string;
  /** Destination country code */
  toCountry: string;
  /** Product weight in grams */
  weight?: number;
  /** Product ID for specific pricing */
  productId?: string;
}

/**
 * Country option
 */
export interface CountryOption {
  code: string;
  name: string;
  flag?: string;
}

/**
 * Shipping estimate response
 */
export interface ShippingEstimate {
  channels: ShippingChannel[];
  fromCountry: string;
  toCountry: string;
  estimatedWeight: number;
}
