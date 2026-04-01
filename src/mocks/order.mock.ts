/**
 * Order Module Mock Data
 */

import { Order, OrderDetail, OrderStats, OrderItem } from '@/types/order.types';

/**
 * Simulate network delay
 */
export const simulateDelay = (ms: number = 600): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Simulate error
 */
export const simulateError = (message: string = 'Mock error'): never => {
  throw new Error(message);
};

/**
 * Product mock data with images
 */
const MOCK_PRODUCT_IMAGES = [
  { name: 'Wireless Bluetooth Earbuds Pro', image: '/mocks/products/product-1.jpg' },
  { name: 'Smart Fitness Watch Series X', image: '/mocks/products/product-2.png' },
  { name: 'Premium Cotton T-Shirt', image: '/mocks/products/product-3.jpg' },
  { name: 'LED Desk Lamp with USB Charger', image: '/mocks/products/product-4.jpg' },
  { name: 'Yoga Mat Premium', image: '/mocks/products/product-5.jpg' },
  { name: 'Portable Bluetooth Speaker', image: '/mocks/products/product-6.jpg' },
  { name: 'Anti-Aging Face Serum', image: '/mocks/products/product-7.jpg' },
  { name: 'Building Blocks Set', image: '/mocks/products/product-8.jpg' },
  { name: 'Mechanical Gaming Keyboard', image: '/mocks/products/product-9.jpg' },
  { name: 'Wireless Charging Pad', image: '/mocks/products/product-10.png' },
  { name: 'Sports Water Bottle', image: '/mocks/products/product-11.png' },
  { name: 'Minimalist Backpack', image: '/mocks/products/product-12.png' },
  { name: 'Smart Home Hub', image: '/mocks/products/product-13.png' },
  { name: 'Noise Cancelling Headphones', image: '/mocks/products/product-14.png' },
  { name: 'Portable Projector Mini', image: '/mocks/products/product-15.png' },
  { name: 'Ergonomic Office Chair', image: '/mocks/products/product-16.png' },
  { name: 'Coffee Maker Deluxe', image: '/mocks/products/product-17.jpg' },
  { name: 'Fitness Resistance Bands', image: '/mocks/products/product-18.jpg' },
];

/**
 * Generate order items
 * @description Creates mock order items with SKU thumbnail images
 * @param count - Number of items to generate
 * @returns Array of OrderItem with product images
 *
 * TODO: Connect to real API
 * API Interface: GET /orders/{orderId}/items
 * Response: OrderItem[] with image field for SKU thumbnail
 */
const createOrderItems = (count: number): OrderItem[] => {
  const items: OrderItem[] = [];

  for (let i = 0; i < count; i++) {
    const productIndex = i % MOCK_PRODUCT_IMAGES.length;
    const product = MOCK_PRODUCT_IMAGES[productIndex];
    const quantity = Math.floor(Math.random() * 3) + 1;
    const unitPrice = Math.floor(Math.random() * 100) + 10;
    const colorVariant = ['Black', 'White', 'Blue', 'Red', 'Green'][i % 5];

    items.push({
      id: `item-${Date.now()}-${i}`,
      productId: String(productIndex + 1),
      productName: product.name,
      variantId: `v${Math.floor(Math.random() * 5) + 1}`,
      variantName: colorVariant,
      sku: `SKU-${1000 + productIndex}-${colorVariant.charAt(0)}`,
      image: product.image,
      quantity,
      unitPrice,
      totalPrice: quantity * unitPrice,
      currency: 'USD',
    });
  }

  return items;
};

/**
 * Mock order list
 */
