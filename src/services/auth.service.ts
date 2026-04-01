/**
 * Authentication Service
 * @description Handles user login, registration, password recovery and other authentication-related features
 */

import { api } from './api';
import { AuthUser, LoginCredentials, RegisterData, ForgotPasswordRequest, ResetPasswordRequest, AuthResponse } from '@/types/auth.types';
import { MOCK_USERS, MOCK_TOKEN, simulateDelay, getMockUserByEmail, validateMockPassword } from '@/mocks/auth.mock';

export const authService = {
  /**
   * User login
   * @current_stage: Returns mock data
   * @future_integration: Replace with real API calls
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // TODO: Integrate with real API
    // return api.post<AuthResponse>('/auth/login', credentials);

    // Mock implementation (current stage)
    await simulateDelay(800);

    const user = getMockUserByEmail(credentials.email);
    if (!user) {
      throw new Error('User not found');
    }

    if (!validateMockPassword(credentials.password)) {
      throw new Error('Invalid email or password');
    }

    return {
      user,
      token: MOCK_TOKEN,
      expiresIn: 86400, // 24 hours
    };
  },

  /**
   * User registration
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    // TODO: Integrate with real API
    // return api.post<AuthResponse>('/auth/register', data);

    // Mock implementation
    await simulateDelay(800);

    // Check if email already exists
    if (getMockUserByEmail(data.email)) {
      throw new Error('Email already registered');
    }

    // Validate password
    if (data.password !== data.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    const newUser: AuthUser = {
      id: String(MOCK_USERS.length + 1),
      email: data.email,
      name: data.name,
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      user: newUser,
      token: 'mock_token_' + Date.now(),
      expiresIn: 86400,
    };
  },

  /**
   * Forgot password
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
    // TODO: Integrate with real API
    // return api.post<{ message: string }>('/auth/forgot-password', data);

    // Mock implementation
    await simulateDelay(600);

    // Simulate checking email existence
    const user = getMockUserByEmail(data.email);
    if (!user) {
      // For security, do not expose whether user exists
      return { message: 'If the email exists, a reset link has been sent' };
    }

    return { message: 'Password reset email sent successfully' };
  },

  /**
   * Reset password
   */
  async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    // TODO: Integrate with real API
    // return api.post<{ message: string }>('/auth/reset-password', data);

    // Mock implementation
    await simulateDelay(600);

    // Validate password
    if (data.password !== data.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    // Simulate token validation
    if (!data.token || data.token.length < 10) {
      throw new Error('Invalid or expired reset token');
    }

    return { message: 'Password reset successfully' };
  },

  /**
   * Logout
   */
  async logout(): Promise<void> {
    // TODO: Integrate with real API
    // return api.post<void>('/auth/logout');

    // Mock implementation
    await simulateDelay(300);

    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  },

  /**
   * Get current user info
   */
  async getCurrentUser(): Promise<AuthUser> {
    // TODO: Integrate with real API
    // return api.get<AuthUser>('/auth/me');

    // Mock implementation
    await simulateDelay(400);

    // Return default user
    return MOCK_USERS[0];
  },

  /**
   * Refresh token
   */
  async refreshToken(): Promise<{ token: string; expiresIn: number }> {
    // TODO: Integrate with real API
    // return api.post<{ token: string; expiresIn: number }>('/auth/refresh');

    // Mock implementation
    await simulateDelay(300);

    return {
      token: 'mock_refreshed_token_' + Date.now(),
      expiresIn: 86400,
    };
  },

  /**
   * Validate token validity
   */
  async validateToken(): Promise<{ valid: boolean; user?: AuthUser }> {
    // TODO: Integrate with real API
    // return api.get<{ valid: boolean; user?: AuthUser }>('/auth/validate');

    // Mock implementation
    await simulateDelay(200);

    // Check if token exists locally
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        return {
          valid: true,
          user: MOCK_USERS[0],
        };
      }
    }

    return { valid: false };
  },
};

export default authService;
