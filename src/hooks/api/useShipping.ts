/**
 * Shipping Hook
 * @description Uses SWR to wrap shipping data fetching
 */

import useSWR from 'swr';
import { shippingService } from '@/services/shipping.service';
import { ShippingQueryParams, ShippingEstimate, CountryOption } from '@/types/shipping.types';

/**
 * Get shipping channels hook
 * @param params - Shipping query parameters
 * @returns Shipping channels and status
 */
export function useShippingChannels(params: ShippingQueryParams | null) {
  const { data, error, isLoading, mutate } = useSWR<ShippingEstimate>(
    params ? ['shipping-channels', params.fromCountry, params.toCountry] : null,
    () => shippingService.getShippingChannels(params!),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    channels: data?.channels || [],
    estimate: data,
    isLoading,
    isError: !!error,
    error: error?.message,
    mutate,
  };
}

/**
 * Get countries hook
 * @returns Available countries
 */
export function useCountries() {
  const { data, error, isLoading } = useSWR<CountryOption[]>(
    'shipping-countries',
    () => shippingService.getCountries(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // Cache for 5 minutes
    }
  );

  return {
    countries: data || [],
    isLoading,
    isError: !!error,
    error: error?.message,
  };
}