export const MOCK_ORDERS: Order[] = [
  {
    id: 'o1',
    orderNumber: 'ORD-2024-00001',
    type: 'store_order',
    status: 'completed',
    storeId: 's1',
    storeName: 'TechGear Official Store',
    items: createOrderItems(2),
    itemCount: 2,
    totalAmount: 159.98,
    currency: 'USD',
    shippingFee: 5.99,
    taxAmount: 12.80,
    discountAmount: 15.99,
    finalAmount: 162.78,
    shippingAddress: {
      name: 'John Smith',
      phone: '+1 (555) 123-4567',
      country: 'United States',
      province: 'California',
      city: 'Los Angeles',
      district: 'Downtown',
      address: '123 Main Street, Apt 4B',
      postalCode: '90001',
    },
    trackingNumber: '1Z999AA10123456784',
    carrier: 'UPS',
    notes: 'Please leave at front door',
    createdAt: '2024-03-20T10:30:00Z',
    updatedAt: '2024-03-25T16:45:00Z',
    paidAt: '2024-03-20T10:35:00Z',
    shippedAt: '2024-03-21T09:00:00Z',
    deliveredAt: '2024-03-25T14:30:00Z',
  },
  {
    id: 'o2',
    orderNumber: 'ORD-2024-00002',
    type: 'store_order',
    status: 'shipped',
    storeId: 's2',
    storeName: 'Fashion Forward',
    items: createOrderItems(3),
    itemCount: 3,
    totalAmount: 89.97,
    currency: 'USD',
    shippingFee: 0,
    taxAmount: 7.20,
    discountAmount: 0,
    finalAmount: 97.17,
    shippingAddress: {
      name: 'Emily Johnson',
      phone: '+1 (555) 987-6543',
      country: 'United States',
      province: 'New York',
      city: 'New York City',
      district: 'Manhattan',
      address: '456 Park Avenue, Suite 789',
      postalCode: '10022',
    },
    trackingNumber: '9400111899223334445566',
    carrier: 'USPS',
    createdAt: '2024-03-22T14:00:00Z',
    updatedAt: '2024-03-27T11:20:00Z',
    paidAt: '2024-03-22T14:05:00Z',
    shippedAt: '2024-03-24T10:00:00Z',
  },
  {
    id: 'o3',
    orderNumber: 'ORD-2024-00003',
    type: 'sample_order',
    status: 'processing',
    items: createOrderItems(1),
    itemCount: 1,
    totalAmount: 0,
    currency: 'USD',
    shippingFee: 0,
    taxAmount: 0,
    discountAmount: 0,
    finalAmount: 0,
    shippingAddress: {
      name: 'Michael Chen',
      phone: '+1 (555) 456-7890',
      country: 'United States',
      province: 'Washington',
      city: 'Seattle',
      district: 'Belltown',
      address: '789 Pine Street, Unit 12',
      postalCode: '98121',
    },
    notes: 'Sample for quality inspection',
    createdAt: '2024-03-26T09:15:00Z',
    updatedAt: '2024-03-27T14:30:00Z',
    paidAt: '2024-03-26T09:20:00Z',
  },
  {
    id: 'o4',
    orderNumber: 'ORD-2024-00004',
    type: 'store_order',
    status: 'pending_payment',
    storeId: 's3',
    storeName: 'Home Essentials Plus',
    items: createOrderItems(2),
    itemCount: 2,
    totalAmount: 124.50,
    currency: 'USD',
    shippingFee: 9.99,
    taxAmount: 9.96,
    discountAmount: 12.45,
    finalAmount: 132.00,
    shippingAddress: {
      name: 'Sarah Williams',
      phone: '+1 (555) 321-0987',
      country: 'United States',
      province: 'Texas',
      city: 'Houston',
      district: 'Midtown',
      address: '321 Elm Drive',
      postalCode: '77002',
    },
    createdAt: '2024-03-28T16:45:00Z',
    updatedAt: '2024-03-28T16:45:00Z',
  },
  {
    id: 'o5',
    orderNumber: 'ORD-2024-00005',
    type: 'stock_order',
    status: 'paid',
    items: createOrderItems(5),
    itemCount: 5,
    totalAmount: 450.00,
    currency: 'USD',
    shippingFee: 25.00,
    taxAmount: 38.00,
    discountAmount: 0,
    finalAmount: 513.00,
    shippingAddress: {
      name: 'Warehouse Team',
      phone: '+1 (555) 654-3210',
      country: 'United States',
      province: 'Illinois',
      city: 'Chicago',
      district: 'Industrial Zone',
      address: '1000 Logistics Blvd',
      postalCode: '60601',
    },
    notes: 'Bulk inventory restock order',
    createdAt: '2024-03-27T08:00:00Z',
    updatedAt: '2024-03-27T08:30:00Z',
    paidAt: '2024-03-27T08:30:00Z',
  },
  {
    id: 'o6',
    orderNumber: 'ORD-2024-00006',
    type: 'store_order',
    status: 'delivered',
    storeId: 's1',
    storeName: 'TechGear Official Store',
    items: createOrderItems(1),
    itemCount: 1,
    totalAmount: 79.99,
    currency: 'USD',
    shippingFee: 4.99,
    taxAmount: 6.40,
    discountAmount: 8.00,
    finalAmount: 83.38,
    shippingAddress: {
      name: 'David Brown',
      phone: '+1 (555) 789-0123',
      country: 'Canada',
      province: 'Ontario',
      city: 'Toronto',
      district: 'Downtown',
      address: '555 King Street West',
      postalCode: 'M5V 1M1',
    },
    trackingNumber: '1234567890123456',
    carrier: 'Canada Post',
    createdAt: '2024-03-15T11:00:00Z',
    updatedAt: '2024-03-22T15:30:00Z',
    paidAt: '2024-03-15T11:05:00Z',
    shippedAt: '2024-03-16T14:00:00Z',
    deliveredAt: '2024-03-22T15:00:00Z',
  },
  {
    id: 'o7',
    orderNumber: 'ORD-2024-00007',
    type: 'sourcing_order',
    status: 'processing',
    items: createOrderItems(3),
    itemCount: 3,
    totalAmount: 320.00,
    currency: 'USD',
    shippingFee: 45.00,
    taxAmount: 0,
    discountAmount: 0,
    finalAmount: 365.00,
    shippingAddress: {
      name: 'Procurement Team',
      phone: '+1 (555) 234-5678',
      country: 'United States',
      province: 'California',
      city: 'San Francisco',
      district: 'Financial District',
      address: '200 Market Street, Floor 15',
      postalCode: '94105',
    },
    notes: 'Sourcing from new supplier - quality check required',
    createdAt: '2024-03-25T13:20:00Z',
    updatedAt: '2024-03-28T10:00:00Z',
    paidAt: '2024-03-25T13:30:00Z',
  },
  {
    id: 'o8',
    orderNumber: 'ORD-2024-00008',
    type: 'store_order',
    status: 'cancelled',
    storeId: 's2',
    storeName: 'Fashion Forward',
    items: createOrderItems(2),
    itemCount: 2,
    totalAmount: 65.98,
    currency: 'USD',
    shippingFee: 5.99,
    taxAmount: 5.28,
    discountAmount: 0,
    finalAmount: 77.25,
    shippingAddress: {
      name: 'Jennifer Lee',
      phone: '+1 (555) 876-5432',
      country: 'United States',
      province: 'Florida',
      city: 'Miami',
      district: 'South Beach',
      address: '888 Ocean Drive',
      postalCode: '33139',
    },
    notes: 'Cancelled by customer request',
    createdAt: '2024-03-18T09:45:00Z',
    updatedAt: '2024-03-19T10:00:00Z',
    paidAt: '2024-03-18T09:50:00Z',
  },
  {
    id: 'o9',
    orderNumber: 'ORD-2024-00009',
    type: 'store_order',
    status: 'refunded',
    storeId: 's3',
    storeName: 'Home Essentials Plus',
    items: createOrderItems(1),
    itemCount: 1,
    totalAmount: 45.99,
    currency: 'USD',
    shippingFee: 0,
    taxAmount: 3.68,
    discountAmount: 4.60,
    finalAmount: 45.07,
    shippingAddress: {
      name: 'Robert Garcia',
      phone: '+1 (555) 567-8901',
      country: 'United States',
      province: 'Arizona',
      city: 'Phoenix',
      district: 'Scottsdale',
      address: '777 Desert Rose Lane',
      postalCode: '85251',
    },
    notes: 'Refunded - defective item',
    createdAt: '2024-03-10T14:30:00Z',
    updatedAt: '2024-03-14T11:00:00Z',
    paidAt: '2024-03-10T14:35:00Z',
    shippedAt: '2024-03-11T09:00:00Z',
  },
  {
    id: 'o10',
    orderNumber: 'ORD-2024-00010',
    type: 'store_order',
    status: 'shipped',
    storeId: 's1',
    storeName: 'TechGear Official Store',
    items: createOrderItems(4),
    itemCount: 4,
    totalAmount: 289.96,
    currency: 'USD',
    shippingFee: 0,
    taxAmount: 23.20,
    discountAmount: 29.00,
    finalAmount: 284.16,
    shippingAddress: {
      name: 'Amanda Wilson',
      phone: '+1 (555) 432-1098',
      country: 'United States',
      province: 'Colorado',
      city: 'Denver',
      district: 'Capitol Hill',
      address: '444 Colfax Avenue',
      postalCode: '80203',
    },
    trackingNumber: 'FX123456789012',
    carrier: 'FedEx',
    createdAt: '2024-03-24T16:00:00Z',
    updatedAt: '2024-03-26T10:30:00Z',
    paidAt: '2024-03-24T16:05:00Z',
    shippedAt: '2024-03-26T10:00:00Z',
  },
  {
    id: 'o11',
    orderNumber: 'ORD-2024-00011',
    type: 'sample_order',
    status: 'completed',
    items: createOrderItems(2),
    itemCount: 2,
    totalAmount: 0,
    currency: 'USD',
    shippingFee: 0,
    taxAmount: 0,
    discountAmount: 0,
    finalAmount: 0,
    shippingAddress: {
      name: 'Quality Control',
      phone: '+1 (555) 109-8765',
      country: 'United States',
      province: 'Nevada',
      city: 'Las Vegas',
      district: 'Summerlin',
      address: '222 Sample Road',
      postalCode: '89135',
    },
    notes: 'Pre-production sample verification',
    createdAt: '2024-03-12T10:00:00Z',
    updatedAt: '2024-03-18T14:00:00Z',
    paidAt: '2024-03-12T10:05:00Z',
    shippedAt: '2024-03-13T11:00:00Z',
    deliveredAt: '2024-03-18T13:30:00Z',
  },
  {
    id: 'o12',
    orderNumber: 'ORD-2024-00012',
    type: 'store_order',
    status: 'paid',
    storeId: 's2',
    storeName: 'Fashion Forward',
    items: createOrderItems(3),
    itemCount: 3,
    totalAmount: 134.97,
    currency: 'USD',
    shippingFee: 7.99,
    taxAmount: 10.80,
    discountAmount: 13.50,
    finalAmount: 140.26,
    shippingAddress: {
      name: 'Chris Martinez',
      phone: '+1 (555) 012-3456',
      country: 'United States',
      province: 'Oregon',
      city: 'Portland',
      district: 'Pearl District',
      address: '101 NW Lovejoy Street',
      postalCode: '97209',
    },
    createdAt: '2024-03-28T18:30:00Z',
    updatedAt: '2024-03-28T18:35:00Z',
    paidAt: '2024-03-28T18:35:00Z',
  },
  {
    id: 'o13',
    orderNumber: 'ORD-2024-00013',
    type: 'stock_order',
    status: 'shipped',
    items: createOrderItems(8),
    itemCount: 8,
    totalAmount: 1200.00,
    currency: 'USD',
    shippingFee: 50.00,
    taxAmount: 100.00,
    discountAmount: 0,
    finalAmount: 1350.00,
    shippingAddress: {
      name: 'Distribution Center',
      phone: '+1 (555) 345-6789',
      country: 'United States',
      province: 'Georgia',
      city: 'Atlanta',
      district: 'Industrial Park',
      address: '5000 Distribution Way',
      postalCode: '30301',
    },
    trackingNumber: 'UP9876543210ZYX',
    carrier: 'UPS Freight',
    notes: 'Quarterly inventory replenishment',
    createdAt: '2024-03-21T07:00:00Z',
    updatedAt: '2024-03-23T14:00:00Z',
    paidAt: '2024-03-21T07:15:00Z',
    shippedAt: '2024-03-23T14:00:00Z',
  },
  {
    id: 'o14',
    orderNumber: 'ORD-2024-00014',
    type: 'store_order',
    status: 'pending_payment',
    storeId: 's3',
    storeName: 'Home Essentials Plus',
    items: createOrderItems(1),
    itemCount: 1,
    totalAmount: 39.99,
    currency: 'USD',
    shippingFee: 5.99,
    taxAmount: 3.20,
    discountAmount: 0,
    finalAmount: 49.18,
    shippingAddress: {
      name: 'Lisa Thompson',
      phone: '+1 (555) 678-9012',
      country: 'United Kingdom',
      province: 'England',
      city: 'London',
      district: 'Westminster',
      address: '10 Downing Street',
      postalCode: 'SW1A 2AA',
    },
    createdAt: '2024-03-29T08:00:00Z',
    updatedAt: '2024-03-29T08:00:00Z',
  },
  {
    id: 'o15',
    orderNumber: 'ORD-2024-00015',
    type: 'sourcing_order',
    status: 'completed',
    items: createOrderItems(6),
    itemCount: 6,
    totalAmount: 780.00,
    currency: 'USD',
    shippingFee: 85.00,
    taxAmount: 0,
    discountAmount: 50.00,
    finalAmount: 815.00,
    shippingAddress: {
      name: 'Import Team',
      phone: '+1 (555) 901-2345',
      country: 'United States',
      province: 'California',
      city: 'Los Angeles',
      district: 'Port Area',
      address: '300 Harbor Boulevard',
      postalCode: '90731',
    },
    trackingNumber: 'INTL-SHIP-2024-001',
    carrier: 'DHL Express',
    notes: 'International sourcing order - customs cleared',
    createdAt: '2024-03-05T12:00:00Z',
    updatedAt: '2024-03-15T16:00:00Z',
    paidAt: '2024-03-05T12:15:00Z',
    shippedAt: '2024-03-08T09:00:00Z',
    deliveredAt: '2024-03-15T15:00:00Z',
  },
];

