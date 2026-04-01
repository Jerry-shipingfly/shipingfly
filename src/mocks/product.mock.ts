/**
 * Product Module Mock Data
 */

import { Product, ProductDetail, ProductCollection, SourcingRequest } from '@/types/product.types';

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
 * Product categories
 */
export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Sports & Outdoors',
  'Beauty & Personal Care',
  'Toys & Games',
  'Automotive',
  'Books',
  'Jewelry',
  'Health & Wellness',
] as const;

/**
 * Mock product list
 */
// Product images (randomly distributed)
const PRODUCT_IMAGES = [
  '/mocks/products/product-1.jpg',
  '/mocks/products/product-2.png',
  '/mocks/products/product-3.jpg',
  '/mocks/products/product-4.jpg',
  '/mocks/products/product-5.jpg',
  '/mocks/products/product-6.jpg',
  '/mocks/products/product-7.jpg',
  '/mocks/products/product-8.jpg',
  '/mocks/products/product-9.jpg',
  '/mocks/products/product-10.png',
  '/mocks/products/product-11.png',
  '/mocks/products/product-12.png',
  '/mocks/products/product-13.png',
  '/mocks/products/product-14.png',
  '/mocks/products/product-15.png',
  '/mocks/products/product-16.png',
  '/mocks/products/product-17.jpg',
  '/mocks/products/product-18.jpg',
];

/**
 * Color-specific product images for testing Color-MainImage linkage
 * Each color has 5 images for carousel display
 * Using existing product images to demonstrate color switching effect
 */
const EARBUDS_IMAGES = {
  // Black Earbuds - 5 images
  black: [
    '/mocks/products/product-7.jpg',
    '/mocks/products/product-8.jpg',
    '/mocks/products/product-9.jpg',
    '/mocks/products/product-1.jpg',
    '/mocks/products/product-2.png',
  ],
  // White Earbuds - 5 images
  white: [
    '/mocks/products/product-10.png',
    '/mocks/products/product-11.png',
    '/mocks/products/product-12.png',
    '/mocks/products/product-3.jpg',
    '/mocks/products/product-4.jpg',
  ],
  // Blue Earbuds - 5 images
  blue: [
    '/mocks/products/product-13.png',
    '/mocks/products/product-14.png',
    '/mocks/products/product-15.png',
    '/mocks/products/product-5.jpg',
    '/mocks/products/product-6.jpg',
  ],
};

