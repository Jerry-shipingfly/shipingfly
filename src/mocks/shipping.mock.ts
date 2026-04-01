/**
 * Shipping Module Mock Data
 */

import { ShippingChannel, CountryOption } from '@/types/shipping.types';

/**
 * Simulate network delay
 */
export const simulateDelay = (ms: number = 400): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Available countries for shipping
 */
export const COUNTRIES: CountryOption[] = [
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
];

/**
 * Mock shipping channels for CN to US
 */
const CN_TO_US_CHANNELS: ShippingChannel[] = [
  {
    id: 'yunexpress',
    name: 'YunExpress',
    code: 'YUN',
    deliveryTime: '7-15 days',
    minDays: 7,
    maxDays: 15,
    price: 5.23,
    originalPrice: 6.50,
    isRecommended: true,
    rating: 4.8,
  },
  {
    id: '4px',
    name: '4PX',
    code: '4PX',
    deliveryTime: '8-18 days',
    minDays: 8,
    maxDays: 18,
    price: 4.56,
    rating: 4.5,
  },
  {
    id: 'sf-intl',
    name: 'SF International',
    code: 'SF',
    deliveryTime: '5-10 days',
    minDays: 5,
    maxDays: 10,
    price: 8.99,
    originalPrice: 12.00,
    isRecommended: true,
    rating: 4.9,
  },
  {
    id: 'dhl-ecom',
    name: 'DHL eCommerce',
    code: 'DHL_ECOM',
    deliveryTime: '10-20 days',
    minDays: 10,
    maxDays: 20,
    price: 6.78,
    rating: 4.6,
  },
  {
    id: 'ems',
    name: 'China Post EMS',
    code: 'EMS',
    deliveryTime: '10-25 days',
    minDays: 10,
    maxDays: 25,
    price: 3.45,
    rating: 4.2,
  },
  {
    id: 'epacket',
    name: 'ePacket',
    code: 'EPK',
    deliveryTime: '15-30 days',
    minDays: 15,
    maxDays: 30,
    price: 2.89,
    rating: 4.0,
  },
  {
    id: 'cainiao',
    name: 'Cainiao Super Economy',
    code: 'CNS',
    deliveryTime: '20-40 days',
    minDays: 20,
    maxDays: 40,
    price: 1.99,
    rating: 3.8,
  },
];

/**
 * Mock shipping channels for CN to EU (generic)
 */
const CN_TO_EU_CHANNELS: ShippingChannel[] = [
  {
    id: 'yunexpress-eu',
    name: 'YunExpress',
    code: 'YUN_EU',
    deliveryTime: '8-18 days',
    minDays: 8,
    maxDays: 18,
    price: 6.45,
    originalPrice: 7.80,
    isRecommended: true,
    rating: 4.7,
  },
  {
    id: '4px-eu',
    name: '4PX',
    code: '4PX_EU',
    deliveryTime: '10-22 days',
    minDays: 10,
    maxDays: 22,
    price: 5.89,
    rating: 4.4,
  },
  {
    id: 'sf-intl-eu',
    name: 'SF International',
    code: 'SF_EU',
    deliveryTime: '6-12 days',
    minDays: 6,
    maxDays: 12,
    price: 10.50,
    isRecommended: true,
    rating: 4.8,
  },
  {
    id: 'ems-eu',
    name: 'China Post EMS',
    code: 'EMS_EU',
    deliveryTime: '12-28 days',
    minDays: 12,
    maxDays: 28,
    price: 4.20,
    rating: 4.1,
  },
];

/**
 * Mock shipping channels for CN to Asia
 */
const CN_TO_ASIA_CHANNELS: ShippingChannel[] = [
  {
    id: 'sf-asia',
    name: 'SF Express',
    code: 'SF_ASIA',
    deliveryTime: '3-7 days',
    minDays: 3,
    maxDays: 7,
    price: 3.50,
    isRecommended: true,
    rating: 4.9,
  },
  {
    id: 'yunexpress-asia',
    name: 'YunExpress',
    code: 'YUN_ASIA',
    deliveryTime: '5-10 days',
    minDays: 5,
    maxDays: 10,
    price: 2.80,
    rating: 4.6,
  },
  {
    id: '4px-asia',
    name: '4PX',
    code: '4PX_ASIA',
    deliveryTime: '5-12 days',
    minDays: 5,
    maxDays: 12,
    price: 2.45,
    rating: 4.3,
  },
];

/**
 * Get mock shipping channels based on route
 */
export const getMockShippingChannels = (
  fromCountry: string,
  toCountry: string
): ShippingChannel[] => {
  // For demo, China is always the origin
  if (fromCountry === 'CN') {
    if (toCountry === 'US' || toCountry === 'CA') {
      return CN_TO_US_CHANNELS;
    }
    if (['GB', 'DE', 'FR', 'IT', 'ES', 'NL'].includes(toCountry)) {
      return CN_TO_EU_CHANNELS;
    }
    if (['JP', 'KR', 'SG', 'MY', 'TH', 'VN'].includes(toCountry)) {
      return CN_TO_ASIA_CHANNELS;
    }
  }

  // Default return US channels with slight price adjustment
  return CN_TO_US_CHANNELS.map(channel => ({
    ...channel,
    price: channel.price * 1.1,
    id: `${channel.id}-${toCountry.toLowerCase()}`,
  }));
};
