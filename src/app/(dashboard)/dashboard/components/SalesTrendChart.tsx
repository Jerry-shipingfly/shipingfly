/**
 * SalesTrendChart component
 * @description Display sales trend data using Recharts with three metrics
 */

'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { cn } from '@/utils/helpers';
import { SalesTrendPoint } from '@/services/dashboard.service';

/**
 * SalesTrendChart Props
 */
export interface SalesTrendChartProps {
  /** Trend data */
  data: SalesTrendPoint[];
  /** Loading state */
  loading?: boolean;
  /** Time range change callback */
  onRangeChange?: (days: number) => void;
  /** Current time range */
  activeRange?: number;
  /** Custom class name */
  className?: string;
}

/**
 * Format date display
 */
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

/**
 * Format currency
 */
const formatCurrency = (value: number) => {
  return `$${value.toLocaleString()}`;
};

/**
 * CustomTooltip component
 */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100">
        <p className="text-sm text-gray-600 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => {
          const nameMap: Record<string, string> = {
            orderQuantity: 'Order Quantity',
            orderAmount: 'Order Amount',
            paidAmount: 'Paid Amount',
          };
          const isCurrency = entry.dataKey !== 'orderQuantity';
          return (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {nameMap[entry.dataKey]}:{' '}
              {isCurrency ? formatCurrency(entry.value) : entry.value}
            </p>
          );
        })}
      </div>
    );
  }
  return null;
};

/**
 * SalesTrendChart component
 * @description Display three metrics: Order Quantity, Order Amount, Paid Amount
 *
 * @example
 * <SalesTrendChart
 *   data={salesData}
 *   activeRange={7}
 *   onRangeChange={handleRangeChange}
 * />
 */
export const SalesTrendChart: React.FC<SalesTrendChartProps> = ({
  data,
  loading = false,
  onRangeChange,
  activeRange = 7,
  className,
}) => {
  // Time range options
  const rangeOptions = [
    { value: 7, label: 'Last 7 days' },
    { value: 30, label: 'Last 30 days' },
  ];

  // Legend formatter
  const legendFormatter = (value: string) => {
    const nameMap: Record<string, string> = {
      orderQuantity: 'Order Quantity',
      orderAmount: 'Order Amount',
      paidAmount: 'Paid Amount',
    };
    return nameMap[value] || value;
  };

  return (
    <div className={cn('bg-white rounded-xl shadow-sm', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Sales Trend</h3>
        {/* Time range toggle buttons */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {rangeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onRangeChange?.(option.value)}
              className={cn(
                'px-3 py-1 text-sm rounded-md transition-colors',
                activeRange === option.value
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart area */}
      <div className="p-6">
        {loading ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-pulse text-gray-400">Loading...</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={false}
              />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `$${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={legendFormatter} />

              {/* Order Amount - Left Y-axis */}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="orderAmount"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#3b82f6' }}
                name="orderAmount"
              />

              {/* Paid Amount - Left Y-axis */}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="paidAmount"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#8b5cf6' }}
                name="paidAmount"
              />

              {/* Order Quantity - Right Y-axis */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="orderQuantity"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#10b981' }}
                name="orderQuantity"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default SalesTrendChart;
