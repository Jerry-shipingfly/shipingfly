/**
 * Product Service
 * @description Handles product-related features including product list, details, collections, and sourcing requests
 */

import { api } from './api';
import { Product, ProductDetail, ProductQueryParams, ProductCollection, SourcingRequest, PaginatedResponse, ProductAttribute, ProductVariant } from '@/types/product.types';
import {
  MOCK_PRODUCTS,
  MOCK_PRODUCT_DETAILS,
  MOCK_COLLECTIONS,
  MOCK_SOURCING_REQUESTS,
  MOCK_RECOMMENDED_PRODUCT_IDS,
  simulateDelay,
  getMockProductById,
  getMockProductDetailById,
} from '@/mocks/product.mock';

export const productService = {
  /**
   * Get product list
   * @param params - Query parameters (search, filter, pagination)
   */
  async getProducts(params?: ProductQueryParams): Promise<PaginatedResponse<Product>> {
    // TODO: Connect to real API
    // const queryString = params ? `?${new URLSearchParams(params as Record<string, string>)}` : '';
    // return api.get<PaginatedResponse<Product>>(`/products${queryString}`);

    // Mock implementation
    await simulateDelay(600);

    let filteredProducts = [...MOCK_PRODUCTS];

    // Search filter
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        p =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Category filter
    if (params?.category) {
      filteredProducts = filteredProducts.filter(p => p.category === params.category);
    }

    // Price range filter
    if (params?.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price >= params.minPrice!);
    }
    if (params?.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price <= params.maxPrice!);
    }

    // Tag filter
    if (params?.tags && params.tags.length > 0) {
      filteredProducts = filteredProducts.filter(p =>
        params.tags!.some(tag => p.tags.includes(tag))
      );
    }

    // Recommended filter
    if (params?.isRecommended) {
      filteredProducts = filteredProducts.filter(p =>
        MOCK_RECOMMENDED_PRODUCT_IDS.includes(String(p.id))
      );
    }

    // Sort
    if (params?.sortBy) {
      const sortOrder = params.sortOrder === 'desc' ? -1 : 1;
      filteredProducts.sort((a, b) => {
        switch (params.sortBy) {
          case 'price':
            return (a.price - b.price) * sortOrder;
          case 'salesCount':
            return (a.salesCount - b.salesCount) * sortOrder;
          case 'rating':
            return (a.rating - b.rating) * sortOrder;
          case 'createdAt':
            return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * sortOrder;
          default:
            return 0;
        }
      });
    }

    // Pagination
    const page = params?.page || 1;
    const limit = params?.limit || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return {
      data: paginatedProducts,
      total: filteredProducts.length,
      page,
      limit,
      totalPages: Math.ceil(filteredProducts.length / limit),
    };
  },

  /**
   * Get product detail
   * @param id - Product ID
   */
  async getProductDetail(id: string): Promise<ProductDetail> {
    // TODO: Connect to real API
    // return api.get<ProductDetail>(`/products/${id}`);

    // Mock implementation
    await simulateDelay(400);

    // First look for predefined details
    let product = getMockProductDetailById(id);

    // If no predefined details exist, generate dynamically
    if (!product) {
      const baseProduct = getMockProductById(id);
      if (!baseProduct) {
        throw new Error('Product not found');
      }

      // Generate details with multiple colors and specs (3 colors × 2 specs = 6 SKUs)
      const colorValues = [
        { id: 'black', name: 'Black', image: baseProduct.images[0] || '/mock-placeholder.png', inStock: true },
        { id: 'white', name: 'White', image: baseProduct.images[1] || baseProduct.images[0] || '/mock-placeholder.png', inStock: true },
        { id: 'blue', name: 'Blue', image: baseProduct.images[2] || baseProduct.images[0] || '/mock-placeholder.png', inStock: true },
      ];

      const specValues = [
        { id: 'basic', name: 'Basic', inStock: true },
        { id: 'pro', name: 'Pro', inStock: true },
      ];

      // Generate 6 variants (3 colors × 2 specs)
      const variants: ProductVariant[] = [];
      const colors = ['black', 'white', 'blue'];
      const specs = ['basic', 'pro'];
      let variantIndex = 1;

      colors.forEach(colorId => {
        specs.forEach(specId => {
          const colorData = colorValues.find(c => c.id === colorId)!;
          const specData = specValues.find(s => s.id === specId)!;
          const priceModifier = specId === 'pro' ? 1.2 : 1;

          variants.push({
            id: `${id}-v${variantIndex}`,
            sku: `SKU-${id}-${colorId.toUpperCase()}-${specId.toUpperCase()}`,
            name: `${colorData.name} - ${specData.name}`,
            price: Math.round(baseProduct.price * priceModifier * 100) / 100,
            inventory: Math.floor(baseProduct.inventory / 6),
            attributes: { color: colorId, specs: specId },
            image: colorData.image,
            images: baseProduct.images,
          });
          variantIndex++;
        });
      });

      product = {
        ...baseProduct,
        mainAttribute: {
          name: 'color',
          label: 'Color',
          isMain: true,
          values: colorValues,
        },
        attributes: [
          {
            name: 'specs',
            label: 'Specs',
            values: specValues,
          },
        ],
        variants,
        specifications: [
          { name: 'Brand', value: 'HyperZone' },
          { name: 'Category', value: baseProduct.category },
          { name: 'Tags', value: baseProduct.tags.join(', ') },
        ],
        richDescription: `<p>${baseProduct.description}</p>`,
        relatedProducts: MOCK_PRODUCTS.filter(p => p.category === baseProduct.category && p.id !== id).slice(0, 4),
      };
    }

    return product;
  },

  /**
   * Get product attributes dynamically
   * @param productId - Product ID
   * @param attributeName - Optional attribute name to filter
   * @returns Product attributes with their values
   */
  async getProductAttributes(
    productId: string,
    attributeName?: string
  ): Promise<ProductAttribute[]> {
    // TODO: Connect to real API
    // const params = attributeName ? `?attribute=${attributeName}` : '';
    // return api.get<ProductAttribute[]>(`/products/${productId}/attributes${params}`);

    // Mock implementation
    await simulateDelay(300);

    const product = getMockProductDetailById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    const attributes: ProductAttribute[] = [];

    // Add main attribute
    if (product.mainAttribute) {
      if (!attributeName || product.mainAttribute.name === attributeName) {
        attributes.push(product.mainAttribute);
      }
    }

    // Add other attributes
    if (product.attributes) {
      product.attributes.forEach(attr => {
        if (!attributeName || attr.name === attributeName) {
          attributes.push(attr);
        }
      });
    }

    return attributes;
  },

  /**
   * Get product variants by attribute selection
   * @param productId - Product ID
   * @param selectedAttributes - Selected attribute values
   * @returns Matching product variants
   */
  async getProductVariants(
    productId: string,
    selectedAttributes?: Record<string, string>
  ): Promise<ProductVariant[]> {
    // TODO: Connect to real API
    // return api.post<ProductVariant[]>(`/products/${productId}/variants/query`, { attributes: selectedAttributes });

    // Mock implementation
    await simulateDelay(200);

    const product = getMockProductDetailById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    if (!selectedAttributes || Object.keys(selectedAttributes).length === 0) {
      return product.variants || [];
    }

    // Filter variants based on selected attributes
    return (product.variants || []).filter(variant => {
      return Object.entries(selectedAttributes).every(([key, value]) => {
        return variant.attributes[key] === value;
      });
    });
  },

  /**
   * Get product description (rich text with images)
   * @param productId - Product ID
   * @returns Product description with rich text content
   */
  async getProductDescription(productId: string): Promise<{
    richDescription?: string;
    description?: string;
    images: string[];
  }> {
    // TODO: Connect to real API
    // return api.get(`/products/${productId}/description`);

    // Mock implementation
    await simulateDelay(300);

    const product = getMockProductDetailById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    return {
      richDescription: product.richDescription,
      description: product.description,
      images: product.images,
    };
  },

  /**
   * Update product description (rich text with images)
   * @param productId - Product ID
   * @param data - Description data to update
   * @returns Updated description
   */
  async updateProductDescription(productId: string, data: {
    richDescription?: string;
    images?: string[];
  }): Promise<{ message: string }> {
    // TODO: Connect to real API
    // return api.put(`/products/${productId}/description`, data);

    // Mock implementation
    await simulateDelay(500);

    const product = getMockProductDetailById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    return { message: 'Description updated successfully' };
  },

  /**
   * Get product category list
   */
  async getCategories(): Promise<string[]> {
    // TODO: Connect to real API
    // return api.get<string[]>('/products/categories');

    // Mock implementation
    await simulateDelay(300);

    const categories = [...new Set(MOCK_PRODUCTS.map(p => p.category))];
    return categories.sort();
  },

  /**
   * Add to collection
   * @param productId - Product ID
   */
  async addToCollection(productId: string): Promise<{ message: string; collectionId: string }> {
    // TODO: Connect to real API
    // return api.post<{ message: string; collectionId: string }>(`/products/${productId}/collect`);

    // Mock implementation
    await simulateDelay(300);

    // Check if product exists
    const product = getMockProductById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    // Check if already collected
    const existing = MOCK_COLLECTIONS.find(c => c.productId === productId);
    if (existing) {
      throw new Error('Product already in collection');
    }

    return {
      message: 'Added to collection',
      collectionId: 'col_' + Date.now(),
    };
  },

  /**
   * Remove from collection
   * @param productId - Product ID
   */
  async removeFromCollection(productId: string): Promise<{ message: string }> {
    // TODO: Connect to real API
    // return api.delete<{ message: string }>(`/products/${productId}/collect`);

    // Mock implementation
    await simulateDelay(300);

    return { message: 'Removed from collection' };
  },

  /**
   * Get collection list
   */
  async getCollections(params?: { page?: number; limit?: number }): Promise<PaginatedResponse<ProductCollection>> {
    // TODO: Connect to real API
    // return api.get<PaginatedResponse<ProductCollection>>('/products/collections');

    // Mock implementation
    await simulateDelay(500);

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCollections = MOCK_COLLECTIONS.slice(startIndex, endIndex);

    return {
      data: paginatedCollections,
      total: MOCK_COLLECTIONS.length,
      page,
      limit,
      totalPages: Math.ceil(MOCK_COLLECTIONS.length / limit),
    };
  },

  /**
   * Check if product is collected
   */
  async checkCollectionStatus(productId: string): Promise<{ isCollected: boolean }> {
    // TODO: Connect to real API
    // return api.get<{ isCollected: boolean }>(`/products/${productId}/collect/status`);

    // Mock implementation
    await simulateDelay(200);

    const isCollected = MOCK_COLLECTIONS.some(c => c.productId === productId);
    return { isCollected };
  },

  /**
   * Batch check collection status
   * @param productIds - Array of product IDs
   */
  async batchCheckCollectionStatus(productIds: string[]): Promise<Record<string, boolean>> {
    // TODO: Connect to real API
    // return api.post<Record<string, boolean>>('/products/collections/status', { productIds });

    // Mock implementation
    await simulateDelay(300);

    const status: Record<string, boolean> = {};
    const collectedIds = new Set(MOCK_COLLECTIONS.map(c => c.productId));

    productIds.forEach(id => {
      status[id] = collectedIds.has(id);
    });

    return status;
  },

  /**
   * Submit sourcing request
   */
  async submitSourcingRequest(data: {
    productName: string;
    description: string;
    images: string[];
    targetPrice?: number;
    quantity?: number;
  }): Promise<SourcingRequest> {
    // TODO: Connect to real API
    // return api.post<SourcingRequest>('/products/sourcing', data);

    // Mock implementation
    await simulateDelay(700);

    const newRequest: SourcingRequest = {
      id: 'sr_' + Date.now(),
      productName: data.productName,
      description: data.description,
      images: data.images,
      targetPrice: data.targetPrice,
      quantity: data.quantity,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return newRequest;
  },

  /**
   * Get sourcing request list
   */
  async getSourcingRequests(): Promise<SourcingRequest[]> {
    // TODO: Connect to real API
    // return api.get<SourcingRequest[]>('/products/sourcing');

    // Mock implementation
    await simulateDelay(500);

    return MOCK_SOURCING_REQUESTS;
  },

  /**
   * Get sourcing request detail
   */
  async getSourcingRequestDetail(id: string): Promise<SourcingRequest> {
    // TODO: Connect to real API
    // return api.get<SourcingRequest>(`/products/sourcing/${id}`);

    // Mock implementation
    await simulateDelay(400);

    const request = MOCK_SOURCING_REQUESTS.find(r => r.id === id);
    if (!request) {
      throw new Error('Sourcing request not found');
    }

    return request;
  },
};

export default productService;