/**
 * Mock order details
 */
export const MOCK_ORDER_DETAILS: OrderDetail[] = [
  {
    id: 'o1',
    orderNumber: 'ORD-2024-00001',
    type: 'store_order',
    status: 'completed',
    storeId: 's1',
    storeName: 'TechGear Official Store',
    items: createOrderItems(2),
    itemCount: 2,
    totalAmount: 159.98,
    currency: 'USD',
    shippingFee: 5.99,
    taxAmount: 12.80,
    discountAmount: 15.99,
    finalAmount: 162.78,
    shippingAddress: {
      name: 'John Smith',
      phone: '+1 (555) 123-4567',
      country: 'United States',
      province: 'California',
      city: 'Los Angeles',
      district: 'Downtown',
      address: '123 Main Street, Apt 4B',
      postalCode: '90001',
    },
    trackingNumber: '1Z999AA10123456784',
    carrier: 'UPS',
    notes: 'Please leave at front door',
    createdAt: '2024-03-20T10:30:00Z',
    updatedAt: '2024-03-25T16:45:00Z',
    paidAt: '2024-03-20T10:35:00Z',
    shippedAt: '2024-03-21T09:00:00Z',
    deliveredAt: '2024-03-25T14:30:00Z',
    customer: {
      id: 'cust-1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1 (555) 123-4567',
    },
    paymentMethod: 'Credit Card (Visa ****4532)',
    paymentStatus: 'paid',
    timeline: [
      {
        id: 't1',
        status: 'pending_payment',
        description: 'Order placed',
        createdAt: '2024-03-20T10:30:00Z',
      },
      {
        id: 't2',
        status: 'paid',
        description: 'Payment confirmed via Visa ****4532',
        operator: 'System',
        createdAt: '2024-03-20T10:35:00Z',
      },
      {
        id: 't3',
        status: 'processing',
        description: 'Order is being processed',
        operator: 'Warehouse Team',
        createdAt: '2024-03-20T14:00:00Z',
      },
      {
        id: 't4',
        status: 'shipped',
        description: 'Shipped via UPS - Tracking: 1Z999AA10123456784',
        operator: 'Shipping Dept',
        createdAt: '2024-03-21T09:00:00Z',
      },
      {
        id: 't5',
        status: 'delivered',
        description: 'Delivered to front door',
        operator: 'UPS',
        createdAt: '2024-03-25T14:30:00Z',
      },
      {
        id: 't6',
        status: 'completed',
        description: 'Order completed',
        operator: 'System',
        createdAt: '2024-03-25T16:45:00Z',
      },
    ],
  },
];

/**
 * Mock order statistics
 */
export const MOCK_ORDER_STATS: OrderStats = {
  total: 15,
  pending: 2,
  processing: 2,
  shipped: 3,
  completed: 5,
  cancelled: 2,
  totalRevenue: 4250.75,
  averageOrderValue: 283.38,
};

/**
 * Empty order list
 */
export const MOCK_EMPTY_ORDERS: Order[] = [];

/**
 * Get mock order by ID
 */
export const getMockOrderById = (id: string): Order | undefined => {
  return MOCK_ORDERS.find(o => o.id === id);
};

/**
 * Get mock order detail by ID
 */
export const getMockOrderDetailById = (id: string): OrderDetail | undefined => {
  return MOCK_ORDER_DETAILS.find(o => o.id === id);
};

/**
 * Get mock order by order number
 */
export const getMockOrderByNumber = (orderNumber: string): Order | undefined => {
  return MOCK_ORDERS.find(o => o.orderNumber === orderNumber);
};