const WATCH_IMAGES = {
  // Black Watch - 5 images
  black: [
    '/mocks/products/product-1.jpg',
    '/mocks/products/product-2.png',
    '/mocks/products/product-3.jpg',
    '/mocks/products/product-7.jpg',
    '/mocks/products/product-8.jpg',
  ],
  // Silver Watch - 5 images
  silver: [
    '/mocks/products/product-4.jpg',
    '/mocks/products/product-5.jpg',
    '/mocks/products/product-6.jpg',
    '/mocks/products/product-9.jpg',
    '/mocks/products/product-10.png',
  ],
  // Gold Watch - 5 images
  gold: [
    '/mocks/products/product-16.png',
    '/mocks/products/product-17.jpg',
    '/mocks/products/product-18.jpg',
    '/mocks/products/product-11.png',
    '/mocks/products/product-12.png',
  ],
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    spu: 'SPU-EB-001',
    name: 'Wireless Bluetooth Earbuds Pro',
    description: 'High-quality wireless earbuds with active noise cancellation, 30-hour battery life, and premium sound quality.',
    price: 79.99,
    originalPrice: 99.99,
    currency: 'USD',
    category: 'Electronics',
    images: [PRODUCT_IMAGES[7], PRODUCT_IMAGES[2]],
    inventory: 150,
    salesCount: 1250,
    rating: 4.5,
    reviewCount: 89,
    tags: ['wireless', 'bluetooth', 'earbuds', 'noise-cancelling'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-03-20T15:30:00Z',
  },
  {
    id: '2',
    spu: 'SPU-WA-002',
    name: 'Smart Fitness Watch Series X',
    description: 'Advanced fitness tracking with GPS, heart rate monitor, sleep tracking, and 7-day battery life.',
    price: 199.99,
    originalPrice: 249.99,
    currency: 'USD',
    category: 'Electronics',
    images: [PRODUCT_IMAGES[12], PRODUCT_IMAGES[5]],
    inventory: 85,
    salesCount: 890,
    rating: 4.8,
    reviewCount: 156,
    tags: ['smartwatch', 'fitness', 'GPS', 'health'],
    createdAt: '2024-02-01T08:00:00Z',
    updatedAt: '2024-03-18T12:00:00Z',
  },
  {
    id: '3',
    spu: 'SPU-TS-003',
    name: 'Premium Cotton T-Shirt',
    description: 'Soft, breathable 100% organic cotton t-shirt. Available in multiple colors and sizes.',
    price: 29.99,
    currency: 'USD',
    category: 'Clothing',
    images: [PRODUCT_IMAGES[3], PRODUCT_IMAGES[4]],
    inventory: 500,
    salesCount: 3200,
    rating: 4.3,
    reviewCount: 234,
    tags: ['cotton', 'organic', 't-shirt', 'casual'],
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-03-15T09:45:00Z',
  },
  {
    id: '4',
    spu: 'SPU-LP-004',
    name: 'LED Desk Lamp with USB Charger',
    description: 'Modern LED desk lamp with adjustable brightness, color temperature control, and built-in USB charging port.',
    price: 45.99,
    originalPrice: 59.99,
    currency: 'USD',
    category: 'Home & Garden',
    images: [PRODUCT_IMAGES[15]],
    inventory: 200,
    salesCount: 567,
    rating: 4.6,
    reviewCount: 78,
    tags: ['LED', 'desk lamp', 'USB', 'adjustable'],
    createdAt: '2024-02-10T11:20:00Z',
    updatedAt: '2024-03-22T16:00:00Z',
  },
  {
    id: '5',
    spu: 'SPU-YM-005',
    name: 'Yoga Mat Premium',
    description: 'Extra thick non-slip yoga mat with carrying strap. Perfect for yoga, pilates, and meditation.',
    price: 35.99,
    currency: 'USD',
    category: 'Sports & Outdoors',
    images: [PRODUCT_IMAGES[9], PRODUCT_IMAGES[10]],
    inventory: 300,
    salesCount: 1890,
    rating: 4.7,
    reviewCount: 312,
    tags: ['yoga', 'fitness', 'mat', 'non-slip'],
    createdAt: '2024-01-25T09:00:00Z',
    updatedAt: '2024-03-19T14:30:00Z',
  },
  {
    id: '6',
    spu: 'SPU-SP-006',
    name: 'Portable Bluetooth Speaker',
    description: 'Waterproof portable speaker with 360-degree sound, 20-hour playtime, and built-in microphone.',
    price: 59.99,
    originalPrice: 79.99,
    currency: 'USD',
    category: 'Electronics',
    images: [PRODUCT_IMAGES[1]],
    inventory: 120,
    salesCount: 780,
    rating: 4.4,
    reviewCount: 98,
    tags: ['bluetooth', 'speaker', 'waterproof', 'portable'],
    createdAt: '2024-02-05T16:45:00Z',
    updatedAt: '2024-03-21T10:15:00Z',
  },
  {
    id: '7',
    spu: 'SPU-SK-007',
    name: 'Anti-Aging Face Serum',
    description: 'Advanced formula with vitamin C, hyaluronic acid, and retinol for younger-looking skin.',
    price: 49.99,
    currency: 'USD',
    category: 'Beauty & Personal Care',
    images: [PRODUCT_IMAGES[6], PRODUCT_IMAGES[14]],
    inventory: 80,
    salesCount: 2450,
    rating: 4.9,
    reviewCount: 456,
    tags: ['skincare', 'anti-aging', 'serum', 'vitamin C'],
    createdAt: '2024-01-18T12:00:00Z',
    updatedAt: '2024-03-28T08:00:00Z',
  },
  {
    id: '8',
    spu: 'SPU-BL-008',
    name: 'Building Blocks Set (500 Pieces)',
    description: 'Creative building blocks set compatible with major brands. Includes storage container.',
    price: 34.99,
    currency: 'USD',
    category: 'Toys & Games',
    images: [PRODUCT_IMAGES[17]],
    inventory: 150,
    salesCount: 1100,
    rating: 4.5,
    reviewCount: 167,
    tags: ['blocks', 'building', 'creative', 'kids'],
    createdAt: '2024-02-12T10:30:00Z',
    updatedAt: '2024-03-17T15:45:00Z',
  },
  {
    id: '9',
    spu: 'SPU-PH-009',
    name: 'Car Phone Mount Holder',
    description: 'Universal car phone mount with 360-degree rotation, strong suction cup, and one-hand operation.',
    price: 19.99,
    originalPrice: 29.99,
    currency: 'USD',
    category: 'Automotive',
    images: [PRODUCT_IMAGES[0]],
    inventory: 400,
    salesCount: 3500,
    rating: 4.2,
    reviewCount: 289,
    tags: ['car', 'phone mount', 'universal', 'hands-free'],
    createdAt: '2024-01-22T14:00:00Z',
    updatedAt: '2024-03-23T11:30:00Z',
  },
  {
    id: '10',
    spu: 'SPU-BK-010',
    name: 'Bestselling Novel Collection',
    description: 'Hardcover collection of the year\'s bestselling fiction novels. Set of 5 books.',
    price: 59.99,
    currency: 'USD',
    category: 'Books',
    images: [PRODUCT_IMAGES[11]],
    inventory: 75,
    salesCount: 890,
    rating: 4.6,
    reviewCount: 134,
    tags: ['books', 'fiction', 'bestseller', 'collection'],
    createdAt: '2024-02-08T09:15:00Z',
    updatedAt: '2024-03-24T13:00:00Z',
  },
  {
    id: '11',
    spu: 'SPU-NK-011',
    name: 'Sterling Silver Necklace',
    description: 'Elegant sterling silver necklace with cubic zirconia pendant. Perfect for special occasions.',
    price: 89.99,
    originalPrice: 119.99,
    currency: 'USD',
    category: 'Jewelry',
    images: [PRODUCT_IMAGES[16], PRODUCT_IMAGES[8]],
    inventory: 45,
    salesCount: 320,
    rating: 4.8,
    reviewCount: 67,
    tags: ['silver', 'necklace', 'jewelry', 'gift'],
    createdAt: '2024-01-28T11:45:00Z',
    updatedAt: '2024-03-26T16:20:00Z',
  },
  {
    id: '12',
    spu: 'SPU-VT-012',
    name: 'Vitamin D3 Supplement',
    description: 'High-strength vitamin D3 supplement for immune support and bone health. 365 softgels.',
    price: 24.99,
    currency: 'USD',
    category: 'Health & Wellness',
    images: [PRODUCT_IMAGES[13]],
    inventory: 250,
    salesCount: 4200,
    rating: 4.7,
    reviewCount: 523,
    tags: ['vitamin', 'supplement', 'health', 'immune'],
    createdAt: '2024-02-03T08:30:00Z',
    updatedAt: '2024-03-29T10:00:00Z',
  },
  {
    id: '13',
    spu: 'SPU-MS-013',
    name: 'Wireless Gaming Mouse',
    description: 'Professional gaming mouse with 16000 DPI, RGB lighting, and 70-hour battery life.',
    price: 69.99,
    originalPrice: 89.99,
    currency: 'USD',
    category: 'Electronics',
    images: [PRODUCT_IMAGES[2]],
    inventory: 95,
    salesCount: 670,
    rating: 4.6,
    reviewCount: 112,
    tags: ['gaming', 'mouse', 'wireless', 'RGB'],
    createdAt: '2024-02-15T15:00:00Z',
    updatedAt: '2024-03-27T14:45:00Z',
  },
  {
    id: '14',
    spu: 'SPU-JK-014',
    name: 'Denim Jacket Classic',
    description: 'Classic fit denim jacket with vintage wash. Timeless style for any occasion.',
    price: 79.99,
    currency: 'USD',
    category: 'Clothing',
    images: [PRODUCT_IMAGES[4], PRODUCT_IMAGES[3]],
    inventory: 180,
    salesCount: 890,
    rating: 4.4,
    reviewCount: 145,
    tags: ['denim', 'jacket', 'vintage', 'classic'],
    createdAt: '2024-01-30T12:30:00Z',
    updatedAt: '2024-03-20T09:00:00Z',
  },
  {
    id: '15',
    spu: 'SPU-PT-015',
    name: 'Indoor Plant Pot Set',
    description: 'Set of 3 modern ceramic plant pots with drainage holes. Perfect for succulents and small plants.',
    price: 39.99,
    currency: 'USD',
    category: 'Home & Garden',
    images: [PRODUCT_IMAGES[10]],
    inventory: 120,
    salesCount: 560,
    rating: 4.5,
    reviewCount: 89,
    tags: ['plant pot', 'ceramic', 'indoor', 'decor'],
    createdAt: '2024-02-18T10:00:00Z',
    updatedAt: '2024-03-25T11:15:00Z',
  },
  {
    id: '16',
    spu: 'SPU-TN-016',
    name: 'Camping Tent 4-Person',
    description: 'Waterproof camping tent for 4 people. Easy setup, durable materials, includes carrying bag.',
    price: 149.99,
    originalPrice: 199.99,
    currency: 'USD',
    category: 'Sports & Outdoors',
    images: [PRODUCT_IMAGES[9]],
    inventory: 60,
    salesCount: 230,
    rating: 4.3,
    reviewCount: 56,
    tags: ['camping', 'tent', 'outdoor', 'waterproof'],
    createdAt: '2024-02-22T14:30:00Z',
    updatedAt: '2024-03-28T16:00:00Z',
  },
  {
    id: '17',
    spu: 'SPU-HD-017',
    name: 'Electric Hair Dryer',
    description: 'Professional ionic hair dryer with multiple heat and speed settings. Fast drying, less damage.',
    price: 54.99,
    currency: 'USD',
    category: 'Beauty & Personal Care',
    images: [PRODUCT_IMAGES[5]],
    inventory: 140,
    salesCount: 980,
    rating: 4.5,
    reviewCount: 178,
    tags: ['hair dryer', 'ionic', 'professional', 'fast drying'],
    createdAt: '2024-01-12T09:45:00Z',
    updatedAt: '2024-03-22T13:30:00Z',
  },
  {
    id: '18',
    spu: 'SPU-BG-018',
    name: 'Board Game Strategy Set',
    description: 'Collection of classic strategy board games. Includes chess, checkers, and backgammon.',
    price: 44.99,
    currency: 'USD',
    category: 'Toys & Games',
    images: [PRODUCT_IMAGES[15]],
    inventory: 90,
    salesCount: 450,
    rating: 4.7,
    reviewCount: 82,
    tags: ['board game', 'strategy', 'chess', 'family'],
    createdAt: '2024-02-25T11:00:00Z',
    updatedAt: '2024-03-24T15:00:00Z',
  },
  {
    id: '19',
    spu: 'SPU-VC-019',
    name: 'Car Vacuum Cleaner',
    description: 'Portable car vacuum with powerful suction, LED light, and multiple attachments.',
    price: 39.99,
    originalPrice: 49.99,
    currency: 'USD',
    category: 'Automotive',
    images: [PRODUCT_IMAGES[8]],
    inventory: 200,
    salesCount: 1230,
    rating: 4.4,
    reviewCount: 198,
    tags: ['car vacuum', 'portable', 'cleaning', 'LED'],
    createdAt: '2024-01-08T16:00:00Z',
    updatedAt: '2024-03-19T12:30:00Z',
  },
  {
    id: '20',
    spu: 'SPU-BB-020',
    name: 'Business Book Bundle',
    description: 'Essential business books for entrepreneurs. Includes marketing, leadership, and finance titles.',
    price: 79.99,
    currency: 'USD',
    category: 'Books',
    images: [PRODUCT_IMAGES[14]],
    inventory: 55,
    salesCount: 340,
    rating: 4.8,
    reviewCount: 76,
    tags: ['business', 'entrepreneur', 'marketing', 'leadership'],
    createdAt: '2024-02-28T08:15:00Z',
    updatedAt: '2024-03-29T09:30:00Z',
  },
];

