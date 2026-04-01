/**
 * Dashboard service
 * @description Provides statistics data for the dashboard
 */

import { api } from './api';

/**
 * Stat card data
 */
export interface StatCardData {
  /** Title */
  title: string;
  /** Value */
  value: number | string;
  /** Formatted display value */
  formattedValue: string;
  /** Period-over-period change percentage */
  change?: number;
  /** Change trend */
  trend?: 'up' | 'down' | 'flat';
  /** Icon name */
  icon: string;
}

/**
 * Sales trend data point
 */
export interface SalesTrendPoint {
  /** Date */
  date: string;
  /** Order Quantity */
  orderQuantity: number;
  /** Order Amount */
  orderAmount: number;
  /** Paid Amount */
  paidAmount: number;
}

/**
 * Recent order
 */
export interface RecentOrder {
  id: string;
  orderNumber: string;
  productName: string;
  productImage?: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

/**
 * Top product
 */
export interface TopProduct {
  id: string;
  name: string;
  image?: string;
  price: number;
  currency: string;
  salesCount: number;
  rating?: number;
}

/**
 * Dashboard statistics
 */
export interface DashboardStats {
  stats: StatCardData[];
  salesTrend: SalesTrendPoint[];
  recentOrders: RecentOrder[];
  topProducts: TopProduct[];
}

/**
 * Simulate delay
 */
const simulateDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generate mock sales trend data with detailed fluctuations and upward trend
 * @description Generates sales data with three metrics, featuring:
 * - Overall upward growth trend from start to end
 * - Multiple wave cycles creating distinct peaks and valleys
 * - Weekend dips and weekday surges
 * - Random events causing spikes or drops
 * - Correlated but independent variations across metrics
 * TODO: Connect to real API
 * API Interface: GET /dashboard/sales-trend?days={days}
 * Response: SalesTrendPoint[] with date, orderQuantity, orderAmount, paidAmount fields
 */
function generateSalesTrendData(days: number): SalesTrendPoint[] {
  const data: SalesTrendPoint[] = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - days + 1);

  // Configuration for realistic business patterns
  const config = {
    // Base values at start
    baseQuantity: 25,
    baseAmount: 2800,
    basePaid: 2400,

    // Growth targets at end (upward trend)
    targetQuantity: 75,
    targetAmount: 9500,
    targetPaid: 8200,

    // Wave patterns (multiple overlapping cycles)
    weeklyCycle: { amplitude: 8, frequency: 2 * Math.PI / 7 },      // 7-day cycle
    biWeeklyCycle: { amplitude: 5, frequency: 2 * Math.PI / 14 },  // 14-day cycle
    monthlyCycle: { amplitude: 6, frequency: 2 * Math.PI / 30 },   // 30-day cycle

    // Random event probabilities
    spikeProbability: 0.08,    // 8% chance of a spike
    dropProbability: 0.05,     // 5% chance of a drop

    // Metric-specific variations
    quantityVolatility: 0.15,  // 15% random variation
    amountVolatility: 0.12,    // 12% random variation
    paidVolatility: 0.10,      // 10% random variation
  };

  // Special event days (spikes or drops)
  const specialEvents: Record<number, { type: 'spike' | 'drop'; magnitude: number }> = {};
  for (let i = 0; i < days; i++) {
    const rand = Math.random();
    if (rand < config.spikeProbability) {
      // Random spike: 1.3x to 1.6x multiplier
      specialEvents[i] = { type: 'spike', magnitude: 1.3 + Math.random() * 0.3 };
    } else if (rand > 1 - config.dropProbability) {
      // Random drop: 0.5x to 0.75x multiplier
      specialEvents[i] = { type: 'drop', magnitude: 0.5 + Math.random() * 0.25 };
    }
  }

  // Generate data for each day
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Progress ratio (0 to 1) for overall growth trend
    const progress = i / (days - 1 || 1);

    // Linear growth component
    const linearGrowthQuantity = config.baseQuantity + (config.targetQuantity - config.baseQuantity) * progress;
    const linearGrowthAmount = config.baseAmount + (config.targetAmount - config.baseAmount) * progress;
    const linearGrowthPaid = config.basePaid + (config.targetPaid - config.basePaid) * progress;

