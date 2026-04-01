/**
 * Client Providers
 * @description Client-side Provider wrapper for wrapping all Context Providers
 */

'use client';

import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { I18nProvider } from '@/contexts/I18nContext';

interface ClientProvidersProps {
  children: React.ReactNode;
}

/**
 * ClientProviders Component
 * @description Unified management of all global Providers
 *
 * @example
 * <ClientProviders>
 *   <App />
 * </ClientProviders>
 */
export const ClientProviders: React.FC<ClientProvidersProps> = ({ children }) => {
  return (
    <I18nProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </I18nProvider>
  );
};

export default ClientProviders;
