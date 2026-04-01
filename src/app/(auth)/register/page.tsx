/**
 * Register Page
 * @description User registration page, supports email registration, password strength tips, terms of service agreement
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/helpers';

/**
 * Password strength level
 */
type PasswordStrength = 'weak' | 'medium' | 'strong';

/**
 * Register page component
 */
export default function RegisterPage() {
  const { register, isLoading, error, clearError } = useAuth();

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Local validation errors
  const [localErrors, setLocalErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});

  /**
   * Validate email format
   */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Calculate password strength
   */
  const getPasswordStrength = (pwd: string): PasswordStrength => {
    if (pwd.length < 6) return 'weak';

    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) score++;

    if (score <= 1) return 'weak';
    if (score <= 2) return 'medium';
    return 'strong';
  };

  /**
   * Password strength indicator UI
   */
  const PasswordStrengthIndicator = ({ password }: { password: string }) => {
    if (!password) return null;

    const strength = getPasswordStrength(password);
    const strengthConfig = {
      weak: { label: 'Weak', color: 'text-red-500', bg: 'bg-red-500', width: 'w-1/3' },
      medium: { label: 'Medium', color: 'text-yellow-500', bg: 'bg-yellow-500', width: 'w-2/3' },
      strong: { label: 'Strong', color: 'text-green-500', bg: 'bg-green-500', width: 'w-full' },
    };

    const config = strengthConfig[strength];

    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className={`h-full ${config.bg} ${config.width} transition-all duration-300`} />
          </div>
          <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
        </div>
        <ul className="text-xs text-gray-500 space-y-0.5">
          <li className={password.length >= 6 ? 'text-green-600' : ''}>
            {password.length >= 6 ? <CheckCircle className="w-3 h-3 inline mr-1" /> : '○'} At least 6 characters
          </li>
          <li className={/[A-Z]/.test(password) && /[a-z]/.test(password) ? 'text-green-600' : ''}>
            {/[A-Z]/.test(password) && /[a-z]/.test(password) ? <CheckCircle className="w-3 h-3 inline mr-1" /> : '○'} Upper and lowercase letters
          </li>
          <li className={/\d/.test(password) ? 'text-green-600' : ''}>
            {/\d/.test(password) ? <CheckCircle className="w-3 h-3 inline mr-1" /> : '○'} At least one number
          </li>
        </ul>
      </div>
    );
  };

  /**
   * Form validation
   */
  const validateForm = (): boolean => {
    const errors: typeof localErrors = {};

    // Name validation
    if (!name.trim()) {
      errors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

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

    // Confirm password validation
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Terms validation
    if (!agreeTerms) {
      errors.terms = 'You must agree to the terms and conditions';
    }

    setLocalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 清除之前的错误
    clearError();
    setLocalErrors({});

    // Local validation
    if (!validateForm()) {
      return;
    }

    try {
      await register({ name: name.trim(), email, password, confirmPassword });
      // Redirect handled automatically by AuthContext after successful registration
    } catch (err) {
      // Error handled by AuthContext
      console.error('Registration error:', err);
    }
  };

  /**
   * Clear field error
   */
  const clearFieldError = (field: keyof typeof localErrors) => {
    if (localErrors[field]) {
      setLocalErrors({ ...localErrors, [field]: undefined });
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
        {/* Name input */}
        <div className="space-y-1">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <User className="w-5 h-5" />
            </div>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearFieldError('name');
              }}
              placeholder="Enter your full name"
              disabled={isLoading}
              required
              className={cn(
                'w-full px-4 py-2.5 pl-10 rounded-lg border',
                'text-gray-900 placeholder-gray-400',
                'bg-white border-gray-300',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
                localErrors.name && 'border-red-500 focus:ring-red-500'
              )}
            />
          </div>
          {localErrors.name && (
            <p className="text-sm text-red-500">{localErrors.name}</p>
          )}
        </div>

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
              onChange={(e) => {
                setEmail(e.target.value);
                clearFieldError('email');
              }}
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
        <div className="space-y-2">
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
              onChange={(e) => {
                setPassword(e.target.value);
                clearFieldError('password');
              }}
              placeholder="Create a password"
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
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {localErrors.password && (
            <p className="text-sm text-red-500">{localErrors.password}</p>
          )}
          <PasswordStrengthIndicator password={password} />
        </div>

        {/* Confirm password input */}
        <div className="space-y-1">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Lock className="w-5 h-5" />
            </div>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                clearFieldError('confirmPassword');
              }}
              placeholder="Confirm your password"
              disabled={isLoading}
              required
              className={cn(
                'w-full px-4 py-2.5 pl-10 pr-10 rounded-lg border',
                'text-gray-900 placeholder-gray-400',
                'bg-white border-gray-300',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
                localErrors.confirmPassword && 'border-red-500 focus:ring-red-500'
              )}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {localErrors.confirmPassword && (
            <p className="text-sm text-red-500">{localErrors.confirmPassword}</p>
          )}
        </div>

        {/* Terms of service agreement */}
        <div className="space-y-2">
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => {
                setAgreeTerms(e.target.checked);
                if (localErrors.terms) setLocalErrors({ ...localErrors, terms: undefined });
              }}
              className="w-4 h-4 mt-0.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              disabled={isLoading}
            />
            <span className="text-sm text-gray-600">
              I agree to the{' '}
              <Link href="/terms" className="text-primary-600 hover:text-primary-700 font-medium">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">
                Privacy Policy
              </Link>
            </span>
          </label>
          {localErrors.terms && (
            <p className="text-sm text-red-500">{localErrors.terms}</p>
          )}
        </div>

        {/* Register button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          loading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

      {/* Sign in link */}
      <p className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link
          href="/login"
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}