    // Wave components (overlapping cycles create complex patterns)
    const weeklyWave = Math.sin(i * config.weeklyCycle.frequency) * config.weeklyCycle.amplitude;
    const biWeeklyWave = Math.sin(i * config.biWeeklyCycle.frequency + Math.PI / 4) * config.biWeeklyCycle.amplitude;
    const monthlyWave = Math.sin(i * config.monthlyCycle.frequency + Math.PI / 2) * config.monthlyCycle.amplitude;

    // Weekend dip effect
    const weekendEffect = isWeekend ? -5 - Math.random() * 3 : 0;

    // Random noise
    const quantityNoise = (Math.random() - 0.5) * 2 * config.quantityVolatility * linearGrowthQuantity;
    const amountNoise = (Math.random() - 0.5) * 2 * config.amountVolatility * linearGrowthAmount;
    const paidNoise = (Math.random() - 0.5) * 2 * config.paidVolatility * linearGrowthPaid;

    // Calculate base values with all effects
    let orderQuantity = Math.round(
      linearGrowthQuantity +
      weeklyWave +
      biWeeklyWave * 0.5 +
      monthlyWave * 0.3 +
      weekendEffect +
      quantityNoise
    );

    let orderAmount = Math.round(
      linearGrowthAmount +
      weeklyWave * 120 +
      biWeeklyWave * 60 +
      monthlyWave * 40 +
      weekendEffect * 100 +
      amountNoise
    );

    // Order amount also affected by quantity (but not perfectly correlated)
    const avgOrderValue = 100 + Math.sin(i * 0.3) * 20 + (Math.random() - 0.5) * 15;
    orderAmount = Math.round(orderAmount * 0.7 + orderQuantity * avgOrderValue * 0.3);

    // Paid amount follows order amount with slight delay and variation
    let paidAmount = Math.round(
      linearGrowthPaid +
      weeklyWave * 100 +
      biWeeklyWave * 50 +
      monthlyWave * 35 +
      weekendEffect * 85 +
      paidNoise
    );
    paidAmount = Math.round(paidAmount * 0.7 + orderQuantity * avgOrderValue * 0.85 * 0.3);

    // Apply special events (spikes or drops)
    const event = specialEvents[i];
    if (event) {
      const eventMultiplier = event.type === 'spike' ? event.magnitude : event.magnitude;
      orderQuantity = Math.round(orderQuantity * eventMultiplier);
      orderAmount = Math.round(orderAmount * eventMultiplier * (0.95 + Math.random() * 0.1));
      paidAmount = Math.round(paidAmount * eventMultiplier * (0.92 + Math.random() * 0.1));
    }

    // Ensure minimum values and realistic ratios
    orderQuantity = Math.max(8, orderQuantity);
    orderAmount = Math.max(800, orderAmount);
    // Paid amount should be 80-98% of order amount
    const minPaid = Math.round(orderAmount * 0.80);
    const maxPaid = Math.round(orderAmount * 0.98);
    paidAmount = Math.max(minPaid, Math.min(maxPaid, paidAmount));

    data.push({
      date: date.toISOString().split('T')[0],
      orderQuantity,
      orderAmount,
      paidAmount,
    });
  }

  return data;
}

/**
 * Generate mock recent orders data (called at runtime to avoid SSR mismatch)
 */
