/**
 * Packaging related type definitions
 */

/**
 * Packaging basic information
 */
export interface Packaging {
  /** Packaging ID */
  id: string;
  /** Packaging name */
  name: string;
  /** Specifications */
  specifications: string;
  /** Inventory quantity */
  inventory: number;
  /** Cost price */
  costPrice: number;
  /** Suggested retail price */
  suggestedRetailPrice?: number;
  /** Packaging type */
  type: 'box' | 'bag' | 'wrapper' | 'label' | 'card' | 'filler' | 'other';
  /** Image */
  image: string;
  /** Status */
  status: 'active' | 'inactive' | 'discontinued';
  /** Created at */
  createdAt: string;
  /** Updated at */
  updatedAt: string;
}

/**
 * Packaging detail
 */
export interface PackagingDetail extends Packaging {
  /** Detailed description */
  description: string;
  /** Dimensions */
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    weight?: number;
  };
  /** Application scenarios */
  applicationScenarios?: string[];
  /** Materials */
  materials?: string[];
  /** Linked products count */
  linkedProductsCount: number;
}

/**
 * Packaging connection information
 */
export interface PackagingConnection {
  /** Connection ID */
  id: string;
  /** Packaging ID */
  packagingId: string;
  /** Product ID */
  productId: string;
  /** Created at */
  createdAt: string;
  /** Updated at */
  updatedAt: string;
}

/**
 * Packaging query parameters
 */
export interface PackagingQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: Packaging['type'];
  status?: Packaging['status'];
}
