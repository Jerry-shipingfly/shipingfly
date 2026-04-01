'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/utils/helpers';

/**
 * Authentication layout component Props
 * @description Used for login, register, forgot password, etc. pages
 */
export interface AuthLayoutProps {
  /** Child components (forms, etc.) */
  children: React.ReactNode;
  /** Custom className */
  className?: string;
  /** Page title */
  title?: string;
  /** Page subtitle */
  subtitle?: string;
}

/**
 * Authentication Layout Component
 * @description Used for login, register, forgot password pages
 */
export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  className,
  title,
  subtitle,
}) => {
  return (
    <div
      className={cn(
        'min-h-screen',
        'flex items-center justify-center',
        'p-4 md:p-8',
        className
      )}
      style={{
        background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #f8fafc 100%)',
      }}
    >
      <div
        className={cn(
          'w-full max-w-5xl',
          'flex flex-col md:flex-row',
          'overflow-hidden',
          'bg-white',
          'rounded-2xl'
        )}
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* Left decoration - Hidden on mobile */}
        <div
          className={cn(
            'hidden md:flex',
            'w-1/2 min-h-[450px]',
            'items-center justify-center',
            'p-6'
          )}
          style={{
            background: 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)',
          }}
        >
          {/* Brand content */}
          <div className="flex flex-col items-center justify-center text-white">
            <h2 className="text-3xl font-bold mb-3">HyperZone</h2>
            <p className="text-base text-white/80 text-center">
              Dropshipping Fulfillment Platform
            </p>
          </div>
        </div>

        {/* Right form area */}
        <div
          className={cn(
            'w-full md:w-1/2',
            'flex flex-col',
            'p-6 sm:p-8 md:p-10'
          )}
        >
          {/* Logo */}
          <div className="flex items-center justify-center md:justify-start mb-6">
            <Image
              src="/assets/logo/logo.svg"
              alt="HyperZone Logo"
              width={140}
              height={36}
              priority
            />
            <span className="text-2xl font-bold text-gray-900 md:hidden">
              HyperZone
            </span>
          </div>

          {/* Title area */}
          {(title || subtitle) && (
            <div className="text-center md:text-left mb-6">
              {title && (
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="mt-2 text-gray-500">{subtitle}</p>
              )}
            </div>
          )}

          {/* Form content */}
          <div className="flex-1">
            {children}
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>HyperZone Dropshipping</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
