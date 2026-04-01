/**
 * Shipping Service
 * @description Handles shipping channel queries and estimates
 */

import { api } from './api';
import { ShippingChannel, ShippingQueryParams, ShippingEstimate, CountryOption } from '@/types/shipping.types';
import {
  COUNTRIES,
  getMockShippingChannels,
} from '@/mocks/shipping.mock';

/**
 * Simulate network delay
 */
const simulateDelay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

export const shippingService = {
  /**
   * Get available shipping channels
   * @param params - Shipping query parameters
   */
  async getShippingChannels(params: ShippingQueryParams): Promise<ShippingEstimate> {
    // TODO: Connect to real API
    // return api.post<ShippingEstimate>('/shipping/channels', params);

    // Mock implementation
    await simulateDelay(500);

    const channels = getMockShippingChannels(params.fromCountry, params.toCountry);

    return {
      channels,
      fromCountry: params.fromCountry,
      toCountry: params.toCountry,
      estimatedWeight: params.weight || 500,
    };
  },

  /**
   * Get available countries for shipping
   */
  async getCountries(): Promise<CountryOption[]> {
    // TODO: Connect to real API
    // return api.get<CountryOption[]>('/shipping/countries');

    // Mock implementation
    await simulateDelay(200);

    return COUNTRIES;
  },

  /**
   * Get single shipping channel details
   */
  async getChannelDetail(channelId: string): Promise<ShippingChannel> {
    // TODO: Connect to real API
    // return api.get<ShippingChannel>(`/shipping/channels/${channelId}`);

    // Mock implementation
    await simulateDelay(300);

    const allChannels = [
      ...getMockShippingChannels('CN', 'US'),
      ...getMockShippingChannels('CN', 'GB'),
      ...getMockShippingChannels('CN', 'JP'),
    ];

    const channel = allChannels.find(c => c.id === channelId);
    if (!channel) {
      throw new Error('Channel not found');
    }

    return channel;
  },
};

export default shippingService;
