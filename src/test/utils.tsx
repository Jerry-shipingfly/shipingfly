/**
 * Test Utilities
 * @description Custom render function with providers for testing
 */

import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { SWRConfig } from 'swr';

/**
 * All Providers Wrapper
 * Wraps components with necessary providers for testing
 */
interface AllProvidersProps {
  children: React.ReactNode;
}

const AllProviders: React.FC<AllProvidersProps> = ({ children }) => {
  return (
    <SWRConfig
      value={{
        dedupingInterval: 0,
        revalidateOnFocus: false,
        provider: () => new Map(),
      }}
    >
      {children}
    </SWRConfig>
  );
};

/**
 * Custom render function that includes providers
 * @param ui - React element to render
 * @param options - Render options
 */
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options });

// Re-export everything from testing library
export * from '@testing-library/react';

// Override render with custom render
export { customRender as render };
