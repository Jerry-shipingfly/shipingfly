/**
 * Authentication Hook
 * @description Handles user login, registration, logout and other authentication-related features
 */

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { LoginCredentials, RegisterData, AuthUser } from '@/types/auth.types';

/**
 * Authentication state hook return value
 */
export interface UseAuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

/**
 * Authentication actions hook
 */
export interface UseAuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  getCurrentUser: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

/**
 * Authentication Hook
 * @returns Authentication state and action methods
 */
export function useAuth(): UseAuthState & UseAuthActions {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const router = useRouter();

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Login
  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const { user, token } = await authService.login(credentials);
      localStorage.setItem('auth_token', token);
      setUser(user);
      setIsAuthenticated(true);
      router.push('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Register
  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { user, token } = await authService.register(data);
      localStorage.setItem('auth_token', token);
      setUser(user);
      setIsAuthenticated(true);
      router.push('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Logout
  const logout = useCallback(async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('auth_token');
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  }, [router]);

  // Get current user
  const getCurrentUser = useCallback(async () => {
    if (user) return;

    setIsLoading(true);
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Failed to get current user:', err);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Check authentication status
  const checkAuth = useCallback(async () => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('auth_token');
    const authenticated = !!token;

    setIsAuthenticated(authenticated);

    if (authenticated && !user) {
      await getCurrentUser();
    }
  }, [user, getCurrentUser]);

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    clearError,
    getCurrentUser,
    checkAuth,
  };
}
