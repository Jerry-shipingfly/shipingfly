/**
 * Login Page
 * @description User login page, supports email/password login, remember me, forgot password
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/helpers';

/**
 * Login page component
 */
export default function LoginPage() {
  const { login, isLoading, error, clearError } = useAuth();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Local validation errors
  const [localErrors, setLocalErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  /**
   * Validate email format
   */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Form validation
   */
  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {};

    // Email validation
    if (!email) {
      errors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setLocalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    clearError();
    setLocalErrors({});

    // Local validation
    if (!validateForm()) {
      return;
    }

    try {
      await login({ email, password, rememberMe });
      // Redirect handled automatically by AuthContext after successful login
    } catch (err) {
      // Error handled by AuthContext
      console.error('Login error:', err);
    }
  };

  /**
   * Handle input changes
   */
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (localErrors.email) {
      setLocalErrors({ ...localErrors, email: undefined });
    }
    if (error) clearError();
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (localErrors.password) {
      setLocalErrors({ ...localErrors, password: undefined });
    }
    if (error) clearError();
  };

  return (
    <div className="space-y-6">
      {/* Global error message */}
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email input */}
        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Mail className="w-5 h-5" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              disabled={isLoading}
              required
              className={cn(
                'w-full px-4 py-2.5 pl-10 rounded-lg border',
                'text-gray-900 placeholder-gray-400',
                'bg-white border-gray-300',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
                localErrors.email && 'border-red-500 focus:ring-red-500'
              )}
            />
          </div>
          {localErrors.email && (
            <p className="text-sm text-red-500">{localErrors.email}</p>
          )}
        </div>

        {/* Password input */}
        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Lock className="w-5 h-5" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your password"
              disabled={isLoading}
              required
              className={cn(
                'w-full px-4 py-2.5 pl-10 pr-10 rounded-lg border',
                'text-gray-900 placeholder-gray-400',
                'bg-white border-gray-300',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
                localErrors.password && 'border-red-500 focus:ring-red-500'
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {localErrors.password && (
            <p className="text-sm text-red-500">{localErrors.password}</p>
          )}
        </div>

        {/* Remember me & Forgot password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              disabled={isLoading}
            />
            <span className="text-sm text-gray-600">Remember me</span>
          </label>

          <Link
            href="/forgot-password"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Forgot password?
          </Link>
        </div>

        {/* Login button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          loading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      {/* Register link */}
      <p className="text-center text-sm text-gray-500">
        Don't have an account?{' '}
        <Link
          href="/register"
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Create Account
        </Link>
      </p>
    </div>
  );
}