/**
 * Mock product details
 */
export const MOCK_PRODUCT_DETAILS: ProductDetail[] = [
  {
    id: '1',
    spu: 'SPU-EB-001',
    name: 'Wireless Bluetooth Earbuds Pro',
    description: 'Experience premium sound quality with our Wireless Bluetooth Earbuds Pro.',
    price: 79.99,
    originalPrice: 99.99,
    currency: 'USD',
    category: 'Electronics',
    // Default images (show black variant by default)
    images: [
      EARBUDS_IMAGES.black[0],
      EARBUDS_IMAGES.black[1],
      EARBUDS_IMAGES.black[2],
      EARBUDS_IMAGES.white[0],
      EARBUDS_IMAGES.blue[0],
    ],
    mainAttribute: {
      name: 'color',
      label: 'Color',
      isMain: true,
      values: [
        { id: 'black', name: 'Black', image: EARBUDS_IMAGES.black[0], inStock: true },
        { id: 'white', name: 'White', image: EARBUDS_IMAGES.white[0], inStock: true },
        { id: 'blue', name: 'Blue', image: EARBUDS_IMAGES.blue[0], inStock: true },
      ],
    },
    attributes: [
      {
        name: 'specs',
        label: 'Specs',
        values: [
          { id: 'basic', name: 'Basic', inStock: true },
          { id: 'pro', name: 'Pro', inStock: true },
        ],
      },
    ],
    variants: [
      // 3 Colors × 2 Specs = 6 SKUs - Each color has 3 distinct images
      { id: 'v1', sku: 'WBE-BLK-Basic', name: 'Black - Basic', price: 79.99, inventory: 50, attributes: { color: 'black', specs: 'basic' }, image: EARBUDS_IMAGES.black[0], images: EARBUDS_IMAGES.black },
      { id: 'v2', sku: 'WBE-BLK-Pro', name: 'Black - Pro', price: 99.99, inventory: 35, attributes: { color: 'black', specs: 'pro' }, image: EARBUDS_IMAGES.black[0], images: EARBUDS_IMAGES.black },
      { id: 'v3', sku: 'WBE-WHT-Basic', name: 'White - Basic', price: 79.99, inventory: 45, attributes: { color: 'white', specs: 'basic' }, image: EARBUDS_IMAGES.white[0], images: EARBUDS_IMAGES.white },
      { id: 'v4', sku: 'WBE-WHT-Pro', name: 'White - Pro', price: 99.99, inventory: 30, attributes: { color: 'white', specs: 'pro' }, image: EARBUDS_IMAGES.white[0], images: EARBUDS_IMAGES.white },
      { id: 'v5', sku: 'WBE-BLU-Basic', name: 'Blue - Basic', price: 79.99, inventory: 30, attributes: { color: 'blue', specs: 'basic' }, image: EARBUDS_IMAGES.blue[0], images: EARBUDS_IMAGES.blue },
      { id: 'v6', sku: 'WBE-BLU-Pro', name: 'Blue - Pro', price: 99.99, inventory: 20, attributes: { color: 'blue', specs: 'pro' }, image: EARBUDS_IMAGES.blue[0], images: EARBUDS_IMAGES.blue },
    ],
    specifications: [
      { name: 'Battery Life', value: '8 hours (earbuds) + 22 hours (case)' },
      { name: 'Charging Time', value: '2 hours (earbuds), 3 hours (case)' },
      { name: 'Bluetooth Version', value: '5.3' },
      { name: 'Driver Size', value: '11mm dynamic driver' },
      { name: 'Water Resistance', value: 'IPX5' },
      { name: 'Noise Cancellation', value: 'Active Noise Cancellation (ANC)' },
    ],
    richDescription: `
      <h3>Experience Premium Sound Quality</h3>
      <p>Our Wireless Bluetooth Earbuds Pro deliver exceptional audio performance with advanced Active Noise Cancellation (ANC).</p>
      <img src="${EARBUDS_IMAGES.black[0]}" alt="Earbuds" />
      <h3>All-Day Comfort</h3>
      <p>The ergonomic design ensures a comfortable fit for all-day wear, while IPX5 water resistance makes them perfect for workouts.</p>
      <img src="${EARBUDS_IMAGES.white[0]}" alt="Comfort" />
      <h3>Extended Battery Life</h3>
      <p>With 30 hours of total battery life (8 hours per charge + 22 hours from the case), you'll never be without your favorite audio content.</p>
    `,
    inventory: 210,
    salesCount: 1250,
    rating: 4.5,
    reviewCount: 89,
    tags: ['wireless', 'bluetooth', 'earbuds', 'noise-cancelling'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-03-20T15:30:00Z',
    relatedProducts: MOCK_PRODUCTS.filter(p => p.category === 'Electronics' && p.id !== '1').slice(0, 4),
  },
  {
    id: '2',
    spu: 'SPU-WA-002',
    name: 'Smart Fitness Watch Series X',
    description: 'The Smart Fitness Watch Series X is your ultimate health and fitness companion.',
    price: 199.99,
    originalPrice: 249.99,
    currency: 'USD',
    category: 'Electronics',
    // Default images (show black variant by default)
    images: [
      WATCH_IMAGES.black[0],
      WATCH_IMAGES.black[1],
      WATCH_IMAGES.black[2],
      WATCH_IMAGES.silver[0],
      WATCH_IMAGES.gold[0],
    ],
    mainAttribute: {
      name: 'color',
      label: 'Color',
      isMain: true,
      values: [
        { id: 'black', name: 'Black', image: WATCH_IMAGES.black[0], inStock: true },
        { id: 'silver', name: 'Silver', image: WATCH_IMAGES.silver[0], inStock: true },
        { id: 'gold', name: 'Gold', image: WATCH_IMAGES.gold[0], inStock: true },
      ],
    },
    attributes: [
      {
        name: 'size',
        label: 'Size',
        values: [
          { id: '42mm', name: '42mm', inStock: true },
          { id: '46mm', name: '46mm', inStock: true },
        ],
      },
    ],
    variants: [
      // 3 Colors × 2 Sizes = 6 SKUs - Each color has 3 distinct images
      { id: 'w1', sku: 'SFW-BLK-42', name: 'Black - 42mm', price: 199.99, inventory: 25, attributes: { color: 'black', size: '42mm' }, image: WATCH_IMAGES.black[0], images: WATCH_IMAGES.black },
      { id: 'w2', sku: 'SFW-BLK-46', name: 'Black - 46mm', price: 219.99, inventory: 20, attributes: { color: 'black', size: '46mm' }, image: WATCH_IMAGES.black[0], images: WATCH_IMAGES.black },
      { id: 'w3', sku: 'SFW-SLV-42', name: 'Silver - 42mm', price: 199.99, inventory: 22, attributes: { color: 'silver', size: '42mm' }, image: WATCH_IMAGES.silver[0], images: WATCH_IMAGES.silver },
      { id: 'w4', sku: 'SFW-SLV-46', name: 'Silver - 46mm', price: 219.99, inventory: 18, attributes: { color: 'silver', size: '46mm' }, image: WATCH_IMAGES.silver[0], images: WATCH_IMAGES.silver },
      { id: 'w5', sku: 'SFW-GLD-42', name: 'Gold - 42mm', price: 219.99, inventory: 15, attributes: { color: 'gold', size: '42mm' }, image: WATCH_IMAGES.gold[0], images: WATCH_IMAGES.gold },
      { id: 'w6', sku: 'SFW-GLD-46', name: 'Gold - 46mm', price: 239.99, inventory: 12, attributes: { color: 'gold', size: '46mm' }, image: WATCH_IMAGES.gold[0], images: WATCH_IMAGES.gold },
    ],
    specifications: [
      { name: 'Display', value: '1.4" AMOLED, 454x454' },
      { name: 'Battery Life', value: 'Up to 7 days' },
      { name: 'Water Resistance', value: '5ATM' },
      { name: 'GPS', value: 'Built-in GPS + GLONASS' },
      { name: 'Heart Rate', value: '24/7 optical heart rate monitor' },
      { name: 'Sensors', value: 'SpO2, accelerometer, gyroscope' },
      { name: 'Connectivity', value: 'Bluetooth 5.0, Wi-Fi' },
    ],
    richDescription: `
      <h3>Your Ultimate Health & Fitness Companion</h3>
      <p>Track your workouts with precision GPS, monitor your heart rate 24/7, analyze your sleep patterns, and stay connected with smart notifications.</p>
      <img src="${WATCH_IMAGES.black[0]}" alt="Watch" />
      <h3>Stunning AMOLED Display</h3>
      <p>With a stunning 1.4" AMOLED display and up to 7 days of battery life, this watch keeps up with your active lifestyle.</p>
    `,
    inventory: 112,
    salesCount: 890,
    rating: 4.8,
    reviewCount: 156,
    tags: ['smartwatch', 'fitness', 'GPS', 'health'],
    createdAt: '2024-02-01T08:00:00Z',
    updatedAt: '2024-03-18T12:00:00Z',
    relatedProducts: MOCK_PRODUCTS.filter(p => p.category === 'Electronics' && p.id !== '2').slice(0, 4),
  },
  // Third product: Premium Cotton T-Shirt with 4 Colors
  {
    id: '3',
    spu: 'SPU-TS-003',
    name: 'Premium Cotton T-Shirt',
    description: 'Soft, breathable 100% organic cotton t-shirt. Available in multiple colors and sizes.',
    price: 29.99,
    currency: 'USD',
    category: 'Clothing',
    images: [
      PRODUCT_IMAGES[3],
      PRODUCT_IMAGES[4],
      PRODUCT_IMAGES[0],
      PRODUCT_IMAGES[1],
    ],
    mainAttribute: {
      name: 'color',
      label: 'Color',
      isMain: true,
      values: [
        { id: 'navy', name: 'Navy', image: PRODUCT_IMAGES[3], inStock: true },
        { id: 'white', name: 'White', image: PRODUCT_IMAGES[4], inStock: true },
        { id: 'black', name: 'Black', image: PRODUCT_IMAGES[0], inStock: true },
        { id: 'gray', name: 'Gray', image: PRODUCT_IMAGES[1], inStock: true },
      ],
    },
    attributes: [
      {
        name: 'size',
        label: 'Size',
        values: [
          { id: 's', name: 'S', inStock: true },
          { id: 'm', name: 'M', inStock: true },
          { id: 'l', name: 'L', inStock: true },
          { id: 'xl', name: 'XL', inStock: true },
        ],
      },
    ],
    variants: [
      // 4 Colors × 4 Sizes = 16 SKUs - Each color has 3 distinct images
      // Navy variants
      { id: 'ts1', sku: 'TS-NV-S', name: 'Navy - S', price: 29.99, inventory: 50, attributes: { color: 'navy', size: 's' }, image: PRODUCT_IMAGES[3], images: [PRODUCT_IMAGES[3], PRODUCT_IMAGES[7], PRODUCT_IMAGES[8]] },
      { id: 'ts2', sku: 'TS-NV-M', name: 'Navy - M', price: 29.99, inventory: 60, attributes: { color: 'navy', size: 'm' }, image: PRODUCT_IMAGES[3], images: [PRODUCT_IMAGES[3], PRODUCT_IMAGES[7], PRODUCT_IMAGES[8]] },
      { id: 'ts3', sku: 'TS-NV-L', name: 'Navy - L', price: 29.99, inventory: 45, attributes: { color: 'navy', size: 'l' }, image: PRODUCT_IMAGES[3], images: [PRODUCT_IMAGES[3], PRODUCT_IMAGES[7], PRODUCT_IMAGES[8]] },
      { id: 'ts4', sku: 'TS-NV-XL', name: 'Navy - XL', price: 32.99, inventory: 30, attributes: { color: 'navy', size: 'xl' }, image: PRODUCT_IMAGES[3], images: [PRODUCT_IMAGES[3], PRODUCT_IMAGES[7], PRODUCT_IMAGES[8]] },
      // White variants
      { id: 'ts5', sku: 'TS-WH-S', name: 'White - S', price: 29.99, inventory: 55, attributes: { color: 'white', size: 's' }, image: PRODUCT_IMAGES[4], images: [PRODUCT_IMAGES[4], PRODUCT_IMAGES[9], PRODUCT_IMAGES[10]] },
      { id: 'ts6', sku: 'TS-WH-M', name: 'White - M', price: 29.99, inventory: 70, attributes: { color: 'white', size: 'm' }, image: PRODUCT_IMAGES[4], images: [PRODUCT_IMAGES[4], PRODUCT_IMAGES[9], PRODUCT_IMAGES[10]] },
      { id: 'ts7', sku: 'TS-WH-L', name: 'White - L', price: 29.99, inventory: 50, attributes: { color: 'white', size: 'l' }, image: PRODUCT_IMAGES[4], images: [PRODUCT_IMAGES[4], PRODUCT_IMAGES[9], PRODUCT_IMAGES[10]] },
      { id: 'ts8', sku: 'TS-WH-XL', name: 'White - XL', price: 32.99, inventory: 35, attributes: { color: 'white', size: 'xl' }, image: PRODUCT_IMAGES[4], images: [PRODUCT_IMAGES[4], PRODUCT_IMAGES[9], PRODUCT_IMAGES[10]] },
      // Black variants
      { id: 'ts9', sku: 'TS-BK-S', name: 'Black - S', price: 29.99, inventory: 40, attributes: { color: 'black', size: 's' }, image: PRODUCT_IMAGES[0], images: [PRODUCT_IMAGES[0], PRODUCT_IMAGES[11], PRODUCT_IMAGES[12]] },
      { id: 'ts10', sku: 'TS-BK-M', name: 'Black - M', price: 29.99, inventory: 65, attributes: { color: 'black', size: 'm' }, image: PRODUCT_IMAGES[0], images: [PRODUCT_IMAGES[0], PRODUCT_IMAGES[11], PRODUCT_IMAGES[12]] },
      { id: 'ts11', sku: 'TS-BK-L', name: 'Black - L', price: 29.99, inventory: 55, attributes: { color: 'black', size: 'l' }, image: PRODUCT_IMAGES[0], images: [PRODUCT_IMAGES[0], PRODUCT_IMAGES[11], PRODUCT_IMAGES[12]] },
      { id: 'ts12', sku: 'TS-BK-XL', name: 'Black - XL', price: 32.99, inventory: 40, attributes: { color: 'black', size: 'xl' }, image: PRODUCT_IMAGES[0], images: [PRODUCT_IMAGES[0], PRODUCT_IMAGES[11], PRODUCT_IMAGES[12]] },
      // Gray variants
      { id: 'ts13', sku: 'TS-GR-S', name: 'Gray - S', price: 29.99, inventory: 35, attributes: { color: 'gray', size: 's' }, image: PRODUCT_IMAGES[1], images: [PRODUCT_IMAGES[1], PRODUCT_IMAGES[13], PRODUCT_IMAGES[14]] },
      { id: 'ts14', sku: 'TS-GR-M', name: 'Gray - M', price: 29.99, inventory: 50, attributes: { color: 'gray', size: 'm' }, image: PRODUCT_IMAGES[1], images: [PRODUCT_IMAGES[1], PRODUCT_IMAGES[13], PRODUCT_IMAGES[14]] },
      { id: 'ts15', sku: 'TS-GR-L', name: 'Gray - L', price: 29.99, inventory: 45, attributes: { color: 'gray', size: 'l' }, image: PRODUCT_IMAGES[1], images: [PRODUCT_IMAGES[1], PRODUCT_IMAGES[13], PRODUCT_IMAGES[14]] },
      { id: 'ts16', sku: 'TS-GR-XL', name: 'Gray - XL', price: 32.99, inventory: 25, attributes: { color: 'gray', size: 'xl' }, image: PRODUCT_IMAGES[1], images: [PRODUCT_IMAGES[1], PRODUCT_IMAGES[13], PRODUCT_IMAGES[14]] },
    ],
    specifications: [
      { name: 'Material', value: '100% Organic Cotton' },
      { name: 'Fit', value: 'Regular Fit' },
      { name: 'Care', value: 'Machine Washable' },
      { name: 'Weight', value: '180 GSM' },
    ],
    richDescription: `
      <h3>Premium Quality You Can Feel</h3>
      <p>Our Premium Cotton T-Shirt is made from 100% organic cotton, providing exceptional comfort and breathability.</p>
      <img src="${PRODUCT_IMAGES[3]}" alt="T-Shirt" />
      <h3>Sustainable Fashion</h3>
      <p>Each shirt is produced using eco-friendly processes and sustainable materials, making it perfect for the environmentally conscious consumer.</p>
    `,
    inventory: 500,
    salesCount: 3200,
    rating: 4.3,
    reviewCount: 234,
    tags: ['cotton', 'organic', 't-shirt', 'casual'],
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-03-15T09:45:00Z',
    relatedProducts: MOCK_PRODUCTS.filter(p => p.category === 'Clothing' && p.id !== '3').slice(0, 4),
  },
  // Fourth product: Denim Jacket with 3 Colors
  {
    id: '14',
    spu: 'SPU-JK-014',
    name: 'Denim Jacket Classic',
    description: 'Classic fit denim jacket with vintage wash. Timeless style for any occasion.',
    price: 79.99,
    currency: 'USD',
    category: 'Clothing',
    images: [
      PRODUCT_IMAGES[4],
      PRODUCT_IMAGES[3],
      PRODUCT_IMAGES[5],
      PRODUCT_IMAGES[6],
    ],
    mainAttribute: {
      name: 'color',
      label: 'Color',
      isMain: true,
      values: [
        { id: 'classic_blue', name: 'Classic Blue', image: PRODUCT_IMAGES[4], inStock: true },
        { id: 'dark_wash', name: 'Dark Wash', image: PRODUCT_IMAGES[3], inStock: true },
        { id: 'light_wash', name: 'Light Wash', image: PRODUCT_IMAGES[5], inStock: true },
      ],
    },
    attributes: [
      {
        name: 'size',
        label: 'Size',
        values: [
          { id: 's', name: 'S', inStock: true },
          { id: 'm', name: 'M', inStock: true },
          { id: 'l', name: 'L', inStock: true },
          { id: 'xl', name: 'XL', inStock: true },
        ],
      },
    ],
    variants: [
      // 3 Colors × 4 Sizes = 12 SKUs - Each color has 3 distinct images
      // Classic Blue variants
      { id: 'jk1', sku: 'JK-CB-S', name: 'Classic Blue - S', price: 79.99, inventory: 20, attributes: { color: 'classic_blue', size: 's' }, image: PRODUCT_IMAGES[4], images: [PRODUCT_IMAGES[4], PRODUCT_IMAGES[7], PRODUCT_IMAGES[8]] },
      { id: 'jk2', sku: 'JK-CB-M', name: 'Classic Blue - M', price: 79.99, inventory: 35, attributes: { color: 'classic_blue', size: 'm' }, image: PRODUCT_IMAGES[4], images: [PRODUCT_IMAGES[4], PRODUCT_IMAGES[7], PRODUCT_IMAGES[8]] },
      { id: 'jk3', sku: 'JK-CB-L', name: 'Classic Blue - L', price: 79.99, inventory: 30, attributes: { color: 'classic_blue', size: 'l' }, image: PRODUCT_IMAGES[4], images: [PRODUCT_IMAGES[4], PRODUCT_IMAGES[7], PRODUCT_IMAGES[8]] },
      { id: 'jk4', sku: 'JK-CB-XL', name: 'Classic Blue - XL', price: 84.99, inventory: 15, attributes: { color: 'classic_blue', size: 'xl' }, image: PRODUCT_IMAGES[4], images: [PRODUCT_IMAGES[4], PRODUCT_IMAGES[7], PRODUCT_IMAGES[8]] },
      // Dark Wash variants
      { id: 'jk5', sku: 'JK-DW-S', name: 'Dark Wash - S', price: 79.99, inventory: 18, attributes: { color: 'dark_wash', size: 's' }, image: PRODUCT_IMAGES[3], images: [PRODUCT_IMAGES[3], PRODUCT_IMAGES[9], PRODUCT_IMAGES[10]] },
      { id: 'jk6', sku: 'JK-DW-M', name: 'Dark Wash - M', price: 79.99, inventory: 28, attributes: { color: 'dark_wash', size: 'm' }, image: PRODUCT_IMAGES[3], images: [PRODUCT_IMAGES[3], PRODUCT_IMAGES[9], PRODUCT_IMAGES[10]] },
      { id: 'jk7', sku: 'JK-DW-L', name: 'Dark Wash - L', price: 79.99, inventory: 25, attributes: { color: 'dark_wash', size: 'l' }, image: PRODUCT_IMAGES[3], images: [PRODUCT_IMAGES[3], PRODUCT_IMAGES[9], PRODUCT_IMAGES[10]] },
      { id: 'jk8', sku: 'JK-DW-XL', name: 'Dark Wash - XL', price: 84.99, inventory: 12, attributes: { color: 'dark_wash', size: 'xl' }, image: PRODUCT_IMAGES[3], images: [PRODUCT_IMAGES[3], PRODUCT_IMAGES[9], PRODUCT_IMAGES[10]] },
      // Light Wash variants
      { id: 'jk9', sku: 'JK-LW-S', name: 'Light Wash - S', price: 79.99, inventory: 15, attributes: { color: 'light_wash', size: 's' }, image: PRODUCT_IMAGES[5], images: [PRODUCT_IMAGES[5], PRODUCT_IMAGES[11], PRODUCT_IMAGES[12]] },
      { id: 'jk10', sku: 'JK-LW-M', name: 'Light Wash - M', price: 79.99, inventory: 22, attributes: { color: 'light_wash', size: 'm' }, image: PRODUCT_IMAGES[5], images: [PRODUCT_IMAGES[5], PRODUCT_IMAGES[11], PRODUCT_IMAGES[12]] },
      { id: 'jk11', sku: 'JK-LW-L', name: 'Light Wash - L', price: 79.99, inventory: 20, attributes: { color: 'light_wash', size: 'l' }, image: PRODUCT_IMAGES[5], images: [PRODUCT_IMAGES[5], PRODUCT_IMAGES[11], PRODUCT_IMAGES[12]] },
      { id: 'jk12', sku: 'JK-LW-XL', name: 'Light Wash - XL', price: 84.99, inventory: 10, attributes: { color: 'light_wash', size: 'xl' }, image: PRODUCT_IMAGES[5], images: [PRODUCT_IMAGES[5], PRODUCT_IMAGES[11], PRODUCT_IMAGES[12]] },
    ],
    specifications: [
      { name: 'Material', value: '100% Cotton Denim' },
      { name: 'Fit', value: 'Classic Fit' },
      { name: 'Closure', value: 'Button Front' },
      { name: 'Pockets', value: '2 Chest, 2 Side' },
    ],
    richDescription: `
      <h3>Timeless Style</h3>
      <p>Our Classic Denim Jacket features a vintage wash that only gets better with time. Perfect for layering in any season.</p>
      <img src="${PRODUCT_IMAGES[4]}" alt="Denim Jacket" />
      <h3>Quality Craftsmanship</h3>
      <p>Made with premium denim and reinforced stitching for durability that lasts.</p>
    `,
    inventory: 180,
    salesCount: 890,
    rating: 4.4,
    reviewCount: 145,
    tags: ['denim', 'jacket', 'vintage', 'classic'],
    createdAt: '2024-01-30T12:30:00Z',
    updatedAt: '2024-03-20T09:00:00Z',
    relatedProducts: MOCK_PRODUCTS.filter(p => p.category === 'Clothing' && p.id !== '14').slice(0, 4),
  },
];

/**
 * Mock product collections
 */
export const MOCK_COLLECTIONS: ProductCollection[] = [
  {
    id: 'c1',
    productId: '1',
    product: MOCK_PRODUCTS[0],
    createdAt: '2024-03-15T10:00:00Z',
  },
  {
    id: 'c2',
    productId: '2',
    product: MOCK_PRODUCTS[1],
    createdAt: '2024-03-18T14:30:00Z',
  },
  {
    id: 'c3',
    productId: '7',
    product: MOCK_PRODUCTS[6],
    createdAt: '2024-03-20T09:15:00Z',
  },
];

/**
 * Mock sourcing requests
 */
export const MOCK_SOURCING_REQUESTS: SourcingRequest[] = [
  {
    id: 'sr1',
    productName: 'Custom Printed T-Shirts',
    description: 'Looking for a supplier for custom printed t-shirts with our company logo. Need various sizes and colors.',
    images: ['/mocks/sourcing/tshirt-sample.jpg'],
    targetPrice: 15,
    quantity: 500,
    status: 'processing',
    createdAt: '2024-03-20T10:00:00Z',
    updatedAt: '2024-03-25T14:30:00Z',
  },
  {
    id: 'sr2',
    productName: 'Smart Home Devices Bundle',
    description: 'Seeking suppliers for smart plugs, smart bulbs, and smart switches for a bundle package.',
    images: ['/mocks/sourcing/smarthome-sample.jpg'],
    targetPrice: 50,
    quantity: 200,
    status: 'pending',
    createdAt: '2024-03-28T08:00:00Z',
    updatedAt: '2024-03-28T08:00:00Z',
  },
];

/**
 * Mock recommended product IDs
 * Products that are recommended by the system for the user
 */
export const MOCK_RECOMMENDED_PRODUCT_IDS = ['2', '7', '5', '11', '6', '12', '13'];

/**
 * Empty product list
 */
export const MOCK_EMPTY_PRODUCTS: Product[] = [];

/**
 * Get mock product by ID
 */
export const getMockProductById = (id: string): Product | undefined => {
  return MOCK_PRODUCTS.find(p => p.id === id);
};

/**
 * Get mock product detail by ID
 */
export const getMockProductDetailById = (id: string): ProductDetail | undefined => {
  return MOCK_PRODUCT_DETAILS.find(p => p.id === id);
};
