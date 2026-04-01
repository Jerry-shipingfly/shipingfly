/**
 * Forgot Password Page
 * @description User forgot password page, sends password reset email
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/helpers';

/**
 * Forgot password page component
 */
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Validate email format
   */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Email validation
    if (!email) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      await authService.forgotPassword({ email });
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Success state UI
   */
  if (isSubmitted) {
    return (
      <div className="space-y-6 text-center">
        <div className="py-4">
          {/* Success icon */}
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>

          {/* Title */}
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Check Your Email
          </h2>

          {/* Description */}
          <p className="text-gray-500 mb-2">
            We've sent a password reset link to
          </p>
          <p className="font-medium text-gray-900 mb-4">
            {email}
          </p>

          {/* Tip */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-left">
            <p className="text-sm text-blue-800">
              <strong>💡 Tip:</strong> The reset link will expire in 1 hour. Check your spam folder if you don't see the email.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Back to sign in button */}
          <Link
            href="/login"
            className="block w-full py-2.5 px-4 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors text-center"
          >
            <ArrowLeft className="w-4 h-4 inline-block mr-2" />
            Back to Sign In
          </Link>

          {/* Retry button */}
          <button
            onClick={() => {
              setIsSubmitted(false);
              setEmail('');
              setError(null);
            }}
            className="w-full text-sm text-gray-500 hover:text-gray-700 py-2"
          >
            Didn't receive the email?{' '}
            <span className="font-medium text-primary-600">Try again</span>
          </button>
        </div>
      </div>
    );
  }

  /**
   * Form UI
   */
  return (
    <div className="space-y-6">
      {/* Instructions text */}
      <div className="text-center mb-6">
        <p className="text-gray-500 text-sm">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      {/* Error message */}
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
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
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
                error && !validateEmail(email) && 'border-red-500 focus:ring-red-500'
              )}
            />
          </div>
          {error && !validateEmail(email) && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </div>

        {/* Send button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          loading={isLoading}
          disabled={isLoading || !email}
        >
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </form>

      {/* Sign in link */}
      <p className="text-center text-sm text-gray-500">
        Remember your password?{' '}
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