function generateRecentOrders(): RecentOrder[] {
  const now = Date.now();
  return [
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      productName: 'Wireless Bluetooth Earbuds Pro',
      productImage: 'https://picsum.photos/seed/earbuds/100/100',
      amount: 89.99,
      currency: 'USD',
      status: 'delivered',
      createdAt: new Date(now - 1000 * 60 * 30).toISOString(),
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      productName: 'Smart Watch Series X',
      productImage: 'https://picsum.photos/seed/watch/100/100',
      amount: 199.00,
      currency: 'USD',
      status: 'shipped',
      createdAt: new Date(now - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      productName: 'Portable Power Bank 20000mAh',
      productImage: 'https://picsum.photos/seed/powerbank/100/100',
      amount: 45.50,
      currency: 'USD',
      status: 'processing',
      createdAt: new Date(now - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
      id: '4',
      orderNumber: 'ORD-2024-004',
      productName: 'LED Desk Lamp with USB Charger',
      productImage: 'https://picsum.photos/seed/lamp/100/100',
      amount: 35.99,
      currency: 'USD',
      status: 'pending_payment',
      createdAt: new Date(now - 1000 * 60 * 60 * 8).toISOString(),
    },
    {
      id: '5',
      orderNumber: 'ORD-2024-005',
      productName: 'Mechanical Gaming Keyboard RGB',
      productImage: 'https://picsum.photos/seed/keyboard/100/100',
      amount: 79.00,
      currency: 'USD',
      status: 'paid',
      createdAt: new Date(now - 1000 * 60 * 60 * 12).toISOString(),
    },
  ];
}

/**
 * Mock top products data
 */
const MOCK_TOP_PRODUCTS: TopProduct[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Earbuds Pro',
    image: 'https://picsum.photos/seed/earbuds/200/200',
    price: 89.99,
    currency: 'USD',
    salesCount: 1256,
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Smart Watch Series X',
    image: 'https://picsum.photos/seed/watch/200/200',
    price: 199.00,
    currency: 'USD',
    salesCount: 892,
    rating: 4.7,
  },
  {
    id: '3',
    name: 'Portable Power Bank 20000mAh',
    image: 'https://picsum.photos/seed/powerbank/200/200',
    price: 45.50,
    currency: 'USD',
    salesCount: 756,
    rating: 4.6,
  },
  {
    id: '4',
    name: 'Mechanical Gaming Keyboard RGB',
    image: 'https://picsum.photos/seed/keyboard/200/200',
    price: 79.00,
    currency: 'USD',
    salesCount: 634,
    rating: 4.5,
  },
  {
    id: '5',
    name: 'LED Desk Lamp with USB Charger',
    image: 'https://picsum.photos/seed/lamp/200/200',
    price: 35.99,
    currency: 'USD',
    salesCount: 521,
    rating: 4.4,
  },
];

export const dashboardService = {
  /**
   * Get statistics cards
   */
  async getStats(): Promise<StatCardData[]> {
    // TODO: Connect to real API
    // return api.get<StatCardData[]>('/dashboard/stats');

    await simulateDelay(500);

    return [
      {
        title: 'New Orders',
        value: 23,
        formattedValue: '23',
        change: 12.5,
        trend: 'up',
        icon: 'shopping-cart',
      },
      {
        title: 'Pending Payment',
        value: 8,
        formattedValue: '8',
        change: -3.2,
        trend: 'down',
        icon: 'credit-card',
      },
      {
        title: 'Available Balance',
        value: 125680.00,
        formattedValue: '$125,680.00',
        change: 8.3,
        trend: 'up',
        icon: 'wallet',
      },
      {
        title: 'Support Tickets',
        value: 5,
        formattedValue: '5',
        change: -15.0,
        trend: 'down',
        icon: 'ticket',
      },
    ];
  },

  /**
   * Get sales trend data
   */
  async getSalesTrend(days: number = 7): Promise<SalesTrendPoint[]> {
    // TODO: Connect to real API
    // return api.get<SalesTrendPoint[]>(`/dashboard/sales-trend?days=${days}`);

    await simulateDelay(600);
    return generateSalesTrendData(days);
  },

  /**
   * Get recent orders
   */
  async getRecentOrders(limit: number = 5): Promise<RecentOrder[]> {
    // TODO: Connect to real API
    // return api.get<RecentOrder[]>(`/dashboard/recent-orders?limit=${limit}`);

    await simulateDelay(400);
    return generateRecentOrders().slice(0, limit);
  },

  /**
   * Get top products
   */
  async getTopProducts(limit: number = 5): Promise<TopProduct[]> {
    // TODO: Connect to real API
    // return api.get<TopProduct[]>(`/dashboard/top-products?limit=${limit}`);

    await simulateDelay(400);
    return MOCK_TOP_PRODUCTS.slice(0, limit);
  },

  /**
   * Get all dashboard data
   */
  async getDashboardData(trendDays: number = 7): Promise<DashboardStats> {
    const [stats, salesTrend, recentOrders, topProducts] = await Promise.all([
      this.getStats(),
      this.getSalesTrend(trendDays),
      this.getRecentOrders(),
      this.getTopProducts(),
    ]);

    return {
      stats,
      salesTrend,
      recentOrders,
      topProducts,
    };
  },
};

export default dashboardService;
