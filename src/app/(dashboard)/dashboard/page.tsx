/**
 * Dashboard overview page
 * @description Display core business data and trends
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  StatCard,
  SalesTrendChart,
  RecentOrders,
  TopProducts,
} from './components';
import { PageHeader } from '@/components/common/PageHeader';
import { AgentContact } from '@/components/dashboard/AgentContact';
import dashboardService, {
  StatCardData,
  SalesTrendPoint,
  RecentOrder,
  TopProduct,
} from '@/services/dashboard.service';
import { useTranslation } from '@/hooks/useTranslation';

/**
 * Dashboard page component
 */
export default function DashboardPage() {
  const router = useRouter();
  const { t } = useTranslation();

  // State
  const [stats, setStats] = useState<StatCardData[]>([]);
  const [salesTrend, setSalesTrend] = useState<SalesTrendPoint[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [trendDays, setTrendDays] = useState(7);

  // Load data
  useEffect(() => {
    loadDashboardData();
  }, [trendDays]);

  /**
   * Load dashboard data
   */
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const data = await dashboardService.getDashboardData(trendDays);
      setStats(data.stats);
      setSalesTrend(data.salesTrend);
      setRecentOrders(data.recentOrders);
      setTopProducts(data.topProducts);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle trend time range change
   */
  const handleTrendRangeChange = (days: number) => {
    setTrendDays(days);
  };

  /**
   * Get click handler for stat card based on title
   */
  const getStatCardClickHandler = (title: string) => {
    // Map stat card titles (from dashboardService) to routes with optional query params
    // URL uses simplified status: 'pending' maps to 'pending_payment' internally
    const routeMap: Record<string, { path: string; query?: string }> = {
      'Pending Payment': { path: '/orders/store', query: 'status=pending' },
      'Paid Orders': { path: '/orders/store', query: 'status=paid' },
      'Available Balance': { path: '/wallet' },
      'Support Tickets': { path: '/support-tickets' },
    };

    const route = routeMap[title];
    if (route) {
      const fullPath = route.query ? `${route.path}?${route.query}` : route.path;
      return () => router.push(fullPath);
    }
    return undefined;
  };

  return (
    <div className="space-y-6">
      {/* Page header with Agent Contact */}
      <PageHeader
        title={t('dashboard.title')}
        subtitle={t('dashboard.subtitle')}
        actions={<AgentContact />}
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, index) => (
            <StatCard
              key={index}
              title=""
              value=""
              loading
            />
          ))
        ) : (
          stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.formattedValue}
              change={stat.change}
              trend={stat.trend}
              icon={stat.icon}
              onClick={getStatCardClickHandler(stat.title)}
            />
          ))
        )}
      </div>

      {/* Sales trend chart */}
      <SalesTrendChart
        data={salesTrend}
        loading={loading}
        activeRange={trendDays}
        onRangeChange={handleTrendRangeChange}
      />

      {/* Recent orders and top products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <RecentOrders
          orders={recentOrders}
          loading={loading}
          viewAllHref="/orders/store"
        />

        {/* Top products */}
        <TopProducts
          products={topProducts}
          loading={loading}
          viewAllHref="/products/all"
        />
      </div>
    </div>
  );
}
