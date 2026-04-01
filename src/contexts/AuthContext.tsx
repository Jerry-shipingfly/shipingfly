/**
 * Auth Context
 * @description Global authentication state management
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { AuthUser, LoginCredentials, RegisterData } from '@/types/auth.types';

/**
 * Auth Context value type
 */
interface AuthContextValue {
  /** Current user */
  user: AuthUser | null;
  /** Is authenticated */
  isAuthenticated: boolean;
  /** Is loading */
  isLoading: boolean;
  /** Error message */
  error: string | null;
  /** Login method */
  login: (credentials: LoginCredentials) => Promise<void>;
  /** Register method */
  register: (data: RegisterData) => Promise<void>;
  /** Logout method */
  logout: () => Promise<void>;
  /** Clear error */
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Auth Provider Props
 */
interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Auth Provider Component
 * @description Provides global authentication state and methods
 *
 * @example
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with loading to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Set mounted after hydration to prevent SSR/client mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * Check token validity on initialization (only after mount)
   */
  useEffect(() => {
    // Only run after component is mounted (client-side)
    if (!mounted) return;

    const initAuth = async () => {
      try {
        // Check if token exists locally
        const token = localStorage.getItem('auth_token');
        if (token) {
          // Validate token and get user info
          const { valid, user: currentUser } = await authService.validateToken();
          if (valid && currentUser) {
            setUser(currentUser);
          } else {
            // Token invalid, clear local storage
            localStorage.removeItem('auth_token');
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [mounted]);

  /**
   * Login
   */
  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const { user: loggedInUser, token } = await authService.login(credentials);

      // Save token
      if (typeof window !== 'undefined') {
        if (credentials.rememberMe) {
          localStorage.setItem('auth_token', token);
        } else {
          sessionStorage.setItem('auth_token', token);
        }
        // Also set cookie for middleware authentication
        document.cookie = `auth_token=${token}; path=/; max-age=${credentials.rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24}; SameSite=Strict`;
      }

      setUser(loggedInUser);

      // Redirect to Dashboard
      router.push('/dashboard');
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  /**
   * Register
   */
  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { user: registeredUser, token } = await authService.register(data);

      // Save token
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token);
      }

      setUser(registeredUser);

      // Redirect to Dashboard
      router.push('/dashboard');
    } catch (err: any) {
      const errorMessage = err.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  /**
   * Logout
   */
  const logout = useCallback(async () => {
    setIsLoading(true);

    try {
      await authService.logout();

      // Clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        sessionStorage.removeItem('auth_token');
        // Clear cookie
        document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }

      setUser(null);

      // Redirect to login page
      router.push('/login');
    } catch (err: any) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth Hook
 * @description Used to access authentication state and methods in components
 *
 * @example
 * const { user, isAuthenticated, login, logout } = useAuth();
 */
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default AuthContext;
