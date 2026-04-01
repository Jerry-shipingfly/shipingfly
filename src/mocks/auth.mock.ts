/**
 * Authentication Module Mock Data
 */

import { AuthUser } from '@/types/auth.types';

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
 * Mock user data
 */
export const MOCK_USERS: AuthUser[] = [
  {
    id: '1',
    email: 'demo@example.com',
    name: 'Demo User',
    avatar: '/assets/images/avatar-demo.jpg',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-03-29T00:00:00Z',
  },
  {
    id: '2',
    email: 'seller@example.com',
    name: 'Seller Zhang',
    avatar: '/assets/images/avatar-demo.jpg',
    role: 'seller',
    createdAt: '2024-02-15T08:30:00Z',
    updatedAt: '2024-03-28T12:00:00Z',
  },
  {
    id: '3',
    email: 'buyer@example.com',
    name: 'Buyer Li',
    avatar: '/assets/images/avatar-demo.jpg',
    role: 'user',
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-25T16:45:00Z',
  },
  {
    id: '4',
    email: 'manager@example.com',
    name: 'Manager Wang',
    avatar: '/assets/images/avatar-demo.jpg',
    role: 'manager',
    createdAt: '2024-01-20T14:20:00Z',
    updatedAt: '2024-03-27T09:30:00Z',
  },
];

/**
 * Mock Token
 */
export const MOCK_TOKEN = 'mock_jwt_token_' + Date.now();

/**
 * Get mock user by email
 */
export const getMockUserByEmail = (email: string): AuthUser | undefined => {
  return MOCK_USERS.find(user => user.email === email);
};

/**
 * Validate mock password
 */
export const validateMockPassword = (password: string): boolean => {
  return password === 'password' || password === 'demo123';
};
